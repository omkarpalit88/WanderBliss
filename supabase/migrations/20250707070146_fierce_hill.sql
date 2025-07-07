/*
  # Add todos column to trips table

  1. New Columns
    - `todos` (jsonb) - Stores to-do list items for trips

  2. Changes
    - Adding JSONB column to support todo items with activity, completion status, and remarks
    - Column is nullable to maintain compatibility with existing data
    - Default value set to empty array

  3. Security
    - No RLS changes needed as the table already has proper policies for authenticated users
*/

-- Add todos column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'todos'
  ) THEN
    ALTER TABLE trips ADD COLUMN todos JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;