/*
  # Add missing JSONB columns to trips table

  1. Changes
    - Add `travel_legs` column as JSONB to store travel leg information
    - Ensure all JSONB columns have proper default values
    - Update existing columns to ensure they're properly configured

  2. Security
    - No RLS changes needed as the table already has proper policies
*/

-- Add travel_legs column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'travel_legs'
  ) THEN
    ALTER TABLE trips ADD COLUMN travel_legs jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Ensure all JSONB columns have proper default values
DO $$
BEGIN
  -- Update participants column to have proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'participants' AND column_default IS NULL
  ) THEN
    ALTER TABLE trips ALTER COLUMN participants SET DEFAULT '[]'::jsonb;
  END IF;

  -- Update expenses column to have proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'expenses' AND column_default IS NULL
  ) THEN
    ALTER TABLE trips ALTER COLUMN expenses SET DEFAULT '[]'::jsonb;
  END IF;

  -- Update inspiration column to have proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'inspiration' AND column_default IS NULL
  ) THEN
    ALTER TABLE trips ALTER COLUMN inspiration SET DEFAULT '{}'::jsonb;
  END IF;

  -- Update lodging column to have proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'lodging' AND column_default IS NULL
  ) THEN
    ALTER TABLE trips ALTER COLUMN lodging SET DEFAULT '[]'::jsonb;
  END IF;

  -- Update itinerary column to have proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'itinerary' AND column_default IS NULL
  ) THEN
    ALTER TABLE trips ALTER COLUMN itinerary SET DEFAULT '[]'::jsonb;
  END IF;

  -- Update settlements column to have proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'settlements' AND column_default IS NULL
  ) THEN
    ALTER TABLE trips ALTER COLUMN settlements SET DEFAULT '[]'::jsonb;
  END IF;
END $$;