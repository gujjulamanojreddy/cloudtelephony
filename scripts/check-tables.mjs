import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  try {
    // Check businesses table structure
    console.log('Checking businesses table...');
    const { data: businessesColumns, error: businessesError } = await supabase
      .from('businesses')
      .select()
      .limit(0);

    if (businessesError) {
      console.error('Error accessing businesses table:', businessesError.message);
    } else {
      console.log('✓ Businesses table exists');
      
      // Try inserting a test business
      const { data: business, error: insertError } = await supabase
        .from('businesses')
        .insert({ name: 'Test Business' })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting test business:', insertError.message);
      } else {
        console.log('✓ Successfully created test business with ID:', business.id);

        // Try inserting a test agent
        const { data: agent, error: agentError } = await supabase
          .from('agents')
          .insert({
            name: 'Test Agent',
            email: 'test.agent@example.com',
            business_id: business.id
          })
          .select()
          .single();

        if (agentError) {
          console.error('Error inserting test agent:', agentError.message);
        } else {
          console.log('✓ Successfully created test agent with ID:', agent.id);
        }

        // Clean up
        console.log('\nCleaning up test data...');
        
        // Delete agent first (due to foreign key constraint)
        const { error: deleteAgentError } = await supabase
          .from('agents')
          .delete()
          .eq('id', agent?.id || 0);

        if (deleteAgentError) {
          console.error('Error deleting test agent:', deleteAgentError.message);
        } else {
          console.log('✓ Test agent deleted');
        }

        // Then delete business
        const { error: deleteBusinessError } = await supabase
          .from('businesses')
          .delete()
          .eq('id', business.id);

        if (deleteBusinessError) {
          console.error('Error deleting test business:', deleteBusinessError.message);
        } else {
          console.log('✓ Test business deleted');
        }
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkTables();
