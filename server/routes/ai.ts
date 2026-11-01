import { Router, Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

export const aiRouter = Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Multi-turn Chatbot (Socratic Copilot / Tech Mentor)
aiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, codeContext, role = 'copilot', model = 'gemini-3.8-flash' } = req.body;

    const systemInstructions: Record<string, string> = {
      copilot: `You are the Devashtra Socratic AI Copilot. Your mission is to bridge the gap between passive learning and real-world tech execution.
When the user shares code or an error message:
1. NEVER give the full answer or copy-paste code solution immediately.
2. Spot logic bugs, syntax issues, or complexity bottlenecks and explain them in simple, intuitive terms.
3. Provide targeted hints, mental models, and guiding questions that unlock the solution for the student.
${codeContext ? `\nCurrent Code in Editor:\n\`\`\`\n${codeContext}\n\`\`\`` : ''}`,
      junior: `You are RoboByte, the friendly space AI mascot for Devashtra Junior (ages 6-12).
Keep explanations enthusiastic, playful, simple, encouraging, and safe. Use space and adventure analogies. Never use dark or scary topics.`,
      biotech: `You are the Devashtra Computational Biology Mentor.
Explain bioinformatics, protein structures, AlphaFold pLDDT scores, and genomics clearly with scientific precision and citations.`,
    };

    const instruction = systemInstructions[role] || systemInstructions.copilot;

    // Convert message history to format expected by generateContent
    const contents = (messages || []).map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Hello!' }] });
    }

    const response = await ai.models.generateContent({
      model: model === 'gemini-4-argon' ? 'gemini-4-argon' : 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: instruction,
      },
    });

    return res.json({
      success: true,
      text: response.text || 'Thinking through this problem...',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI Chat request failed';
    return res.status(500).json({ success: false, error: message });
  }
});

// 2. Google Search Grounding for up-to-date tech docs & news
aiRouter.post('/search-grounded', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      success: true,
      text: response.text,
      sources,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Search grounding failed';
    return res.status(500).json({ success: false, error: message });
  }
});

// 3. Google Maps Grounding for finding tech hubs, hackathon spaces, and university labs
aiRouter.post('/maps-grounded', async (req: Request, res: Response) => {
  try {
    const { prompt, latitude = 37.7749, longitude = -122.4194 } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: Number(latitude),
              longitude: Number(longitude),
            },
          },
        },
      },
    });

    const places = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      success: true,
      text: response.text,
      places,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Maps grounding failed';
    return res.status(500).json({ success: false, error: message });
  }
});

// 4. Music Generation with Lyria (Lyria-3-clip-preview / Lyria-3-pro-preview)
aiRouter.post('/music', async (req: Request, res: Response) => {
  try {
    const { prompt, trackType = 'clip' } = req.body;
    const model = trackType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    const response = await ai.models.generateContentStream({
      model,
      contents: prompt || 'An uplifting cyber-synth coding soundtrack with gentle rhythmic beats.',
    });

    const audioChunks: Buffer[] = [];
    let lyrics = '';
    let mimeType = 'audio/mpeg';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (audioChunks.length === 0 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
        }
        if (part.text) {
          lyrics += part.text;
        }
      }
    }

    const audioBase64 = Buffer.concat(audioChunks).toString('base64');
    const audioDataUrl = `data:${mimeType};base64,${audioBase64}`;

    return res.json({
      success: true,
      audioUrl: audioDataUrl,
      lyrics: lyrics || 'Instrumental Focus Track for Software Execution',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Music generation failed';
    return res.status(500).json({ success: false, error: message });
  }
});

// 5. Image Creation & Editing with gemini-nano-banana-2.1
aiRouter.post('/image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '1:1', imageBase64, mimeType = 'image/png' } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    let parts: any[] = [{ text: prompt }];
    if (imageBase64) {
      parts.unshift({
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: '1K',
        },
      },
    });

    let generatedImageUrl = '';
    let responseText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        responseText += part.text;
      }
    }

    return res.json({
      success: true,
      imageUrl: generatedImageUrl,
      description: responseText,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Image generation failed';
    return res.status(500).json({ success: false, error: message });
  }
});

// 6. Video Generation & Image-to-Video with gemini-omni-1.1-flash via Interactions API
aiRouter.post('/video', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '16:9', imageBase64, mimeType = 'image/png' } = req.body;

    let input: any;
    if (imageBase64) {
      input = [
        {
          type: 'image',
          mime_type: mimeType,
          data: imageBase64,
        },
        {
          type: 'text',
          text: prompt || 'Animate this image with smooth cinematic motion.',
        },
      ];
    } else {
      input = prompt || 'A futuristic AI-powered coding studio glowing with cyan holographic code.';
    }

    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.1-flash',
        input,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: aspectRatio,
        },
      },
      { timeout: 300000 }
    );

    const videoPart = interaction.output_video;
    let videoUrl = '';
    if (videoPart && videoPart.data) {
      const mime = videoPart.mime_type || 'video/mp4';
      videoUrl = `data:${mime};base64,${videoPart.data}`;
    }

    return res.json({
      success: true,
      videoUrl,
      interactionId: interaction.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Video generation failed';
    return res.status(500).json({ success: false, error: message });
  }
});

// 7. Audio Transcription with gemini-3.5-transcribe
aiRouter.post('/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ success: false, error: 'audioBase64 is required' });
    }

    const interaction = await ai.interactions.create({
      model: 'gemini-3.5-transcribe',
      input: [
        {
          type: 'audio',
          data: audioBase64,
          mime_type: mimeType,
        },
        {
          type: 'text',
          text: 'Transcribe this student speech verbatim for code navigation and questions.',
        },
      ],
    });

    return res.json({
      success: true,
      transcript: interaction.output_text || '',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Audio transcription failed';
    return res.status(500).json({ success: false, error: message });
  }
});

// 8. Bioscience Skills & Molecular Search Endpoint (UniProt, PDB, PubChem)
aiRouter.get('/bio/protein/:query', async (req: Request, res: Response) => {
  try {
    const query = req.params.query.toUpperCase();

    // Query UniProt public REST API
    const uniRes = await fetch(`https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(query)}&size=3&format=json`);
    let uniData = null;
    if (uniRes.ok) {
      uniData = await uniRes.json();
    }

    return res.json({
      success: true,
      query,
      results: uniData?.results || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Bio query failed';
    return res.status(500).json({ success: false, error: message });
  }
});
