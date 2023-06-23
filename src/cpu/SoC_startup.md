---
title: 使用Vivado搭建SoC
---

> 本文待完善！！仅供参考！！
>
> 本文大量引用了网络上的文章，在具体引用处的附近均标注了来源，感谢原作者们的分享！！
>
> 有的坑，一个人踩过，就行了，别让后来人再踩了...

# 封装处理器

将处理器封装成为带有AXI4接口形式的IP核以便调用。下面以gs232为例演示整个过程。

> gs232外部中断默认低电平有效！！！

## 第1步：创建工程

> 根据使用的 FPGA 开发平台，选择对应的 FPGA 目标器件。根据实验平台搭载的 FPGA，在筛选器的“Family” 选择“Artix 7”，“Package”选择“fbg676”，在筛选得到的型号里面选择“xc7a200tfbg676-2”。

## 第2步：向新创建的工程中加入设计文件

> 如果CPU中有用到Xilinx的IP，则记得在新工程中要实例化一份。
>
> 针对`gs232`，需要实例化如下BRAM：`sram_128x64`、`sram_128x32`、`sram_128x22`、`sram_32x52bit`。
>
> 提示：可以通过**复制xci文件**来复用龙芯官方实例化好的IP核。

## 第3步：创建并封装IP核

Tools->Create and Package New IP

![image-20230517153252505](./SoC_startup.assets/image-20230517153252505.png)

![image-20230517153315076](./SoC_startup.assets/image-20230517153315076.png)

![image-20230517153330420](./SoC_startup.assets/image-20230517153330420.png)

注意，下方路径选择一个独立于源项目的文件夹。

![image-20230517153354163](./SoC_startup.assets/image-20230517153354163.png)

![image-20230517153407204](./SoC_startup.assets/image-20230517153407204.png)

点击Finish，进入下一步。

## 第4步：编辑IP核

在上一步点击完Finish后，会自动打开一个新的临时工程，如下图所示。接下来主要通过右半部分来编辑IP核。

![image-20230517153545883](./SoC_startup.assets/image-20230517153545883.png)

Identification选项用于编辑IP核的基本信息，包括名称、版本号、（调用IP核时）显示的名字等。看着设置就行。

![image-20230517153930444](./SoC_startup.assets/image-20230517153930444.png)

接下来的Ports and Interfaces是重点（就它前面是个黄色感叹号！）。

![image-20230517154434682](./SoC_startup.assets/image-20230517154434682.png)

可以看到，在General选项卡中，识别出该AXI接口为Master模式，符合设计。

![image-20230517154616774](./SoC_startup.assets/image-20230517154616774.png)

在Port Mapping选项卡中，我们发现Vivado已经自动将我们的端口和AXI接口完成了映射（下方红色框）。此时应进行检查，查验自动生成的映射关系对不对。如果不对，首先将其从Mapped Ports Summary中删除错误映射，再在上半部分选择合适的映射，点击“Map Ports”按钮将正确映射关系添加进来。

![image-20230517154559140](./SoC_startup.assets/image-20230517154559140.png)

在Parameters选项卡中为总线添加两个参数，`FREQ_HZ`和`ID_WIDTH`。其中，`FREQ_HZ`为总线工作频率，这里设置`FREQ_HZ`的默认值为`33000000`，即33MHz；`ID_WIDTH`设置为0。

> 如果不设置，后续综合、生成比特流会报错。

![image-20230517154945847](./SoC_startup.assets/image-20230517154945847.png)

![image-20230517160219315](./SoC_startup.assets/image-20230517160219315.png)

![image-20230517160237540](./SoC_startup.assets/image-20230517160237540.png)

![image-20230517160341464](./SoC_startup.assets/image-20230517160341464.png)

同理设置`ID_WIDTH`，略。

最后点击OK，完成接口编辑工作。

最后，点击“Review and Package”选项，点击“Package IP”完成最终封装。

![image-20230517160545616](./SoC_startup.assets/image-20230517160545616.png)

在你设置的 导出IP文件夹 中，应该可以看到如下文件：

![image-20230517162422759](./SoC_startup.assets/image-20230517162422759.png)

# Block Design初入门

## 新建工程

略

## 导入处理器IP核

