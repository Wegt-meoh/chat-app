/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "platform-lookaside.fbsbx.com",
            },
        ],
    },
};

module.exports = nextConfig;
