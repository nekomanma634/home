---
title:          "焼きなまし法　アルゴリズム解説1"
date:           "2026-10-25"
categories:     ["競技プログラミング", "Algorithm"]
description:    "適当に焼きなまし法について語る.焼きなまし...焼うどんってこと!?!?!?!?"
imageUrl:       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVVVI1UtQEfShSEoe_6wO0k0dOJoKZXNaDVzNUVbW5BpwO9fQsK_ZawV5n&s=10"
---

# 0. 前書き
今回,いい成績を収めた大会において,おそらくお世話になったであろうアルゴリズムなので後世に伝えるべく書いてゆく.  
みんなで焼きうどん作ろうや.  
あともう少しで今年終わるってマジ?　(2026年10月下旬なう)...


# 1. 焼きなまし法とは（Simulated Annealing: SA）
膨大な選択肢の中から最適な答え（大域的最適解）の近似値を探索するためのメタヒューリスティック・アルゴリズム.  
また名前にある通り,このアルゴリズムは金属工学における「焼きなまし」の物理的な過程をモデルにしています.

<img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F1530170%2F1dac41fd-2f72-815c-daee-e38a95bfab20.png?ixlib=rb-4.1.1&auto=format&gif-q=60&q=75&w=1400&fit=max&s=52b89392f6657899a60d41b2ac6e846b" width="600" height="350">

このアルゴリズムの最大の特徴として,常にスコアが良くなる方向だけに進む,単純な「山登り法」ではなく,序盤（温度が高い時）はスコアが悪化するような変化もあえて受け入れ,終盤（温度が低い時）になるにつれて,良い変化しか受け入れないようにするという,確率的な仕組みを取り入れているところがあります.  
  
前述した「山登り法」では,途中の最適に見える解でアルゴリズムが止まってしまうことがありますが,焼きなまし法では確率的な仕組みでそれを回避しているというわけです.  

# 2. アルゴリズムの基本ステップ
1. **初期化:** 初期状態（現在の解）を生成し,初期温度 $T$ を高く設定
2. **近傍の生成:** 現在の状態をわずかに変化させた「次の状態（近傍）」を作成
3. **評価と遷移:**
   - **スコアが改善する場合:** 無条件で次の状態へ遷移（採用）する
   - **スコアが悪化する場合:** 悪化量を $ΔE$ としたとき, 以下の確率 $P$ で遷移を許容する


<details><summary>確率Pについての式</summary>
<p>

$$
P = \exp\left(-\frac{\Delta E}{T}\right)
$$

<p>

※ 温度 $T$ が大きい序盤は $P$ が大きくなり悪化を許容しやすく, $T$ が小さくなる終盤は $P$ が$0$に近づき悪化を許容しなくなる

※ $\exp()$ とは,ネイピア数 $e$ を底とする指数関数を表す記号,および関数.  
要するに $\exp(x) = e^x$ ということ

</details>


4. **冷却:** 温度 $T$ を少し下げます（例: 定数 $α < 1$ を掛ける指数冷却など）
5. **終了判定:** 温度が十分に下がるか,制限時間に達するまで2~4のループを高速に繰り返す
   
<br>

また 4. の冷却の仕方には様々なアプローチがあります.以下に具体例を提示しておきます.  
下記の式の定義として,  
経過時間の割合 $t$ （$0 \le t \le 1$）初期温度を $T_0$ ,最終温度を $T_1$（$T_0 > T_1 > 0$）としています.

<details><summary>線形冷却（Linear Cooling）</summary>
<p>

$$
T(t) = T_0 (1 - t) + T_1 t
$$
<p>

線形冷却は,時間の経過に対して一定のペースで温度が下がる.  
最も単純だが,焼きなまし法においては「温度が低い終盤の微調整」の時間が相対的に短くなりやすいため,スコアが伸び悩む場合がある.
</details>

<details><summary>指数冷却（Exponential / Geometric Cooling）</summary>
<p>

$$
T(t) = T_0 \left( \frac{T_1}{T_0} \right)^t
$$

<p>

指数冷却は,対数を取ると線形になる ( $\log T (t)$ が直線的に下がる) ため,序盤は急激に温度が下がり,終盤にかけてゆっくりと温度が下がる曲線になる.  
状態空間を広く探索する「高温状態」から,局所的最適解を丁寧に探す「低温状態」への移行が自然であり,AHCなどのヒューリスティック・コンテストで最も標準的かつ強力とされる冷却式.
</details>

