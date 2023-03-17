import { dataBuffer, ReceiveType, SendType } from "./types";
/**
 * 计算sum验证
 * @param {dataBuffer} data
 * @return {*} 
 */
function getSum(data: dataBuffer, len: number) {
    // 数组求和
    let sum = 0;
    len--;
    for (let i = 0; i < len; i++)
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
    isCheck
]: ((data: dataBuffer) => boolean)[] = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x09, 0x0A, 0x0B,
    0x10,
    0x11,
    0x12,
    0x13,
    0x14,
    0x15,
    0xEF
].map((code) => {
    /**
     * 通过判定功能字判定类型，返回对应类型的判断函数
     *
     * @param {number[]} data
     * @return {boolean} 
     */
    const judgeType = (data: dataBuffer): boolean => {
        return (data[0] === 0xAA
            && data[1] === 0xAA
            && data[2] === code)
    }
    return judgeType
})

export function createMessage(data: any, type: ReceiveType | SendType) {
    const result = { data, type }
    return JSON.stringify(result)
}

export function statusParser(data: number[]): string | { notCompleted: true } {
    const len = data[3];
    if (data[4 + len] !== getSum(data, 5 + len))
        return { notCompleted: true };
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


export function PIDParser(data: dataBuffer): string {
    const pid_data = {
        PID1_P: toInt16((data[4] << 8) + data[5]),
        PID1_I: toInt16((data[6] << 8) + data[7]),
        PID1_D: toInt16((data[8] << 8) + data[9]),
        PID2_P: toInt16((data[10] << 8) + data[11]),
        PID2_I: toInt16((data[12] << 8) + data[13]),
        PID2_D: toInt16((data[14] << 8) + data[15]),
        PID3_P: toInt16((data[16] << 8) + data[17]),
        PID3_I: toInt16((data[18] << 8) + data[19]),
        PID3_D: toInt16((data[20] << 8) + data[21]),
    }
    return createMessage(pid_data, ReceiveType.PID1);
}

export function createPID1(data: any[]) {
    const data_len = 18;
    const result = [0xaa, 0xaf, 10, data_len]
    // PID1
    result[4] = Math.floor(data[0].p / 256);
    result[5] = data[0].p % 256
    result[6] = Math.floor(data[0].i / 256);
    result[7] = data[0].i % 256
    result[8] = Math.floor(data[0].d / 256);
    result[9] = data[0].d % 256
    // PID2
    result[10] = Math.floor(data[0].p / 256);
    result[11] = data[1].p % 256
    result[12] = Math.floor(data[0].i / 256);
    result[13] = data[1].i % 256
    result[14] = Math.floor(data[0].d / 256);
    result[15] = data[1].d % 256
    // PID3
    result[16] = Math.floor(data[0].p / 256);
    result[17] = data[2].p % 256
    result[18] = Math.floor(data[0].i / 256);
    result[19] = data[2].i % 256
    result[20] = Math.floor(data[0].d / 256);
    result[21] = data[2].d % 256
    result[22] = getSum(result, 5 + data_len)
    return result
}