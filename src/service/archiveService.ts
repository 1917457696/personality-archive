import type { Report } from '../types/domain.ts';
export const markReportsStale=(reports:Report[],profileId:string)=>reports.map(r=>r.profileId===profileId?{...r,stale:true}:r);
export const uid=()=>crypto.randomUUID();

