'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2, Check, X, Info, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
            router.push('/login');
        } else {
            fetchUsers();
        }
    }, [currentUser, authLoading, router]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter((u) => u._id !== id));
            } catch (error) {
                console.error(error);
                alert('Failed to delete user');
            }
        }
    };

    const createUserHandler = async () => {
        if (window.confirm('Create a new user?')) {
            try {
                const { data: createdUser } = await api.post('/users/create');
                router.push(`/admin/users/${createdUser._id}/edit`);
            } catch (error) {
                console.error(error);
                alert('Failed to create user');
            }
        }
    };

    if (loading || authLoading) return <div className="text-center py-20 text-white">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Users</h1>
                <button
                    onClick={createUserHandler}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition transform active:scale-95 shadow-lg"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add User
                </button>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-4 bg-black/50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
                                ID
                            </th>
                            <th className="px-5 py-4 bg-black/50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
                                Name
                            </th>
                            <th className="px-5 py-4 bg-black/50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
                                Email
                            </th>
                            <th className="px-5 py-4 bg-black/50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
                                Admin
                            </th>
                            <th className="px-5 py-4 bg-black/50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-white/5 transition">
                                <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">
                                    {user._id.substring(0, 8)}...
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-200 font-medium">
                                    {user.name}
                                </td>
                                <td className="px-5 py-4 text-sm text-gray-400">
                                    <a href={`mailto:${user.email}`} className="hover:text-blue-400">{user.email}</a>
                                </td>
                                <td className="px-5 py-4 text-sm">
                                    {user.isAdmin ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-500" />
                                    )}
                                </td>
                                <td className="px-5 py-4 text-sm">
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={`/admin/users/${user._id}/edit`}
                                            className="text-blue-400 hover:text-blue-300 transition"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(user._id)}
                                            className="text-red-500 hover:text-red-400 transition"
                                            disabled={user.isAdmin} // Prevent deleting self or other admins easily if needed
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                        <Info className="w-10 h-10 mb-2" />
                        <p>No users found.</p>
                    </div>
                )}
            </div>
            <div className="mt-4 text-gray-500 text-sm p-4 bg-black/20 rounded-lg border border-white/5">
                <Info className="w-4 h-4 inline mr-2 text-blue-500" />
                Note: Standard users cannot be promoted to admin here for security, but you can delete them. (Edit page will have verify toggle)
            </div>
        </div>
    );
}
