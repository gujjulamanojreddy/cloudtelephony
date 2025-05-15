import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBusinessesTable() {
  try {
    // Try to query the businesses table first to see if it exists
    const { error: queryError } = await supabase
      .from('businesses')
      .select('id')
      .limit(1);

    if (queryError) {
      if (queryError.code === '42P01') { // Table doesn't exist
        // Create the businesses table
        const { error: createError } = await supabase
          .from('rest')
          .select()
          .limit(1)
          .single()
          .or(`sql.eq.${encodeURIComponent(`
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
            ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Enable all operations for all users" ON businesses FOR ALL USING (true);
            GRANT ALL ON businesses TO authenticated;
            GRANT ALL ON businesses TO anon;
          `)}`);

        if (createError) {
          console.error('Error creating businesses table:', createError);
          throw createError;
        }
        console.log('Businesses table created successfully');
      } else {
        console.error('Error querying businesses table:', queryError);
        throw queryError;
      }
    } else {
      console.log('Businesses table already exists');
    }
  } catch (err) {
    console.error('Error in createBusinessesTable:', err);
    throw err;
  }
}

async function createAgentsTable() {
  try {
    // Try to query the agents table first to see if it exists
    const { error: queryError } = await supabase
      .from('agents')
      .select('id')
      .limit(1);

    if (queryError) {
      if (queryError.code === '42P01') { // Table doesn't exist
        // Create the agents table
        const { error: createError } = await supabase
          .from('rest')
          .select()
          .limit(1)
          .single()
          .or(`sql.eq.${encodeURIComponent(`
            CREATE TABLE IF NOT EXISTS agents (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name VARCHAR NOT NULL,
              email VARCHAR NOT NULL UNIQUE,
              status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
              business_id UUID REFERENCES businesses(id),
              UNIQUE(email)
            );
            ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Enable all operations for all users" ON agents FOR ALL USING (true);
            GRANT ALL ON agents TO authenticated;
            GRANT ALL ON agents TO anon;
          `)}`);

        if (createError) {
          console.error('Error creating agents table:', createError);
          throw createError;
        }
        console.log('Agents table created successfully');
      } else {
        console.error('Error querying agents table:', queryError);
        throw queryError;
      }
    } else {
      console.log('Agents table already exists');
    }
  } catch (err) {
    console.error('Error in createAgentsTable:', err);
    throw err;
  }
}

async function setup() {
  try {
    await createBusinessesTable();
    await createAgentsTable();
    console.log('All tables created successfully');
  } catch (err) {
    console.error('Setup failed:', err);
    process.exit(1);
  }
}

setup();
