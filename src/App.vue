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
const returnToSelect = () => {
  isSelect.value = false;
  Funmodel.value = false;
};
</script>

<template>
  <div 
    v-if="!isSelect" 
    class="w-full flex flex-col items-center justify-center space-y-4 h-screen" 
    :style="{ background: 'linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)', backgroundSize: '400% 400%', animation: 'gradientBG 10s ease infinite' }"
  >
    <h1 class="text-xl font-bold">请选择模式</h1>
    <button @click="selectMode(false)" class="px-4 py-2 bg-blue-500 text-white rounded">严肃模式</button>
    <button @click="selectMode(true)" class="px-4 py-2 bg-green-500 text-white rounded">有趣模式</button>
  </div>
  <serious v-if="isSelect && !Funmodel" :onReturn="returnToSelect"></serious>
  <zayu v-if="isSelect && Funmodel" :onReturn="returnToSelect"></zayu>
</template>

<style>

@keyframes gradientBG {
  0% {
    background-position: 100% 0%;
  }
  50% {
    background-position: 300% 100%;
  }
  100% {
    background-position: 100% 0%;
  }
}
</style>
