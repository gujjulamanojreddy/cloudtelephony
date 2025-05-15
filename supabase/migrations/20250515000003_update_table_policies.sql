-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON agents;
DROP POLICY IF EXISTS "Enable read access for all users" ON businesses;

-- Businesses table policies
CREATE POLICY "Users can view their own business" ON businesses
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth.uid()
      FROM agents
      WHERE agents.business_id = businesses.id
    )
);

CREATE POLICY "Users can create a business" ON businesses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own business" ON businesses
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth.uid()
      FROM agents
      WHERE agents.business_id = businesses.id
    )
  ) WITH CHECK (
    auth.uid() IN (
      SELECT auth.uid()
      FROM agents
      WHERE agents.business_id = businesses.id
    )
);

-- Agents table policies
CREATE POLICY "Users can view agents in their business" ON agents
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth.uid()
      FROM agents AS a
      WHERE a.business_id = agents.business_id
    )
);

CREATE POLICY "Users can create agents in their business" ON agents
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT auth.uid()
      FROM agents
      WHERE agents.business_id = NEW.business_id
    )
);

CREATE POLICY "Users can update agents in their business" ON agents
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth.uid()
      FROM agents AS a
      WHERE a.business_id = agents.business_id
    )
  ) WITH CHECK (
    auth.uid() IN (
      SELECT auth.uid()
      FROM agents AS a
      WHERE a.business_id = agents.business_id
    )
);

-- Make sure RLS is enabled
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
