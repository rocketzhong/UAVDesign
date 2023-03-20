<template>
    <div>
        <header>无人机地面站</header>
        <div>
            <el-button type="primary" @click="$router.replace('/status')">飞控状态</el-button>
            <el-button type="primary" @click="$router.replace('/setting')">飞控控制</el-button>
            <el-button type="primary" @click="changeSp"> {{ SPIsOpen ? '串口关闭' : '串口打开' }}</el-button>
            端口：
            <el-select v-model="port">
                <el-option v-for="p in comports" :value="p" :label="p"></el-option>
            </el-select>
            波特率：
            <el-select v-model="BaudRate">
                <el-option :value="1200" :label="1200"></el-option>
                <el-option :value="4800" :label="4800"></el-option>
                <el-option :value="9600" :label="9600"></el-option>
                <el-option :value="38400" :label="38400"></el-option>
                <el-option :value="115200" :label="115200"></el-option>
                <el-option :value="256000" :label="256000"></el-option>
                <el-option :value="500000" :label="500000"></el-option>
            </el-select>
        </div>
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { sw, createWebSocket, SPIsOpen, changeSp } from './sw';
/**
 * 每1秒检测websocket连接状态，开启重连
 */
setInterval(() => {
    if (sw.value.readyState > 1) {
        sw.value = createWebSocket();
    }
}, 1000)
const BaudRate = ref(500000);
const port = ref('COM3');
const comports = reactive(['COM3'])
</script>

<style lang="less">
* {
    margin: 0;
    padding: 0;
}

header {
    background-color: rgb(0, 138, 251);
    padding: 2px;
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
    font-weight: 600;
    font-size: 20px;
    color: #fff;
}
</style>