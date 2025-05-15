CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE,
  phone VARCHAR,
  address TEXT,
  status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS but allow all operations initially
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for all users" ON businesses FOR ALL USING (true);

-- Grant necessary permissions
GRANT ALL ON businesses TO authenticated;
GRANT ALL ON businesses TO anon;
