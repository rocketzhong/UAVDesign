<template>
    <div style="display: flex;">
        <div style="width: 50%;">
                <div>ACC_X {{ senserData.ACC_X }}</div>
                <div>ACC_Y {{ senserData.ACC_Y }}</div>
                <div>ACC_Z {{ senserData.ACC_Z }}</div>
                <div>GYR_X {{ senserData.GYRO_X }}</div>
                <div>GYR_Y {{ senserData.GYRO_Y }}</div>
                <div>GYR_Z {{ senserData.GYRO_Z }}</div>
                <div>MAG_X {{ senserData.MAG_X }}</div>
                <div>MAG_Y {{ senserData.MAG_Y }}</div>
                <div>MAG_Z {{ senserData.MAG_Z }}</div>
        </div>
        <div>
            <div>电压 {{ senserData.Voltage }}V</div>
            <div>电流 {{ senserData.Current }}A</div>
        </div>  
    </div>
    
</template>

<script setup lang="ts">
import { senserData } from '../sw';
</script>

<style scoped>

</style>