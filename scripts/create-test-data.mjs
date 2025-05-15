import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to wait
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function createTestData() {
  try {
    console.log('Creating test business...');
    const business = {
      name: 'Test Business XYZ',
      status: 'active'
    };

    const { data: createdBusiness, error: businessError } = await supabase
      .from('businesses')
      .upsert([business])
      .select()
      .single();

    if (businessError) {
      throw businessError;
    }

    console.log('✓ Business created:', createdBusiness);

    console.log('\nCreating test agent...');
    const agent = {
      name: 'John Agent',
      email: 'john.agent@test.com',
      status: 'active',
      business_id: createdBusiness.id
    };

    const { data: createdAgent, error: agentError } = await supabase
      .from('agents')
      .upsert([agent])
      .select()
      .single();

    if (agentError) {
      throw agentError;
    }

    console.log('✓ Agent created:', createdAgent);

  } catch (error) {
    console.error('Failed to create test data:', error.message);
  }
}

createTestData();
