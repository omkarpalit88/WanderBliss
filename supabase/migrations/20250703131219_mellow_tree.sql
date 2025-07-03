/*
  # Add INSERT policy for trips table

  1. Security
    - Add policy to allow authenticated users to insert trips
    - Users can only insert trips where they are the owner (user_id matches auth.uid())
    - This resolves the "new row violates row-level security policy" error

  2. Changes
    - Create policy "Users can insert own trips" on trips table
    - Policy allows INSERT operations for authenticated users
    - Policy ensures user_id in new row matches the authenticated user's ID
*/

-- Create policy to allow authenticated users to insert their own trips
CREATE POLICY "Users can insert own trips"
  ON trips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);