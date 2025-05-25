/**
 * 参考:
 * https://modelcontextprotocol.io/quickstart/server#node
 * https://nominatim.org/release-docs/latest/api/Reverse/
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { getAddress } from "./reverse_geocoding.js"

/**
 * 逆ジオコーディングAPIを使用して、指定された緯度と経度から住所を取得するMCPサーバーを作成します。
 */
const revGeocodingServer = new McpServer({
  name: "my-reverse-geocoding-app",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
})

revGeocodingServer.tool(
  "execute-reverse-geocoding",
  "緯度経度から逆ジオコーディングを実行し、住所を取得します。",
  {
    latitude: z.number().min(-90).max(90).describe("緯度"),
    longitude: z.number().min(-180).max(180).describe("経度"),
  },
  async ({ latitude, longitude }) => {
    const address = await getAddress({ latitude, longitude })

    if (Object.values(address).length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `住所が見つかりませんでした。:緯度=${latitude}, 経度=${longitude}`
          }
        ]
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(address)
        }
      ]
    }
  }
)

async function main() {
  const transport = new StdioServerTransport()
  await revGeocodingServer.connect(transport)
  console.error("MCP Server running on stdio")
}

main().catch((error) => {
  console.error("Error starting MCP server:", error)
  process.exit(1)
})
