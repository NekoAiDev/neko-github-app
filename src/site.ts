/**
 * 站点页面：官网首页（GET /）、文档主页（GET /docs）、文档内容页（GET /docs/start）
 * 设计参考：AstrBot（astrbot.app / docs.astrbot.app）
 * 风格：简洁专业、大量留白、浅色为主、深色高对比、带动画
 * 图标：AstrBot 风格（蓝底渐变 + 白色机器人轮廓）
 * 两页文档结构：/docs 文档主页 /docs/start 内容页
 * 只保留左侧导航，删除右侧 TOC
 * 含 GitHub Marketplace 三项必填填写指南 + 常见问题 FAQ
 */

/* ══════════════════════════════════════
   共享样式 —— AstrBot 风格（带动画）
   ══════════════════════════════════════ */
const CSS = `
:root{
  --bg:#ffffff; --bg-sub:#f7f8fa; --bg-hover:#f0f1f4;
  --text:#1a1d26; --text2:#3d4250; --muted:#6b7280; --muted2:#9ca3af;
  --primary:#2563eb; --primary-dark:#1d4ed8; --primary-light:#dbeafe;
  --border:#e5e7eb; --border2:#d1d5db;
  --radius:12px; --radius-lg:16px;
  --shadow-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --shadow:0 4px 14px rgba(0,0,0,.07);
  --shadow-lg:0 10px 40px rgba(0,0,0,.10);
  --maxw:1120px;
}
[data-theme="dark"]{
  --bg:#0d1117; --bg-sub:#161b22; --bg-hover:#1c2333;
  --text:#e6edf3; --text2:#c9d1d9; --muted:#8b949e; --muted2:#484f58;
  --primary:#58a6ff; --primary-dark:#79c0ff; --primary-light:rgba(88,166,255,.12);
  --border:#30363d; --border2:#21262d;
  --shadow-sm:0 1px 3px rgba(0,0,0,.30);
  --shadow:0 4px 14px rgba(0,0,0,.35);
  --shadow-lg:0 10px 40px rgba(0,0,0,.50);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{
  font-family:-apple-system,"PingFang SC","Microsoft YaHei","Noto Sans SC",system-ui,sans-serif;
  color:var(--text);background:var(--bg);line-height:1.65;
  -webkit-font-smoothing:antialiased;transition:color .3s,background .3s;
}
a{color:var(--primary);text-decoration:none;transition:color .15s}
a:hover{color:var(--primary-dark)}
img,svg{display:block}
code{
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:.85em;background:var(--bg-sub);padding:2px 6px;border-radius:6px;color:var(--primary-dark);
  [data-theme="dark"] & { color:var(--primary); }
}
pre{background:var(--bg-sub);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;overflow-x:auto;font-size:.84;line-height:1.65}
pre code{background:none;padding:0;color:inherit;font-size:inherit}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}

/* ── 动画 ── */
@keyframes fadeUp{
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes float{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-6px)}
}
.animate-fadeUp{animation:fadeUp .6s ease-out forwards}
.animate-fadeUp-d1{animation:fadeUp .6s ease-out .1s forwards}
.animate-fadeUp-d2{animation:fadeUp .6s ease-out .2s forwards}
.animate-fadeUp-d3{animation:fadeUp .6s ease-out .3s forwards}
.animate-float{animation:float 3s ease-in-out infinite}

/* ── 文字轮播 ── */
.rotator,.card-rot{
  position:relative;display:inline-block;
  min-height:1.15em;vertical-align:baseline;
}
.rotator span,.card-rot span{
  position:absolute;left:0;top:0;width:100%;
  display:block;white-space:nowrap;
  opacity:0;transition:opacity .4s ease,transform .4s ease;
  transform:translateY(8px);
  pointer-events:none;
}
.rotator span:first-child,.card-rot span:first-child{
  position:relative;left:auto;top:auto;width:auto;
}
.rotator span.active,.card-rot span.active{
  opacity:1!important;transform:translateY(0);pointer-events:auto;
}

/* ── 导航栏 ── */
.nav{
  position:sticky;top:0;z-index:100;
  background:rgba(255,255,255,.85);backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);
  border-bottom:1px solid var(--border);transition:background .3s,border-color .3s;
}
[data-theme="dark"] .nav{background:rgba(13,17,23,.85)}
.nav-inner{max-width:var(--maxw);margin:0 auto;display:flex;align-items:center;height:58px;padding:0 24px;gap:28px}
.brand{display:flex;align-items:center;gap:9px;font-size:1.05rem;font-weight:700;color:var(--text);flex-shrink:0}
.brand svg{width:28px;height:28px;border-radius:8px}
.nav-links{display:flex;align-items:center;gap:4px;margin-left:auto}
.nav-links a{
  padding:7px 14px;border-radius:8px;color:var(--muted);font-size:.9rem;font-weight:500;transition:color .12s,background .12s;
}
.nav-links a:hover{color:var(--text);background:var(--bg-hover)}
.nav-links a.active{color:var(--primary);background:var(--primary-light)}
.nav-btn{
  display:inline-flex;align-items:center;gap:6px;padding:7px 15px;border-radius:8px;
  font-size:.87rem;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--bg);
  color:var(--text);transition:background .12s,border-color .12s;
}
.nav-btn:hover{background:var(--bg-hover)}

/* ── 按钮 ── */
.btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 24px;border-radius:10px;font-size:.94rem;font-weight:600;
  border:1px solid transparent;cursor:pointer;transition:all .18s;
}
.btn svg{width:18px;height:18px}
.btn-primary{background:var(--primary);color:#fff;border-color:var(--primary)}
.btn-primary:hover{background:var(--primary-dark);transform:translateY(-1.5px);box-shadow:var(--shadow-lg)}
.btn-outline{background:var(--bg);color:var(--text);border-color:var(--border)}
.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-1px)}

/* ── Hero ── */
.hero{text-align:center;padding:80px 0 56px}
.hero-badge{
  display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;
  background:var(--primary-light);border:1px solid var(--primary-light);
  font-size:.83rem;color:var(--primary);font-weight:600;margin-bottom:22px;
}
.hero h1{font-size:clamp(2.2rem,5.5vw,3.4rem);line-height:1.15;letter-spacing:-.03em;font-weight:800;color:var(--text)}
.hero h1 .hl{color:var(--primary)}
.hero p{margin:18px auto 0;max-width:580px;color:var(--muted);font-size:1.05rem;line-height:1.72}
.hero-actions{display:flex;gap:12px;justify-content:center;margin-top:32px;flex-wrap:wrap}

/* ── 卡片网格 ── */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
.card{
  background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-lg);
  padding:26px 22px;transition:border-color .2s,box-shadow .2s,transform .2s;
}
.card:hover{border-color:var(--primary);box-shadow:var(--shadow-lg);transform:translateY(-3px)}
.card-icon{width:44px;height:44px;border-radius:11px;display:grid;place-items:center;margin-bottom:16px;background:var(--primary-light);color:var(--primary)}
.card-icon svg{width:22px;height:22px}
.card h3{font-size:1.02rem;font-weight:700;margin-bottom:8px;color:var(--text)}
.card p{font-size:.89rem;color:var(--muted);line-height:1.65}

/* ── 区块 ── */
.section{padding:56px 0}
.section-title{font-size:1.5rem;font-weight:750;letter-spacing:-.02em;color:var(--text);margin-bottom:8px}
.section-sub{color:var(--muted);font-size:.95rem;margin-bottom:32px;max-width:560px}

/* ── 页脚 ── */
.footer{border-top:1px solid var(--border);padding:36px 0 48px;margin-top:48px}
.footer-inner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.footer-brand{display:flex;align-items:center;gap:8px;font-weight:600;color:var(--text);font-size:.92rem}
.footer-brand svg{width:22px;height:22px}
.footer-links{display:flex;gap:20px}
.footer-links a{color:var(--muted);font-size:.88rem}
.footer-links a:hover{color:var(--text)}
.footer-copy{color:var(--muted2);font-size:.8rem;width:100%;text-align:center;margin-top:16px}

/* ══════════════════════════════════════
   文档页样式 —— 左导航 + 内容（两栏，无右侧 TOC）
   ══════════════════════════════════════ */

/* 文档首页 Hero */
.docs-hero{text-align:center;padding:64px 0 48px}
.docs-hero-badge{
  display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;
  border:1px solid var(--border);font-size:.82rem;color:var(--muted);margin-bottom:20px;
  background:var(--bg-sub);
}
.docs-hero h1{font-size:clamp(1.8rem,4vw,2.6rem);line-height:1.18;letter-spacing:-.025em;font-weight:800;color:var(--text)}
.docs-hero h1 .hl{color:var(--primary)}
.docs-hero p{margin:14px auto 0;max-width:540px;color:var(--muted);font-size:1rem;line-height:1.7}

/* 两栏布局：左导航 | 内容（删掉右侧 TOC） */
.doc-layout{display:grid;grid-template-columns:260px 1fr;gap:40px;padding:32px 0 64px;align-items:start}

/* 左侧导航（加宽到 260px，可点击跳转） */
.doc-sidebar{position:sticky;top:76px;max-height:calc(100vh - 92px);overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--border) transparent}
.sidebar-group{margin-bottom:24px}
.sidebar-label{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted2);padding:0 12px 10px}
.sidebar-link{
  display:block;padding:9px 14px;border-radius:8px;font-size:.9rem;color:var(--muted);
  transition:all .15s;border-left:3px solid transparent;margin-left:-14px;padding-left:14px;
}
.sidebar-link:hover{color:var(--text);background:var(--bg-sub);border-left-color:var(--primary);padding-left:12px}
.sidebar-link.active{color:var(--primary);background:var(--primary-light);border-left-color:var(--primary);font-weight:600}

/* 中间内容区 */
.doc-content{min-width:0;max-width:720px}
.doc-content h1{font-size:1.85rem;font-weight:800;letter-spacing:-.02em;margin-bottom:6px;color:var(--text)}
.doc-content .doc-sub{color:var(--muted);font-size:.96rem;margin-bottom:28px}
.doc-content h2{
  font-size:1.28rem;font-weight:700;margin:44px 0 14px;padding-top:24px;
  scroll-margin-top:80px;border-top:1px solid var(--border);letter-spacing:-.01em;color:var(--text);
}
.doc-content h2:first-of-type{border-top:none;padding-top:0;margin-top:0}
.doc-content h3{font-size:1.06rem;font-weight:600;margin:24px 0 10px;color:var(--text)}
.doc-content p,.doc-content li{color:var(--muted);font-size:.93rem;line-height:1.76}
.doc-content ul,.doc-content ol{padding-left:20px;margin:10px 0}
.doc-content li{margin:5px 0}
.doc-content strong{color:var(--text);font-weight:600}
.doc-content table{width:100%;border-collapse:collapse;margin:16px 0;font-size:.89rem;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border)}
.doc-content th,.doc-content td{border:1px solid var(--border);padding:11px 15px;text-align:left}
.doc-content th{background:var(--bg-sub);font-weight:600;font-size:.86rem;color:var(--text)}
.doc-content tr:nth-child(even){background:var(--bg-sub)}
.doc-content .note{
  background:var(--primary-light);border:1px solid var(--primary);border-radius:var(--radius);
  padding:15px 20px;margin:18px 0;font-size:.9rem;line-height:1.68;
}
.doc-content .note strong{color:var(--primary-dark);[data-theme="dark"] &{color:var(--primary)}}
.doc-content .link-card{
  display:flex;align-items:flex-start;gap:12px;padding:14px 18px;border-radius:var(--radius);
  border:1px solid var(--border);margin:10px 0;transition:all .15s;
}
.doc-content .link-card:hover{border-color:var(--primary);box-shadow:var(--shadow-sm);transform:translateX(4px)}
.doc-content .link-card svg{width:20px;height:20px;color:var(--primary);flex-shrink:0;margin-top:2px}
.doc-content .link-card .lc-t{font-weight:600;color:var(--text);font-size:.92rem}
.doc-content .link-card .lc-d{color:var(--muted);font-size:.83rem;margin-top:3px;word-break:break-all}

@media(max-width:960px){
  .doc-layout{grid-template-columns:1fr}
  .doc-sidebar{display:none}
  .hero{padding:56px 0 38px}
  .docs-hero{padding:48px 0 36px}
  .section{padding:38px 0}
  .nav-links a:not(:first-child):not(.nav-btn){display:none}
}
`;

