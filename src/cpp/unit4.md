---
title: C++ Primer Plus 第四章阅读笔记 - 复合类型
---

# 数组

数组是一种数据格式，能够存储多个**同类型**的数值。

声明数组的通用格式：

```c++
typeName arrayName[arraySize];
```

## 初始化数组元素

我们可以使用大括号初始化方法**在声明时**（且**仅**在声明时）将数组初始化。

```c++
int scores[5] = {1, 2, 3, 4, 5};
```

不能将一个数组直接赋值给另一个数组。

```c++
int scores[5] = {1, 2, 3, 4, 5};
int ranks[5] = scores;//not allowed
```

初始化时提供的**元素值的个数**可以**少于**数组的**元素数目**，此时其他元素会被设置为`0`。

```c++
int scores[5] = {0, 1};
cout << scores[2];//0
```

> 于是如果想把数组全部初始化为0，可以这么做：
>
> ```c++
> int scores[5] = {0};
> int scores[5] = {};//c++11，略掉了0
> int scores[5]{};//c++11，略掉了等号和0
> ```

初始化时不提供`[]`内的值，那么C++编译器将自动计算元素个数。

值得一提的是，使用列表初始化时，不允许**缩窄转换**（备忘：硬赋“吃不下”的值）。

## 针对数组的`sizeof`

`sizeof`作用于**数组名**，得到的是整个数组的字节数；作用于数组中的某个元素，则是单个该元素占用的字节数。

```c++
int scores[5] = {1, 2, 3, 4, 5};
cout << sizeof scores << endl;//20 p.s. 4 * 5 = 20
cout << sizeof scores[2] << endl;//4
```

# 字符串

> 此处先介绍C风格字符串（char数组），下一小节介绍`string`类

`char`数组不一定是字符串，因为字符串要求以`\0`结尾。如果一个`char`数组并未以`\0`结尾，那么不应视为字符串处理，更不应使用相关函数对其进行处理，否则这些函数会一直顺着内存读下去，直至遇到`\0`。

```c++
char c1[] = {'h', 'i'};//Not a string
char c2[] = {'h', 'i', '\0'};//Right
```

## 初始化字符串

我们可以使用**字符串常量**对`char`数组进行初始化

```c++
char c1[] = "Aoligei!";
```

用**双引号**扩起的字符串**隐式地包括结尾的空字符**，譬如：

```c++
char c1[8] = "Bozo";
// B o z o \0(这个是自动加到字符串末尾的，后续其他的也会设置为\0) \0 \0 \0
```

::: danger 区分字符常量和字符串常量

字符常量用**单引号**包裹，**本质是**字符串**编码**的简略表示。在ASCII系统中，`'s' == 83`，`'s'`只是`83`的另外一个写法罢了。

字符串常量用**双引号**包裹，如`"s"`，其代表由`'s'`、`'\0'`组成的字符串。C++中视为字符串**所在的内存地址**。

:::

## 字符串常量拼接

任何两个被空白（空格、制表符、换行符）分割开来的字符串会被自动拼接成一个。

```c++
char c1[] = "Aoligei!"
            "Split!";
cout << c1;//Aoligei!Split!
```

## `strlen`的使用

要想使用`strlen`，需要包含`cstring`头文件。

`strlen`只计算可见字符，且不把空字符`\0`计算在内。

## 读取字符串

我们可以使用`cin`来读取字符串。

```c++
char c1[20] = {};
char c2[20] = {};
cin >> c1;
cin >> c2;
```

请注意：如果在读取`c1`的时候，输入了`Ao ligei`并按下回车，那么会赋给`c1`为`Ao`，且赋给`c2`为`ligei`。这和`cin`的实现有关系。其以**空白（空格、制表符和换行符）来确定字符串的结束位置**，因而会把`Ao`赋给`c1`，此时缓冲区里还有`ligei\n`，于是接下来的`cin`便直接将`ligei`赋给了`c2`。

