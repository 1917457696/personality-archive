export type Source = { id: string; profileId: string; kind: 'text' | 'pdf'; title: string; text: string; pages?: { page: number; text: string }[]; createdAt: number; updatedAt: number };
export type Profile = { id: string; name: string; createdAt: number; updatedAt: number };
export type DimensionKey = 'mbti' | 'enneagram' | 'bigFive';
export type Evidence = { quote: string; sourceId: string; page?: number };
export type Finding = { observation: string; inference: string; alternative: string; evidence: Evidence[] };
export type Report = { id: string; profileId: string; createdAt: number; sourceIds: string[]; dimensions: Record<DimensionKey, Finding[]>; summary: string; caveat: string; stale: boolean };
export type ArchiveData = { profiles: Profile[]; sources: Source[]; reports: Report[] };
export type ProviderId = 'openai' | 'kimi' | 'claude';