/* ══════════════════════════════════════
   Logo 图标 —— AstrBot 风格
   圆角方形蓝底渐变 + 白色机器人/猫脸轮廓
   用作 favicon + 导航品牌图标
   ══════════════════════════════════════ */
const LOGO_SVG = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="120" height="120" rx="26" fill="url(#lg)"/>
  <!-- 机器人脸轮廓（白色描边填充） -->
  <g fill="#ffffff">
    <!-- 头部圆角矩形 -->
    <rect x="28" y="34" width="64" height="52" rx="16"/>
    <!-- 眼睛 -->
    <rect x="42" y="50" width="12" height="14" rx="4" fill="#2563eb"/>
    <rect x="66" y="50" width="12" height="14" rx="4" fill="#2563eb"/>
    <!-- 天线 -->
    <rect x="57" y="24" width="6" height="14" rx="3"/>
    <circle cx="60" cy="21" r="5"/>
    <!-- 嘴巴/显示屏 -->
    <rect x="44" y="72" width="32" height="6" rx="3" fill="#2563eb" opacity=".5"/>
  </g>
</svg>`;

/* 迷你版（导航栏用）—— 同风格缩小 */
const LOGO_MINI = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="4" width="20" height="16" rx="4" fill="#2563eb"/>
  <rect x="6" y="9" width="3" height="4" rx="1" fill="#fff"/>
  <rect x="15" y="9" width="3" height="4" rx="1" fill="#fff"/>
  <rect x="10" y="15" width="4" height="2" rx="1" fill="#fff" opacity=".6"/>
  <line x1="12" y1="2" x2="12" y2="4.5" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="12" cy="1.5" r="1.2" fill="#2563eb"/>
</svg>`;

/* 功能图标集 */
const ICONS = {
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 12.2V5a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.4"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.3 7.3L3 21l1.7-6.7A8 8 0 1 1 21 12Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  forward: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14l5-5-5-5"/><path d="M4 20v-6a4 4 0 0 1 4-4h12"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.9-.9.9-2.3 0-3.2-.9-.9-2.3-.9-3.2 0Z"/><path d="M9 12 15 6m0 0 3.5-3.5M15 6l3.5 3.5M15 6 9 12"/><path d="M14 10c1.5-1.5 3.5-2 5-1.5.8 2.5.3 4.5-1.2 6L14 10Z"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 14H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 17 4.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V10a2 2 0 1 1 0 4h-.1Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
};

