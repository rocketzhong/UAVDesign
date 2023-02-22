const express = require('express');
const router = express.Router();
const { SerialPort } = require('serialport');

const sp = new SerialPort({
    //波特率，可在设备管理器中对应端口的属性中查看
    path: 'COM3',
    baudRate: 115200,
    dataBits: 8,
    autoOpen: false,
});
//连接串口后进行写入指令操作
sp.open((err) => {
    console.log('sp.IsOpen:', sp.isOpen);
    if (err) {
        console.log("打开端口COM3错误:" + err);
    } else {
        console.log("打开端口成功！")
    }
});

//#region ：指令监听
/**
 * 指令监听
 * @see count         :接收到数据的次数
 * @see sendTime      :接收到数据的时间
 * @see reciveData    :接收到数据的核验字符（大写），一组数据的开头是'5AA5'并且结尾是'7E'
 * @see reciveArr     :接收到数据的总结，存储在数组中
 * @param data        :SerialPort的函数自带返回数据
 * */
let count = 0;
let sendTime = Date.now();
let reciveData = '';
let reciveArr = [];
sp.on('data', (data) => {
    // @TODO 接受到数据时，进行处理，展示到页面上
    // data
});
//#endregion

//错误监听
sp.on('error', (error) => {
    console.log('error: ' + error)
});

router.route('/').get((req, res, header) => {
    res.end('hello world!')
})

/**
 * 接收到网页传递过来的命令，下发过去
 * */
router.route('/send1').post((req, res) => {
    let theBuffer = new Buffer(req.body.command, "hex");
    sp.write(theBuffer, function(error) {
        //指令下发
        if (error) {
            console.log("发送错误" + error)
        } else {
            console.log("需要下发的命令：" + req.body.command);
            res.json({
                result: 1
            });
        }
    })
});

/**
 *@param bufferStr :需要传递的命令，字符串格式
 * */
const sendCommand = (bufferStr) => {
    const theBuffer = new Buffer(bufferStr, "hex");
    sp.write(theBuffer, function(error) {
        //指令下发
        if (error) {
            console.log("发送错误" + error)
        } else {
            console.log("自动下发的命令：" + bufferStr);
        }
    })
};

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

module.exports = router;