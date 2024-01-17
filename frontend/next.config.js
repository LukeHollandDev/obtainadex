/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.serebii.net',
                port: '',
                pathname: '/**',
            }
        ]
    }
}

module.exports = nextConfig