/* 主题切换脚本 */
const THEME_JS = `(function(){
  var b=document.getElementById('thBtn');
  if(!b)return;
  var order=['system','light','dark'];
  var ic={system:'${ICONS.monitor}',light:'${ICONS.sun}',dark:'${ICONS.moon}'};
  function set(t){
    var d=t==='system'?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):t;
    document.documentElement.setAttribute('data-theme',d);
    if(b&&b.querySelector('.ti')) b.querySelector('.ti').innerHTML=ic[t]||'';
  }
  var s=localStorage.getItem('neko-theme')||'system';set(s);
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',function(){if((localStorage.getItem('neko-theme')||'system')==='system') set('system');});
  b.addEventListener('click',function(){var c=localStorage.getItem('neko-theme')||'system';var n=order[(order.indexOf(c)+1)%3];localStorage.setItem('neko-theme',n);set(n);});
})();`;

/* 安装链接自动生成脚本 —— 根据当前域名推断 App slug */
const INSTALL_JS = `(function(){
  var btns=document.querySelectorAll('[data-install]');
  btns.forEach(function(el){
    el.addEventListener('click',function(e){
      e.preventDefault();
      var slug='neko-github-app';
      window.open('https://github.com/apps/'+slug+'/installations/new','_blank');
    });
  });
})();
/* ── 清除页面游离文字 </> ── */
(function(){
  try{
    var body=document.body;
    if(!body)return;
    var nodes=[].slice.call(body.childNodes);
    for(var i=0;i<nodes.length;i++){
      if(nodes[i].nodeType===3&&nodes[i].textContent.trim()==='</>'){
        body.removeChild(nodes[i]);
      }
    }
  }catch(e){}
})();

/* ── 文字轮播引擎（Hero + 卡片通用）──
   纯 CSS 类驱动：JS 只负责定时切换 .active 类名，所有视觉效果由 CSS 控制。
   第一个 span 用 position:relative 撑开容器宽度，其余 absolute 覆盖。 */
(function(){
  function initRotator(el){
    if(!el)return;
    var items=[].slice.call(el.querySelectorAll('span'));
    if(items.length<=1)return;
    var cur=0;
    setInterval(function(){
      items[cur].classList.remove('active');
      cur=(cur+1)%items.length;
      items[cur].classList.add('active');
    },3200);
  }
  if(document.getElementById('heroRotator'))initRotator(document.getElementById('heroRotator'));
  document.querySelectorAll('.card-rot').forEach(initRotator);
})();`;

/* 左侧导航高亮脚本 —— 滚动时自动高亮当前章节 */
const SIDEBAR_JS = `(function(){
  var links=[].slice.call(document.querySelectorAll('.sidebar-link[href^="#"]'));
  if(!links.length)return;
  links.forEach(function(l){
    l.addEventListener('click',function(e){
      e.preventDefault();
      var target=document.querySelector(this.getAttribute('href'));
      if(target){target.scrollIntoView({behavior:'smooth',block:'start'});}
      links.forEach(function(x){x.classList.remove('active');});
      this.classList.add('active');
    });
  });
  var obs=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        links.forEach(function(l){l.classList.remove('active');});
        var a=document.querySelector('.sidebar-link[href="#'+e.target.id+'"]');
        if(a)a.classList.add('active');
      }
    });},{rootMargin:'-100px 0px -60% 0px'});
  links.forEach(function(l){
    var el=document.querySelector(l.getAttribute('href'));
    if(el)obs.observe(el);
  });
})();`;

/* ── 公共部件 ── */

function head(title: string): string {
  return `<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<link rel="icon" type="image/svg+xml" href="${LOGO_SVG.replace(/[\r\n]/g, '')}"/>
<meta name="description" content="Neko GitHub App —— 自动标签、欢迎回复、陈旧清理、Release 通知、PR 检查、Webhook 中转，一个 App 全搞定。运行于 Cloudflare Workers，免费使用。"/>
<style>${CSS}</style>
</head>`;
}

function nav(active: 'home' | 'docs' | 'start' | 'privacy' | 'terms'): string {
  return `<header class="nav">
<div class="nav-inner">
  <a class="brand" href="/">${LOGO_MINI}<span>Neko GitHub App</span></a>
  <nav class="nav-links">
    <a href="/" class="${active === 'home' ? 'active' : ''}">主页</a>
    <a href="/docs"${active === 'docs' || active === 'start' ? ' class="active"' : ''}>文档</a>
    <a href="/privacy"${active === 'privacy' ? ' class="active"' : ''}>隐私</a>
    <a href="/terms"${active === 'terms' ? ' class="active"' : ''}>条款</a>
    <button class="nav-btn" id="thBtn" aria-label="主题切换"><span class="ti">${ICONS.monitor}</span></button>
  </nav>
</div>
</header>`;
}

function footer(): string {
  return `<footer class="footer">
<div class="wrap footer-inner">
  <div class="footer-brand">${LOGO_MINI}<span>Neko GitHub App</span></div>
  <div class="footer-links">
    <a href="/">主页</a>
    <a href="/docs">文档</a>
    <a href="/privacy">隐私政策</a>
    <a href="/terms">服务条款</a>
  </div>
</div>
<div class="footer-copy">Cloudflare Workers &middot; 免费运行</div>
</footer>`;
}

/* ══════════════════════════════════════
   官网首页 —— 参考 astrbot.app
   ══════════════════════════════════════ */
