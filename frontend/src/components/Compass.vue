<template>
    <span>
        <div class="circle_wrapper">
            <div class="campass_wrapper">
                <img class="campass_img circle_item" src="../../assets/R-C.jpg" :style="{
                    transform: 'Rotate(' + planeStatus.YAW + 'deg)'
                }">
            </div>
            <div class="protractor_wrapper">
                <img class="campass_img circle_item" src="../../assets/protractor-223-hi.png" :style="{
                    transform: 'Rotate(' + (90 + planeStatus.ROL) + 'deg)'
                }">
            </div>
            <div class="vertical_ruler_wrapper">
                <img src="../../assets/R.jpg" :style="{
                    transform: 'translateY(' + (-620 + planeStatus.PIT / 90 * 770) + 'px) rotate(' + planeStatus.ROL + 'deg)',
                        transformOrigin: 'center ' + ((90 - planeStatus.PIT) / 180 * 100) + '%'
                }">
            </div>
        </div>
    </span>
</template>

<script setup lang="ts">
import { planeStatus } from '../sw'
</script>

<style lang="less" scoped>
.circle_wrapper {
    width: 400px;
    height: 400px;
    margin-left: 50px;
    display: inline-block;
    border-radius: 200px;
    position: relative;
}

.campass_img {
    width: 400px;
    height: 400px;
}

.circle_item {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: center 50%;
}

.campass_wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    height: 200px;
    overflow: hidden;
}

.protractor_wrapper {
    position: absolute;
    top: 200px;
    left: 0;
    width: 400px;
    height: 200px;
    overflow: hidden;

    img {
        top: -200px;
        transform: rotate(90deg);
    }
}

.vertical_ruler_wrapper {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 150px;
    top: 50px;
    left: 50px;
    z-index: 11;
    overflow: hidden;

    // 宽度保持300px
    // 此时高度为1539px
    img {
        width: 100%;
        // transform: translateY(-620px) rotate(0deg);
        // 60度
        transform: translateY(-110px) rotate(20deg);
        transform-origin: center 17%;
    }
}
</style>