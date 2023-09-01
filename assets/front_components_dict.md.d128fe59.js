import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.93aafbf2.js";const d=JSON.parse('{"title":"数据字典","description":"","frontmatter":{},"headers":[],"relativePath":"front/components/dict.md","filePath":"front/components/dict.md"}'),p={name:"front/components/dict.md"},o=l(`<h1 id="数据字典" tabindex="-1">数据字典 <a class="header-anchor" href="#数据字典" aria-label="Permalink to &quot;数据字典&quot;">​</a></h1><p>数据字典在系统设计中是很常用的方案。由于需要从后台拉取并且多个地方使用，所以要做一些缓存和转化。</p><h2 id="数据存储" tabindex="-1">数据存储 <a class="header-anchor" href="#数据存储" aria-label="Permalink to &quot;数据存储&quot;">​</a></h2><p>使用 <code>Umi Max</code> 的<a href="https://umijs.org/docs/max/data-flow" target="_blank" rel="noreferrer">数据流</a>管理插件实现。</p><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// vivy-react/src/models/dict.ts</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">default</span><span style="color:#E1E4E8;"> () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> [</span><span style="color:#79B8FF;">dict</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">actions</span><span style="color:#E1E4E8;">] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">useMap</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#B392F0;">DictType</span><span style="color:#E1E4E8;">, </span><span style="color:#B392F0;">DictData</span><span style="color:#E1E4E8;">[]&gt;()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 加载字典列表</span></span>
<span class="line"><span style="color:#6A737D;">   * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">type</span><span style="color:#6A737D;"> 字典类型</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">loadDict</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">DictType</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 重新加载字典</span></span>
<span class="line"><span style="color:#6A737D;">   * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">type</span><span style="color:#6A737D;"> 字典类型</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">reloadDict</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">type</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">DictType</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 转化为下拉选项</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toSelect</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">data</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">DictData</span><span style="color:#E1E4E8;">[]) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 转化为枚举选项</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toMapEnum</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">data</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">DictData</span><span style="color:#E1E4E8;">[]) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    dict,</span></span>
<span class="line"><span style="color:#E1E4E8;">    loadDict: </span><span style="color:#B392F0;">useCallback</span><span style="color:#E1E4E8;">(loadDict, [dict]),</span></span>
<span class="line"><span style="color:#E1E4E8;">    reloadDict: </span><span style="color:#B392F0;">useCallback</span><span style="color:#E1E4E8;">(reloadDict, []),</span></span>
<span class="line"><span style="color:#E1E4E8;">    toSelect: </span><span style="color:#B392F0;">useCallback</span><span style="color:#E1E4E8;">(toSelect, []),</span></span>
<span class="line"><span style="color:#E1E4E8;">    toMapEnum: </span><span style="color:#B392F0;">useCallback</span><span style="color:#E1E4E8;">(toMapEnum, []),</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// vivy-react/src/models/dict.ts</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> [</span><span style="color:#005CC5;">dict</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">actions</span><span style="color:#24292E;">] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">useMap</span><span style="color:#24292E;">&lt;</span><span style="color:#6F42C1;">DictType</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">DictData</span><span style="color:#24292E;">[]&gt;()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 加载字典列表</span></span>
<span class="line"><span style="color:#6A737D;">   * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">type</span><span style="color:#6A737D;"> 字典类型</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">loadDict</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DictType</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 重新加载字典</span></span>
<span class="line"><span style="color:#6A737D;">   * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">type</span><span style="color:#6A737D;"> 字典类型</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">reloadDict</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DictType</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 转化为下拉选项</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toSelect</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">data</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DictData</span><span style="color:#24292E;">[]) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 转化为枚举选项</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toMapEnum</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">data</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DictData</span><span style="color:#24292E;">[]) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    dict,</span></span>
<span class="line"><span style="color:#24292E;">    loadDict: </span><span style="color:#6F42C1;">useCallback</span><span style="color:#24292E;">(loadDict, [dict]),</span></span>
<span class="line"><span style="color:#24292E;">    reloadDict: </span><span style="color:#6F42C1;">useCallback</span><span style="color:#24292E;">(reloadDict, []),</span></span>
<span class="line"><span style="color:#24292E;">    toSelect: </span><span style="color:#6F42C1;">useCallback</span><span style="color:#24292E;">(toSelect, []),</span></span>
<span class="line"><span style="color:#24292E;">    toMapEnum: </span><span style="color:#6F42C1;">useCallback</span><span style="color:#24292E;">(toMapEnum, []),</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="基础使用" tabindex="-1">基础使用 <a class="header-anchor" href="#基础使用" aria-label="Permalink to &quot;基础使用&quot;">​</a></h2><p>列如在表格中使用：</p><ol><li>使用 <code>useModel</code> 获取到字典数据。</li><li>使用 <code>loadDict</code> 加载数据，如果不存在调用接口存在直接返回(包含禁用、已删除)。</li><li>使用 <code>toSelect</code> 获取到可选择的，而列表使用全部的用做展示。</li></ol><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki github-dark has-highlighted-lines vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { ProTable } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@ant-design/pro-components&#39;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { useModel } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@umijs/max&#39;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { DictTag } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@/components/Dict&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Dict</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 注册字典数据</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line highlighted"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> { </span><span style="color:#79B8FF;">loadDict</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">toSelect</span><span style="color:#E1E4E8;"> } </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">useModel</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;dict&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line highlighted"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">sysNormalDisable</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">loadDict</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;sys_normal_disable&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 表格列配置</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">columns</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ProColumns</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#79B8FF;">any</span><span style="color:#E1E4E8;">&gt;[] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> [</span></span>
<span class="line"><span style="color:#E1E4E8;">    {</span></span>
<span class="line"><span style="color:#E1E4E8;">      title: </span><span style="color:#9ECBFF;">&#39;状态&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      dataIndex: </span><span style="color:#9ECBFF;">&#39;status&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      valueType: </span><span style="color:#9ECBFF;">&#39;select&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line highlighted"><span style="color:#E1E4E8;">      fieldProps: { options: </span><span style="color:#B392F0;">toSelect</span><span style="color:#E1E4E8;">(sysNormalDisable) },</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">render</span><span style="color:#E1E4E8;">: (</span><span style="color:#FFAB70;">_</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">record</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line highlighted"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> &lt;</span><span style="color:#79B8FF;">DictTag</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">options</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{sysNormalDisable} </span><span style="color:#B392F0;">value</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{record.status} /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">  ]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> &lt;</span><span style="color:#79B8FF;">ProTable</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">columns</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{columns} /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">default</span><span style="color:#E1E4E8;"> Dict</span></span></code></pre><pre class="shiki github-light has-highlighted-lines vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { ProTable } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@ant-design/pro-components&#39;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { useModel } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@umijs/max&#39;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { DictTag } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@/components/Dict&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Dict</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 注册字典数据</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line highlighted"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> { </span><span style="color:#005CC5;">loadDict</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">toSelect</span><span style="color:#24292E;"> } </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">useModel</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;dict&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line highlighted"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">sysNormalDisable</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">loadDict</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;sys_normal_disable&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * 表格列配置</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">columns</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ProColumns</span><span style="color:#24292E;">&lt;</span><span style="color:#005CC5;">any</span><span style="color:#24292E;">&gt;[] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> [</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">      title: </span><span style="color:#032F62;">&#39;状态&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      dataIndex: </span><span style="color:#032F62;">&#39;status&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      valueType: </span><span style="color:#032F62;">&#39;select&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line highlighted"><span style="color:#24292E;">      fieldProps: { options: </span><span style="color:#6F42C1;">toSelect</span><span style="color:#24292E;">(sysNormalDisable) },</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">render</span><span style="color:#24292E;">: (</span><span style="color:#E36209;">_</span><span style="color:#24292E;">, </span><span style="color:#E36209;">record</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line highlighted"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> &lt;</span><span style="color:#005CC5;">DictTag</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">options</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{sysNormalDisable} </span><span style="color:#6F42C1;">value</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{record.status} /&gt;</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">  ]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> &lt;</span><span style="color:#005CC5;">ProTable</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">columns</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{columns} /&gt;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> Dict</span></span></code></pre></div>`,9),e=[o];function c(t,r,y,E,i,D){return n(),a("div",null,e)}const A=s(p,[["render",c]]);export{d as __pageData,A as default};
