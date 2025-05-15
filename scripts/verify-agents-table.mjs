import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyAgentsTable() {
  try {
    console.log('Verifying agents table structure...');
    
    // First, try to query the agents table
    const { data: queryData, error: queryError } = await supabase
      .from('agents')
      .select('*')
      .limit(1);

    if (queryError) {
      console.error('Error querying agents table:', queryError);
      return;
    }

    console.log('Successfully queried agents table');

    // Try to create a test agent to verify the table is working
    const testAgent = {
      name: 'Test Agent',
      email: 'test@example.com',
      status: 'active',
      business_id: 'BUS001'
    };

    const { data, error: insertError } = await supabase
      .from('agents')
      .insert([testAgent])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting test data:', insertError);
      return;
    }

    console.log('Successfully inserted test agent:', data);

    // Clean up test data
    const { error: deleteError } = await supabase
      .from('agents')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.error('Error cleaning up test data:', deleteError);
    }

  } catch (err) {
    console.error('Error verifying agents table:', err);
  }
}

verifyAgentsTable();
