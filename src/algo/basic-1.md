---
title: 基础算法（1）
---

> 本文章为AcWing《算法基础课》的笔记

# 快速排序

## 基本思想

最基本思想：分治

1. **选中一个分界值**：可以是`q[l]`、`q[r]`、`q[l+r]`等；
2. **将数组分为两部分：**第一部分为小于边界值的，第二部分为大于边界值的；【难点】
3. **递归处理：**对剩下的两部分重复上述过程，进行**递归**处理。

## 代码实现思路

### 暴力（不推荐）

另外再开两个数组`a[ ]`、`b[ ]`，将`q[ ]`中大于边界的丢入`a[ ]`中，小于边界的丢入`b[ ]`中。然后放回`q[ ]`中。接着再对`q[ ]`中的两部分重复上述过程。

### 优雅

#### 思路

> 和数据结构教的一样

```
+--+--+--+--+--+--+--+--+--+--+--+--+
|  |  |  |  |  |  |  |  |  |  |  |  |
++-+--+--+--+--+--+--+--+--+--+--++-+
 ^                                ^
 |                                |
 +                                +
 i                                j

```

准备两个指针，一个指向最左端，一个指向最右端。

- 对于最左端，如果当前数字比临界值小，则向右移动，直至遇到一个数字，**大于等于**临界值；
- 对于最右端，如果当前数字比临界值大，则向左移动，直至遇到一个数字，**小于等于**临界值；
- 此时交换左右两端数字。**交换完后，将两边指针各往前拨动一个，**接着重复上述过程；
- 直至两个指针重合。

> 当时疑惑了，为啥交换完后必须往前拨动一个？这是因为我们的条件是大于**等于**、小于**等于**！极有可能会遇到两个边界值（触发等于），换过后还是等于！陷入了死循环！所以换完必须往前拨动一个。

#### 模板

```c++
void quick_sort(int q[], int l, int r){
    //首先判断是否还需要排序
    if(l >= r) return;
    
    //接着选取边界值，并初始化循环变量
    int i = l - 1, j = r + 1, x = q[l + r >> 1];
    //然后进行循环
    while(i < j){
        do i++; while(q[i] < x);
        do j--; while(q[j] > x);
        if(i < j) swap(q[i], q[j]);//swap是C++内置函数
    }
    
    //最后进行递归
    quick_sort(q, l, j), quick_sort(q, j+1, r);
}
```

> 如果最后一行进行递归时，中间边界选的是`j`、`j+1`，那么上面的边界值`x`不可以取`q[r]`，否则会有边界问题。故（同理，如果中间边界选的是`i-1`、`i`，那么上面的边界值`x`不可以取`q[l]`。）

> Y总完整代码里，还有一句
>
> ```c++
> const int N =1e6 + 10;
> int q[N];
> ```
>
> 这是因为题目当中，规定了数据范围：$1≤n≤1000000$，但有时测试样例中给的数会稍微多一些，于是便加了10。

## 时间复杂度

快排时间复杂度为$O(n \log n)$，这是最理想状态下（每次递归都是从中间分）的情况。

```
                        +
+-----------------------------------------------+
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O(n)
+-----------------------------------------------+
                        |
            +           |           +
+-----------------------------------------------+
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O(n)
+-----------------------------------------------+
            |           |           |
      +     |     +     |     +     |     +
+-----------------------------------------------+
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O(n)
+-----------------------------------------------+
      |     |     |     |     |     |     |
   +  |  +  |  +  |  +  |  +  |  +  |  +  |  +
+-----------------------------------------------+
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O(n)
+-----------------------------------------------+
   +  +  +  +  +  +  +  +  +  +  +  +  +  +  +

共logn层，故为O(n log n)
```





# 归并排序

## 基本思想

最基本思想：分治

### 和快排的不同点

- **分治方式不一样**：快排是随便选择一个**数组中的数**（虽然内心知道是有边界问题的不能瞎选），而归并是选择**数组中间的位置**；
- **操作顺序不一样**：快排是先操作再递归，归并是上来先递归再操作。

### 基本步骤

1. **选取分界值：**选取数组中间的位置`(l + r) /2`
2. **递归：**对左右两侧进行递归处理
3. **归并：**将左右两侧结果合并【难点】

## 代码实现思路

> 关键看第三步，如何对两侧结果进行合并

