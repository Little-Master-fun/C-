import { reactive } from "vue";

export class BlackjackGame {
    playerCount = 1;
    playerCountConfirmed = false; // 是否确认玩家人数
    playerNames = reactive<string[]>([]);
    players = reactive<{ name: string; hand: string[]; busted: boolean; score: number }[]>([]);
    dealer = reactive<{ hand: string[]; score: number }>({ hand: [], score: 0 });
    currentPlayerIndex = 0;
    gameStarted = false;
    gameOver = false;
    winnerMessage = '';
    deck: string[] = [];

    startGame() {
        this.initializeDeck();
        this.players = this.playerNames.map((name) => {
            const hand = [this.drawCard(), this.drawCard()];
            return {
                name,
                hand,
                busted: false,
                score: this.calculateScore(hand),
            };
        });
        this.dealer.hand = [this.drawCard(), this.drawCard()];
        this.dealer.score = this.calculateScore(this.dealer.hand);
        this.gameStarted = true;

        if (this.dealer.score === 21) {
            this.endGame();
        }
    }

    initializeDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = suits.flatMap((suit) => ranks.map((rank) => `${rank}${suit}`));
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    drawCard(): string {
        return this.deck.pop() || '';
    }

    calculateScore(hand: string[]): number {
        let score = 0;
        let aces = 0;
        hand.forEach((card) => {
            const rank = card.slice(0, -1);
            if (['J', 'Q', 'K'].includes(rank)) {
                score += 10;
            } else if (rank === 'A') {
                aces++;
                score += 11;
            } else {
                score += parseInt(rank);
            }
        });
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        return score;
    }

    playerAction(playerIndex: number, action: 'hit' | 'stand') {
        const player = this.players[playerIndex];
        if (action === 'hit') {
            player.hand.push(this.drawCard());
            player.score = this.calculateScore(player.hand);
            if (player.score > 21) {
                player.busted = true;
            }
        }
        if (action === 'stand' || player.busted) {
            this.currentPlayerIndex++;
            if (this.currentPlayerIndex >= this.players.length) {
                this.dealerAction();
            }
        }
    }

    dealerAction() {
        while (this.dealer.score < 17) {
            this.dealer.hand.push(this.drawCard());
            this.dealer.score = this.calculateScore(this.dealer.hand);
        }
        this.endGame();
    }

    endGame() {
        this.gameOver = true;
        const dealerScore = this.dealer.score;
        const playerResults = this.players.map((player) => {
            const playerScore = player.score;
            if (player.busted) {
                return `${player.name}，对不起,你输了!`;
            } else if (playerScore > dealerScore || dealerScore > 21) {
                return `${player.name}，你赢了!`;
            } else if (playerScore === dealerScore) {
                return `${player.name}，你打平局了!`;
            } else {
                return `${player.name}，对不起,你输了!`;
            }
        });

        this.winnerMessage = playerResults.join('\n');
    }

    resetGame() {
        this.playerCount = 1;
        this.playerCountConfirmed = false;
        this.playerNames = [];
        this.players = [];
        this.dealer.hand = [];
        this.dealer.score = 0;
        this.currentPlayerIndex = 0;
        this.gameStarted = false;
        this.gameOver = false;
        this.winnerMessage = '';
    }
}
