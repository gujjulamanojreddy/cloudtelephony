import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupTables() {
  try {
    // Try to create businesses table
    const { error: businessError } = await supabase
      .rpc('pg', {
        sql: `
          CREATE TABLE IF NOT EXISTS businesses (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR NOT NULL,
            email VARCHAR UNIQUE,
            phone VARCHAR,
            address TEXT,
            status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
          );

          -- Enable RLS but allow all operations initially
          ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS "Enable all operations for all users" ON businesses;
          CREATE POLICY "Enable all operations for all users" ON businesses FOR ALL USING (true);

          -- Grant necessary permissions
          GRANT ALL ON businesses TO authenticated;
          GRANT ALL ON businesses TO anon;
        `
      });

    if (businessError) {
      console.error('Error creating businesses table:', businessError);
      throw businessError;
    }

    console.log('Businesses table created or already exists');

    // Create agents table after businesses table
    const { error: agentError } = await supabase
      .rpc('pg', {
        sql: `
          CREATE TABLE IF NOT EXISTS agents (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL UNIQUE,
            status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            business_id UUID REFERENCES businesses(id),
            UNIQUE(email)
          );

          -- Enable RLS but allow all operations initially
          ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS "Enable all operations for all users" ON agents;
          CREATE POLICY "Enable all operations for all users" ON agents FOR ALL USING (true);

          -- Grant necessary permissions
          GRANT ALL ON agents TO authenticated;
          GRANT ALL ON agents TO anon;
        `
      });

    if (agentError) {
      console.error('Error creating agents table:', agentError);
      throw agentError;
    }

    console.log('Agents table created or already exists');
    
  } catch (err) {
    console.error('Error setting up tables:', err);
    throw err;
  }
}

setupTables()
  .then(() => {
    console.log('Tables setup completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to set up tables:', err);
    process.exit(1);
  });
