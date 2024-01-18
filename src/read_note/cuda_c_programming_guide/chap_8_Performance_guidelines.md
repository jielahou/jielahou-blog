---
title: 《CUDA C Programming》第八章 性能准则
---

> 本章原文：https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#performance-guidelines
>
> 内容有些杂、有些乱，主要是自己学习用的，请谅解！

## 优化策略概览

> Performance optimization revolves around four basic strategies:
>
> - Maximize parallel execution to achieve maximum utilization;
> - Optimize memory usage to achieve maximum memory throughput;
> - Optimize instruction usage to achieve maximum instruction throughput;
> - Minimize memory thrashing.

性能优化围绕四个基本策略展开： 

- **最大化并行执行**，实现最大利用率；

- **优化内存使用**，实现最大内存吞吐量；

- **优化指令使用**，实现最大指令吞吐量；

- **尽量减少内存抖动**

:::info 内存抖动

内存抖动应该是指内存页面频繁的换入换出

:::

> Which strategies will yield the best performance gain for a particular portion of an application depends on the performance limiters for that portion; optimizing instruction usage of a kernel that is mostly limited by memory accesses will not yield any significant performance gain, for example. Optimization efforts should therefore be constantly directed by measuring and monitoring the performance limiters, for example using the CUDA profiler. Also, comparing the floating-point operation throughput or memory throughput—whichever makes more sense—of a particular kernel to the corresponding peak theoretical throughput of the device indicates how much room for improvement there is for the kernel.  

对于应用程序的特定部分， 哪种优化策略能取得最大的性能提升， 取决于**到底是哪部分限制住了性能**；例如， 对受内存访问限制的内核进行指令上的优化， 不会带来任何显著的性能提升。 因此， 应**通过测量和监控**（例如使用 CUDA profiler），去**发现性能限制因素**，再来不断指导优化工作。 此外， 将特定内核的浮点运算吞吐量或内存吞吐量（以更合理的方式为准） 与相应设备的理论峰值吞吐量进行比较，可以显示内核的改进空间有多大。  

## 最大化利用率

> To maximize utilization the application should be structured in a way that it exposes as much parallelism as possible and efficiently maps this parallelism to the various components of the system to keep them busy most of the time.  

为了最大限度地提高利用率， 应用程序的结构应尽可能多地**暴露出并行性**， 并有效地**将这种并行性映射到系统的各个组件上**，使它们在大部分时间内都处于忙碌状态。  

### 应用层面

> At a high level, the application should maximize parallel execution between the host, the devices, and the bus connecting the host to the devices, by **using asynchronous functions calls and streams** as described in [Asynchronous Concurrent Execution](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-concurrent-execution). It should assign to each processor the type of work it does best: serial workloads to the host; parallel workloads to the devices.

在高层次上， 应用程序应通过使用==**异步函数调用和流机制**==（如异步并发执行中所述），最大限度地提高主机、 设备以及连接主机和设备的总线之间的并行执行能力。 它应为每个处理器分配其最擅长的工作类型：串行工作负载分配给主机；并行工作负载分配给设备。

> For the parallel workloads, at points in the algorithm where parallelism is broken because some threads need to synchronize in order to share data with each other, there are two cases: Either these threads belong to the same block, in which case they should use `__syncthreads()` and share data through shared memory within the same kernel invocation, or they belong to different blocks, in which case they must share data through global memory using two separate kernel invocations, one for writing to and one for reading from global memory. The second case is much less optimal since it adds the overhead of extra kernel invocations and global memory traffic. Its occurrence should therefore be minimized by mapping the algorithm to the CUDA programming model in such a way that the computations that require inter-thread communication are performed within a single thread block as much as possible.

对于并行工作负载，在算法中由于**某些线程需要同步以相互共享数据而导致并行性中断**的地方，**有两种情况**：**要么这些线程属于同一个Block**，在这种情况下，它们应该使用`syncthreads()`并在同一个内核调用中**通过共享存储器**共享数据；**要么它们属于不同的区块**，在这种情况下，它们必须**调用两个单独的内核通过全局存储器**共享数据，一个用于写入全局内存，另一个用于从全局内存读取数据。第二种情况并不理想，因为它会增加额外的内核调用和全局存储器流量。因此，在将算法映射到CUDA编程模型时，线程间若需要需要通信，应尽可能**在单个线程块内执行计算**，从而最大限度地减少这种情况的发生。

