import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and Anon Key
// Since we can't easily read .env in this simple script without dotenv, 
// we will ask the user to input them or valid if they are set in the environment.
// For now, let's try to read from the env vars if set, or just checking if the module loads.

console.log("Testing Supabase Connection Script...");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables are not set.");
    console.log("Please set them in your terminal before running this script, or create a .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log(`Connecting to Supabase at ${supabaseUrl}...`);
        const { data, error } = await supabase.from('services').select('count', { count: 'exact', head: true });

        if (error) {
            console.error("Supabase Connection Failed:", error.message);
        } else {
            console.log("Supabase Connection Successful!");
            console.log(`Found ${data} rows in 'services' (or query succeeded).`); // count response structure might vary slightly but no error is good.
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }
}

testConnection();
