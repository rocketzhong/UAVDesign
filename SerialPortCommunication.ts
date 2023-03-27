import { SerialPort } from 'serialport'
import {
    isStatus,
    statusParser,
    isPID1,
    PIDParser,
    isRCData,
    ReceiverParser,
    isCheck,
    isSenser,
    senserParser,
    isPOWER,
    POWERParser,
} from './data_transfer';
import { dataBuffer } from './types';
import { WebSocket } from 'ws'

function frameHeaderChecker(data: dataBuffer): boolean {
    if (data.length < 2) return false;
    return data[0] === 0xaa && data[1] === 0xaa;
}

function dataManager(wsConn: WebSocket, arr: number[]) {
    if (isStatus(arr)) {
        const result = statusParser(arr);
        if (result !== '[Error]') wsConn.send(result); 0
    } else if (isSenser(arr)) {
        // 传感器数据
        const result = senserParser(arr);
        if (result !== '[Error]') wsConn.send(result);
    } else if (isRCData(arr)) {
        const result = ReceiverParser(arr);
        if (result !== '[Error]') wsConn.send(result);
    } else if (isPID1(arr)) {
        // PID数据
        const result = PIDParser(arr);
        // console.log(first)
        if (result !== '[Error]') wsConn.send(result);
    } else if (isPOWER(arr)) {
        // 电池数据
        const result = POWERParser(arr);
        if (result !== '[Error]') wsConn.send(result);
    } else if (isCheck(arr)) {
        // console.log('check!:', data)
    } else {
        return arr;
    }
}

export class SerialPortConnection {
    sp: SerialPort;
    bufferCache: number[];
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
        this.sp.on('close', this.spCloseHandler);
        this.bufferCache = [];
    }
    onMessage(wsConn: WebSocket, callback?: Function) {
        const fn = (data: dataBuffer) => {
            // data转数组:
            let arr = [...data];
            const errorData = [];
            while (this.bufferCache.length > 1 && !frameHeaderChecker(this.bufferCache)) {
                const k = this.bufferCache.shift();
                errorData.push(k);
            }
            if (errorData.length > 0) console.warn('误码:', errorData);
            if (this.bufferCache.length !== 0) {
                const k = this.bufferCache;
                if (k.length > 4 && k.length >= (k[3] + 5)) {
                    const concatData = k.splice(0, k[3] + 5);
                    dataManager(wsConn, concatData);
                }
            }
            if (frameHeaderChecker(arr)) {
                if (arr.length > 4 && arr.length === (arr[3] + 5)) {
                    // 长度一次通过
                    const res = dataManager(wsConn, arr);
                    if (res !== undefined) {
                        console.warn('误码', Buffer.from(arr));
                    }
                } else {
                    this.bufferCache.push(...arr);
                }
                return;
            } else {
                if (this.bufferCache.length !== 0 || arr[0] === 0xaa) this.bufferCache.push(...arr);
                else console.warn('丢帧!', data);
            }
        }
        this.sp.on('data', fn);
        if (callback) callback()
    }
    spOpenHandler = (err: Error | null) => {
        console.log('sp.IsOpen:', this.sp?.isOpen || false);
        if (err) {
            console.log("打开串口COM3错误:" + err);
        } else {
            console.log("打开串口成功！")
        }
    }
    //错误监听
    spErrorHandler(error: Error) {
        console.log('error: ' + error)
    }
    spCloseHandler(msg: string) {
        console.log('连接已关闭：', msg)
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
    close = () => {
        this.sp.close()
    }
}