export function homepage(): string {
  return `${head("Neko GitHub App")}
<body>
${nav('home')}
<main class="wrap">
  <section class="hero">
    <div class="hero-badge animate-fadeUp">${ICONS.shield} Open Source GitHub Automation</div>
    <h1 class="animate-fadeUp-d1">让 GitHub 仓库<br/><span class="hl"><span id="heroRotator" class="rotator"><span class="active">自己打理自己</span><span>自动运转起来</span><span>告别重复劳动</span><span>24 小时待命</span><span>零成本托管</span></span></span></h1>
    <p class="animate-fadeUp-d2">自动标签、智能回复、陈旧清理、Release 通知、PR 体检、事件中转 —— 全部聚合到一个免费运行的 GitHub App。每个仓库独立配置，开箱即用。</p>
    <div class="hero-actions animate-fadeUp-d3">
      <a class="btn btn-primary" data-install href="#">${ICONS.download}<span>安装应用</span></a>
      <a class="btn btn-outline" href="/docs">${ICONS.doc}<span>查看文档</span></a>
    </div>
  </section>

  <section id="features" class="section">
    <h2 class="section-title">核心能力</h2>
    <p class="section-sub">六大功能模块，均可通过仓库配置文件单独开关或定制参数。</p>
    <div class="grid">
      <!-- 卡片 1：自动打标签 -->
      <div class="card animate-fadeUp"><div class="card-icon">${ICONS.tag}</div><div class="card-rot"><span class="active"><h3>自动打标签</h3><p>按标题或正文正则匹配，自动给 Issue / PR 打上 bug、feature、documentation 等标签。</p></span><span><h3>智能分类</h3><p>内置 5 条默认规则，也支持完全自定义正则。已存在的标签不会重复添加。</p></span></div></div>
      <!-- 卡片 2：自动回复 -->
      <div class="card animate-fadeUp"><div class="card-icon">${ICONS.chat}</div><div class="card-rot"><span class="active"><h3>自动回复</h3><p>新 Issue 或 PR 创建时自动发送欢迎语。智能跳过机器人账号，避免噪音。</p></span><span><h3>欢迎语定制</h3><p>回复内容可在配置文件中自定义，支持多行文本和变量占位符。</p></span></div></div>
      <!-- 卡片 3：陈旧清理 -->
      <div class="card animate-fadeUp"><div class="card-icon">${ICONS.clock}</div><div class="card-rot"><span class="active"><h3>陈旧清理</h3><p>扫描长期无活动的 Issue 并标记 stale 标签加评论。有人回复时自动移除。</p></span><span><h3>零成本定时</h3><p>支持手动触发或外挂免费定时器，无需付费 cron 额度即可定期扫描。</p></span></div></div>
      <!-- 卡片 4：Release 通知 -->
      <div class="card animate-fadeUp"><div class="card-icon">${ICONS.bell}</div><div class="card-rot"><span class="active"><h3>Release 通知</h3><p>新版本发布时自动推送通知到企业微信、飞书、钉钉或任意 Webhook 通道。</p></span><span><h3>多通道并行</h3><p>多通道并行推送，单个失败不影响其他。支持任意能接收 JSON POST 的服务。</p></span></div></div>
      <!-- 卡片 5：PR 体检 -->
      <div class="card animate-fadeUp"><div class="card-icon">${ICONS.check}</div><div class="card-rot"><span class="active"><h3>PR 体检</h3><p>在 PR 下自动提示草稿状态、目标分支异常、改动量过大等常见问题。</p></span><span><h3>前置风险发现</h3><p>帮助评审者前置发现风险，减少合并后的返工和问题遗漏。</p></span></div></div>
      <!-- 卡片 6：Webhook 中转 -->
      <div class="card animate-fadeUp"><div class="card-icon">${ICONS.forward}</div><div class="card-rot"><span class="active"><h3>Webhook 中转</h3><p>把 GitHub 事件原样转发到任意外部系统，可选签名校验。</p></span><span><h3>事件桥接</h3><p>适合对接自建平台或聚合服务，支持事件白名单过滤。</p></span></div></div>
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">为什么选择它</h2>
    <p class="section-sub">为个人开发者与小团队打造的轻量自动化方案。</p>
    <div class="grid">
      <div class="card"><div class="card-icon">${ICONS.rocket}</div><h3>免费运行</h3><p>部署在 Cloudflare Workers 上，免费额度内完全够用。无需自备服务器，无需运维。</p></div>
      <div class="card"><div class="card-icon">${ICONS.gear}</div><h3>配置驱动</h3><p>每个仓库通过 YAML 配置文件独立控制行为。不写配置则全部默认开启，零学习成本。</p></div>
      <div class="card"><div class="card-icon">${ICONS.shield}</div><h3>安全可控</h3><p>最小权限原则，只请求必要的 GitHub 权限。所有数据在你的仓库和 Worker 之间流转，无第三方依赖。</p></div>
      <div class="card"><div class="card-icon">${ICONS.doc}</div><h3>完整文档</h3><p>中文文档覆盖功能说明、配置字段、通知格式等。开箱即用，遇到问题快速定位。</p></div>
    </div>
  </section>
</main>
${footer()}
<script>${THEME_JS}</script>
<script>${INSTALL_JS}</script>
</body></html>`;
}

/* ══════════════════════════════════════
   文档主页（GET /docs）
   Hero + 徽章 + 快速开始卡片 + 安装按钮
   参考 docs.astrbot.app 首页风格
   ══════════════════════════════════════ */
export function docsPage(): string {
  return `${head("Neko GitHub App · 文档")}
<body>
${nav('docs')}
<main class="wrap">
  <section class="docs-hero">
    <div class="docs-hero-badge animate-fadeUp">${ICONS.shield} GitHub Automation</div>
    <h1 class="animate-fadeUp-d1">Agentic GitHub 助手，<br/>服务<span class="hl">每一个仓库</span></h1>
    <p class="animate-fadeUp-d2">自动标签 / 欢迎回复 / 陈旧清理 / Release 通知 / PR 体检 / 事件中转<br/>配置驱动 · 免费运行 · 开箱即用</p>
    <div class="hero-actions animate-fadeUp-d3">
      <a class="btn btn-primary" data-install href="#">${ICONS.download}<span>安装应用</span></a>
      <a class="btn btn-outline" href="/docs/start">${ICONS.doc}<span>快速开始</span></a>
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">快速开始</h2>
    <div class="grid">
      <div class="card animate-fadeUp">
        <div class="card-icon">${ICONS.download}</div>
        <h3>第一步：安装应用</h3>
        <p>点击上方「安装应用」按钮，将 Neko GitHub App 安装到你的 GitHub 组织或仓库。授权所需权限后即可开始使用。</p>
      </div>
      <div class="card animate-fadeUp">
        <div class="card-icon">${ICONS.gear}</div>
        <h3>第二步：添加配置（可选）</h3>
        <p>在目标仓库根目录创建 <code>.github/neko-app.yml</code>，按需定制行为。<strong>不创建则全部功能默认开启</strong>，零学习成本。</p>
      </div>
      <div class="card animate-fadeUp">
        <div class="card-icon">${ICONS.check}</div>
        <h3>第三步：验证效果</h3>
        <p>新建一个标题含 "bug" 的 Issue —— 应自动被打上 <code>bug</code> 标签并收到欢迎评论。搞定！</p>
      </div>
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">功能一览</h2>
    <div class="grid">
      <div class="card"><div class="card-icon">${ICONS.tag}</div><h3>自动打标签</h3><p>正则匹配标题/正文，自动打 bug / feature / documentation 等标签</p></div>
      <div class="card"><div class="card-icon">${ICONS.chat}</div><h3>自动回复</h3><p>新 Issue/PR 自动发送欢迎语，智能跳过机器人</p></div>
      <div class="card"><div class="card-icon">${ICONS.clock}</div><h3>陈旧清理</h3><p>标记长期无活动的 Issue，有人回复自动复活</p></div>
      <div class="card"><div class="card-icon">${ICONS.bell}</div><h3>Release 通知</h3><p>新版本发布时推送到企业微信/飞书/钉钉/Webhook</p></div>
      <div class="card"><div class="card-icon">${ICONS.check}</div><h3>PR 体检</h3><p>自动提示草稿/目标分支/改动量等问题</p></div>
      <div class="card"><div class="card-icon">${ICONS.forward}</div><h3>Webhook 中转</h3><p>事件原样转发到外部系统，可选签名校验</p></div>
    </div>
  </section>

  <section class="section" style="text-align:center">
    <p style="color:var(--muted);font-size:1rem;margin-bottom:18px">准备好深入了解了？查看完整文档：</p>
    <a class="btn btn-primary" href="/docs/start">${ICONS.doc}<span>阅读完整文档</span></a>
  </section>
</main>
${footer()}
<script>${THEME_JS}</script>
<script>${INSTALL_JS}</script>
</body></html>`;
}

/* ══════════════════════════════════════
   文档内容页（GET /docs/start）
   左侧导航（可点击跳转）+ 中间内容区
   删除右侧 TOC，删除发布指南和权限事件章节
   只保留用户需要的内容 + FAQ + Marketplace 填写指南
   ══════════════════════════════════════ */
