---
title: 编译原理实验二
---

实验二要求依据我们在实验一建立起来的语法分析树，进行语义分析。

# 过程概览

1. 词法、语法分析，**先**得到一棵**语法分析树**；
2. 对语法分析树进行**遍历**，进行语义分析，（如果没有错误）得到**语义分析表**；

上课讲的声明语句(即填表)例子，是将填表过程(SDT)融合在语法分析过程(Bison)中的。

而实验手册的意思是先有树，再单独分析；可是，**分析的过程是需要用到SDT的哇**！如果不把SDT融合在Bison里，那还得**根据生成好的树**去**看每一步推导用了啥产生式**，进而确定具体的动作。

怎么`根据生成好的树去看每一步推导用了啥产生式`呢？==>**仿照自顶向下的递归分析**过程！



# 符号表

## 方案

链表（没能力的人是这样的呜呜）

## 符号表的表头

[**等浏览完实验三要求再说**]

1. 名字

2. 类型(变量?结构体声明?数组?函数?) 【注意补充类型】

3. 特性信息(根据类型来哩！) 

   > 对于**变量**至少要记录**变量名及其类型**
   >
   > 对于**函数**至少要记录其**返回类型、参数个数以及参数类型**

4. 相对地址

5. [链表么]下一项的地址

6. ...

## 什么时候填表？

> 当**分析到程序中的说明或定义语句**时, 应将说明或定义的名字，以及与之有关的特性信息填入符号表中。

而在`C--`文法中，`说明或定义语句`恰是`Def`和`ExtDef`，所以——

> 当**分析到`Def`和`ExtDef`时**，就要填表

更具体地说，是在声明全局变量、声明本地变量、声明结构体、声明结构体型的变量、声明函数的时候填表。

- 声明全局变量

  `ExtDef → Specifier ExtDecList SEMI`

  `ExtDecList → VarDec` -->当这里导出来`VarDec`时，就可以知道变量名字和类型，就能填表了。
  `ExtDecList → VarDec COMMA ExtDecList`-->当这里导出来`VarDec`时，就可以知道变量名字和类型，就能填表了。

  `VarDec → ID`-->这个能知道变量名字和基类型了！
  `VarDec → VarDec LB INT RB`-->这个出来之后，就能够构造数组类型了！需要把前一个VarDec的综合属性(基类型)

- 声明本地变量

  `CompSt → LC DefList StmtList RC`

  `Def → Specifier DecList SEMI`

  `DecList → Dec`
  `DecList → Dec COMMA DecList`
  `Dec → VarDec`-->当这里导出来`VarDec`时，就可以知道变量名字和类型，就能填表了。
  `Dec → VarDec ASSIGNOP Exp`-->当这里导出来`VarDec`时，就可以知道变量名字和类型，就能填表了。

  `VarDec → ID`-->这个能知道变量名字和基类型了！
  `VarDec → VarDec LB INT RB`-->这个出来之后，就能够构造数组类型了！需要把前一个VarDec的综合属性(基类型)

- 声明结构体

  `StructSpecifier → STRUCT OptTag LC DefList RC`

  `DefList → Def DefList`
  `DefList → 空`

  `Def → Specifier DecList SEMI`

  `DecList → Dec`
  `DecList → Dec COMMA DecList`
  `Dec → VarDec`-->当这里导出来`VarDec`时，就可以知道变量名字和类型，就能填表了。
  `Dec → VarDec ASSIGNOP Exp`-->当这里导出来`VarDec`时，就可以知道变量名字和类型，就能填表了。

  `VarDec → ID`-->这个能知道变量名字和基类型了！
  `VarDec → VarDec LB INT RB`-->这个出来之后，就能够构造数组类型了！需要把前一个VarDec的综合属性(基类型)

- 声明结构体型变量

  同全局/局部变量

- 声明函数

  `ExtDef → Specifier FunDec CompSt`--`FunDec`出来后就能搞了

  `FunDec → ID LP VarList RP`
  `FunDec → ID LP RP` 

无论声明啥，都绕不过一个砍：`Specifier`，提供了基类型

无论声明啥，只有遇到了（树中最底层的）`VarDec`才能真·确定类型

## 什么时候查表？

> 正如实验1的难点在于和报错相关的`error`产生式书写，
>
> 实验2的难点在于什么时候进行查表(ww)