## `cin.getline()`和`cin.get()`

这两个函数和普通的`cin`区别在于：`getline`和`get`**仅以换行符作为字符串结束的标志**，亦即一次可以读取一行，而不管中间有没有空格。

用法：`cin.getline(name, ArSize)`，`cin.get(name, ArSize)`

`getline`和`get`的区别在于：`getline`会把缓冲区中的`\n`读取并丢弃掉，而`get`并不会。所以当使用`get`来读取一行的内容时，通常还需要再调用（什么也没有的参数）`get`手动读取掉（下一个字符）`\n`，如：

```c++
char c1[20];
cin.get(c1, 10).get();
```

`cin.get(c1, 10)`返回一个`cin`对象，所以后边还能再跟一个`.get()`。

`cin.get(name, ArSize)`的一个好处在于：可以知道停止读取的原因（是读够了，还是遇到`\n`了？）。只需读完后再调用`cin.get()`获取下一个字符，查看是不是`\n`即可。

## 读取空行

使用`cin.get()`（`cin.getline()`不会）读取到空行时，会设置一个失效位，阻塞下面所有的`cin`相关输入，此时需要用`cin.clear()`来重置失效位。

## 混合`cin`和`cin.getline()`

`cin`从输入流中获取字符串后，不会清掉buffer，如果接着用`cin.getline()`，那么会得到一个空串。

```c++
char c1[30]{};
char c2[30]{};

cin >> c1;
cin.getline(c2, 30);
cout << "c1: " << c1 << endl;
cout << "c2: " << c2 << endl;
```

键入`hello`后按下回车，（还没输入`c2`的值）输出为：

```bash
c1: hello
c2: 
```

解决方法也很简单，只需将`cin >> c1;`改成`(cin >> c1).get();`（是的！`cin >> c1`也会返回一个`istream`对象出来！）



# string类简介

`string`类**隐藏了**字符串的`char`**数组性质**，使得我们可以像使用普通变量那样处理字符串。

- 可以使用C风格字符串来初始化`string`对象：`string x = "hello";`
- 可以使用`cin`来将键盘中的输入存储到`string`对象中：`cin >> x;`
- 可以使用`cout`来显示`string`对象：`cout << x;`

类设计使得`string`对象可以自动调整大小。譬如我们在声明`string`对象时，并没有像使用`char`数组那样，指定元素个数。

## 初始化`string`

既可以用C风格字符串，也可以用列表初始化。

```c++
string x1 = "Hello,";
string x2 {"world!"};
```

## `string`对象身上的操作

我们可以将一个`string`对象**赋给**另一个`string`对象，这也算是**复制**操作了。（`char`数组就不能这么玩，并且还要用`strcpy`函数）

```c++
string x1 = "Hello";
string x2 = x1;
```

我们可以用`+`运算符将两个`string`对象合并起来。（如果是`char`数组得用`strcat`函数）

```c++
string x3 = x1 + x2;
```

我们可以用类方法`size()`来获取字符串长度。（如果是`char`数组得用`strlen`函数）

```c++
cout << x1.size();
```

## `string`类IO

要想**读取一行数据**到`string`对象中，原来的`cin.getline()`不能用了，需要换个法子了。

```c++
char c1[30];
string s1;
cin.getline(c1, 20);
getline(cin, s1);
cout << c1 << endl;
cout << s1 << endl;
```

`cin`被设计的时候，还没有`string`类呢！所以不能直接用`cin`的`getline()`方法为`string`对象赋值。

那为什么可以采用`cin >>`给`string`类赋值呢？这涉及到友元函数的用法！后面会谈到...

## 其他形式的字符串字面值

### 复习`wchar_t`、`char16_t`、`char32_t`

对于这三种类型的字面值，我们使用前缀`L`、`u`、`U`来标识。

对于UTF-8字面值，可以使用前缀`u8`来标识。

### 原始字符串

