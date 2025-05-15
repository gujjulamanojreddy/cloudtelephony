import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function describeTable(tableName) {
  try {
    console.log(`Describing table: ${tableName}`);
    
    // Try to describe table using SELECT
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .limit(1);

    if (error) {
      console.error(`Error querying ${tableName}:`, error.message);
    } else {
      if (data && data[0]) {
        console.log(`Columns in ${tableName}:`, Object.keys(data[0]));
      } else {
        console.log(`Table ${tableName} exists but is empty. Getting metadata...`);
        const { data: metaData, error: metaError } = await supabase
          .from(tableName)
          .select('*', { head: true })
          .limit(0);

        if (metaError) {
          console.error(`Error getting metadata for ${tableName}:`, metaError.message);
        } else {
          console.log(`Metadata for ${tableName}:`, metaData);
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Describe both tables
async function describeTables() {
  await describeTable('businesses');
  await describeTable('agents');
}

describeTables();
