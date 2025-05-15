import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWithAuth() {
  try {
    // First sign in
    console.log('Signing in...');
    const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123'
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    console.log('✓ Successfully signed in');

    // Now try to insert a business
    console.log('\nCreating test business...');
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert([{
        // Empty object - all fields should be optional or have defaults
      }])
      .select()
      .single();

    if (businessError) {
      console.error('Business insert error:', businessError);
      return;
    }

    console.log('✓ Business created:', business);

    // Try to insert an agent
    console.log('\nCreating test agent...');
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert([{
        name: 'John Smith',
        email: 'john.smith@test.com',
        status: 'active',
        business_id: business.id
      }])
      .select()
      .single();

    if (agentError) {
      console.error('Agent insert error:', agentError);
      return;
    }

    console.log('✓ Agent created:', agent);

    // Clean up
    console.log('\nCleaning up test data...');

    // Delete agent first (foreign key constraint)
    const { error: deleteAgentError } = await supabase
      .from('agents')
      .delete()
      .eq('id', agent.id);

    if (deleteAgentError) {
      console.error('Error deleting agent:', deleteAgentError);
    } else {
      console.log('✓ Agent deleted');
    }

    // Then delete business
    const { error: deleteBusinessError } = await supabase
      .from('businesses')
      .delete()
      .eq('id', business.id);

    if (deleteBusinessError) {
      console.error('Error deleting business:', deleteBusinessError);
    } else {
      console.log('✓ Business deleted');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testWithAuth();
