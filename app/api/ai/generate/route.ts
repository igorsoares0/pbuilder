import { NextRequest } from 'next/server';
import { anthropic, MODEL, MAX_TOKENS } from '@/lib/ai/anthropic';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { parseThinkingSteps, extractCode, detectLanguageAndFramework } from '@/lib/ai/streaming';
import { createMessage, createArtifact, getMessages } from '@/lib/db/queries';

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
    console.log('💬 [API] Conversation ID:', conversationId);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Build message history
          const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

          // Load previous messages if continuing a conversation
          if (conversationId) {
            const previousMessages = await getMessages(conversationId);
            console.log('📚 [API] Loaded previous messages:', previousMessages.length);

            // Add previous messages to context (only content, not thinking steps)
            for (const msg of previousMessages) {
              if (msg.role === 'user') {
                messages.push({
                  role: 'user',
                  content: msg.content,
                });
              } else if (msg.role === 'assistant' && msg.generatedCode) {
                // For assistant messages, include the generated code in context
                messages.push({
                  role: 'assistant',
                  content: msg.generatedCode,
                });
              }
            }
          }

          // Add current user message
          messages.push({
            role: 'user',
            content: prompt,
          });

          console.log('📨 [API] Total messages in context:', messages.length);

          // Save user message to database
          if (conversationId) {
            await createMessage({
              conversationId,
              role: 'user',
              content: prompt,
            });
          }

          // Create stream with Anthropic
          const messageStream = await anthropic.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            messages,
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

              // Stream ALL text content in real-time
              const textData = {
                type: 'text',
                content: text,
              };
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(textData)}\n\n`)
              );

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
