---
title: C++ Primer Plus 第二章阅读笔记 - 开始学习C++

---

# 进入C++



```c++
#include <iostream>
using namespace std;

int main(){
    cout << "Hello, world!" << endl;
    return 0;
}

```



## 头文件名

C语言的传统是头文件使用拓展名`.h`，但是C++的头文件**没有**拓展名。

C++仍然支持老式的C语言的`.h`头文件，且有些C语言的`.h`头文件被转换成了C++的头文件，去掉了`.h`，并在前面加上了`c`（例如：`math.h`-->`cmath`）。

C++的头文件可以包含**名称空间**。

## 名称空间

**不同的库**可能定义**相同名称的函数**，为了区分，我们可以使用名称空间来指定到底使用哪个函数。

我们经常见到`using namespace std;`这句指令，这个叫做`using`编译指令，表明我们可以使用`std`名称空间中定义的名称而不用加上`std::`（譬如`std::cout`-->`cout`）。

这样会使得`std`中所有函数都不用加`std::`了，可能带来潜在风险。好的做法是仅使所需的名称可用，如`using std::cout;`。

## 使用`cout`进行C++输出

```c++
cout << "Hello, world!";
```

我们可以理解为，所谓的输出，其实是将`Hello, world!`这个字符串**插入**到`cout`对象表示的**输出流**当中。`cout`对象是`ostream`对象的实例。

### 运算符重载

`<<`作用于`cout`时，被理解为插入运算符。我们还知道，`<<`也是左移运算符号。C++拓展了运算符重载的概念，允许为用户定义的类型重新定义运算符的含义。

### 控制符`endl`与换行符`\n`

`endl`对于`cout`来说是一个控制符，表示重启一行。

```C++
cout << "重启一行" << endl;
```

也可以使用C语言符号`\n`进行换行。

```c++
cout << "重启一行\n";
```

两者的区别是：`endl`会清空缓冲槽，但是`\n`不会。

## C++源代码的格式化

一行代码中**不可分割**的元素叫做**标记**（`token`），空格、制表符和回车统称为**空白**（`white space`）。

# C++语句

## 声明语句和变量

要将信息项存于计算机中，需要指出**存储位置**和**存储空间**。而**声明语句**恰好能指出存储类型、提供位置标签。

```c++
int carrots;
```

`int`既指明了数据类型，也指明了**存储空间大小**——要能够容下一个`int`，`carrots`指明了**内存单元的名称**。

## 赋值语句

我们可以**连续**使用赋值运算符，此时赋值操作**从右向左**进行。

```c++
int x, y, z;
x = y = z = 10;
//10 --> z, z --> y, y --> x
```

## `cout`的新花样

在C语言使用`printf`时，我们通常要显式的指明各个变量的类型，才能正确输出。

但是，如果使用`cout`，并不用显式指明。

```c++
cout << 25;
cout << "25";
//均在控制台打印出25
```

这是因为C++的插入运算符将**根据其后面的数据类型自动调整**行为。

# 其他C++语句

## 使用`cin`

我们可以使用`>>`运算符从`cin`输入流中抽取字符。

值得注意的是，并不需要像C语言中用`scanf`那样，指明欲读取数据的类型、数据存放的地址。`cin`对象是`istream`对象的实例。

```c++
int x;
cin >> x;
```

## 给类发送消息

给类发送消息有两种方式，一种是**调用类方法**，另一种方式是**重新定义运算符**（如`cout << "Hello, world"`当中的`<<`）。

# 函数

## 函数原型

C++编译器必须知道函数的**参数类型**和**返回值类型**，C++提供这种信息的方式是使用**函数原型**语句。我们通常把函数原型放在`main`函数前面。

譬如，`sqrt`函数的原型像这样：

```c++
double sqrt(double);
```

> 注：书上这里参数列表中`double`后面没有跟变量名称。实测在CLion中，如果不跟变量名称，会有2个自动提示。

原型最后的分号，表明它是一个**原型**，而不是**函数头**。如果没有分号的话，编译器会认为这一行是函数头，后面应该接上**函数体**。

**头文件提供了原型**，库文件提供了函数的编译代码。

## `main`函数的返回值

`main()`的返回值返回给操作系统，如果是`0`则代表程序运行成功，不是`0`则代表出现了问题。