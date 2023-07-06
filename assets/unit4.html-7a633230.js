import{_ as e,W as d,X as n,$ as i}from"./framework-d06488f2.js";const c={},a=i(`<h1 id="数组" tabindex="-1"><a class="header-anchor" href="#数组" aria-hidden="true">#</a> 数组</h1><p>数组是一种数据格式，能够存储多个<strong>同类型</strong>的数值。</p><p>声明数组的通用格式：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>typeName arrayName[arraySize];
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="初始化数组元素" tabindex="-1"><a class="header-anchor" href="#初始化数组元素" aria-hidden="true">#</a> 初始化数组元素</h2><p>我们可以使用大括号初始化方法<strong>在声明时</strong>（且<strong>仅</strong>在声明时）将数组初始化。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int scores[5] = {1, 2, 3, 4, 5};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>不能将一个数组直接赋值给另一个数组。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int scores[5] = {1, 2, 3, 4, 5};
int ranks[5] = scores;//not allowed
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>初始化时提供的<strong>元素值的个数</strong>可以<strong>少于</strong>数组的<strong>元素数目</strong>，此时其他元素会被设置为<code>0</code>。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int scores[5] = {0, 1};
cout &lt;&lt; scores[2];//0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>于是如果想把数组全部初始化为0，可以这么做：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int scores[5] = {0};
int scores[5] = {};//c++11，略掉了0
int scores[5]{};//c++11，略掉了等号和0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><p>初始化时不提供<code>[]</code>内的值，那么C++编译器将自动计算元素个数。</p><p>值得一提的是，使用列表初始化时，不允许<strong>缩窄转换</strong>（备忘：硬赋“吃不下”的值）。</p><h2 id="针对数组的sizeof" tabindex="-1"><a class="header-anchor" href="#针对数组的sizeof" aria-hidden="true">#</a> 针对数组的<code>sizeof</code></h2><p><code>sizeof</code>作用于<strong>数组名</strong>，得到的是整个数组的字节数；作用于数组中的某个元素，则是单个该元素占用的字节数。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int scores[5] = {1, 2, 3, 4, 5};
cout &lt;&lt; sizeof scores &lt;&lt; endl;//20 p.s. 4 * 5 = 20
cout &lt;&lt; sizeof scores[2] &lt;&lt; endl;//4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="字符串" tabindex="-1"><a class="header-anchor" href="#字符串" aria-hidden="true">#</a> 字符串</h1><blockquote><p>此处先介绍C风格字符串（char数组），下一小节介绍<code>string</code>类</p></blockquote><p><code>char</code>数组不一定是字符串，因为字符串要求以<code>\\0</code>结尾。如果一个<code>char</code>数组并未以<code>\\0</code>结尾，那么不应视为字符串处理，更不应使用相关函数对其进行处理，否则这些函数会一直顺着内存读下去，直至遇到<code>\\0</code>。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>char c1[] = {&#39;h&#39;, &#39;i&#39;};//Not a string
char c2[] = {&#39;h&#39;, &#39;i&#39;, &#39;\\0&#39;};//Right
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="初始化字符串" tabindex="-1"><a class="header-anchor" href="#初始化字符串" aria-hidden="true">#</a> 初始化字符串</h2><p>我们可以使用<strong>字符串常量</strong>对<code>char</code>数组进行初始化</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>char c1[] = &quot;Aoligei!&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>用<strong>双引号</strong>扩起的字符串<strong>隐式地包括结尾的空字符</strong>，譬如：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>char c1[8] = &quot;Bozo&quot;;
// B o z o \\0(这个是自动加到字符串末尾的，后续其他的也会设置为\\0) \\0 \\0 \\0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container danger"><p class="hint-container-title">区分字符常量和字符串常量</p><p>字符常量用<strong>单引号</strong>包裹，<strong>本质是</strong>字符串<strong>编码</strong>的简略表示。在ASCII系统中，<code>&#39;s&#39; == 83</code>，<code>&#39;s&#39;</code>只是<code>83</code>的另外一个写法罢了。</p><p>字符串常量用<strong>双引号</strong>包裹，如<code>&quot;s&quot;</code>，其本质是一个地址，指向由<code>&#39;s&#39;</code>、<code>&#39;\\0&#39;</code>组成的字符串中的第一个字符<code>&#39;s&#39;</code>，即字符串常量<strong>第一个字符所在的内存地址</strong>。</p></div><h2 id="字符串常量拼接" tabindex="-1"><a class="header-anchor" href="#字符串常量拼接" aria-hidden="true">#</a> 字符串常量拼接</h2><p>任何两个被空白（空格、制表符、换行符）分割开来的字符串会被自动拼接成一个。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>char c1[] = &quot;Aoligei!&quot;
            &quot;Split!&quot;;
cout &lt;&lt; c1;//Aoligei!Split!
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="strlen的使用" tabindex="-1"><a class="header-anchor" href="#strlen的使用" aria-hidden="true">#</a> <code>strlen</code>的使用</h2><p>要想使用<code>strlen</code>，需要包含<code>cstring</code>头文件。</p><p><code>strlen</code>只计算可见字符，且不把空字符<code>\\0</code>计算在内。</p><h2 id="读取字符串" tabindex="-1"><a class="header-anchor" href="#读取字符串" aria-hidden="true">#</a> 读取字符串</h2><p>我们可以使用<code>cin</code>来读取字符串。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>char c1[20] = {};
char c2[20] = {};
cin &gt;&gt; c1;
cin &gt;&gt; c2;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>请注意：如果在读取<code>c1</code>的时候，输入了<code>Ao ligei</code>并按下回车，那么会赋给<code>c1</code>为<code>Ao</code>，且赋给<code>c2</code>为<code>ligei</code>。这和<code>cin</code>的实现有关系。其以<strong>空白（空格、制表符和换行符）来确定字符串的结束位置</strong>，因而会把<code>Ao</code>赋给<code>c1</code>，此时缓冲区里还有<code>ligei\\n</code>，于是接下来的<code>cin</code>便直接将<code>ligei</code>赋给了<code>c2</code>。</p><h2 id="cin-getline-和cin-get" tabindex="-1"><a class="header-anchor" href="#cin-getline-和cin-get" aria-hidden="true">#</a> <code>cin.getline()</code>和<code>cin.get()</code></h2><p>这两个函数和普通的<code>cin</code>区别在于：<code>getline</code>和<code>get</code><strong>仅以换行符作为字符串结束的标志</strong>，亦即一次可以读取一行，而不管中间有没有空格。</p><p>用法：<code>cin.getline(name, ArSize)</code>，<code>cin.get(name, ArSize)</code></p><p><code>getline</code>和<code>get</code>的区别在于：<code>getline</code>会把缓冲区中的<code>\\n</code>读取并丢弃掉，而<code>get</code>并不会。所以当使用<code>get</code>来读取一行的内容时，通常还需要再调用（什么也没有的参数）<code>get</code>手动读取掉（下一个字符）<code>\\n</code>，如：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>char c1[20];
cin.get(c1, 10).get();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><code>cin.get(c1, 10)</code>返回一个<code>cin</code>对象，所以后边还能再跟一个<code>.get()</code>。</p><p><code>cin.get(name, ArSize)</code>的一个好处在于：可以知道停止读取的原因（是读够了，还是遇到<code>\\n</code>了？）。只需读完后再调用<code>cin.get()</code>获取下一个字符，查看是不是<code>\\n</code>即可。</p><h2 id="读取空行" tabindex="-1"><a class="header-anchor" href="#读取空行" aria-hidden="true">#</a> 读取空行</h2><p>使用<code>cin.get()</code>（<code>cin.getline()</code>不会）读取到空行时，会设置一个失效位，阻塞下面所有的<code>cin</code>相关输入，此时需要用<code>cin.clear()</code>来重置失效位。</p><h2 id="混合cin和cin-getline" tabindex="-1"><a class="header-anchor" href="#混合cin和cin-getline" aria-hidden="true">#</a> 混合<code>cin</code>和<code>cin.getline()</code></h2><p><code>cin</code>从输入流中获取字符串后，不会清掉buffer，如果接着用<code>cin.getline()</code>，那么会得到一个空串。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>char c1[30]{};
char c2[30]{};

cin &gt;&gt; c1;
cin.getline(c2, 30);
cout &lt;&lt; &quot;c1: &quot; &lt;&lt; c1 &lt;&lt; endl;
cout &lt;&lt; &quot;c2: &quot; &lt;&lt; c2 &lt;&lt; endl;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>键入<code>hello</code>后按下回车，（还没输入<code>c2</code>的值）输出为：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>c1: hello
c2: 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>解决方法也很简单，只需将<code>cin &gt;&gt; c1;</code>改成<code>(cin &gt;&gt; c1).get();</code>（是的！<code>cin &gt;&gt; c1</code>也会返回一个<code>istream</code>对象出来！）</p><h1 id="string类简介" tabindex="-1"><a class="header-anchor" href="#string类简介" aria-hidden="true">#</a> string类简介</h1><p><code>string</code>类<strong>隐藏了</strong>字符串的<code>char</code><strong>数组性质</strong>，使得我们可以像使用普通变量那样处理字符串。</p><ul><li>可以使用C风格字符串来初始化<code>string</code>对象：<code>string x = &quot;hello&quot;;</code></li><li>可以使用<code>cin</code>来将键盘中的输入存储到<code>string</code>对象中：<code>cin &gt;&gt; x;</code></li><li>可以使用<code>cout</code>来显示<code>string</code>对象：<code>cout &lt;&lt; x;</code></li></ul><p>类设计使得<code>string</code>对象可以自动调整大小。譬如我们在声明<code>string</code>对象时，并没有像使用<code>char</code>数组那样，指定元素个数。</p><h2 id="初始化string" tabindex="-1"><a class="header-anchor" href="#初始化string" aria-hidden="true">#</a> 初始化<code>string</code></h2><p>既可以用C风格字符串，也可以用列表初始化。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>string x1 = &quot;Hello,&quot;;
string x2 {&quot;world!&quot;};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="string对象身上的操作" tabindex="-1"><a class="header-anchor" href="#string对象身上的操作" aria-hidden="true">#</a> <code>string</code>对象身上的操作</h2><p>我们可以将一个<code>string</code>对象<strong>赋给</strong>另一个<code>string</code>对象，这也算是<strong>复制</strong>操作了。（<code>char</code>数组就不能这么玩，并且还要用<code>strcpy</code>函数）</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>string x1 = &quot;Hello&quot;;
string x2 = x1;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以用<code>+</code>运算符将两个<code>string</code>对象合并起来。（如果是<code>char</code>数组得用<code>strcat</code>函数）</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>string x3 = x1 + x2;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们可以用类方法<code>size()</code>来获取字符串长度。（如果是<code>char</code>数组得用<code>strlen</code>函数）</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>cout &lt;&lt; x1.size();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="string类io" tabindex="-1"><a class="header-anchor" href="#string类io" aria-hidden="true">#</a> <code>string</code>类IO</h2><p>要想<strong>读取一行数据</strong>到<code>string</code>对象中，原来的<code>cin.getline()</code>不能用了，需要换个法子了。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>char c1[30];
string s1;
cin.getline(c1, 20);
getline(cin, s1);
cout &lt;&lt; c1 &lt;&lt; endl;
cout &lt;&lt; s1 &lt;&lt; endl;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>cin</code>被设计的时候，还没有<code>string</code>类呢！所以不能直接用<code>cin</code>的<code>getline()</code>方法为<code>string</code>对象赋值。</p><p>那为什么可以采用<code>cin &gt;&gt;</code>给<code>string</code>类赋值呢？这涉及到友元函数的用法！后面会谈到...</p><h2 id="其他形式的字符串字面值" tabindex="-1"><a class="header-anchor" href="#其他形式的字符串字面值" aria-hidden="true">#</a> 其他形式的字符串字面值</h2><h3 id="复习wchar-t、char16-t、char32-t" tabindex="-1"><a class="header-anchor" href="#复习wchar-t、char16-t、char32-t" aria-hidden="true">#</a> 复习<code>wchar_t</code>、<code>char16_t</code>、<code>char32_t</code></h3><p>对于这三种类型的字面值，我们使用前缀<code>L</code>、<code>u</code>、<code>U</code>来标识。</p><p>对于UTF-8字面值，可以使用前缀<code>u8</code>来标识。</p><h3 id="原始字符串" tabindex="-1"><a class="header-anchor" href="#原始字符串" aria-hidden="true">#</a> 原始字符串</h3><p>在正常的字符串字面值中，我们需要使用<code>\\</code>对很多字符进行转义，这一点也不酷。于是<strong>原始字符串</strong>出来了！它允许我们在字符串字面值内直接使用一系列符号而无需转义。</p><p>我们可以在字符串前面加上前缀<code>R</code>来表示原始字符串，使用<code>&quot;(</code>和<code>)&quot;</code>来标识字符串的开始和结束。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>cout &lt;&lt; R&quot;(&quot; \\n Aoligei \\\\\\)&quot;;//&quot; \\n Aoligei \\\\\\
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果说想在字符串中包含<code>&quot;(</code>和<code>)&quot;</code>怎么办？我们可以在<code>&quot;</code>和<code>(</code>中添加字符（对应的<code>)</code>和<code>&quot;</code>中也要添加），替换掉原本的定界符<code>&quot;(</code>和<code>)&quot;</code>，这样就能在原始字符串中包含<code>&quot;(</code>和<code>)&quot;</code>了。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>cout &lt;&lt; R&quot;+( can accommodate&quot;( )&quot;)+&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="结构简介" tabindex="-1"><a class="header-anchor" href="#结构简介" aria-hidden="true">#</a> 结构简介</h1><p>相较于数组只能存储同一个类型的数据，一个结构可以存储多个类型的数据。</p><h2 id="定义与声明" tabindex="-1"><a class="header-anchor" href="#定义与声明" aria-hidden="true">#</a> 定义与声明</h2><p>下面是一个声明结构的例子：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>struct inflatable {
    char name[20];
    float volume;
    double price;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>C++</code>提倡<strong>在外部</strong>声明结构。</p><p>利用结构声明新变量时，不用像C语言那样，还得在前面加个<code>struct</code>了！</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>inflatable hat;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="访问成员" tabindex="-1"><a class="header-anchor" href="#访问成员" aria-hidden="true">#</a> 访问成员</h2><p>可以使用成员运算符<code>.</code>来访问结构的成员：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>hat.price = 90.8;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="初始化结构变量" tabindex="-1"><a class="header-anchor" href="#初始化结构变量" aria-hidden="true">#</a> 初始化结构变量</h2><p>使用列表初始化：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>inflatable hat = {&quot;Aoligei&quot;, 1.88, 29.99};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>照旧，等号可以省略，且仍然不允许缩窄转换</p><h2 id="成员可以是string类型的对象" tabindex="-1"><a class="header-anchor" href="#成员可以是string类型的对象" aria-hidden="true">#</a> 成员可以是<code>string</code>类型的对象</h2><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>struct inflatable {
    string name;//can be string
    float volume;
    double price;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="结构赋值" tabindex="-1"><a class="header-anchor" href="#结构赋值" aria-hidden="true">#</a> 结构赋值</h2><p>C++中允许使用<strong>赋值运算符</strong>将结构赋给另一个<strong>同类型的</strong>结构。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>inflatable hat = {&quot;hat&quot;, 9.9, 8.8};
inflatable cat = hat;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="结构数组" tabindex="-1"><a class="header-anchor" href="#结构数组" aria-hidden="true">#</a> 结构数组</h2><p>我们也可以创建<strong>元素为结构的数组</strong>。在初始化时，我们用大括号为数组中的每个元素赋值，为每个元素赋值的时候使用结构初始化，所以看上去就是大括号里头套大括号的样子。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>inflatable guests[2] = {
    {&quot;Geng&quot;, 2.0, 9.9},
    {&quot;Wang&quot;, 9.0, 2.8}
};

cout &lt;&lt; guests[0].name;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="共用体" tabindex="-1"><a class="header-anchor" href="#共用体" aria-hidden="true">#</a> 共用体</h1><p>共用体是一种数据格式，可以从自行设计<strong>若干种类型中选择一种</strong>进行存储。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>union num {
    short short_val;
    int int_val;
    long long_val;
};

num n1;
n1.int_val = 10;cout &lt;&lt; n1.int_val &lt;&lt; endl;
n1.long_val = 20;cout &lt;&lt; n1.long_val &lt;&lt; endl;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>共用体最大的用途是：当某个数据项可能会从两种或两种以上的格式中选一个时，节省空间。譬如：有些商品的ID是字符串，有些商品的ID是数字，我们可以这么操作：（用一个<code>type</code>变量标志用的是哪种<code>id</code>）</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>struct good {
    int price;
    int type;
    union id {
        char id_string[20];
        int id_int;
    } id_val;
};

good good1 = {1, 1};
good1.id_val.id_int = 10;
//...

if (good1.type == 0)
    cout &lt;&lt; good1.id_val.id_string;
else
    cout &lt;&lt; good1.id_val.id_int;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码是有一些冗余的，比如\`\`good.id_val.id_int<code>， 还得先来一个</code>id_val<code>，才能有</code>id_int\`。</p><p>我们可以使用<strong>匿名共用体</strong>来解决这个问题：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>struct good {
    int price;
    int type;
    //注意看这里的union！
    union{
        char id_string[20];
        int id_int;
    };
};

good good1;
good1.id_int = 10;

if (good1.type == 0)
    cout &lt;&lt; good1.id_string;
else
    cout &lt;&lt; good1.id_int;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>突然发现一个很好玩的事情，那就是<code>union</code>当中不能让<code>string</code>类成为其成员。搜到的结果是：<code>c++中的union中数据成员是不允许有构造函数的</code>，现在学的少，还不太能理解。日后把这个坑给填上。</p></blockquote><h1 id="枚举" tabindex="-1"><a class="header-anchor" href="#枚举" aria-hidden="true">#</a> 枚举</h1><p>枚举是另一种<strong>定义符号常量</strong>的方法。</p><h2 id="定义与声明-1" tabindex="-1"><a class="header-anchor" href="#定义与声明-1" aria-hidden="true">#</a> 定义与声明</h2><p>同结构类似，枚举也需要先定义，再声明。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>enum fruit {apple, orange, pinapple};
fruit good;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>第一行语句让<code>fruit</code>成为了新类型的名称，于是在第二行我们可以声明一个<code>fruit</code>类型的枚举变量。同时，<code>apple</code>、<code>orange</code>、<code>pinapple</code>成为了<code>fruit</code>类型的符号常量，称为<strong>枚举量</strong>，默认对应整数值0~2。</p><p>声明的时候可以<strong>略掉</strong><code>fruit</code>，这样<strong>只会创建一些枚举量（常量）</strong>，而不会产生新类型。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>enum {apple, orange, pinapple};
int color = apple + orange;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>不止<code>fruit</code>类型的枚举变量可以用这些枚举量，这个作用域下都可以。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>enum fruit {apple, orange, pinapple};
int color = apple;
cout &lt;&lt; apple;//0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h2 id="赋值" tabindex="-1"><a class="header-anchor" href="#赋值" aria-hidden="true">#</a> 赋值</h2><p>我们可以为枚举赋值，如：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>fruit good = orange;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>虽然这些<code>fruit</code>类型的枚举量（<code>orange</code>、<code>apple</code>等）实际上对应的是一个数字，但是我们并不能给<code>good</code>赋一个<code>int</code>类型的变量。这是因为<strong>枚举量可以被自动提升为<code>int</code>类型，但是<code>int</code>类型不能自动转换为枚举类型</strong>。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>good = 0;//invalid, 虽然apple对应0
int color = orange + 3;//valid, 枚举量可提升为整型
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>除此，枚举<strong>并没有定义算术运算</strong>，如：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>fruit good = apple + orange;//invalid
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这是因为运算后<strong>有可能会超出运算范围</strong>。比如<code>orange</code>是1，<code>pinapple</code>是2，一加变成3了，超出去了。</p><p>但我们会发现下面的语句是合法的：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int color = apple + orange;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>不是说好的没有定义运算么，怎么这又行了呢？</p><p>可以这么理解：前面说枚举量可提升为<code>int</code>，在算术表达式中被转换成了<code>int</code>。由于<code>int</code>不能自动转换成枚举，所以<code>fruit good = apple + orange;</code>是不行的，但是将<code>int</code>赋给<code>int</code>是再正常不过得了，所以<code>int color = apple + orange;</code>是可以的。</p><p>不信的话，我们引入类型强制转换，这就可以了：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>good = fruit(apple + orange);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="设置枚举量的值" tabindex="-1"><a class="header-anchor" href="#设置枚举量的值" aria-hidden="true">#</a> 设置枚举量的值</h2><p>可以使用<strong>赋值运算符</strong>显式的指定，如：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>enum {apple = 18, orange = 22, pinapple= 38};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>也可以<strong>只指定部分</strong>，如：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>enum {apple, orange = 22, pinapple};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这种情况下，<code>apple</code>仍然是0，<code>pinapple</code>会比它前面的<code>orange</code>大1。</p><p>最后，可以创建<strong>值相同</strong>的枚举量，如：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>enum {zero, null=0, one, numero_uno = 1};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>上面的例子中，<code>zero</code>和<code>null</code>都是0，<code>one</code>和<code>numero_uno</code>都是1。</p><h2 id="枚举的取值范围" tabindex="-1"><a class="header-anchor" href="#枚举的取值范围" aria-hidden="true">#</a> 枚举的取值范围</h2><p>最初对于枚举而言，只有声明时指出的那些值才是有效的。但是C++通过类型强转，增加了可赋给枚举变量的值。虽说增加了，但还是<strong>有范围</strong>的。</p><p>范围上界的确定：声明中的最大值用二进制表示要几位，那么范围的上界便是这些二进制位所能表示的最大值（全是1），所以通常是2的幂次方减1。</p><p>范围下界的确认：如果声明中的最小值是正数，那么下界便是0。如果是负数，那么下界的确认便和上面关于上界的确认大致相同，只不过是再添一个负号罢了。</p><p>选择用多少空间存储枚举值，是由编译器确定的。</p><blockquote><p>接下来便是指针的内容了，我准备开一个<code>4.5</code>章阅读笔记，专门记录下。今天是2023年的1月4日。时间过得好快。</p></blockquote>`,151),s=[a];function o(l,r){return d(),n("div",null,s)}const u=e(c,[["render",o],["__file","unit4.html.vue"]]);export{u as default};
