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
        <div className="min-h-screen bg-[#FEE6A1] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-black text-[#1e2643] tracking-tight">{ADMIN_PRODUCTS_TITLE}</h1>
                        <p className="text-[#1e2643]/60 text-sm mt-2 font-bold uppercase tracking-widest">{pagination.total} total products</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="px-6 py-3.5 rounded-2xl bg-[#1e2643] hover:bg-[#1e2643]/90 text-[#FEE6A1] font-black text-sm transition-all shadow-xl shadow-[#1e2643]/10 flex items-center justify-center gap-2 self-center sm:self-auto min-w-[160px]"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </button>
                </div>

                {products.length === 0 ? (
                    <EmptyState title="No products yet" description="Create your first product to get started." />
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-3xl border border-[#1e2643]/10 bg-white/30 backdrop-blur-md shadow-2xl shadow-[#1e2643]/5">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#1e2643]/5 border-b border-[#1e2643]/10">
                                        <th className="text-left px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest">Product</th>
                                        <th className="text-left px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest hidden md:table-cell">Category</th>
                                        <th className="text-left px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest">Price</th>
                                        <th className="text-left px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest hidden sm:table-cell">Stock</th>
                                        <th className="text-left px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest hidden sm:table-cell">Status</th>
                                        <th className="text-right px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e2643]/5">
                                    {products.map((prod) => (
                                        <tr key={prod._id} className="hover:bg-[#1e2643]/5 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1e2643]/5 border border-[#1e2643]/10 shrink-0 shadow-sm">
                                                        {prod.images?.[0] ? (
                                                            <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[#1e2643]/20">
                                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[#1e2643] font-black truncate max-w-[200px]">{prod.name}</p>
                                                        {prod.isFeatured && <span className="text-[10px] text-yellow-600 font-black uppercase tracking-widest">⭐ Featured</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 hidden md:table-cell">
                                                <span className="text-[#1e2643]/60 text-sm font-bold">{prod.category?.name || '—'}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[#1e2643] font-black">{CURRENCY_SYMBOL}{(prod.discountPrice || prod.price).toFixed(2)}</span>
                                                    {prod.discountPrice && prod.discountPrice < prod.price && (
                                                        <span className="text-[10px] text-[#1e2643]/30 line-through font-bold">{CURRENCY_SYMBOL}{prod.price.toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 hidden sm:table-cell">
                                                <span className={`text-sm font-black ${prod.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{prod.stock}</span>
                                            </td>
                                            <td className="px-8 py-5 hidden sm:table-cell">
                                                <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${prod.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-[#1e2643]/5 text-[#1e2643]/40 border border-[#1e2643]/10'}`}>
                                                    {prod.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => openEdit(prod)} className="p-2.5 rounded-xl hover:bg-[#1e2643] text-[#1e2643] hover:text-[#FEE6A1] transition-all shadow-sm hover:shadow-lg" title="Edit">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button onClick={() => setDeleteTarget(prod)} className="p-2.5 rounded-xl hover:bg-rose-500 text-[#1e2643] hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-rose-500/20" title="Delete">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
                            <div className="flex items-center justify-center gap-4 mt-10">
                                <button
                                    disabled={pagination.page <= 1}
                                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                                    className="px-6 py-2.5 rounded-xl bg-[#1e2643] hover:bg-[#1e2643]/90 text-[#FEE6A1] text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1e2643]/10"
                                >
                                    Previous
                                </button>
                                <span className="text-[#1e2643] text-sm font-black px-4 bg-white/30 backdrop-blur-md rounded-lg py-2 border border-[#1e2643]/10">
                                    {pagination.page} / {pagination.pages}
                                </span>
                                <button
                                    disabled={pagination.page >= pagination.pages}
                                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                                    className="px-6 py-2.5 rounded-xl bg-[#1e2643] hover:bg-[#1e2643]/90 text-[#FEE6A1] text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1e2643]/10"
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1e2643]/40 backdrop-blur-md" onClick={() => setModalOpen(false)} />
                    <div className="relative bg-[#FEE6A1] border-4 border-[#1e2643] rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(30,38,67,0.5)] max-w-2xl w-full p-8 sm:p-10 max-h-[90vh] overflow-y-auto animate-fadeIn">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-[#1e2643] tracking-tight">{editing ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl border-2 border-[#1e2643]/10 text-[#1e2643]/40 hover:text-[#1e2643] transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Product Name *</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                        className="w-full px-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643]/30 focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 transition-all font-bold" placeholder="Give your product a name..." />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Full Description</label>
                                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                                        className="w-full px-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643]/30 focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 transition-all font-bold resize-none" placeholder="Describe the amazing features..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Base Price *</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-[#1e2643]/40 text-lg">{CURRENCY_SYMBOL}</span>
                                        <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643]/30 focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 transition-all font-black text-lg" placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Offer Price</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-[#1e2643]/40 text-lg">{CURRENCY_SYMBOL}</span>
                                        <input type="number" step="0.01" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643]/30 focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 transition-all font-black text-lg text-emerald-600" placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Category *</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                                        className="w-full px-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 transition-all font-bold appearance-none cursor-pointer">
                                        <option value="">Select a category</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Stock Level *</label>
                                    <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required
                                        className="w-full px-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643]/30 focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 transition-all font-black text-lg" placeholder="0" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Product Visuals</label>
                                    <div className="relative group/upload">
                                        <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={handleImageFiles}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        <div className="w-full px-5 py-10 rounded-2xl bg-[#1e2643]/5 border-2 border-dashed border-[#1e2643]/20 text-center group-hover/upload:bg-[#1e2643]/10 transition-all">
                                            <svg className="w-10 h-10 text-[#1e2643]/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p className="text-[#1e2643] font-bold">Click to upload images</p>
                                            <p className="text-[#1e2643]/40 text-xs font-semibold mt-1">PNG, JPG or WebP (Max 5 images)</p>
                                        </div>
                                    </div>
                                    {imagePreviews.length > 0 && (
                                        <div className="flex gap-3 mt-4 flex-wrap">
                                            {imagePreviews.map((src, i) => (
                                                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#1e2643]/10 shadow-sm relative">
                                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-8 py-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                        className="w-6 h-6 rounded-lg border-2 border-[#1e2643]/20 bg-white text-[#1e2643] focus:ring-[#1e2643]/10 cursor-pointer" />
                                    <span className="text-sm font-black text-[#1e2643] uppercase tracking-widest group-hover:text-[#1e2643]/80 transition-colors">Active Store</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                        className="w-6 h-6 rounded-lg border-2 border-[#1e2643]/20 bg-white text-[#1e2643] focus:ring-[#1e2643]/10 cursor-pointer" />
                                    <span className="text-sm font-black text-[#1e2643] uppercase tracking-widest group-hover:text-[#1e2643]/80 transition-colors">Showcase Feature</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-[#1e2643]/10">
                                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-4 rounded-2xl bg-[#1e2643]/5 hover:bg-[#1e2643]/10 text-[#1e2643] font-black tracking-widest text-xs uppercase transition-all min-w-[120px]">Close</button>
                                <button type="submit" disabled={saving} className="px-8 py-4 rounded-2xl bg-[#1e2643] hover:bg-[#1e2643]/90 text-[#FEE6A1] font-black tracking-widest text-xs uppercase transition-all shadow-xl shadow-[#1e2643]/10 disabled:opacity-50 min-w-[150px]">
                                    {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
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
