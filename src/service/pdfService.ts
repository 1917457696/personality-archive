import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { appConfig } from '../config/providers.ts';
import { extractPages } from './pdfText.ts';
import type { Source } from '../types/domain.ts';
pdfjs.GlobalWorkerOptions.workerSrc=workerUrl;
export async function extractPdf(file:File,profileId:string):Promise<Source>{if(file.size>appConfig.maxPdfBytes)throw new Error('PDF 大于 20 MB，请先压缩或拆分文件。');const doc=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;const pages=await extractPages(doc);if(!pages.length)throw new Error('没有识别到可复制文字。此 PDF 可能是扫描件，请使用带文字层的 PDF 或粘贴文字。');const now=Date.now();return{id:crypto.randomUUID(),profileId,kind:'pdf',title:file.name,text:pages.map(p=>p.text).join('\n\n'),pages,createdAt:now,updatedAt:now}}
