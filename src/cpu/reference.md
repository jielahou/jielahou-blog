---
title: NSCSCC参考资料
---

备战`NSCSCC`的过程中，势必要阅读很多资料。在此做整理，以减少学弟学妹搜集资料的时间。个人是负责SOC和部分系统移植的，所以主要是这两个方向的资料。

1. [UCAS NSCSCC (ucas-nscscc.github.io)](https://ucas-nscscc.github.io/docs/)：国科大NSCSCC教程，初步讲解了Block Design、上板等过程，适合作为入门第一步资料（此前写错了学校名称，感谢评论区老哥指出！）
2. [重庆大学操作系统实验文档 (cqu.ai)](https://osdocs.cqu.ai/lab0/intro/#_5)：如何编写裸机程序
3. [ 基于龙芯FPGA开发板的计算机系统综合实验(https://oscourse-tsinghua.github.io/LoongsonCsprj2020/cpu/)](https://oscourse-tsinghua.github.io/LoongsonCsprj2020/)
4. 串口烧写SPI Flashhttps://chiplab.readthedocs.io/zh/latest/FPGA_run_linux/flash.html
5. 给定十六进制字符串(e.g.`0x3C1D9FC5`)，转换成MIPS指令[eg.bucknell.edu/~csci320/mips_web/](http://eg.bucknell.edu/~csci320/mips_web/)
6. Block Design及相关IP核的使用说明
   1. https://blog.cyyself.name/soc-on-xilinx-fpga/
   2. https://jielahou.com/cpu/SoC_startup.html 
7. Linux U-Boot的移植
   1. 清华TrivialMIPS 启发着一代又一代…
      Linux：https://github.com/trivialmips/linux-nontrivial-mips 
      U-Boot：https://github.com/trivialmips/u-boot-trivialmips 
   2. 重庆大学CDIM团队版本
      Linux：https://github.com/cyyself/linux/tree/cdim_soc 
      U-boot：https://github.com/cyyself/u-boot/tree/cdim_soc 
      如何编译、配置工具链： https://cemu.cyyself.name/mips/setup/ 