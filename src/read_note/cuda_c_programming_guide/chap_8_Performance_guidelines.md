---
title: 《CUDA C Programming》第八章 性能准则
---

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

如[硬件多线程](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-multithreading)所述，GPU 多处理器**主要依靠线程级并行**来最大限度地利用其功能单元。因此，利用率与常驻的线程束数量直接相关。在每条指令发出时，线程束调度器都会选择一条准备执行的指令。这条指令可以是**利用同一 warp 的另一条独立指令（指令级并行性）**，也可以是**利用另一个 warp 的指令（线程级并行性）**。如果选择了一条准备执行的指令，它就会被发射给该 warp 的[活跃](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture-notes)线程。**线程束准备好执行下一条指令所需的时钟周期数称为*延迟***，当所有线程束调度器在该延迟期内的每个时钟周期都要为一些线程束发射指令时，或者换句话说，当延迟被完全 "隐藏"时，就实现了充分利用。隐藏 L 个时钟周期的延迟所需的指令数取决于这些指令各自的吞吐量（各种算术指令的吞吐量参见 [算术指令](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#arithmetic-instructions)）。如果假定指令的**吞吐量**最大，则等于：

:::info 吞吐量

关于吞吐量定义可见[这里](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#maximize-instruction-throughput)。

:::







