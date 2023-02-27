import { connection } from "./SerialPortCommunication"

const ws = require('nodejs-websocket')

ws.createServer(function (conn: any) {
    console.log("创建新连接")

    conn.on("text", function (data: string) {
        const result = JSON.parse(data)
        connection.send(result);
    })

    conn.on("error", function (err: Error) {
        console.log(err);
    })

    conn.on("close", function (code: string, reason: string) {
        console.log("Connection closed", code, reason)
    })
}).listen(555)
