import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupPolicies() {
  try {
    // Add required columns to businesses table
    const { error: alterError } = await supabase
      .from('businesses')
      .select('id')
      .limit(1)
      .then(async () => {
        const { error } = await supabase.rpc('pg', {
          sql: `
            -- Add required columns to businesses table
            ALTER TABLE businesses 
            ADD COLUMN IF NOT EXISTS name VARCHAR NOT NULL DEFAULT 'New Business',
            ADD COLUMN IF NOT EXISTS email VARCHAR UNIQUE,
            ADD COLUMN IF NOT EXISTS status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active';

            -- Create RLS policies for businesses
            ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
            DROP POLICY IF EXISTS "Enable insert for authenticated users" ON businesses;
            CREATE POLICY "Enable insert for authenticated users" 
              ON businesses FOR ALL 
              USING (true)
              WITH CHECK (true);

            -- Create RLS policies for agents
            ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
            DROP POLICY IF EXISTS "Enable all for authenticated users" ON agents;
            CREATE POLICY "Enable all for authenticated users" 
              ON agents FOR ALL 
              USING (true)
              WITH CHECK (true);
          `
        });
        return { error };
      });

    if (alterError) {
      console.error('Error setting up policies:', alterError);
      return;
    }

    console.log('✓ Table structure and policies updated successfully');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

setupPolicies();
