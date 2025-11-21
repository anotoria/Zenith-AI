import { GoogleGenAI, Type } from "@google/genai";
import type { SocialCopy, GeneratedImage } from '../types';

// Helper to create a fresh instance with the current API key
// This ensures we always use the latest key selected by the user via window.aistudio
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
      return null;
  }
  return new GoogleGenAI({ apiKey });
}

const generateWithMock = async <T,>(mockData: T, delay = 1500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(mockData), delay));
}

export const generateSocialCopy = async (title: string): Promise<SocialCopy[]> => {
  const ai = getAI();
  if (!ai) {
    const mockCopies: SocialCopy[] = [
        { id: `copy-${Date.now()}-1`, text: `Você já viu as 10 dicas essenciais para marketing de conteúdo em 2024? 🔥 Confira o novo artigo no nosso blog e impulsione sua estratégia! #MarketingDeConteúdo #Dicas2024` },
        { id: `copy-${Date.now()}-2`, text: `O futuro do marketing de conteúdo está aqui! 🚀 Nosso último post revela 10 segredos que você precisa saber. Leia agora! #MarketingDigital #Estratégia` },
        { id: `copy-${Date.now()}-3`, text: `Quer se destacar em 2024? ✨ Comece com um marketing de conteúdo matador. Descubra como no nosso novo artigo. Link na bio! #Conteúdo #SEO` },
    ];
    return generateWithMock(mockCopies);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Baseado no título do artigo de blog "${title}", crie 3 copys curtas e envolventes para uma postagem no Facebook. Cada copy deve ter menos de 280 caracteres e incluir 2-3 hashtags relevantes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            copies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: {
                    type: Type.STRING,
                    description: 'O texto da postagem para a rede social.',
                  },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("API returned an empty response.");
    }
    const jsonResponse = JSON.parse(text);
    return jsonResponse.copies.map((c: { text: string }) => ({
      id: `copy-${Date.now()}-${Math.random()}`,
      text: c.text,
    }));
  } catch (error) {
    console.error("Error generating social copy:", error);
    throw new Error("Failed to generate social copy.");
  }
};

export const generateArticleImage = async (title: string): Promise<GeneratedImage> => {
    const prompt = `Uma imagem que representa o título: "${title}". O estilo deve ser 'caseiro', como se fosse tirada com um smartphone por um amador. A imagem deve parecer autêntica, com iluminação natural e não como uma foto de banco de imagens profissional.`;

    const ai = getAI();
    if (!ai) {
        const mockImage: GeneratedImage = {
            id: `img-${Date.now()}`,
            url: `https://picsum.photos/seed/${title.replace(/\s/g, '')}/${Math.floor(Math.random() * 200) + 400}/${Math.floor(Math.random() * 200) + 300}`,
            prompt: prompt,
        };
        return generateWithMock(mockImage, 2500);
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                const imageUrl = `data:image/png;base64,${base64EncodeString}`;
                return {
                    id: `img-${Date.now()}`,
                    url: imageUrl,
                    prompt,
                };
            }
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error generating article image:", error);
        throw new Error("Failed to generate article image.");
    }
};

// --- New Service Methods for AI Creator Module ---

export const generateCustomImage = async (idea: string, description: string, type: string, details?: string): Promise<GeneratedImage> => {
    const prompt = `Crie uma imagem baseada na seguinte ideia: "${idea}".
    Descrição detalhada: ${description}.
    Estilo Visual: ${type}.
    ${details ? `Detalhes de Cores e Luzes: ${details}` : ''}`;

    const ai = getAI();
    if (!ai) {
        return generateWithMock({
            id: `custom-img-${Date.now()}`,
            url: `https://picsum.photos/seed/${idea.replace(/\s/g, '')}/1024/1024`,
            prompt
        }, 3000);
    }

    try {
        // Using gemini-2.5-flash-image for general generation tasks
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
             config: {
                imageConfig: {
                   aspectRatio: "1:1",
                }
             }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                const imageUrl = `data:image/png;base64,${base64EncodeString}`;
                return {
                    id: `custom-img-${Date.now()}`,
                    url: imageUrl,
                    prompt,
                };
            }
        }
        throw new Error("No image data found");
    } catch (error) {
        console.error("Error generating custom image:", error);
        throw new Error("Failed to generate image.");
    }
};

export const generateCustomVideo = async (idea: string, description: string, type: string, details?: string): Promise<string> => {
     const prompt = `Crie um vídeo curto baseado na ideia: "${idea}".
    Descrição: ${description}.
    Estilo: ${type}.
    ${details ? `Detalhes de Luzes/Cores: ${details}` : ''}`;

    const ai = getAI();
    if (!ai) {
        // Mock video URL (using a placeholder video)
        return generateWithMock("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", 4000);
    }

    try {
        // Using Veo model
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // Polling for completion
        while (!operation.done) {
             await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
             operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) throw new Error("Video URI not found");
        
        // Append API Key for access
        return `${videoUri}&key=${process.env.API_KEY}`;

    } catch (error: any) {
        console.error("Error generating custom video:", error);
        // Check for the specific error that indicates missing or invalid paid API key (404 from Veo)
        if (error.message && (error.message.includes("Requested entity was not found") || error.message.includes("404"))) {
             throw new Error("Requested entity was not found");
        }
        throw new Error("Failed to generate video: " + (error.message || "Unknown error"));
    }
};

export const generateCustomCopy = async (
    idea: string, 
    description: string, 
    type: string, 
    method: string, 
    count: number, 
    title?: string
): Promise<string[]> => {
    const prompt = `Atue como um Copywriter profissional.
    Objetivo: Criar ${count} variações de texto do tipo "${type}".
    Método de Copywriting obrigatório a seguir: ${method}.
    
    Ideia Principal: ${idea}
    Descrição Detalhada: ${description}
    ${title ? `Título Base: ${title}` : ''}
    
    Retorne APENAS um JSON com um array de strings chamado "variations", contendo os textos gerados. Sem formatação markdown extra.`;

    const ai = getAI();
    if (!ai) {
        return generateWithMock(Array(count).fill("").map((_, i) => 
            `[Variação ${i+1} - ${method}] Baseado na ideia ${idea}: ${description}. Esta é uma simulação de copy gerada.`
        ), 2000);
    }

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    variations: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  }
                }
            }
        });

        const text = response.text;
        if(!text) throw new Error("Empty response");
        const json = JSON.parse(text);
        return json.variations;

    } catch (error) {
        console.error("Error generating copy:", error);
        throw new Error("Failed to generate copy.");
    }
};