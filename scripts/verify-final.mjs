import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testData() {
  try {
    // First, let's insert a business
    console.log('Creating test business...');
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert([{
        // A bare insert should work since all fields are optional or have defaults
      }])
      .select()
      .single();

    if (businessError) {
      console.error('Business insert error:', businessError);
      return;
    }

    console.log('✓ Business created:', business);

    // Now let's create an agent linked to this business
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

    // Clean up test data
    console.log('\nCleaning up test data...');

    const { error: deleteAgentError } = await supabase
      .from('agents')
      .delete()
      .eq('id', agent.id);

    if (deleteAgentError) {
      console.error('Error deleting test agent:', deleteAgentError);
    } else {
      console.log('✓ Test agent deleted');
    }

    const { error: deleteBusinessError } = await supabase
      .from('businesses')
      .delete()
      .eq('id', business.id);

    if (deleteBusinessError) {
      console.error('Error deleting test business:', deleteBusinessError);
    } else {
      console.log('✓ Test business deleted');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testData();
