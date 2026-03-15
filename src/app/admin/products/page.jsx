'use client';

import { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import api from '@/lib/axios';
import { ADMIN_PRODUCTS_TITLE, CURRENCY_SYMBOL } from '@/lib/constants';

function ProductsContent() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [form, setForm] = useState({
        name: '', description: '', price: '', discountPrice: '', category: '',
        stock: '', isActive: true, isFeatured: false, images: [], videoUrl: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(pagination.page);
    }, [pagination.page]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/admin');
            setCategories(res.data.data || []);
        } catch (err) { /* silent */ }
    };

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/products/admin/all?page=${page}&limit=10`);
            setProducts(res.data.data?.products || []);
            setPagination(res.data.data?.pagination || { page: 1, pages: 1, total: 0 });
        } catch (err) { /* silent */ }
        finally { setLoading(false); }
    };

    const openAdd = () => {
        setEditing(null);
        setForm({
            name: '', description: '', price: '', discountPrice: '', category: categories[0]?._id || '',
            stock: '', isActive: true, isFeatured: false, images: [], videoUrl: '',
        });
        setImageFiles([]);
        setImagePreviews([]);
        setVideoFile(null);
        setModalOpen(true);
    };

    const openEdit = (prod) => {
        setEditing(prod);
        setForm({
            name: prod.name,
            description: prod.description || '',
            price: prod.price,
            discountPrice: prod.discountPrice || '',
            category: prod.category?._id || '',
            stock: prod.stock,
            isActive: prod.isActive,
            isFeatured: prod.isFeatured,
            images: prod.images || [],
            videoUrl: prod.videoUrl || '',
        });
        setImageFiles([]);
        setImagePreviews(prod.images || []);
        setVideoFile(null);
        setModalOpen(true);
    };

    const handleImageFiles = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
        setImagePreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let imageUrls = form.images;
            let videoUrl = form.videoUrl;

            // Upload images if new files selected
            if (imageFiles.length > 0) {
                const fd = new FormData();
                imageFiles.forEach((f) => fd.append('files', f));
                const uploadRes = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                imageUrls = uploadRes.data.data.urls;
            }

            // Upload video if new file selected
            if (videoFile) {
                const fd = new FormData();
                fd.append('files', videoFile);
                const uploadRes = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                videoUrl = uploadRes.data.data.urls[0];
            }

            const payload = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
                category: form.category,
                stock: parseInt(form.stock) || 0,
                isActive: form.isActive,
                isFeatured: form.isFeatured,
                images: imageUrls,
                videoUrl,
            };

            if (editing) {
                await api.put(`/products/${editing._id}`, payload);
            } else {
                await api.post('/products', payload);
            }

            setModalOpen(false);
            fetchProducts(pagination.page);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/products/${deleteTarget._id}`);
            setDeleteTarget(null);
            fetchProducts(pagination.page);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete product');
        }
    };

    if (loading && products.length === 0) return <LoadingSpinner size="lg" text="Loading products..." />;

    return (
        <div className="min-h-screen bg-white py-16 font-['Inter']">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1e2643]/5 pb-12 mb-16 gap-10">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-normal text-[#1e2643] serif leading-tight">
                            {ADMIN_PRODUCTS_TITLE}
                        </h1>
                        <p className="text-[#1e2643]/30 text-[10px] font-black uppercase tracking-[0.4em]">
                            Total {pagination.total} Artifacts in Collection
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="px-10 py-5 bg-[#FEE6A9] text-[#1e2643] text-[11px] font-black uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all duration-500 shadow-xl shadow-[#1e2643]/10 flex items-center justify-center gap-3 w-fit"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Archive New Work
                    </button>
                </div>

                {products.length === 0 ? (
                    <EmptyState title="Collection Empty" description="Begin your journey by archiving your first heritage product." />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-[#1e2643]/10">
                                        <th className="text-left px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em]">Signature</th>
                                        <th className="text-left px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em] hidden md:table-cell">Category</th>
                                        <th className="text-left px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em]">Value</th>
                                        <th className="text-left px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em] hidden sm:table-cell">Inventory</th>
                                        <th className="text-left px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em] hidden sm:table-cell">Gallery Status</th>
                                        <th className="text-right px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e2643]/5">
                                    {products.map((prod) => (
                                        <tr key={prod._id} className="group hover:bg-[#1e2643]/[0.01] transition-colors">
                                            <td className="px-4 py-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-24 overflow-hidden bg-gray-50 shrink-0 border border-[#1e2643]/5 transition-transform group-hover:scale-105 duration-700">
                                                        {prod.images?.[0] ? (
                                                            <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[#1e2643]/10">
                                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[#1e2643] text-lg font-normal serif mb-1">{prod.name}</p>
                                                        {prod.isFeatured && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-[#1e2643] rounded-full" />
                                                                <span className="text-[9px] text-[#1e2643] font-black uppercase tracking-widest">Masterpiece</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-10 hidden md:table-cell">
                                                <span className="text-[#1e2643]/40 text-[10px] font-bold uppercase tracking-widest italic">{prod.category?.name || 'Uncategorized'}</span>
                                            </td>
                                            <td className="px-4 py-10">
                                                <div className="flex flex-col">
                                                    <span className="text-[#1e2643] font-medium serif text-lg">{CURRENCY_SYMBOL}{(prod.discountPrice || prod.price).toLocaleString()}</span>
                                                    {prod.discountPrice && prod.discountPrice < prod.price && (
                                                        <span className="text-[10px] text-[#1e2643]/20 line-through font-bold">{CURRENCY_SYMBOL}{prod.price.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-10 hidden sm:table-cell">
                                                <span className={`text-xs font-bold ${prod.stock > 10 ? 'text-[#1e2643]/40' : 'text-[#1e2643]'}`}>{prod.stock} Units</span>
                                            </td>
                                            <td className="px-4 py-10 hidden sm:table-cell">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${prod.isActive ? 'bg-emerald-500' : 'bg-[#1e2643]/10'}`} />
                                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${prod.isActive ? 'text-[#1e2643]/60' : 'text-[#1e2643]/20'}`}>
                                                        {prod.isActive ? 'Public' : 'Archive'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-10 text-right">
                                                <div className="flex items-center justify-end gap-6">
                                                    <button onClick={() => openEdit(prod)} className="text-[#1e2643]/20 hover:text-[#1e2643] transition-colors" title="Edit">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button onClick={() => setDeleteTarget(prod)} className="text-[#1e2643]/20 hover:text-[#1e2643] transition-colors" title="Remove">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-center gap-12 mt-20 border-t border-[#1e2643]/5 pt-12">
                                <button
                                    disabled={pagination.page <= 1}
                                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                                    className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1e2643]/20 hover:text-[#1e2643] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                <span className="text-[#1e2643]/60 text-xs font-bold serif">
                                    {pagination.page} <span className="text-[#1e2643]/20 mx-2">—</span> {pagination.pages}
                                </span>
                                <button
                                    disabled={pagination.page >= pagination.pages}
                                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                                    className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1e2643]/20 hover:text-[#1e2643] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-[#1e2643]/90 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
                    <div className="relative bg-white max-w-4xl w-full p-12 sm:p-20 max-h-[90vh] overflow-y-auto animate-fadeIn border border-[#1e2643]/5 shadow-2xl">
                        <div className="flex items-center justify-between mb-16">
                            <h2 className="text-4xl font-normal text-[#1e2643] serif">{editing ? 'Edit Archive' : 'New Archive Entry'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-[#1e2643]/20 hover:text-[#1e2643] transition-colors p-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-12">
                                <div className="sm:col-span-2 space-y-4">
                                    <label className="block text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">Signature Name</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                        className="w-full bg-transparent border-b border-[#1e2643]/10 py-4 text-2xl font-normal text-[#1e2643] serif placeholder-[#1e2643]/10 focus:outline-none focus:border-[#1e2643] transition-colors" placeholder="Hand-Blocked Silk Saree..." />
                                </div>
                                <div className="sm:col-span-2 space-y-4">
                                    <label className="block text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">Artisan's Narrative</label>
                                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                                        className="w-full bg-transparent border-b border-[#1e2643]/10 py-4 text-base font-normal text-[#1e2643] placeholder-[#1e2643]/20 focus:outline-none focus:border-[#1e2643] transition-colors resize-none leading-relaxed" placeholder="Describe the heritage and craftsmanship..." />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">Luxury Value (Price)</label>
                                    <div className="relative border-b border-[#1e2643]/10">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl serif text-[#1e2643]/20">{CURRENCY_SYMBOL}</span>
                                        <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                                            className="w-full bg-transparent pl-8 py-4 text-2xl font-normal text-[#1e2643] serif focus:outline-none" placeholder="0" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">Curation Type (Category)</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                                        className="w-full bg-transparent border-b border-[#1e2643]/10 py-5 text-sm font-bold text-[#1e2643] focus:outline-none focus:border-[#1e2643] transition-colors appearance-none cursor-pointer">
                                        <option value="">Select Curation</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">Units in Stock</label>
                                    <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required
                                        className="w-full bg-transparent border-b border-[#1e2643]/10 py-4 text-xl font-normal text-[#1e2643] serif focus:outline-none focus:border-[#1e2643]" placeholder="0" />
                                </div>
                                <div className="sm:col-span-2 space-y-6 pt-6">
                                    <label className="block text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">Visual Documentation</label>
                                    <div className="relative group/upload border-2 border-dashed border-[#1e2643]/10 hover:border-[#1e2643]/20 transition-all p-12 text-center bg-[#1e2643]/[0.01]">
                                        <input type="file" accept="image/*" multiple onChange={handleImageFiles}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        <div className="space-y-4">
                                            <svg className="w-10 h-10 text-[#1e2643]/10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p className="text-[10px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em]">Upload Gallery Images</p>
                                        </div>
                                    </div>
                                    {imagePreviews.length > 0 && (
                                        <div className="flex gap-6 mt-8 flex-wrap">
                                            {imagePreviews.map((src, i) => (
                                                <div key={i} className="w-32 h-40 group relative overflow-hidden border border-[#1e2643]/5">
                                                    <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-12 py-10 border-t border-[#1e2643]/5">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative w-6 h-6">
                                        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                        <div className={`w-full h-full border-2 transition-all ${form.isActive ? 'bg-[#1e2643] border-[#1e2643]' : 'bg-transparent border-[#1e2643]/20'}`}>
                                            {form.isActive && <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-[#1e2643] uppercase tracking-[0.2em]">Public Archive</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative w-6 h-6">
                                        <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                        <div className={`w-full h-full border-2 transition-all ${form.isFeatured ? 'bg-[#1e2643] border-[#1e2643]' : 'bg-transparent border-[#1e2643]/20'}`}>
                                            {form.isFeatured && <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-[#1e2643] uppercase tracking-[0.2em]">Curated Spotlight</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-12 pt-10">
                                <button type="button" onClick={() => setModalOpen(false)} className="text-[11px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em] hover:text-[#1e2643] transition-colors">Discard</button>
                                <button type="submit" disabled={saving} className="px-16 py-6 bg-[#1e2643] text-white text-[11px] font-black uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all duration-500 shadow-2xl">
                                    {saving ? 'Curation in Progress...' : editing ? 'Commit Changes' : 'Publish Masterpiece'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            <ConfirmDialog
                open={!!deleteTarget}
                title="Deaccession Artifact"
                message={`Are you absolutely certain you want to remove "${deleteTarget?.name}" from the collection? This cannot be reversed.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}

export default function AdminProductsPage() {
    return (
        <AdminRoute>
            <ProductsContent />
        </AdminRoute>
    );
}
