import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTables() {
  try {
    // Create businesses table
    const { error: createBusinessError } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);

    if (createBusinessError && createBusinessError.code === '42P01') {
      const { error: businessError } = await supabase
        .from('rest')
        .rpc('pg', {
          sql: `
            CREATE TABLE IF NOT EXISTS businesses (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name VARCHAR NOT NULL,
              email VARCHAR NOT NULL UNIQUE,
              status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
            );
          `
        });

      if (businessError) {
        console.error('Error creating businesses table:', businessError);
        return;
      }
      console.log('Businesses table created successfully');
    }

    // Create agents table once businesses table exists
    const { error: checkAgentsError } = await supabase
      .from('agents')
      .select('*')
      .limit(1);

    if (checkAgentsError && checkAgentsError.code === '42P01') {
      const { error: agentsError } = await supabase
        .from('rest')
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
          `
        });      if (agentsError) {
        console.error('Error creating agents table:', agentsError);
        return;
      }
      console.log('Agents table created successfully');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

createTables();
