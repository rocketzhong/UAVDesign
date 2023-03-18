import { reactive, ref } from 'vue'
import { ReceiveType } from '../types';
export function createWebSocket() {
    const sw = new WebSocket('ws://localhost:555');
    createInitialization(sw);
    return sw;
}
export const sw = ref(createWebSocket());

/**
 * 每1秒检测连接状态，开启重连
 */
setInterval(() => {
    if (sw.value.readyState > 1) {
        sw.value = createWebSocket();
    }
}, 1000)

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
        sw.send('浏览器连接上了!');
    }
    sw.onclose = () => {
        console.log('连接关闭！')
    }

    sw.onmessage = (origin: any) => {
        try {
            const data = JSON.parse(origin.data);
            switch (data.type) {
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
                    if (Math.abs(r.thr - receiver.THR) > 10) receiver.THR = r.thr;
                    if (Math.abs(r.yaw - receiver.YAW) > 10) receiver.YAW = r.yaw;
                    if (Math.abs(r.rol - receiver.ROL) > 10) receiver.ROL = r.rol;
                    if (Math.abs(r.pit - receiver.PIT) > 10) receiver.PIT = r.pit;
                }; break
                default: return;
            }
        } catch (error) {
            console.log(error)
        }

    }
}

export const receiver = reactive({
    THR: 1500,
    YAW: 1500,
    ROL: 1500,
    PIT: 1500,
})