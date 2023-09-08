import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.93aafbf2.js";const u=JSON.parse('{"title":"系统权限","description":"","frontmatter":{},"headers":[],"relativePath":"back/common/security.md","filePath":"back/common/security.md"}'),p={name:"back/common/security.md"},o=l(`<h1 id="系统权限" tabindex="-1">系统权限 <a class="header-anchor" href="#系统权限" aria-label="Permalink to &quot;系统权限&quot;">​</a></h1><p>在管理系统中通常需要不同的角色做不同的事情，也就有了不同的权限。项目实现了基于 <code>JWT</code> 的身份认证，基于 <code>RBAC</code> 的访问控制。</p><h2 id="权限装饰器" tabindex="-1">权限装饰器 <a class="header-anchor" href="#权限装饰器" aria-label="Permalink to &quot;权限装饰器&quot;">​</a></h2><p>使用装饰器验证当前用户是否有权限访问当前的资源。</p><h3 id="public" tabindex="-1">@Public() <a class="header-anchor" href="#public" aria-label="Permalink to &quot;@Public()&quot;">​</a></h3><p>公开：不需要认证就能进入该方法。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { Public } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@vivy-common/security&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AppController</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  @</span><span style="color:#B392F0;">Public</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">getHello</span><span style="color:#E1E4E8;">() {}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { Public } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@vivy-common/security&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AppController</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  @</span><span style="color:#6F42C1;">Public</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">getHello</span><span style="color:#24292E;">() {}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="requireroles" tabindex="-1">@RequireRoles() <a class="header-anchor" href="#requireroles" aria-label="Permalink to &quot;@RequireRoles()&quot;">​</a></h3><p>角色认证：必须具有指定角色标识才能进入该方法。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { Logical, RequireRoles } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@vivy-common/security&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AppController</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 必须拥有 admin 角色才可访问</span></span>
<span class="line"><span style="color:#E1E4E8;">  @</span><span style="color:#B392F0;">RequireRoles</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;admin&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">getHello</span><span style="color:#E1E4E8;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 必须拥有 admin 和 common 角色才可访问</span></span>
<span class="line"><span style="color:#E1E4E8;">  @</span><span style="color:#B392F0;">RequireRoles</span><span style="color:#E1E4E8;">([</span><span style="color:#9ECBFF;">&#39;admin&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&#39;common&#39;</span><span style="color:#E1E4E8;">])</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">getHello</span><span style="color:#E1E4E8;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 必须拥有 admin 或 common 角色才可访问</span></span>
<span class="line"><span style="color:#E1E4E8;">  @</span><span style="color:#B392F0;">RequireRoles</span><span style="color:#E1E4E8;">([</span><span style="color:#9ECBFF;">&#39;admin&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&#39;common&#39;</span><span style="color:#E1E4E8;">], Logical.</span><span style="color:#79B8FF;">OR</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">getHello</span><span style="color:#E1E4E8;">() {}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { Logical, RequireRoles } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@vivy-common/security&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AppController</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 必须拥有 admin 角色才可访问</span></span>
<span class="line"><span style="color:#24292E;">  @</span><span style="color:#6F42C1;">RequireRoles</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;admin&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">getHello</span><span style="color:#24292E;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 必须拥有 admin 和 common 角色才可访问</span></span>
<span class="line"><span style="color:#24292E;">  @</span><span style="color:#6F42C1;">RequireRoles</span><span style="color:#24292E;">([</span><span style="color:#032F62;">&#39;admin&#39;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&#39;common&#39;</span><span style="color:#24292E;">])</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">getHello</span><span style="color:#24292E;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 必须拥有 admin 或 common 角色才可访问</span></span>
<span class="line"><span style="color:#24292E;">  @</span><span style="color:#6F42C1;">RequireRoles</span><span style="color:#24292E;">([</span><span style="color:#032F62;">&#39;admin&#39;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&#39;common&#39;</span><span style="color:#24292E;">], Logical.</span><span style="color:#005CC5;">OR</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">getHello</span><span style="color:#24292E;">() {}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="requirepermissions" tabindex="-1">@RequirePermissions() <a class="header-anchor" href="#requirepermissions" aria-label="Permalink to &quot;@RequirePermissions()&quot;">​</a></h3><p>权限认证：必须具有指定权限才能进入该方法。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { Logical, RequirePermissions } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@vivy-common/security&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AppController</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 必须拥有 system:user:add 权限才可访问</span></span>
<span class="line"><span style="color:#E1E4E8;">  @</span><span style="color:#B392F0;">RequirePermissions</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;system:user:add&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">getHello</span><span style="color:#E1E4E8;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 必须拥有 system:user:add 和 system:user:edit 权限才可访问</span></span>
<span class="line"><span style="color:#E1E4E8;">  @</span><span style="color:#B392F0;">RequirePermissions</span><span style="color:#E1E4E8;">([</span><span style="color:#9ECBFF;">&#39;system:user:add&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&#39;system:user:edit&#39;</span><span style="color:#E1E4E8;">])</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">getHello</span><span style="color:#E1E4E8;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 必须拥有 system:user:add 或 system:user:edit 权限才可访问</span></span>
<span class="line"><span style="color:#E1E4E8;">  @</span><span style="color:#B392F0;">RequirePermissions</span><span style="color:#E1E4E8;">([</span><span style="color:#9ECBFF;">&#39;system:user:add&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&#39;system:user:edit&#39;</span><span style="color:#E1E4E8;">], Logical.</span><span style="color:#79B8FF;">OR</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">getHello</span><span style="color:#E1E4E8;">() {}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { Logical, RequirePermissions } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@vivy-common/security&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AppController</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 必须拥有 system:user:add 权限才可访问</span></span>
<span class="line"><span style="color:#24292E;">  @</span><span style="color:#6F42C1;">RequirePermissions</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;system:user:add&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">getHello</span><span style="color:#24292E;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 必须拥有 system:user:add 和 system:user:edit 权限才可访问</span></span>
<span class="line"><span style="color:#24292E;">  @</span><span style="color:#6F42C1;">RequirePermissions</span><span style="color:#24292E;">([</span><span style="color:#032F62;">&#39;system:user:add&#39;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&#39;system:user:edit&#39;</span><span style="color:#24292E;">])</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">getHello</span><span style="color:#24292E;">() {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 必须拥有 system:user:add 或 system:user:edit 权限才可访问</span></span>
<span class="line"><span style="color:#24292E;">  @</span><span style="color:#6F42C1;">RequirePermissions</span><span style="color:#24292E;">([</span><span style="color:#032F62;">&#39;system:user:add&#39;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&#39;system:user:edit&#39;</span><span style="color:#24292E;">], Logical.</span><span style="color:#005CC5;">OR</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">getHello</span><span style="color:#24292E;">() {}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="编程式验证权限" tabindex="-1">编程式验证权限 <a class="header-anchor" href="#编程式验证权限" aria-label="Permalink to &quot;编程式验证权限&quot;">​</a></h2><p>如果需要在业务逻辑中验证权限可以使用 <a href="https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-common/vivy-common-security/src/services/auth.service.ts" target="_blank" rel="noreferrer">权限验证工具类</a> 提供的函数。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { AuthService } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@vivy-common/security&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">class</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AppController</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">constructor</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">private</span><span style="color:#E1E4E8;"> </span><span style="color:#FFAB70;">authService</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AuthService</span><span style="color:#E1E4E8;">) {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">getHello</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.authService.</span><span style="color:#B392F0;">hasRole</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;admin&#39;</span><span style="color:#E1E4E8;">)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.authService.</span><span style="color:#B392F0;">hasPermission</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;system:user:add&#39;</span><span style="color:#E1E4E8;">)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { AuthService } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@vivy-common/security&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">class</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AppController</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">constructor</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">private</span><span style="color:#24292E;"> </span><span style="color:#E36209;">authService</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AuthService</span><span style="color:#24292E;">) {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">getHello</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.authService.</span><span style="color:#6F42C1;">hasRole</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;admin&#39;</span><span style="color:#24292E;">)) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.authService.</span><span style="color:#6F42C1;">hasPermission</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;system:user:add&#39;</span><span style="color:#24292E;">)) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="相关源码" tabindex="-1">相关源码 <a class="header-anchor" href="#相关源码" aria-label="Permalink to &quot;相关源码&quot;">​</a></h2><ul><li><p><a href="https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-security" target="_blank" rel="noreferrer">https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-security</a></p></li><li><p><a href="https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-modules/vivy-system/src/app.module.ts" target="_blank" rel="noreferrer">https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-modules/vivy-system/src/app.module.ts</a></p></li></ul>`,18),e=[o];function c(t,r,y,E,i,m){return n(),a("div",null,e)}const F=s(p,[["render",c]]);export{u as __pageData,F as default};
