# 社区案例接入 Google Sheets 配置指南

## 3 步完成配置

### 第 1 步：创建 Google Sheet

1. 打开 https://sheets.google.com，新建一个表格
2. 将工作表名称改为 `cases`
3. 第一行填写表头（务必一致）：

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| name | title | tags | link | body | date | views | likes | hot |

4. 把现有案例数据填进去（可选，也可以空着从网页提交）
5. 记下浏览器地址栏中的 **Sheet ID**（`https://docs.google.com/spreadsheets/d/这一串就是ID/edit`）

### 第 2 步：创建 Apps Script API

1. 在 Google Sheet 中，点击菜单 **扩展程序 → Apps Script**
2. 删除默认代码，粘贴以下代码：

```javascript
// ====== 把这里换成你的 Sheet ID ======
const SHEET_ID = '你的Google_Sheet_ID';
// =====================================

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('cases');
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return jsonResponse([]);
    }
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        if (h === 'tags') {
          obj[h] = row[i] ? String(row[i]).split(',').map(t => t.trim()).filter(Boolean) : [];
        } else if (h === 'views' || h === 'likes') {
          obj[h] = Number(row[i]) || 0;
        } else if (h === 'hot') {
          obj[h] = row[i] === true || row[i] === 'true' || row[i] === 'TRUE';
        } else {
          obj[h] = row[i] || '';
        }
      });
      return obj;
    });
    return jsonResponse(rows);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('cases');
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.name || '',
      data.title || '',
      (data.tags || []).join(', '),
      data.link || '',
      data.body || '',
      data.date || new Date().toISOString().slice(0, 10),
      0,
      0,
      false
    ]);
    return jsonResponse({ status: 'ok' });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. 把 `你的Google_Sheet_ID` 替换为第 1 步记下的 ID
4. 点击 **部署 → 新建部署**
5. 类型选择 **网页应用**
6. 执行身份：**我自己**
7. 谁可以访问：**任何人**
8. 点击 **部署**，授权后复制 **网页应用网址**（格式如 `https://script.google.com/macros/s/xxx/exec`）

### 第 3 步：配置到网页

把复制的网址填入 team.html 的 `SHEET_API` 变量中（我已经预留好了位置）。

完成！现在任何人通过网页表单提交的案例会直接写入 Google Sheet，所有人都能看到。
