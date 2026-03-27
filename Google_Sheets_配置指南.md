# 社区案例接入 Google Sheets · V3 最终版

## Apps Script 代码（复制粘贴替换旧代码）

```javascript
// ====== 把这里换成你的 Sheet ID ======
const SHEET_ID = '你的Google_Sheet_ID';
// =====================================

function doGet(e) {
  var p = e.parameter || {};

  // 写入模式：action=add
  if (p.action === 'add' && p.name && p.title) {
    try {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('cases');
      sheet.appendRow([
        p.name,
        p.title,
        p.tags || '',
        p.link || '',
        p.body || '',
        p.date || new Date().toISOString().slice(0, 10),
        0,
        0,
        'false'
      ]);
      var result = JSON.stringify({status: 'ok'});
    } catch (err) {
      var result = JSON.stringify({error: err.message});
    }
    if (p.callback) {
      return ContentService.createTextOutput(p.callback + '(' + result + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  }

  // 读取模式
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('cases');
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      var rows = [];
    } else {
      var headers = data[0];
      var rows = [];
      for (var i = 1; i < data.length; i++) {
        var obj = {};
        for (var j = 0; j < headers.length; j++) {
          var h = headers[j];
          var v = data[i][j];
          if (h === 'tags') {
            obj[h] = v ? String(v).split(',').map(function(t){return t.trim()}).filter(Boolean) : [];
          } else if (h === 'views' || h === 'likes') {
            obj[h] = Number(v) || 0;
          } else if (h === 'hot') {
            obj[h] = v === true || v === 'true' || v === 'TRUE';
          } else {
            obj[h] = v || '';
          }
        }
        rows.push(obj);
      }
    }
    var result = JSON.stringify(rows);
  } catch (err) {
    var result = JSON.stringify({error: err.message});
  }

  if (p.callback) {
    return ContentService.createTextOutput(p.callback + '(' + result + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  return doGet({parameter: e.parameter || JSON.parse(e.postData.contents)});
}
```

## 部署步骤

1. 打开 Google Sheet → **扩展程序 → Apps Script**
2. **全选删除**旧代码，粘贴上面的新代码
3. 把 `你的Google_Sheet_ID` 替换为你的 Sheet ID
4. **部署 → 管理部署 → 编辑（铅笔图标）→ 版本选"新版本" → 部署**

## 验证方法

浏览器直接访问：
- 读取：`你的API地址`  → 应该返回 `[]` 或 JSON 数组
- 写入测试：`你的API地址?action=add&name=测试&title=API测试`  → 应该返回 `{"status":"ok"}`
- 写入后再读取，确认数据出现