<details><summary>反比例冷却（Inverse Cooling）</summary>
<p>

$$
T(t) = \frac{T_0 T_1}{T_1(1-t) + T_0 t}
$$

<p>

反比例冷却は,温度の逆数 $\frac{1}{T(t)}$ が線形に変化する $(\frac{1}{T(t)} = \frac{1-t}{T_0} + \frac{t}{T_1})$ ように設計された式.  
指数冷却よりもさらに「序盤の温度低下が激しく,終盤の低温状態が長く続く」という強い特徴を持つ.終盤の微小な改善（山登りに近い挙動）に時間を割きたい問題に有効な場合がある.
</details>

# 3. 実装例
それでは具体的な問題に対する回答,という形式での実装例を提示していきます.

### 問題
$N \times N$ のグリッド上に $M$ 個の家が存在します.あなたは新たに $K$ 個のコンビニを配置しなければなりません.
各家から「最も近いコンビニまでのマンハッタン距離」の総和を最小化するような, $K$ 個のコンビニの座標 $(X_i, Y_i)$ を出力してください.

- 制約: $N = 50, M = 100, K = 10$  
制限時間: $2.0[s]$  

スコア: $\sum_{i=1}^{M} \min_{j=1}^{K} ( \vert{}x_i - X_j\vert{} + \vert{}y_i - Y_j\vert{} )$　（値が小さいほど高評価）

### 解答例

<details><summary>この解答における最適化の意図</summary>

**時間計測と温度更新の間引き**  
`(iter & 1023)std::chrono::high_resolution_clock::now()` や `std::pow` の呼び出しは非常に重い処理であり,毎ループ呼ぶとそれだけで実行時間の半分以上を消費してしまうため,ビット演算を用いて1024回に1回だけ処理するように間引くことで,イテレーション回数を劇的に（数倍〜十数倍）伸ばしている.  

**二種類の近傍（小規模探索とワープ）の併用**  
コンビニを1マスずつ動かすだけでは,密集地帯（局所最適解）に吸い寄せられた後,他の過疎地帯へ移動できなくなる.20%の確率で「盤面上のランダムな位置へワープさせる」近傍を混ぜることで,高い温度の序盤に広域探索を可能にしている. 

**スコア計算の割り切り**  
本来であれば「動かしたコンビニ1つ分」だけを差分更新（Delta Evaluation）するのがAHCの定石だが,この問題設定では $O(M \times K)$ がわずか $1000$ 回の演算.コードを複雑にしてバグを生むより,全計算ループをぶん回す方針の方が競技プログラミングにおける「短時間での実装効率」と「実行速度」のバランスに優れる.

</details>

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <chrono>

using namespace std;

// [テクニック1] 高速な乱数生成器 (std::mt19937より軽量)
uint32_t xor32() {
    static uint32_t y = 2463534242;
    y = y ^ (y << 13); y = y ^ (y >> 17); return y = y ^ (y << 5);
}
double rand01() { return (double)xor32() / UINT32_MAX; }

const int N = 50, M = 100, K = 10;
int hx[M], hy[M];

