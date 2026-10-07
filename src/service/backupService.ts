import type { ArchiveData } from '../types/domain.ts';
export function exportBackup(data:ArchiveData){return new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),data},null,2)],{type:'application/json'})}
export async function readBackup(file:File):Promise<ArchiveData>{const parsed=JSON.parse(await file.text());const d=parsed?.data;if(!d||!Array.isArray(d.profiles)||!Array.isArray(d.sources)||!Array.isArray(d.reports))throw new Error('备份文件格式不正确。');return d}
export function conflicts(local:ArchiveData,incoming:ArchiveData){const ids=new Set([...local.profiles,...local.sources,...local.reports].map(x=>x.id));return[...incoming.profiles,...incoming.sources,...incoming.reports].filter(x=>ids.has(x.id)).map(x=>({id:x.id,label:'name'in x?x.name:'title'in x?x.title:'报告',kind:'name'in x?'档案':'title'in x?'材料':'报告'}))}

