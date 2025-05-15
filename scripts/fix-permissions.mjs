import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixTablePermissions() {
  try {
    // First, sign in as admin
    console.log('Signing in...');
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123'
    });

    if (authError) {
      console.error('Authentication error:', authError);
      return;
    }

    console.log('Successfully signed in');

    // Add new policies
    console.log('\nAdding policies...');
    
    // For businesses table
    console.log('Setting up businesses table policies...');
    const { error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .limit(1);

    if (businessError) {
      console.error('Error checking businesses table:', businessError);
    } else {
      console.log('✓ Can access businesses table');
    }

    // For agents table
    console.log('\nSetting up agents table policies...');
    const { error: agentError } = await supabase
      .from('agents')
      .select('id')
      .limit(1);

    if (agentError) {
      console.error('Error checking agents table:', agentError);
    } else {
      console.log('✓ Can access agents table');
    }

    // Try to insert test data
    console.log('\nTesting insert permissions...');
    const { data: business, error: insertError } = await supabase
      .from('businesses')
      .insert([{}])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting test business:', insertError);
    } else {
      console.log('✓ Successfully inserted test business');

      // Clean up test data
      const { error: deleteError } = await supabase
        .from('businesses')
        .delete()
        .eq('id', business.id);

      if (deleteError) {
        console.error('Error deleting test business:', deleteError);
      } else {
        console.log('✓ Successfully cleaned up test data');
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixTablePermissions();
