'use client';

import { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import api from '@/lib/axios';
import { ADMIN_CATEGORIES_TITLE } from '@/lib/constants';

function CategoriesContent() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', image: '', isActive: true });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/admin');
            setCategories(res.data.data || []);
        } catch (err) {
            // fail silently
        } finally {
            setLoading(false);
        }
    };

    const openAdd = () => {
        setEditing(null);
        setForm({ name: '', description: '', image: '', isActive: true });
        setImageFile(null);
        setImagePreview('');
        setModalOpen(true);
    };

    const openEdit = (cat) => {
        setEditing(cat);
        setForm({ name: cat.name, description: cat.description || '', image: cat.image || '', isActive: cat.isActive });
        setImageFile(null);
        setImagePreview(cat.image || '');
        setModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let imageUrl = form.image;

            // Upload image if a new file was selected
            if (imageFile) {
                const fd = new FormData();
                fd.append('files', imageFile);
                const uploadRes = await api.post('/upload', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imageUrl = uploadRes.data.data.urls[0];
            }

            const payload = { ...form, image: imageUrl };

            if (editing) {
                await api.put(`/categories/${editing._id}`, payload);
            } else {
                await api.post('/categories', payload);
            }

            setModalOpen(false);
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/categories/${deleteTarget._id}`);
            setDeleteTarget(null);
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete category');
        }
    };

    if (loading) return <LoadingSpinner size="lg" text="Loading categories..." />;

    return (
        <div className="min-h-screen bg-[#FEE6A1] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-black text-[#1e2643] tracking-tight">{ADMIN_CATEGORIES_TITLE}</h1>
                        <p className="text-[#1e2643]/60 text-sm mt-2 font-bold uppercase tracking-widest">Organize your product collections</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="px-6 py-3.5 rounded-2xl bg-[#1e2643] hover:bg-[#1e2643]/90 text-[#FEE6A1] font-black text-sm transition-all shadow-xl shadow-[#1e2643]/10 flex items-center justify-center gap-2 self-center sm:self-auto min-w-[180px]"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Category
                    </button>
                </div>

                {categories.length === 0 ? (
                    <EmptyState title="No categories yet" description="Create your first category to get started." />
                ) : (
                    <div className="overflow-x-auto rounded-3xl border border-[#1e2643]/10 bg-white/30 backdrop-blur-md shadow-2xl shadow-[#1e2643]/5">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#1e2643]/5 border-b border-[#1e2643]/10">
                                    <th className="text-left px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest">Visual</th>
                                    <th className="text-left px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest">Details</th>
                                    <th className="text-left px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest hidden sm:table-cell">Slug</th>
                                    <th className="text-left px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest">Status</th>
                                    <th className="text-right px-8 py-5 text-xs font-black text-[#1e2643]/40 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2643]/5">
                                {categories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-[#1e2643]/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1e2643]/5 border border-[#1e2643]/10 shadow-sm relative group">
                                                {cat.image ? (
                                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#1e2643]/20">
                                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-[#1e2643] font-black text-lg">{cat.name}</p>
                                            <p className="text-[#1e2643]/50 text-xs font-bold truncate max-w-[250px] mt-0.5">{cat.description || 'No description provided.'}</p>
                                        </td>
                                        <td className="px-8 py-5 hidden sm:table-cell">
                                            <span className="text-[#1e2643]/40 text-xs font-black font-mono bg-[#1e2643]/5 px-2 py-1 rounded-md">{cat.slug}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${cat.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-[#1e2643]/5 text-[#1e2643]/40 border border-[#1e2643]/10'}`}>
                                                {cat.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => openEdit(cat)} className="p-2.5 rounded-xl hover:bg-[#1e2643] text-[#1e2643] hover:text-[#FEE6A1] transition-all shadow-sm hover:shadow-lg" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => setDeleteTarget(cat)} className="p-2.5 rounded-xl hover:bg-rose-500 text-[#1e2643] hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-rose-500/20" title="Delete">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1e2643]/40 backdrop-blur-md" onClick={() => setModalOpen(false)} />
                    <div className="relative bg-[#FEE6A1] border-4 border-[#1e2643] rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(30,38,67,0.5)] max-w-lg w-full p-8 sm:p-10 max-h-[90vh] overflow-y-auto animate-fadeIn">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-[#1e2643] tracking-tight">{editing ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl border-2 border-[#1e2643]/10 text-[#1e2643]/40 hover:text-[#1e2643] transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Category Name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full px-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643]/30 focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 transition-all font-bold"
                                    placeholder="Enter category name..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-5 py-4 rounded-2xl bg-[#1e2643]/5 border border-[#1e2643]/10 text-[#1e2643] placeholder-[#1e2643]/30 focus:outline-none focus:ring-4 focus:ring-[#1e2643]/10 transition-all font-bold resize-none"
                                    placeholder="Brief summary of this category..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-[#1e2643]/40 uppercase tracking-widest mb-3 ml-1">Feature Image</label>
                                <div className="relative group/upload">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full px-5 py-10 rounded-2xl bg-[#1e2643]/5 border-2 border-dashed border-[#1e2643]/20 text-center group-hover/upload:bg-[#1e2643]/10 transition-all">
                                        <svg className="w-10 h-10 text-[#1e2643]/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <p className="text-[#1e2643] font-bold">Upload hero image</p>
                                    </div>
                                </div>
                                {imagePreview && (
                                    <div className="mt-4 w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#1e2643]/10 shadow-sm">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="py-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                        className="w-6 h-6 rounded-lg border-2 border-[#1e2643]/20 bg-white text-[#1e2643] focus:ring-[#1e2643]/10 cursor-pointer"
                                    />
                                    <span className="text-sm font-black text-[#1e2643] uppercase tracking-widest group-hover:text-[#1e2643]/80 transition-colors">Visible to Users</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-[#1e2643]/10">
                                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-4 rounded-2xl bg-[#1e2643]/5 hover:bg-[#1e2643]/10 text-[#1e2643] font-black tracking-widest text-xs uppercase transition-all min-w-[120px]">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="px-8 py-4 rounded-2xl bg-[#1e2643] hover:bg-[#1e2643]/90 text-[#FEE6A1] font-black tracking-widest text-xs uppercase transition-all shadow-xl shadow-[#1e2643]/10 disabled:opacity-50 min-w-[150px]">
                                    {saving ? 'Creating...' : editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}

export default function AdminCategoriesPage() {
    return (
        <AdminRoute>
            <CategoriesContent />
        </AdminRoute>
    );
}
