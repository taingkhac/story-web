/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mshimyujjjgdlzgypvkl.supabase.co',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
