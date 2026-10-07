import type { ArchiveData,Profile,Source,ProviderId } from '../types/domain';
import { repository } from '../repo/archiveRepo';
import { extractPdf } from '../service/pdfService';
import { requestReport,preflightReport } from '../service/reportService';
import { exportBackup,readBackup,conflicts } from '../service/backupService';
import { markReportsStale,uid } from '../service/archiveService';
export const archiveRuntime={
 load:()=>repository.all(),
 async saveProfile(name:string,previous?:Profile){const now=Date.now();const p=previous?{...previous,name,updatedAt:now}:{id:uid(),name,createdAt:now,updatedAt:now};await repository.saveProfile(p);return p},
 deleteProfile:(id:string)=>repository.deleteProfile(id),
 async saveText(profileId:string,title:string,text:string,previous?:Source){if(previous?.kind==='pdf')throw new Error('PDF 原文按页只读，请新增文字材料来补充笔记。');const now=Date.now();const s=previous?{...previous,title,text,updatedAt:now}:{id:uid(),profileId,kind:'text' as const,title,text,createdAt:now,updatedAt:now};await repository.saveSource(s);await this.markStale(profileId);return s},
 async addPdf(file:File,profileId:string){const s=await extractPdf(file,profileId);await repository.saveSource(s);await this.markStale(profileId);return s},
 async deleteSource(source:Source){await repository.deleteSource(source.id);await this.markStale(source.profileId)},
 async markStale(profileId:string){const all=await repository.all();for(const r of markReportsStale(all.reports,profileId))if(r.profileId===profileId)await repository.saveReport(r)},
 preflight:(sources:Source[])=>preflightReport(sources),
 async generate(provider:ProviderId,model:string,key:string,profileId:string,sources:Source[]){const report=await requestReport(provider,model,key,sources);const saved={...report,profileId};await repository.saveReport(saved);return saved},
 backup:(data:ArchiveData)=>exportBackup(data),readBackup,conflicts,
 merge:(data:ArchiveData,choices:Record<string,'keep'|'replace'>)=>repository.merge(data,choices)
};
