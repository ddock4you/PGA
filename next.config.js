/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["raw.githubusercontent.com", "assets.pokemon.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/pokeapi/:path*",
        destination: "https://pokeapi.co/api/v2/:path*",
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      use: "raw-loader",
    });
    return config;
  },
  turbopack: {
    rules: {
      "*.csv": {
        loaders: ["raw-loader"],
        as: "*.ts",
      },
    },
  },
};

module.exports = nextConfig;