```
          +
          |
          |
          |
         +v-+--+--+--+--+--+
前半部分 |  |  |  |  |  |  | 排好序了
         +--+--+--+--+--+--+

         +--+--+--+--+--+--+
后半部分 |  |  |  |  |  |  | 排好序了
         +^-+--+--+--+--+--+
          |
          |
          +

         +--+--+--+--+--+--+--+--+--+--+--+--+
最终结果 |  |  |  |  |  |  |  |  |  |  |  |  |
         +--+--+--+--+--+--+--+--+--+--+--+--+

```

核心：双指针算法。假定已经有两个**排好序**的子数组。

- 比较：两个指针所指的数字谁更小？谁小，把谁丢入结果数组，并且自己的指针往后移一个，进行下一轮比较；
- 如果有一个子数组的指针已经指向最后一个元素了，此时直接将另一个子数组剩下的元素丢尽最终结果就好。

> 如果两个数字相同，则将“前面半段”的数丢入最终结果。这是为了保证稳定性。

## 模板

```c++
void merge_sort(int q[], int l, int r)
{
    //判断是否还有元素要处理
    if (l >= r) return;
    //计算分界点
    int mid = l + r >> 1;
    //上来先是递归
    merge_sort(q, l, mid);
    merge_sort(q, mid + 1, r);
    //将两段数据合并
    int k = 0, i = l, j = mid + 1;
    while (i <= mid && j <= r) //谁小复制谁
        if (q[i] <= q[j]) tmp[k ++ ] = q[i ++ ]; //如果两者相等，复制前面的数据
        else tmp[k ++ ] = q[j ++ ];
    //将没处理完的直接拼在临时数组后面
    while (i <= mid) tmp[k ++ ] = q[i ++ ];
    while (j <= r) tmp[k ++ ] = q[j ++ ];
    //最后将tmp数组中内容写回至原数组中
    for (i = l, j = 0; i <= r; i ++, j ++ ) q[i] = tmp[j];
}
```

# 整数二分

## 基本思想

有单调性的一定可以用二分，可以用二分的未必有单调性。

对于给定的**整数**区间（当前讨论的是**整数**二分），可以分成两个部分（这并不是二分的含义，二分是指将区间均匀分成两部分），一部分是满足给定性质的，另一部分是不满足给定性质的。如下图所示：

```
         Satisfy                Not   Satisfy
|___________________|__|________________________________| 第一种情况
l                   k k+1                               r

    Not  Satisfy                      Satisfy
|___________________|__|________________________________| 第二种情况
l                   k k+1                               r
```

为了找到边界，我们可以去寻找`k`，也可以去寻找`k+1`。

寻找不同的值，对应着不同的模板。

核心想法：保证**要找的那个边界**一定要在正在找的那个**区间内**！

### 模板①

模板①：以上图中第一种情况为例，我们要寻找`k`，即**左边**这个区间的**右边界**。

1. 确定分界点`mid = (l + r + 1) / 2`
2. 查看该点处数值是否满足条件（本质：判断`mid`是属于左边的还是右边的）
   1. 满足条件，说明边界还要靠右。把`l`（左边界）改成`mid` ，即寻找范围为：`[mid, r]`*存疑，那如果mid就是边界呢？不过这种方式把mid仍然算在寻找范围内，下面的`mid-1`就是把`mid`点给排除掉了*
   2. 不满足条件，说明边界还要靠左。把`r`（右边界）改成`mid - 1`，即寻找范围为：`[l, mid - 1]`*排除掉了`mid`点*

> 为什么求左边区间的右边界（即在满足条件时把`l`更新为`mid`，搜索区间变为`[mid, r]`）时，`mid`点要**加一再除二**，选为`(l + r + 1) / 2`呢？试想如果当`l = r - 1`，且没有加一，此时`mid = (l + r) / 2 = (r + r - 1) / 2 = r - 1 = l`（除法是向下取整） 。如果`mid`点符合要求，下次寻找范围为`[mid, r]`，仍为`[l, r]`，陷入了死循环。所以`mid`点要**加一再除二**。

### 模板②

模板②：如果是找**右边区间**的**左边界**，则思路如下：

1. 确定分界点**`mid = (l + r) / 2`**
2. 查看该点处数值是否满足条件（本质：判断`mid`是属于左边的还是右边的）
   1. 满足条件，说明边界还要**靠左**。把`r`（左边界）改成`mid` ，即寻找范围为：**`[l, mid]`**
   2. 不满足条件，说明边界还要**靠右**。把`l`（右边界）改成`mid + 1`，即寻找范围为：**`[mid + 1, r]`** *排除掉了`mid`点*

