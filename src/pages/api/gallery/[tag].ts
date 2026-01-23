export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
    const { tag } = params;
    const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.CLOUDINARY_API_KEY;
    const apiSecret = import.meta.env.CLOUDINARY_API_SECRET;

    if (!tag) {
        return new Response(JSON.stringify({ error: 'Tag is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!cloudName || !apiKey || !apiSecret) {
        return new Response(
            JSON.stringify({ error: 'Server configuration missing Cloudinary credentials' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    try {
        const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${tag}?max_results=30&context=true`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return new Response(JSON.stringify({ resources: [] }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify({ error: `Cloudinary API Error: ${response.statusText}` }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
