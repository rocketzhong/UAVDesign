import { reactive, ref, watch } from 'vue'
import { ReceiveType } from '../types';
export function createWebSocket() {
    const sw = new WebSocket('ws://192.168.195.1:555');
    createInitialization(sw);
    return sw;
}
export const sw = ref(createWebSocket());

export const planeStatus = reactive({
    ALT_USE: 0,
    PIT: 0,
    ROL: 0,
    YAW: 0,
    FLY_MODEL: 0,
    ARMED: 0
})

function createInitialization(sw: WebSocket) {
    sw.onopen = () => {
        console.log('连接成功!')
        // sw.send('浏览器连接上了!');
    }
    sw.onclose = () => {
        console.log('连接关闭！')
    }

    sw.onmessage = (origin: any) => {
        try {
            const data = JSON.parse(origin.data);
            switch (data.type) {
                case ReceiveType.SPIsOpen: {
                    const isOpen = data.data
                    if (typeof isOpen === 'boolean') SPIsOpen.value = isOpen;
                }; break;
                case ReceiveType.Status: {
                    const status = data.data;
                    planeStatus.ROL = status?.ROL;
                    planeStatus.PIT = status?.PIT;
                    planeStatus.YAW = status?.YAW;
                    planeStatus.ALT_USE = status?.ALT_USE / 100;
                    planeStatus.FLY_MODEL = status?.FLY_MODEL;
                    planeStatus.ARMED = status?.ARMED;
                }; break;
                case ReceiveType.RCDATA: {
                    const r = data.data;
                    // 去除不合理部分
                    if (r.thr < 980 || r.yaw < 980 || r.rol < 980 || r.pit < 980) return;
                    // 防抖
                    if (Math.abs(r.thr - receiver.THR) > 10) receiver.THR = r.thr;
                    if (Math.abs(r.yaw - receiver.YAW) > 10) receiver.YAW = r.yaw;
                    if (Math.abs(r.rol - receiver.ROL) > 10) receiver.ROL = r.rol;
                    if (Math.abs(r.pit - receiver.PIT) > 10) receiver.PIT = r.pit;
                }; break;
                case ReceiveType.Senser: {
                    const r = data.data;
                    senserData.ACC_X = r?.ACC[0];
                    senserData.ACC_Y = r?.ACC[1];
                    senserData.ACC_Z = r?.ACC[2];
                    senserData.GYRO_X = r?.GYRO[0];
                    senserData.GYRO_Y = r?.GYRO[1];
                    senserData.GYRO_Z = r?.GYRO[2];
                    senserData.MAG_X = r?.MAG[0];
                    senserData.MAG_Y = r?.MAG[1];
                    senserData.MAG_Z = r?.MAG[2];
                }; break;
                case ReceiveType.PIDList: {
                    const r = data.data;
                    switch (r[9]) {
                        case 0x10: {
                            // PID1
                            for (let i = 0; i < 3; i++) {
                                pid_list_1[i].p = r?.[i * 3];
                                pid_list_1[i].i = r?.[i * 3 + 1];
                                pid_list_1[i].d = r?.[i * 3 + 2];
                            }
                        }; break;
                        case 0x11: {
                            // PID2
                            for (let i = 0; i < 3; i++) {
                                pid_list_1[i + 3].p = r?.[i * 3];
                                pid_list_1[i + 3].i = r?.[i * 3 + 1];
                                pid_list_1[i + 3].d = r?.[i * 3 + 2];
                            }
                        }; break;
                        default: {
                            console.log(r[9])
                            return;
                        }
                    }
                }; break;
                case ReceiveType.POWER: {
                    const r = data.data;
                    if (r.voltage === null || typeof r.voltage !== 'number') {
                        console.log(r)
                        return;
                    }
                    senserData.Current = r?.current / 100;
                    senserData.Voltage = r?.voltage / 100;
                }; break;
                default: return;
            }
        } catch (error) {
            console.log(error)
        }

    }
}

export const receiver = reactive({
    THR: 1018,
    YAW: 1473,
    ROL: 1501,
    PIT: 1499,
})

export const senserData = reactive({
    ACC_X: 0,
    ACC_Y: 0,
    ACC_Z: 0,
    GYRO_X: 0,
    GYRO_Y: 0,
    GYRO_Z: 0,
    MAG_X: 0,
    MAG_Y: 0,
    MAG_Z: 0,
    Voltage: 0,
    Current: 0
})

const mapper = (name: string) => { return { name: name, initalName: name, p: 0, i: 0, d: 0, } }
const init_names_1 = ['ROL速率', 'PIT速率', 'YAW速率', '自稳ROL', '自稳PIT', '自稳YAW']
const init_names_2 = ['高度速率', '高度保持', '位置速率', '位置保持', 'PID11', 'PID12']
const init_names_3 = ['PID13', 'PID14', 'PID15', 'PID16', 'PID17', 'PID18']
export const pid_list_1 = reactive(init_names_1.map(mapper))
export const pid_list_2 = reactive(init_names_2.map(mapper))
export const pid_list_3 = reactive(init_names_3.map(mapper))


export const SPIsOpen = ref(false);
watch(SPIsOpen, (newVal, oldVal) => {
    if (newVal === oldVal) return;
    if (newVal) ElMessage.success('成功连接!')
    else ElMessage.warning('断开连接!');
})
export const changeSp = () => {
    sw.value.send(JSON.stringify({
        spConn: !SPIsOpen.value
    }))
}