import { createClient } from '@supabase/supabase-js';

// Kita kasih "jalan pintas" dan URL palsu sementara biar Next.js nggak bawel pas lagi di-build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://bypass.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || 'bypass-key-sementara';

export const supabase = createClient(supabaseUrl, supabaseKey);
