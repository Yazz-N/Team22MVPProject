/*
  # Create bookings table for OpsCentral demo scheduling

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `notes` (text, optional)
      - `pain_points` (jsonb, stores questionnaire responses)
      - `date` (text, booking date)
      - `time` (text, booking time)
      - `timezone_selected` (text, IANA timezone)
      - `utc_start` (text, ISO string for collision detection)
      - `duration_minutes` (integer, default 30)
      - `created_at` (timestamptz, auto-generated)
      - `status` (text, default 'confirmed')

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for public read access (for collision detection)
    - Add policy for public insert access (for booking creation)
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  notes text,
  pain_points jsonb NOT NULL DEFAULT '{}',
  date text NOT NULL,
  time text NOT NULL,
  timezone_selected text NOT NULL,
  utc_start text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'confirmed'
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for collision detection
CREATE POLICY "Allow public read access for bookings"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert access for creating bookings
CREATE POLICY "Allow public insert access for bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for efficient collision detection
CREATE INDEX IF NOT EXISTS idx_bookings_utc_start ON bookings(utc_start);