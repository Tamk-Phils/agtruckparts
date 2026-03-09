import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agtruckparts.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/login', '/checkout'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