> 我们上面对处理器IP核进行封装，目的就在于能够方便的导入`(*^_^*)`

![image-20230517162214206](./SoC_startup.assets/image-20230517162214206.png)

![image-20230517162244462](./SoC_startup.assets/image-20230517162244462.png)

![image-20230517162319293](./SoC_startup.assets/image-20230517162319293.png)

![image-20230517162339499](./SoC_startup.assets/image-20230517162339499.png)

添加成功，则提示：

![image-20230517162444861](./SoC_startup.assets/image-20230517162444861.png)

## 创建Block Design

![image-20230517165608231](./SoC_startup.assets/image-20230517165608231.png)

点击方框可以让这块区域显示的更大：

![image-20230517165641231](./SoC_startup.assets/image-20230517165641231.png)

将我们的CPU IP添加进来

![image-20230517165726129](./SoC_startup.assets/image-20230517165726129.png)

添加进来啦

![image-20230517170102743](./SoC_startup.assets/image-20230517170102743.png)

## 添加一些基本IP核

### 添加时钟管理单元

> *Clocking Wrzard*属于非常常用的IP核，可用于时钟的**分频、倍频**，在工程中需要多个时钟时，通常选用该IP核产生其他时钟。

![image-20230517170120519](./SoC_startup.assets/image-20230517170120519.png)

双击建好的IP核，进入到配置页面：

![image-20230517170539345](./SoC_startup.assets/image-20230517170539345.png)

在Outputs Clocks，设置需要的时钟信号及其频率，并设置`reset`信号为低电平有效。

> 根据`soc_up介绍_v0.01.pdf`可知，开发板上时钟晶振为 100MHz。

![image-20230517170801140](./SoC_startup.assets/image-20230517170801140.png)

![image-20230517170754704](./SoC_startup.assets/image-20230517170754704.png)

### 添加BRAM

> **BRAM，即Block RAM**，是FPGA中一种重要的存储资源。在这里，为了让示例SoC的简单一些，直接使用BRAM存储裸机程序（而没有使用SPI Flash）。在最终的设计中，通常使用SPI Flash装载Bootloader。

![image-20230517171123338](./SoC_startup.assets/image-20230517171123338.png)

双击实例好的BRAM，进入到配置页面。

在Basic选项卡，我们设置Mode为“BRAM Controller”，Memery Type设置为“Single Port ROM”。



> Mode有两个选项，“BRAM Controller”、“Stand Alone”。若选择“BRAM Controller”，我们需要再实例化一个BRAM Controller出来。这是因为BRAM自己提供的接口并非是AXI，需要额外加一个Controller，转化出可用的AXI接口来。至于“Stand Alone”，则会多出一些信号，通过这些信号可以直接操作BRAM，方便自定义BRAM用途。
>
> 这里我们选择“BRAM Controller”，因为我们要通过AXI总线来读取存储在BRAM中的裸机程序。

![image-20230518110557494](./SoC_startup.assets/image-20230518110557494.png)

一旦选择了“BRAM Controller”，则**无法**对BRAM的读写宽度、深度等进行设置。这是因为BRAM Controller核BRAM之间的接口读写均是32位；至于深度，则由分配的地址空间（后面会说）决定。

![image-20230517173931244](./SoC_startup.assets/image-20230517173931244.png)

在Other Options选项卡中，把Enable Safety Circuit选项框的勾去掉。从左侧原理图可看出，把rsta_busy这个信号给去掉了，我们用不上（也没必要用）。

![image-20230517174411243](./SoC_startup.assets/image-20230517174411243.png)

### 添加BRAM Controller

![image-20230517203346985](./SoC_startup.assets/image-20230517203346985.png)

协议选择AXI4，数据宽度32位；由于我们上面实例化的BRAM是单端口的，所以Number of BRAM Interface选择1。

![image-20230517203506422](./SoC_startup.assets/image-20230517203506422.png)

然后将Bram Controller的Port A和Bram相连：

![截图_20230517203638](./SoC_startup.assets/截图_20230517203638.gif)



### 尝试自动连接的威力

在添加完CPU核、时钟、Bram后，可以尝试点一下自动连接。

![image-20230517203855942](./SoC_startup.assets/image-20230517203855942.png)

![image-20230517204642037](./SoC_startup.assets/image-20230517204642037.png)

