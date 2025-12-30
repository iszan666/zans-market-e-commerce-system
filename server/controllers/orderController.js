const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabaseClient');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // 1. Insert into orders table
        const { data: createdOrder, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: req.user._id,
                items_price: itemsPrice,
                tax_price: taxPrice,
                shipping_price: shippingPrice,
                total_price: totalPrice,
                payment_method: paymentMethod,
                shipping_address: shippingAddress,
                status: 'pending',
                is_paid: false,
                is_delivered: false,
            }])
            .select()
            .single();

        if (orderError) throw new Error(orderError.message);

        // 2. Insert into order_items table (bulk)
        const itemsToInsert = orderItems.map(item => ({
            order_id: createdOrder.id,
            product_id: item.product,
            quantity: item.qty,
            price: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

        if (itemsError) throw new Error(itemsError.message);

        res.status(201).json({
            ...createdOrder,
            _id: createdOrder.id,
            orderItems: orderItems,
        });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const { data: order, error } = await supabase
        .from('orders')
        .select(`
            *,
            profiles(id, name, email),
            order_items(*, products(name, image))
        `)
        .eq('id', req.params.id)
        .single();

    if (order) {
        const normalizedOrder = {
            ...order,
            _id: order.id,
            user: order.profiles,
            orderItems: order.order_items.map(item => ({
                ...item,
                name: item.products.name,
                image: item.products.image,
                product: item.product_id,
                qty: item.quantity // Map to qty for frontend
            })),
            shippingAddress: order.shipping_address,
            paymentMethod: order.payment_method,
            itemsPrice: Number(order.items_price),
            taxPrice: Number(order.tax_price),
            shippingPrice: Number(order.shipping_price),
            totalPrice: Number(order.total_price),
            isPaid: order.is_paid,
            isDelivered: order.is_delivered,
            paidAt: order.paid_at,
            createdAt: order.created_at,
        };

        res.json(normalizedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const { data: updatedOrder, error } = await supabase
        .from('orders')
        .update({
            is_paid: true,
            paid_at: new Date(),
            // Remove payment_result if it's not in schema_v2.sql or store in a separate place
        })
        .eq('id', req.params.id)
        .select()
        .single();

    if (updatedOrder) {
        res.json({ ...updatedOrder, _id: updatedOrder.id });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', req.user._id)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const mappedOrders = orders.map(o => ({
        ...o,
        _id: o.id,
        isPaid: o.is_paid,
        isDelivered: o.is_delivered,
        totalPrice: o.total_price,
        paidAt: o.paid_at,
        createdAt: o.created_at,
    }));

    res.json(mappedOrders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const mappedOrders = orders.map(o => ({
        ...o,
        _id: o.id,
        user: o.profiles,
        isPaid: o.is_paid,
        isDelivered: o.is_delivered,
        totalPrice: o.total_price,
        paidAt: o.paid_at,
        createdAt: o.created_at,
    }));

    res.json(mappedOrders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const { data: updatedOrder, error } = await supabase
        .from('orders')
        .update({
            is_delivered: true,
            delivered_at: new Date(),
            status: 'delivered'
        })
        .eq('id', req.params.id)
        .select()
        .single();

    if (updatedOrder) {
        res.json({ ...updatedOrder, _id: updatedOrder.id });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
};