- **填表前查表**

  - 在定义的时候--**重复定义**或声明结构体时**结构体类型未定义**

    > 注：据假设4，所有变量的作用域都是全局的，即程序中声明的变量不能有重名的

    - 错误类型3：**变量**出现**重复定义**，或**变量**与前面定义过的结构体名字重复

      `VarDec → ID`

    - 错误类型4：函数出现**重复定义**（即同样的函数名出现了不止一次定义）

      `FunDec → ID LP VarList RP`
      `FunDec →  ID LP RP`

    - 错误类型16：**被定义**结构体的名字与前面**定义**过的结构体或变量的名字**重复**

      `StructSpecifier → STRUCT OptTag LC DefList RC`

    - 错误类型17：直接使用**未定义**过的**结构体**来**定义变量**。

      `StructSpecifier → STRUCT Tag`

      方案：查`Tag`
      
    - 错误类型15：结构体中**域名重复定义**（指同一结构体中），或在**定义时对域进行初始化**（例如struct A { int a = 0; }）。

      `Dec → VarDec ASSIGNOP Exp`重复好说，初始化就看这个产生式啦！

  - 检查名字的种类是否与说明一致

  - 检查表达式中各变量的类型是否一致

- **遇到`Exp`成分**

  > 每当遇到语法单元`Exp`，说明**该结点及其子结点们**会**对变量或者函数进行使用**，这个时候应当查符号表以确认**这些变量或者函数是否存在以及它们的类型是什么**

  - 错误类型1：变量在使用时**未经定义**

    `Exp --> ID`

  - 错误类型2：函数在调用时**未经定义**

    `Exp --> ID LP Args RP`

    `Exp --> ID LP RP`

  - 错误类型5：**赋值号**两边的**表达式类型不匹配**。

    `Exp → Exp ASSIGNOP Exp`

    `Dec → VarDec ASSIGNOP Exp`

  - 错误类型6：**赋值号左边**出现一个只有**右值**的表达式。

    `Exp → Exp ASSIGNOP Exp`

    `Dec → VarDec ASSIGNOP Exp`

    方案：**常数、表达式和函数调用**一般只有右值而没有左值，反过来也就是只有`Exp LB Exp RB`、`Exp DOT ID`、`LP Exp RP`、`ID`行

  - 错误类型7：**操作数类型不匹配**或**操作数类型与操作符**不匹配（例如整型变量与数组变 量相加减，或数组（或结构体）变量与数组（或结构体）变量相加减）。

    `Exp → Exp AND Exp`

    `Exp → Exp OR Exp`

    `Exp → Exp RELOP Exp`

    `Exp → Exp PLUS Exp`

    `Exp → Exp MINUS Exp`

    `Exp → Exp STAR Exp`

    `Exp → Exp DIV Exp`

    `Exp → MINUS Exp`

    `Exp → NOT Exp`

  - 错误类型8：return语句的**返回类型**与函数定义的返回类型**不匹配**。

    `Stmt → RETURN Exp SEMI`

    方案：得看当前`Stmt`所在的`CompSt`对应的函数的声明...(目前的想法是整一个临时变量来记录)

  - 错误类型9：函数**调用时实参与形参**的数目或类型不匹配。

    `Exp --> ID LP Args RP` 对于这一条关注Args

    `Exp --> ID LP RP`

  - 错误类型10：对**非数组型**变量使用“[…]”（**数组访问**）操作符。

    `Exp → Exp LB Exp RB`

    方案：看**右部第一个**`Exp`是不是数组类型

  - 错误类型11：对**普通变量**使用“(…)”或“()”（**函数调用**）操作符。

    `Exp --> ID LP Args RP`

    `Exp --> ID LP RP`

  - 错误类型12：**数组访问**操作符“[…]”中**出现非整数**（例如a[1.5]）。

    `Exp → Exp LB Exp RB`

  - 错误类型13：对**非结构体**型变量**使用“.”操作符**。

    `Exp → Exp DOT ID`

    方案：看右部第一个`Exp`是不是结构体

  - 错误类型14：访问**结构体中未定义过的域**。

    `Exp → Exp DOT ID`

    方案：看右部第一个`Exp`的`Struct`的定义

- **生成目标代码时**，需要查表以取得所需要的地址或者寄存器编号

# 细节

## DefList

DefList会出现在三个地方

1. `StructSpecifier → STRUCT OptTag LC DefList RC`
2. `CompSt → LC DefList StmtList RC`

对于(1)，我们期望能够返回一个`FieldList`类型的综合属性，并且对于`DefList`中的每一个声明的变量，我们不把它加入符号表；

对于(2)，则没有必要返回`FieldList`类型的综合属性，但是要把`DefList`中的每一个声明出来的变量写入符号表。