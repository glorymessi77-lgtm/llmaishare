# 社区案例接入 Google Sheets 配置指南（V2 修复版）

## 重要：需要更新 Apps Script 代码

之前的版本有 CORS 兼容问题，导致提交的数据无法被其他人看到。请用以下新代码替换。

### Apps Script 代码（替换旧代码）

在 Google Sheet 中点击 **扩展程序 → Apps Script**，删除旧代码，粘贴以下代码：

```javascript
// ====== 把这里换成你的 Sheet ID ======
const SHEET_ID = '你的Google_Sheet_ID';
// =====================================

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('cases');
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return respond([], e);
    }
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        if (h === 'tags') {
          try { obj[h] = JSON.parse(row[i]); } catch(ex) {
            obj[h] = row[i] ? String(row[i]).split(',').map(t => t.trim()).filter(Boolean) : [];
          }
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
    return respond(rows, e);
  } catch (err) {
    return respond({ error: err.message }, e);
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('cases');
    var data;

    // 支持 JSON body 和 form 表单两种提交方式
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
      // form 提交的 tags 可能是 JSON 字符串
      if (data.tags && typeof data.tags === 'string') {
        try { data.tags = JSON.parse(data.tags); } catch(ex) {
          data.tags = data.tags.split(',').map(function(t){return t.trim()}).filter(Boolean);
        }
      }
    }

    if (!data || !data.name || !data.title) {
      return respond({ error: 'missing name or title' }, e);
    }

    sheet.appendRow([
      data.name || '',
      data.title || '',
      Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
      data.link || '',
      data.body || '',
      data.date || new Date().toISOString().slice(0, 10),
      0,
      0,
      false
    ]);
    return respond({ status: 'ok' }, e);
  } catch (err) {
    return respond({ error: err.message }, e);
  }
}

// 支持 JSONP 回调和普通 JSON 两种响应
function respond(data, e) {
  var jsonStr = JSON.stringify(data);
  var callback = e && e.parameter && e.parameter.callback;
  if (callback) {
    // JSONP 响应
    return ContentService
      .createTextOutput(callback + '(' + jsonStr + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  // 普通 JSON 响应
  return ContentService
    .createTextOutput(jsonStr)
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 部署步骤

1. 粘贴代码后，把 `你的Google_Sheet_ID` 替换为实际 ID
2. 点击 **部署 → 管理部署 → 编辑（铅笔图标）→ 版本选"新版本"→ 部署**
3. 这样会更新现有部署，URL 不变

### 验证

浏览器直接访问你的 API URL，应该能看到 JSON 数据（如果 Sheet 里有数据的话）。
