-- Drop existing agents table if it exists
DROP TABLE IF EXISTS agents CASCADE;

-- Create agents table with all required columns
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  business_id VARCHAR NOT NULL,
  business_name VARCHAR NOT NULL DEFAULT 'Cloud Telephony',
  status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add unique constraint for email within the same business
ALTER TABLE agents 
  ADD CONSTRAINT unique_email_per_business UNIQUE (email, business_id);

-- Add policies
CREATE POLICY "Enable all actions for authenticated users" ON agents
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
