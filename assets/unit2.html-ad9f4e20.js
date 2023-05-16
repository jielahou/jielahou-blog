import{_ as e,W as d,X as c,$ as n}from"./framework-955715bf.js";const a={},o=n(`<h1 id="进入c" tabindex="-1"><a class="header-anchor" href="#进入c" aria-hidden="true">#</a> 进入C++</h1><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;iostream&gt;
using namespace std;

int main(){
    cout &lt;&lt; &quot;Hello, world!&quot; &lt;&lt; endl;
    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="头文件名" tabindex="-1"><a class="header-anchor" href="#头文件名" aria-hidden="true">#</a> 头文件名</h2><p>C语言的传统是头文件使用拓展名<code>.h</code>，但是C++的头文件<strong>没有</strong>拓展名。</p><p>C++仍然支持老式的C语言的<code>.h</code>头文件，且有些C语言的<code>.h</code>头文件被转换成了C++的头文件，去掉了<code>.h</code>，并在前面加上了<code>c</code>（例如：<code>math.h</code>--&gt;<code>cmath</code>）。</p><p>C++的头文件可以包含<strong>名称空间</strong>。</p><h2 id="名称空间" tabindex="-1"><a class="header-anchor" href="#名称空间" aria-hidden="true">#</a> 名称空间</h2><p><strong>不同的库</strong>可能定义<strong>相同名称的函数</strong>，为了区分，我们可以使用名称空间来指定到底使用哪个函数。</p><p>我们经常见到<code>using namespace std;</code>这句指令，这个叫做<code>using</code>编译指令，表明我们可以使用<code>std</code>名称空间中定义的名称而不用加上<code>std::</code>（譬如<code>std::cout</code>--&gt;<code>cout</code>）。</p><p>这样会使得<code>std</code>中所有函数都不用加<code>std::</code>了，可能带来潜在风险。好的做法是仅使所需的名称可用，如<code>using std::cout;</code>。</p><h2 id="使用cout进行c-输出" tabindex="-1"><a class="header-anchor" href="#使用cout进行c-输出" aria-hidden="true">#</a> 使用<code>cout</code>进行C++输出</h2><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>cout &lt;&lt; &quot;Hello, world!&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们可以理解为，所谓的输出，其实是将<code>Hello, world!</code>这个字符串<strong>插入</strong>到<code>cout</code>对象表示的<strong>输出流</strong>当中。<code>cout</code>对象是<code>ostream</code>对象的实例。</p><h3 id="运算符重载" tabindex="-1"><a class="header-anchor" href="#运算符重载" aria-hidden="true">#</a> 运算符重载</h3><p><code>&lt;&lt;</code>作用于<code>cout</code>时，被理解为插入运算符。我们还知道，<code>&lt;&lt;</code>也是左移运算符号。C++拓展了运算符重载的概念，允许为用户定义的类型重新定义运算符的含义。</p><h3 id="控制符endl与换行符-n" tabindex="-1"><a class="header-anchor" href="#控制符endl与换行符-n" aria-hidden="true">#</a> 控制符<code>endl</code>与换行符<code>\\n</code></h3><p><code>endl</code>对于<code>cout</code>来说是一个控制符，表示重启一行。</p><div class="language-C++ line-numbers-mode" data-ext="C++"><pre class="language-C++"><code>cout &lt;&lt; &quot;重启一行&quot; &lt;&lt; endl;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>也可以使用C语言符号<code>\\n</code>进行换行。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>cout &lt;&lt; &quot;重启一行\\n&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>两者的区别是：<code>endl</code>会清空缓冲槽，但是<code>\\n</code>不会。</p><h2 id="c-源代码的格式化" tabindex="-1"><a class="header-anchor" href="#c-源代码的格式化" aria-hidden="true">#</a> C++源代码的格式化</h2><p>一行代码中<strong>不可分割</strong>的元素叫做<strong>标记</strong>（<code>token</code>），空格、制表符和回车统称为<strong>空白</strong>（<code>white space</code>）。</p><h1 id="c-语句" tabindex="-1"><a class="header-anchor" href="#c-语句" aria-hidden="true">#</a> C++语句</h1><h2 id="声明语句和变量" tabindex="-1"><a class="header-anchor" href="#声明语句和变量" aria-hidden="true">#</a> 声明语句和变量</h2><p>要将信息项存于计算机中，需要指出<strong>存储位置</strong>和<strong>存储空间</strong>。而<strong>声明语句</strong>恰好能指出存储类型、提供位置标签。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int carrots;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>int</code>既指明了数据类型，也指明了<strong>存储空间大小</strong>——要能够容下一个<code>int</code>，<code>carrots</code>指明了<strong>内存单元的名称</strong>。</p><h2 id="赋值语句" tabindex="-1"><a class="header-anchor" href="#赋值语句" aria-hidden="true">#</a> 赋值语句</h2><p>我们可以<strong>连续</strong>使用赋值运算符，此时赋值操作<strong>从右向左</strong>进行。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int x, y, z;
x = y = z = 10;
//10 --&gt; z, z --&gt; y, y --&gt; x
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="cout的新花样" tabindex="-1"><a class="header-anchor" href="#cout的新花样" aria-hidden="true">#</a> <code>cout</code>的新花样</h2><p>在C语言使用<code>printf</code>时，我们通常要显式的指明各个变量的类型，才能正确输出。</p><p>但是，如果使用<code>cout</code>，并不用显式指明。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>cout &lt;&lt; 25;
cout &lt;&lt; &quot;25&quot;;
//均在控制台打印出25
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是因为C++的插入运算符将<strong>根据其后面的数据类型自动调整</strong>行为。</p><h1 id="其他c-语句" tabindex="-1"><a class="header-anchor" href="#其他c-语句" aria-hidden="true">#</a> 其他C++语句</h1><h2 id="使用cin" tabindex="-1"><a class="header-anchor" href="#使用cin" aria-hidden="true">#</a> 使用<code>cin</code></h2><p>我们可以使用<code>&gt;&gt;</code>运算符从<code>cin</code>输入流中抽取字符。</p><p>值得注意的是，并不需要像C语言中用<code>scanf</code>那样，指明欲读取数据的类型、数据存放的地址。<code>cin</code>对象是<code>istream</code>对象的实例。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>int x;
cin &gt;&gt; x;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="给类发送消息" tabindex="-1"><a class="header-anchor" href="#给类发送消息" aria-hidden="true">#</a> 给类发送消息</h2><p>给类发送消息有两种方式，一种是<strong>调用类方法</strong>，另一种方式是<strong>重新定义运算符</strong>（如<code>cout &lt;&lt; &quot;Hello, world&quot;</code>当中的<code>&lt;&lt;</code>）。</p><h1 id="函数" tabindex="-1"><a class="header-anchor" href="#函数" aria-hidden="true">#</a> 函数</h1><h2 id="函数原型" tabindex="-1"><a class="header-anchor" href="#函数原型" aria-hidden="true">#</a> 函数原型</h2><p>C++编译器必须知道函数的<strong>参数类型</strong>和<strong>返回值类型</strong>，C++提供这种信息的方式是使用<strong>函数原型</strong>语句。我们通常把函数原型放在<code>main</code>函数前面。</p><p>譬如，<code>sqrt</code>函数的原型像这样：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>double sqrt(double);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>注：书上这里参数列表中<code>double</code>后面没有跟变量名称。实测在CLion中，如果不跟变量名称，会有2个自动提示。</p></blockquote><p>原型最后的分号，表明它是一个<strong>原型</strong>，而不是<strong>函数头</strong>。如果没有分号的话，编译器会认为这一行是函数头，后面应该接上<strong>函数体</strong>。</p><p><strong>头文件提供了原型</strong>，库文件提供了函数的编译代码。</p><h2 id="main函数的返回值" tabindex="-1"><a class="header-anchor" href="#main函数的返回值" aria-hidden="true">#</a> <code>main</code>函数的返回值</h2><p><code>main()</code>的返回值返回给操作系统，如果是<code>0</code>则代表程序运行成功，不是<code>0</code>则代表出现了问题。</p>`,53),i=[o];function r(s,t){return d(),c("div",null,i)}const u=e(a,[["render",r],["__file","unit2.html.vue"]]);export{u as default};