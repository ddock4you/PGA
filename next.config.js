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
};

module.exports = nextConfig;