![image-20230517204711873](./SoC_startup.assets/image-20230517204711873.png)

自动连接帮我们干了这么几件事：

1. 把CPU的AXI接口接到了Interconnect的Slave侧；
2. 把BRAM Controller的AXI接口接到了Interconnect的Master侧；
3. Interconnect上的时钟全连上了；
4. 生成了一个`Processor System Reset`IP核，其`peripheral_aresetn`接到了Interconnect和BRAM Controller上；
5. `Clock Wizard`上的时钟信号连到了`Processor System Reset`、Interconnect、和BRAM Controller上；
6. 将`Clock Wizard`上的resetn和clk_in_1标记为**外部信号**（通俗理解为：不是内部IP核提供的信号，而是板上的I/O引脚）。

自动连接的未必是合理的！一定要自己检查下！下面马上介绍一个自动连接出错的地方...

### Processor System Reset是真不熟

其中Processor System Reset是真不熟，第一次见。

以下大部分内容摘自（[Xilinx IP解析之Processor System Reset v5.0_proc_sys_reset_徐晓康的博客的博客-CSDN博客](https://blog.csdn.net/weixin_42837669/article/details/116853566)），感谢原作者的无私分享！

> 通常在Block Design中使用此复位IP，输出作为自定义模块，AXI总线等的**复位信号**。此IP**在初始阶段默认输出复位信号**；在非复位状态下，对于外部复位信号，有效电平需要持续几个时钟周期才被视为有效信号，才会有复位输出。
>
> 人话：产生**复位信号**用的！
>
> 其信号如下：

| 名称                 | 方向 | 位宽           | 有效电平                | 说明            |
| -------------------- | ---- | -------------- | ----------------------- | --------------- |
| slowest_sync_clk     | I    | 1              | -                       | 最慢同步时钟    |
| ext_reset_in         | I    | 1              | 可配置， 默认低电平有效 | 外部复位        |
| aux_reset_in         | I    | 1              | 可配置， 默认低电平有效 | 辅助复位        |
| mb_debug_sys_rst     | I    | 1              | 高                      | 总线调试复位    |
| dcm_locked           | I    | 1              | 高                      | dcm的locked信号 |
| mb_reset             | O    | 1              | 高                      | 总线复位        |
| bus_struct_reset     | O    | 1 ~ 8， 默认1  | 高                      | 总线高电平复位  |
| peripheral_reset     | O    | 1 ~ 16， 默认1 | 高                      | 外设高电平复位  |
| interconnect_aresetn | O    | 1 ~ 8， 默认1  | 低                      | 互联低电平复位  |
| peripheral_aresetn   | O    | 1 ~ 16， 默认1 | 低                      | 外设低电平复位  |

输出总共有5个，均为各种reset信号，而且有高电平的有低电平的。按道理来说2个复位信号（一个高有效一个低有效）不就够了，搞那么多干啥？

事实上，在一个系统中，对于不同类别的模块，复位次序不同。例如：对于A、B两个模块，在系统刚刚启动时，都是处于复位状态的。但我们要求A先结束复位，等A彻底准备好了，再结束B的复位，这部就得搞多个复位信号出来了么？

> 各输出之间有固定的时序关系，此时序关系的目的是让不同功能模块开始工作的时间不同，使用时需要合理使用各输出。
>
> `bus_struct_rst`与`interconnect_areset`持续32个周期有效后同时最先失效 -> 过16周期，`peripheral_reset`与`peripheral_areset`失效 -> 再过16周期，`mb_reset`最后失效。
>
> ![img](./SoC_startup.assets/Processor_System_Resetv5.0-12.png)

但看上面自动连线的结果，Interconnect和CPU核、BRAM Controller都用的`peripheral_resetn`，这是不合理的。应该让Interconnect接`interconnect_resetn`，其他的（包括CPU核）接`peripheral_resetn`就好，记得更正下。

还有一个`dcm_locked`信号：

> 特别注意dcm_locked信号，此信号为低时表示**时钟还未稳定**，此时reset IP的复位输出全部有效，只有当dcm_locked信号为高时，reset IP的输出才受外部复位输入与辅助复位输入的控制。

（我们发现Clock Wizard的`locked`信号和Processor System Reset`dcm_locked`相连了，印证了上述说法。）

### 手动补上剩余的、要补的线

略

![image-20230517213056389](./SoC_startup.assets/image-20230517213056389.png)

## 设置地址空间

![image-20230517213415846](./SoC_startup.assets/image-20230517213415846.png)

在下方的列表中，“Cell”一列默认特别小，拉大一点，就出来名字了。

![截图_20230517213510](./SoC_startup.assets/截图_20230517213510.gif)

在设置地址时，我们心里要知道：这是设置的**物理地址**！！！

![image-20230517213659905](./SoC_startup.assets/image-20230517213659905.png)

> 上面这张图出现了两段特殊的空间，`kseg0`和`kseg1`。首先来说`kseg1`，**这段空间是`uncached,unmapped`。**这段空间用来干什么呢？当我们的内核刚开始启动的时候，明显我们的CPU还不具备管理我们的MMU内存管理单元的能力，那么我们需要映射和cache的区域没有办法解决这一问题，所以引出了这一段。[MIPS架构体系kseg0和kseg1段解释_爱学习mips的阿健的博客-CSDN博客](https://blog.csdn.net/m0_48368588/article/details/123504781)
>
> 人话：`kseg1`由于是`uncached`的，所以用于访问外设；用户程序使用`kseg0`就好了。

MIPS的启动地址是`0xbfc00000`，但那是虚拟地址！对应地物理地址是`0x1fc00000`！目前反正是测试用的SoC，Range就简单写个16K吧。当Offset Address和Range都确定了以后，High Address自己就算出来了！

![image-20230517221751372](./SoC_startup.assets/image-20230517221751372.png)

## 设计检查

至此简易的SoC已经搭建完成了，我们下面来检查一下设计是不是合理。

![image-20230517214600301](./SoC_startup.assets/image-20230517214600301.png)

验证通过了会提示Successful

> 在这里把ejtag相关的都接常值0了，nmi接1，中断接1（gs232默认低电平有效）

![image-20230517222126124](./SoC_startup.assets/image-20230517222126124.png)

## 封装设计

在Sources选项卡中，右键bd文件，点击“Generate Output Products”，用于将IP核参数、连接信息更新到工程中。

![image-20230517222308383](./SoC_startup.assets/image-20230517222308383.png)

![image-20230517222434755](./SoC_startup.assets/image-20230517222434755.png)

还是右键bd文件，选择“Create HDL Wrapper”，创建HDL顶层文件（可以理解为把连线图转成Verilog代码）。

最后去综合一下，理论上是Success的！

![image-20230517224910313](./SoC_startup.assets/image-20230517224910313.png)

## 检验学习成果

上面只添加了一个ROM，接下来请添加一个RAM上去吧！

地址分配为：（注意！ROM的地址范围改了）

![image-20230518193320762](./SoC_startup.assets/image-20230518193320762.png)

修改完成后，记得重复设计检查、封装设计、更新HDL Wrapper等。

## 附加：如何把.v文件加入到Block Design中

这里以添加龙芯官方提供的SoC中的`confreg.v`为例。

首先把`confreg.v`添加进Source中（略），然后右键之：

![image-20230518224712837](./SoC_startup.assets/image-20230518224712837.png)

可以看到已经加进来啦！

![image-20230518224753414](./SoC_startup.assets/image-20230518224753414.png)



# 各式各样的外设

> 本部分大批量参考了如下链接，源地址：
>
> [在Xilinx FPGA上搭建SoC – 属于CYY自己的世界 (cyyself.name)](https://blog.cyyself.name/soc-on-xilinx-fpga/)
>
> [Xilinx MIG IP核使用_我是厉害的人的博客-CSDN博客](https://blog.csdn.net/weixin_42612956/article/details/113662808)
>
> [【原创】Xilinx_7Series_MIG控制器驱动DDR3_mig工具_锤王马加爵的博客-CSDN博客](https://blog.csdn.net/qq_40807206/article/details/109856959)
>
> [Xilinx MIG 控制器使用详解（一）_mig xilinx_为中国IC之崛起而读书的博客-CSDN博客](https://blog.csdn.net/MaoChuangAn/article/details/85268231)
>
> [【正点原子FPGA连载】第四章按键中断实验--摘自达芬奇之Microblaze 开发指南 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/265704580)
>
> 感谢原作者分享！

## DDR

> IP 主要提供一个内存接口解决方案，使得我们不需要去进行具体的器件时序实现，通过提供的AXI接口来进行数据的读写控制。

接下来我们使用`MIG 7 Series`来添加DDR控制器。

![mig_7series_0](./SoC_startup.assets/mig_7series_0.png)

在Block Design中添加上述IP后，双击进入配置。（哐哐下一步）

### Memory Selection

选择DDR3即可。

![mig_memory_selection](./SoC_startup.assets/mig_memory_selection.png)

### Options For Controller 0

`Clock Period`：由FPGA产生作用于DDR的IO口时钟速率，即**连接到DDR的CK，CK#的时钟**，即**内存频率**。

> 内存频率，个人建议选择200MHz的倍数，这样一定可以选用200MHz作为MIG的输入时钟频率。此外，DDR是Double Data Rate，在上升沿和下降沿都可以进行数据传输，因此这里的400MHz对应到我们购买内存条时常说的Double后的有效频率需要*2，也就是800MHz。
>
> ——[在Xilinx FPGA上搭建SoC – 属于CYY自己的世界 (cyyself.name)](https://blog.cyyself.name/soc-on-xilinx-fpga/)

`PHY to Controller Clock Ratio`：这个决定DDR的IO时钟与用户时钟（ui_clk）的比例，也就是用来作为读MIG控制器地址生成的时钟，也就是AXI控制器的频率，比如采用4:1比例，IO时钟为 400MHz，那么`ui_clk`为100MHz

`Memory Part`：选择DDR芯片型号，不同的型号有不同的位宽和容量，**选型号相当于选DDR芯片的位宽和容量**。龙芯开发板上的DDR芯片是`K4B1G1646G-BCK0`，位宽是16，大小是1Gb，可以选择`MT41J64M16XX-125G`。

`ORDERING`：用于设置MIG是否对访存操作进行重新排序（乱序），这里选择`Normal`以允许重排，提高访存效率。

![截图_20230615171642](./SoC_startup.assets/截图_20230615171642.png)

### AXI parameter options

`Data Width`：AXI总线的数据宽度，选择32，和CPU暴露出来的AXI总线宽度一致；

`Arbitration Scheme`：AXI总线读写通道的仲裁方案，保持默认`RD_PRI_REG`（读取和写入地址通道的优先级相同）就好。

> **Read Priority (RD_PRI_REG)**
>
> 读取和写入地址通道的优先级相同。
>
> 当发生以下情况之一时，将处理来自写入地址通道的请求：
>
> - 没有来自读取地址通道的挂起请求
> - Read starve 限制达到 256。仅在突发结束时检查它
> - Read wait 限制达到16
> - 写QOS为非零。仅在突发结束时检查它。
>
> 读取地址通道的请求以类似的方法处理。
>
> ——[【VIVADO IP】Memory Interface Generator - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/501725127)

`Address Width`是自动算出来的：前面说是1Gb大小的DDR么，1Gb/8bit = 2^27，正正好。

至于下面的`Narrow Burst Support`、`ID Width`，链接到AXI总线上后会自动根据总线设置，不用咱们管。

![截图_20230615171425](./SoC_startup.assets/截图_20230615171425.png)

### Memory Options

`Input Clock Period`：**MIG IP 核的**系统输入时钟周期（输入到MIG IP核里面的时钟），作用于 IP 内部的MMCM，用来生成用户时钟及DDR3时钟。推荐使用 200MHz，这样后续参考时钟可以使用相同时钟源，减少时钟资源消耗。

`Controller Chip Select Pin`：只在使用单rank配置的内存时，可以通过禁用片选CS#来节约端口，由于龙芯开发板上只有1个DDR芯片，所以这里我们`Disable`掉。默认情况片选是需要控制的。

![截图_20230615171331](./SoC_startup.assets/截图_20230615171331.png)

### FPGA Options

`System Clock`：选择 MIG IP 的系统时钟类型（即Memory Options中的input clock），如果是FPGA内部产生（例如MMCM和PLL），这些时钟默认是添加了 buffer，所以这里可以选择`No Buffer`。

`Reference Clock`：选择参考时钟类型。这个参考时钟是用于输入延时控制（IDELAYCTRL的参考时钟），通常是200MHz。所以当前面input clock选择200MHz时，这里可以选择 **use system clock** 选项。

`System Reset Polarity`：复位信号高有效还是低有效，看SoC中具体给他什么样的复位信号了。

`Internal Vref`：建议关闭来提高稳定性，如果关闭后无法通过Validate（例如龙芯杯开发板），再打开。

> Internal Vref：
>
> 当数据速率在 800 Mbps及以下时，可以选择内部参考电压来释放Vref管脚作为通用I/O使用（每个bank2个）。以bank35为例：
>
> 
>
> ![img](./SoC_startup.assets/v2-8dc4866712a0f80a4b7852afd872ccc3_720w.webp)
>
> 一般情况，VREF需要接到外部参考电压，例如DDR3L为1.35V。如果端口不够用，可以使用内部参考电压，那么端口 E3和N3 就可以当输入来用。

![截图_20230615172441](./SoC_startup.assets/截图_20230615172441.png)

### Extended FPGA Options

默认的`50 Ohms`就好

![截图_20230615172921](./SoC_startup.assets/截图_20230615172921.png)

### I/O Planning Options

对于我们购买的FPGA，只能选择Fixed Pin Out。

![截图_20230615181133](./SoC_startup.assets/截图_20230615181133.png)

### Pin Selection

在这个页面为ddr的各个引脚与板上IO绑定。看着很多？莫怕，先从学长的设计`Save Pin Out`，导出`.ucf`文件。然后在自己的工程这边点击`Read XDC/UCF`，读进来就好（省的自己挨边勾选了233）。读进来后，点击`Validate`，验证通过后才能下一步。

![截图_20230615181435](./SoC_startup.assets/截图_20230615181435.png)

### 各个引脚说明

完成上述初始化步骤后，在Block Design中就得到了如下小方框：

![截图_20230615214158](./SoC_startup.assets/截图_20230615214158.png)

以下列表参考了[【原创】Xilinx_7Series_MIG控制器驱动DDR3_mig工具_锤王马加爵的博客-CSDN博客](https://blog.csdn.net/qq_40807206/article/details/109856959)、[基于MIG IP核的DDR3控制器（一） - black_pigeon - 博客园 (cnblogs.com)](https://www.cnblogs.com/weicc/p/12045782.html)感谢原作者！

| 引脚名称            | I/O  | 含义                                                         |
| ------------------- | ---- | ------------------------------------------------------------ |
| sys_rst             | IN   | IP核复位信号，前面设置的是低有效                             |
| sys_clk_i           | IN   | 是输入到该IP 核的系统时钟，前面我们选择的是NO BUFFER和use system clock所以这里有一个单端的输入时钟接口； |
| aresetn             | IN   | 复位信号，低电平有效                                         |
| ui_clk_sync_rst     | OUT  | MIG输出的用户端复位信号，高电平复位                          |
| ui_clk              | OUT  | MIG输出的用户端时钟，在4:1模式下是DDR主频的1/4，即100MHz     |
| mmcm_locked         | ?    | ?                                                            |
| init_calib_complete | OUT  | output信号，高电平表示MIG控制器校准结束，可以对DDR进行操控**（使用时必须先等待此信号，否则无法正确操作）** |

## AXI Interupt Controller

其他的IP都好理解，这个玩意儿一直摸不透，搞不清这玩意儿到底起什么作用，今天盘它！

### 简介

首先是这玩意儿能干啥？

- 多个中断源转为单个中断源

  问题来了，既然是把多个中断源转换为单个中断源，怎么判断到底是哪个设备发出来的中断呢？

  观察AXI IntC在设备树中的节点：

  ```
  axi_intc_0: interrupt-controller@1fb00000 {
  			#interrupt-cells = <1>;
  			compatible = "xlnx,xps-intc-1.00.a";
  			interrupt-controller;
  			interrupt-parent = <&cpuintc>;
  			interrupts = <2>;
  			reg = <0x1fb00000 0x1000>;
  			xlnx,kind-of-intr = <0x1>;
  			xlnx,num-intr-inputs = <0x1>;
  			status = "okay";
  		};
  ```

  注意到我们把网卡连在intc上，所以观察网卡的设备树节点：

  ```
  axi_ethernetlite: ethernet@1ff00000 {
  	compatible = "xlnx,xps-ethernetlite-1.00.a";
  	device_type = "network";
  	//...省略
  	interrupt-parent = <&axi_intc_0>; //重点看这一行
  	interrupts = <0>;
  	status = "okay";
  	//...省略
  };
  ```

  `interrupt-parent`属性的值恰是`AXI Inttrupt Controller`节点的label(axi_intc_0)。虽然还不太清楚`interrupt-parent`这玩意儿到底啥意思，看字面意思是“父中断”，似乎阐明了和AXI INTC的关系！

  也就是说，即便我们将好几个设备的中断都接到`AXI Inttrupt Controller`上、将多个中断源合并成了一个中断源接到了CPU上，只要设备树写的对，OS就能找到判断到底是哪个设备发出来的中断！

- 转换中断的类型

  例如：有的外设IP，其发出的中断信号类型为边沿触发(Rising Edge)（上升沿触发和下降沿触发），但是一般情况下，咱们的CPU都是采用电平触发(Level)。要想转换，就可以使用AXI intc这个IP

### Basic

> 以下内容大部分摘自如下链接，感谢原作者分享！：
>
> [【正点原子FPGA连载】第四章按键中断实验--摘自达芬奇之Microblaze 开发指南 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/265704580)

双击IP核进入设置页面，首先是Basic选项卡

`Number of Peripheral Interrupts(Auto)`：外围中断设备数量。此选项允许选择外围中断输入的数量。在IP Integrator中，此值由连接中断信号的数量**自动确定**，不用咱们管。

`Enable Fast Interrupt Logic`（咱们用不到）：使能快速中断逻辑。此选项使AXI INTC能够在快速中断模式下工作。在这种模式下，AXI INTC使用`interrupt_address`信号提供中断向量地址，处理器通过`processor_ack`信号确认中断。当选择单信号中断输出时，不可用快速中断模式。

`Peripheral Interrupts Type`：外部设备中断类型，该选项用于设置输入的中断信号。

- `Interrupts type - Edge or Level`：中断类型-边沿或电平。此选项用于将输入中断设置为边缘或电平类型。**注意到这个设置项是一串32位十六进制数字。其中的每一位都对应一个中断输入源。**0表示电平类型，1表示边沿类型。（可以勾上前面的AUTO自动设置，除非不对，可以关掉AUTO，自己调整一下）

  例如：`0xFFFFFFF7`代表第4个设备的中断是电平类型的，第1、2、3个设备的中断是边沿类型的。

- `Level type - High or Low`：电平类型-高电平或低电平。这个设置项还是一串32位十六进制数字，每个数字对应一个中断输入源；如果在上面`Interrupts type - Edge or Level`的设置中，将某个设备的中断类型设为电平类型，那么要根据设备中断是高电平还是低电平设置这串数字中的位；0表示低电平，1表示高电平。（可以勾上前面的AUTO自动设置，除非不对，可以关掉AUTO，自己调整一下）

  例如，第4个设备的中断是电平类型的，并且是高电平触发，所以要把第4位改成1（其他的都无所谓）。

- `Edge type - Rising or Falling`：边沿类型-上升沿或下降沿。0表示下降沿，1表示上升沿。

`Processor Interrupt Type and Connection`：**处理器**中断类型和连接，也就是设置合并后的`irq`中断输出信号是电平还是边沿类型的中断。

`Level Type`：电平类型，如果在上一个选项（`Processor Interrupt Type and Connection`）选择了电平类型中断，那么就要选择是高电平中断还是低电平中断。

`Interrupt Output Connection`（中断输出连接）选项用于设置中断控制器输出的中断信号是单信号还是总线类型的信号，默认`Single`即可。

![截图_20230622215831](./SoC_startup.assets/截图_20230622215831.png)

## Clock选项卡

`s_axi_aclk frequency`：AXI总线的频率

`processor_clk`：处理器的频率

![截图_20230622221354](./SoC_startup.assets/截图_20230622221354.png)

## AXI Clock Converter

### 时钟域

先来补一下时钟域的概念。

> 以下内容摘自下列链接&GPT回答，感谢原作者分享！
>
> [FPGA-时钟域_fpga时钟域_小羊肖恩想的博客-CSDN博客](https://blog.csdn.net/qq_42043804/article/details/113762379)

FPGA设计中的时钟域指的是在设计中使用时钟信号的逻辑区域。**不同的逻辑区域可能使用不同的时钟信号来驱动其操作和状态转换。**每个时钟域都有自己的时钟频率、时钟边沿和时钟相位等特性。

例如：某些寄存器是在时钟上升沿更新自己，所以可以说：时钟直接决定了其行为。由于组合逻辑的输入大多是寄存器的输出，所以和寄存器相连的那些组合逻辑，他们的行为也被寄存器的时钟决定。故：寄存器和与之相连的那些组合逻辑就会共享时钟域。

**时钟域之间**的数据传输和状态转换通常需要使用专门的技术和器件，例如锁存器、寄存器、FIFO缓冲器以及下面要说的`AXI Clock Converter`，来进行同步和调整。这样可以保证在不同时域之间进行可靠的数据传输，并防止因时钟异步导致的数据损坏和错误。

> 时钟不一致究竟会出现什么问题？试想：若一边时钟快（时钟周期1ms），一边时钟慢（时钟周期2ms），快的给慢的传数据；快的那边1ms传一个字符，但慢的这边2ms才接受一个字符，若没有任何防范措施，是不是数据就丢了？





# 编写裸机程序

我们需要写两个程序：`bootloader`和用户程序。为啥要`bootloader`呢？因为我们的程序**默认是放在ROM中**的，而有一些段却是要被读写的，因而需要`bootloader`至少把那些**要读写的段load进RAM中**。

> 下面想到哪儿写哪儿吧，毕竟第一次搞，我也很迷茫。

# MIPS寄存器

| 编号  | 名称  | 功能                                                         |
| ----- | ----- | ------------------------------------------------------------ |
| 0     | zero  | 恒为0的寄存器，一般用来初始化别的寄存器                      |
| 1     | at    | 被汇编器所保留，用来处理超过32位的long long型的数据          |
| 2-3   | v0-v1 | 用来存放函数的返回值                                         |
| 4-7   | a0-a3 | 存放函数的入参                                               |
| 8-15  | t0-t7 | 存放函数中需要保留的临时变量                                 |
| 16-23 | s0-s7 | 存放需要保留的调用栈的信息，当调用子函数的时候，存放需要保留的上下文的信息 |
| 24-25 | t8-t9 | 额外供保留临时变量的寄存器                                   |
| 26-27 | k0-k1 | 给操作系统内核使用的                                         |
| 28    | gp    | 存放全局指针                                                 |
| 29    | sp    | 存放栈指针                                                   |
| 30    | fp    | 存放指向栈帧的指针                                           |
| 31    | ra    | 存放还数返回地址的的寄存器，一般bal和j指令后面的地址将会被保留到ra寄存器内 |

## 编译流程

假设我们有一个`gpio.c`写了一些逻辑，其入口函数为`main`，`start.S`为初始化汇编代码，`default.ld`为链接脚本。为了得到最终的二进制文件，大抵要经过如下流程：

```mermaid
graph LR
  gpio.c--CC编译器-->gpio.S
  gpio.S--AS汇编器-->gpio.o
  start.S--AS汇编器-->start.o
  start.o & gpio.o & default.ld--LD链接器-->gpio0
  gpio0-- objcopy-->gpio0.bin
```

## Makefile的编写



# 学习Nontrivial-mips

> THU的佬们都太猛了！项目链接==>https://github.com/trivialmips/nontrivial-mips

## 中断处理

很奇怪，两个输入输出设备（串口、PS/2）的中断都是直接接到CPU上的，并没有经过`AXI Interrupt Controller`？（包括学长的项目也是这个样子）









（以下内容摘自：[Linux命令学习手册-objcopy - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/115834422)）

objcopy：通过指定输入目标为二进制文件(例如 `-O binary` )， `objcopy` 可以生成**原始格式的二进制文件**。当 `objcopy` 生成一个原始格式的二进制文件的时候，它会生成输入的目标文件的**基本内存拷贝**，然后**所有的标号和可重定位信息都会被去掉**。内存拷贝开始于最低段的加载地址，拷贝到输出文件。