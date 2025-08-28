import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the JWT token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { firstName, lastName } = await req.json()

    // Check if user already has a name saved
    const { data: existingProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    // If user already has a name saved, check if they're trying to change it
    if (existingProfile && (existingProfile.first_name || existingProfile.last_name)) {
      const existingFirstName = existingProfile.first_name || ''
      const existingLastName = existingProfile.last_name || ''
      
      // If the new names are different from existing names, reject the change
      if (firstName !== existingFirstName || lastName !== existingLastName) {
        return new Response(
          JSON.stringify({ 
            error: 'Name change not allowed',
            message: 'Your name has already been set and cannot be changed. Contact support if you believe this is an error.',
            existingName: {
              firstName: existingFirstName,
              lastName: existingLastName
            }
          }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // If we get here, the name change is allowed (either no existing name or same name)
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Name validation passed',
        allowed: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in validate-name-change:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred while validating name change'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
