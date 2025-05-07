<script lang="ts" setup>
import serious from './components/serious.vue';
import zayu from './components/zayu.vue';
import { ref } from 'vue';

const Funmodel = ref(false); // 是否为有趣模式
const isSelect = ref(false); // 是否已选择模式

const selectMode = (mode: boolean) => {
  Funmodel.value = mode;
  isSelect.value = true;
};
</script>

<template>
  <div 
    v-if="!isSelect" 
    class="w-full flex flex-col items-center justify-center space-y-4 h-screen" 
    :style="{ background: 'linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb)', backgroundSize: '400% 400%', animation: 'gradientBG 5s ease infinite' }"
  >
    <h1 class="text-xl font-bold">请选择模式</h1>
    <button @click="selectMode(false)" class="px-4 py-2 bg-blue-500 text-white rounded">严肃模式</button>
    <button @click="selectMode(true)" class="px-4 py-2 bg-green-500 text-white rounded">有趣模式</button>
  </div>
  <serious v-if="isSelect && !Funmodel"></serious>
  <zayu v-if="isSelect && Funmodel"></zayu>
</template>
