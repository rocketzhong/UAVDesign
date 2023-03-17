import { SerialPort } from 'serialport'
import { isStatus, statusParser, isPID1, PIDParser, isCheck } from './data_transfer';
import { dataBuffer } from './types';
import { WebSocket } from 'ws'

export class SerialPortConnection {
    sp: SerialPort;
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
    }
    onMessage(wsConn: WebSocket, callback?: Function) {
        const fn = (data: dataBuffer) => {
            if (isStatus(data)) {
                const result = statusParser(data);
                if (typeof result === 'object') {
                    // notCompleted: return出去，将下一帧放入
                    return;
                } else {
                    wsConn.send(result);
                }
            } else if (isPID1(data)) {

            } else if (isCheck(data)) {
                console.log(data)
            } else {
                // 丢帧误码
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
        this.sp.write(buf.toString('hex'), function (error: Error | null | undefined) {
            //指令下发
            if (error) {
                console.log("发送错误" + error)
            } else {
                console.log("主动下发的命令：" + buf.toString('hex'));
            }
        })
    }
}