// スコア計算 (距離の最小化)
// ※ コード長優先で全計算を採用。M*K=1000なので十分高速に回る
int calc_score(const vector<pair<int, int>>& pos) {
    int total_dist = 0;
    for (int i = 0; i < M; ++i) {
        int min_d = 1e9;
        for (int j = 0; j < K; ++j) {
            int d = abs(hx[i] - pos[j].first) + abs(hy[i] - pos[j].second);
            if (d < min_d) min_d = d;
        }
        total_dist += min_d;
    }
    return total_dist;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 1. 入力受け取り
    for (int i = 0; i < M; ++i) cin >> hx[i] >> hy[i];

    // 2. 初期解の生成 (ランダム配置)
    vector<pair<int, int>> pos(K);
    for (int i = 0; i < K; ++i) pos[i] = {xor32() % N, xor32() % N};

    int current_score = calc_score(pos);
    int best_score = current_score;
    vector<pair<int, int>> best_pos = pos;

    // 3. 焼きなまし法のパラメータ設定
    double T0 = 50.0, T1 = 1.0;
    double time_limit = 1.9; // 制限時間2秒に対して余裕を持たせる
    auto start = chrono::high_resolution_clock::now();
    
    int iter = 0;
    double temp = T0;

    // 4. メインループ
    while (true) {
        // [テクニック2] chrono::now() は重いので 1024 回に 1 回だけ呼ぶ
        if ((iter & 1023) == 0) {
            auto now = chrono::high_resolution_clock::now();
            double t = chrono::duration<double>(now - start).count() / time_limit;
            if (t >= 1.0) break;
            temp = T0 * pow(T1 / T0, t); // 指数冷却
        }
        iter++;

        // 近傍生成: ランダムに1つのコンビニを選ぶ
        int target = xor32() % K;
        auto old_p = pos[target];
        
        // [テクニック3] 近傍のハイブリッド
        // 80%の確率で近傍(±4マス以内)を探索、20%でワープさせて局所解を脱出
        if (xor32() % 100 < 80) {
            pos[target].first = max(0, min(N - 1, pos[target].first + (int)(xor32() % 9) - 4));
            pos[target].second = max(0, min(N - 1, pos[target].second + (int)(xor32() % 9) - 4));
        } else {
            pos[target] = {xor32() % N, xor32() % N};
        }

        // 状態遷移の評価
        int new_score = calc_score(pos);
        int delta = new_score - current_score; // 負ならスコア改善

        // 最小化問題の受容確率判定
        if (delta <= 0 || exp(-delta / temp) > rand01()) {
            current_score = new_score;
            if (current_score < best_score) {
                best_score = current_score;
                best_pos = pos;
            }
        } else {
            pos[target] = old_p; // 却下された場合は元に戻す
        }
    }

    // 5. 最良解の出力
    // cerr << "Iterations: " << iter << ", Best Score: " << best_score << endl;
    for (int i = 0; i < K; ++i) cout << best_pos[i].first << " " << best_pos[i].second << "\n";
    return 0;
}
```

# 4. 練習問題
上記で解説したものを活用して練習問題を解いてみましょう.

### 1. サーバー負荷分散問題（Load Balancing / K-Partition Problem）
$M$ 個のタスクがあり,各タスク $i$ を処理するのにかかる時間は $W_i$ です.  
これらを $K$ 台のサーバーに割り当てます.  
一部のサーバーだけに負荷が集中するのを防ぐため,各サーバーの処理時間の合計を $S_0, S_1, \dots, S_{K-1}$ としたとき,サーバーごとの処理時間の「二乗和」 $\sum_{j=0}^{K-1} S_j^2$ を最小化してください.  
（※二乗和を最小化すると,結果的に全体の分散が最小化され,すべてのサーバーの処理時間が平均に近づきます.）  

- 制約: $M = 1000, K = 50, \ 1 \le W_i \le 10000$  
制限時間 $2.0[s]$  
出力: 各タスクを割り当てるサーバーの番号（$0$ 〜 $49$）を $M$ 行出力.

<details><summary>おおまかテクニック解説</summary>

**差分計算（Delta Evaluation）**  
前回のコンビニ問題では,コンビニを1つ動かすたびに「すべての家からの距離」を再計算（$O(M)$）していたが,今回はタスクを移動させた影響が `old_server` と `new_server` の2箇所にしか及ばないことを利用している.
数式を展開することで $O(1)$ の掛け算と足し算だけでスコア変動 `delta` が求まるため,C++なら2秒間で数千万回という驚異的な回数のイテレーションを回すことができる.AHCの解答でもよく見かけるテクニックである.

**「最大値の最小化」を「二乗和の最小化」にすり替える**  
「最も重いサーバーの負荷を下げたい」という目的の場合,そのまま実装すると「最大負荷のサーバーが変動したときしかスコアが変わらない」ため,平坦な地形になって焼きなまし法が迷子になる.そのため各サーバー負荷を二乗和で評価することで,「どの移動にも必ずスコアの傾斜（勾配）が生まれる」ようになり,滑らかに最適解へ導かれる.

**スコアスケールに合わせた温度設定**  
スコアが二乗で効いてくるため,タスクを動かしたときの $\Delta$ が数万〜数百万という単位で変動する.そのため,初期温度 $T_0$ も $10^9$ のような巨大な値に設定しなければ,序盤で悪化を許容できなくなる.

</details>

<details><summary>入力例</summary>

こちらのコードで作成してください.

```python
import random

