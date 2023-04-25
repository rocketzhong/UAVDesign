import { dataBuffer, ReceiveType, SendType } from "./types";
/**
 * 计算sum验证校验位
 * @param {dataBuffer} data
 * @return {number} 校验位计算结果
 */
export function getSum(data: dataBuffer, len: number): number {
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

export function statusParser(data: dataBuffer): string {
    const len = data[3];
    // 检验失败，丢帧
    if (data[4 + len] !== getSum(data, 5 + len))
        return '[Error]';
    const status = {
        ROL: toInt16((data[4] << 8) + data[5]) / 100, // int16, 横滚角
        PIT: toInt16((data[6] << 8) + data[7]) / 100, // int16, 横滚角
        YAW: toInt16((data[8] << 8) + data[9]) / 100, // int16, 偏航角
        // int32 高度cm
        ALT_USE: toInt32((data[10] << 24) + (data[11] << 16) + (data[12] << 8) + data[13]),
        FLY_MODEL: data[14], // uint8
        ARMED: data[15], // uint8 0加锁 1解锁
    }
    return createMessage(status, ReceiveType.Status);
}


export function PIDParser(data: dataBuffer): string {
    // 校验
    const len = data[3];
    if (data[4 + len] !== getSum(data, 5 + len))
        return '[Error]';
    const pid_data = [
        toInt16((data[4] << 8) + data[5]),
        toInt16((data[6] << 8) + data[7]),
        toInt16((data[8] << 8) + data[9]),
        toInt16((data[10] << 8) + data[11]),
        toInt16((data[12] << 8) + data[13]),
        toInt16((data[14] << 8) + data[15]),
        toInt16((data[16] << 8) + data[17]),
        toInt16((data[18] << 8) + data[19]),
        toInt16((data[20] << 8) + data[21]),
        data[2]
    ]

    return createMessage(pid_data, ReceiveType.PIDList);
}

export function ReceiverParser(data: dataBuffer): string {
    const len = data[3];
    if (data[4 + len] !== getSum(data, 5 + len))
        return '[Error]';
    const result = {
        thr: (data[4] << 8) + data[5],
        yaw: (data[6] << 8) + data[7],
        rol: (data[8] << 8) + data[9],
        pit: (data[10] << 8) + data[11],
    }
    return createMessage(result, ReceiveType.RCDATA);
}

export function createPID1(data: any[]): number[] {
    const data_len = 18;
    const result = [0xaa, 0xaf, 0x10, data_len]
    // PID1（ROL速率）
    result[4] = Math.floor(data[0].p / 256);
    result[5] = data[0].p % 256
    result[6] = Math.floor(data[0].i / 256);
    result[7] = data[0].i % 256
    result[8] = Math.floor(data[0].d / 256);
    result[9] = data[0].d % 256
    // PID2（PIT速率）
    result[10] = Math.floor(data[1].p / 256);
    result[11] = data[1].p % 256
    result[12] = Math.floor(data[1].i / 256);
    result[13] = data[1].i % 256
    result[14] = Math.floor(data[1].d / 256);
    result[15] = data[1].d % 256
    // PID3（YAW速率）
    result[16] = Math.floor(data[2].p / 256);
    result[17] = data[2].p % 256
    result[18] = Math.floor(data[2].i / 256);
    result[19] = data[2].i % 256
    result[20] = Math.floor(data[2].d / 256);
    result[21] = data[2].d % 256
    result[22] = getSum(result, 5 + data_len)
    return result
}

export function createPID2(data: any[]): number[] {
    console.log(data)
    const data_len = 18;
    const result = [0xaa, 0xaf, 0x11, data_len]
    //  自稳ROL
    result[4] = Math.floor(data[3].p / 256);
    result[5] = data[3].p % 256
    result[6] = Math.floor(data[3].i / 256);
    result[7] = data[3].i % 256
    result[8] = Math.floor(data[3].d / 256);
    result[9] = data[3].d % 256
    // 自稳PIT
    result[10] = Math.floor(data[4].p / 256);
    result[11] = data[4].p % 256
    result[12] = Math.floor(data[4].i / 256);
    result[13] = data[4].i % 256
    result[14] = Math.floor(data[4].d / 256);
    result[15] = data[4].d % 256
    // 自稳YAW
    result[16] = Math.floor(data[5].p / 256);
    result[17] = data[5].p % 256
    result[18] = Math.floor(data[5].i / 256);
    result[19] = data[5].i % 256
    result[20] = Math.floor(data[5].d / 256);
    result[21] = data[5].d % 256
    result[22] = getSum(result, 5 + data_len)
    return result
}


export function POWERParser(data: dataBuffer) {
    if (data.length < 9) return '[Error]'
    // 电池信息转换
    const power_data = {
        voltage: (data[4] << 8) + data[5],
        current: (data[6] << 8) + data[7],
    }
    return createMessage(power_data, ReceiveType.POWER);
}

export function senserParser(data: dataBuffer): string {
    if (data.length < 23) return '[Error]'
    const result = {
        ACC: [toInt16((data[4] << 8) + data[5]),
        toInt16((data[6] << 8) + data[7]),
        toInt16((data[8] << 8) + data[9])],
        GYRO: [toInt16((data[10] << 8) + data[11]),
        toInt16((data[12] << 8) + data[13]),
        toInt16((data[14] << 8) + data[15])],
        MAG: [toInt16((data[16] << 8) + data[17]),
        toInt16((data[18] << 8) + data[19]),
        toInt16((data[20] << 8) + data[21])],
    }
    return createMessage(result, ReceiveType.Senser);

}

export const ackValue: { value: number } = { value: NaN };