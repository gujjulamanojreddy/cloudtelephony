-- Drop and recreate the agents table with correct structure
DROP TABLE IF EXISTS agents;

CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  business_id VARCHAR NOT NULL,
  business_name VARCHAR NOT NULL DEFAULT 'Cloud Telephony',
  status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT unique_email_per_business UNIQUE (email, business_id)
);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view agents in their business" ON agents
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth.uid()
      FROM agents AS a
      WHERE a.business_id = agents.business_id
    )
);

CREATE POLICY "Users can create agents in their business" ON agents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update agents in their business" ON agents
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth.uid()
      FROM agents AS a
      WHERE a.business_id = agents.business_id
    )
  );

-- Grant necessary permissions
GRANT ALL ON agents TO authenticated;
GRANT ALL ON agents TO service_role;
