-- Add missing columns to the agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS business_id VARCHAR NOT NULL;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS business_name VARCHAR NOT NULL DEFAULT 'Cloud Telephony';
