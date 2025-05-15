import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    const { error } = await supabase.rpc('execute_sql', { sql });
    
    if (error) {
      console.error(`Error executing ${path.basename(filePath)}:`, error);
      throw error;
    }
    
    console.log(`Successfully executed ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`Failed to run migration ${path.basename(filePath)}:`, err);
    throw err;
  }
}

async function runMigrations() {
  try {
    // Run business table migration
    await runMigration('supabase/migrations/20250515000000_add_businesses_table.sql');
    
    // Run agents table migration
    await runMigration('supabase/migrations/20250515000001_add_agents_table.sql');
    
    console.log('All migrations completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
