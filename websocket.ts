import { SerialPortConnection } from './SerialPortCommunication'
import { SerialPort } from 'serialport'

import { WebSocketServer, WebSocket } from 'ws'
import { createMessage, createPID1, createPID2, ackValue } from './data_transfer';
import { ReceiveType, SendType } from './types';

const server = new WebSocketServer({ port: 555 });
let spConn: SerialPortConnection | null = null;

server.on('connection', function (wsConn: WebSocket) {
    console.log("WebSocket连接成功!");
    SerialPort.list().then((list) => {
        wsConn.send(createMessage(list.map(i => i.path), SendType.SPList))
    })
    // 实时给浏览器发送串口开启状态
    const timer = setInterval(() => {
        wsConn.send(createMessage(spConn !== null && spConn.isOpen(), ReceiveType.SPIsOpen))
    }, 200)
    spConn?.onMessage(wsConn)
    wsConn.on('message', function message(buffer) {
        // 地面站后台收到浏览器指令数据data
        // 串口发送至飞控
        try {
            buffer = JSON.parse(buffer.toString());
        } catch (e) {
            return;
        }
        if ('spConn' in buffer) {
            // 重启连接
            if (buffer.spConn) {
                if (!spConn || !spConn.isOpen()) spConn = new SerialPortConnection();
                spConn?.onMessage(wsConn)
            } else {
                if (spConn?.isOpen()) spConn.close();
            }
            return;
        }
        if (!spConn || !spConn.isOpen()) spConn = new SerialPortConnection();

        if ('pid1Data' in buffer) {
            // 写入PID
            const PID1 = createPID1((buffer as any).pid1Data);
            const sum = PID1[22];
            let count = 0;
            const t = setInterval(() => {
                count++;
                if (sum === ackValue.value) {
                    // 发送成功
                    wsConn.send(createMessage({ success: true, msg: '写入PID1成功!' }, ReceiveType.SendPIDMessage))
                    clearInterval(t);
                    ackValue.value = NaN;
                    return;
                }
                if (count > 5) {
                    // 发送失败
                    wsConn.send(createMessage({ success: false, msg: '写入PID1超时，失败!' }, ReceiveType.SendPIDMessage))
                    clearInterval(t);
                    ackValue.value = NaN;
                    return;
                }
                spConn?.send(PID1);
            }, 500)
        } else if ('pid2Data' in buffer) {
            // 写入PID
            const PID2 = createPID2((buffer as any).pid2Data);
            console.log('PID2', PID2)
            const sum = PID2[22];
            let count = 0;
            setTimeout(() => {
                const t = setInterval(() => {
                    count++;
                    if (sum === ackValue.value) {
                        // 发送成功
                        wsConn.send(createMessage({ success: true, msg: '写入PID2成功!' }, ReceiveType.SendPIDMessage))
                        clearInterval(t);
                        ackValue.value = NaN;
                        return;
                    }
                    if (count > 5) {
                        // 发送失败
                        wsConn.send(createMessage({ success: false, msg: '写入PID2超时，失败!' }, ReceiveType.SendPIDMessage))
                        clearInterval(t);
                        ackValue.value = NaN;
                        return;
                    }
                    spConn?.send(PID2);
                }, 500)
            }, 500 * 5)

        } else if ('getPID' in buffer) {
            // 指令获取PID1
            spConn.send([0xaa, 0xaf, 0x02, 0x01, 0x01, 0x5d]);
        } else if ('savePID' in buffer) {
            // 保存
            let count = 0;
            const t = setInterval(() => {
                count++;
                if (0xFE === ackValue.value) {
                    // 发送成功
                    wsConn.send(createMessage({ success: true, msg: '保存成功!' }, ReceiveType.SendPIDMessage))
                    clearInterval(t);
                    ackValue.value = NaN; return;
                }
                if (count > 5) {
                    // 发送失败
                    wsConn.send(createMessage({ success: false, msg: '保存超时，失败!' }, ReceiveType.SendPIDMessage))
                    clearInterval(t);
                    ackValue.value = NaN; return;
                }
                spConn?.send([0xaa, 0xaf, 0x02, 0x01, 0xA2, 0xFE]);
            }, 500)
        } else if ('restorePID' in buffer) {
            // 恢复
            spConn.send([0xaa, 0xaf, 0x02, 0x01, 0xA3, 0xFF]);
        }
    });

    wsConn.on("close", function (code: string, reason: string) {
        clearInterval(timer);
        console.log("Connection closed", code, reason)
    })
    wsConn.on('error', console.error);
    wsConn.send(`{"type":"_WebSocket__OPEN","data":"WebSocket 开启连接"}`);
});
