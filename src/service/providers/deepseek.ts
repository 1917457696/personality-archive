import type { ProviderAdapter } from './shared.ts';
import { send, resultText } from './shared.ts';

export const deepSeekAdapter: ProviderAdapter = {
  id: 'deepseek',
  endpoint: 'https://api.deepseek.com/chat/completions',
  async request({ model, apiKey, prompt, signal }) {
    const response = await send(this.endpoint, {
      method: 'POST',
      signal,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }]
      })
    });
    return resultText(response, this.id);
  }
};