### 模板选择

什么时候用模板①，什么时候用模板②呢？

首先注意到：`mid = l + r + 1 >> 1`和`l = mid`是绑定的；`mid = l + r >> 1`和`r = mid`是绑定的。

- 先把`mid = l + r >> 1`写上*（先不管是不是`+ 1`）*
- 然后写`check`函数/条件（如：`q[i] >= x`）
- 符合`check`条件的区间是左半边还是右半边？如果`mid`点满足条件，下一个搜寻区间在右半边`[r, mid]`，还是在左半边`[l, mid]`？
  - 如果符合`check`条件的区间是左半边，那么下一个搜寻区间是右半边`[mid, r]`（`mid`也有可能是答案），**即`l = mid`**，那么上面写过的`mid`表达式改为`mid = (l + r + 1) >> 1`
  - 如果符合`check`条件的区间是右半边，下一个搜寻区间是左半边`[l, mid]`（`mid`也有可能是答案），**即`r = mid`**，那么上面写过的`mid`表达式无需更改



## 模板

使用二分法，我们是保证答案一定在区间里面的；如果区间的长度为1，说明这个数便是最终的答案。`解释模板l < r停止条件`

**题目可能是无解的**，但是这个代码**模板一定是能出来一个解**的！针对题目要求，可能要在循环后加以判断！

注意点：

- 我们先写`int mid = l + r >> 1`
- 在确定是`l = mid` OR `r = mid`后再根据情况回去修改`mid`

```c++
bool check(int x) {/* ... */} // 检查x是否满足某种性质

// 区间[l, r]被划分成[l, mid]和[mid + 1, r]时使用：
int bsearch_1(int l, int r)
{
    while (l < r)
    {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;    // check()判断mid是否满足性质
        else l = mid + 1;
    }
    return l;
}
// 区间[l, r]被划分成[l, mid - 1]和[mid, r]时使用：
int bsearch_2(int l, int r)
{
    while (l < r)
    {
        int mid = l + r + 1 >> 1;
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    return l;
}
```

# 浮点二分

## 基本思想

与整数不同，不需要太怎么考虑边界问题。

与整数类似，都是要保证要找的边界在区间内；

每次将搜索的区间砍成一半，当区间足够小时，我们认为已经找到了答案。

## 模板

这里以求二次方根的题目来代替模板

注意点：

- 如果题目要求6位小数，则`r - l > 1e-8`才行。也就是说，假如`n`是要求的精度，那么`r - l`要小于$10^{-(n+2)}$才可以
- 关于边界的选取：假设要解`0.01`的根，如果区间选在`[0, 0.01]`（即`l=0;r=x`），此时发现根`0.1`是不在区间内部的，这会造成出来的结果不对（事实上会返回`0.01`）！于是做出了改进：让右边界为`r=x+1`便可解决这里的问题。

```c++
#include <iostream>
using namespace std;

int main() {
    double x;
    cin >> x;
    
    double l = 0, r=x+1; //NOTICE r=x+1
    while(r - l > 1e-6) { //NOTICE 1e-6
        double mid = (l+r) / 2;
        if(mid * mid * mid > x) r = mid;
        else l = mid;
    }
    
    printf("%lf", l);
}
```

# 高精度

## 算法思想

Java有大整数类，Python的精度够，只有C++会考虑。主要有以下四种情况：

- 第一种：两个大整数相加：$A+B$，其中$len(A) \leqslant 10^6, len(A) \leqslant 10^6$
- 第二种：两个大整数相减：$A-B$，其中$len(A) \leqslant 10^6, len(A) \leqslant 10^6$
- 第三种：一个大整数乘上一个小整数$A \times \alpha$，其中$len(A) \leqslant 10^6, \alpha \leqslant 1000$
- 第四种：一个大整数除以一个小整数$A\div \alpha$，其中$len(A) \leqslant 10^6, \alpha \leqslant 1000$

## 大整数的存法

我们使用数组来存储大整数的每一位。并将低位放在数组开头，高位放在数组结尾。

> 例如：对于数字`123456789`，将其每一位存到数组中后，是这样的：`q[0] == 9`、`q[1] == 8`、...etc。

这么做的好处是：如果最高位涉及到进位，我们需要在最高位前面再添一个数字时，可以直接在数组的末尾添上；如果采取高位放在数组开头的做法，进位时在数组最前面不太方便添数字。
