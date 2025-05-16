import { supabase } from '../src/lib/supabase';

async function setupAgentsTable() {
  try {
    console.log('Setting up agents table...');

    // Drop the existing table to avoid any schema issues
    const dropTable = await supabase
      .from('rest')
      .rpc('execute_sql', {
        sql: 'DROP TABLE IF EXISTS agents CASCADE;'
      });

    if (dropTable.error) {
      console.warn('Error dropping table:', dropTable.error);
    }

    // Create agents table with all required columns
    const createTableResult = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE agents (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR NOT NULL,
          email VARCHAR NOT NULL,
          business_id VARCHAR,
          business_name VARCHAR DEFAULT 'Cloud Telephony',
          status VARCHAR DEFAULT 'active',
          created_at TIMESTAMPTZ DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Enable all access for authenticated users" 
          ON agents FOR ALL 
          TO authenticated 
          USING (true) 
          WITH CHECK (true);

        -- Grant necessary permissions
        GRANT ALL ON agents TO authenticated;
        GRANT ALL ON agents TO service_role;
      `
    });

    if (createTableResult.error) {
      console.error('Error creating table:', createTableResult.error);
      return;
    }

    console.log('Agents table setup completed successfully');

    // Insert a test record to verify
    const testInsert = await supabase
      .from('agents')
      .insert({
        name: 'Test Agent',
        email: 'test@example.com',
        business_name: 'Cloud Telephony'
      })
      .select();

    if (testInsert.error) {
      console.error('Error inserting test record:', testInsert.error);
      return;
    }

    console.log('Test record inserted successfully');

  } catch (error) {
    console.error('Error in setup:', error);
  }
}

setupAgentsTable().catch(console.error);
