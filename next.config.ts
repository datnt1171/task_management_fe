import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    allowedDevOrigins: ['http://172.22.112.1:3000','http://localhost:3000','192.168.100.218:3000'],
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);