import { SerialPortConnection } from './SerialPortCommunication'
import { SerialPort } from 'serialport'

import { WebSocketServer, WebSocket } from 'ws'
import { createMessage, createPID1 } from './data_transfer';
import { ReceiveType, SendType } from './types';

const server = new WebSocketServer({ port: 555 });
let spConn: SerialPortConnection | null = null;

server.on('connection', function (wsConn: WebSocket) {
    console.log("WebSocket创建新连接");

    SerialPort.list().then((list) => {
        wsConn.send(createMessage(list.map(i => i.path), SendType.SPList))
    })
    // 实时给浏览器发送串口开启状态
    const timer = setInterval(() => {
        wsConn.send(createMessage(spConn && spConn.isOpen(), ReceiveType.SPIsOpen))
    }, 200)
    spConn?.onMessage(wsConn)
    wsConn.on('message', function message(buffer) {
        // 地面站后台收到浏览器指令数据data
        // 串口发送至飞控
        if ('spConn' in buffer) {
            // if (!spConn || !spConn.isOpen()) spConn = new SerialPortConnection();
            return;
        }
        if (!spConn || !spConn.isOpen()) spConn = new SerialPortConnection();
        try {
            buffer = JSON.parse(buffer.toString());
        } catch (e) {
        }
        if ('pidData' in buffer) {
            spConn.send(createPID1(buffer.pidData as any));
        } else if ('getPID' in buffer) {
            spConn.send([0xaa, 0xaf, 0x02, 0x01, 0x01, 0x5d]);
        }
    });

    wsConn.on("close", function (code: string, reason: string) {
        clearInterval(timer);
        console.log("Connection closed", code, reason)
    })
    wsConn.on('error', console.error);
    wsConn.send(`{"type":"_WebSocket__OPEN","data":"WebSocket 开启连接"}`);
});
