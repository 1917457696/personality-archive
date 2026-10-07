import type { CompatibilityInput, CompatibilityResult, ProviderId, SingleSignInput, SingleSignResult } from '../types/domain.ts';
import { requestCompatibilityReading, requestSingleSignReading } from '../service/astrologyService.ts';

export const astrologyRuntime = {
 single: (provider: ProviderId, model: string, apiKey: string, input: SingleSignInput, signal?: AbortSignal): Promise<SingleSignResult> =>
  requestSingleSignReading(provider, model, apiKey, input, signal),
 compatibility: (provider: ProviderId, model: string, apiKey: string, input: CompatibilityInput, signal?: AbortSignal): Promise<CompatibilityResult> =>
  requestCompatibilityReading(provider, model, apiKey, input, signal)
};
