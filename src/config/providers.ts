import type { ProviderId } from '../types/domain';
import type { ZodiacSign } from '../types/domain';
export type ProviderConfig={id:ProviderId;label:string;endpoint:string;models:string[];defaultModel:string};
export const providers:ProviderConfig[]=[
{id:'openai',label:'OpenAI',endpoint:'https://api.openai.com/v1/chat/completions',models:['gpt-4o-mini','gpt-4.1-mini'],defaultModel:'gpt-4o-mini'},
{id:'kimi',label:'Kimi',endpoint:'https://api.moonshot.cn/v1/chat/completions',models:['kimi-k2.5'],defaultModel:'kimi-k2.5'},
{id:'claude',label:'Claude',endpoint:'https://api.anthropic.com/v1/messages',models:['claude-haiku-4-5-20251001','claude-sonnet-4-6'],defaultModel:'claude-haiku-4-5-20251001'}
];
export const zodiacSigns: ZodiacSign[] = [
 {id:'aries',name:'白羊座'}, {id:'taurus',name:'金牛座'}, {id:'gemini',name:'双子座'},
 {id:'cancer',name:'巨蟹座'}, {id:'leo',name:'狮子座'}, {id:'virgo',name:'处女座'},
 {id:'libra',name:'天秤座'}, {id:'scorpio',name:'天蝎座'}, {id:'sagittarius',name:'射手座'},
 {id:'capricorn',name:'摩羯座'}, {id:'aquarius',name:'水瓶座'}, {id:'pisces',name:'双鱼座'}
];
export const astrologyDisclaimer = '以下内容基于西方太阳星座文化，仅供娱乐与自我反思；不构成科学评估、心理诊断或可靠预测。';
export const appConfig={dbName:'xingxiang-archive',dbVersion:1,maxPdfBytes:20*1024*1024};
export const maxPromptCharacters=40000;
