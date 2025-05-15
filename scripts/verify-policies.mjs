import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyPolicies() {
  try {
    // Get list of policies for businesses table
    const { data: businessPolicies, error: businessError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'businesses');

    if (businessError) throw businessError;
    
    console.log('\nBusiness Table Policies:');
    console.log(JSON.stringify(businessPolicies, null, 2));

    // Get list of policies for agents table
    const { data: agentPolicies, error: agentError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'agents');

    if (agentError) throw agentError;
    
    console.log('\nAgent Table Policies:');
    console.log(JSON.stringify(agentPolicies, null, 2));

  } catch (error) {
    console.error('Error verifying policies:', error);
    process.exit(1);
  }
}

verifyPolicies();
