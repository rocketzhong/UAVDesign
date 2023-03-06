import { SerialPort } from 'serialport'
import { isStatus, statusParser, isPID1, PIDParser } from './data_transfer';
import { dataBuffer } from './types';
import { WebSocket } from 'ws'




/**
 *@param bufferStr :需要传递的命令，字符串格式
 * */
// const sendCommand = (bufferStr: string) => {
//     const theBuffer = Buffer.from(bufferStr, "hex");
//     sp.write(theBuffer, function (error: Error) {
//         //指令下发
//         if (error) {
//             console.log("发送错误" + error)
//         } else {
//             console.log("自动下发的命令：" + bufferStr);
//         }
//     })
// };

/**
* @param autoData | String  :延时发送的命令
* */
// let delaySend = (autoData) => {
//     if (autoData != '') {
//         setTimeout(() => {
//             console.log("延时下发的命令：" + autoData);
//             sendCommand(autoData);
//         }, 3000);
//         //如果是预冲量达到就发送预冲结束,进入准备中
//         if (autoData == '5AA503700E1300917E') {
//             setTimeout(() => {
//                 console.log("延时下发的命令：" + autoSendCommand(autoData));
//                 sendCommand(autoSendCommand(autoData));
//             }, 6000);
//             //接着发送准备完成
//             setTimeout(() => {
//                 console.log("延时下发的命令：" + '5AA503700E21009F7E');
//                 sendCommand('5AA503700E21009F7E');
//             }, 11000);
//         }
//     }
// }



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
            if (this.bufferStore.length < 3) return;
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
                console.log(this.bufferStore);
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