# タスクの数
M = 1000
# 処理時間の最小値と最大値
MIN_W = 1
MAX_W = 10000

# input_load.txt に書き出す
with open("input_load.txt", "w") as f:
    for _ in range(M):
        w = random.randint(MIN_W, MAX_W)
        f.write(f"{w}\n")

print(f"{M}件のテストデータを 'input_load.txt' に生成しました。")
```

</details>

<details><summary>解答例</summary>

この問題の最大のポイントは,タスクを別のサーバーに移動したときのスコア変動（$\Delta$）を全計算せず,たった1行の数式で $O(1)$ で求める点.  
これにより,イテレーション（ループ）回数が前回の問題の数百倍に跳ね上がる.

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <chrono>

using namespace std;

// 高速な乱数生成器
uint32_t xor32() {
    static uint32_t y = 2463534242;
    y = y ^ (y << 13); y = y ^ (y >> 17); return y = y ^ (y << 5);
}
double rand01() { return (double)xor32() / UINT32_MAX; }

const int M = 1000, K = 50;
long long W[M];

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 1. 入力受け取り
    for (int i = 0; i < M; ++i) cin >> W[i];

    // 2. 初期解の生成 (ランダム割り当て)
    vector<int> assign(M);
    vector<long long> S(K, 0);
    for (int i = 0; i < M; ++i) {
        assign[i] = xor32() % K;
        S[assign[i]] += W[i];
    }

    // 初期スコアの計算 (初回だけはO(K)かけて全計算する)
    long long current_score = 0;
    for (int j = 0; j < K; ++j) {
        current_score += S[j] * S[j];
    }
    
    long long best_score = current_score;
    vector<int> best_assign = assign;

    // 3. 焼きなましのパラメータ
    // ※ 二乗和の計算でスコア変動が巨大になるため、初期温度を極めて高く設定
    double T0 = 1e9, T1 = 1e3;
    double time_limit = 1.9;
    auto start = chrono::high_resolution_clock::now();
    
    int iter = 0;
    double temp = T0;

    // 4. メインループ
    while (true) {
        if ((iter & 1023) == 0) {
            auto now = chrono::high_resolution_clock::now();
            double t = chrono::duration<double>(now - start).count() / time_limit;
            if (t >= 1.0) break;
            temp = T0 * pow(T1 / T0, t);
        }
        iter++;

        // 近傍生成: ランダムなタスクを1つ選び、別のサーバーに移動させる
        int target_task = xor32() % M;
        int old_server = assign[target_task];
        int new_server = xor32() % K;
        if (old_server == new_server) continue;

        long long w = W[target_task];
        
        // [テクニック] 差分計算 (Delta Evaluation) による O(1) 評価
        // 変更後のスコア - 変更前のスコア を数式展開して整理したもの
        // (S_new + w)^2 + (S_old - w)^2 - (S_new^2 + S_old^2)
        long long delta = 2 * w * (S[new_server] - S[old_server] + w);

        // 最小化問題の受容確率判定
        if (delta <= 0 || exp(-delta / temp) > rand01()) {
            // 採用された場合のみ、状態を O(1) で更新する
            current_score += delta;
            S[old_server] -= w;
            S[new_server] += w;
            assign[target_task] = new_server;

            if (current_score < best_score) {
                best_score = current_score;
                best_assign = assign;
            }
        }
    }

    // 5. 出力
    for (int i = 0; i < M; ++i) cout << best_assign[i] << "\n";
    return 0;
}
```
</details>  

<br>

### 2. 配送ルート最適化問題（巡回セールスマン問題: TSP）
2次元平面上に $N$ 個の都市があります.都市 $0$ から出発し,すべての都市をちょうど1回ずつ訪問して,最後に再び都市 $0$ に戻ってくるような「訪問順序」を決定してください.  
都市間の移動距離はユークリッド距離（直線距離）とし,移動距離の総和を最小化することが目的です.  

- 制約: $N = 500$  
各座標は $0 \le X_i, Y_i \le 10000$  
制限時間 $2.0[s]$  
出力: 訪問する都市の番号を順に $N$ 行出力

<details><summary>おおまかテクニック解説</summary>

