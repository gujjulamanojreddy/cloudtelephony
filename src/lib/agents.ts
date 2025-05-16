import { supabase } from './supabase';

/**
 * Inserts a new agent into the agents table.
 * @param agentData - The data of the agent to insert.
 * @returns A promise resolving to the result of the insertion.
 */
export async function addAgent(agentData: { name: string; email: string; business_name: string }) {
  try {
    // First, ensure the table exists with the correct schema
    const setupSQL = `
      CREATE TABLE IF NOT EXISTS agents (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        business_name VARCHAR NOT NULL DEFAULT 'Cloud Telephony',
        status VARCHAR DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT now()
      );

      -- Add business_name column if it doesn't exist
      DO $$ 
      BEGIN 
        ALTER TABLE agents 
          ADD COLUMN IF NOT EXISTS business_name VARCHAR NOT NULL DEFAULT 'Cloud Telephony';
      EXCEPTION 
        WHEN duplicate_column THEN NULL;
      END $$;

      -- Enable RLS with a permissive policy
      ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Enable all access" ON agents;
      CREATE POLICY "Enable all access" ON agents FOR ALL USING (true) WITH CHECK (true);
    `;

    try {
      await supabase.rpc('execute_sql', { sql: setupSQL });
    } catch (error) {
      console.warn('Schema update failed, proceeding with insert:', error instanceof Error ? error.message : String(error));
    }

    // Now try to insert the data
    const { data, error } = await supabase
      .from('agents')
      .insert({
        name: agentData.name,
        email: agentData.email,
        business_name: agentData.business_name || 'Cloud Telephony',
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error in addAgent:', error);
    throw error;
  }
}
