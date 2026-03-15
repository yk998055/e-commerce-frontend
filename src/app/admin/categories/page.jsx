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
        <div className="min-h-screen bg-white py-16 font-['Inter']">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1e2643]/5 pb-12 mb-16 gap-10">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-normal text-[#1e2643] serif leading-tight">
                            {ADMIN_CATEGORIES_TITLE}
                        </h1>
                        <p className="text-[#1e2643]/30 text-[10px] font-black uppercase tracking-[0.4em]">
                            Curate Your Heritage Collections
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="px-10 py-5 bg-[#FEE6A9] text-[#1e2643] text-[11px] font-black uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all duration-500 shadow-xl shadow-[#1e2643]/10 flex items-center justify-center gap-3 w-fit"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Archive New Collective
                    </button>
                </div>

                {categories.length === 0 ? (
                    <EmptyState title="No collectives found" description="Begin your curation by creating your first heritage category." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-[#1e2643]/10">
                                    <th className="text-left px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em]">Signature</th>
                                    <th className="text-left px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em]">Description</th>
                                    <th className="text-left px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em] hidden sm:table-cell">Slug</th>
                                    <th className="text-left px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em]">Status</th>
                                    <th className="text-right px-4 py-8 text-[9px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2643]/5">
                                {categories.map((cat) => (
                                    <tr key={cat._id} className="group hover:bg-[#FEE6A9]/[0.01] transition-colors">
                                        <td className="px-4 py-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 overflow-hidden bg-gray-50 shrink-0 border border-[#1e2643]/5 transition-transform group-hover:scale-105 duration-700">
                                                    {cat.image ? (
                                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#1e2643]/10">
                                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[#1e2643] text-lg font-normal serif">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-10">
                                            <p className="text-[#1e2643]/40 text-xs truncate max-w-[300px] leading-relaxed italic">{cat.description || 'Legacy description pending...'}</p>
                                        </td>
                                        <td className="px-4 py-10 hidden sm:table-cell">
                                            <span className="text-[10px] font-bold text-[#1e2643]/30 uppercase tracking-widest">{cat.slug}</span>
                                        </td>
                                        <td className="px-4 py-10">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-[#FEE6A9]/10'}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${cat.isActive ? 'text-[#1e2643]/60' : 'text-[#1e2643]/20'}`}>
                                                    {cat.isActive ? 'Live' : 'Hidden'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-10 text-right">
                                            <div className="flex items-center justify-end gap-6">
                                                <button onClick={() => openEdit(cat)} className="text-[#1e2643]/20 hover:text-[#1e2643] transition-colors" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => setDeleteTarget(cat)} className="text-[#1e2643]/20 hover:text-[#1e2643] transition-colors" title="Remove">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-[#FEE6A9]/90 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
                    <div className="relative bg-white max-w-2xl w-full p-12 sm:p-20 max-h-[90vh] overflow-y-auto animate-fadeIn border border-[#1e2643]/5 shadow-2xl">
                        <div className="flex items-center justify-between mb-16">
                            <h2 className="text-4xl font-normal text-[#1e2643] serif">{editing ? 'Edit Collective' : 'New Heritage Collective'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-[#1e2643]/20 hover:text-[#1e2643] transition-colors p-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-12">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">Collective Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full bg-transparent border-b border-[#1e2643]/10 py-4 text-2xl font-normal text-[#1e2643] serif placeholder-[#1e2643]/10 focus:outline-none focus:border-[#1e2643] transition-colors"
                                    placeholder="Silk Textiles..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">Collection Narrative</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={4}
                                    className="w-full bg-transparent border-b border-[#1e2643]/10 py-4 text-base font-normal text-[#1e2643] placeholder-[#1e2643]/20 focus:outline-none focus:border-[#1e2643] transition-colors resize-none leading-relaxed"
                                    placeholder="Describe the essence of this heritage collective..."
                                />
                            </div>
                            <div className="space-y-6 pt-6">
                                <label className="block text-[10px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em]">Feature Documentation (Image)</label>
                                <div className="relative group/upload border-2 border-dashed border-[#1e2643]/10 hover:border-[#1e2643]/20 transition-all p-12 text-center bg-[#FEE6A9]/[0.01]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="space-y-4">
                                        <svg className="w-10 h-10 text-[#1e2643]/10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <p className="text-[10px] font-black text-[#1e2643]/40 uppercase tracking-[0.3em]">Upload Collective Muse</p>
                                    </div>
                                </div>
                                {imagePreview && (
                                    <div className="mt-8 w-32 h-32 overflow-hidden border border-[#1e2643]/5">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-12 py-10 border-t border-[#1e2643]/5">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative w-6 h-6">
                                        <input
                                            type="checkbox"
                                            checked={form.isActive}
                                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <div className={`w-full h-full border-2 transition-all ${form.isActive ? 'bg-[#FEE6A9] border-[#1e2643]' : 'bg-transparent border-[#1e2643]/20'}`}>
                                            {form.isActive && <svg className="w-4 h-4 text-[#1e2643] mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-[#1e2643] uppercase tracking-[0.2em]">Exhibition Live</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-12 pt-10">
                                <button type="button" onClick={() => setModalOpen(false)} className="text-[11px] font-black text-[#1e2643]/30 uppercase tracking-[0.3em] hover:text-[#1e2643] transition-colors">Discard</button>
                                <button type="submit" disabled={saving} className="px-16 py-6 bg-[#FEE6A9] text-[#1e2643] text-[11px] font-black uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all duration-500 shadow-2xl">
                                    {saving ? 'Archiving...' : editing ? 'Commit Changes' : 'Publish Collective'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            <ConfirmDialog
                open={!!deleteTarget}
                title="Deaccession Collective"
                message={`Are you absolutely certain you want to remove the "${deleteTarget?.name}" collective? All associated archives will remain but will lose their muse.`}
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