在正常的字符串字面值中，我们需要使用`\`对很多字符进行转义，这一点也不酷。于是**原始字符串**出来了！它允许我们在字符串字面值内直接使用一系列符号而无需转义。

我们可以在字符串前面加上前缀`R`来表示原始字符串，使用`"(`和`)"`来标识字符串的开始和结束。

```c++
cout << R"(" \n Aoligei \\\)";//" \n Aoligei \\\
```

如果说想在字符串中包含`"(`和`)"`怎么办？我们可以在`"`和`(`中添加字符（对应的`)`和`"`中也要添加），替换掉原本的定界符`"(`和`)"`，这样就能在原始字符串中包含`"(`和`)"`了。

```c++
cout << R"+( can accommodate"( )")+";
```

# 结构简介

相较于数组只能存储同一个类型的数据，一个结构可以存储多个类型的数据。



## 定义与声明

下面是一个声明结构的例子：

```c++
struct inflatable {
    char name[20];
    float volume;
    double price;
};
```

`C++`提倡**在外部**声明结构。

利用结构声明新变量时，不用像C语言那样，还得在前面加个`struct`了！

```c++
inflatable hat;
```

## 访问成员

可以使用成员运算符`.`来访问结构的成员：

```c++
hat.price = 90.8;
```

## 初始化结构变量

使用列表初始化：

```c++
inflatable hat = {"Aoligei", 1.88, 29.99};
```

照旧，等号可以省略，且仍然不允许缩窄转换

## 成员可以是`string`类型的对象

```c++
struct inflatable {
    string name;//can be string
    float volume;
    double price;
};
```

## 结构赋值

C++中允许使用**赋值运算符**将结构赋给另一个**同类型的**结构。

```c++
inflatable hat = {"hat", 9.9, 8.8};
inflatable cat = hat;
```

## 结构数组

我们也可以创建**元素为结构的数组**。在初始化时，我们用大括号为数组中的每个元素赋值，为每个元素赋值的时候使用结构初始化，所以看上去就是大括号里头套大括号的样子。

```c++
inflatable guests[2] = {
    {"Geng", 2.0, 9.9},
    {"Wang", 9.0, 2.8}
};

cout << guests[0].name;
```

# 共用体

共用体是一种数据格式，可以从自行设计**若干种类型中选择一种**进行存储。

```c++
union num {
    short short_val;
    int int_val;
    long long_val;
};

num n1;
n1.int_val = 10;cout << n1.int_val << endl;
n1.long_val = 20;cout << n1.long_val << endl;
```

共用体最大的用途是：当某个数据项可能会从两种或两种以上的格式中选一个时，节省空间。譬如：有些商品的ID是字符串，有些商品的ID是数字，我们可以这么操作：（用一个`type`变量标志用的是哪种`id`）

```c++
struct good {
    int price;
    int type;
    union id {
        char id_string[20];
        int id_int;
    } id_val;
};

good good1 = {1, 1};
good1.id_val.id_int = 10;
//...

if (good1.type == 0)
    cout << good1.id_val.id_string;
else
    cout << good1.id_val.id_int;
```

上面的代码是有一些冗余的，比如``good.id_val.id_int`， 还得先来一个`id_val`，才能有`id_int`。

我们可以使用**匿名共用体**来解决这个问题：

```c++
struct good {
    int price;
    int type;
    //注意看这里的union！
    union{
        char id_string[20];
        int id_int;
    };
};

good good1;
good1.id_int = 10;

if (good1.type == 0)
    cout << good1.id_string;
else
    cout << good1.id_int;
```

> 突然发现一个很好玩的事情，那就是`union`当中不能让`string`类成为其成员。搜到的结果是：`c++中的union中数据成员是不允许有构造函数的`，现在学的少，还不太能理解。日后把这个坑给填上。

# 枚举

枚举是另一种**定义符号常量**的方法。

## 定义与声明

同结构类似，枚举也需要先定义，再声明。

```c++
enum fruit {apple, orange, pinapple};
fruit good;
```

