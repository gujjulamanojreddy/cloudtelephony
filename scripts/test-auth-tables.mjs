import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTables() {
  try {
    // First, sign in to get authenticated access
    console.log('Signing in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123'
    });

    if (authError) {
      console.error('Authentication error:', authError);
      return;
    }

    console.log('Successfully signed in');

    // Try to insert a business
    console.log('\nTesting business table insert...');
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert([{}])
      .select()
      .single();

    if (businessError) {
      console.error('Business insert error:', businessError);
      return;
    }

    console.log('Business created:', business);

    // Try to insert an agent
    console.log('\nTesting agent table insert...');
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert([{
        name: 'Test Agent',
        email: 'agent.test@example.com',
        status: 'active',
        business_id: business.id
      }])
      .select()
      .single();

    if (agentError) {
      console.error('Agent insert error:', agentError);
      return;
    }

    console.log('Agent created:', agent);

    // Clean up
    console.log('\nCleaning up test data...');
    
    // Delete agent first (due to foreign key)
    await supabase
      .from('agents')
      .delete()
      .eq('id', agent.id);

    // Then delete business
    await supabase
      .from('businesses')
      .delete()
      .eq('id', business.id);

    console.log('Cleanup completed');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

console.log('Starting table tests...\n');
testTables();
