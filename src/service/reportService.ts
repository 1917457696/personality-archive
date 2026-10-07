import type { Source, Report, DimensionKey, ProviderId } from '../types/domain.ts';
import { requestFromProvider } from './providers/index.ts';
import { maxPromptCharacters } from '../config/providers.ts';

const dimensionKeys: DimensionKey[] = ['mbti', 'enneagram', 'bigFive'];
const insufficientEvidence = '证据不足，暂不作类型倾向判断。';

const system = `你是一位谨慎的文本观察者，不是心理诊断者。只根据给定材料进行可撤回的语言风格假设，中文回答，不下定论、不提供数字分数。MBTI、九型人格和大五人格是启发式框架，不是诊断工具。
报告必须结论先行：先在 conclusions 中分别给出 MBTI、九型人格、大五人格的明确但试探性结论。MBTI可给可能类型或短名单；九型人格可给可能类型主题或短名单；大五人格描述有证据支持的特质倾向。用“可能更接近”“我倾向于认为”“目前材料更支持”等措辞；证据不足时明确写“证据不足，暂不作类型倾向判断”，不要为了填满而猜。
随后每个维度给 1-3 条 findings，逐条区分观察、推测和替代解释。每条判断必须至少有一条材料中的连续原文证据，逐字一致；引用必须带正确 sourceId，PDF 必须给对应页码。结论必须与该维度的可核验证据相符。若某维度没有足够证据，给出空 findings 并在 conclusions 中写明证据不足。
summary 是简短整体观察，不代替三项人格结论；caveat 说明文本局限。
仅输出有效 JSON，格式如下：
{"summary":"整体观察","caveat":"局限说明","conclusions":{"mbti":"可能更接近……","enneagram":"……","bigFive":"……"},"dimensions":{"mbti":[],"enneagram":[],"bigFive":[]}}
dimensions 中每个有判断的维度填入 1-3 条完整 finding（字段为 observation、inference、alternative、evidence）；只有 conclusions 明确说明证据不足时，对应 finding 数组才可为空。
不要输出 JSON 以外的内容。`;

export function buildPrompt(sources: Source[]) {
  return `${system}\n\n材料：\n${sources.map(source => `[sourceId=${source.id}; title=${source.title}]\n${source.kind === 'pdf' ? (source.pages || []).map(page => `[page=${page.page}] ${page.text}`).join('\n') : source.text}`).join('\n\n')}`;
}

type ValidationOptions = { requireConclusions?: boolean };

export function validateReport(raw: unknown, profileId: string, sources: Source[], options: ValidationOptions = {}): Report {
  const result = typeof raw === 'string' ? JSON.parse(raw) : raw as any;
  if (!result || typeof result.summary !== 'string' || typeof result.caveat !== 'string' || !result.dimensions) {
    throw new Error('报告格式不完整，请重试。');
  }

  const rawConclusions = result.conclusions;
  if (options.requireConclusions && (!rawConclusions || dimensionKeys.some(key => typeof rawConclusions[key] !== 'string' || !rawConclusions[key].trim()))) {
    throw new Error('报告缺少三维度结论，请更换模型或重试。');
  }

  const dimensions = {} as Report['dimensions'];
  for (const key of dimensionKeys) {
    if (!Array.isArray(result.dimensions[key])) throw new Error('报告缺少人格维度，请重试。');
    dimensions[key] = result.dimensions[key].flatMap((finding: any) => {
      if (typeof finding.observation !== 'string' || typeof finding.inference !== 'string' || typeof finding.alternative !== 'string' || !Array.isArray(finding.evidence)) return [];
      const evidence = finding.evidence.flatMap((item: any) => {
        const source = sources.find(candidate => candidate.id === item.sourceId);
        if (!source || typeof item.quote !== 'string' || !item.quote.trim()) return [];
        if (source.kind === 'pdf') {
          const page = source.pages?.find(candidate => candidate.page === item.page);
          return page?.text.includes(item.quote) ? [{ quote: item.quote, sourceId: source.id, page: page.page }] : [];
        }
        return source.text.includes(item.quote) ? [{ quote: item.quote, sourceId: source.id }] : [];
      });
      return evidence.length ? [{ observation: finding.observation, inference: finding.inference, alternative: finding.alternative, evidence }] : [];
    });
  }

  let dimensionConclusions: Report['dimensionConclusions'];
  if (rawConclusions && typeof rawConclusions === 'object') {
    dimensionConclusions = Object.fromEntries(dimensionKeys.map(key => {
      const candidate = rawConclusions[key];
      if (typeof candidate !== 'string' || !candidate.trim()) return [key, insufficientEvidence];
      return [key, dimensions[key].length ? candidate.trim() : insufficientEvidence];
    })) as Report['dimensionConclusions'];
  }

  return {
    id: crypto.randomUUID(),
    profileId,
    createdAt: Date.now(),
    sourceIds: sources.map(source => source.id),
    dimensions,
    ...(dimensionConclusions ? { dimensionConclusions } : {}),
    summary: result.summary,
    caveat: result.caveat,
    stale: false,
  };
}

export function preflightReport(sources: Source[]) {
  const characters = buildPrompt(sources).length;
  return { characters, limit: maxPromptCharacters, ok: characters <= maxPromptCharacters };
}

export async function requestReport(provider: ProviderId, model: string, apiKey: string, sources: Source[], signal?: AbortSignal): Promise<Report> {
  if (!apiKey.trim()) throw new Error('请先填写 API Key。');
  if (!sources.length) throw new Error('至少选择一份材料。');
  const prompt = buildPrompt(sources);
  if (prompt.length > maxPromptCharacters) {
    throw new Error(`材料合计约 ${prompt.length.toLocaleString()} 字符，超过单次安全上限 ${maxPromptCharacters.toLocaleString()}。请取消部分材料或缩短内容后再试；系统不会自动截断。`);
  }
  const response = await requestFromProvider(provider, { model, apiKey, prompt, signal });
  try {
    return validateReport(response, '', sources, { requireConclusions: true });
  } catch (error: any) {
    if (error instanceof SyntaxError) throw new Error('服务商返回内容不是有效 JSON，无法安全展示。请重试或更换模型。');
    throw error;
  }
}
