---
title: 在 C++ 中传递数组的正确姿势
date: 2020-10-11 15:55:27 +08:00
tags: [Cpp]
---

今天看 STL 源码的时候注意到一个有意思的地方，获取定长数组的长度 `std::size` 函数的简单实现如下：

```cpp
template <class _Ty, size_t _Size>
constexpr size_t size(const _Ty (&)[_Size]) noexcept {
    return _Size;
}
```

如果阅读这个代码有些困难，它的一个特化实现可以简单写成下面这样：

```cpp
template <size_t _Size>
size_t size(const int (&)[_Size]) {
    return _Size;
}
```

看到这个函数我愣了几秒钟，这个函数的参数 `const int (&)[_Size]` 里的 `(&)` 是什么鬼？

根据 & 符号出现的位置判断，它应该是表示数组引用，因为平时从来没用过数组的引用这种写法，赶紧敲一行代码试试

```cpp
int arr[1] = {};

int (&wtf)[1] = arr;
wtf[0] = 1;

assert(arr[0] == 1);  // pass
```

确认了自己的判断，也就不难理解 `std::size` 的原理了。但是突然感觉自己的记忆出现了偏差，几年前课本上教的传递数组的方式应该是下面这样啊：

```cpp
// 传递定长数组
void DoSomething(int arr[10]) {
    // ...
}
```

心里有了一些疑问，用传值的方式传递的数组，和传递引用的方式有什么区别吗？重新实现一个传值方式的 size 函数测试一下

```cpp
template <size_t _Size>
size_t size(const int [_Size] /* 去掉了(&) */) {
    return _Size;
}

int arr[10];
size(arr);  // compile error
```

发现编译直接报错了，报错信息是参数列表不匹配，不能从 `int[10]` 为 `const int [_Size]` 推导模板参数。更有意思的是，宇宙第一编译器提示我 size 函数的签名是这样的

![IntelliSense](@assets/images/2020/cpp-passing-array-to-functions/IntelliSense.jpg)

原来模板实例化以后产生的函数所需参数是 `const int *` 类型的，所以 \_Size 模板参数是无法推导的，所以如果我直接传递一个 \_Size 进去

```cpp
int arr[10];
constexpr auto len = size<9>(arr);
```

编译器会好心的告诉我，len 的结果是 9，和 arr 的长度无关。

难道之前课本上看到的方法是错误的吗？再写个函数测试一下

```cpp
// 传递定长数组
void DoSomething(int arr[10]) {
    constexpr auto len = sizeof(arr);
}
```

编译器又开心的提示我，len 的值是 4，验证了 `int arr[10]` 在参数中会退化成 `int*`。为了进一步验证这一点，再写一个函数测试一下：

```cpp
// 传递定长数组
void DoSomething(int arr[10]) {
}

int arr[9];
DoSomething(arr);  // compile success
```

也就是说，所谓的传递定长数组其实编译器并不会进行检查，而且长度不一样也是不会报错的。

如果你在网站上直接搜索 `C++传递数组`，大部分资料告诉你的仍然是错误的

![tutorialspoint 教程](@assets/images/2020/cpp-passing-array-to-functions/sized-array.jpg)
![菜鸟教程](@assets/images/2020/cpp-passing-array-to-functions/sized-array-2.jpg)

看起来，想要学好 C++还需要一些侦探思维，什么东西都要怀疑一下呢。
