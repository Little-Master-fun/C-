import { reactive } from "vue";

export class BlackjackGame {
    playerCount = 1;
    playerCountConfirmed = false; // 是否确认玩家人数
    playerNames = reactive<string[]>([]);
    players = reactive<{ name: string; hand: string[]; busted: boolean; score: number; naturalBlackjack: boolean }[]>([]);
    dealer = reactive<{ hand: string[]; score: number; naturalBlackjack: boolean }>({ hand: [], score: 0, naturalBlackjack: false });
    currentPlayerIndex = 0;
    gameStarted = false;
    gameOver = false;
    winnerMessage = '';
    deck: string[] = [];
    natureBlackJack= false;

    startGame() {
        this.initializeDeck();
        this.players = this.playerNames.map((name) => {
            const hand = [this.drawCard(), this.drawCard()];
            const score = this.calculateScore(hand);
            return {
                name,
                hand,
                busted: false,
                score,
                naturalBlackjack: this.isNaturalBlackjack(hand, score),
            };
        });
        this.dealer.hand = [this.drawCard(), this.drawCard()];
        this.dealer.score = this.calculateScore(this.dealer.hand);
        if (['A', '10', 'J', 'Q', 'K'].includes(this.dealer.hand[0].slice(0, -1))) {
            this.dealer.naturalBlackjack = this.isNaturalBlackjack(this.dealer.hand, this.dealer.score);
        }
        this.gameStarted = true;

        this.players.forEach((player) => {
            if (player.naturalBlackjack) {
                this.natureBlackJack = true;
                this.endGame();
            }
        });
        if (this.dealer.naturalBlackjack) {
            this.natureBlackJack = true;
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

    isNaturalBlackjack(hand: string[], score: number): boolean {
        return hand.length === 2 && score === 21;
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
        const dealerNaturalBlackjack = this.dealer.naturalBlackjack;
        const playerResults = this.players.map((player) => {
            const playerScore = player.score;
            if (player.naturalBlackjack && dealerNaturalBlackjack) {
                return `${player.name}，你和庄家都是天生21点，平局!`;
            } else if (player.naturalBlackjack) {
                return `${player.name}，你是天生21点，你赢了!`;
            } else if (dealerNaturalBlackjack) {
                return `${player.name}，庄家是天生21点，你输了!`;
            } else if (player.busted) {
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
        this.dealer.naturalBlackjack = false;
        this.currentPlayerIndex = 0;
        this.gameStarted = false;
        this.gameOver = false;
        this.winnerMessage = '';
        this.natureBlackJack= false;

    }
}
