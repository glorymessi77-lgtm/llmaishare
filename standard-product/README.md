# 学科大模型标品 - 前端交付目录

本目录用于存放**学科大模型标品**相关的前端交付内容(原型、演示页、配套截图等),由前端工程师推送到本分支。

---

## 分支信息

- **仓库**:https://github.com/glorymessi77-lgtm/llmaishare
- **目标分支**:`feature/subject-llm-standard-product`
- **基于**:`main`
- **本目录绝对路径**:`/standard-product/`(仓库根目录下)

---

## 提交规范

### 1. 文件只放在本目录(`standard-product/`)下

仓库根目录其他位置(`coral/`、`discipline-model/`、`网站复刻/`、根目录下的 HTML)已经在 GitHub Pages 对外发布,**请不要新增、修改、删除这些位置的任何文件**,避免覆盖现有链接。

### 2. 推荐的子目录结构

```
standard-product/
├── README.md                        # 本说明文件(不要删)
├── pages/                           # HTML 页面
│   └── {功能名}-v{版本}.html
├── assets/                          # 图片、视频、字体等静态资源
│   ├── images/
│   └── videos/
├── components/                      # 可复用组件(如需)
└── docs/                            # 配套说明文档
```

### 3. 命名规范

- 文件名用**小写英文 + 短横线**(`subject-llm-overview-v1.html`),不要用中文文件名、空格、下划线
- HTML 文件**必须带版本号**(`-v1.html`、`-v2.html`),迭代时不要覆盖旧版
- 图片资源放 `assets/images/{功能名}/` 子目录,不要直接堆在根

### 4. Commit 规范

```
git commit -m "feat(standard-product): 简短描述"
git commit -m "fix(standard-product): 修复xxx"
git commit -m "docs(standard-product): 更新说明"
```

---

## 操作命令(给前端)

```bash
# 1. 克隆仓库
git clone https://github.com/glorymessi77-lgtm/llmaishare.git
cd llmaishare

# 2. 切到交付分支
git checkout feature/subject-llm-standard-product

# 3. 把你的文件放到 standard-product/ 下,然后:
git add standard-product/
git commit -m "feat(standard-product): 你的提交说明"

# 4. 推送
git push origin feature/subject-llm-standard-product
```

---

## 注意

- 本分支**不要**直接合并到 `main`,合并前需婷婷确认
- 单文件 ≤ 50MB(GitHub 限制),大视频请用云盘链接,不要直接 push
- 提交前用 `git status` 确认改动只在 `standard-product/` 下
- 任何疑问联系:婷婷

---

发布日期:2026-05-24
