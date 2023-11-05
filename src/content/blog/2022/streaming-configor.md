---
title: 将 configor 重构为流式调用
date: 2022-10-10 15:25:00 +08:00
description: 最近有一个重构 configor 的想法，把它的序列化操作改为流式调用。
tags: [Cpp]
---

最近有一个重构 [configor](https://github.com/Nomango/configor) 的想法，那就是把它的序列化操作改为流式调用。

之前，序列化一个对象的代码是这样的：

```cpp
User u{"John", 18};         // 用户自定义对象 u
std::cout << json::wrap(u); // 序列化到 std::cout 输出
```

它实际的执行流程大概如下

```cpp
configor::value v = u;                  // 借助ADL转换为 configor::value 类型
json::serializer{}.dump(std::cout, v);  // 通过 json::serializer 进行编码
```

执行时必须产生一个中间变量 value，但它的作用仅仅是为 serializer 提供标准化的类型，因为 serializer 不能接受任意类型为参数。

如果以流式调用的方式，伪代码可以是这样：

```cpp
json::istream{ u } >> json::ostream{ std::cout };
```

这和 std::basic_i/ostream 做的事情很相似，毕竟 `std::cout << 100` 本身就是一种序列化，所以重构时完全可以参考标准 IO 流的实现方式，只不过标准 IO 流传递的是各种 `char` 类型，configor 的流传输一种**不存储具体数据**的中间类型（暂且记为 `token` 类型）。

为了命名上不和标准库撞车，不妨给 configor 的流起个新名字 `tokenization`。

## tokenization 设计

这时序列化的执行过程应该是这样的：

```cpp
json::itokenization in{ u };            // 输入流，从 u 输入
json::otokenization out{ std::cout };   // 输出流，输出到 std::cout

// 完成 u 的序列化
token t;
while (in >> t)
    out << t;
```

设想很美好，但是由于输入和输出都可以是不同的类型，tokenization 本身必须知道自己的输入输出方式，就像 std::stringstream、std::filestream 那样，区分成不同的类型更为合适：

```cpp
// stream tokenization，接受 std::basic_i/ostream 为参数
json::istream_tokenization(std::cin)
json::ostream_tokenization(std::cout)

// any tokenization，接受用户自定义类型为参数
json::iany_tokenization(u)
json::oany_tokenization(u)

// value tokenization，接受 configor::value 为参数
json::ivalue_tokenization(v)
json::ovalue_tokenization(v)
```

类似 std::i/ostream_iterator，configor 也可以提供迭代器用法

```cpp
json::itokenization in{ u };            // 输入流，从 u 输入
json::otokenization out{ std::cout };   // 输出流，输出到 std::cout

// 完成 u 的序列化
std::copy(json::itoken_iterator(in), json::itoken_iterator(), json::otoken_iterator(out));
```

有了 token 流，我们就可以在 custom class、configor::value、std::basic_i/ostream 之间任意转换，这样就模糊了 dump、parse 这些专有名词，也不再会有 serializer、parser 这些东西了。

## token 设计

接下来要设计的是 iterator 之间传输的方式，也就是中间类型 `token` 如何设计。因为我们想避免的是数据的额外拷贝，那么 token 一定不能携带具体数据，而是提供 method 提取数据，例如这样：

```cpp
template <class T>
class token
{
public:
    // token 类型
    token_type type() const;

    // 如果 token 是 integer 类型，那么可以调用该方法获取 integer 值
    virtual void get_integer(T& v) = 0;
};
```

`token_type` 不仅仅包含值类型（integer、float、string 等），还包括 object_begin、object_end 之类的标志类型，如一个合法的 json token 序列可以是这样：

```
charactor | token_type
-------------------------------
{         > object_begin
"k"       > object_key, string
:         > object_value
1         > integer
}         > object_end
```

短短 7 个字符的 json 字符串会被分解成 6 个 token。

具体实现时，这里隐含一个问题，输入迭代器生成的 token 只能提供一种确定类型的 integer 如 int32_t，但是输出迭代器可能想得到一个 int64_t，所以无法直接传引用到 get_integer 方法。

幸好我们的值类型只有三种，即 integer、float、string，我们可以给 token 提供默认的模板参数，让输入输出迭代器提供相同类型的 token。

```cpp
template <class IntT = int64_t, class FloatT = double, class CodeT = uint32_t>
class token;

template <class IntT, class FloatT, class CodeT>
class token
{
public:
    // token 类型
    token_type type() const;

    // 如果 token 是 integer 类型，那么可以调用该方法获取值
    virtual IntT get_integer() = 0;

    // 如果 token 是 float 类型，那么可以调用该方法获取值
    virtual FloatT get_float() = 0;

    // 如果 token 是 string 类型，那么可以多次调用该方法获取字符串解码后的 codepoint 序列
    virtual CodeT get_codepoint() = 0;
};
```

这样只需要在输入和输出时分别做一次 static_cast 即可，对于比较麻烦的字符串类型，幸好 configor 已经支持了字符串编解码，一个字符串会变为 array&lt;codepoint&gt; 类型的序列，所以只要多次调用 get_codepoint 同样可以支持。

## 递归转循环

之前 serializer::dump 是用递归的方式层层深入对象结构，实现起来比较简单，改为流式以后可能需要用压栈出栈的方式保存遍历信息。

比如一个这样的对象：

```json
{
  "name": "John",
  "mother": {
    "name": "Mary",
    "age": 50
  },
  "age": 18
}
```

遍历到 `obj["mother"]` 时，需要将 `obj["mother"]` 入栈，进而遍历 `obj["mother"]["name"]`，并在遍历完 mother 之后将 `obj["mother"]` 出栈，继续遍历下一个字段 `obj["age"]`。

入栈出栈的对象是 configor::value::iterator，如果是用户自定义类型，入栈出栈的是字段的指针。

## 总结

思路理顺了，实现起来并不难，正好赶上最近换工作，也许这个空档期可以搞定。
