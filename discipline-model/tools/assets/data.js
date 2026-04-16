// 业务 mock 数据：从 app/src/mock/*.ts 翻译而来
// 确定性种子随机，结果稳定
(function () {
  function mkRand(seed) {
    let s = seed;
    return function () {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }

  const subjects = ["计算机科学","人工智能","数学","物理","经济管理","法学","医学","人文"];
  const reviewers = ["张教授","李老师","王博士","陈主任","赵讲师","孙教授"];
  const uploaders = reviewers;

  // ============ tools ============
  const tools = [
    { code:"T01", path:"t01-doc-parser.html", name:"文档解析工具", tagline:"PDF/PPT/Word 公式表格精准解析，15 种格式支持，OCR 识别",
      capabilities:["PDF 解析","PPT 切片","公式 LaTeX","表格还原","OCR"], coverage:"partial", volume:"15 万",
      tone:"blue", calls:38620, delta:5.1, latency:142, success:98.7, nodes:8, trend7d:[32,28,35,33,38,42,39], stage:"ingest" },
    { code:"T08", path:"t08-multimodal-ingest.html", name:"多模态数据采集", tagline:"图片/音频/视频解析、拍照上传、录音转文字、网页爬虫、微信/浏览器导入",
      capabilities:["视听解析","拍照","录音转写","爬虫","导入"], coverage:"partial", volume:"—",
      tone:"orange", calls:15820, delta:6.9, latency:186, success:97.2, nodes:6, trend7d:[12,14,13,16,18,15,17], stage:"ingest" },
    { code:"T02", path:"t02-term-workbench.html", name:"术语管理工作台", tagline:"术语自动提取、教师审核、同义词改写查询、构建学科术语体系",
      capabilities:["自动提取","审核流","同义词","学科体系"], coverage:"none", volume:"—",
      tone:"purple", calls:12480, delta:14.2, latency:58, success:99.4, nodes:4, trend7d:[8,9,11,10,12,13,14], stage:"extract" },
    { code:"T03", path:"t03-graph-annotator.html", name:"知识图谱标注工具", tagline:"知识点先修关系标注与可视化，KAG 一键图谱转换，图谱问答",
      capabilities:["关系标注","可视化","KAG 转换","图谱问答"], coverage:"full", volume:"15 万",
      tone:"success", calls:52410, delta:8.2, latency:76, success:99.8, nodes:12, trend7d:[38,42,45,48,51,49,53], stage:"extract" },
    { code:"T04", path:"t04-qa-builder.html", name:"问答库构建工具", tagline:"AI 自动生成候选问答、教师审核发布，支持单条/Excel 批量创建",
      capabilities:["AI 生成","批量导入","审核流","FAQ 管理"], coverage:"partial", volume:"—",
      tone:"orange", calls:27820, delta:-1.3, latency:94, success:98.1, nodes:7, trend7d:[29,27,28,25,24,26,23], stage:"extract" },
    { code:"T05", path:"t05-kb-admin.html", name:"知识库管理后台", tagline:"知识库增删改查、版本管理、三级角色权限、校级审批流程",
      capabilities:["增删改查","版本","权限","审批"], coverage:"partial", volume:"15 万",
      tone:"blue", calls:24110, delta:2.4, latency:32, success:99.9, nodes:5, trend7d:[22,23,24,23,25,24,26], stage:"quality" },
    { code:"T06", path:"t06-quality-eval.html", name:"质量评测工具", tagline:"300-500 题标准测试集、A/B 效果对比、答疑质量看板、知识库质检",
      capabilities:["测试集","A/B 对比","质量看板","质检"], coverage:"partial", volume:"—",
      tone:"orange", calls:9640, delta:22.8, latency:168, success:98.5, nodes:3, trend7d:[6,7,8,8,9,9,10], stage:"quality" },
    { code:"T07", path:"t07-coauthor.html", name:"师生共建平台", tagline:"多端上传研读、三级审核流、社区知识共享、贡献度排名、运营看板",
      capabilities:["多端上传","三级审核","社区","排名","运营"], coverage:"none", volume:"18 万",
      tone:"default", calls:6210, delta:-4.5, latency:220, success:96.8, nodes:2, trend7d:[7,6,7,6,5,6,6], stage:"delivery" },
    { code:"T09", path:"t09-note-doc.html", name:"笔记与文档协作", tagline:"个人笔记创建编辑、问答结果保存、白板输入、文档摘要编辑",
      capabilities:["笔记","保存","白板","摘要"], coverage:"partial", volume:"5 万",
      tone:"purple", calls:11340, delta:3.2, latency:62, success:99.1, nodes:4, trend7d:[10,11,10,12,11,12,11], stage:"delivery" },
    { code:"T10", path:"t10-agent-platform.html", name:"智能体与 Agent 平台", tagline:"智能体配置下发、AIGC 生成管理、CLI 工具、Skill API 开放、插件市场",
      capabilities:["配置下发","AIGC","CLI","Skill API","插件市场"], coverage:"partial", volume:"10 万",
      tone:"orange", calls:18540, delta:12.7, latency:88, success:99.3, nodes:9, trend7d:[14,16,15,17,18,19,19], stage:"delivery" },
  ];

  const stageMeta = {
    ingest:   { index:"01", label:"数据接入", desc:"Ingest · 原始资源采集与解析" },
    extract:  { index:"02", label:"萃取标注", desc:"Extract · 结构化与知识化" },
    quality:  { index:"03", label:"评测管理", desc:"Quality · 版本与质量治理" },
    delivery: { index:"04", label:"分发协作", desc:"Deliver · 能力下发与共建" },
  };

  const coverageLabel = {
    full: { text:"已具备", type:"success" },
    partial: { text:"部分具备", type:"warning" },
    none: { text:"未具备", type:"info" },
  };

  // ============ modules ============
  const modules = [
    { index:"01", title:"数据接入与资源管理", desc:"负责原始教学资源的采集、解析与结构化入库", role:"管理员", tools:3, status:"normal", statusText:"正常",
      metrics:[{label:"资源总量",value:"15.2",unit:"万"},{label:"今日接入",value:"54,440"},{label:"支持格式",value:"15",unit:"种"}], toolCodes:["T01","T08","T05"] },
    { index:"02", title:"知识加工与标注", desc:"AI + 教师协同完成术语、图谱、问答的知识化加工", role:"教师 + AI", tools:3, status:"running", statusText:"运行中",
      metrics:[{label:"术语条目",value:"500"},{label:"图谱节点",value:"15.0",unit:"万"},{label:"问答条数",value:"27,820"}], toolCodes:["T02","T03","T04"] },
    { index:"03", title:"质量评测与审核", desc:"测试集驱动的自动评测 + 人工复核与版本治理", role:"管理员 + 教师", tools:1, status:"normal", statusText:"正常",
      metrics:[{label:"测试集题量",value:"420"},{label:"准确率",value:"98.5",unit:"%"},{label:"本周审核",value:"1,286"}], toolCodes:["T06"] },
    { index:"04", title:"教学与科研应用", desc:"面向教师与学生的能力下发、笔记协作与 Agent 编排", role:"教师 + 学生", tools:3, status:"running", statusText:"运行中",
      metrics:[{label:"活跃教师",value:"176"},{label:"Agent 数",value:"9"},{label:"本月调用",value:"36,090"}], toolCodes:["T07","T09","T10"] },
  ];

  const systemStatus = [
    { label:"核心服务", value:"全部正常", tone:"success", detail:"9 / 9 节点在线" },
    { label:"AI 模型层", value:"运行中", tone:"info", detail:"平均延迟 142ms" },
    { label:"数据存储", value:"正常", tone:"success", detail:"使用率 68%" },
    { label:"安全防护", value:"正常", tone:"success", detail:"近 30 日零事件" },
  ];

  // ============ overview (runtime) ============
  const overview = {
    primary: { label:"累计调用总量", value:1982640, unit:"次", span:"过去 30 日", delta:12.4 },
    secondary: [
      { label:"本周调用", value:287350, unit:"次", delta:8.2 },
      { label:"活跃教师", value:176, unit:"人", delta:4.1, total:240 },
      { label:"接入学科", value:12, unit:"门", delta:0, total:18 },
    ],
    monthlyTrend: {
      months:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
      current:[12.4,18.6,24.3,28.7,null,null,null,null,null,null,null,null],
      previous:[6.2,9.8,14.1,17.5,19.2,16.8,10.5,12.2,18.9,22.3,24.6,26.1],
    },
    topTools: [
      { code:"T03", name:"知识图谱标注", count:52400, delta:8.2 },
      { code:"T01", name:"文档解析",    count:38600, delta:5.1 },
      { code:"T04", name:"问答构建",    count:27800, delta:-1.3 },
      { code:"T05", name:"知识库管理",  count:24100, delta:2.4 },
      { code:"T10", name:"Agent 平台",  count:18500, delta:12.7 },
    ],
    activityFeed: [
      { at:"10:42", who:"张教授", action:"发布术语", target:"自注意力机制", tool:"T02", type:"publish" },
      { at:"10:28", who:"李老师", action:"审核通过 8 条问答", target:"量子力学·模块3", tool:"T04", type:"approve" },
      { at:"10:05", who:"AI 流水线", action:"自动抽取术语 42 个", target:"计算机导论 ch.5", tool:"T01", type:"ai" },
      { at:"09:48", who:"陈主任", action:"提交图谱审核", target:"数据结构先修关系", tool:"T03", type:"submit" },
      { at:"09:15", who:"王博士", action:"批量导入问答", target:"金融学 FAQ · 200 条", tool:"T04", type:"import" },
      { at:"08:52", who:"赵讲师", action:"更新知识库版本", target:"近代物理 v2.3", tool:"T05", type:"update" },
      { at:"08:30", who:"系统", action:"知识库质检完成", target:"12 个学科", tool:"T06", type:"ai" },
      { at:"08:05", who:"孙教授", action:"发布 Agent 灰度版本", target:"离散数学助教 v1.2", tool:"T10", type:"publish" },
    ],
    subjectDist: [
      { name:"计算机科学", count:28, pct:22 },
      { name:"人工智能",   count:24, pct:19 },
      { name:"经济管理",   count:18, pct:14 },
      { name:"数学",       count:16, pct:13 },
      { name:"物理",       count:14, pct:11 },
      { name:"医学",       count:10, pct:8 },
      { name:"其他",       count:16, pct:13 },
    ],
  };

  // ============ docs (T01) ============
  const docSeeds = {
    计算机科学:["数据结构与算法导论","操作系统原理","计算机网络自顶向下","编译原理龙书","分布式系统概念与设计"],
    人工智能:["Transformer 架构精讲","深度学习花书","强化学习导论","大模型训练实战","提示工程指南"],
    数学:["高等数学（上）","线性代数讲义","概率论与数理统计","数值分析教材","微分方程讲义"],
    物理:["量子力学导论","电动力学讲义","热力学与统计物理","广义相对论入门"],
    经济管理:["微观经济学原理","博弈论基础","宏观经济学讲义"],
    法学:["民法总则讲义","合同法精要"],
    医学:["生理学教材","免疫学基础"],
    人文:["现象学导引","结构主义文集"],
  };
  const docStatuses = ["parsing","done","failed","ingested"];
  const docStatusMeta = {
    parsing:{text:"解析中",tone:"warning"}, done:{text:"已完成",tone:"success"},
    failed:{text:"失败",tone:"danger"}, ingested:{text:"已入库",tone:"info"},
  };
  const docTypes = ["pdf","word","ppt"];
  function buildDocs() {
    const r = mkRand(20260415);
    const list = [];
    for (let i=0; i<60; i++) {
      const sub = pick(r, subjects);
      const names = docSeeds[sub] || ["通用教材"];
      const base = names[i % names.length];
      const status = i<4 ? "parsing" : pick(r, docStatuses);
      const type = pick(r, docTypes);
      const day = 1 + Math.floor(r()*14);
      const updatedAt = `2026-04-${String(day).padStart(2,"0")} ${String(8+Math.floor(r()*10)).padStart(2,"0")}:${String(Math.floor(r()*60)).padStart(2,"0")}`;
      list.push({
        id:`DC${String(i+10001).padStart(5,"0")}`,
        name: i<names.length ? base : `${base}·第 ${Math.floor(i/names.length)+1} 版`,
        subject:sub, type,
        sizeMB: +(0.5+r()*48).toFixed(1),
        paragraphs: 60+Math.floor(r()*2400),
        formulas: Math.floor(r()*180),
        figures: Math.floor(r()*120),
        status, costSec: 8+Math.floor(r()*320),
        uploader: pick(r, uploaders),
        updatedAt,
        chapters: Array.from({length:5+Math.floor(r()*8)},(_,k)=>`第 ${k+1} 章 ${base}·章节${k+1}`),
        log: [
          {at:updatedAt, who:"上传服务", action:"文件上传完成"},
          {at:updatedAt, who:"解析引擎", action:"启动解析"},
          ...(status==="done"||status==="ingested"?[{at:updatedAt,who:"解析引擎",action:"解析完成"}]:[]),
          ...(status==="ingested"?[{at:updatedAt,who:"王博士",action:"入库归档"}]:[]),
          ...(status==="failed"?[{at:updatedAt,who:"解析引擎",action:"解析失败",note:"文件加密，无法提取文本"}]:[]),
        ],
      });
    }
    return list;
  }
  const docs = buildDocs();
  const docStats = {
    total: 120,
    paragraphs: docs.reduce((s,d)=>s+d.paragraphs,0),
    avgCost: Math.round(docs.reduce((s,d)=>s+d.costSec,0)/docs.length),
    successRate: +((docs.filter(d=>d.status==="done"||d.status==="ingested").length/docs.length)*100).toFixed(1),
  };

  // ============ terms (T02) ============
  const termSeeds = {
    计算机科学:[["数据结构","计算机存储、组织数据的方式"],["时间复杂度","算法执行所需时间与输入规模的函数关系"],["空间复杂度","算法所需存储空间与输入规模的关系"],["递归","函数在执行中调用自身的技术"],["动态规划","通过分解子问题求解复杂问题的方法"],["哈希表","根据键直接访问内存位置的数据结构"],["二叉树","每个节点最多两个子树的有序树"],["图遍历","按某种次序访问图中所有顶点"]],
    人工智能:[["注意力机制","允许模型对输入序列不同部分分配权重的机制"],["自注意力","查询、键、值来自同一序列的注意力"],["Transformer","完全基于注意力的深度学习架构"],["强化学习","通过与环境交互学习最优策略的范式"],["梯度下降","沿梯度反方向迭代更新参数的方法"],["过拟合","训练集表现好但测试集差的现象"],["嵌入向量","将离散符号映射到稠密向量的方法"],["提示工程","精心设计输入提示引导大模型的技术"]],
    数学:[["极限","函数或数列在变量变化过程中的趋势值"],["导数","函数在某点的瞬时变化率"],["矩阵","按长方阵列排列的数集"],["特征值","使 Av=λv 成立的标量 λ"],["微分方程","包含未知函数及其导数的方程"]],
    物理:[["测量假设","量子力学中关于测量使波函数坍缩的假设"],["波粒二象性","物质同时具备波动性和粒子性"],["熵","系统无序程度的度量"],["相对论","描述时空与引力关系的理论"]],
    经济管理:[["边际成本","增加一单位产量的总成本增加量"],["机会成本","为选择某方案而放弃的次优方案价值"],["纳什均衡","博弈论中各方策略相互最优应答的状态"]],
    法学:[["法人","依法成立具有民事权利能力的组织"],["善意第三人","不知情且无过错的第三方"]],
    医学:[["炎症反应","机体对损伤或感染的防御反应"],["抗体","B 细胞产生的特异性识别抗原的蛋白质"]],
    人文:[["现象学","研究意识结构及其如何呈现世界的方法"],["结构主义","通过深层结构理解文化现象的理论"]],
  };
  const termStatuses = ["pending","approved","rejected","draft"];
  const termStatusMeta = {
    pending:{text:"待审",tone:"warning"}, approved:{text:"已发布",tone:"success"},
    rejected:{text:"已驳回",tone:"danger"}, draft:{text:"草稿",tone:"info"},
  };
  const termSources = ["教材抽取","课件解析","教师提交","论文语料","知识库导入"];
  function buildTerms() {
    const r = mkRand(12345);
    const list = [];
    for (let i=0; i<80; i++) {
      const sub = pick(r, subjects);
      const seeds = termSeeds[sub] || [];
      const [name, def] = seeds[i % Math.max(seeds.length,1)] || [`术语-${i}`,`释义示例 ${i}`];
      const status = i<6 ? "pending" : pick(r, termStatuses);
      const day = 1 + Math.floor(r()*14);
      const createdAt = `2026-04-${String(day).padStart(2,"0")}`;
      list.push({
        id:`TM${String(i+10001).padStart(5,"0")}`,
        name: i<seeds.length ? name : `${name}·${i}`,
        definition: def, subject: sub, status,
        confidence: 60+Math.floor(r()*40),
        citations: Math.floor(r()*180),
        synonyms: status==="approved"?[`${name}同义-1`,`${name}同义-2`]:[],
        source: pick(r, termSources),
        reviewer: pick(r, reviewers),
        createdAt, updatedAt: createdAt,
        log:[
          {at:`${createdAt} 09:12`, who:"AI 抽取", action:"自动抽取"},
          ...(status!=="draft"?[{at:`${createdAt} 10:05`, who:"王博士", action:"提交审核"}]:[]),
          ...(status==="approved"?[{at:`${createdAt} 14:30`, who:"张教授", action:"审核通过"}]:[]),
          ...(status==="rejected"?[{at:`${createdAt} 14:30`, who:"张教授", action:"审核打回", note:"释义不够精确，请补充出处"}]:[]),
        ],
      });
    }
    return list;
  }
  const terms = buildTerms();
  const termStats = {
    total: 500,
    pending: terms.filter(t=>t.status==="pending").length,
    approved: terms.filter(t=>t.status==="approved").length,
    avgConfidence: Math.round(terms.reduce((s,t)=>s+t.confidence,0)/terms.length),
  };

  // ============ graph (T03) ============
  const graphSeeds = {
    计算机科学:["数据结构","算法","栈","队列","链表","二叉树","图","哈希表","排序算法","查找算法","动态规划","递归"],
    人工智能:["机器学习","深度学习","神经网络","反向传播","梯度下降","卷积神经网络","Transformer","注意力机制","自注意力","强化学习","大语言模型","微调"],
    数学:["极限","导数","积分","矩阵","特征值","向量空间","概率","分布"],
    物理:["牛顿定律","能量守恒","麦克斯韦方程","波粒二象性","熵","相对论"],
    经济管理:["边际成本","机会成本","供需","纳什均衡","博弈","外部性"],
    法学:["法人","善意第三人","合同","物权"],
    医学:["炎症反应","抗体","免疫","细胞"],
    人文:["现象学","结构主义","解释学"],
  };
  const relTypes = ["prerequisite","contains","related","synonym"];
  const relTypeMeta = { prerequisite:"先修", contains:"包含", related:"相关", synonym:"同义" };
  const nodeStatuses = ["published","pending","draft"];
  const nodeStatusMeta = {
    published:{text:"已发布",tone:"success"}, pending:{text:"待审核",tone:"warning"}, draft:{text:"草稿",tone:"info"},
  };
  function buildNodes() {
    const r = mkRand(777);
    const flat = [];
    subjects.forEach(sub => (graphSeeds[sub]||[]).forEach(n=>flat.push({subject:sub, name:n})));
    return flat.map((s,i)=>{
      const status = i<8 ? "pending" : pick(r, nodeStatuses);
      const relCount = 2 + Math.floor(r()*6);
      const same = flat.filter(x=>x.subject===s.subject && x.name!==s.name);
      const neighbors = [];
      for (let k=0; k<Math.min(relCount, same.length); k++) {
        const n = same[Math.floor(r()*same.length)];
        neighbors.push({ name:n.name, type:pick(r, relTypes) });
      }
      const day = 1 + Math.floor(r()*14);
      return {
        id:`GN${String(i+1001).padStart(5,"0")}`,
        name: s.name, subject: s.subject, status, relations: relCount,
        annotator: pick(r, reviewers),
        updatedAt:`2026-04-${String(day).padStart(2,"0")}`,
        neighbors,
      };
    });
  }
  const nodes = buildNodes();
  const graphStats = {
    total: nodes.length,
    relations: nodes.reduce((s,n)=>s+n.relations,0),
    pending: nodes.filter(n=>n.status==="pending").length,
    coverage: 82,
  };

  // ============ qa (T04) ============
  const qaSeeds = {
    计算机科学:[{q:"什么是时间复杂度？",a:"时间复杂度是算法执行所需时间与输入规模之间的函数关系，通常用大 O 表示法描述最坏情况。",c:"算法导论"},{q:"栈与队列的区别？",a:"栈是 LIFO 结构，队列是 FIFO 结构。",c:"数据结构"},{q:"哈希冲突如何解决？",a:"链地址法、开放寻址、再哈希。",c:"数据结构"}],
    人工智能:[{q:"什么是注意力机制？",a:"允许网络对输入不同位置分配不同权重，聚焦最相关部分。",c:"深度学习"},{q:"Transformer 为什么优于 RNN？",a:"自注意力并行处理序列，训练效率高，长程依赖建模好。",c:"大模型原理"},{q:"过拟合如何缓解？",a:"增加数据、正则化、Dropout、早停、数据增强。",c:"机器学习"}],
    数学:[{q:"什么是矩阵特征值？",a:"若 Av=λv（v 非零），则 λ 为特征值。",c:"线性代数"},{q:"导数的几何意义？",a:"函数在该点切线的斜率。",c:"高等数学"}],
    物理:[{q:"什么是波粒二象性？",a:"微观粒子同时具备波动性和粒子性。",c:"量子力学"},{q:"熵的物理意义？",a:"系统无序程度的度量，孤立系统熵不减。",c:"热力学"}],
    经济管理:[{q:"机会成本的含义？",a:"放弃的次优方案的价值。",c:"微观经济学"},{q:"纳什均衡是什么？",a:"各方策略对彼此最优应答的稳定状态。",c:"博弈论"}],
    法学:[{q:"善意第三人的定义？",a:"不知情且无过错参与法律关系的第三方。",c:"民法"}],
    医学:[{q:"什么是炎症反应？",a:"机体对损伤或感染的防御反应，表现为红、肿、热、痛。",c:"病理学"}],
    人文:[{q:"什么是现象学？",a:"研究意识结构及其如何呈现世界的哲学方法。",c:"哲学导论"}],
  };
  const qaStatuses = ["pending","approved","rejected"];
  const qaStatusMeta = {
    pending:{text:"待审",tone:"warning"}, approved:{text:"通过",tone:"success"}, rejected:{text:"驳回",tone:"danger"},
  };
  const qaSources = ["ai","manual","import"];
  const qaSourceMeta = { ai:"AI 生成", manual:"人工编写", import:"批量导入" };
  function buildQa() {
    const r = mkRand(9527);
    const list = [];
    for (let i=0; i<80; i++) {
      const sub = pick(r, subjects);
      const pool = qaSeeds[sub] || [];
      const seed0 = pool[i%Math.max(pool.length,1)] || {q:`示例问题-${i}`,a:`示例答案-${i}`,c:"通识课"};
      const status = i<10 ? "pending" : pick(r, qaStatuses);
      const source = pick(r, qaSources);
      const day = 1 + Math.floor(r()*14);
      const updatedAt = `2026-04-${String(day).padStart(2,"0")}`;
      const suffix = i >= pool.length ? `（变体 ${Math.floor(i/Math.max(pool.length,1))}）` : "";
      list.push({
        id:`QA${String(i+10001).padStart(5,"0")}`,
        question: seed0.q + suffix, answer: seed0.a,
        subject: sub, course: seed0.c, source, status,
        confidence: 55 + Math.floor(r()*45),
        reviewer: pick(r, reviewers),
        reference: `${seed0.c}·第 ${1+Math.floor(r()*12)} 章`,
        updatedAt,
        log:[
          {at:`${updatedAt} 09:10`, who: source==="ai"?"AI 生成":source==="manual"?"教师录入":"批量导入", action:"创建问答"},
          ...(status==="approved"?[{at:`${updatedAt} 15:00`, who:pick(r, reviewers), action:"审核通过"}]:[]),
          ...(status==="rejected"?[{at:`${updatedAt} 15:00`, who:pick(r, reviewers), action:"审核驳回", note:"答案不够准确"}]:[]),
        ],
      });
    }
    return list;
  }
  const qaList = buildQa();
  const qaStats = {
    total: 300,
    reviewed: qaList.filter(q=>q.status!=="pending").length*4,
    avgConfidence: Math.round(qaList.reduce((s,q)=>s+q.confidence,0)/qaList.length),
    passRate: +((qaList.filter(q=>q.status==="approved").length/Math.max(qaList.filter(q=>q.status!=="pending").length,1))*100).toFixed(1),
  };

  // ============ kbs (T05) ============
  const courseSeeds = {
    计算机科学:["数据结构","操作系统","计算机网络","编译原理","软件工程"],
    人工智能:["深度学习","自然语言处理","计算机视觉","强化学习","大模型导论"],
    数学:["高等数学","线性代数","概率论","离散数学","数值分析"],
    物理:["力学","电磁学","量子力学","热力学","光学"],
    经济管理:["微观经济学","宏观经济学","博弈论","运营管理"],
    法学:["民法","刑法","法理学","国际法"],
    医学:["解剖学","生理学","病理学","药理学"],
    人文:["哲学导论","文学理论","中国哲学史"],
  };
  const kbStatuses = ["published","canary","draft","archived"];
  const kbStatusMeta = {
    published:{text:"发布中",tone:"success"}, canary:{text:"灰度中",tone:"warning"},
    draft:{text:"草稿",tone:"info"}, archived:{text:"已归档",tone:""},
  };
  function buildKbs() {
    const r = mkRand(20260415);
    const list = [];
    for (let i=0; i<36; i++) {
      const sub = pick(r, subjects);
      const course = pick(r, courseSeeds[sub]||["通用课程"]);
      const status = i<3 ? "canary" : pick(r, kbStatuses);
      const v = `v${1+Math.floor(r()*3)}.${Math.floor(r()*8)}.${Math.floor(r()*12)}`;
      const day = 1 + Math.floor(r()*14);
      const history = [];
      const parts = v.slice(1).split(".").map(Number);
      for (let k=0; k<3+Math.floor(r()*2); k++) {
        const vp = [...parts]; vp[2] = Math.max(0, vp[2]-k);
        history.push({
          version: `v${vp.join(".")}`,
          publishedAt: `2026-04-${String(Math.max(1, day-k*2)).padStart(2,"0")} ${10+(k%6)}:${String((k*7)%60).padStart(2,"0")}`,
          by: pick(r, reviewers),
          changes: k===0?"新增术语与问答，修订图谱关系":k===1?"修复若干释义错误":"结构微调与文档补充",
        });
      }
      list.push({
        id:`KB${String(i+1001).padStart(4,"0")}`,
        name:`${course} 知识库`, subject: sub, course,
        owner: pick(r, reviewers), status, currentVersion: v,
        docs: 20+Math.floor(r()*260),
        terms: 40+Math.floor(r()*480),
        qas: 60+Math.floor(r()*720),
        updatedAt:`2026-04-${String(day).padStart(2,"0")}`,
        history,
      });
    }
    return list;
  }
  const knowledgeBases = buildKbs();
  const kbStats = {
    total: 60,
    published: knowledgeBases.filter(k=>k.status==="published").length,
    owners: 7,
    usage: "24,110",
  };

  // ============ qualityEval (T06) ============
  const evalTargetMeta = { term:"术语", graph:"图谱", qa:"问答", doc:"文档" };
  const evalStatuses = ["running","completed","needs_revise","queued"];
  const evalStatusMeta = {
    running:{text:"评测中",tone:"info"}, completed:{text:"已完成",tone:"success"},
    needs_revise:{text:"待修订",tone:"warning"}, queued:{text:"排队中",tone:"info"},
  };
  const suggestionPool = ["释义不够精确，建议补充权威出处","存在同义术语未合并","关系标注方向错误","问答答案偏离题干","覆盖度不足","表述风格不统一","引用来源缺失"];
  function buildEval() {
    const r = mkRand(777);
    const list = [];
    const types = ["term","graph","qa","doc"];
    for (let i=0; i<50; i++) {
      const type = pick(r, types);
      const sub = pick(r, subjects);
      const accuracy = 70+Math.floor(r()*28);
      const consistency = 70+Math.floor(r()*28);
      const completeness = 65+Math.floor(r()*32);
      const score = Math.round((accuracy+consistency+completeness)/3);
      const status = i<4 ? "needs_revise" : pick(r, evalStatuses);
      const day = 1 + Math.floor(r()*14);
      const issues = Array.from({length: 6+Math.floor(r()*5)}, (_,k)=>({
        itemId: `${type.toUpperCase()}${10000+Math.floor(r()*90000)}`,
        itemName: `条目-${k+1}`,
        score: 40+Math.floor(r()*40),
        suggestion: pick(r, suggestionPool),
      }));
      list.push({
        id:`EV${String(i+20001).padStart(5,"0")}`,
        name:`${sub}·${evalTargetMeta[type]}质量评测 R${(i%8)+1}`,
        targetType: type, subject: sub, round:`R${(i%8)+1}`,
        coverage: 50+Math.floor(r()*950),
        score, accuracy, consistency, completeness, status,
        finishedAt:`2026-04-${String(day).padStart(2,"0")} ${String(8+(i%10)).padStart(2,"0")}:${String((i*11)%60).padStart(2,"0")}`,
        reviewer: pick(r, reviewers),
        issues,
      });
    }
    return list;
  }
  const evalTasks = buildEval();
  const evalStats = {
    total: 80,
    avgScore: Math.round(evalTasks.reduce((s,t)=>s+t.score,0)/evalTasks.length),
    objects: 4,
    rounds: 8,
  };

  // ============ coauthor (T07) ============
  const coTypeMeta = { lecture:"讲义", exercises:"习题集", case:"案例", paper:"论文" };
  const coStatusMeta = {
    recruiting:{text:"招募中",tone:"warning"}, drafting:{text:"编撰中",tone:"info"}, published:{text:"已发布",tone:"success"},
  };
  const memberNames = ["周同学","吴研究生","郑助教","冯博士","沈同学","韩同学","谢同学","何博士","邓老师","曹同学","许同学"];
  const commitSummaries = ["新增第 3 章习题与参考答案","修订导论部分的行文措辞","补充两则工业应用案例","统一图示风格与编号","整理参考文献并加入 DOI","拆分长章节，优化知识路径"];
  function buildCo() {
    const r = mkRand(314159);
    const list = [];
    const types = ["lecture","exercises","case","paper"];
    const coStatuses = ["recruiting","drafting","published"];
    for (let i=0; i<24; i++) {
      const type = pick(r, types);
      const sub = pick(r, subjects);
      const founder = pick(r, reviewers);
      const memberCount = 4 + Math.floor(r()*6);
      const members = [{name:founder, role:"发起人", words:8000+Math.floor(r()*12000), commits:12+Math.floor(r()*40)}];
      for (let k=0; k<memberCount-1; k++) {
        members.push({
          name: `${pick(r, memberNames)}${k}`,
          role: k<2?"核心":k<memberCount-2?"成员":"学生",
          words: 500+Math.floor(r()*8000),
          commits: 2+Math.floor(r()*28),
        });
      }
      members.sort((a,b)=>b.words-a.words);
      const status = i<3 ? "recruiting" : pick(r, coStatuses);
      const progress = status==="recruiting"?Math.floor(r()*20):status==="published"?100:30+Math.floor(r()*65);
      const day = 1 + Math.floor(r()*14);
      const commits = Array.from({length:3+Math.floor(r()*3)},(_,k)=>({
        at:`2026-04-${String(14-k).padStart(2,"0")} ${String(9+(k*3)%12).padStart(2,"0")}:${String((k*13)%60).padStart(2,"0")}`,
        by: members[Math.floor(r()*members.length)].name,
        summary: pick(r, commitSummaries),
      }));
      list.push({
        id:`CO${String(i+3001).padStart(4,"0")}`,
        name:`${sub}·${coTypeMeta[type]}共建组-${i+1}`,
        type, subject:sub, founder, crossSchool: r()>0.55, status, members, progress,
        updatedAt:`2026-04-${String(day).padStart(2,"0")}`,
        recentCommits: commits,
      });
    }
    return list;
  }
  const coGroups = buildCo();
  const coStats = {
    activeGroups: coGroups.filter(g=>g.status!=="published").length,
    contributions: coGroups.reduce((s,g)=>s+g.members.reduce((x,m)=>x+m.commits,0),0),
    commitsPerWeek: 186,
    members: Array.from(new Set(coGroups.flatMap(g=>g.members.map(m=>m.name)))).length,
  };

  // ============ multimodal (T08) ============
  const mmTypeMeta = { video:"视频", audio:"音频", image:"图像", scan:"文档扫描" };
  const mmStatusMeta = {
    ingesting:{text:"采集中",tone:"info"}, processing:{text:"处理中",tone:"warning"},
    ready:{text:"已入库",tone:"success"}, failed:{text:"失败",tone:"danger"},
  };
  const mmNamePools = {
    video:["人工智能导论-第03讲-神经网络基础","微积分-极限与连续性","量子力学-测量假设","宏观经济学-IS-LM 模型","刑法总论-犯罪构成","数据结构-红黑树旋转演示"],
    audio:["研讨会-大模型在教育的应用","田野访谈-老北京口述历史","课程录音-离散数学第12次课","讲座-博弈论与纳什均衡"],
    image:["实验室白板-反向传播推导","课堂板书-矩阵特征值","教材插图-熵与热力学第二定律","电路图-RLC 谐振"],
    scan:["手稿-动态规划讲义","扫描件-量子场论笔记","扫描件-经济学原理习题","扫描件-法学判例汇编"],
  };
  function buildMM() {
    const r = mkRand(42013);
    const list = [];
    const types = ["video","audio","image","scan"];
    const mmStatuses = ["ingesting","processing","ready","failed"];
    for (let i=0; i<32; i++) {
      const type = types[i%types.length];
      const pool = mmNamePools[type];
      const baseName = pool[Math.floor(r()*pool.length)];
      const sub = pick(r, subjects);
      const status = i<4 ? "processing" : pick(r, mmStatuses);
      const duration = type==="video" ? 20+Math.floor(r()*80) : type==="audio" ? 15+Math.floor(r()*120) : 0;
      const sizeMb = type==="video"?120+Math.floor(r()*1800):type==="audio"?8+Math.floor(r()*120):2+Math.floor(r()*30);
      const keyframes = type==="video"?20+Math.floor(r()*80):type==="image"||type==="scan"?1:0;
      const ocrChars = type==="scan"?3000+Math.floor(r()*12000):type==="image"?200+Math.floor(r()*1800):type==="video"?800+Math.floor(r()*4200):0;
      const day = 1+Math.floor(r()*14);
      const uploadedAt = `2026-04-${String(day).padStart(2,"0")} ${String(8+Math.floor(r()*10)).padStart(2,"0")}:${String(Math.floor(r()*60)).padStart(2,"0")}`;
      const keyframeStamps = [];
      if (duration > 0) {
        const step = Math.max(1, Math.floor(duration/7));
        for (let k=1;k<=6;k++) {
          const m = Math.min(duration, k*step);
          keyframeStamps.push(`${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`);
        }
      } else keyframeStamps.push("00:00");
      list.push({
        id:`MM${String(i+2001).padStart(5,"0")}`,
        name:`${baseName}${i>=pool.length?`·${i}`:""}`,
        type, subject:sub, status, durationMin:duration, sizeMb,
        keyframes, ocrChars,
        uploader: pick(r, uploaders), uploadedAt, keyframeStamps,
        ocrSummary: type==="audio"?"语音已转写，检测到关键词：梯度下降、反向传播、学习率。":
                    type==="video"?"视频抽帧完成，识别出板书公式 12 条，PPT 26 页，语音转写 8400 字。":
                    type==="scan"?"扫描件 OCR 完成，印刷体 98.4% 置信度，手写体 86.2%。":
                    "图像结构识别完成，提取标注文本 6 条。",
        log:[
          {at:uploadedAt, action:"上传完成"},
          {at:uploadedAt, action:"进入处理队列"},
          status==="failed"?{at:uploadedAt, action:"处理失败", note:"音轨异常"}:
            status==="ready"?{at:uploadedAt, action:"处理完成"}:{at:uploadedAt, action:"处理中"},
        ],
      });
    }
    return list;
  }
  const mmAssets = buildMM();
  const mmStats = {
    total: 90,
    videos: mmAssets.filter(a=>a.type==="video").length*3,
    images: mmAssets.filter(a=>a.type==="image"||a.type==="scan").length*3,
    ocrChars: mmAssets.reduce((s,a)=>s+a.ocrChars,0),
  };

  // ============ notedoc (T09) ============
  const ndTypeMeta = { note:"课程笔记", lab:"实验报告", minute:"讨论纪要" };
  const ndStatusMeta = {
    editing:{text:"编辑中",tone:"warning"}, published:{text:"已定稿",tone:"success"}, archived:{text:"已归档",tone:"info"},
  };
  const ndCourses = ["人工智能导论","高等数学","量子力学","离散数学","宏观经济学","刑法总论","分子生物学","西方哲学史","操作系统","信号与系统"];
  const ndNamePools = {
    note:["反向传播算法整理笔记","极限与连续性复习笔记","Transformer 自注意力整理","纳什均衡典型题型","离散数学集合论笔记"],
    lab:["PCR 实验报告","RLC 电路谐振实验报告","冒泡排序与快速排序性能对比","CNN 图像分类实验报告"],
    minute:["第03次小组讨论纪要","学期中期教学研讨纪要","课题组周会纪要","课程改革专题讨论"],
  };
  function buildND() {
    const r = mkRand(72017);
    const list = [];
    const types = ["note","lab","minute"];
    const ndStatuses = ["editing","published","archived"];
    for (let i=0; i<50; i++) {
      const type = types[i%types.length];
      const pool = ndNamePools[type];
      const baseName = pool[Math.floor(r()*pool.length)];
      const status = i<5 ? "editing" : pick(r, ndStatuses);
      const sub = pick(r, subjects);
      const course = pick(r, ndCourses);
      const collaborators = [];
      const ncount = 2 + Math.floor(r()*3);
      for (let k=0; k<ncount; k++) collaborators.push({name: pick(r, reviewers.concat(memberNames))});
      const day = 1 + Math.floor(r()*14);
      const updatedAt = `2026-04-${String(day).padStart(2,"0")} ${String(8+Math.floor(r()*10)).padStart(2,"0")}:${String(Math.floor(r()*60)).padStart(2,"0")}`;
      const activities = Array.from({length:6},(_,k)=>({
        at: `2026-04-${String(day).padStart(2,"0")} ${String(8+Math.floor(r()*10)).padStart(2,"0")}:${String(Math.floor(r()*60)).padStart(2,"0")}`,
        who: pick(r, collaborators).name,
        action: pick(r, ["新增批注","修订段落","回复讨论","上传附件","引用术语"]),
        target: pick(r, ["第 1 章 导论","公式 (3.2)","实验结果","参考文献","小节 2.3"]),
      }));
      list.push({
        id:`ND${String(i+3001).padStart(5,"0")}`,
        name:`${baseName}${i>=pool.length?`·${i}`:""}`,
        course, type, subject: sub, status, collaborators,
        annotations: Math.floor(r()*60),
        version: `v${1+Math.floor(r()*6)}.${Math.floor(r()*9)}`,
        updatedAt, activities,
      });
    }
    return list;
  }
  const ndDocs = buildND();
  const ndStats = {
    total: 150,
    activeCollaborators: 62,
    activity: ndDocs.reduce((s,d)=>s+d.annotations,0),
    favorites: 284,
  };

  // ============ agents (T10) ============
  const agentKindMeta = { ta:"课程助教", research:"科研问答", recommend:"选课推荐", explain:"题目讲解" };
  const agentStatusMeta = {
    online:{text:"运行中",tone:"success"}, canary:{text:"灰度",tone:"warning"}, offline:{text:"停用",tone:"info"},
  };
  const agentNamePools = {
    ta:["离散数学课程助教","高等代数助教","人工智能导论助教","量子力学助教","西方哲学史助教","刑法总论助教"],
    research:["大模型文献问答","临床医学研究助手","经济学论文助手","法学案例检索","物理前沿问答"],
    recommend:["理工选课推荐官","文科选课推荐官","辅修方向推荐"],
    explain:["高数例题讲解员","编程题目讲解员","物理题目讲解员","化学实验讲解员"],
  };
  const agentToolsPool = ["knowledge_search","math_solver","code_interpreter","web_search","pdf_reader","latex_render","term_lookup","citation_fetcher"];
  function buildAgents() {
    const r = mkRand(98801);
    const list = [];
    const kinds = ["ta","research","recommend","explain"];
    const agentStatuses = ["online","canary","offline"];
    for (let i=0; i<24; i++) {
      const kind = kinds[i%kinds.length];
      const pool = agentNamePools[kind];
      const name = pool[i%pool.length] + (i>=pool.length ? `·${i}` : "");
      const sub = pick(r, subjects);
      const status = i<2 ? "canary" : pick(r, agentStatuses);
      const tools = [];
      const tp = [...agentToolsPool];
      const n = 2 + Math.floor(r()*3);
      for (let k=0; k<n && tp.length; k++) tools.push(tp.splice(Math.floor(r()*tp.length),1)[0]);
      const base = 10 + Math.floor(r()*40);
      const trend7d = Array.from({length:7},(_,k)=>Math.max(1, base+Math.floor((r()-0.4)*16)+k));
      list.push({
        id:`AG${String(i+5001).padStart(5,"0")}`,
        name, kind, subject: sub, status,
        kbCount: 1+Math.floor(r()*8),
        callsMonth: 800+Math.floor(r()*24000),
        satisfaction: 78+Math.floor(r()*20),
        latencySec: +(0.6+r()*2.8).toFixed(2),
        updatedAt:`2026-04-${String(1+Math.floor(r()*14)).padStart(2,"0")}`,
        iconSeed: name.slice(0,1),
        tools, trend7d,
        systemPrompt: kind==="ta"?`你是面向${sub}学生的课程助教，基于挂载的课程知识库回答，鼓励学生自主思考。`:
                      kind==="research"?`你是${sub}方向科研问答助手，检索论文库并以学术口吻作答，需标注出处。`:
                      kind==="recommend"?`你是选课推荐助手，根据学生已修课程与兴趣给出 3-5 门候选课程。`:
                      `你是题目讲解员，先判定题型再逐步推演，穿插常见错误提示。`,
      });
    }
    return list;
  }
  const agents = buildAgents();
  const agentStats = {
    total: 40,
    callsMonth: agents.reduce((s,a)=>s+a.callsMonth,0),
    satisfaction: Math.round(agents.reduce((s,a)=>s+a.satisfaction,0)/agents.length),
    latency: +(agents.reduce((s,a)=>s+a.latencySec,0)/agents.length).toFixed(2),
  };

  // ============ 挂到 window ============
  window.MOCK = {
    subjects,
    tools, stageMeta, coverageLabel, modules, systemStatus,
    overview,
    docs, docStats, docStatusMeta,
    terms, termStats, termStatusMeta,
    nodes, graphStats, nodeStatusMeta, relTypeMeta,
    qaList, qaStats, qaStatusMeta, qaSourceMeta,
    knowledgeBases, kbStats, kbStatusMeta,
    evalTasks, evalStats, evalStatusMeta, evalTargetMeta,
    coGroups, coStats, coTypeMeta, coStatusMeta,
    mmAssets, mmStats, mmStatusMeta, mmTypeMeta,
    ndDocs, ndStats, ndStatusMeta, ndTypeMeta,
    agents, agentStats, agentStatusMeta, agentKindMeta,
  };
})();
