/**
 * 参考:
 * https://modelcontextprotocol.io/quickstart/server#node
 * https://nominatim.org/release-docs/latest/api/Reverse/
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const REV_GEOCODING_BASE = "https://nominatim.openstreetmap.org/reverse"
const USER_AGENT = "my-reverse-geocoding-app/1.0"

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

async function doRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
  }

  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return (await response.json()) as T
  } catch (error) {
    console.error(`HTTP request error:${error}`)
    throw error
  }
}

interface AddressResponse {
  properties: {
    address: Record<string, string>
  }
}

const getAddress = async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    const pointsUrl = `${REV_GEOCODING_BASE}?lat=${latitude.toFixed(4)}&lon=${longitude.toFixed(4)}&format=json`
    const addressData = await doRequest<AddressResponse>(pointsUrl)

    return addressData
}

revGeocodingServer.tool(
  "execute-reverse-geocoding",
  "緯度経度から逆ジオコーディングを実行し、住所を取得します。",
  {
    latitude: z.number().min(-90).max(90).describe("緯度"),
    longitude: z.number().min(-180).max(180).describe("経度"),
  },
  async ({ latitude, longitude }) => {
    const pointsData = await getAddress({ latitude, longitude })

    if (!pointsData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
          },
        ],
      }
    }

    const address = pointsData.properties?.address || {}
    if (Object.values(address).length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "住所が見つかりませんでした。",
          },
        ],
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(address),
        },
      ],
    }
  }
)

async function main() {
  const transport = new StdioServerTransport()
  await revGeocodingServer.connect(transport)
  console.error("MCP Server running on stdio")
}

try {
  await main()
} catch (error) {
  console.error("Error starting MCP server:", error)
  process.exit(1)
}
