const fs = require('fs');
const path = require('path');

class CustomHtmlReporter {
  constructor() {
    this.results = [];
  }

  onTestEnd(test, result) {
    const screenshot = result.attachments.find(att => att.name === 'screenshot' && att.path);
    const video = result.attachments.find(att => att.name === 'video' && att.path);

    this.results.push({
      title: test.title,
      file: test.location.file,
      status: result.status,
      duration: result.duration,
      screenshotPath: screenshot?.path,
      videoPath: video?.path,
      error: result.error?.message || null,
    });
  }

  onEnd() {
    const logsDir = path.join(process.cwd(), 'custom-logs');
    const logFiles = fs.readdirSync(logsDir).filter(f => f.startsWith('testlog-') && f.endsWith('.log'));
    const latestLogFile = logFiles.sort().reverse()[0];
    const logContent = latestLogFile ? fs.readFileSync(path.join(logsDir, latestLogFile), 'utf-8') : 'No logs available';

    const html = this.generateHtml(this.results, logContent);

    const firstTestFile = this.results[0]?.file || 'playwright-report';
    const testFileName = path.basename(firstTestFile, path.extname(firstTestFile)).replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '').replace('T', '_');
    const fileName = `${testFileName}-${timestamp}.html`;

    const reportsDir = path.join(process.cwd(), 'custom-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const outputPath = path.join(reportsDir, fileName);
    fs.writeFileSync(outputPath, html);
    console.log(`📄 Custom HTML report written to: ${outputPath}`);
  }


  generateHtml(results, logContent) {
    const passedTests = results.filter(r => r.status === 'passed');
    const failedTests = results.filter(r => r.status === 'failed');
    const total = results.length;
    const duration = results.reduce((acc, r) => acc + (r.duration || 0), 0);

    const createRows = (testArray, isFailed = false) =>
      testArray.map(r => {
        const tags = (r.title.match(/@\w+/g) || []).map(tag => `<span class="tag">${tag}</span>`).join(' ');
        const screenshotCell = r.screenshotPath
          ? `<a href="file://${r.screenshotPath}" target="_blank"><img src="file://${r.screenshotPath}" /></a>`
          : '—';
        const videoCell = r.videoPath
          ? `<video controls><source src="file://${r.videoPath}" type="video/webm"></video>`
          : '—';
        const errorDetails = isFailed && r.error
          ? `<pre class="error">${r.error}</pre>`
          : '';

        return `
          <tr class="${r.status}">
            <td>
              ${isFailed ? `
                <details>
                  <summary>${r.title} ${tags}</summary>
                  ${errorDetails}
                </details>
              ` : `
                ${r.title} ${tags}
              `}
            </td>
            <td>${r.file}</td>
            <td><span class="badge ${r.status}">${r.status.toUpperCase()}</span></td>
            <td>${r.duration}ms</td>
            <td>${screenshotCell}</td>
            <td>${videoCell}</td>
          </tr>
        `;
      }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Playwright Test Report</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background: #f8f9fa;
            padding: 20px;
            color: #333;
          }
          h1 {
            color: #222;
          }
          .summary {
            display: flex;
            gap: 20px;
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }
          .summary span {
            font-weight: bold;
            padding: 8px 14px;
            border-radius: 5px;
            font-size: 14px;
          }
          .total { background: #e0e0e0; }
          .passed { background: #d4edda; color: #155724; }
          .failed { background: #f8d7da; color: #721c24; }
          .duration { background: #fff3cd; color: #856404; }

          .section-title {
            font-size: 18px;
            margin-top: 30px;
            margin-bottom: 10px;
            color: #444;
            border-bottom: 2px solid #ccc;
            padding-bottom: 5px;
          }
          .log-content {
            background: #f5f5f5;
            border: 1px solid #ccc;
            padding: 10px;
            white-space: pre-wrap;
            font-family: monospace;
            max-height: 500px;
            overflow-y: auto;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .tag {
            background: #e0e0e0;
            padding: 2px 8px;
            border-radius: 5px;
            font-size: 12px;
          }
          .badge {
            font-size: 12px;
            padding: 5px 10px;
            border-radius: 20px;
          }
          .passed { background: #28a745; color: white; }
          .failed { background: #dc3545; color: white; }
          .duration { background: #ffc107; }
        </style>
      </head>
      <body>
        <h1>Playwright Test Report</h1>
        <div class="summary">
          <span class="total">Total: ${total}</span>
          <span class="passed">Passed: ${passedTests.length}</span>
          <span class="failed">Failed: ${failedTests.length}</span>
          <span class="duration">Total Duration: ${duration}ms</span>
        </div>
        
        <div class="section-title">Passed Tests</div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>File</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Screenshots</th>
              <th>Videos</th>
            </tr>
          </thead>
          <tbody>
            ${createRows(passedTests)}
          </tbody>
        </table>

        <div class="section-title">Failed Tests</div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>File</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Screenshots</th>
              <th>Videos</th>
            </tr>
          </thead>
          <tbody>
            ${createRows(failedTests, true)}
          </tbody>
        </table>

        <div class="section-title">Logs</div>
        <div class="log-content">${logContent}</div>
      </body>
      </html>
    `;
  }
}

module.exports = CustomHtmlReporter;
