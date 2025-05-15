import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInserts() {
  try {
    // First sign in as admin
    console.log('Signing in...');
    const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123'
    });

    if (authError) {
      console.error('Authentication error:', authError);
      return;
    }

    console.log('✓ Authenticated successfully');

    // Step 1: Create a business
    console.log('\nCreating test business...');
    const businessData = {
      id: crypto.randomUUID(),
      name: 'Test Company',
      email: 'test@company.com',
      status: 'active',
      created_at: new Date().toISOString()
    };

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert([businessData])
      .select()
      .single();

    if (businessError) {
      console.error('Failed to create business:', businessError);
      return;
    }

    console.log('✓ Business created:', business);

    // Step 2: Create an agent
    console.log('\nCreating test agent...');
    const agentData = {
      id: crypto.randomUUID(),
      name: 'John Smith',
      email: 'john@company.com',
      status: 'active',
      business_id: business.id,
      created_at: new Date().toISOString()
    };

    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert([agentData])
      .select()
      .single();

    if (agentError) {
      console.error('Failed to create agent:', agentError);
      return;
    }

    console.log('✓ Agent created:', agent);

    // Step 3: Verify we can read the data back
    console.log('\nVerifying data...');
    
    // Check business
    const { data: readBusiness, error: readBusinessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', business.id)
      .single();

    if (readBusinessError) {
      console.error('Failed to read business:', readBusinessError);
    } else {
      console.log('✓ Can read business data:', readBusiness);
    }

    // Check agent
    const { data: readAgent, error: readAgentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agent.id)
      .single();

    if (readAgentError) {
      console.error('Failed to read agent:', readAgentError);
    } else {
      console.log('✓ Can read agent data:', readAgent);
    }

    // Step 4: Clean up test data
    console.log('\nCleaning up test data...');

    // Delete agent first (due to foreign key constraint)
    const { error: deleteAgentError } = await supabase
      .from('agents')
      .delete()
      .eq('id', agent.id);

    if (deleteAgentError) {
      console.error('Failed to delete agent:', deleteAgentError);
    } else {
      console.log('✓ Agent deleted');
    }

    // Then delete business
    const { error: deleteBusinessError } = await supabase
      .from('businesses')
      .delete()
      .eq('id', business.id);

    if (deleteBusinessError) {
      console.error('Failed to delete business:', deleteBusinessError);
    } else {
      console.log('✓ Business deleted');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testInserts();
