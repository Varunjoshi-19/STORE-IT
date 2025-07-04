import type { NextConfig } from "next";

const nextConfig: NextConfig = {

 typescript : {
   ignoreBuildErrors : true,
 },
 eslint : {
   ignoreDuringBuilds : true
 },

  experimental : {
     serverActions : {
       bodySizeLimit : "100MB",
     }
  },

  images: {
    domains: ['cdn-icons-png.flaticon.com'],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com'
      },

      {
        protocol: 'https',
        hostname: 'img.freepik.com'
      },

      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io'
      },

      {
         protocol :'https',
         hostname : 'fra.cloud.appwrite.io'
      }
    ]
  }
};

export default nextConfig;
