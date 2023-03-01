import { SerialPortConnection } from './SerialPortCommunication'
import { SerialPort } from 'serialport'

import { WebSocketServer, WebSocket } from 'ws'
import { createMessage } from './data_transfer';
import { SendType } from './types';

const server = new WebSocketServer({ port: 555 });

server.on('connection', function (wsConn: WebSocket) {
    console.log("WebSocket创建新连接")
    let spConn = new SerialPortConnection();
    SerialPort.list().then((list) => {
        wsConn.send(createMessage(list.map(i => i.path), SendType.SPList))
    })
    spConn.onMessage(wsConn)
    wsConn.on('message', function message(data) {
        // 地面站后台收到浏览器指令数据data
        // 串口发送至飞控
        // if(spConn.isOpen)
        console.log('received: %s', data);
        if (typeof data === 'string') {
            spConn.send(data);
        }
    });

    wsConn.on("close", function (code: string, reason: string) {
        console.log("Connection closed", code, reason)
    })
    wsConn.on('error', console.error);
    wsConn.send('something');
});
