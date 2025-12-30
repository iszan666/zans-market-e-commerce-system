const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabaseClient');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    res.json({
        _id: authData.user.id,
        name: profile?.name,
        email: authData.user.email,
        isAdmin: profile?.role === 'admin',
        token: generateToken(authData.user.id),
    });
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    });

    if (authError) {
        res.status(400);
        throw new Error(authError.message);
    }

    res.status(201).json({
        _id: authData.user.id,
        name: name,
        email: authData.user.email,
        isAdmin: false,
        token: generateToken(authData.user.id),
    });
});

// @desc    Create a user
// @route   POST /api/users/create
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: password || '123456',
        options: {
            data: { name }
        }
    });

    if (authError) {
        res.status(400);
        throw new Error(authError.message);
    }

    // Update role if admin
    if (isAdmin) {
        await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', authData.user.id);
    }

    res.status(201).json({
        _id: authData.user.id,
        name,
        email,
        isAdmin: !!isAdmin,
    });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const { data: user, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', req.user._id)
        .single();

    if (error) {
        console.error('Supabase error fetching profile:', error);
    }

    if (user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.role === 'admin',
        });
    } else {
        res.status(401); // 401 is better for "User not found with this token"
        throw new Error('User profile not found. Please log in again.');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const { data: users, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, created_at');

    if (error) {
        res.status(500);
        throw new Error('Failed to fetch users');
    }

    res.json(users.map(u => ({ ...u, _id: u.id, name: u.name, isAdmin: u.role === 'admin' })));
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', req.params.id);

    if (error) {
        res.status(500);
        throw new Error('User delete failed');
    }

    res.json({ message: 'User removed' });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const { data: user, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', req.params.id)
        .single();

    if (user) {
        res.json({ ...user, _id: user.id, isAdmin: user.role === 'admin' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const { name, email, isAdmin } = req.body;

    const { data: updatedUser, error } = await supabase
        .from('profiles')
        .update({
            name,
            email,
            role: isAdmin ? 'admin' : 'user',
        })
        .eq('id', req.params.id)
        .select()
        .single();

    if (updatedUser) {
        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.role === 'admin',
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    createUser,
};
