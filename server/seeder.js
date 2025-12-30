const dotenv = require('dotenv');
const users = require('./data/users');
const products = require('./data/products');
const supabase = require('./config/supabaseClient');
const bcrypt = require('bcryptjs');

dotenv.config();

const importData = async () => {
    try {
        // Clear existing
        await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all allowing for empty uuid
        // Or simpler, if no foreign key cascade issues yet:
        await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        console.log('Old Data Cleared');

        // Insert Users
        const usersWithHashedPasswords = users.map(user => {
            // Re-hash here? The data file has it hashed but let's assume raw or matching
            // Ideally we shouldn't re-hash if already hashed in data file.
            // data/users.js creates them with bcrypt.hashSync, so they are ready.
            return {
                name: user.name,
                email: user.email,
                password: user.password,
                is_admin: user.isAdmin
            }
        });

        const { data: createdUsers, error: userError } = await supabase
            .from('users')
            .insert(usersWithHashedPasswords)
            .select();

        if (userError) throw userError;

        const adminUser = createdUsers[0].id;

        const sampleProducts = products.map((product) => {
            return {
                user_id: adminUser,
                name: product.name,
                image: product.image,
                brand: product.brand,
                category: product.category,
                description: product.description,
                price: product.price,
                rating: product.rating,
                num_reviews: product.numReviews,
                count_in_stock: product.countInStock,
            };
        });

        const { error: productError } = await supabase
            .from('products')
            .insert(sampleProducts);

        if (productError) throw productError;

        console.log('Data Imported Sucessfully!');
        process.exit();
    } catch (error) {
        console.error(`${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        // Naive delete all
        await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
