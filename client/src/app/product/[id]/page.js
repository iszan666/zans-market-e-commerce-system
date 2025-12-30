'use client';

import { useState, useEffect, use } from 'react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

export default function ProductPage({ params }) {
    // Fix for Next.js 15+ async params
    const { id } = use(params);

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                toast.error('Failed to load product details.');
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(product, qty);
        router.push('/cart');
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!product) return <div className="p-10 text-center">Product not found</div>;

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded shadow"
            />
            <div>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="ml-2 text-gray-600">{product.numReviews} reviews</span>
                </div>
                <p className="text-2xl font-bold mb-4">${product.price}</p>
                <p className="border-t border-b py-4 my-4 text-gray-700">{product.description}</p>

                <div className="border p-4 rounded shadow-sm">
                    <div className="flex justify-between mb-2">
                        <span>Price:</span>
                        <span className="font-bold">${product.price}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Status:</span>
                        <span>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
                    </div>

                    {product.countInStock > 0 && (
                        <div className="flex justify-between items-center mb-4">
                            <span>Qty:</span>
                            <select
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                className="border rounded p-1"
                            >
                                {[...Array(product.countInStock).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        onClick={addToCartHandler}
                        disabled={product.countInStock === 0}
                        className={`w-full py-2 rounded font-bold text-white ${product.countInStock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                            }`}
                    >
                        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
