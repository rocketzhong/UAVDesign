import { SerialPortConnection } from './SerialPortCommunication'
import { SerialPort } from 'serialport'

import { WebSocketServer, WebSocket } from 'ws'
import { createMessage, createPID1 } from './data_transfer';
import { SendType } from './types';

const server = new WebSocketServer({ port: 555 });
let spConn = new SerialPortConnection();
setInterval(() => {
    if (!spConn || !spConn.isOpen()) spConn = new SerialPortConnection();
}, 1000)
server.on('connection', function (wsConn: WebSocket) {
    console.log("WebSocket创建新连接");

    SerialPort.list().then((list) => {
        wsConn.send(createMessage(list.map(i => i.path), SendType.SPList))
    })
    if (!spConn || !spConn.isOpen()) spConn = new SerialPortConnection();
    spConn.onMessage(wsConn)
    wsConn.on('message', function message(buffer) {
        // 地面站后台收到浏览器指令数据data
        // 串口发送至飞控
        // if(spConn.isOpen)
        // console.log('received: %s', buffer);
        try {
            buffer = JSON.parse(buffer.toString());
            console.log(buffer)
        } catch (e) {
        }
        if ('pidData' in buffer) {
            spConn.send(createPID1(buffer.pidData as any));
        }
    });

    wsConn.on("close", function (code: string, reason: string) {
        console.log("Connection closed", code, reason)
    })
    wsConn.on('error', console.error);
    wsConn.send(`{"type":"_WebSocket__OPEN","data":"WebSocket 开启连接"}`);
});
