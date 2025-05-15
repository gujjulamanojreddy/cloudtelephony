import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBusinessTable() {
  try {
    // Try to insert a business
    console.log('Testing business table insert...');
    const { data, error } = await supabase
      .from('businesses')
      .insert([{}])
      .select();

    if (error) {
      console.error('Business insert error:', error);
    } else {
      console.log('Business insert success:', data);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

async function testAgentsTable() {
  try {
    // First get a business id
    const { data: businesses } = await supabase
      .from('businesses')
      .select('id')
      .limit(1);

    const businessId = businesses?.[0]?.id;
    
    if (!businessId) {
      console.error('No business found to link agent to');
      return;
    }

    console.log('Testing agent table insert...');
    const { data, error } = await supabase
      .from('agents')
      .insert([{
        name: 'Test Agent',
        email: 'agent.test@example.com',
        status: 'active',
        business_id: businessId
      }])
      .select();

    if (error) {
      console.error('Agent insert error:', error);
    } else {
      console.log('Agent insert success:', data);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run tests
console.log('Starting table tests...\n');
testBusinessTable().then(() => {
  console.log('\n---\n');
  testAgentsTable();
});
