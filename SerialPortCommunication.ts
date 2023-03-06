import { SerialPort } from 'serialport'
import { isStatus, statusParser, isPID1, PIDParser } from './data_transfer';
import { dataBuffer } from './types';
import { WebSocket } from 'ws'

export class SerialPortConnection {
    sp: SerialPort;
    isOpen = () => {
        return this.sp.isOpen;
    };
    bufferStore: number[] = [];
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
        const fn = (data: Buffer) => {
            this.bufferStore.push(...data);

            // 清除误码信息
            while (this.bufferStore.length > 1 &&
                !(this.bufferStore[0] === 0xAA
                    && this.bufferStore[1] === 0xAA)) {
                this.bufferStore.shift();
            }
            while (this.bufferStore.length > 2 && this.bufferStore[2] > 100) { this.bufferStore.shift() };
            if (this.bufferStore.length < 5) return;
            if (isStatus(this.bufferStore)) {
                const result = statusParser(this.bufferStore);
                if (typeof result === 'object') {
                    // notCompleted: return出去，将下一帧放入
                    return;
                } else {
                    wsConn.send(result);
                    const len = this.bufferStore[3];
                    this.bufferStore = this.bufferStore.slice(5 + len);
                }
            } else if (isPID1(this.bufferStore)) {

            } else {
                // 误码
                console.log('误码', this.bufferStore);
                this.bufferStore.length = 0;
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
    send = (bufferStr: string) => {
        // 地面站/遥控器发送，飞控接收
        const theBuffer = Buffer.from(bufferStr, "hex");
        this.sp.write(theBuffer, function (error: Error | null | undefined) {
            //指令下发
            if (error) {
                console.log("发送错误" + error)
            } else {
                console.log("自动下发的命令：" + bufferStr);
            }
        })
    }
}