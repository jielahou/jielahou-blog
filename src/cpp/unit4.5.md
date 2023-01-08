---
title: C++ Primer Plus 第四点五章阅读笔记 - 指针和自由存储空间
---

# 指针与C++基本原理

面向对象编程和传统的过程性编程的区别在于，OOP强调在运行阶段（而不是编译阶段）进行决策。

起初要使用数组，就必须要写死元素个数。但是OOP中可以通过关键字`new`和`delete`在运行时动态分配内存。虽然C也可以使用`malloc`和`free`实现类似效果，但是C++会更易用一些。

常规变量使用`&`来获取地址，指针变量用`*`来获取该地址存储的值。

## 声明和初始化指针

对于下面的声明，`x1`是`int`类型的指针，但是`x2`不是指针哟！

```c++
int* x1, x2;
```

如果想让`x2`也是指针，应该这么玩：

```c++
int *x1, *x2;
```

这里注意到了，`*`的前后都可以加（去）空格，所以也可以：

```c++
int*x1,*x2;
```

## 指针的危险

在对一个指针解引用`*`之前，一定要记得**将指针初始化**啊！

## 指针和数字

指针和数字是截然不同的两个类型，虽然指针本质是记录存储位置的数。譬如数字可以加减乘除，但是指针的乘除没有意义。

C++对于类型一致的要求更为严格，所以我们**不能直接把一个数字赋给一个指针**。

```c++
int* x1;
x1 = 0xB8000000;//invalid, Incompatible integer to pointer conversion assigning to 'int *' from 'unsigned int'
```

真想赋，那就得类型转换：

```c++
int* x1;
x1 = (int*)0xB8000000;
```

## 使用`new`来分配内存

指针的最大用途是：在**运行时**分配未命名的内存来存储值。

```c++
typeName * pointer_name = new typeName;
```

> 值得一提的是，在C语言中，我们使用`malloc`和`free`进行分配和释放内存。那么在C++中，虽然`malloc`和`free`还可以再接着用，但是用的时候一定要注意“配对”，`malloc`来的，一定要用`free`解决掉。
>
> 对于“配对”的问题，如果使用`new`创建数组（则意味着有`[]`），那么`delete`的时候也一定要加上`[]`。

**变量**从**栈**中分配内存块，**`new`**从**堆**中分配内存块。

## 使用`delete`来删除内存

```c++
int * ps = new int;
delete ps;
```

- 只能用`delete`删除由`new`获得的指针地址
- `delete`不能将一个地址释放两次，否则结果不确定
- 对于空指针，使用`delete`是安全的

## 使用`new`来创建动态数组

### 创建动态数组

```c++
typeName * pointer_name = new type_name [num_elements];
```

对应的使用`delete`释放内存时，也要带上`[]`。方括号告诉`delete`，释放的是整个数组，而不仅仅是指向数组的元素。

```c++
delete [] pointer_name;
```

### 使用动态数组

我们可以像使用普通数组那样使用动态数组。

```c++
int * array = new int [10];
array[0] = ...;
array[1] = ...;
```

普通数组名和指针的区别在于，指针是个变量，可以做加减法、被修改。数组名不能被修改。

```c++
array = array + 1;//valid
```

一个有趣的问题：`array`加1后变成了什么？答案是：变成了**下一个元素的地址**，而不是纯粹的在原本的地址上加上1。

```c++
int *x1 = new int [100];
cout << x1++ << " vs " << x1;
//0x562acce3eeb0 vs 0x562acce3eeb4
//@jielahou
```

# 指针、数组和指针算术

> 上面只是简单的开了个头，介绍了下指针和数组名的关系，下面接着探讨。

## 指针和数组名的联系

C++中，大多数情况下将**数组名**解释为数组中**第一个元素的地址**，即：

```c++
double wages[3] = {2.0};
//于是下面的等式成立
wages == &wages[0];
```

既然数组名是地址，所以**下面两种表示法**（数组表示法、指针表示法）**是等价的**。（事实上，C++会对数组表示法转换成指针表示法。）

```c++
arrayName[1] ==> *(arrayName + 1)
```

## 指针和数组名的区别

前面提到：

- **指针变量加1**后，增加的量等于它**指向类型的字节数**
- 数组名的区别之一在于**数组名是常量**，而**指针是变量**

