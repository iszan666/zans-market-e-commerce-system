'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowLeft, ChevronRight, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cartItems, removeFromCart, addToCart, increaseQty, decreaseQty, subtotal } = useCart();
    const router = useRouter();

    const checkoutHandler = () => {
        router.push('/login?redirect=/checkout');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
            </Link>

            <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <ShoppingBag className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Shopping Cart</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-24 bg-[#111] border border-white/10 rounded-3xl shadow-2xl flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-gray-400 text-xl mb-8 font-medium">Your cart is feeling a bit light.</p>
                    <Link href="/" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-500 hover:text-white transition shadow-lg">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <div key={item.product || item._id || index} className="group flex flex-col sm:flex-row items-center bg-[#111] border border-white/10 p-5 rounded-2xl hover:border-white/20 transition shadow-xl relative overflow-hidden">
                                <Link href={`/product/${item.product}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-white/10 group-hover:border-blue-500/30 transition shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition duration-500" />
                                </Link>

                                <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 w-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <Link href={`/product/${item.product}`} className="text-lg font-bold text-white hover:text-blue-400 transition line-clamp-1">
                                            {item.name}
                                        </Link>
                                        <button
                                            onClick={() => removeFromCart(item.product)}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                                            title="Remove Item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between mt-6">
                                        <div className="flex items-center space-x-3 bg-black/40 p-1 rounded-xl border border-white/5">
                                            <button
                                                onClick={() => decreaseQty(item.product)}
                                                disabled={item.qty <= 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-bold text-white">{item.qty}</span>
                                            <button
                                                onClick={() => increaseQty(item.product)}
                                                disabled={item.qty >= (item.countInStock || item.count_in_stock || 10)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-xl font-bold text-white mt-2 sm:mt-0">
                                            <span className="text-blue-500 mr-1 text-sm font-medium">$</span>
                                            {(item.price * item.qty).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 shadow-2xl sticky top-24">
                        <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Order Summary</h2>

                        <div className="space-y-4 mb-8 text-lg font-medium">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span className="text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Taxes & Shipping</span>
                                <span className="text-xs italic">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black text-white border-t border-white/10 pt-6 mt-4">
                                <span>Total</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">${subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={checkoutHandler}
                            disabled={cartItems.length === 0}
                            className="w-full bg-white text-black font-extrabold py-5 rounded-2xl hover:bg-blue-500 hover:text-white transition transform active:scale-95 flex items-center justify-center shadow-xl shadow-blue-500/10 group"
                        >
                            Checkout Now
                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-6 flex items-center justify-center space-x-3 grayscale opacity-30 pointer-events-none">
                            <div className="px-2 py-1 border border-white/20 rounded text-[10px] text-white font-bold">VISA</div>
                            <div className="px-2 py-1 border border-white/20 rounded text-[10px] text-white font-bold">MASTER</div>
                            <div className="px-2 py-1 border border-white/20 rounded text-[10px] text-white font-bold">STRIPE</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
