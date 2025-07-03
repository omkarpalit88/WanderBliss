/*
  # Add missing JSONB columns to trips table

  1. New Columns
    - `travel_legs` (jsonb) - Stores travel leg information for trips
    - `lodging` (jsonb) - Stores lodging entries for trips  
    - `itinerary` (jsonb) - Stores itinerary items for trips
    - `settlements` (jsonb) - Stores settlement information for expense splitting

  2. Changes
    - Adding JSONB columns to support the full Trip data model
    - These columns will store complex array/object data as JSON

  3. Notes
    - All new columns are nullable to maintain compatibility with existing data
    - JSONB type chosen for efficient querying and indexing capabilities
*/

-- Add missing JSONB columns to the trips table
DO $$
BEGIN
  -- Add travel_legs column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'travel_legs'
  ) THEN
    ALTER TABLE trips ADD COLUMN travel_legs JSONB;
  END IF;

  -- Add lodging column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'lodging'
  ) THEN
    ALTER TABLE trips ADD COLUMN lodging JSONB;
  END IF;

  -- Add itinerary column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'itinerary'
  ) THEN
    ALTER TABLE trips ADD COLUMN itinerary JSONB;
  END IF;

  -- Add settlements column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'settlements'
  ) THEN
    ALTER TABLE trips ADD COLUMN settlements JSONB;
  END IF;
END $$;