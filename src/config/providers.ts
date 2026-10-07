import type { ProviderId } from '../types/domain';
import type { ZodiacSign } from '../types/domain';
export type ProviderConfig={id:ProviderId;label:string;endpoint:string;models:string[];defaultModel:string};
export const providers:ProviderConfig[]=[
{id:'openai',label:'OpenAI',endpoint:'https://api.openai.com/v1/responses',models:['gpt-6-luna','gpt-6.1-sol','gpt-6-astra'],defaultModel:'gpt-6-luna'},
{id:'kimi',label:'Kimi',endpoint:'https://api.moonshot.cn/v1/chat/completions',models:['kimi-k2.5'],defaultModel:'kimi-k2.5'},
{id:'claude',label:'Claude',endpoint:'https://api.anthropic.com/v1/messages',models:['claude-haiku-4-5-20251001','claude-sonnet-5-5','claude-opus-5-5'],defaultModel:'claude-sonnet-5-5'},
{id:'deepseek',label:'DeepSeek',endpoint:'https://api.deepseek.com/chat/completions',models:['deepseek-flash','deepseek-v4-pro'],defaultModel:'deepseek-flash'}
];
export const zodiacSigns: ZodiacSign[] = [
 {id:'aries',name:'白羊座',element:'fire'}, {id:'taurus',name:'金牛座',element:'earth'}, {id:'gemini',name:'双子座',element:'air'},
 {id:'cancer',name:'巨蟹座',element:'water'}, {id:'leo',name:'狮子座',element:'fire'}, {id:'virgo',name:'处女座',element:'earth'},
 {id:'libra',name:'天秤座',element:'air'}, {id:'scorpio',name:'天蝎座',element:'water'}, {id:'sagittarius',name:'射手座',element:'fire'},
 {id:'capricorn',name:'摩羯座',element:'earth'}, {id:'aquarius',name:'水瓶座',element:'air'}, {id:'pisces',name:'双鱼座',element:'water'}
];
export const zodiacElementNames: Record<ZodiacSign['element'], string> = { fire: '火象', earth: '土象', air: '风象', water: '水象' };
export const zodiacElementNotes: Record<ZodiacSign['element'], string> = { fire: '行动与热情', earth: '务实与稳定', air: '交流与思考', water: '情感与感受' };
export const astrologyDisclaimer = '以下内容基于西方太阳星座文化，仅供娱乐与自我反思；不构成科学评估、心理诊断或可靠预测。';
export const appConfig={dbName:'xingxiang-archive',dbVersion:1,maxPdfBytes:20*1024*1024};
export const maxPromptCharacters=40000;
