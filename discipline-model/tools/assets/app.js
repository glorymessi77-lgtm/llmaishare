// 共用交互与通用渲染
(function(){
  const NAV = [
    { title:"总览", items:[
      { code:"", name:"工具层", page:"dashboard", path:"dashboard.html" },
      { code:"", name:"运行看板", page:"runtime", path:"runtime.html" },
    ]},
    { title:"数据获取", items:[
      { code:"T01", name:"文档解析", page:"t01", path:"t01-doc-parser.html" },
      { code:"T08", name:"多模态采集", page:"t08", path:"t08-multimodal-ingest.html" },
    ]},
    { title:"知识构建", items:[
      { code:"T02", name:"术语工作台", page:"t02", path:"t02-term-workbench.html" },
      { code:"T03", name:"图谱标注", page:"t03", path:"t03-graph-annotator.html" },
      { code:"T04", name:"问答构建", page:"t04", path:"t04-qa-builder.html" },
    ]},
    { title:"内容管理", items:[
      { code:"T05", name:"知识库管理", page:"t05", path:"t05-kb-admin.html" },
      { code:"T09", name:"笔记协作", page:"t09", path:"t09-note-doc.html" },
    ]},
    { title:"质量优化", items:[
      { code:"T06", name:"质量评测", page:"t06", path:"t06-quality-eval.html" },
    ]},
    { title:"生态与应用", items:[
      { code:"T07", name:"协同创作", page:"t07", path:"t07-coauthor.html" },
      { code:"T10", name:"Agent 平台", page:"t10", path:"t10-agent-platform.html" },
    ]},
  ];

  function renderSidebar() {
    const active = document.body.dataset.page || "";
    const el = document.querySelector("#sidebar-mount");
    if (!el) return;
    const groups = NAV.map(g=>`
      <div class="nav-group">
        <div class="nav-group-title">${g.title}</div>
        ${g.items.map(it=>`
          <a class="nav-item ${it.page===active?"active":""}" href="${it.path}">
            <span class="code">${it.code}</span>
            <span>${it.name}</span>
          </a>`).join("")}
      </div>`).join("");
    el.innerHTML = `
      <div class="sidebar-logo">
        <span class="brand-icon"><i data-lucide="brain-circuit"></i></span>
        <span>学科大脑</span>
      </div>
      <div class="sidebar-nav">${groups}</div>
      <div class="sidebar-user">
        <div class="avatar">A</div>
        <div>
          <div class="name">Aeson</div>
          <div class="role">产品负责人</div>
        </div>
      </div>`;
  }

  // 抽屉
  function initDrawer() {
    const mask = document.querySelector("#drawer-mask");
    const drawer = document.querySelector("#drawer");
    if (!mask || !drawer) return;
    const close = () => { mask.classList.remove("open"); drawer.classList.remove("open"); };
    mask.addEventListener("click", close);
    const btn = drawer.querySelector(".close");
    if (btn) btn.addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    window.__openDrawer = (html, title) => {
      drawer.querySelector(".title").textContent = title || "详情";
      drawer.querySelector(".drawer-body").innerHTML = html;
      mask.classList.add("open"); drawer.classList.add("open");
      if (window.lucide) lucide.createIcons();
    };
  }

  // 表格排序（纯 DOM）
  window.initTableSort = function(tableSel) {
    const table = document.querySelector(tableSel);
    if (!table) return;
    table.querySelectorAll("thead th").forEach((th, col) => {
      if (th.dataset.nosort) return;
      th.innerHTML = th.innerHTML + ' <span class="sort-arrow">↕</span>';
      let asc = true;
      th.addEventListener("click", () => {
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        rows.sort((a,b)=>{
          const av = a.children[col].innerText.trim();
          const bv = b.children[col].innerText.trim();
          const an = parseFloat(av.replace(/[,%]/g,""));
          const bn = parseFloat(bv.replace(/[,%]/g,""));
          if (!isNaN(an) && !isNaN(bn)) return asc? an-bn : bn-an;
          return asc? av.localeCompare(bv,"zh") : bv.localeCompare(av,"zh");
        });
        const tbody = table.querySelector("tbody");
        rows.forEach(r=>tbody.appendChild(r));
        asc = !asc;
        th.querySelector(".sort-arrow").textContent = asc ? "↑" : "↓";
      });
    });
  };

  // Tab
  window.initTabs = function(container) {
    const c = document.querySelector(container);
    if (!c) return;
    const tabs = c.querySelectorAll(".tab");
    tabs.forEach(t=>t.addEventListener("click",()=>{
      tabs.forEach(x=>x.classList.remove("active"));
      t.classList.add("active");
      const name = t.dataset.tab;
      c.querySelectorAll(".tab-pane").forEach(p=>p.classList.toggle("active", p.dataset.tab===name));
    }));
  };

  // 辅助：delta 渲染
  window.renderDelta = function(d) {
    if (d === 0 || d === undefined) return `<span class="delta flat">—</span>`;
    const cls = d > 0 ? "up" : "down";
    const sign = d > 0 ? "↑" : "↓";
    return `<span class="delta ${cls}">${sign} ${Math.abs(d)}%</span>`;
  };

  // sparkline svg
  window.sparkline = function(nums, color) {
    color = color || "var(--primary)";
    const w = 80, h = 24;
    const max = Math.max(...nums), min = Math.min(...nums);
    const r = Math.max(1, max-min);
    const pts = nums.map((v,i)=>{
      const x = (i/(nums.length-1))*w;
      const y = h - ((v-min)/r)*(h-4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return `<svg class="sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline fill="none" stroke="${color}" stroke-width="1.6" points="${pts}"/></svg>`;
  };

  window.fmtNum = function(n) {
    if (n == null) return "—";
    if (n >= 10000) return (n/10000).toFixed(1) + " 万";
    return n.toLocaleString("zh-CN");
  };

  // 筛选：subject + 搜索
  window.initFilter = function(cfg){
    const { subjectSel, statusSel, searchSel, onChange } = cfg;
    [subjectSel, statusSel, searchSel].forEach(s=>{
      const el = s && document.querySelector(s);
      if (!el) return;
      el.addEventListener("input", onChange);
      el.addEventListener("change", onChange);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderSidebar();
    initDrawer();
    if (window.lucide) lucide.createIcons();
  });
})();
