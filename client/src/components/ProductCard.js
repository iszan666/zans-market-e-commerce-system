import Link from 'next/link';
import { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleQuickAdd = (e) => {
        e.preventDefault(); // Prevent navigation
        if (product.countInStock > 0 || (product.count_in_stock > 0)) { // Handle both camelCase and snake_case
            addToCart(product, 1);
        }
    };

    // Handle snake_case vs camelCase data inconsistencies if any
    const countInStock = product.countInStock ?? product.count_in_stock ?? 0;
    const numReviews = product.numReviews ?? product.num_reviews ?? 0;
    const [imgSrc, setImgSrc] = useState(product.image);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
                scale: 1.03,
                boxShadow: "0px 20px 40px rgba(59, 130, 246, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 transition-colors duration-300 flex flex-col h-full"
        >
            <Link href={`/product/${product._id}`} className="block relative overflow-hidden aspect-[4/3]">
                <motion.img
                    src={imgSrc || '/images/sample.jpg'}
                    alt={product.name}
                    onError={() => setImgSrc('/images/sample.jpg')}
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    className="w-full h-full object-cover"
                />
                {countInStock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] z-10">
                        <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">Out of Stock</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <Link href={`/product/${product._id}`} className="hover:text-blue-400 transition-colors">
                    <h2 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2 leading-tight">
                        {product.name}
                    </h2>
                </Link>

                <div className="flex items-center mb-3 space-x-2">
                    <div className="flex text-yellow-500 space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-700'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                        ({numReviews} reviews)
                    </span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Price</span>
                        <span className="text-xl font-bold text-white">${product.price}</span>
                    </div>

                    <motion.button
                        onClick={handleQuickAdd}
                        disabled={countInStock === 0}
                        whileHover={countInStock > 0 ? { scale: 1.2, backgroundColor: "#3b82f6", color: "#fff" } : {}}
                        whileTap={countInStock > 0 ? { scale: 0.9 } : {}}
                        className={`p-2.5 rounded-full transition-colors ${countInStock > 0
                            ? 'bg-white text-black'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
