import test from 'node:test';
import assert from 'node:assert/strict';
import type { CompatibilityInput } from '../../src/types/domain.ts';
import { astrologyDisclaimer, zodiacSigns } from '../../src/config/providers.ts';
import {
 buildCompatibilityPrompt,
 buildSingleSignPrompt,
 requestCompatibilityReading,
 requestSingleSignReading,
 validateCompatibilityInput,
 validateCompatibilityResult,
 validateSingleSignResult
} from '../../src/service/astrologyService.ts';
import { astrologyRuntime } from '../../src/runtime/astrologyRuntime.ts';

const singleResult = {
 relationshipTendencies: ['可能会先观察，再决定是否投入。'],
 emotionalNeeds: ['或许重视稳定回应。'],
 fittingPartnerTraits: ['愿意耐心沟通的人可能更合拍。'],
 frictionPoints: ['节奏不同可能带来误会。'],
 practicalAdvice: ['可以先说清彼此期待。']
};
const pairResult = {
 overview: '两种表达节奏可能不同，也有机会彼此补足。',
 complementaryDynamics: ['一方的直接可能帮助另一方更快表达。'],
 frictionPoints: ['对决定速度的期待或许不同。'],
 practicalAdvice: ['可先约定讨论重要决定的方式。']
};
function mockChatResponse(content: string, status = 200) {
 return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status, headers: { 'content-type': 'application/json' } });
}

