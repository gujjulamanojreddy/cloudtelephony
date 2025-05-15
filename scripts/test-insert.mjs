import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestBusiness() {
  try {
    console.log('Creating test business...');
    
    // Insert a business (we only need to provide created_at as optional)
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({})
      .select()
      .single();

    if (businessError) {
      console.error('Error creating business:', businessError.message);
      return;
    }

    console.log('✓ Business created successfully:', business);

    // Now try to create an agent using this business ID
    console.log('\nCreating test agent...');
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        business_id: business.id,
        name: 'Test Agent',
        email: 'test.agent@example.com',
        status: 'active'
      })
      .select()
      .single();

    if (agentError) {
      console.error('Error creating agent:', agentError.message);
      return;
    }

    console.log('✓ Agent created successfully:', agent);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestBusiness();