第二个区别在于：对数组名使用`sizeof`，得到的是整个数组占得空间；对指针使用`sizeof`，得到的是指针占的空间。

```c++
int *x1 = new int [20];
int x2[20];
cout << sizeof x1 << endl;//8
cout << sizeof x2 << endl;//80
```

## 数组名的地址？

如果`tell`是**数组**名，那么`&tell`是什么东西？

从数值上看，两者的值是相等的。

```c++
int tell[20];
cout << tell << endl;//0x7ffca1cf7ea0
cout << &tell << endl;//0x7ffca1cf7ea0
```

我们知道，指针是有类型的。`&tell`是**指向“一整块”数组**的指针。（回忆`tell`是指向第一个元素的指针）不信，加个1看看。

```c++
int tell[20];
cout << &tell << endl;//0x7ffd8ab62de0
cout << (&tell) + 1 << endl;//0x7ffd8ab62e30
cout << tell << endl;//0x7ffd8ab62de0
cout << tell + 1 << endl;//0x7ffd8ab62de4
```

可以看到，`(&tell) + 1`和`&tell`正好差了80，即20个4字节`int`。而`tell + 1`和`tell`只差了4，即1个4字节`int`。

对于`int tell[20]`，`&tell`的类型实际上为`int (*)[20]`。

```c++
int (*pointer)[20] = &tell;//如果没有括号，pointer先和[20]结合，pointer实际上变成了存储20个(int *)类型的数组
```

# 指针和字符串

::: info

请注意，我们这里说的字符串，是C风格的字符串，亦即使用`char`数组表示的字符串。

:::

## 字符串字面值的本质

```cpp
char flower[10] = "rose";
cout << flower << "s are red";
```

我们知道，`flower`是指向`"rose"`字符串中字符`'r'`的地址，将该地址传给`cout`，`cout`可以从该地址打印字符，直到遇见`'\0'`为止。

由此我们猜测：后面的`"s are red"`应该也是一个地址，事实确实如此。在`cout`和大多数C++表达式中，用**引号括起的字符串常量**都被解释为**字符串第一个字符的地址**。

既然用引号括起的字符串常量都被解释为字符串第一个字符的地址，那么我们便可以声明一个指针，指向字符串常量中的第一个字符。

```cpp
char * test = "Aoligei!";//not good, ISO C++11 does not allow conversion from string literal to 'char *'
const char * test = "Aoligei";//valid
```

我们发现，如果不加`const`，会报Warning。这是因为字符串字面值是常量，如此声明`const`指针意味着我们不能修改这个字符串。（`const`指针在第七章会介绍）

## 字符串字面值的存储

- 字符串**字面值**通常会存储到内存的只读部分，如果动这块内存程序可能会蹦（`segmentation fault`叻！）

- 有些编译器只是用字符串字面值的一个副本来表示程序中所有的该字面值。譬如我在某处写了个字面值`"jielahou"`，在另一个地方又写了一个`"jielahou"`，那他们指向的地址有可能是相同的。动了一个地方，另一个也跟着动（虽然我们可能不希望另一个动）。

## 输出字符串的地址

```cpp
const char * name = "Jielahou";
cout << name << endl;

int * age = new int;
cout << age << endl;
```

`name`和`age`都是指针，由于`cout`特性，第一处给`cout`传了`char *`类型变量，输出字符串字面值，第二处给`cout`传了`int *`类型变量，输出指针的十六进制值。

问题是：我想使用`cout`输出`name`实际指向的地址，怎么操作？

我们可以使用类型强转，转成另一个类型的指针类型就可以了。

```cpp
const char * name = "Jielahou";
cout << (int*)name << endl;
```

## `strcpy`和`strncpy`的注意事项

`strcpy`不管另一个地方的开的空间够不够，只会将数据从一个地方搬到另一个地方，有可能会覆盖掉不该修改的数据段。

`strncpy`虽然可以指定最多复制的字符个数，但是如果被赋值的字符串字符个数超了限定，在复制够足够的字符后，不会主动补上`'\0'`，要我们手动操作。

```cpp
char name[] = "Hello!";
char * ps = new char[strlen(name) + 1];
strncpy(ps, name, 6);
ps[6] = '\0';
cout << ps;
```

