'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Save, UserCheck, Mail, User } from 'lucide-react';

export default function UserEditPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const { user: currentUser, loading: authLoading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
            router.push('/login');
            return;
        }

        const fetchDetails = async () => {
            try {
                const { data } = await api.get(`/users/${id}`);
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
            } catch (error) {
                console.error(error);
                alert('Connection error');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id, currentUser, authLoading, router]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${id}`, {
                name,
                email,
                isAdmin,
            });
            router.push('/admin/users');
        } catch (error) {
            console.error(error);
            alert('Update failed');
        }
    };

    if (loading || authLoading) return <div className="text-center text-white py-20">Loading...</div>;

    return (
        <div className="max-w-xl mx-auto">
            <Link href="/admin/users" className="flex items-center text-gray-400 hover:text-white mb-8 transition">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
            </Link>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-6">Edit User</h1>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-black/30 border border-white/5">
                        <input
                            type="checkbox"
                            id="isAdmin"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        />
                        <label htmlFor="isAdmin" className="text-gray-300 font-medium cursor-pointer flex items-center">
                            Is Admin? <UserCheck className="w-4 h-4 ml-2 text-blue-400" />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition transform active:scale-95 flex items-center justify-center mt-4"
                    >
                        <Save className="w-5 h-5 mr-2" /> Update User
                    </button>
                </form>
            </div>
        </div>
    );
}
