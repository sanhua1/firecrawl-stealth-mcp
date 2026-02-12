# Firecrawl Stealth MCP

🔥 **Firecrawl Stealth MCP** 是一款专为 AI Agent（如 Claude Code, OpenClaw）设计的 Model Context Protocol (MCP) 服务器。它完美适配 Firecrawl 私有化部署环境，并提供了增强的数据采集能力。

## 核心功能

1.  **`firecrawl_scrape`**: 单页抓取，将任意 URL 转换为干净的 Markdown 格式。
2.  **`firecrawl_map`**: 站点探测，获取目标网站的所有子页面 URL 列表。
3.  **`firecrawl_crawl`**: 异步递归抓取，支持自定义抓取层级和页数上限。
4.  **`firecrawl_get_job`**: 任务状态查询，取回异步抓取任务生成的 Markdown 内容。

## 安装与配置

### 1. 在 Claude Code 中使用

在你的 `.claude.json` 配置文件中添加以下配置：

```json
"firecrawl": {
  "command": "npx",
  "args": [
    "-y",
    "git+https://github.com/sanhua1/firecrawl-stealth-mcp.git"
  ],
  "env": {
    "FIRECRAWL_URL": "https://your-firecrawl-domain.com",
    "AUTH_USER": "your-username",
    "AUTH_PASS": "your-password"
  }
}
```

### 2. 环境变量说明

*   `FIRECRAWL_URL`: 你的 Firecrawl 实例地址。
*   `AUTH_USER`: 认证用户名（默认为 `admin`）。
*   `AUTH_PASS`: 认证密码。

## 维护信息

*   **Author**: sanhua1
*   **Version**: 2.1.2

---
*本项目由 OpenClaw 自动生成并维护。*
