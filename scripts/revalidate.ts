/**
 * Simple helper script to trigger the `/api/revalidate` endpoint.
 *
 * Usage examples:
 *   NEXT_REVALIDATE_TOKEN=secret pnpm ts-node scripts/revalidate.ts --tags=pokemon-25,pokemon-species-25
 *   BASE_URL=http://localhost:3000 pnpm ts-node scripts/revalidate.ts --paths=/dex/25,/moves/25
 */

const BASE_URL = process.env.REVALIDATE_BASE_URL || "http://localhost:3000";
const TOKEN = process.env.NEXT_REVALIDATE_TOKEN;

type ArgMap = {
  tags: string[];
  paths: string[];
};

function parseArgs(): ArgMap {
  return process.argv.slice(2).reduce(
    (acc, raw) => {
      const [key, value] = raw.split("=");
      if (!key || key === "--tags") {
        return {
          ...acc,
          tags: value ? value.split(",").filter(Boolean) : acc.tags,
        };
      }

      if (key === "--paths") {
        return {
          ...acc,
          paths: value ? value.split(",").filter(Boolean) : acc.paths,
        };
      }

      return acc;
    },
    { tags: [], paths: [] } as ArgMap
  );
}

async function main() {
  const { tags, paths } = parseArgs();

  if (!tags.length && !paths.length) {
    console.error("At least one of --tags or --paths must be provided.");
    process.exit(1);
  }

  const response = await fetch(`${BASE_URL}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: TOKEN,
      tags: tags.length ? tags : undefined,
      paths: paths.length ? paths : undefined,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Failed to revalidate:", payload);
    process.exit(1);
  }

  console.log("Revalidate response:", payload);
}

main().catch((error) => {
  console.error("Revalidate script error:", error);
  process.exit(1);
});
