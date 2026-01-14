import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find all scheduled content that should be published now
    const { data: scheduledContent, error: fetchError } = await supabase
      .from('admin_content')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString());

    if (fetchError) {
      console.error('Error fetching scheduled content:', fetchError);
      throw fetchError;
    }

    if (!scheduledContent || scheduledContent.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No scheduled content to publish', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const publishResults = [];

    for (const content of scheduledContent) {
      // Update content to published
      const { error: updateError } = await supabase
        .from('admin_content')
        .update({
          status: 'published',
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', content.id);

      if (updateError) {
        console.error(`Error publishing content ${content.id}:`, updateError);
        publishResults.push({ id: content.id, success: false, error: updateError.message });
        continue;
      }

      // Log audit event
      const { error: auditError } = await supabase
        .from('admin_audit_log')
        .insert({
          action: 'content.auto_publish',
          actor_id: '00000000-0000-0000-0000-000000000000', // System actor
          resource_id: content.id,
          resource_type: 'content',
          metadata: {
            title: content.title,
            scheduled_at: content.scheduled_at,
            published_at: new Date().toISOString(),
          },
        });

      if (auditError) {
        console.error(`Error logging audit for content ${content.id}:`, auditError);
      }

      publishResults.push({ id: content.id, title: content.title, success: true });
    }

    const successCount = publishResults.filter(r => r.success).length;

    return new Response(
      JSON.stringify({
        message: `Published ${successCount} of ${publishResults.length} scheduled content items`,
        results: publishResults,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in publish-scheduled-content:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
