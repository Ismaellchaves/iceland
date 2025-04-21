
import { createClient } from '@supabase/supabase-js';

// Estas são as credenciais públicas, seguras para uso no frontend
const supabaseUrl = 'https://zffnklkwfkrdtraudbxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZm5rbGt3ZmtyZHRyYXVkYnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2ODEwNTcsImV4cCI6MjAyMTI1NzA1N30.VQMGgQUzn5FSWErV3vgjPspvJpFAFmNfUzshPDsU3gI';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