:::info

总结：

- 异步函数调用和流机制
- 当线程间需要通信时，尽量在单个线程块内执行

:::

### 设备层面

> At a lower level, the application should maximize parallel execution between the multiprocessors of a device.

在较低层次上，应用程序应最大限度地在设备的多处理器之间并行执行。

> Multiple kernels can execute concurrently on a device, so maximum utilization can also be achieved by using streams to enable enough kernels to execute concurrently as described in [Asynchronous Concurrent Execution](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-concurrent-execution).

一个设备上可同时执行多个内核，因此，如异步并发执行中所述，使用流机制使足够多的内核同时执行，也可实现最大利用率。

:::info

总结：使用流机制让内核并行

:::

### SM层面

> At an even lower level, the application should **maximize parallel execution between the various functional units** within a multiprocessor.

在更低的层次上，应用程序应最大限度地利用**多处理器内各功能单元之间的并行执行**。 

> As described in [Hardware Multithreading](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-multithreading), a GPU multiprocessor primarily relies on thread-level parallelism to maximize utilization of its functional units. Utilization is therefore directly linked to the number of resident warps. At every instruction issue time, a warp scheduler selects an instruction that is ready to execute. This instruction can be another independent instruction of the same warp, exploiting instruction-level parallelism, or more commonly an instruction of another warp, exploiting thread-level parallelism. If a ready to execute instruction is selected it is issued to the [active](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture-notes) threads of the warp. The number of clock cycles it takes for a warp to be ready to execute its next instruction is called the *latency*, and full utilization is achieved when all warp schedulers always have some instruction to issue for some warp at every clock cycle during that latency period, or in other words, when latency is completely “hidden”. The number of instructions required to hide a latency of L clock cycles depends on the respective throughputs of these instructions (see [Arithmetic Instructions](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#arithmetic-instructions) for the throughputs of various arithmetic instructions). If we assume instructions with maximum throughput, it is equal to:

如[硬件多线程](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-multithreading)所述，GPU 多处理器**主要依靠线程级并行**来最大限度地利用其功能单元。因此，利用率与常驻的线程束数量直接相关。在每条指令发出时，线程束调度器都会选择一条准备执行的指令。这条指令可以是**利用同一 warp 的另一条独立指令（指令级并行性）**，也可以是**利用另一个 warp 的指令（线程级并行性）**。如果选择了一条准备执行的指令，它就会被发射给该 warp 的[活跃](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture-notes)线程。**线程束准备好执行下一条指令所需的时钟周期数称为*延迟***，当所有线程束调度器在该延迟期内的每个时钟周期都要为一些线程束发射指令时，或者换句话说，当**延迟被完全 "隐藏"**时，就实现了充分利用。隐藏 L 个时钟周期的延迟所需的指令数取决于这些指令各自的吞吐量（各种算术指令的吞吐量参见 [算术指令](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#arithmetic-instructions)）。如果假定指令的**吞吐量**最大，则等于：

:::info 吞吐量

关于吞吐量定义可见[这里](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#maximize-instruction-throughput)。**==吞吐量==**是指 对于某指定操作 每个SM、每个时钟周期**能够执行该操作的次数**。对于32个线程组成的线程束，一条指令会对应32次操作；所以如果$N$是每个时钟周期执行操作的次数，那么**==指令吞吐量==就是每个周期$(N/32)$条==指令==**。

所有的吞吐量都是针对一个SM而言的。在计算整个设备的吞吐量时，需要将吞吐量乘上该设备拥有的SM个数。

至于上文提到的“假定指令吞吐量最大”，个人认为指的是 能够打满相关的执行单元。

:::

- *4L* for devices of compute capability 5.x, 6.1, 6.2, 7.x and 8.x since for these devices, a multiprocessor issues one instruction per warp over one clock cycle for four warps at a time, as mentioned in [Compute Capabilities](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capabilities).
  - 一个SM 在一个时钟周期 为4个线程束中每个线程束 发射一条指令，共发射4条指令
  - 即：一个SM 在一个时钟周期 会发射4条指令
- *2L* for devices of compute capability 6.0 since for these devices, the two instructions issued every cycle are one instruction for two different warps.
  - 对于计算能力6.0的设备
  - 一个周期发射两条指令，这两条指令来自不同的线程束。



> The most common reason a warp is not ready to execute its next instruction is that the instruction’s input operands are not available yet.

线程束之所以尚未准备好执行下一条指令，最常见的原因是指令的输入操作数还没准备好。

 ==还有很多，鸽了==

## 最大化内存吞吐量



减少低带宽的数据传输，即减少主机和设备之间的数据传输、即减少全局存储器和设备之间的数据传输（=>善用**共享存储器**和各种Cache）。

**共享存储器**相当于**用户管理的高速缓存**： 应用程序**明确分配和访问**它。

片上内存既用于 L1 ，也用于共享内存；片上内存有多少分给 L1 、多少分给共享内存，在每次内核调用时可以进行配置。

内核访问内存的吞吐量会因每种内存的访问模式不同而有数量级的差异。因此，最大化内存吞吐量的下一步就是根据[设备内存访问](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#device-memory-accesses)中描述的**最佳内存访问模式**，尽可能优化内存访问。这种优化对全局内存访问尤为重要，因为与可用的片上带宽和算术指令吞吐量相比，全局内存带宽是较低的，因此非最佳全局内存访问通常会对性能产生很大影响。

:::info 小结

1. 使用共享存储器
2. 使用最佳内存访问模式

:::

### 主机和设备之间的数据传输

若要减少主机和设备之间的数据传输，（如果有些工作主机和设备都能做，那么）可以让设备执行更多的代码（而不是在主机上执行，虽然这可能会降低设备代码的并行性）。如此一来，**==中间数据结构可在设备内存中创建==**，由设备操作并销毁，而无需由主机映射或复制到主机内存中。

此外，由于**每次传输都会产生开销**，因此将**==许多小传输批量合并为一次大传输==**，总比单独进行每次传输要好。

使用**==锁页内存==**（Page-Locked Host Memory）（使用`cudaHostAlloc`、`cudaHostFree`分配/销毁的就是锁页内存），好处（参见[Page-Locked Host Memory](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#page-locked-host-memory)）：

- Copies **between page-locked host memory and device memory can be performed concurrently** with kernel execution for some devices as mentioned in [Asynchronous Concurrent Execution](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-concurrent-execution).
  - ==？？复制并行执行？？==
- On some devices, **page-locked host memory can be mapped into the address space of the device**, eliminating the need to copy it to or from device memory as detailed in [Mapped Memory](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#mapped-memory).
  - **主机上的锁页内存可以映射到设备的地址空间中**，进而**设备可以直接访问主机内存**，无需（显式地，存疑）先把数据从主机内存搬到全局存储器再访问。这既是“映射内存”（[Mapped Memory](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#mapped-memory)），也是**所谓的“零拷贝”（Zero-Copy）**内存。
  - 如果主存中的数据只被访问1次，那么直接从主存中映射访问要比开一块全局存储器，从主存搬运到全局存储器要快。
  - **准确来说，零拷贝并不是无需拷贝，而是无需显式拷贝**。使用零拷贝内存时不需要cudaMemcpy之类的显式拷贝操作，直接通过指针取值，所以对调用者来说似乎是没有拷贝操作。但实际上是在引用内存中某个值时隐式走PCIe总线拷贝，这样的方式有几个优点：
    - 无需所有数据一次性显式拷贝到设备端，而是**引用某个数据时即时隐式拷贝**
    - 隐式拷贝是**异步**的，可以和计算并行，隐藏内存传输延时
- On systems with a front-side bus, bandwidth between host memory and device memory is higher if host memory is allocated as page-locked and even higher if in addition it is allocated as write-combining as described in [Write-Combining Memory](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#write-combining-memory).
  - 对于有前端总线（指连接北桥的总线），使用锁页内存能够取得更高的性能。

也有部分设备，其显存和主机内存物理上是同一块。此时用映射内存更好。可通过相关API查询。

> `cudaHostAlloc`的Flag位如下（[参考](https://zhuanlan.zhihu.com/p/188246455)）：
>
> - cudaHostAllocDefault
>   默认值，等同于cudaMallocHost。
> - cudaHostAllocPortable
>   分配所有GPU都可使用的锁页内存
> - cudaHostAllocMapped。
>   此标志下分配的锁页内存可实现零拷贝功能，主机端和设备端各维护一个地址，通过地址直接访问该块内存，无需传输。
> - cudaHostAllocWriteCombined
>   将分配的锁页内存声明为write-combined写联合内存，此类内存不使用L1 和L2 cache，所以程序的其它部分就有更多的缓存可用。此外，write-combined内存通过PCIe传输数据时不会被监视，能够获得更高的传输速度。因为没有使用L1、L2cache， 所以主机读取write-combined内存很慢，write-combined适用于主机端写入、设备端读取的锁页内存。

:::info 小结

减少主机内存和显存之间通信的方法：

1. 让设备干活！让中间数据存在设备上
2. 许多小传输批量合并为一次大传输
3. 使用锁页内存、零拷贝内存

:::



### 设备内存访问

一条访存指令可能会被发射很多很多次！要发射多少次，取决于一个线程束内 各个线程访存地址的分布情况。这种分布方式对指令吞吐量的影响和内存的类型相关，将在下面的章节中进行说明。例如，对于全局存储器，一般来说，**地址越分散，吞吐量就越降低**。

#### 全局存储器

全局存储器通过32、64、128**字节**（不是位！）的**内存事务**进行访问。访问时需对齐。

当一个线程束在访问内存时，会根据其**内部每个线程所需要访存的大小**、**访存地址的分布**对访存进行**合并**，**合并成若干内存事务**。一般来说，需要的事务越多，传输中没有什么用的字也就越多，从而相应地降低了指令吞吐量。例如，如果每个线程的 4 字节访问要产生 32 字节的内存事务，吞吐量就要除以 8。（1次32字节的内存事务，会访问32字节，但其中只有4字节是我需要的）

需要进行多少次事务处理，以及最终会对吞吐量造成多大影响，都因设备的计算能力而异。（[Compute Capability 5.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-5-x), [Compute Capability 6.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-6-x), [Compute Capability 7.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-7-x), [Compute Capability 8.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-8-x) and [Compute Capability 9.0](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-9-0) 给出了各种计算能力如何处理全局存储器访问的更多细节。）

若要**最大化全局存储器的吞吐量**，就要**想方设法尽量去合并访存**：

- 根据设备的计算能力，找到最合适的访存模式
- 使用符合大小和对齐要求的数据结构
- 在一些情况下填充数据

#### 大小和对齐要求

可以使用`__align__(X)`关键字

#### 二维数组

Thread Index为`(tx,ty)`的线程，若要访问一个宽度为`Width`的二维数组，访问数组中如下地址较好：

```
BaseAddress + width * ty + tx
```

> 备注：也是让`tx`相邻的线程访问相邻的元素，合并同Warp内的内存访问

为了让二维数组中的一行元素的个数为32（线程束中线程个数）的倍数（以进一步合并访存），可以通过`cudaMallocPitch()` and `cuMemAllocPitch()`等函数帮我们自动做padding。

> Ref：[CUDA编程：二维数组的分配和使用 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/490239617)
>
> **分配内存**
>
> 二维数组实际上也是连续的空间，但是进行了内存对齐。一行的有效宽度为`Width`，在内存中的实际宽度为`Pitch`。*`Width`和`Pitch`的单位都是Byte* 。
>
> ```cpp
> // CPU分配--使用一维数组
> float *N_h = new float [Width * Height];//pitch == width
> // GPU内存分配
> float *N_d; 
> size_t Pitch;
> cudaMallocPitch(&N_d, &Pitch, Width*sizeof(float ), Height);
> ```
>
> **初始化**
>
> 初始化需要将数组从CPU拷贝上GPU，使用`cudaMemcpy2D()`函数。函数原型为
>
> ```
> __host__cudaError_t cudaMemcpy2D (void *dst, size_t dpitch, const void *src, size_t spitch, size_t width, size_t height, cudaMemcpyKind kind)
> ```
>
> 它将一个Host（CPU）上的二维数组，拷贝到Device（GPU）上。CPU和GPU上的二维数组，都***存储成C语言一维数组形式。***
>
> 参数分别表示
>
> - dst：Device上的数组指针
> - dpitch：Device上二维数组的Pitch（一行在内存中的实际宽度）。**单位Byte**
> - src：Host上的数组指针
> - spitch：Host上二维数组的Pitch（一行在内存中的实际宽度）。**单位Byte**
> - width：二维数组一行的宽度（逻辑上的宽度）。**单位Byte**
> - height：二维数组的 *行数。*
> - kind：数据迁移的类别，如 `cudaMemcpyHostToDevice`
>
> ```cpp
> // 将数据从CPU迁移到GPU
> cudaMemcpy2D(N_d, Pitch, N_h, Width*sizeof(float ), Width*sizeof(float ), Height, cudaMemcpyHostToDevice);
> ```
>
> **访问**
>
> *CUDA C Programming Guide* 中给出的访问方式如下所示
>
> ```cpp
> // 二维数组的访问
> for (int i=0;i<Height;i++){
>     float *row = (float *)((char*)N+i*Pitch);
>     for (int j=0;j<Width;j++){
>         row[j]++;
>     }
> }
> ```
>
> `Pitch` 是一行所占的字节数， 先将指针`N` 强制转化为`char*`（char 占1Byte，float占3Byte）， 在向后移动`Pitch`个字节，得到`(char*)N+1*Pitch` ，它是第1行（从0计数）的首地址；再将它转换回`float*`，就可以通过这个指针（`row`） 来访问第1行。
>
> 也正因为`Pitch`是以字节计数的，所以以下这种索引方式是错误的
>
> ```cpp
> /* 不可以使用以下语句 */
> for (int i=0;i<Height;i++){
>     for (int j=0;j<Width;j++){
>         N[i*N_pitch_d+j];
>     }
> }
> ```
>
> 正确写法应该是：
>
> ```cpp
> for (int i=0;i<Height;i++){
>     for (int j=0;j<Width;j++){
>         N[i*N_pitch_d/sizeof(float)+j];
>     }
> }
> ```

#### 局部存储器

虽然编译器一般会将会将 不使用标识符（如`__shared__`等）声明出的变量 分配到寄存器中，但是也有少数情况会放在局部存储器（Local Memory）中：

- ==无法确定以常量为索引的数组?==没看懂啥意思、
  - Arrays for which it cannot determine that they are indexed with constant quantities
- 会**占用过多**寄存器空间的大型结构或数组、
- 内核使用的寄存器数目**超过了可用**的寄存器数目（这也被称为寄存器溢出）。

如何确定变量是不是使用了局部存储器？

- 查看汇编出来的`ptx`：
  - 以`.local`助记符声明
  - 以`ld.local`、`st.local`访存
- 查看最终编译出的`cubin`：
  - 即便`ptx`没有体现local，有可能在针对设备最终编译时，会决定放入局部存储器
  - `cuobjdump`
- `--ptxas-options=-v`选项

#### 共享存储器

共享存储器被组织为若干Bank。如果一次请求落在了不同的Bank，这些请求可以被同时处理。如果一次请求落在了相同的Bank，这些请求必须依次串行处理。

所以，很有必要去了解内存地址是如何映射到Bank上的。这和jurisdiction的计算能力有关。（Ref：[Compute Capability 5.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-5-x), [Compute Capability 6.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-6-x), [Compute Capability 7.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-7-x), [Compute Capability 8.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-8-x), and [Compute Capability 9.0](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-9-0)）

> 备注：在[Compute Capability 5.x](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-5-x)较为详细地说明了Bank Conflict问题

#### 常量存储器

常量存储器空间位于设备内存中，并在常量缓存中缓存。

然后，一个请求会根据初始请求中不同的内存地址被拆分成多个单独的请求，吞吐量的下降系数等于单独请求的数量。

如果**缓存命中**，则按照**常量缓存的吞吐量**为由此产生的请求提供服务；反之，则按照设备内存的吞吐量提供服务。

#### 纹理和表面存储器

纹理和曲面内存空间位于设备内存中，并缓存在纹理缓存中，因此**只有在缓存未命中时**，纹理获取或曲面读取才会**花费一次从设备内存读取的代价**，否则只需花费**一次从纹理缓存读取内存的代价**。纹理缓存针对 2D 空间位置进行了优化，因此读取纹理或曲面地址的同一线程束如果在 2D 中相距很近，就能获得最佳性能。此外，纹理缓存是为具有恒定延迟的流式读取而设计的；缓存命中会减少 DRAM 带宽需求，但不会减少读取延迟。

通过纹理或曲面获取读取设备内存**具有一些优势**，可以使其成为从全局存储器或常量存储器读取设备内存的有利替代方案：

- 如果内存读取不遵循为获得良好性能而必须遵循的全局或常量存储器读取的访问模式（指**没有合并访存**），那么只要**对纹理存储器或表面存储器的访问具有局部性**，就可以获得更高的带宽；

- **寻址计算由专用单元在内核外执行**；

- 打包数据可在一次操作中广播到不同的变量；

- 8 位和 16 位整数输入数据可选择转换为范围为 [0.0, 1.0] 或 [-1.0, 1.0] 的 32 位浮点数值（参见纹理内存）。

## 最大化指令吞吐量

### 算数指令

欲最大化指令吞吐量，对于算数指令相关，我们应该这么做：

- **Minimize the use of arithmetic instructions with low throughput;** this includes trading precision for speed when it does not affect the end result, such as **using intrinsic instead of regular functions (intrinsic functions are listed in [Intrinsic Functions](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#intrinsic-functions)), single-precision instead of double-precision, or flushing denormalized numbers to zero;**
  - 不要使用吞吐量低的算数指令，可以用：
    - 一些内建函数（我也不知道咋翻译好了，感觉就是用特殊计算单元而非常规计算单元的函数）
    - 单精度而不是双精度
    - 把[非规格化数](https://zh.wikipedia.org/wiki/IEEE_754#%E9%9D%9E%E8%A7%84%E7%BA%A6%E5%BD%A2%E5%BC%8F%E7%9A%84%E6%B5%AE%E7%82%B9%E6%95%B0)（即十分接近0的数）直接干成0（编译参数`-ftz=true`）
- Minimize divergent warps caused by control flow instructions as detailed in [Control Flow Instructions](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#control-flow-instructions)
  - 同一个Warp内的32个线程尽量不在分支指令处“分叉”
- Reduce the number of instructions, for example, by optimizing out synchronization points whenever possible as described in [Synchronization Instruction](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#synchronization-instruction) or by using restricted pointers as described in [__restrict__](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#restrict).
  - 减少同步指令
  - 使用`__restrict__`指针



可以使用如下的编译标志：

- code compiled with `-ftz=true` (denormalized numbers are flushed to zero) tends to have higher performance than code compiled with `-ftz=false`.
  - 把[非规格化数](https://zh.wikipedia.org/wiki/IEEE_754#%E9%9D%9E%E8%A7%84%E7%BA%A6%E5%BD%A2%E5%BC%8F%E7%9A%84%E6%B5%AE%E7%82%B9%E6%95%B0)（即十分接近0的数）直接干成0
- Similarly, code compiled with `-prec-div=false` (less precise division) tends to have higher performance code than code compiled with `-prec-div=true`,
  - 不使用高精度除法
- and code compiled with `-prec-sqrt=false` (less precise square root) tends to have higher performance than code compiled with `-prec-sqrt=true`. The nvcc user manual describes these compilation flags in more details.
  - 不使用高精度平方根

可使用如下的API：

单精度浮点除法：`__fdividef(x, y)`

单精度浮点倒数平方根： optimize `1.0/sqrtf()` into `rsqrtf()`

单精度浮点平方根：（没琢磨透啥意思）Single-precision floating-point square root is implemented as a reciprocal square root followed by a reciprocal instead of a reciprocal square root followed by a multiplication so that it gives correct results for 0 and infinity.

**三角函数**（`sin`、`cos`等）`sinf(x)`, `cosf(x)`, `tanf(x)`, `sincosf(x)`, and corresponding double-precision instructions开销更大，尤其是当`x`非常大时。`the argument reduction code`提供了两条路：一条快路和一条慢路。快速路径用于数量级足够小的参数，主要包括一些乘加运算。慢运算路径用于量级较大的参数，包括在整个参数范围内获得正确结果所需的冗长计算。目前，三角函数的`the argument reduction code`会为幅度小于 `105615.0f `的参数（单精度函数）和小于 `2147483648.0` 的参数（双精度函数）选择快速路径。由于慢速路径比快速路径需要更多的寄存器，因此尝试将一些中间变量存储在本地内存中，以减少慢速路径中的寄存器压力，但由于本地内存的高延迟和带宽可能会影响性能（参见[设备内存访问](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#device-memory-accesses)）【更多请参考原文】。

**整数运算**：**整数除法和取模的开销非常大**！尽量**使用位运算代替**！（例如：If `n` is a power of 2, (`i/n`) is equivalent to `(i>>log2(n))` and `(i%n)` is equivalent to (`i&(n-1)`); the compiler will perform these conversions if `n` is literal.）

**半精度（Half Precision）运算**：大体思想是：**可以把两个16位拼成32位**（`half2` datatype is used for `half` precision and `__nv_bfloat162` be used for `__nv_bfloat16` precision），**然后调用一次向量函数完成两个16位的运算**（Vector intrinsics (for example, `__hadd2`, `__hsub2`, `__hmul2`, `__hfma2`) can then be used to do two operations in a single instruction.）。同时还提供了一些助手函数，能够把两个半精度的浮点值转换成`half2`、`__nv_bfloat162`（`__halves2half2`、`__halves2bfloat162`）

**类型转换**：类型转换会**引入额外的指令、额外的时钟周期**（，所以要**尽量避免类型转换**）。啥时候会发生类型转换呢？

- 对`char`或`short`类型做运算：实际上会先把他们转换成`int`再运算
- 双精度常量被用于做单精度运算时，会将双精度常量再转为单精度。我们可以在**小数后面加一个`f`**将其声明为单精度常量，例如`3.1415926f`

:::info 小结

1. 使用`__restrict__`指针
2. 控制编译标志，不用高精度运算
3. 使用由SFU运算的系列函数
4. 多多使用位运算
5. 合并半精度运算，使用向量运算函数
6. 不使用`char`、`short`
7. 做单精度运算，字面值常量后面带上`f`

:::



### 控制流指令

尽量不要让一个Warp中的线程产生分支（指产生不同的执行路径，例如`if`、`switch`、`do`、`for`、`while`等）。如果出现这种情况，就必须以序列化方式执行各路径，从而增加该线程束执行的指令总数。

**当控制条件和`threadIdx`相关时**，我们可以精心编排，以减少Warp内线程的分支。例如：如果某个分支条件仅和`threadIdx.x / warpSize`（`warpSize == 32`，即一个Warp中的Thread个数），那么同一Warp中的线程就不会产生分支。

对于**循环**，我们可以对其进行**展开**。可以使用`#pragma unroll`来指导编译器进行循环展开。

我们还可以使用**谓词**来优化短的`if`或`switch`块。使用**分支谓词**时，那些取决于控制条件的指令都会被执行（甭管对应谓词寄存器是真是假。对应谓词寄存器值还没出来呢都可能会执行。）。相反，每条指令都与每个线程的条件代码或谓词相关联，谓词会根据控制条件设置为真或假，**虽然每条指令都会被安排执行**，但**只有谓词为真的指令才会被实际执行**。带有**假谓词的指令不会写入结果**，也不会评估地址或读取操作数。由此，我们可以**消除分支**（毕竟甭管是真是假，指令都会执行，只不过最后的结果是写入还是不写入罢了）。

:::info 例子

李少侠的SGEMM实现中，借助内嵌汇编使用分支谓词的例子：

```c++
__device__ __forceinline__ void stg32(const float &reg, void *ptr, bool guard) {
    asm volatile (
        "{.reg .pred p;\n"
        " setp.ne.b32 p, %2, 0;\n"
        " @p st.global.f32 [%0], %1;}\n"
        : : "l"(ptr), "f"(reg), "r"((int)guard)
    );
}
```

:::



:::info 个人想法

依我个人理解和从老师那里听来的信息，Nvidia GPU对`@p`和`bra`的处理方式是不同的。

**以下内容暂无官方资料佐证，仅供参考！**

对于使用了保护掩码`@p`的语句：

- 可以不用等`p`的结果出来，就去执行带`@p`的语句
- **Warp中所有线程** **都会去执行**带`@p`的语句

- - 所以**不存在分支**问题
  - 虽然最终的行为像分支（**似乎是**有的执行了，有的没有执行）

- 待`p`中结果出来后，各个线程根据`p`的结果，来决定是抛弃掉执行结果，还是保留执行结果，写入对应的存储器

对于`bra`指令：

- 对于老版本的GPGPU实现，使用SIMT堆栈/活跃掩码等技术实现。由于那时的英伟达GPU，一个Warp32个线程共用1个PC寄存器，所以对于这种方案，一个Warp中但凡出现了分支，不同的分支流是不并行的（必须等一个分支执行完，才能去执行另外一个分支）
- 但对于新版本的GPGPU，Warp中每个线程都有自己的状态相关寄存器。所以在出现分支时，走不同分支的线程是可以并行的

:::
