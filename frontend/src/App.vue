<template>
    <div>
        <header>无人机地面站</header>
        <div>
            <el-button type="primary" @click="$router.replace('/status')">飞控状态</el-button>
            <el-button type="primary" @click="$router.replace('/setting')">飞控控制</el-button>
        </div>
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script lang="ts" setup>
import './sw';
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