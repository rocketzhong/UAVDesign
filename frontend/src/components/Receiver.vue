<template>
  <div>
    THR <el-progress :percentage="thr" :format="() => receiver.THR" />
    YAW <el-progress :percentage="yaw" :format="() => receiver.YAW" />
    ROL <el-progress :percentage="rol" :format="() => receiver.ROL" />
    PIT <el-progress :percentage="pit" :format="() => receiver.PIT" />
  </div>
</template>

<script setup lang="ts">
import { receiver } from '../sw'
import { computed } from 'vue'
function percentParser(num: number) {
  const result = (num - 990) / 10;
  if (result < 1) return 1;
  else if (result > 99) return 99;
  else return result;
}
const thr = computed(() => percentParser(receiver.THR))
const yaw = computed(() => percentParser(receiver.YAW))
const rol = computed(() => percentParser(receiver.ROL))
const pit = computed(() => percentParser(receiver.PIT))
</script>

<style>
.el-progress-bar__inner {
  transition: none;
}
</style>