-- Drop existing tables to recreate them with correct structure
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS businesses;

-- Create businesses table
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  address TEXT,
  status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create agents table
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  status VARCHAR CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  business_id UUID REFERENCES businesses(id),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Business policies
CREATE POLICY "Enable insert for authenticated users" 
    ON businesses FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Enable select for users who are agents of the business" 
    ON businesses FOR SELECT 
    TO authenticated 
    USING (
        id IN (
            SELECT business_id 
            FROM agents 
            WHERE agents.business_id = businesses.id
        )
    );

CREATE POLICY "Enable update for users who are agents of the business" 
    ON businesses FOR UPDATE 
    TO authenticated 
    USING (
        id IN (
            SELECT business_id 
            FROM agents 
            WHERE agents.business_id = businesses.id
        )
    );

-- Agent policies
CREATE POLICY "Enable insert for authenticated users" 
    ON agents FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Enable select for users who belong to the same business" 
    ON agents FOR SELECT 
    TO authenticated 
    USING (
        business_id IN (
            SELECT business_id 
            FROM agents 
            WHERE agents.business_id = agents.business_id
        )
    );

CREATE POLICY "Enable update for users in the same business" 
    ON agents FOR UPDATE 
    TO authenticated 
    USING (
        business_id IN (
            SELECT business_id 
            FROM agents 
            WHERE agents.business_id = agents.business_id
        )
    );

-- Grant permissions
GRANT ALL ON businesses TO authenticated;
GRANT ALL ON agents TO authenticated;
