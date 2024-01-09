---
title: Thread如何划分为Warp?
---

先看这里（https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture）的一句话：

> When a multiprocessor is given one or more thread blocks to execute, it partitions them into warps and each warp gets scheduled by a *warp scheduler* for execution. The way a block is partitioned into warps is always the same; each warp contains threads of consecutive, increasing thread IDs with the first warp containing thread 0. Thread Hierarchy describes how thread IDs relate to thread indices in the block. 

线程块被划分为线程的方式总是相同的。**每个线程束包含着Thread ID连续的、递增的线程（第一个线程束包含线程0）。**线程架构描述了Thread ID和Thread Index的关系。

看来，只要弄清楚“线程架构”，即Thread Index和Thread ID之间的关系，就能够知道给定Thread Index的线程，其和哪些线程归属同一个warp，进而去针对warp做优化。



Thread Index和Thread ID之间有什么关系呢？（线程架构参考这里：[CUDA C++ Programming Guide (nvidia.com)](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#thread-hierarchy)）

- 1维的Thread Index，其Thread ID就是Thread Index

- 2维的Thread Index，其Thread ID为`tx + ty * DX`

- 3维的Thread Index，其Thread ID为`tx + ty * DX + tz * DX * DY`



由此再回到本文的问题：Thread如何划分为Warp?

- 对于1维的Thread Index，直接32个为一组划分（e.g. `0~31`、`32~63`、`64~95`...）
- 对于2维的Thread Index，先按照x分，然后再按照y分（e.g. 假设Thread Block大小为[dx]16*[dy]32，那么`(0,0),(1,0)...(14,0),(15,0),(0,1),(1,1)...(14,1),(15,1)`是一个warp内的）
- 对于3维的Thread Index，先按照x分，然后再按照y分，最后按照z分（例子略）

