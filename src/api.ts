const OLLAMA_ENDPOINT = 'http://127.0.0.1:11434/api/chat';

export async function streamResponse(
  messages: ChatMessage[],
  onUpdate: (data: StreamResponse) => void,
  signal?: AbortSignal
) {
  try {
    const response = await fetch(OLLAMA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:8b',
        messages,
        stream: true,
        options: {
          temperature: 0.7,
        },
      }),
      signal,
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    let currentMessage = '';
    let currentThinking = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n').filter(Boolean);

      for (const line of lines) {
        const data = JSON.parse(line);
        
        if (data.message?.content) {
          currentMessage += data.message.content;
        }
        
        if (data.context?.includes('<think>')) {
          const thinkMatch = data.context.match(/<think>(.*?)<\/think>/s);
          if (thinkMatch) {
            currentThinking = thinkMatch[1].trim();
          }
        }

        onUpdate({
          message: currentMessage,
          thinking: currentThinking,
          done: false,
        });
      }
    }

    onUpdate({
      message: currentMessage,
      thinking: currentThinking,
      done: true,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error('Error streaming response:', error);
    throw error;
  }
}