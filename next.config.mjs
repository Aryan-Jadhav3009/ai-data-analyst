const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: "http://54.243.210.131:8000/api/:path*/",
      },
    ];
  },
};

export default nextConfig;