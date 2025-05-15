import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyTables() {
  try {
    // First, verify businesses table exists
    console.log('Testing businesses table...');
    const { data: business, error: businessError } = await supabase
      .from('businesses')      .insert({
        name: 'Test Business',
        email: 'test@example.com',
        status: 'active'
      })
      .select()
      .single();

    if (businessError) {
      console.error('Error inserting into businesses table:', businessError.message);
      return;
    }

    console.log('Successfully created test business:', business.id);

    // Now verify agents table with the real business ID
    console.log('Testing agents table...');
    const { error: agentError } = await supabase
      .from('agents')
      .insert({
        name: 'Test Agent',
        email: 'test.agent@example.com',
        status: 'active',
        business_id: business.id
      });

    if (agentError) {
      console.error('Error inserting into agents table:', agentError.message);
      return;
    }

    console.log('Successfully created test agent');

    // Clean up test data
    console.log('Cleaning up test data...');
    
    // Delete agent first due to foreign key constraint
    const { error: deleteAgentError } = await supabase
      .from('agents')
      .delete()
      .eq('email', 'test.agent@example.com');

    if (deleteAgentError) {
      console.error('Error deleting test agent:', deleteAgentError.message);
    }

    const { error: deleteBusinessError } = await supabase
      .from('businesses')
      .delete()
      .eq('email', 'test@example.com');

    if (deleteBusinessError) {
      console.error('Error deleting test business:', deleteBusinessError.message);
    }

    console.log('Tables verified successfully!');

  } catch (error) {
    console.error('Error:', error);
  }
}

verifyTables();