**順列探索における最強の近傍「2-opt」**  
訪問順序を最適化する際,「2つの都市の順番を入れ替える（スワップ）」という近傍を思いつきがちだが,これだと経路が複雑に交差してしまい上手くいかない.2-opt は「配列の一部区間をまるごと反転（Reverse）させる」操作であり,これは図形的に見ると「交差している2本の線分（バツ印）をほどいて,平行な2本の線分に繋ぎ直す」という幾何学的に極めて理にかなった操作になり,TSP系の問題では圧倒的な威力を発揮する.  

**2-optの $O(1)$ 差分計算（Delta Evaluation）**  
配列の区間 [L, R] を反転させても,区間内部の都市同士の繋がり（距離）は変わらない（向きが逆になるだけ）.
切断されるのは L の手前の辺と、R の後ろの辺のたった2本だけ,したがって全経路の距離を $O(N)$ かけて計算し直す必要はなく,この2本の辺の架け替えによる差分だけを計算すれば $O(1)$ で状態評価が完了する.  

**距離の事前計算テーブル（dist_mat）**  
AHCなどの競技プログラミングにおいて,浮動小数点数の平方根計算（std::sqrt）は非常に重い処理.そのため,ループの内部で都度距離を計算しているとイテレーション回数が激減するため,初期化フェーズで $N \times N$ の距離テーブルをメモリ上に作っておき,ループ内では配列アクセスのみで済ませるのが鉄則.

</details>

<details><summary>入力例</summary>

こちらのコードで作成してください.

```python
import random

# 都市の数
N = 500
# 座標の最大値
MAX_COORD = 10000

# input.txt に書き出す
with open("input.txt", "w") as f:
    for _ in range(N):
        x = random.randint(0, MAX_COORD)
        y = random.randint(0, MAX_COORD)
        f.write(f"{x} {y}\n")

print(f"{N}件のテストデータを 'input.txt' に生成しました。")
```

</details>

<details><summary>解答例</summary>

順列最適化における最強の近傍である「2-opt（2点スワップではなく、区間の反転）」と,そのスコア差分を $O(1)$ で計算するテクニックを実装したテンプレート.

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <chrono>
#include <numeric>
#include <algorithm>

using namespace std;

uint32_t xor32() {
    static uint32_t y = 2463534242;
    y = y ^ (y << 13); y = y ^ (y >> 17); return y = y ^ (y << 5);
}
double rand01() { return (double)xor32() / UINT32_MAX; }

const int N = 500;
double X[N], Y[N];
double dist_mat[N][N]; // 距離の事前計算テーブル