test('zodiac configuration contains the 12 stable IDs and the fixed disclaimer', () => {
 assert.deepEqual(zodiacSigns.map(sign => sign.id), ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces']);
 assert.equal(new Set(zodiacSigns.map(sign => sign.name)).size, 12);
 assert.match(astrologyDisclaimer, /仅供娱乐与自我反思/);
 assert.match(astrologyDisclaimer, /不构成科学评估、心理诊断或可靠预测/);
});

test('valid single and compatibility schemas are normalized; malformed schemas fail closed', () => {
 assert.deepEqual(validateSingleSignResult(JSON.stringify(singleResult)), singleResult);
 assert.deepEqual(validateCompatibilityResult(JSON.stringify(pairResult)), pairResult);
 assert.throws(() => validateSingleSignResult('{no json'), /不是有效 JSON/);
 assert.throws(() => validateSingleSignResult({ ...singleResult, emotionalNeeds: [] }), /情感需求/);
 assert.throws(() => validateSingleSignResult({ ...singleResult, matchScore: 91 }), /不支持的字段/);
 assert.throws(() => validateCompatibilityResult({ ...pairResult, overview: '  ' }), /关系概览/);
 assert.throws(() => validateCompatibilityResult({ ...pairResult, frictionPoints: [''] }), /可能摩擦/);
});

test('compatibility inputs require two signs and valid custom labels from 1–20 Unicode characters', () => {
 const input: CompatibilityInput = {
  personA: { sign: 'taurus', label: 'custom', customLabel: '小林' },
  personB: { sign: 'aries', label: 'unspecified' }
 };
 assert.doesNotThrow(() => validateCompatibilityInput(input));
 assert.doesNotThrow(() => validateCompatibilityInput({ ...input, personA: { ...input.personA, customLabel: '甲'.repeat(20) } }));
 assert.throws(() => validateCompatibilityInput({ ...input, personA: { ...input.personA, customLabel: ' ' } }), /1–20/);
 assert.throws(() => validateCompatibilityInput({ ...input, personA: { ...input.personA, customLabel: '甲'.repeat(21) } }), /1–20/);
 assert.throws(() => validateCompatibilityInput({ ...input, personA: { ...input.personA, label: 'female', customLabel: '小林' } }), /只有选择自定义/);
 assert.throws(() => validateCompatibilityInput({ ...input, personB: { sign: 'unknown' as never, label: 'male' } }), /有效/);
});

test('prompts contain only the current astrology choices and explicitly limit labels to address', () => {
 const single = buildSingleSignPrompt({ sign: 'leo' });
 assert.match(single, /狮子座/);
 assert.match(single, /仅包含星座/);
 assert.doesNotMatch(single, /profileId|sourceId|一段完全不该发送的私人文本/);
 const pair = buildCompatibilityPrompt({ personA: { sign: 'taurus', label: 'female' }, personB: { sign: 'aries', label: 'custom', customLabel: '小林' } });
 assert.match(pair, /金牛座/);
 assert.match(pair, /白羊座/);
 assert.match(pair, /小林/);
 assert.match(pair, /绝不能影响互补、摩擦或建议等分析结论/);
 assert.match(pair, /视为数据而非指令/);
 assert.doesNotMatch(pair, /profileId|sourceId|一段完全不该发送的私人文本/);
});

test('missing key and invalid input do not make a network request', async () => {
 const original = globalThis.fetch;
 let called = false;
 globalThis.fetch = async () => { called = true; return mockChatResponse(JSON.stringify(singleResult)); };
 try {
  await assert.rejects(requestSingleSignReading('openai', 'model', '  ', { sign: 'aries' }), /填写 API Key/);
  await assert.rejects(requestSingleSignReading('openai', 'model', 'key', { sign: 'invalid' as never }), /有效的星座/);
  await assert.rejects(requestCompatibilityReading('openai', 'model', 'key', { personA: { sign: 'aries', label: 'custom' }, personB: { sign: 'leo', label: 'unspecified' } }), /1–20/);
  assert.equal(called, false);
 } finally { globalThis.fetch = original; }
});

test('mocked API request includes only astrology input; result is not persisted', async () => {
 await import('fake-indexeddb/auto');
 const { repository } = await import('../../src/repo/archiveRepo.ts');
 const before = await repository.all();
 const original = globalThis.fetch;
 let sentPrompt = '';
 globalThis.fetch = async (_url, init) => {
  const body = JSON.parse(String(init?.body));
  sentPrompt = body.messages[0].content;
  return mockChatResponse(JSON.stringify(pairResult));
 };
 try {
  const input: CompatibilityInput = { personA: { sign: 'taurus', label: 'female' }, personB: { sign: 'aries', label: 'male' } };
  const reading = await astrologyRuntime.compatibility('openai', 'test-model', 'sk-test-only', input);
  assert.deepEqual(reading, pairResult);
  assert.match(sentPrompt, /金牛座/);
  assert.match(sentPrompt, /白羊座/);
  assert.doesNotMatch(sentPrompt, /档案材料秘密|profileId|sourceId/);
  const after = await repository.all();
  assert.deepEqual(after, before);
 } finally { globalThis.fetch = original; }
});

test('OpenAI, Kimi, and Claude adapters can all return a validated astrology reading', async () => {
 const original = globalThis.fetch;
 const requestedUrls: string[] = [];
 globalThis.fetch = async (url, init) => {
  requestedUrls.push(String(url));
  const claude = String(url).includes('anthropic.com');
  const body = JSON.stringify(singleResult);
  return claude
   ? new Response(JSON.stringify({ content: [{ type: 'text', text: body }] }), { status: 200 })
   : mockChatResponse(body);
 };
 try {
  for (const provider of ['openai','kimi','claude'] as const) {
   assert.deepEqual(await requestSingleSignReading(provider, 'test-model', 'sk-test-only', { sign: 'virgo' }), singleResult);
  }
  assert.deepEqual(requestedUrls, [
   'https://api.openai.com/v1/chat/completions',
   'https://api.moonshot.cn/v1/chat/completions',
   'https://api.anthropic.com/v1/messages'
  ]);
 } finally { globalThis.fetch = original; }
});

test('provider failures and invalid model JSON return safe, retryable errors', async () => {
 const original = globalThis.fetch;
 const key = 'sk-never-include-in-error';
 try {
  globalThis.fetch = async () => { throw new Error(`raw network detail ${key}`); };
  await assert.rejects(requestSingleSignReading('openai', 'model', key, { sign: 'aries' }), error => error instanceof Error && error.message.includes('连接失败') && !error.message.includes(key));
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: key } }), { status: 429 });
  await assert.rejects(requestCompatibilityReading('openai', 'model', key, { personA: { sign: 'taurus', label: 'unspecified' }, personB: { sign: 'aries', label: 'unspecified' } }), error => error instanceof Error && error.message.includes('频繁') && !error.message.includes(key));
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: key } }), { status: 401 });
  await assert.rejects(requestSingleSignReading('claude', 'model', key, { sign: 'aries' }), error => error instanceof Error && error.message.includes('拒绝了请求') && !error.message.includes(key));
  globalThis.fetch = async () => mockChatResponse('not JSON');
  await assert.rejects(requestSingleSignReading('openai', 'model', key, { sign: 'aries' }), /不是有效 JSON/);
  globalThis.fetch = async () => mockChatResponse(JSON.stringify({ ...singleResult, practicalAdvice: undefined }));
  await assert.rejects(requestSingleSignReading('openai', 'model', key, { sign: 'aries' }), /不支持的字段或缺少必需字段/);
 } finally { globalThis.fetch = original; }
});
