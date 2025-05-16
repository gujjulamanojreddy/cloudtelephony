-- Remove customers table
DROP TABLE IF EXISTS customers CASCADE;

-- Also remove any related policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read customers" ON customers;
