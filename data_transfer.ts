import { dataBuffer, ReceiveType } from "./types";
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
// 输入无符号数，转为有符号数
const toInt16 = (number: number): number => {
    return (number <= 32767) ? number : number - 65536
}

// 输入无符号数，转为有符号数
const toInt32 = (number: number): number => {
    return (number <= 2147483647) ? number : number - 4294967296
}

export const [isVer,
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


export function createMessage(data: any, type: ReceiveType) {
    const result = { data, type }
    return JSON.stringify(result)
}

export function statusParser(data: dataBuffer): string {
    const len = data[3];
    if (data[4 + len] === undefined) return '[Error] Content is Less';
    const status = {
        ROL: toInt16((data[4] << 8) + data[5]) / 100, // int16, 横滚角
        PIT: toInt16((data[6] << 8) + data[7]) / 100, // int16, 横滚角
        YAW: toInt16((data[8] << 8) + data[9]) / 100, // int16, 偏航角
        ALT_USE: toInt32((data[10] << 24) + (data[11] << 16) + (data[12] << 8) + data[13]), // int32 高度cm
        FLY_MODEL: data[14], // uint8
        ARMED: data[15], // uint8 0加锁 1解锁
    }
    return createMessage(status, ReceiveType.Status);
}

/**
 * 地面站接收，飞控发送
 * 
 * @export
 * @param {number[]} data
 * @param {number} length
 */
export function groundStationReceive(data: dataBuffer, length: number) {

}