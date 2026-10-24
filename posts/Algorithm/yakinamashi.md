---
title:          "焼きなまし法　アルゴリズム解説1"
date:           "2026-10-26"
categories:     ["競技プログラミング", "Algorithm"]
description:    "適当に焼きなまし法について語る.焼きなまし...焼うどんってこと!?!?!?!?"
imageUrl:       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVVVI1UtQEfShSEoe_6wO0k0dOJoKZXNaDVzNUVbW5BpwO9fQsK_ZawV5n&s=10"
---

# 0. 前書き
今回,いい成績を収めた大会において,おそらくお世話になったであろうアルゴリズムなので後世に伝えるべく書いてゆく.  
みんなで焼きうどん作ろうや.  
あともう少しで今年終わるってマジ?...


# 1. 焼きなまし法とは（Simulated Annealing: SA）
膨大な選択肢の中から最適な答え（大域的最適解）の近似値を探索するためのメタヒューリスティック・アルゴリズム.  
また名前にある通り,このアルゴリズムは金属工学における「焼きなまし」の物理的な過程をモデルにしています.

<img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F1530170%2F1dac41fd-2f72-815c-daee-e38a95bfab20.png?ixlib=rb-4.1.1&auto=format&gif-q=60&q=75&w=1400&fit=max&s=52b89392f6657899a60d41b2ac6e846b" width="600" height="350">

このアルゴリズムの最大の特徴として,常にスコアが良くなる方向だけに進む,単純な「山登り法」ではなく,序盤（温度が高い時）はスコアが悪化するような変化もあえて受け入れ,終盤（温度が低い時）になるにつれて,良い変化しか受け入れないようにするという,確率的な仕組みを取り入れているところがあります.  
  
前述した「山登り法」では,途中の最適に見える解でアルゴリズムが止まってしまうことがありますが,焼きなまし法では確率的な仕組みでそれを回避しているというわけです.

# end. 参考文献

**AHC典型解法シリーズ第2弾「焼きなまし法」**  
**url:** https://qiita.com/thun-c/items/ecd438fde4d237b1f7bc

<p>

**シミュレーテッド・アニーリング from Scratch**  
**url:** https://qiita.com/meltyyyyy/items/096efb08fb4ec532c330