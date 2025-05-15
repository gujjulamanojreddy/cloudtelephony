import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixAgentsTable() {
  try {
    console.log('Fixing agents table...');

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20250515000004_fix_agents_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute each statement separately
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (!statement.trim()) continue;
      
      const { error } = await supabase
        .from('rest')
        .select()
        .limit(1)
        .single()
        .or(`sql.eq.${encodeURIComponent(statement)}`);

      if (error) {
        console.error('Error executing statement:', error);
        console.log('Failed statement:', statement);
      }
    }

    console.log('Table fix completed');

    // Verify the fix
    const { data, error } = await supabase
      .from('agents')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error verifying table:', error);
    } else {
      console.log('Table verification successful');
    }

  } catch (err) {
    console.error('Error fixing agents table:', err);
  }
}

fixAgentsTable();
