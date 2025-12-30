'use client';

import { useState, useEffect, use } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Check, X, Package, Truck, CreditCard, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderPage({ params }) {
    const { id } = use(params);
    const { user: currentUser } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [delivering, setDelivering] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const deliverHandler = async () => {
        setDelivering(true);
        try {
            const { data } = await api.put(`/orders/${id}/deliver`);
            setOrder({ ...order, isDelivered: true, deliveredAt: data.delivered_at });
        } catch (error) {
            console.error(error);
            alert('Failed to mark as delivered');
        } finally {
            setDelivering(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-white flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading Order Details...</p>
    </div>;

    if (!order) return <div className="text-center py-20 text-white">Order not found</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <Link href={currentUser && currentUser.isAdmin ? "/admin/orders" : "/profile"} className="inline-flex items-center text-gray-400 hover:text-white transition group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to {currentUser && currentUser.isAdmin ? "All Orders" : "My Orders"}
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <Package className="w-8 h-8 mr-3 text-blue-500" />
                        Order Details
                    </h1>
                    <p className="text-gray-500 text-sm">ID: {order._id}</p>
                </div>
                <div className="flex gap-3">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {order.isPaid ? `Paid` : 'Unpaid'}
                    </span>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.isDelivered ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                        {order.isDelivered ? `Delivered` : 'Processing'}
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Info sections */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Section */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center mb-4">
                            <Truck className="w-6 h-6 mr-3 text-blue-400" />
                            <h2 className="text-xl font-bold text-white">Shipping</h2>
                        </div>
                        <div className="space-y-3 text-gray-300">
                            <p><span className="text-gray-500 font-medium">Recipient:</span> {order.user.name} ({order.user.email})</p>
                            <p><span className="text-gray-500 font-medium">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                        </div>
                        <div className={`mt-6 p-4 rounded-xl flex items-center ${order.isDelivered ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                            {order.isDelivered ? (
                                <>
                                    <Check className="w-5 h-5 mr-3" />
                                    <span>Delivered on {new Date(order.deliveredAt || order.delivered_at).toLocaleString()}</span>
                                </>
                            ) : (
                                <>
                                    <Truck className="w-5 h-5 mr-3 animate-pulse" />
                                    <span>In Progress • Not yet delivered</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center mb-4">
                            <CreditCard className="w-6 h-6 mr-3 text-purple-400" />
                            <h2 className="text-xl font-bold text-white">Payment Method</h2>
                        </div>
                        <p className="text-gray-300"><span className="text-gray-500 font-medium">Method:</span> {order.paymentMethod}</p>
                        <div className={`mt-6 p-4 rounded-xl flex items-center ${order.isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {order.isPaid ? (
                                <>
                                    <Check className="w-5 h-5 mr-3" />
                                    <span>Paid on {new Date(order.paidAt).toLocaleString()}</span>
                                </>
                            ) : (
                                <>
                                    <X className="w-5 h-5 mr-3" />
                                    <span>Await Payment</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden">
                        <div className="flex items-center mb-6">
                            <ShoppingBag className="w-6 h-6 mr-3 text-pink-400" />
                            <h2 className="text-xl font-bold text-white">Items in Order</h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-4 group">
                                    <div className="flex items-center">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden mr-4 border border-white/10 group-hover:border-blue-500/30 transition">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <Link href={`/product/${item.product || item._id}`} className="text-gray-200 font-medium hover:text-blue-400 transition">
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-gray-500">{item.qty} x ${item.price}</p>
                                        </div>
                                    </div>
                                    <span className="text-white font-bold">${(item.qty * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400">
                                <span>Items</span>
                                <span className="text-white">${order.itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span className="text-white">${order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax</span>
                                <span className="text-white">${order.taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white border-t border-white/10 pt-4 mt-2">
                                <span>Total</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Admin Action */}
                        {currentUser && currentUser.isAdmin && order.isPaid && !order.isDelivered && (
                            <button
                                onClick={deliverHandler}
                                disabled={delivering}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition transform active:scale-95 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30"
                            >
                                {delivering ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <Truck className="w-5 h-5 mr-2" />
                                )}
                                {delivering ? 'Updating Status...' : 'Mark As Delivered'}
                            </button>
                        )}

                        {currentUser && currentUser.isAdmin && !order.isPaid && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                Wait for user to complete payment
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
