<template>
  <div
    class="p-6 text-white min-h-screen flex flex-col items-center green-table"
  >
    <h1 class="text-4xl font-bold mb-8 text-center">21点游戏</h1>

    <!-- 玩家人数设置界面 -->
    <div
      v-if="!game.gameStarted && !game.playerCountConfirmed"
      class="w-full max-w-md space-y-6"
    >
      <div>
        <label for="playerCount" class="block mb-2 text-lg"
          >输入玩家人数：</label
        >
        <input
          id="playerCount"
          v-model.number="game.playerCount"
          type="number"
          min="1"
          class="p-3 rounded bg-gray-800 text-white w-full"
        />
      </div>
      <button
        @click="confirmPlayerCount"
        class="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 w-full"
      >
        确认人数
      </button>
    </div>

    <!-- 玩家姓名设置界面 -->
    <div
      v-if="!game.gameStarted && game.playerCountConfirmed"
      class="w-full max-w-md space-y-6"
    >
      <div
        v-for="(_, index) in game.playerNames"
        :key="index"
        class="space-y-2"
      >
        <label :for="'player-' + index" class="block text-lg"
          >玩家 {{ index + 1 }} 名字：</label
        >
        <input
          :id="'player-' + index"
          v-model="game.playerNames[index]"
          type="text"
          class="p-3 rounded bg-gray-800 text-white w-full"
        />
      </div>
      <button
        @click="game.startGame()"
        class="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 w-full"
      >
        开始游戏
      </button>
    </div>

    <!-- 游戏进行界面 -->
    <div
      v-else-if="game.gameStarted"
      class="w-full max-w-4xl space-y-8"
    >
      <!-- 实时排行榜 -->
      <div
        class=" top-0 left-0 bg-gray-800 rounded text-white p-10 mt-0 xl:m-5 relative xl:fixed"
      >
        <h2 class="text-xl font-bold mb-4">==排行榜==</h2>
        <ul>
          <li
            v-for="(player, index) in game.players
              .slice()
              .sort((a, b) => b.score - a.score)"
            :key="index"
          >
            {{ player.name }}: {{ player.score }} 分
          </li>
        </ul>
      </div>
      <div class="flex flex-col justify-center gap-6 ">
        <!-- 庄家信息 -->
        <div class="bg-gray-800 p-6 rounded text-white">
          <h2 class="text-2xl font-bold mb-4">庄家</h2>
          <div class="flex justify-between items-center">
            <div>
                <p v-if="game.gameOver">牌: {{ game.dealer.hand.join(", ") }}</p>
                <p v-else>牌: {{ game.dealer.hand[0] }}, [隐藏]</p>
            </div>
          </div>
        </div>

        <!-- 玩家信息 -->
        <div
          v-for="(player, index) in game.players"
          :key="index"
          class="bg-gray-800 p-6 rounded text-white"
        >
          <h2 class="text-2xl font-bold mb-4">玩家 {{ player.name }}</h2>
          <div class="flex justify-between items-center">
            <div>
              <p>牌: {{ player.hand.join(", ") }}</p>
              <p>总点数: {{ game.calculateScore(player.hand) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏结束按钮 -->
    <div v-if="!game.gameOver" class="mt-6 flex gap-4">
      <button
        @click="game.playerAction(game.currentPlayerIndex, 'hit')"
        class="bg-red-600 px-6 py-3 rounded hover:bg-red-700 w-full"
      >
        要牌
      </button>
      <button
        @click="game.playerAction(game.currentPlayerIndex, 'stand')"
        class="bg-gray-600 px-6 py-3 rounded hover:bg-gray-700 w-full"
      >
        停牌
      </button>
    </div>

      <!-- 游戏结果 -->
      <div v-if="game.gameOver" class="mt-6 bg-gray-800 p-6 rounded text-white">
        <h2 class="text-2xl font-bold mb-4">游戏结束</h2>
        <p>{{ game.winnerMessage }}</p>
        <button
          @click="game.resetGame()"
          class="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 w-full mt-4"
        >
          重置游戏
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { BlackjackGame } from "../cor/main";

const game = reactive(new BlackjackGame());

function confirmPlayerCount() {
  game.playerNames = Array.from({ length: game.playerCount }, () => "");
  game.playerCountConfirmed = true;
}
</script>

<style>
.green-table {
  background-color: #228b22;
  background-image: radial-gradient(circle, #006400 10%, #228b22 90%);
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
