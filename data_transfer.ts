import { dataBuffer } from "./types";
import { connection } from './SerialPortCommunication'
/**
 * 计算sum验证
 * @param {dataBuffer} data
 * @return {*} 
 */
function getSum(data: dataBuffer) {
    // 数组求和
    let sum = 0;
    for (let i = 0; i < data.length; i++)
        sum += data[i];
    return sum % (1 << 8);
}

const [isVer,
    isStatus,
    isSenser,
    isRCData,
    isGPSData,
    isPOWER,
    isMOTO,
    isSenser2,
    isParameterSet,
    isFlyMode,
    isSpeed,
    isPID1,
    isPID2,
    isPID3,
    isPID4,
    isPID5,
    isPID6,
]: ((data: dataBuffer) => boolean)[] = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x09, 0x0A, 0x0B,
    0x10,
    0x11,
    0x12,
    0x13,
    0x14,
    0x15,
].map((code) => {
    /**
     * 通过判定功能字判定类型，返回对应类型的判断函数
     *
     * @param {dataBuffer} data
     * @return {boolean} 
     */
    const judgeType = (data: dataBuffer): boolean => {
        return (data[0] === 0xAA
            && data[1] === 0xAA
            && data[2] === code)
    }
    return judgeType
})

function statusParser(data: dataBuffer): Object {
    const status = {
        ROL: 0
    }

    return status;
}

/**
 * 地面站接收，飞控发送
 * 
 * @export
 * @param {number[]} data
 * @param {number} length
 */
export function groundStationReceive(data: dataBuffer, length: number) {
    if (isStatus(data)) {
        const result = statusParser(data);
        // connection.send(result);
    }
}