// 2点間の距離を返す
double get_dist(int i, int j) {
    return sqrt((X[i]-X[j])*(X[i]-X[j]) + (Y[i]-Y[j])*(Y[i]-Y[j]));
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 1. 入力受け取りと距離テーブルの事前計算
    for (int i = 0; i < N; ++i) cin >> X[i] >> Y[i];
    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < N; ++j) {
            dist_mat[i][j] = get_dist(i, j);
        }
    }

    // 2. 初期解の生成 (0, 1, 2, ..., N-1)
    vector<int> tour(N);
    iota(tour.begin(), tour.end(), 0);

    double current_score = 0;
    for (int i = 0; i < N; ++i) {
        current_score += dist_mat[tour[i]][tour[(i + 1) % N]];
    }
    
    double best_score = current_score;
    vector<int> best_tour = tour;

    // 3. 焼きなましのパラメータ
    // 距離の変動幅に合わせて温度を設定
    double T0 = 1000.0, T1 = 0.1;
    double time_limit = 1.9;
    auto start = chrono::high_resolution_clock::now();
    
    int iter = 0;
    double temp = T0;

    // 4. メインループ
    while (true) {
        if ((iter & 1023) == 0) {
            auto now = chrono::high_resolution_clock::now();
            double t = chrono::duration<double>(now - start).count() / time_limit;
            if (t >= 1.0) break;
            temp = T0 * pow(T1 / T0, t);
        }
        iter++;

        // 近傍生成: 2-opt (経路の一部区間を反転させる)
        // ランダムに2点 L, R を選ぶ (0 <= L < R < N)
        int L = xor32() % N;
        int R = xor32() % N;
        if (L == R) continue;
        if (L > R) swap(L, R);

        // [テクニック] 2-optの O(1) 差分計算
        // 反転区間の外側と繋がっている2本の辺だけが架け替えられる
        int before_L = (L - 1 + N) % N;
        int after_R  = (R + 1) % N;

        // 繋ぎ変えによって「消える辺」と「増える辺」の距離差分
        double removed_dist = dist_mat[tour[before_L]][tour[L]] 
                            + dist_mat[tour[R]][tour[after_R]];
        double added_dist   = dist_mat[tour[before_L]][tour[R]] 
                            + dist_mat[tour[L]][tour[after_R]];
                            
        double delta = added_dist - removed_dist;

        // 最小化問題の受容確率判定
        if (delta <= 0 || exp(-delta / temp) > rand01()) {
            // 採用された場合、区間 [L, R] の順序を反転する
            reverse(tour.begin() + L, tour.begin() + R + 1);
            current_score += delta;

            if (current_score < best_score) {
                best_score = current_score;
                best_tour = tour;
            }
        }
    }

    // 5. 出力
    for (int i = 0; i < N; ++i) cout << best_tour[i] << "\n";
    return 0;
}
```

</details>

<br>

### 3. 組織の2チーム分割問題（Max-Cut Problem / グラフの最大重みカット）
$N$ 人の社員を「Aチーム（0）」と「Bチーム（1）」の2つに分割します.  
社員間には $M$ 個の「関係性」が存在し,社員 $u$ と社員 $v$ を異なるチームに所属させた場合,スコア $W$ が加算されます.    
（※ $W > 0$ は「別々のチームにしたい不仲・ライバル関係」, $W < 0$ は「同じチームにしたい親友関係」を意味します）  

得られる総スコアを最大化するような,各社員の所属チーム（0 または 1）を出力してください.  

- 制約: $N = 1000, M = 10000, -10^5 \le W \le 10^5$  
制限時間 $2.0[s]$  
出力: 各社員の所属チーム（0 または 1）を $N$ 行出力.

<details><summary>おおまかテクニック解説</summary>

**最大化問題における受容判定の違い**  
これまでの問題はすべて「距離や負荷を小さくする（最小化）」であったが,今回は「スコアを大きくする（最大化）」問題.
変化量 $delta$ の定義を $新しいスコア - 現在のスコア$ としたとき,最大化では $delta >= 0$ が改善を意味する.悪化する場合は $delta$ がマイナスになるため,確率計算の式は $\exp(delta / temp)$ となり,マイナス記号をつけないのが数学的に正しい記述になる.（最小化のときは $-delta$ にしていた）  

**隣接リストを利用した超高速評価**  
ある社員のチームをAからBへ変更したとき,影響を受けるのは「その社員と直接関係性（エッジ）を持つ社員」だけ.
無関係な社員を調べる必要はないため,各ノードの次数（つながりの数）の分だけループを回せば差分が出る.$N=1000$ でも,平均次数が $20$ 程度（エッジ数10000）であれば,毎回1000回ループを回すのに比べて $50$ 倍高速になる.  

**二値最適化（ビット反転近傍）**  
「0 か 1 か（配置する/しない、A/B）」という二値（Boolean）の状態変数は,AHCをはじめとする最適化問題の根幹.配列の値をスワップ（交換）するのではなく,単純に選んだインデックスのフラグをXOR演算（^= 1）で反転させるだけのこの近傍は,無駄な状態遷移を生みにくく,焼きなまし法と非常に相性が良い.

</details>

<details><summary>入力例</summary>

こちらのコードで作成してください.

```python
import random

N = 1000
M = 10000
MIN_W = -100000
MAX_W = 100000

# 重複するエッジ（関係性）を避けるためのセット
edges = set()

while len(edges) < M:
    u = random.randint(0, N - 1)
    v = random.randint(0, N - 1)
    if u != v:
        # (u, v) と (v, u) を同じ関係として扱うためにソート
        if u > v:
            u, v = v, u
        edges.add((u, v))

# ファイルへの書き出し
with open("input_maxcut.txt", "w") as f:
    # 先ほどのC++コードに合わせて、最初にMを出力
    f.write(f"{M}\n")
    for u, v in edges:
        w = random.randint(MIN_W, MAX_W)
        f.write(f"{u} {v} {w}\n")

