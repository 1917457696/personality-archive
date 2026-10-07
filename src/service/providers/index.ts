import type { ProviderId } from '../../types/domain.ts';
import type { ProviderAdapter, ProviderRequest } from './shared.ts';
import { openAIAdapter } from './openai.ts';
import { kimiAdapter } from './kimi.ts';
import { claudeAdapter } from './claude.ts';

export const providerAdapters: Record<ProviderId, ProviderAdapter> = {
 openai: openAIAdapter,
 kimi: kimiAdapter,
 claude: claudeAdapter
};

export function requestFromProvider(provider: ProviderId, input: ProviderRequest): Promise<string> {
 return providerAdapters[provider].request(input);
}
