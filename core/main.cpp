#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <random>
#include <ctime>
#include <sstream>

using namespace std;

class BlackjackGame
{
public:
    int playerCount = 1;                  // 玩家数量
    bool playerCountConfirmed = false;    // 是否确认玩家数量
    vector<string> playerNames;           // 玩家名称列表

    // 玩家结构体
    struct Player
    {
        string name;              // 玩家名称
        vector<string> hand;      // 玩家手牌
        bool busted = false;      // 是否爆牌
        int score = 0;            // 玩家得分
        bool naturalBlackjack = false; // 是否天生21点
    };

    vector<Player> players; // 玩家列表

    // 庄家结构体
    struct Dealer
    {
        vector<string> hand;      // 庄家手牌
        int score = 0;            // 庄家得分
        bool naturalBlackjack = false; // 是否天生21点
    } dealer;

    int currentPlayerIndex = 0;    // 当前玩家索引
    bool gameStarted = false;      // 游戏是否开始
    bool gameOver = false;         // 游戏是否结束
    string winnerMessage;          // 胜利信息
    vector<string> deck;           // 牌堆
    bool natureBlackJack = false;  // 是否出现天生21点

    // 开始游戏
    void startGame()
    {
        initializeDeck(); // 初始化并洗牌

        // 初始化玩家
        for (const auto &name : playerNames)
        {
            vector<string> hand = {drawCard(), drawCard()}; // 抽两张牌
            int score = calculateScore(hand);              // 计算得分
            players.push_back({name, hand, false, score, isNaturalBlackjack(hand, score)});
        }

        // 初始化庄家
        dealer.hand = {drawCard(), drawCard()};     // 庄家抽两张牌
        dealer.score = calculateScore(dealer.hand); // 计算庄家得分
        if (isFaceOrAce(dealer.hand[0]))
        {
            dealer.naturalBlackjack = isNaturalBlackjack(dealer.hand, dealer.score);
        }

        gameStarted = true;

        // 检查是否有天生21点
        for (const auto &player : players)
        {
            if (player.naturalBlackjack)
            {
                natureBlackJack = true;
                endGame();
                return;
            }
        }
        if (dealer.naturalBlackjack)
        {
            natureBlackJack = true;
            endGame();
        }
    }

    // 初始化牌堆
    void initializeDeck()
    {
        const vector<string> suits = {"♠", "♥", "♦", "♣"};                       // 花色
        const vector<string> ranks = {"2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"}; // 点数
        deck.clear();
        for (const auto &suit : suits)
        {
            for (const auto &rank : ranks)
            {
                deck.push_back(rank + suit); // 组合点数和花色
            }
        }
        shuffleDeck(); // 洗牌
    }

    // 洗牌
    void shuffleDeck()
    {
        random_device rd;
        mt19937 g(rd());
        shuffle(deck.begin(), deck.end(), g);
    }

    // 抽一张牌
    string drawCard()
    {
        if (deck.empty())
            return "";                  // 如果牌堆为空，返回空字符串
        string card = deck.back();      // 获取最后一张牌
        deck.pop_back();                // 从牌堆中移除该牌
        return card;
    }

    // 计算手牌得分
    int calculateScore(const vector<string> &hand)
    {
        int score = 0;
        int aces = 0;
        for (const auto &card : hand)
        {
            string rank = card.substr(0, card.size() - 1); // 提取点数
            if (rank == "J" || rank == "Q" || rank == "K")
            {
                score += 10; // J、Q、K记为10分
            }
            else if (rank == "A")
            {
                aces++;
                score += 11; // A初始记为11分
            }
            else
            {
                score += stoi(rank); // 数字牌按点数计分
            }
        }
        // 如果有A且总分超过21，调整A的值为1
        while (score > 21 && aces > 0)
        {
            score -= 10;
            aces--;
        }
        return score;
    }

    // 判断是否为天生21点
    bool isNaturalBlackjack(const vector<string> &hand, int score)
    {
        return hand.size() == 2 && score == 21;
    }

    // 判断是否为人头牌或A
    bool isFaceOrAce(const string &card)
    {
        string rank = card.substr(0, card.size() - 1);
        return rank == "A" || rank == "10" || rank == "J" || rank == "Q" || rank == "K";
    }

    // 玩家操作（抽牌或停牌）
    void playerAction(int playerIndex, const string &action)
    {
        Player &player = players[playerIndex];
        if (action == "hit")
        {
            player.hand.push_back(drawCard());          // 玩家抽牌
            player.score = calculateScore(player.hand); // 更新得分
            if (player.score > 21)
            {
                player.busted = true; // 如果得分超过21，玩家爆牌
            }
        }
        if (action == "stand" || player.busted)
        {
            currentPlayerIndex++;
            if (currentPlayerIndex >= players.size())
            {
                dealerAction(); // 如果所有玩家都操作完，轮到庄家
            }
        }
    }

    // 庄家操作
    void dealerAction()
    {
        while (dealer.score < 17)
        {
            dealer.hand.push_back(drawCard()); // 庄家抽牌直到得分至少为17
            dealer.score = calculateScore(dealer.hand);
        }
        endGame(); // 庄家操作结束后结束游戏
    }

    // 结束游戏并确定胜者
    void endGame()
    {
        gameOver = true;
        ostringstream result;
        for (const auto &player : players)
        {
            if (player.naturalBlackjack && dealer.naturalBlackjack)
            {
                result << player.name << "，你和庄家都是天生21点，平局!\n";
            }
            else if (player.naturalBlackjack)
            {
                result << player.name << "，你是天生21点，你赢了!\n";
            }
            else if (dealer.naturalBlackjack)
            {
                result << player.name << "，庄家是天生21点，你输了!\n";
            }
            else if (player.busted)
            {
                result << player.name << "，对不起,你输了!\n";
            }
            else if (player.score > dealer.score || dealer.score > 21)
            {
                result << player.name << "，你赢了!\n";
            }
            else if (player.score == dealer.score)
            {
                result << player.name << "，你打平局了!\n";
            }
            else
            {
                result << player.name << "，对不起,你输了!\n";
            }
        }
        winnerMessage = result.str(); // 保存结果信息
    }

    // 重置游戏到初始状态
    void resetGame()
    {
        playerCount = 1;
        playerCountConfirmed = false;
        playerNames.clear();
        players.clear();
        dealer.hand.clear();
        dealer.score = 0;
        dealer.naturalBlackjack = false;
        currentPlayerIndex = 0;
        gameStarted = false;
        gameOver = false;
        winnerMessage.clear();
        natureBlackJack = false;
    }
};