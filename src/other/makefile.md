---
title: Makefile初体验
---

> 假设我们要从`program1.c`、`program2.c`、`main.c`编译出目标文件`test`
>
> 教程来自于[CSDN](https://blog.csdn.net/Nire_Yeyu/article/details/106373974)，感谢原作者的总结！

# 第一阶段：基本语法

Makefile的基本语法有两条：

1. `[目标文件]:[依赖文件]`（注意：顶层文件依赖关系放上面，被依赖的文件的依赖关系放下面。因为程序是按照递归的方式进行依赖文件查找的，看到第一行有一个没见过的依赖文件，就往下一行进行查找）
2. `[TAB]要执行的指令`

清除编译过程中的中间文件，可以使用标志位`.PHONY`

```
test: program1.o program2.o main.o
	gcc program1.o program2.o main.o -o test

program1.o:
	gcc -c program1.c -o program1.o

program2.o:
	gcc -c program2.c -o program2.o

main.o:
	gcc -c main.c -o main.o

.PHONY:
clean:
	rm program1.o program2.o main.o
```





# 第二阶段：变量

对于变量的定义：`=`是替换、`+=`是追加、`:=`是常量。（不可对常量增加）

可以通过`$(name)`来使用定义过的变量。

```makefile
TAR = test
OBJ = program1.o program2.o main.o
CC := gcc

$(tar): $(OBJ)
	$(CC) $(OBJ) -o $(TAR)

program1.o: program1.c
	$(CC) -c program1.c -o program1.o

program2.o:
	$(CC) -c program2.c -o program2.o

main.o:
	$(CC) -c main.c -o main.o

.PHONY:
clean:
	rm $(OBJ)

```

# 第三阶段：隐含规则与通配符

`%.o`代表**任意**一个`.o`文件，`*.o`代表**所有**`.o`文件。

`$^`代表（规则中）所有依赖文件，`$@`代表（规则中）所有目标文件，`$<`代表（规则中）所有依赖文件的第一个文件。

```makefile
TAR = test
OBJ = program1.o program2.o main.o
CC := gcc

$(TAR): $(OBJ)
	$(CC) $^ -o $@

%.o: %.c
	$(CC) -c $^ -o $@

.PHONY
clean:
	rm $(OBJ)
```

