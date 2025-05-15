import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInserts() {
  try {
    // 1. Insert a test business
    console.log('Creating test business...');
    const { data: business, error: businessError } = await supabase      .from('businesses')
      .insert([{}])  // Empty object since the table auto-generates all fields
      .select()
      .single();

    if (businessError) {
      console.error('Error creating business:', businessError.message);
      return;
    }

    console.log('✓ Business created:', business);

    // 2. Insert a test agent
    console.log('\nCreating test agent...');    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert([{
        id: crypto.randomUUID(), // Generate a UUID for the agent
        name: 'Test Agent',
        email: 'test.agent@example.com',
        status: 'active',
        business_id: business.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (agentError) {
      console.error('Error creating agent:', agentError.message);
      return;
    }

    console.log('✓ Agent created:', agent);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testInserts();
