import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertTestBusiness() {
  try {
    console.log('Creating test business...');
    
    // Create a test business first
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert([{
        name: 'Test Business',
        email: 'test.business@example.com',
        status: 'active'
      }])
      .select()
      .single();

    if (businessError) {
      console.error('Error creating test business:', businessError);
      return;
    }

    console.log('Test business created:', business);

    // Now try to create an agent with the business ID
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert([{
        name: 'Test Agent',
        email: 'test.agent@example.com',
        status: 'active',
        business_id: business.id
      }])
      .select()
      .single();

    if (agentError) {
      console.error('Error creating test agent:', agentError);
      return;
    }

    console.log('Test agent created:', agent);

    // Clean up test data
    const { error: deleteAgentError } = await supabase
      .from('agents')
      .delete()
      .eq('id', agent.id);

    if (deleteAgentError) {
      console.error('Error deleting test agent:', deleteAgentError);
    }

    const { error: deleteBusinessError } = await supabase
      .from('businesses')
      .delete()
      .eq('id', business.id);

    if (deleteBusinessError) {
      console.error('Error deleting test business:', deleteBusinessError);
    }

    console.log('Test data cleaned up successfully');

  } catch (err) {
    console.error('Error in test:', err);
  }
}

insertTestBusiness();
