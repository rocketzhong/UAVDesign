<template>
    <div class="setting_wrapper pid_setting_wrapper">
        <div class="title">PID设置</div>
        <div>
            <ul class="pid_column">
                <div class="pid_mark"><span>P</span><span>I</span><span>D</span></div>
                <li v-for="(item, index) in pid_list_1" :key="item.initalName">
                    <div class="list_order">{{ index + 1 }}</div>
                    <el-input v-model="item.name" class="pid_name" size="small" />
                    <el-input-number class="pid_number" size="small" v-model="item.p" :min="0" :max="65535"
                        controls-position="right" />
                    <el-input-number class="pid_number" size="small" v-model="item.i" :min="0" :max="65535"
                        controls-position="right" />
                    <el-input-number class="pid_number" size="small" v-model="item.d" :min="0" :max="65535"
                        controls-position="right" />
                </li>
            </ul>
            <ul class="pid_column">
                <div class="pid_mark"><span>P</span><span>I</span><span>D</span></div>
                <li v-for="(item, index) in pid_list_2" :key="item.initalName">
                    <div class="list_order">{{ index + 7 }}</div>
                    <el-input v-model="item.name" class="pid_name" size="small" />
                    <el-input-number class="pid_number" size="small" v-model="item.p" :min="0" :max="65535"
                        controls-position="right" />
                    <el-input-number class="pid_number" size="small" v-model="item.i" :min="0" :max="65535"
                        controls-position="right" />
                    <el-input-number class="pid_number" size="small" v-model="item.d" :min="0" :max="65535"
                        controls-position="right" />
                </li>
            </ul>
            <ul class="pid_column">
                <div class="pid_mark"><span>P</span><span>I</span><span>D</span></div>
                <li v-for="(item, index) in pid_list_3" :key="item.initalName">
                    <div class="list_order">{{ index + 13 }}</div>
                    <el-input v-model="item.name" class="pid_name" size="small" />
                    <el-input-number class="pid_number" size="small" v-model="item.p" :min="0" :max="65535"
                        controls-position="right" />
                    <el-input-number class="pid_number" size="small" v-model="item.i" :min="0" :max="65535"
                        controls-position="right" />
                    <el-input-number class="pid_number" size="small" v-model="item.d" :min="0" :max="65535"
                        controls-position="right" />
                </li>
            </ul>
        </div>

    </div>
    <div class="pid_buttons">
        <el-button size='large' @click="getPID">读取PID</el-button>
        <el-button size='large' @click="sendPID">写入PID</el-button>
        <el-button size='large' @click="setZero">清零</el-button>
        <el-button size='large' @click="saveData">保存</el-button>
        <el-button size='large' @click="recoverData">恢复</el-button>
    </div>
    <div>
        <div class="setting_wrapper flight_modes">
            <div class="title">飞行模式</div>
            <div>
                <div v-for="(aux, index) in flight_modes">
                    <div class="aux_select">
                        <span>AUX{{ index + 1 }}</span><el-slider :max="2" v-model="aux.value" />
                    </div>
                    <div class="aux_select">
                        <span>模式</span>
                        <el-select placeholder="模式1" size="small"></el-select>
                        <el-select placeholder="模式2" size="small"></el-select>
                        <el-select placeholder="模式3" size="small"></el-select>
                    </div>
                </div>

            </div>
        </div>
        <div class="sensor_calibration setting_wrapper ">
            <div class="title">传感器校准</div>
        </div>
        <div class="setting_wrapper else_configurations">
            <div class="title">其他参数</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, toRaw } from 'vue';
import { sw, pid_list_1, pid_list_2, pid_list_3 } from '../sw'

enum FlightMode {
    MODE1 = 0,
    MODE2 = 1,
    MODE3 = 2
}
const o = { value: FlightMode.MODE2 }
const aux1 = reactive(Object.create(o))
const aux2 = reactive(Object.create(o))
const aux3 = reactive(Object.create(o))

const flight_modes: any[] = [aux1, aux2, aux3]

function getPID() {
    sw.value.send(JSON.stringify({
        getPID: true
    }))
}

function sendPID() {
    sw.value.send(JSON.stringify({
        pid1Data: pid_list_1
    }))
    sw.value.send(JSON.stringify({
        pid2Data: pid_list_1
    }))
}

function saveData() {
    sw.value.send(JSON.stringify({
        savePID: true
    }))
    // localStorage.setItem('pidData', JSON.stringify([toRaw(pid_list_1), toRaw(pid_list_2), toRaw(pid_list_3)]))
}

function setZero() {
    ElMessage.warning('清零');
    for (const pid of pid_list_1) {
        pid.p = 0;
        pid.i = 0;
        pid.d = 0;
    }
}

function recoverData() {
    sw.value.send(JSON.stringify({
        restorePID: true
    }))
}
</script>

<style lang="less" scoped>
.setting_wrapper {
    border: 1px solid #000;
    border-radius: 5px;
    margin: 2px;
    margin-top: 10px;

    .title {
        transform: translate(0, -0.6em);
        background-color: #fff;
        display: inline-block;
        margin-left: 10px;
    }

    .pid_mark {
        position: relative;
        // display: inline-block;

        span {
            position: absolute;
            top: -20px;
            font-weight: 600;

            &:nth-child(1) {
                left: 140px;
            }

            &:nth-child(2) {
                left: 230px;
            }

            &:nth-child(3) {
                left: 320px;
            }
        }


    }

    .pid_column {
        display: inline-block;
        width: 33.3%;
        min-width: 380px;

        li {
            list-style: none;
        }
    }

    .pid_name {
        width: 80px;
        text-align: center;
    }

    .pid_number {
        width: 90px;
    }

    .list_order {
        width: 2em;
        text-align: center;
        display: inline-block;
    }

}

.pid_buttons {
    background: rgb(240, 240, 240);
    height: 100px;
    align-items: center;
    display: flex;
    justify-content: space-around;
}

.pid_setting_wrapper {
    min-width: 1200px;
}

.flight_modes {
    width: 40%;
    display: inline-block;

    .aux_select {
        display: flex;
        justify-content: space-around;

        .el-slider {
            width: 70%;
        }

        .el-select {
            width: 25%;
        }
    }
}

.sensor_calibration,
.else_configurations {
    width: 28%;
    display: inline-block;
}
</style>