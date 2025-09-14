// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*', // This is the endpoint you want to use in the frontend
          destination: 'http://localhost:3011/:path*', // The full API URL
        },
      ];
    },
  };
  