import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const baseUrl = 'https://shirband.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지 목록
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/metanoia-2026`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/oneness`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/media`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/inquiry`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Supabase에서 동적 페이지 가져오기 (선택적)
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // 동적 페이지가 있다면 여기에 추가
      // 예: 블로그 포스트, 이벤트 등
      // const { data: posts } = await supabase
      //   .from('posts')
      //   .select('id, updated_at')
      //   .order('updated_at', { ascending: false });
      
      // if (posts) {
      //   dynamicPages = posts.map((post) => ({
      //     url: `${baseUrl}/posts/${post.id}`,
      //     lastModified: new Date(post.updated_at),
      //     changeFrequency: 'weekly' as const,
      //     priority: 0.7,
      //   }));
      // }
    }
  } catch (error) {
    // Supabase 연결 실패 시 정적 페이지만 반환
    console.warn('Supabase 연결 실패, 정적 페이지만 포함:', error);
  }

  return [...staticPages, ...dynamicPages];
}

