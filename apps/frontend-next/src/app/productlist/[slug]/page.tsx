// Dynamic route for pagination: /productlist/page-N
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sort?: string;
  };
}

export default function ProductListDynamicPage({ params, searchParams }: PageProps) {
  const router = useRouter();
  
  useEffect(() => {
    // Parse page number from slug (e.g., "page-3" -> 3)
    const match = params.slug.match(/^page-(\d+)$/);
    
    if (!match) {
      router.replace('/productlist');
      return;
    }
    
    const pageNum = parseInt(match[1], 10);
    
    if (pageNum < 1 || isNaN(pageNum)) {
      router.replace('/productlist');
      return;
    }
    
    // Build query params
    const queryParams = new URLSearchParams();
    queryParams.set('page', pageNum.toString());
    if (searchParams.sort) {
      queryParams.set('sort', searchParams.sort);
    }
    
    router.replace(`/productlist?${queryParams.toString()}`);
  }, [params.slug, searchParams, router]);
  
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Redirecting...</span>
      </div>
    </div>
  );
}

