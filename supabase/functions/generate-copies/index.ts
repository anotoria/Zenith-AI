/// <reference lib="deno.ns" />
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('[generate-copies] LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = '';
    
    if (action === 'copies') {
      systemPrompt = `Você é um especialista em copywriting para redes sociais em português brasileiro. 
      Crie 3 variações de texto curto e persuasivo para uma postagem no Facebook sobre o artigo fornecido.
      Cada copy deve:
      - Ter no máximo 280 caracteres
      - Incluir 2-3 hashtags relevantes
      - Ser envolvente e atrair cliques
      - Usar emojis estrategicamente
      Retorne apenas um array JSON com as 3 copies.`;
    } else if (action === 'generate-image') {
      systemPrompt = `Você irá gerar uma descrição detalhada para criação de imagem baseada no título do artigo.
      A descrição deve ser em inglês, visual e específica para um modelo de IA de imagens.`;
    }

    console.log('[generate-copies] Calling Lovable AI Gateway...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: title }
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-copies] AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições atingido. Tente novamente em alguns instantes.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos no seu workspace Lovable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Erro ao gerar conteúdo' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('[generate-copies] AI response received successfully');

    if (action === 'copies') {
      // Parse the JSON array from the response
      try {
        const copies = JSON.parse(generatedText);
        return new Response(
          JSON.stringify({ copies: copies.map((text: string, index: number) => ({ id: `copy-${Date.now()}-${index}`, text })) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error('[generate-copies] Failed to parse AI response as JSON:', parseError);
        // Fallback: split by newlines and clean up
        const copies = generatedText
          .split('\n')
          .filter((line: string) => line.trim())
          .slice(0, 3)
          .map((text: string, index: number) => ({
            id: `copy-${Date.now()}-${index}`,
            text: text.replace(/^\d+\.\s*/, '').trim()
          }));
        
        return new Response(
          JSON.stringify({ copies }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ imagePrompt: generatedText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('[generate-copies] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
