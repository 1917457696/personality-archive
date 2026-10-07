export type Source = { id: string; profileId: string; kind: 'text' | 'pdf'; title: string; text: string; pages?: { page: number; text: string }[]; createdAt: number; updatedAt: number };
export type Profile = { id: string; name: string; createdAt: number; updatedAt: number };
export type DimensionKey = 'mbti' | 'enneagram' | 'bigFive';
export type Evidence = { quote: string; sourceId: string; page?: number };
export type Finding = { observation: string; inference: string; alternative: string; evidence: Evidence[] };
export type Report = { id: string; profileId: string; createdAt: number; sourceIds: string[]; dimensions: Record<DimensionKey, Finding[]>; dimensionConclusions?: Partial<Record<DimensionKey, string>>; summary: string; caveat: string; stale: boolean };
export type ArchiveData = { profiles: Profile[]; sources: Source[]; reports: Report[] };
export type ProviderId = 'openai' | 'kimi' | 'claude' | 'deepseek';
export type ZodiacSignId = 'aries'|'taurus'|'gemini'|'cancer'|'leo'|'virgo'|'libra'|'scorpio'|'sagittarius'|'capricorn'|'aquarius'|'pisces';
export type GenderLabel = 'female'|'male'|'custom'|'unspecified';
export type ZodiacElementId = 'fire' | 'earth' | 'air' | 'water';
export type ZodiacSign = { id: ZodiacSignId; name: string; element: ZodiacElementId };
export type SingleSignInput = { sign: ZodiacSignId };
export type CompatibilityPersonInput = { sign: ZodiacSignId; label: GenderLabel; customLabel?: string };
export type CompatibilityInput = { personA: CompatibilityPersonInput; personB: CompatibilityPersonInput };
export type SingleSignResult = {
 relationshipTendencies: string[];
 emotionalNeeds: string[];
 fittingPartnerTraits: string[];
 frictionPoints: string[];
 practicalAdvice: string[];
};
export type CompatibilityResult = {
 overview: string;
 complementaryDynamics: string[];
 frictionPoints: string[];
 practicalAdvice: string[];
};
export type AstrologyResult =
 | { kind: 'single'; input: SingleSignInput; result: SingleSignResult }
 | { kind: 'compatibility'; input: CompatibilityInput; result: CompatibilityResult };