export function docsStartPage(): string {

  /* 左侧导航（可点击跳转到对应章节） */
  const sidebar = `
<aside class="doc-sidebar">
  <div class="sidebar-group">
    <div class="sidebar-label">简介</div>
    <a href="#intro" class="sidebar-link active">这是什么</a>
    <a href="#links" class="sidebar-link">重要链接</a>
    <a href="#quickstart" class="sidebar-link">快速开始</a>
  </div>
  <div class="sidebar-group">
    <div class="sidebar-label">配置</div>
    <a href="#config" class="sidebar-link">配置文件</a>
    <a href="#features" class="sidebar-link">功能详解</a>
  </div>
  <div class="sidebar-group">
    <div class="sidebar-label">集成</div>
    <a href="#notify" class="sidebar-link">通知格式</a>
    <a href="#forward" class="sidebar-link">中转格式</a>
  </div>
  <div class="sidebar-group">
    <div class="sidebar-label">参考</div>
    <a href="#marketplace" class="sidebar-link">Marketplace 发布</a>
    <a href="#faq" class="sidebar-link">常见问题</a>
  </div>
</aside>`;

  /* 主内容区 —— 删除了「权限与事件」章节，保留了 Marketplace 发布指南和 FAQ */
  const content = `
<article class="doc-content">
<h1>使用文档</h1>
<p class="doc-sub">从安装到配置到集成，一站式指南喵~</p>

<!-- 简介 -->
<h2 id="intro">简介</h2>
<p><strong>Neko GitHub App</strong> 是一个运行在 Cloudflare Worker 上的 GitHub 应用。安装到你的组织或仓库后，它会接收 GitHub 推送的 Issue、PR、Release 等事件，并按你的配置执行自动化动作。</p>
<pre><code>GitHub 事件 (Webhook)
   │
   ▼ HTTPS POST
Cloudflare Worker (Hono + Octokit)
   ├── 校验 HMAC 签名
   ├── 读取 .github/neko-app.yml
   ├── 路由到对应功能模块
   │   ├── autoLabel       自动打标签
   │   ├── autoReply       自动欢迎回复
   │   ├── stale           陈旧 Issue 清理
   │   ├── releaseNotify   Release 推送通知
   │   ├── prChecks        PR 检查提示
   │   └── forward         Webhook 中转
   └── 返回响应</code></pre>
<div class="note"><strong>全程免费</strong> —— 运行于 Cloudflare Workers 免费额度内，无需自备服务器。每个仓库的行为由该仓库内的配置文件独立控制，互不影响。</div>

<!-- 重要链接 -->
<h2 id="links">重要链接</h2>
<div class="link-card">${ICONS.link}<div><div class="lc-t">官网</div><div class="lc-d"><a href="https://app.nekoaidev.top/" target="_blank" rel="noopener">https://app.nekoaidev.top/</a></div></div></div>
<div class="link-card">${ICONS.doc}<div><div class="lc-t">本文档</div><div class="lc-d"><a href="https://app.nekoaidev.top/docs/start" target="_blank" rel="noopener">https://app.nekoaidev.top/docs/start</a></div></div></div>
<div class="link-card">${ICONS.download}<div><div class="lc-t">安装地址</div><div class="lc-d"><a data-install href="#" onclick="event.preventDefault();window.open('https://github.com/apps/neko-github-app/installations/new','_blank')">点击一键跳转到 GitHub 安装页面</a></div></div></div>
<div class="link-card">${ICONS.check}<div><div class="lc-t">健康检查</div><div class="lc-d"><a href="https://app.nekoaidev.top/health" target="_blank" rel="noopener">https://app.nekoaidev.top/health</a> &nbsp;返回 <code>{"ok":true}</code></div></div></div>

<!-- 快速开始 -->
<h2 id="quickstart">快速开始</h2>
<ol>
  <li><strong>安装 App</strong>：点击上方「安装地址」的一键跳转链接，或访问 <code>https://github.com/apps/neko-github-app/installations/new</code>，将 Neko GitHub App 安装到你的组织或仓库。</li>
  <li><strong>添加配置</strong>（可选）：在目标仓库根目录创建 <code>.github/neko-app.yml</code>，按需定制行为。不创建则全部功能默认开启。</li>
  <li><strong>测试验证</strong>：新建一个标题含 "bug" 的 Issue —— 应自动被打上 <code>bug</code> 标签并收到欢迎评论。</li>
  <li><strong>定制通知</strong>（可选）：在配置文件的 <code>releaseNotify.channels</code> 中填入你的 Webhook 地址，即可接收 Release 发布通知。</li>
</ol>

<!-- 配置文件 -->
<h2 id="config">配置文件</h2>
<p>在每个仓库根目录创建 <code>.github/neko-app.yml</code> 即可覆盖默认行为。<strong>不写任何配置（或文件不存在）时，全部功能使用内置默认值且处于开启状态。</strong></p>
<table>
  <thead><tr><th>字段</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td><code>enabled</code></td><td>bool</td><td><code>true</code></td><td>总开关。设为 <code>false</code> 则该仓库跳过所有处理。</td></tr>
    <tr><td><code>autoLabel.enabled</code></td><td>bool</td><td><code>true</code></td><td>自动打标签开关。</td></tr>
    <tr><td><code>autoLabel.rules</code></td><td>list</td><td>内置 5 条</td><td>匹配规则列表；写了则<b>完全替换</b>内置规则。每项含 <code>label</code> / <code>match</code>（正则）/ <code>field</code>（title|body|both）。</td></tr>
    <tr><td><code>autoReply.enabled</code></td><td>bool</td><td><code>true</code></td><td>自动回复开关。</td></tr>
    <tr><td><code>autoReply.template</code></td><td>string</td><td>默认欢迎语</td><td>自动回复的正文内容，支持多行文本。</td></tr>
    <tr><td><code>stale.enabled</code></td><td>bool</td><td><code>true</code></td><td>陈旧清理开关。</td></tr>
    <tr><td><code>stale.days</code></td><td>int</td><td><code>30</code></td><td>超过多少天无活动视为陈旧。</td></tr>
    <tr><td><code>stale.label</code></td><td>string</td><td><code>stale</code></td><td>打上的标签名称。</td></tr>
    <tr><td><code>stale.message</code></td><td>string</td><td>默认提示语</td><td>打标签时附加的评论内容。</td></tr>
    <tr><td><code>releaseNotify.enabled</code></td><td>bool</td><td><code>true</code></td><td>Release 通知开关。</td></tr>
    <tr><td><code>releaseNotify.channels</code></td><td>list</td><td><code>[]</code></td><td>通知通道列表，每项 <code>{ name, url }</code>；目标需能接收 JSON POST。</td></tr>
    <tr><td><code>prChecks.enabled</code></td><td>bool</td><td><code>true</code></td><td>PR 检查开关。</td></tr>
    <tr><td><code>forward</code></td><td>object|null</td><td><code>null</code></td><td>Webhook 中转配置；为 <code>null</code> 则不转发。包含 <code>url</code> / <code>secret</code>（可选签名）/ <code>events</code>（可选白名单）。</td></tr>
  </tbody>
</table>
<p>完整示例：</p>
<pre><code>enabled: true

autoLabel:
  enabled: true
  rules:
    - label: "bug"
      match: "bug|错误|崩溃|crash|exception"
      field: both
    - label: "enhancement"
      match: "feature|建议|功能|需求|enhancement"
      field: both

autoReply:
  enabled: true
  template: |
    感谢你的提交喵~ 我们已经收到，会尽快处理。

stale:
  enabled: true
  days: 30
  label: stale
  message: "此 Issue 已 30 天无活动，被标记为 stale。若有进展请评论，我们会移除标签。"

releaseNotify:
  enabled: true
  channels:
    - name: "feishu-bot"
      url: "https://open.feishu.cn/open-apis/bot/v2/hook/xxx"

prChecks:
  enabled: true

forward:
  url: "https://your-collector.example.com/github"
  secret: "your-signing-secret"</code></pre>

<!-- 功能详解 -->
<h2 id="features">功能详解</h2>

<h3>自动打标签（autoLabel）</h3>
<ul>
  <li><strong>触发时机</strong>：<code>issues</code> / <code>pull_request</code> 的 <code>opened</code>、<code>edited</code>、<code>reopened</code>、<code>synchronize</code> 事件。</li>
  <li>按 <code>title</code> / <code>body</code> / <code>both</code> 字段做正则匹配（大小写不敏感），命中的标签批量添加，已存在的不会重复添加。</li>
  <li>未配置 <code>rules</code> 时使用内置默认规则：
    <table style="margin-top:8px">
      <thead><tr><th>标签</th><th>匹配关键词</th></tr></thead>
      <tbody>
        <tr><td><code>bug</code></td><td>bug / 错误 / 崩溃 / crash / exception / 异常</td></tr>
        <tr><td><code>enhancement</code></td><td>feature / 建议 / 功能 / 增强 / enhancement / 需求</td></tr>
        <tr><td><code>documentation</code></td><td>doc / 文档 / readme</td></tr>
        <tr><td><code>question</code></td><td>question / 疑问 / 提问 / 怎么 / 如何 / 为什么</td></tr>
        <tr><td><code>good first issue</code></td><td>good first / 新手 / 入门 / easy</td></tr>
      </tbody>
    </table>
  </li>
</ul>

<h3>自动回复（autoReply）</h3>
<ul>
  <li><strong>触发时机</strong>：<code>issues</code> / <code>pull_request</code> 的 <code>opened</code> 动作。</li>
  <li>若创建者是机器人账号（如 Dependabot、renovate 等），<strong>自动跳过不回复</strong>。</li>
  <li>回复内容取自 <code>autoReply.template</code>，支持多行文本。</li>
</ul>

<h3>陈旧清理（stale）</h3>
<ul>
  <li><strong>实时部分</strong>（无需额外操作即可生效）：有人在 Issue 下评论（非机器人）→ 自动移除 <code>stale</code> 标签（复活）；Issue 被关闭或重开 → 自动移除 <code>stale</code> 标签。</li>
  <li><strong>批量扫描部分</strong>：需要手动触发或挂外部定时器：
    <pre><code>curl -X POST https://app.nekoaidev.top/tasks/stale \\
  -H "x-neko-task-key: &lt;你的 WEBHOOK_SECRET&gt;"</code></pre>
    触发后会遍历 App 所有安装下的仓库，把超过 <code>stale.days</code> 天无活动的开放 Issue 打上标签并评论。可挂到免费定时器（如 cron-job.org）实现每日自动扫描。
  </li>
</ul>

<h3>Release 通知（releaseNotify）</h3>
<ul>
  <li><strong>触发时机</strong>：<code>release</code> 事件且 <code>action === "published"</code>。</li>
  <li>向 <code>channels</code> 中每个 URL 发送 JSON POST（格式见下方「通知格式」）。单个通道失败不影响其他通道。</li>
</ul>

<h3>PR 检查（prChecks）</h3>
<ul>
  <li><strong>触发时机</strong>：<code>pull_request</code> 的 <code>opened</code>、<code>reopened</code>、<code>synchronize</code>。</li>
  <li>命中以下任意条件则在 PR 下发表评论提示：
    <ul>
      <li>PR 处于 Draft（草稿）状态</li>
      <li>目标分支不是仓库的默认分支</li>
      <li>改动总量（增 + 删）超过 1000 行</li>
    </ul>
  </li>
</ul>

<h3>Webhook 中转（forward）</h3>
<ul>
  <li>对所有收到的事件生效。<code>forward.url</code> 为空时不转发。</li>
  <li>若配置了 <code>forward.events</code> 白名单，只转发列表内的事件类型。</li>
  <li>若配置了 <code>forward.secret</code>，请求头附带 <code>x-neko-signature</code> 以便接收方校验来源。</li>
</ul>

<!-- 通知格式 -->
<h2 id="notify">通知通道接收格式</h2>
<p>当有新 Release 发布时，<code>releaseNotify.channels</code> 里的每个 URL 会收到如下 JSON POST：</p>
<pre><code>{
  "title": "owner/name v1.2.3 发布",
  "body": "本次更新内容……",
  "repo": "owner/name",
  "url": "https://github.com/owner/name/releases/tag/v1.2.3",
  "channel": "feishu-bot"
}</code></pre>
<p>请求头：<code>content-type: application/json</code>。可指向企业微信机器人、飞书群机器人、钉钉机器人或自建 Worker 服务。</p>

<!-- 中转格式 -->
<h2 id="forward">Webhook 中转接收格式</h2>
<p>配置了 <code>forward.url</code> 后，目标地址收到的数据：</p>
<pre><code>{
  "event": "issues",
  "payload": { ... 原始 GitHub Webhook payload ... }
}</code></pre>
<p>请求头：</p>
<ul>
  <li><code>content-type: application/json</code></li>
  <li><code>x-github-delivery</code>：GitHub 事件唯一 ID</li>
  <li><code>x-github-event</code>：事件名称（如 <code>issues</code>）</li>
  <li>若配置了 <code>forward.secret</code>，额外携带 <code>x-neko-signature</code> 头用于校验来源</li>
</ul>

<!-- Marketplace 发布指南 —— 截图三个红框必填项，必须写清楚 -->
<h2 id="marketplace">GitHub Marketplace 发布指南</h2>
<p>要将 App 发布到 GitHub Marketplace 并公开上架，需要在 App 设置页面完成以下三项必填内容（截图红框标注的部分）。以下是每项的<strong>可直接复制粘贴</strong>的填写模板：</p>

<h3>1. 制定计划（Plan）⚠️ 必填</h3>
<p>这一项要求你描述 App 的定价计划。由于本 App 完全免费，直接复制以下内容粘贴进去：</p>
<pre><code># 计划名称
Free

# 定价
$0 / 月（永久免费）

# 描述
Neko GitHub App 是一款完全免费的 GitHub 自动化工具。
它运行于 Cloudflare Workers 免费额度内，用户无需支付任何费用。
所有功能（自动标签、欢迎回复、陈旧清理、Release 通知、PR 检查、Webhook 中转）
均包含在 Free 计划中，无任何限制或付费墙。

# 试用
无需试用期。安装即用，全部功能立即可用。

# 付款方式
无需绑定付款方式。Free 计划不产生任何费用。</code></pre>
<div class="note"><strong>关键点</strong>：选 Free 计划类型，描述里明确说明免费原因（Cloudflare Workers 免费额度），不需要填写付款信息或试用期。</div>

<h3>2. 安全和隐私信息（Security & Privacy）⚠️ 必填</h3>
<p>这一项要求说明 App 如何处理用户数据和安全性。以下模板可直接复制粘贴：</p>
<pre><code>## 数据收集声明
Neko GitHub App 不主动收集、存储或传输任何用户个人数据（PII）。
App 仅处理 GitHub 仓库元数据（Issue 标题、正文、标签名、PR 信息、Release 摘要），
这些数据属于仓库层面的技术信息，不涉及用户个人身份信息。

## 数据处理方式
- App 通过 GitHub Webhook 接收事件 payload（Issue/PR/Release 元数据的 JSON）
- 所有处理逻辑在 Cloudflare Worker 内存中完成，不落盘持久化用户数据
- 不访问、不存储用户姓名、邮箱、IP 地址、地理位置等个人信息
- 用户配置文件（.github/neko-app.yml）存储在用户自己的 GitHub 仓库中，
  App 仅在每次事件触发时读取，不做持久化缓存

## 第三方服务依赖
- Cloudflare Workers（计算平台）：用于运行 App 代码，处理 Webhook 请求
- GitHub API（通过 Octokit SDK）：用于读写 Issues/PR/Labels/Comments
- 用户自行配置的通知通道 URL（可选）：仅转发 Release 摘要 JSON，
  目标服务由用户自行选择和管理

## 安全措施
- Webhook 请求验证：通过 @octokit/webhooks-methods 库验证每个请求的
  X-Hub-Signature-256 头（HMAC-SHA256），确保请求确实来自 GitHub
- 密钥存储：App 私钥（PRIVATE_KEY）和 Webhook Secret（WEBHOOK_SECRET）
  通过 Cloudflare Workers Secrets 加密存储，不以明文出现在代码或日志中
- 最小权限原则：仅请求 Issues/Pull Requests 读写权限、
  Contents/Metadata/Releases 只读权限，不多求任何额外权限
- 无 Cookie / 无 Session / 无追踪：App 不使用 Cookie、不建立用户会话、
  不嵌入任何第三方分析代码或追踪脚本
- 无数据外传：除了用户显式配置的通知通道 URL 外，
  App 不会将任何数据发送到第三方服务器

## 合规声明
- App 不处理 GDPR（通用数据保护条例）适用范围内的个人数据，
  因为仅操作 GitHub 仓库的技术元数据（Issue 标题/正文/标签/PR 差异/Release 版本号），
  这些不属于 PII（个人身份信息）
- App 不处理 CCPA（加州消费者隐私法）定义的个人信息
- 用户可通过卸载 App 或设置 enabled: false 立即停止数据处理
- 如有数据安全问题反馈，请通过 GitHub App 页面联系维护者</code></pre>
<div class="note"><strong>重点</strong>：审核最看重的是「是否收集个人数据」「密钥如何存储」「是否验证 Webhook 签名」「第三方服务有哪些」。以上模板已覆盖所有审核要点。</div>

<h3>3. 建立 webhook（Setup webhook）⚠️ 必填</h3>
<p>这一项要求说明 App 的 Webhook 端点已正确配置并能正常接收事件。直接复制：</p>
<pre><code># Webhook URL（公网可达地址）
https://app.nekoaidev.top/

# Content Type
application/json

# Secret
已在部署时通过 wrangler secret put WEBHOOK_SECRET 注入 Cloudflare Workers Secrets。
请在下方填写你在 GitHub App 设置 → General → Webhook secret 中生成的那个 secret 值。
（就是那一串以 == 结尾的 base64 字符串）

# SSL/TLS
是。Cloudflare 自动提供有效的 TLS 证书（Let's Encrypt 或 DigiCert）。
App 强制使用 HTTPS，不支持明文 HTTP。

# 验证方式
App 使用 @octokit/webhooks-methods 库（GitHub 官方维护）验证每个入站请求：
- 读取请求头 X-Hub-Signature-256
- 用 WEBHOOK_SECRET 对原始请求体做 HMAC-SHA256 计算
- 对比签名是否一致
- 签名不匹配的请求直接返回 401，不做任何处理

# 测试方法（证明 webhook 正常工作）
方法 A —— 在线测试：
1. 登录 GitHub → 进入你的 App 设置页面
2. 找到 "Recent deliveries" 区域
3. 点击最近一条投递记录查看详情
4. 确认状态码为 200 或 201
5. 可点击 "Redeliver" 按钮重发测试

方法 B —— 实际操作测试：
1. 将 App 安装到一个测试仓库
2. 在该仓库新建一个 Issue（标题随便写）
3. 观察 Issue 是否自动被打了标签 + 收到了欢迎评论
4. 如果都有 → webhook 工作正常 ✓

方法 C —— 健康检查端点：
1. 浏览器打开 https://app.nekoaidev.top/health
2. 应看到 {"ok":true,"ts":...} 的 JSON 响应
3. 说明 Worker 在线且正常运行</code></pre>
<div class="note"><strong>注意</strong>：「建立 webhook」实际上是在确认你的 Worker 能正常接收 GitHub 推送的事件。只要你的 Worker 已部署（<code>wrangler deploy</code> 成功）、App 已安装到某个仓库、且 Recent deliveries 里能看到 2xx 状态码，这一项就算满足。把上面内容粘贴进去即可。</div>

<h3>发布前最终检查清单</h3>
<p>三项必填都完成后，还需要确认以下几点才能提交审核：</p>
<ul>
  <li><strong>App 图标</strong>：上传一张 512x512 的 PNG 图标（建议用网站 logo 的变体，保持视觉一致）。</li>
  <li><strong>简短描述</strong>（Summary，不超过 125 字符）：<br/><code>Automated issue labeling, welcome replies, stale cleanup, release notifications, PR checks, and webhook forwarding for GitHub repositories.</code></li>
  <li><strong>详细描述</strong>（Description）：可复制官网 Hero 区域的文字。</li>
  <li><strong>开源文件</strong>：勾选此项，填写仓库地址（仓库创建后补上 URL 即可）。</li>
  <li><strong>隐私政策 URL</strong>：<code>https://app.nekoaidev.top/privacy</code>（本页已部署，可直接填）。</li>
  <li><strong>服务条款 URL</strong>：<code>https://app.nekoaidev.top/terms</code>（本页已部署，可直接填）。</li>
  <li><strong>勾选开发者政策确认</strong>：确认 App 符合 GitHub Marketplace 政策。</li>
</ul>
<p>全部完成后点击底部的<strong>「Draft / Submit for review」</strong>（草稿/提交审核）。GitHub 团队通常在 <strong>2-4 个工作日</strong>内完成审核。审核通过后 App 即在 GitHub Marketplace 公开展示。</p>
<div class="note">如果审核被拒（常见原因：安全隐私信息不够详细），参照上方「安全和隐私信息」模板补充后重新提交即可。大部分被拒案例都是因为这一项写得不够具体。</div>

<!-- FAQ -->
<h2 id="faq">常见问题</h2>
<ul>
  <li><strong>安装后没有反应？</strong> 确认已在目标仓库或组织上完成授权安装。在仓库新建一个标题含 "bug" 的 Issue 测试 —— 应自动被打上 <code>bug</code> 标签并收到欢迎评论。</li>
  <li><strong>想关闭某个功能？</strong> 在仓库的 <code>.github/neko-app.yml</code> 里把对应功能的 <code>enabled</code> 设为 <code>false</code> 即可。设顶层 <code>enabled: false</code> 可一次性关闭整个 App 对该仓库的处理。</li>
  <li><strong>标签没按预期打上？</strong> 检查 <code>autoLabel.rules</code> 里的 <code>field</code> 是否正确（<code>title</code> 只匹配标题、<code>body</code> 只匹配正文、<code>both</code> 都匹配）；确认正则包含了你的关键词。已存在的标签不会重复添加。</li>
  <li><strong>Release 通知没收到？</strong> 检查 <code>releaseNotify.channels</code> 里的 URL 是否公网可达、是否能接受 JSON POST。可在 App 设置的 Recent deliveries 里找到最近的 release 事件点击 Redeliver 重发测试。</li>
  <li><strong>stale 标签没有出现？</strong> 批量扫描需要手动触发（见上方 stale 章节的 curl 命令）。评论/关闭时的自动复活是实时的，不需要额外操作。确认 <code>stale.enabled: true</code> 且 <code>stale.days</code> 符合预期。</li>
  <li><strong>Webhook 中转收不到数据？</strong> 确认 <code>forward.url</code> 正确且公网可达；检查 <code>forward.events</code> 白名单是否包含你要转发的事件类型（不设置则转发全部事件）。</li>
  <li><strong>配置修改后多久生效？</strong> 配置文件随每次事件实时读取，修改后下一次触发对应功能时立即生效，无需重启或重新安装。</li>
  <li><strong>Marketplace 审核被拒怎么办？</strong> 最常见原因是安全隐私信息写得不够详细。确保说明了：数据如何处理、是否加密存储密钥、是否验证 Webhook 签名、第三方服务有哪些。参照上方「安全和隐私信息」模板补充后重新提交。</li>
  <li><strong>免费额度够用吗？</strong> Cloudflare Workers 免费额度每天 10 万次请求，对绝大多数仓库绰绰有余。即使你的组织有几十个仓库、每天几百个事件，也不会超出免费额度。</li>
</ul>
</article>`;

  return `${head("Neko GitHub App · 使用文档")}
<body>
${nav('start')}
<main class="wrap">
  <!-- 两栏布局：左导航 | 内容（无右侧 TOC）-->
  <div class="doc-layout">
    ${sidebar}
    ${content}
  </div>
</main>
${footer()}
<script>${THEME_JS}</script>
<script>${SIDEBAR_JS}</script>
<script>${INSTALL_JS}</script>
</body></html>`;
}

