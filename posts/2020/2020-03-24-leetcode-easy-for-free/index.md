---
title: "Leetcodeやっていき(無料Easy編)"
date: "2020-03-24"
---

とりあえず無料のEasyをすべて解くのを目指す。
ちゃんとテストも書いていく。

## 771. Jewels and Stones

与えられた文字列の中から、対象の文字列が何個あるか数える問題。
forで一文字ずつcount()を使用して確認していく。
for文も通常の書き方より、リスト内包表記を使用した方が早いし、短い。
最後はsum()で合計を出せばよい。

```
class Solution:
    def numJewelsInStones(self, J: str, S: str) -> int:
        return sum(S.count(j) for j in J)
```

ここで覚えるやつ

- [**main**](https://docs.python.org/ja/3/library/__main__.html)
- [typing](https://docs.python.org/ja/3/library/typing.html)
- [list comprehensions](https://docs.python.org/ja/3/tutorial/datastructures.html#list-comprehensions)
- [list.count(x)](https://docs.python.org/ja/3/tutorial/datastructures.html#more-on-lists)
- [sum](https://docs.python.org/ja/3/library/functions.html?highlight=sum#sum)
- [unittest](https://docs.python.org/ja/3/library/unittest.html?highlight=unittest#module-unittest)

## 1342. numberOfSteps

偶数なら2で割って、それ以外なら1で引いた数の合計を求める問題。

そのまま解いた。

```
class Solution:
    def numberOfSteps(self, num: int) -> int:
        i = 0
        while num > 0:
            if num % 2 == 0:
                num /= 2
                i += 1
            else:
                num -= 1
                i += 1
        return i
```

- ここで覚えるやつ
- [bytes](https://docs.python.org/ja/3/library/stdtypes.html#binary-sequence-types-bytes-bytearray-memoryview)
- [f-string](https://docs.python.org/ja/3/reference/lexical_analysis.html#f-strings)
- [f-string他の使い方](https://docs.python.org/ja/3/reference/lexical_analysis.html#f-strings)
- [bin()](https://note.nkmk.me/python-bin-oct-hex-int-format/)
- [後置if文](https://qiita.com/y__sama/items/a2c458de97c4aa5a98e7#if%E3%82%92%E5%90%AB%E3%82%80%E5%A0%B4%E5%90%88%E5%BE%8C%E7%BD%AEif)

## 1108 Defanging an IP Address

該当の文字列を置き換えればよい問題。

```
class Solution:
    def defangIPaddr(self, address: str) -> str:
        return '[.]'.join(address.split('.'))
```

- ここで覚えるやつ
- [join](https://docs.python.org/ja/3/library/stdtypes.html#str.join)
- [split](https://docs.python.org/ja/3/library/stdtypes.html#str.split)
- [replace](https://docs.python.org/ja/3/library/stdtypes.html#str.replace)

## 412 [Fizz](http://d.hatena.ne.jp/keyword/Fizz) Buzz

[fizzbuzz](http://d.hatena.ne.jp/keyword/fizzbuzz)の結果をlistに追加していく問題。

```
class Solution:
    def fizzBuzz(self, n: int) -> str:
        result = []
        for i in range(1, n + 1):
            if (i % 3) == 0 and (i % 5) == 0:
                result.append("FizzBuzz")
            elif (i % 3) == 0:
                result.append("Fizz")
            elif (i % 5) == 0:
                result.append("Buzz")
            else:
                result.append(str(i))
        return result
```

- [append](https://docs.python.org/ja/3/tutorial/datastructures.html#more-on-lists)
- [unittest](https://docs.python.org/ja/3/library/unittest.html#module-unittest)

## 1365 How Many Numbers Are Smaller Than the Current Number

sorted()でiterableの要素を並べ替えた新たなリストを返し、index()で要素番号を出力する。

```
class Solution:
    def smallerNumbersThanCurrent(self, nums: List[int]) -> List[int]:
        return [sorted(nums).index(i) for i in nums]
```

- 覚えるやつ
- [index()](https://docs.python.org/ja/3/tutorial/datastructures.html)
- [sorted()](https://docs.python.org/ja/3/library/functions.html#sorted)
