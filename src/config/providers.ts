import type { ProviderId } from '../types/domain';
export type ProviderConfig={id:ProviderId;label:string;endpoint:string;models:string[];defaultModel:string};
export const providers:ProviderConfig[]=[
{id:'openai',label:'OpenAI',endpoint:'https://api.openai.com/v1/chat/completions',models:['gpt-4o-mini','gpt-4.1-mini'],defaultModel:'gpt-4o-mini'},
{id:'kimi',label:'Kimi',endpoint:'https://api.moonshot.cn/v1/chat/completions',models:['kimi-k2.5'],defaultModel:'kimi-k2.5'},
{id:'claude',label:'Claude',endpoint:'https://api.anthropic.com/v1/messages',models:['claude-haiku-4-5-20251001','claude-sonnet-4-6'],defaultModel:'claude-haiku-4-5-20251001'}
];
export const appConfig={dbName:'xingxiang-archive',dbVersion:1,maxPdfBytes:20*1024*1024};
export const maxPromptCharacters=40000;
