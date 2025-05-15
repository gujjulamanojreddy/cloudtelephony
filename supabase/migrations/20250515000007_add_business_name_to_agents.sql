-- Add business_name column to agents table with default value
ALTER TABLE agents ADD COLUMN IF NOT EXISTS business_name VARCHAR NOT NULL DEFAULT 'Cloud Telephony';

-- Update existing agents to have the default business name
UPDATE agents SET business_name = 'Cloud Telephony' WHERE business_name IS NULL;
