<template>
    <div
        class="text-black h-screen flex flex-col items-center overflow-hidden bg-[url('../assets/image/bg.png')] w-full relative "
    >
        <p v-if="game.players.length > 0" class="text-2xl font-bold mb-8 mt-4 text-center">
            当前玩家：{{ game.players[game.currentPlayerIndex]?game.players[game.currentPlayerIndex].name:"" }}
        </p>

        <!-- 磨砂感幕布 -->
        <div
            v-if="!game.gameStarted"
            class="absolute inset-0  bg-opacity-50 backdrop-blur-md z-5"
        ></div>
        <!-- 玩家人数设置界面 -->
        <div
            v-if="!game.gameStarted && !game.playerCountConfirmed"
            class="w-70 max-w-md space-y-6 bg-amber-50 p-5 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        >
            <div>
                <label for="playerCount" class="block mb-2 text-lg text-black"
                    >输入玩家人数：</label
                >
                <input
                    id="playerCount"
                    v-model.number="game.playerCount"
                    type="number"
                    min="1"
                    class="p-3 rounded-2xl border-black border-2 text-black w-full"
                />
            </div>
            <button
                @click="confirmPlayerCount"
                class="bg-blue-600 px-6 py-3 rounded-2xl hover:bg-blue-700 w-full"
            >
                确认人数
            </button>
        </div>

        <!-- 玩家姓名设置界面 -->
        <div
            v-if="!game.gameStarted && game.playerCountConfirmed"
            class="w-60 max-w-md space-y-6 bg-amber-50 p-5 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[70vh] overflow-auto scrollbar-hide z-10"
        >
            <div
                v-for="(name, index) in game.playerNames"
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
                    class="p-3 rounded-2xl border-2 border-black w-full"
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
            class="w-full max-w-4xl space-y-8 relative h-screen overflow-hidden"
        ></div>

        <img
            src="../assets/image/people.png"
            alt=""
            class="absolute bottom-65 h-70 md:h-100 md:bottom-55 animate-shake"
        />
        <!-- 牌桌 -->
        <div
            class="green-table w-[120vw] h-150 rounded-[50%] flex items-center justify-center absolute m-0 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-30 overflow-hidden"
            style="transform: perspective(800px) rotateX(50deg)"
        >   
            <!-- 庄家手牌 -->
            <div
                class="flex space-x-2 absolute top-25"
                style="transform: rotate(180deg)"
            >
                <div
                    v-for="(card, index) in game.dealer.hand"
                    :key="index"
                    class="p-7 bg-white rounded shadow text-center text-black text-3xl"
                >
                    {{ card }}
                </div>
            </div>

            <!-- 玩家信息 -->
            <div class="flex max-w-[90vw] overflow-x-auto transform translate-y-10">
                <div
                    v-for="(player, index) in game.players"
                    :key="index"
                    class="border-2 p-6 rounded text-white"
                >
                    <h2 class="text-2xl font-bold mb-4">玩家 {{ player.name }}</h2>
                    <div class="flex justify-between items-center">
                        <div class="flex space-x-2">
                            <div
                                v-for="(card, cardIndex) in player.hand"
                                :key="cardIndex"
                                class="p-7 bg-white rounded shadow text-center text-black text-3xl"
                            >
                                {{ card }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 游戏结束按钮 -->
        <div
            v-if="!game.gameOver"
            class="mt-6 flex gap-4 absolute bottom-1 left-1/2 transform -translate-x-1/2"
        >
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
        <div
            v-if="game.gameOver"
            class="mt-6 p-6 rounded shadow-2xl w-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-center"
        >
            <h2 class="text-2xl font-bold mb-4">游戏结束</h2>
            <p v-for="i in game.players">
                玩家{{ i.name }} 你{{ i.busted ? "输了" : "赢了" }}
            </p>
            <button
                @click="game.resetGame()"
                class="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 w-full mt-4"
            >
                再来一次
            </button>
        </div>
    </div>

    <!-- 实时排行榜 -->
    <div
        class="absolute p-5 top-2 left-2 bg-green-800 rounded-2xl text-white w-50 overflow-auto "
    >
        <h2 class="text-xl font-bold mb-4">排行榜</h2>
        <ul>
            <li
                v-for="(player, index) in game.players
                    .slice()
                    .sort((a, b) => b.score - a.score)"
                :key="index"
            >
                {{ player.name }}: {{ player.score }} 分
                <span v-if="player.score > 21" class="text-red-500">(爆牌)</span>
            </li>
        </ul>
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
@keyframes animate-shake {
    0% {
        transform: translate(0, 0) rotate(0deg);
    }
    25% {
        transform: translate(-10px, 10px) rotate(-5deg);
    }
    50% {
        transform: translate(10px, -10px) rotate(5deg);
    }
    75% {
        transform: translate(-10px, 10px) rotate(-5deg);
    }
    100% {
        transform: translate(0, 0) rotate(0deg);
    }
}

.animate-shake {
    animation: animate-shake 1s infinite;
}
</style>
