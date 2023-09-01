import{_ as s,o as a,c as n,Q as e}from"./chunks/framework.93aafbf2.js";const E=JSON.parse('{"title":"本地开发","description":"","frontmatter":{},"headers":[],"relativePath":"development.md","filePath":"development.md"}'),p={name:"development.md"},l=e(`<h1 id="本地开发" tabindex="-1">本地开发 <a class="header-anchor" href="#本地开发" aria-label="Permalink to &quot;本地开发&quot;">​</a></h1><h2 id="下载项目" tabindex="-1">下载项目 <a class="header-anchor" href="#下载项目" aria-label="Permalink to &quot;下载项目&quot;">​</a></h2><p>克隆项目到本地</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">git</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">clone</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://github.com/haiweilian/vivy-nest-admin.git</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">git</span><span style="color:#24292E;"> </span><span style="color:#032F62;">clone</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://github.com/haiweilian/vivy-nest-admin.git</span></span></code></pre></div><p>此项目使用 <code>pnpm</code> 的 <code>workspace</code> 管理项目，所以必须使用 <code>pnpm</code> 安装依赖。</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">pnpm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">install</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">pnpm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">install</span></span></code></pre></div><h2 id="环境准备" tabindex="-1">环境准备 <a class="header-anchor" href="#环境准备" aria-label="Permalink to &quot;环境准备&quot;">​</a></h2><p>如果 <strong>没有</strong> <code>mysql</code> 和 <code>redis</code> 环境，可以下载 <a href="https://www.docker.com" target="_blank" rel="noreferrer">docker</a> 使用此项目的环境配置。</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># 启动 mysql 和 redis 的服务</span></span>
<span class="line"><span style="color:#B392F0;">pnpm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">run</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">docker:base</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># 启动 mysql 和 redis 的服务</span></span>
<span class="line"><span style="color:#6F42C1;">pnpm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">run</span><span style="color:#24292E;"> </span><span style="color:#032F62;">docker:base</span></span></code></pre></div><p>如果是用 <code>docker</code> 启动的环境那么将会自动初始化数据库表和数据。</p><p>如果不是或初始化有问题你可以手动执行 <a href="https://github.com/haiweilian/vivy-nest-admin/blob/main/sql/vivy-nest-admin.sql" target="_blank" rel="noreferrer">sql/vivy-nest-admin.sql</a> 用于数据库初始化。</p><h2 id="运行项目" tabindex="-1">运行项目 <a class="header-anchor" href="#运行项目" aria-label="Permalink to &quot;运行项目&quot;">​</a></h2><p>构建通用模块。</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">pnpm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">run</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">build:common</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">pnpm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">run</span><span style="color:#24292E;"> </span><span style="color:#032F62;">build:common</span></span></code></pre></div><p>启动后端开发服务，通过 <a href="http://localhost:9200" target="_blank" rel="noreferrer">http://localhost:9200</a> 访问。</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">cd</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">vivy-modules/vivy-system</span></span>
<span class="line"><span style="color:#B392F0;">pnpm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">run</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">dev</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">cd</span><span style="color:#24292E;"> </span><span style="color:#032F62;">vivy-modules/vivy-system</span></span>
<span class="line"><span style="color:#6F42C1;">pnpm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">run</span><span style="color:#24292E;"> </span><span style="color:#032F62;">dev</span></span></code></pre></div><p>启动前端开发服务，通过 <a href="http://localhost:8000" target="_blank" rel="noreferrer">http://localhost:8000</a> 访问。</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">cd</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">vivy-react</span></span>
<span class="line"><span style="color:#B392F0;">pnpm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">run</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">dev</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">cd</span><span style="color:#24292E;"> </span><span style="color:#032F62;">vivy-react</span></span>
<span class="line"><span style="color:#6F42C1;">pnpm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">run</span><span style="color:#24292E;"> </span><span style="color:#032F62;">dev</span></span></code></pre></div>`,18),o=[l];function t(c,r,i,d,h,y){return a(),n("div",null,o)}const u=s(p,[["render",t]]);export{E as __pageData,u as default};
