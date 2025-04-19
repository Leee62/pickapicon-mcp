import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  getIconByPrefixAndName,
  getIconRepoNames,
  searchIconsByPrefixAndDesc,
} from "./fetcher.js";

/** Create server instance */
const server = new McpServer({
  name: "pickapicon-mcp",
  version: "1.0.0",
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

/** Register tool for getting all icon repo names */
server.tool("get_icon_repos", "get all icon repo NAME", {}, async () => {
  const allRepos = await getIconRepoNames();

  if (!allRepos) {
    return {
      content: [
        {
          type: "text",
          text: "Failed to Get Repo Infos",
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(Object.keys(allRepos)),
      },
    ],
  };
});

/** Register tool for getting icon collection by prefix and desc */
server.tool(
  "get_icons_by_desc_and_prefix",
  "get icons by desc and prefix (LIKE AS ant-design)",
  {
    desc: z.string().describe("desc of icon, only English"),
    prefix: z.string().optional().describe("icon prefix, default env.PREFIX"),
  },
  async ({ desc, prefix = process.env.PREFIX as string }) => {
    const res: { icons: string[] } | null = await searchIconsByPrefixAndDesc(
      prefix,
      desc
    );

    if (!res) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to Get Icon Collection",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            res.icons.map((iconName) => {
              const [_, svgName] = iconName.split(":");
              return svgName;
            })
          ),
        },
      ],
    };
  }
);

/** Register tool for getting svg detail code by prefix and svg name  */
server.tool(
  "get_icon_detail_by_prefix_and_name",
  "get icon detail by prefix and svg name",
  {
    svg_list: z
      .array(z.string())
      .optional()
      .describe("icon svg name list, match batch of icons fuzzily"),
    svg_name: z
      .string()
      .optional()
      .describe("icon svg name, match single icon exactly"),
    prefix: z.string().optional().describe("icon prefix, default env.PREFIX"),
  },
  async ({
    svg_list,
    svg_name = "",
    prefix = process.env.PREFIX as string,
  }) => {
    if (svg_name) {
      const icon = await getIconByPrefixAndName(prefix, svg_name);

      if (!icon) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to Get Icon",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(icon),
          },
        ],
      };
    }

    const icons = await Promise.all(
      (svg_list || []).map((svg_name) =>
        getIconByPrefixAndName(prefix, svg_name)
      )
    );

    if (!icons) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to Get Icon",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(icons),
        },
      ],
    };
  }
);

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
