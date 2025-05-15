import { createClient } from '@supabase/supabase-js';

// Ensure these are set in your environment or replace with your actual credentials
const supabaseUrl = process.env.SUPABASE_URL || "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertMockData() {
  try {
    // 1. Insert a mock business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert([
        { name: 'Mock Business for Agents', email: 'mockbusiness@example.com' },
      ])
      .select()
      .single(); // Assuming you want to create one business and get its ID

    if (businessError) {
      console.error('Error inserting mock business:', businessError);
      // Check if it's a unique constraint violation for email, which might be okay if we just want any business_id
      if (businessError.code === '23505' && businessError.message.includes('business_email_key')) {
        console.log('Mock business with this email already exists, attempting to fetch it.');
        const { data: existingBusiness, error: fetchError } = await supabase
          .from('businesses')
          .select('id')
          .eq('email', 'mockbusiness@example.com')
          .single();
        if (fetchError || !existingBusiness) {
          console.error('Failed to fetch existing mock business:', fetchError);
          throw fetchError || new Error('Failed to fetch existing mock business');
        }
        console.log('Using existing mock business with ID:', existingBusiness.id);
        business = existingBusiness;
      } else {
        throw businessError;
      }
    } else {
        console.log('Mock business inserted:', business);
    }
    
    if (!business || !business.id) {
        throw new Error('Failed to create or retrieve mock business ID.');
    }

    const mockBusinessId = business.id;

    // 2. Insert two mock agents
    const agentsToInsert = [
      {
        name: 'Mock Agent One',
        email: 'mockagent1@example.com',
        status: 'active',
        business_id: mockBusinessId,
      },
      {
        name: 'Mock Agent Two',
        email: 'mockagent2@example.com',
        status: 'inactive',
        business_id: mockBusinessId,
      },
    ];

    const { data: insertedAgents, error: agentsError } = await supabase
      .from('agents')
      .insert(agentsToInsert)
      .select();

    if (agentsError) {
      console.error('Error inserting mock agents:', agentsError);
      throw agentsError;
    }

    console.log('Successfully inserted mock agents:', insertedAgents);

  } catch (error) {
    console.error('Failed to insert mock data:', error);
    process.exit(1);
  }
}

insertMockData();
