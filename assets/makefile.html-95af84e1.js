import{_ as e,F as i,W as o,X as l,Y as n,Z as a,a0 as c,$ as t}from"./framework-216dd15f.js";const p={},r=n("p",null,[a("假设我们要从"),n("code",null,"program1.c"),a("、"),n("code",null,"program2.c"),a("、"),n("code",null,"main.c"),a("编译出目标文件"),n("code",null,"test")],-1),d={href:"https://blog.csdn.net/Nire_Yeyu/article/details/106373974",target:"_blank",rel:"noopener noreferrer"},u=t(`<h1 id="第一阶段-基本语法" tabindex="-1"><a class="header-anchor" href="#第一阶段-基本语法" aria-hidden="true">#</a> 第一阶段：基本语法</h1><p>Makefile的基本语法有两条：</p><ol><li><code>[目标文件]:[依赖文件]</code>（注意：顶层文件依赖关系放上面，被依赖的文件的依赖关系放下面。因为程序是按照递归的方式进行依赖文件查找的，看到第一行有一个没见过的依赖文件，就往下一行进行查找）</li><li><code>[TAB]要执行的指令</code></li></ol><p>清除编译过程中的中间文件，可以使用标志位<code>.PHONY</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>test: program1.o program2.o main.o
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="第二阶段-变量" tabindex="-1"><a class="header-anchor" href="#第二阶段-变量" aria-hidden="true">#</a> 第二阶段：变量</h1><p>对于变量的定义：<code>=</code>是替换、<code>+=</code>是追加、<code>:=</code>是常量。（不可对常量增加）</p><p>可以通过<code>$(name)</code>来使用定义过的变量。</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>TAR <span class="token operator">=</span> test
OBJ <span class="token operator">=</span> program1.o program2.o main.o
CC <span class="token operator">:=</span> gcc

<span class="token target symbol"><span class="token variable">$</span>(tar)</span><span class="token punctuation">:</span> <span class="token variable">$</span><span class="token punctuation">(</span>OBJ<span class="token punctuation">)</span>
	<span class="token variable">$</span><span class="token punctuation">(</span>CC<span class="token punctuation">)</span> <span class="token variable">$</span><span class="token punctuation">(</span>OBJ<span class="token punctuation">)</span> -o <span class="token variable">$</span><span class="token punctuation">(</span>TAR<span class="token punctuation">)</span>

<span class="token target symbol">program1.o</span><span class="token punctuation">:</span> program1.c
	<span class="token variable">$</span><span class="token punctuation">(</span>CC<span class="token punctuation">)</span> -c program1.c -o program1.o

<span class="token target symbol">program2.o</span><span class="token punctuation">:</span>
	<span class="token variable">$</span><span class="token punctuation">(</span>CC<span class="token punctuation">)</span> -c program2.c -o program2.o

<span class="token target symbol">main.o</span><span class="token punctuation">:</span>
	<span class="token variable">$</span><span class="token punctuation">(</span>CC<span class="token punctuation">)</span> -c main.c -o main.o

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span>
<span class="token target symbol">clean</span><span class="token punctuation">:</span>
	rm <span class="token variable">$</span><span class="token punctuation">(</span>OBJ<span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="第三阶段-隐含规则与通配符" tabindex="-1"><a class="header-anchor" href="#第三阶段-隐含规则与通配符" aria-hidden="true">#</a> 第三阶段：隐含规则与通配符</h1><p><code>%.o</code>代表<strong>任意</strong>一个<code>.o</code>文件，<code>*.o</code>代表<strong>所有</strong><code>.o</code>文件。</p><p><code>$^</code>代表（规则中）所有依赖文件，<code>$@</code>代表（规则中）所有目标文件，<code>$&lt;</code>代表（规则中）所有依赖文件的第一个文件。</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>TAR <span class="token operator">=</span> test
OBJ <span class="token operator">=</span> program1.o program2.o main.o
CC <span class="token operator">:=</span> gcc

<span class="token target symbol"><span class="token variable">$</span>(TAR)</span><span class="token punctuation">:</span> <span class="token variable">$</span><span class="token punctuation">(</span>OBJ<span class="token punctuation">)</span>
	<span class="token variable">$</span><span class="token punctuation">(</span>CC<span class="token punctuation">)</span> <span class="token variable">$^</span> -o <span class="token variable">$@</span>

<span class="token target symbol">%.o</span><span class="token punctuation">:</span> %.c
	<span class="token variable">$</span><span class="token punctuation">(</span>CC<span class="token punctuation">)</span> -c <span class="token variable">$^</span> -o <span class="token variable">$@</span>

.PHONY
<span class="token target symbol">clean</span><span class="token punctuation">:</span>
	rm <span class="token variable">$</span><span class="token punctuation">(</span>OBJ<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13);function v(m,b){const s=i("ExternalLinkIcon");return o(),l("div",null,[n("blockquote",null,[r,n("p",null,[a("教程来自于"),n("a",d,[a("CSDN"),c(s)]),a("，感谢原作者的总结！")])]),u])}const g=e(p,[["render",v],["__file","makefile.html.vue"]]);export{g as default};
