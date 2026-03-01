'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import HeroBanner from '@/components/HeroBanner';
import IntroSection from '@/components/IntroSection';
import CollectionsGrid from '@/components/CollectionsGrid';
import ProductCarousel from '@/components/ProductCarousel';
import QuoteSection from '@/components/QuoteSection';
import FeaturedCollection from '@/components/FeaturedCollection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FEATURED_TITLE } from '@/lib/constants';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setCarouselLoading(true);
    try {
      const [featRes, latestRes] = await Promise.all([
        api.get('/products?featured=true&limit=10'),
        api.get('/products?limit=10')
      ]);

      const featured = featRes.data.data?.products || [];
      if (featured.length === 0) {
        setCarouselProducts(latestRes.data.data?.products?.slice(0, 8) || []);
      } else {
        setCarouselProducts(featured.slice(0, 10));
      }

    } catch (err) {
      setError("Failed to load products");
    } finally {
      setCarouselLoading(false);
      setLoading(false);
    }
  };

  if (loading && !carouselProducts.length) {
    return (
      <div className="min-h-screen bg-white">
        <HeroBanner />
        <LoadingSpinner size="lg" text="Loading store..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white scroll-smooth flex flex-col gap-0">
      <HeroBanner products={carouselProducts} />

      <ProductCarousel
        products={carouselProducts}
        loading={carouselLoading}
        error={error}
        title="Featured Favorites"
        autoSlideInterval={2500}
      />

      <IntroSection />

      <CollectionsGrid />

      <QuoteSection />

      <FeaturedCollection />

      {/* Instagram/Social placeholder can go here */}
    </div>
  );
}
