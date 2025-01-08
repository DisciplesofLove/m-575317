import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MessageData {
  content: string;
  sender: string;
  timestamp: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messageData } = await req.json() as { messageData: MessageData }
    const PINATA_API_KEY = Deno.env.get('PINATA_API_KEY')
    const PINATA_SECRET_KEY = Deno.env.get('PINATA_SECRET_KEY')

    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API keys not configured')
    }

    console.log('Storing message on IPFS:', messageData)

    // Make request to Pinata API
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: JSON.stringify(messageData),
    })

    const result = await response.json()
    console.log('IPFS storage result:', result)

    return new Response(JSON.stringify({ ipfsHash: result.IpfsHash }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})