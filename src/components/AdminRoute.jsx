'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function AdminRoute({ children }) {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, user, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Verifying Admin Access..." textColor="text-gray-800" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return <>{children}</>;
}
