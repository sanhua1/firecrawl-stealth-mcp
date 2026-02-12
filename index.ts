import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const BASE_URL = "https://firecrawl.oneding.top";
const AUTH_TOKEN = Buffer.from("admin:D1elevend1!").toString("base64");

const server = new Server(
  {
    name: "firecrawl-oneding-stealth",
    version: "2.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "firecrawl_scrape",
        description: "Scrape a single URL and convert it to clean Markdown.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "The URL to scrape" },
          },
          required: ["url"],
        },
      },
      {
        name: "firecrawl_map",
        description: "Generate a list of URLs from a website (sitemap discovery).",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "The base URL/domain to map" },
          },
          required: ["url"],
        },
      },
      {
        name: "firecrawl_crawl",
        description: "Start an asynchronous recursive crawl of a website.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "The base URL to start crawling from" },
            limit: { type: "number", description: "Max number of pages to crawl (default: 10)" },
            maxDepth: { type: "number", description: "Max depth of recursion (default: 2)" },
          },
          required: ["url"],
        },
      },
      {
        name: "firecrawl_get_job",
        description: "Check the status and results of a crawl job using jobId.",
        inputSchema: {
          type: "object",
          properties: {
            jobId: { type: "string", description: "The jobId returned by firecrawl_crawl" },
          },
          required: ["jobId"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const headers = {
    Authorization: `Basic ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    switch (request.params.name) {
      case "firecrawl_scrape": {
        const { url } = request.params.arguments as { url: string };
        const response = await axios.post(`${BASE_URL}/v1/scrape`, { url }, { headers });
        return { content: [{ type: "text", text: response.data.success ? response.data.data.markdown : "Error: " + JSON.stringify(response.data) }] };
      }

      case "firecrawl_map": {
        const { url } = request.params.arguments as { url: string };
        const response = await axios.post(`${BASE_URL}/v1/map`, { url }, { headers });
        return { content: [{ type: "text", text: response.data.success ? JSON.stringify(response.data.links || response.data.data, null, 2) : "Error: " + JSON.stringify(response.data) }] };
      }

      case "firecrawl_crawl": {
        const { url, limit = 10, maxDepth = 2 } = request.params.arguments as { url: string, limit?: number, maxDepth?: number };
        const response = await axios.post(`${BASE_URL}/v1/crawl`, { url, limit, maxDepth }, { headers });
        return { content: [{ type: "text", text: response.data.success ? `Crawl started. JobId: ${response.data.id || response.data.jobId}` : "Error: " + JSON.stringify(response.data) }] };
      }

      case "firecrawl_get_job": {
        const { jobId } = request.params.arguments as { jobId: string };
        const response = await axios.get(`${BASE_URL}/v1/crawl/${jobId}`, { headers });
        return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
      }

      default:
        throw new Error("Tool not found");
    }
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `API Error (${error.response?.status || 'Unknown'}): ${error.response?.data?.error || error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