print(f"社員数 {N} 人、関係性 {M} 件のデータを 'input_maxcut.txt' に生成しました。")
```

</details>


<details><summary>解答例</summary>

このコードのポイントは,「最大化問題への対応（式の符号変化）」と,隣接リスト（グラフ）を用いた「次数に比例する局所的な差分計算」.

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <chrono>

using namespace std;

uint32_t xor32() {
    static uint32_t y = 2463534242;
    y = y ^ (y << 13); y = y ^ (y >> 17); return y = y ^ (y << 5);
}
double rand01() { return (double)xor32() / UINT32_MAX; }

struct Edge {
    int to;
    long long w;
};

const int N = 1000;
int M;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    if (!(cin >> M)) return 0;

    // 1. グラフの構築 (隣接リスト)
    vector<vector<Edge>> G(N);
    for (int i = 0; i < M; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        G[u].push_back({v, w});
        G[v].push_back({u, w});
    }

    // 2. 初期解の生成 (ランダムに0か1を割り当て)
    vector<int> team(N);
    for (int i = 0; i < N; ++i) {
        team[i] = xor32() % 2;
    }

    // 初期スコアの計算
    long long current_score = 0;
    for (int u = 0; u < N; ++u) {
        for (const auto& e : G[u]) {
            // 無向グラフの辺を2回見ることになるため、u < e.to のみ加算
            if (u < e.to && team[u] != team[e.to]) {
                current_score += e.w;
            }
        }
    }
    
    long long best_score = current_score;
    vector<int> best_team = team;

    // 3. 焼きなましのパラメータ (最大化問題)
    double T0 = 20000.0, T1 = 10.0;
    double time_limit = 1.9;
    auto start = chrono::high_resolution_clock::now();
    
    int iter = 0;
    double temp = T0;

    // 4. メインループ
    while (true) {
        if ((iter & 1023) == 0) {
            auto now = chrono::high_resolution_clock::now();
            double t = chrono::duration<double>(now - start).count() / time_limit;
            if (t >= 1.0) break;
            temp = T0 * pow(T1 / T0, t);
        }
        iter++;

        // 近傍生成: ランダムな社員1人を選び、所属チームを反転させる (0 -> 1, 1 -> 0)
        int v = xor32() % N;

        // [テクニック1] グラフの隣接関係だけを見る O(Degree) の差分計算
        long long delta = 0;
        for (const auto& e : G[v]) {
            if (team[v] != team[e.to]) {
                // 反転前は別チーム(加点あり) -> 反転後は同チーム(加点なし)
                delta -= e.w;
            } else {
                // 反転前は同チーム(加点なし) -> 反転後は別チーム(加点あり)
                delta += e.w;
            }
        }

        // [テクニック2] 最大化問題の受容確率判定
        // delta >= 0 ならスコア改善。悪化(delta < 0)しても確率で受容
        if (delta >= 0 || exp(delta / temp) > rand01()) {
            team[v] ^= 1; // 所属チームを反転
            current_score += delta;

            if (current_score > best_score) {
                best_score = current_score;
                best_team = team;
            }
        }
    }

    // 5. 出力
    for (int i = 0; i < N; ++i) {
        cout << best_team[i] << "\n";
    }
    return 0;
}
```

</details>

# 5. あとがき&参考文献
と,いうことで焼きなまし法の解説でした.    
まぁ私の適当解説じゃ限界があると思うので下記のサイトとか参考にしてみてください.  
また,最後まで読んでくださりありがとうございました.  
次は多分ビームサーチ書くかも...

**AHC典型解法シリーズ第2弾「焼きなまし法」**  
**url:** https://qiita.com/thun-c/items/ecd438fde4d237b1f7bc

<p>

**シミュレーテッド・アニーリング from Scratch**  
**url:** https://qiita.com/meltyyyyy/items/096efb08fb4ec532c330

<p>

**焼きなまし法 (wikipedia)**  
**url:** https://ja.wikipedia.org/wiki/%E7%84%BC%E3%81%8D%E3%81%AA%E3%81%BE%E3%81%97%E6%B3%95

<p>

**誰でもできる焼きなまし法**  
**url:** https://gasin.hatenadiary.jp/entry/2019/09/03/162613

<p>

**【配送最適化入門】焼きなまし法（SA）で局所最適を脱出⑤**  
**url:** https://qiita.com/doiken_/items/c3c34bfd2cbbcf8cff04