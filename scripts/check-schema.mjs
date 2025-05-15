import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to wait
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function checkTables() {
  try {
    console.log('Waiting for schema cache to update...');
    await wait(2000); // Wait 2 seconds

    // Check businesses table structure
    console.log('\nChecking businesses table structure...');
    const { data: businessesData, error: businessesError } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);

    if (businessesError) {
      console.error('Error accessing businesses table:', businessesError.message);
      return;
    }

    console.log('✓ Businesses table is accessible');
    console.log('Business columns:', Object.keys(businessesData?.[0] || {}));

    // Check agents table structure
    console.log('\nChecking agents table structure...');
    const { data: agentsData, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .limit(1);

    if (agentsError) {
      console.error('Error accessing agents table:', agentsError.message);
      return;
    }

    console.log('✓ Agents table is accessible');
    console.log('Agent columns:', Object.keys(agentsData?.[0] || {}));

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkTables();
