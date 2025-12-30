const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabaseClient');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) throw new Error(error.message);

    // Map for frontend compatibility
    const mappedProducts = products.map(p => ({ ...p, _id: p.id }));

    res.json(mappedProducts);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (product) {
        res.json({ ...product, _id: product.id });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { data: createdProduct, error } = await supabase
        .from('products')
        .insert([{
            name: 'Sample name',
            price: 0,
            user_id: req.user._id,
            image: '/images/sample.jpg',
            brand: 'Sample brand',
            category: 'Sample category',
            count_in_stock: 0,
            num_reviews: 0,
            description: 'Sample description',
            is_featured: false, // Explicitly add
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    res.status(201).json({ ...createdProduct, _id: createdProduct.id });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
        isFeatured,
    } = req.body;

    const { data: updatedProduct, error } = await supabase
        .from('products')
        .update({
            name,
            price,
            description,
            image,
            brand,
            category,
            count_in_stock: countInStock,
            is_featured: isFeatured,
        })
        .eq('id', req.params.id)
        .select()
        .single();

    if (updatedProduct) {
        res.json({ ...updatedProduct, _id: updatedProduct.id });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);

    if (error) {
        res.status(500);
        throw new Error('Product delete failed');
    }

    res.json({ message: 'Product removed' });
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