/* ══════════════════════════════════════
   隐私政策（英文，符合 GitHub Marketplace 要求）
   GET /privacy
   ══════════════════════════════════════ */
export function privacyPage(): string {
  return `${head("Privacy Policy · Neko GitHub App")}
<body>
${nav('privacy')}
<main class="wrap">
<article class="doc-content" style="max-width:820px;margin:48px auto">
<h1>Privacy Policy</h1>
<p class="doc-sub">Last updated: August 16, 2026</p>

<h2 id="overview">1. Overview</h2>
<p>Neko GitHub App (the "App", "we", "us") is a free, open-source GitHub application that automates routine repository tasks such as issue labeling, welcome replies, stale issue management, release notifications, pull request checks, and webhook forwarding. The App runs entirely on Cloudflare Workers and processes data only when you install it on a repository.</p>

<h2 id="data">2. Information We Process</h2>
<p>The App does <strong>not</strong> collect, store, or transmit any personally identifiable information (PII) about you or your users.</p>
<p>The only data the App touches is <strong>repository technical metadata</strong> delivered by GitHub through webhooks:</p>
<ul>
  <li>Issue and pull request titles, bodies, labels, comments, and statuses;</li>
  <li>Release metadata (version, name, notes, author);</li>
  <li>Repository name and the per-repository configuration file <code>.github/neko-app.yml</code>.</li>
</ul>
<p>This data belongs to the repository and is technical in nature; it is not personal data.</p>

<h2 id="processing">3. How We Process Data</h2>
<ul>
  <li>GitHub delivers event payloads to our endpoint over HTTPS (webhooks).</li>
  <li>All processing happens <strong>in-memory</strong> inside the Cloudflare Worker. We do not persist, log, or store any payload data. Data is discarded immediately after the response is generated.</li>
  <li>The App reads the per-repository config file <code>.github/neko-app.yml</code> on each event. It is never cached or stored by us.</li>
</ul>

<h2 id="sharing">4. Data Sharing and Sub-processors</h2>
<ul>
  <li>We do <strong>not</strong> sell, rent, or share any data with third parties.</li>
  <li>The App only sends data when <strong>you explicitly configure it</strong>:
    <ul>
      <li><code>releaseNotify.channels</code> — Release summaries are POSTed as JSON to URLs <em>you</em> provide (for example your own chat-bot webhook).</li>
      <li><code>forward.url</code> — GitHub event payloads are forwarded to a URL <em>you</em> specify.</li>
    </ul>
  </li>
  <li>Sub-processors we rely on:
    <ul>
      <li><strong>Cloudflare Workers</strong> — executes the App code and terminates TLS.</li>
      <li><strong>GitHub API</strong> (via the Octokit SDK) — reads and writes issues, pull requests, labels, and comments on your behalf, using only the permissions you granted.</li>
    </ul>
  </li>
</ul>

<h2 id="security">5. Security</h2>
<ul>
  <li>Every inbound webhook is verified using HMAC-SHA256 against the <code>X-Hub-Signature-256</code> header. Requests with invalid signatures are rejected with HTTP 401.</li>
  <li>Secrets (the App private key and the webhook secret) are stored encrypted via Cloudflare Workers Secrets and never appear in source code or logs.</li>
  <li>The App requests only the minimum GitHub permissions required (Issues and Pull Requests read &amp; write; Metadata, Contents, and Releases read).</li>
  <li>The App uses no cookies, no user sessions, and embeds no third-party analytics or tracking scripts.</li>
</ul>

<h2 id="retention">6. Data Retention</h2>
<p>We retain no user or repository data. Because processing is in-memory and ephemeral, no data persists after a request completes.</p>

<h2 id="rights">7. Your Rights and Choices</h2>
<ul>
  <li>You can stop all processing at any time by uninstalling the App or by setting <code>enabled: false</code> in <code>.github/neko-app.yml</code>.</li>
  <li>Because we do not store personal data, there is no personal data for us to access, correct, or delete.</li>
</ul>

<h2 id="compliance">8. Compliance</h2>
<p>The App does not process personal data as defined under the GDPR or the CCPA, because it operates only on repository technical metadata. If you believe any personal data is involved, contact us and we will address it promptly.</p>

<h2 id="contact">9. Contact</h2>
<p>For privacy questions, reach us through the GitHub App page or the project repository issues.</p>
</article>
</main>
${footer()}
<script>${THEME_JS}</script>
</body></html>`;
}

