'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function ProductEditPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false); // Placeholder for image upload
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || !user.isAdmin)) {
            router.push('/login');
            return;
        }

        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.count_in_stock || data.countInStock); // handle snake_case from seeding if raw
                setDescription(data.description);
            } catch (error) {
                console.error(error);
                alert('Connection error');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id, user, authLoading, router]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await api.post('/upload', formData, config);
            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Image upload failed');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${id}`, {
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
            });
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
            alert('Update failed');
        }
    };

    if (loading || authLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/products" className="flex items-center text-gray-500 hover:text-black mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Go Back
            </Link>

            <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

            <form onSubmit={submitHandler} className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                    <input
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter image url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <label className="bg-gray-800 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-700 whitespace-nowrap flex items-center">
                            {uploading ? 'Uploading...' : 'Upload File'}
                            <input type="file" className="hidden" onChange={uploadFileHandler} />
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Brand</label>
                    <input
                        type="text"
                        placeholder="Enter brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                    <input
                        type="text"
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Count In Stock</label>
                    <input
                        type="number"
                        placeholder="Enter stock"
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                    ></textarea>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" /> Update Product
                    </button>
                </div>
            </form>
        </div>
    );
}
