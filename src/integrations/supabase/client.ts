// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ievhywwljnddbveebemw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldmh5d3dsam5kZGJ2ZWViZW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwNDUzNzcsImV4cCI6MjA1MTYyMTM3N30.pQpkmnN0f5rI16YI0bl5V7XCq7IxQOJOcklv5MYb9wA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);