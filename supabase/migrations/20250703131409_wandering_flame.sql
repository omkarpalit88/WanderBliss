/*
  # Fix RLS policies for trips table

  1. Security Changes
    - Drop existing INSERT policies that use incorrect uid() function
    - Create new INSERT policy using correct auth.uid() function
    - Ensure users can only insert trips where user_id matches their authenticated ID

  2. Policy Details
    - Policy allows authenticated users to insert trips
    - Uses auth.uid() = user_id check to ensure users can only create trips for themselves
*/

-- Drop the existing INSERT policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON trips;
DROP POLICY IF EXISTS "Users can insert own trips" ON trips;

-- Create a single, correct INSERT policy
CREATE POLICY "Users can insert own trips"
  ON trips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also add SELECT, UPDATE, and DELETE policies for completeness
CREATE POLICY "Users can view own trips"
  ON trips
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON trips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON trips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);