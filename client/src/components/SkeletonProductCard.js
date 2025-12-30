import React from 'react';

const SkeletonProductCard = () => {
    return (
        <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 flex flex-col h-full animate-pulse">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/3] bg-white/5"></div>

            <div className="p-5 flex flex-col flex-grow space-y-4">
                {/* Title Placeholders */}
                <div className="space-y-2">
                    <div className="h-5 bg-white/10 rounded-md w-3/4"></div>
                    <div className="h-5 bg-white/10 rounded-md w-1/2"></div>
                </div>

                {/* Rating Placeholder */}
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-3.5 h-3.5 bg-white/5 rounded-full"></div>
                        ))}
                    </div>
                    <div className="h-3 bg-white/5 rounded w-16"></div>
                </div>

                {/* Footer Placeholder */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex flex-col space-y-2">
                        <div className="h-3 bg-white/5 rounded w-10"></div>
                        <div className="h-6 bg-white/10 rounded w-16"></div>
                    </div>

                    {/* Button Placeholder */}
                    <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonProductCard;