/* ══════════════════════════════════════
   服务条款（英文，符合 GitHub Marketplace 要求）
   GET /terms
   ══════════════════════════════════════ */
export function termsPage(): string {
  return `${head("Terms of Service · Neko GitHub App")}
<body>
${nav('terms')}
<main class="wrap">
<article class="doc-content" style="max-width:820px;margin:48px auto">
<h1>Terms of Service</h1>
<p class="doc-sub">Last updated: August 16, 2026</p>

<h2 id="acceptance">1. Acceptance of Terms</h2>
<p>By installing or using Neko GitHub App (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not install or use the Service.</p>

<h2 id="description">2. Description of Service</h2>
<p>The Service is a free GitHub application that performs automation on the repositories where it is installed, including auto-labeling, welcome replies, stale issue management, release notifications, pull request checks, and webhook forwarding. The Service runs on Cloudflare Workers and is provided without charge.</p>

<h2 id="license">3. Use License</h2>
<p>The Service is provided free of charge. Your use of the Service must comply with the GitHub Terms of Service and GitHub Acceptable Use Policies. You are responsible for the content of the repositories where the Service is installed.</p>

<h2 id="acceptable">4. Acceptable Use</h2>
<p>You agree not to:</p>
<ul>
  <li>Use the Service for any unlawful purpose;</li>
  <li>Attempt to abuse, overload, reverse-engineer, or attack the Service, Cloudflare, or GitHub;</li>
  <li>Use the Service to send spam, malware, or malicious content through any configured webhook or notification channel;</li>
  <li>Impersonate any person or entity, or misrepresent your affiliation.</li>
</ul>

<h2 id="warranty">5. No Warranty</h2>
<p>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, whether express or implied. We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.</p>

<h2 id="liability">6. Limitation of Liability</h2>
<p>To the maximum extent permitted by law, in no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, arising out of or in connection with your use of the Service.</p>

<h2 id="changes">7. Changes to the Service or Terms</h2>
<p>We may modify the Service or these Terms at any time. Material changes will be reflected by the "Last updated" date above. Your continued use of the Service after changes constitutes acceptance of the new Terms.</p>

<h2 id="termination">8. Termination</h2>
<p>You may stop using the Service at any time by uninstalling the App from your repositories. We may suspend or discontinue the Service for any reason, including violation of these Terms.</p>

<h2 id="law">9. Governing Law</h2>
<p>These Terms are governed by the laws of the jurisdiction in which the operator is established, without regard to its conflict-of-law principles.</p>

<h2 id="contact">10. Contact</h2>
<p>Questions about these Terms can be directed to us through the GitHub App page or the project repository issues.</p>
</article>
</main>
${footer()}
<script>${THEME_JS}</script>
</body></html>`;
}
