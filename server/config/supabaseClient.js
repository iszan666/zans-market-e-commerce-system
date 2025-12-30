const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY', {
        urlFound: !!supabaseUrl,
        keyFound: !!supabaseKey,
        urlStart: supabaseUrl ? supabaseUrl.substring(0, 8) : 'N/A',
        keyStart: supabaseKey ? supabaseKey.substring(0, 8) : 'N/A'
    });
    throw new Error('Supabase credentials missing');
}

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
    console.error('Error: You have not updated the .env file with your actual Supabase credentials.');
    process.exit(1);
}

if (!supabaseUrl.startsWith('https://')) {
    console.error('Error: SUPABASE_URL must start with https://');
    process.exit(1);
}

let supabase;
try {
    supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
    console.error('Error initializing Supabase client:', error.message);
    throw error;
}

module.exports = supabase;
