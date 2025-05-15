import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function applyPolicies() {
  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20250515000003_update_table_policies.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL through the REST API
    const { error } = await supabase
      .from('rest')
      .select()
      .limit(1)
      .single()
      .or(`sql.eq.${encodeURIComponent(sql)}`);

    if (error) throw error;
    
    console.log('Successfully updated policies');

  } catch (error) {
    console.error('Error applying policies:', error);
    process.exit(1);
  }
}

applyPolicies();
