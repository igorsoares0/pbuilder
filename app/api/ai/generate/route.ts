import { NextRequest } from 'next/server';
import { anthropic, MODEL, MAX_TOKENS } from '@/lib/ai/anthropic';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { parseThinkingSteps, extractCode, detectLanguageAndFramework } from '@/lib/ai/streaming';
import { createMessage, createArtifact } from '@/lib/db/queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { prompt, conversationId } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid prompt' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('🚀 [API] Starting generation for prompt:', prompt.substring(0, 50));

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Create stream with Anthropic
          const messageStream = await anthropic.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            system: SYSTEM_PROMPT,
          });

          let fullContent = '';
          let currentSection = '';

          for await (const event of messageStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const text = event.delta.text;
              fullContent += text;
              currentSection += text;

              // Check if we just completed a section
              if (text.includes('## ')) {
                const sections = currentSection.split('## ');
                if (sections.length > 1) {
                  // We have a complete section
                  const completedSection = sections[0];
                  if (completedSection.trim()) {
                    const steps = parseThinkingSteps('## ' + completedSection);
                    if (steps.length > 0) {
                      console.log('💭 [API] Sending thinking step:', steps[0].title);
                      const data = {
                        type: 'thinking',
                        step: steps[0],
                      };
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                      );
                    }
                  }
                  currentSection = '## ' + sections[sections.length - 1];
                }
              }

              // Stream code content
              if (fullContent.includes('```')) {
                const data = {
                  type: 'code',
                  content: text,
                };
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
              }
            }
          }

          console.log('📝 [API] Full content length:', fullContent.length);
          console.log('📝 [API] Full content preview:', fullContent.substring(0, 200));

          // Process final content
          const thinkingSteps = parseThinkingSteps(fullContent);
          console.log('💭 [API] Parsed thinking steps:', thinkingSteps.length);

          const generatedCode = extractCode(fullContent);
          console.log('🎨 [API] Extracted code length:', generatedCode?.length || 0);
          console.log('🎨 [API] Code preview:', generatedCode?.substring(0, 100));

          if (generatedCode) {
            const { language, framework } = detectLanguageAndFramework(generatedCode);
            console.log('🔍 [API] Detected language:', language, 'framework:', framework);

            // Save to database if conversationId is provided
            if (conversationId) {
              try {
                const message = await createMessage({
                  conversationId,
                  role: 'assistant',
                  content: fullContent,
                  thinkingSteps,
                  generatedCode,
                });

                if (message) {
                  await createArtifact({
                    conversationId,
                    messageId: message.id,
                    code: generatedCode,
                    language,
                    framework,
                  });
                  console.log('💾 [API] Saved to database');
                }
              } catch (dbError) {
                console.error('❌ [API] Database save error:', dbError);
              }
            }

            // Send completion event
            const completeData = {
              type: 'complete',
              content: generatedCode,
            };
            console.log('✅ [API] Sending complete event with code length:', generatedCode.length);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(completeData)}\n\n`)
            );
          } else {
            console.error('❌ [API] No code extracted!');
            const errorData = {
              type: 'error',
              content: 'No code generated',
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
            );
          }

          controller.close();
        } catch (error) {
          console.error('❌ [API] Stream error:', error);
          const errorData = {
            type: 'error',
            content: error instanceof Error ? error.message : 'Unknown error',
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('❌ [API] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
