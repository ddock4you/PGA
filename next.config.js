/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
      {
        protocol: "https",
        hostname: "assets.pokemon.com",
        pathname: "/assets/**",
      },
    ],
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
