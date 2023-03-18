<template>
    <div>
       THR <el-progress :percentage="thr" :format="(e) => receiver.THR"/>
       YAW <el-progress :percentage="yaw" :format="(e) => receiver.YAW" />
       ROL <el-progress :percentage="rol" :format="(e) => receiver.ROL" />
       PIT <el-progress :percentage="pit" :format="(e) => receiver.PIT" />
    </div>
</template>

<script setup lang="ts">
import { receiver } from '../sw'
import { computed } from 'vue'
function percentParser(num){
  const result = (num-980) / 10;
  if(result < 1) return 1;
  else if(result > 99) return 99;
  else return result;
}
const thr = computed(() => percentParser(receiver.THR))
const yaw = computed(() => percentParser(receiver.YAW))
const rol = computed(() => percentParser(receiver.ROL))
const pit = computed(() => percentParser(receiver.PIT))
</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
</style>