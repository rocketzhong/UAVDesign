<template>
    <div>
        <Model3d />
    </div>
    <div class="plane_status_wrapper">
        <div class="plane_status">
            <div class="title">飞控状态</div>
            <FlightControlStatus />
        </div>
        <div class="plane_status">
            <div class="title">状态波形</div>
            <Waves/>
        </div>
        <div class="plane_status">
            <div class="title">接收机</div>
            <Receiver></Receiver>
        </div>
        <div class="plane_status">
            <div class="title">传感器数据</div>
        </div>
        <div class="plane_status">
            <div class="title">GPS信息</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Model3d from '../components/model3d.vue'
import FlightControlStatus from '../components/FligntControlStatus.vue'
import Waves from '../components/Waves.vue'
import Receiver from '../components/Receiver.vue'
</script>

<style lang="less" scoped>
.plane_status_wrapper {
    display: flex;
    justify-content: space-between;
}

.plane_status {
    border: 1px solid #000;
    border-radius: 5px;
    margin: 2px;
    margin-top: 5px;
    width: calc(100% / 11 * 2);

    &:nth-child(1) {
        width: calc(100% / 11 * 3);
    }

    .title {
        transform: translate(0, -0.6em);
        background-color: #fff;
        display: inline-block;
        margin-left: 10px;
    }
}
</style>