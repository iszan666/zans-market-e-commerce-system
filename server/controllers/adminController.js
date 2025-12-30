const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabaseClient');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    // Parallel optimized fetching using { count: 'exact', head: true } for products, orders, and users
    // For revenue, we fetch just the total_price column of paid orders
    const [
        { count: productCount, error: pError },
        { count: orderCount, error: oError },
        { count: userCount, error: uError },
        { data: revenueData, error: rError }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price').eq('is_paid', true)
    ]);

    if (pError) throw new Error(pError.message);
    if (oError) throw new Error(oError.message);
    if (uError) throw new Error(uError.message);
    if (rError) throw new Error(rError.message);

    const totalRevenue = revenueData.reduce((acc, item) => acc + Number(item.total_price || 0), 0);

    res.json({
        products: productCount,
        orders: orderCount,
        users: userCount,
        revenue: totalRevenue.toFixed(2)
    });
});

module.exports = { getAdminStats };
