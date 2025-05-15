CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  business_id UUID REFERENCES businesses(id),
  UNIQUE(email)
);

-- Enable RLS but allow all operations initially
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all operations for all users" ON agents;
CREATE POLICY "Enable all operations for all users" ON agents FOR ALL USING (true);

-- Grant necessary permissions
GRANT ALL ON agents TO authenticated;
GRANT ALL ON agents TO anon;
