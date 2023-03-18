import { SerialPort } from 'serialport'
import {
    isStatus,
    statusParser,
    isPID1,
    PIDParser,
    isRCData,
    isCheck,
    isSenser,
    isPOWER,
    POWERParser
} from './data_transfer';
import { dataBuffer } from './types';
import { WebSocket } from 'ws'

function frameHeaderChecker(data: dataBuffer): boolean {
    if (data.length < 2) return false;
    return data[0] === 0xaa && data[1] === 0xaa;
}

export class SerialPortConnection {
    sp: SerialPort;
    fragmentCache: dataBuffer;
    isOpen = () => {
        return this.sp.isOpen;
    };
    constructor(options?: any) {
        this.sp = new SerialPort({
            path: 'COM3',
            baudRate: 500000,
            dataBits: 8,
            autoOpen: false,
            ...options
        });
        this.sp.open(this.spOpenHandler);
        this.sp.on('error', this.spErrorHandler);
        this.fragmentCache = [];
    }
    onMessage(wsConn: WebSocket, callback?: Function) {
        const fn = (data: dataBuffer) => {
            // console.log('收到', data);
            // data转数组:
            let arr = [...data];
            if (arr.length < 3 || frameHeaderChecker(arr)) {
                // 帧头无误
                if (arr.length < 3 || arr.length < (5 + arr[3])) {
                    this.fragmentCache.push(...data);
                    return;
                } else if (arr.length > (5 + arr[3])) {
                    this.fragmentCache.length = 0;
                    return
                }
                // 若长度符合则开始处理
            } else if (this.fragmentCache.length === 0) { // 缓存不存在
                // 丢帧
                console.log('误码:', data);
                return
            } else {
                // 缓存存在
                if (this.fragmentCache.length !== 0) arr.unshift(...this.fragmentCache);
                if (arr.length < (5 + arr[3])) {
                    this.fragmentCache.length = 0;
                    this.fragmentCache.push(...arr);
                    return;
                }
                // 暂时
                return
            }
            // 清空缓存
            this.fragmentCache.length = 0;
            if (isStatus(arr)) {
                const result = statusParser(arr);
                if (result !== '[Error]') wsConn.send(result);
            } else if (isSenser(arr)) {
                // 传感器数据
            } else if (isRCData(data)) {

            } else if (isPID1(arr)) {
                // PID数据
            } else if (isPOWER(arr)) {
                // 电池数据
                const result = POWERParser(arr);
                if (result !== '[Error]') wsConn.send(result);
            } else if (isCheck(arr)) {
                console.log('check!:', data)
            } else {
                // 丢帧误码
                console.log('丢帧误码', data)
            }
        }
        this.sp.on('data', fn);
        if (callback) callback()
    }
    spOpenHandler = (err: Error | null) => {
        console.log('sp.IsOpen:', this.sp?.isOpen || false);
        if (err) {
            console.clear();
            console.log("打开串口COM3错误:" + err);
        } else {
            console.log("打开串口成功！")
        }
    }
    //错误监听
    spErrorHandler(error: Error) {
        console.log('error: ' + error)
    }
    send = (bufferStr: number[]) => {
        // 地面站/遥控器发送，飞控接收
        const buf = Buffer.from(bufferStr)
        this.sp.write(buf, function (error: Error | null | undefined) {
            //指令下发
            if (error) {
                console.log("发送错误" + error)
            } else {
                console.log("主动下发的命令：" + buf.toString('hex'));
            }
        })
    }
}