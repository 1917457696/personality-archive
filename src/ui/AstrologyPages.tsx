import { useState } from 'react';
import type { AstrologyResult, CompatibilityInput, CompatibilityPersonInput, SingleSignInput, ZodiacSignId } from '../types/domain';
import { astrologyDisclaimer, zodiacSigns } from '../config/providers';

type SingleReading = Extract<AstrologyResult, { kind: 'single' }>;
type PairReading = Extract<AstrologyResult, { kind: 'compatibility' }>;
type SinglePageProps = { onGenerate: (input: SingleSignInput) => void; reading: SingleReading | null; error: string; loading: boolean };
type PairPageProps = { onGenerate: (input: CompatibilityInput) => void; reading: PairReading | null; error: string; loading: boolean };

function SignSelect({ label, value, onChange }: { label: string; value: ZodiacSignId; onChange: (value: ZodiacSignId) => void }) {
 return <label className="field astrology-field">{label}<select value={value} onChange={event => onChange(event.target.value as ZodiacSignId)}>{zodiacSigns.map(sign => <option key={sign.id} value={sign.id}>{sign.name}</option>)}</select></label>;
}

function ResultList({ title, items }: { title: string; items: string[] }) {
 return <section className="astrology-result-section"><h3>{title}</h3><ul>{items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></section>;
}

function ResultNotice({ error, loading }: { error: string; loading: boolean }) {
 if (loading) return <div className="astrology-loading" role="status">✧ 正在整理这份星象手记…</div>;
 if (error) return <div className="astrology-error" role="alert">{error}<small>输入已保留，你可以检查设置后重试。</small></div>;
 return null;
}

export function SingleAstrologyPage({ onGenerate, reading, error, loading }: SinglePageProps) {
 const [sign, setSign] = useState<ZodiacSignId>('aries');
 return <div className="astrology-page">
  <section className="astrology-intro"><p className="eyebrow">A NOTE ON THE ZODIAC　✦　01</p><h1>单星分析</h1><p>从太阳星座的文化意象出发，看看亲密关系中的倾向、需要与相处方式。</p></section>
  <form className="astrology-form" onSubmit={event => { event.preventDefault(); onGenerate({ sign }); }}>
   <div className="astrology-form-copy"><span>✧</span><div><label>ONE SIGN, ONE REFLECTION</label><h2>选择一个星座</h2><p>不需要出生日期、时间或地点。</p></div></div>
   <SignSelect label="太阳星座" value={sign} onChange={setSign}/>
   <button className="primary" type="submit" disabled={loading}>✧　{loading ? '生成中…' : '生成关系解读'}</button>
   <p className="astrology-disclaimer">{astrologyDisclaimer}</p>
  </form>
  <ResultNotice error={error} loading={loading}/>
  {reading && <section className="astrology-report">
   <div className="astrology-report-heading"><div><label>AN EXPLORATORY READING</label><h2>{zodiacSigns.find(item => item.id === reading.input.sign)!.name} · 关系手记</h2></div><span>✦</span></div>
   <div className="astrology-result-grid">
    <ResultList title="关系倾向" items={reading.result.relationshipTendencies}/>
    <ResultList title="情感需求" items={reading.result.emotionalNeeds}/>
    <ResultList title="适合的伴侣特质" items={reading.result.fittingPartnerTraits}/>
    <ResultList title="常见磨合点" items={reading.result.frictionPoints}/>
    <ResultList title="相处建议" items={reading.result.practicalAdvice}/>
   </div>
   <p className="astrology-disclaimer">{astrologyDisclaimer}</p>
  </section>}
 </div>;
}

function PersonFields({ title, value, onChange }: { title: string; value: CompatibilityPersonInput; onChange: (person: CompatibilityPersonInput) => void }) {
 const count = Array.from(value.customLabel?.trim() || '').length;
 const customInvalid = value.label === 'custom' && (count < 1 || count > 20);
 return <fieldset className="person-sign-fields"><legend>{title}</legend>
  <SignSelect label="太阳星座" value={value.sign} onChange={sign => onChange({ ...value, sign })}/>
  <label className="field astrology-field">称呼（可选）<select value={value.label} onChange={event => onChange({ ...value, label: event.target.value as CompatibilityPersonInput['label'], customLabel: undefined })}>
   <option value="unspecified">不指定</option><option value="female">女</option><option value="male">男</option><option value="custom">自定义</option>
  </select></label>
  {value.label === 'custom' && <label className="field astrology-field">自定义称呼<input value={value.customLabel || ''} onChange={event => onChange({ ...value, customLabel: event.target.value })} aria-invalid={customInvalid} aria-describedby={`${title}-label-count`} placeholder="例如：小林"/><small id={`${title}-label-count`} className={customInvalid ? 'field-count invalid' : 'field-count'}>{count}/20 个字符{customInvalid ? ' · 请输入 1–20 个字符' : ''}</small></label>}
 </fieldset>;
}

function displayLabel(person: CompatibilityPersonInput) {
 if (person.label === 'female') return '女';
 if (person.label === 'male') return '男';
 if (person.label === 'custom') return person.customLabel?.trim() || '自定义';
 return '不指定称呼';
}

export function CompatibilityAstrologyPage({ onGenerate, reading, error, loading }: PairPageProps) {
 const [personA, setPersonA] = useState<CompatibilityPersonInput>({ sign: 'taurus', label: 'unspecified' });
 const [personB, setPersonB] = useState<CompatibilityPersonInput>({ sign: 'aries', label: 'unspecified' });
 const pairInput: CompatibilityInput = { personA, personB };
 const invalidCustom = [personA, personB].some(person => person.label === 'custom' && (() => { const n = Array.from(person.customLabel?.trim() || '').length; return n < 1 || n > 20; })());
 const nameFor = (id: ZodiacSignId) => zodiacSigns.find(sign => sign.id === id)!.name;
 return <div className="astrology-page">
  <section className="astrology-intro"><p className="eyebrow">A NOTE ON THE ZODIAC　✦　02</p><h1>双人配对</h1><p>把两种星座意象放在一起，观察可能的互补、摩擦与沟通入口。</p></section>
  <form className="astrology-form" onSubmit={event => { event.preventDefault(); onGenerate(pairInput); }}>
   <div className="astrology-form-copy"><span>☾</span><div><label>TWO SIGNS, A SHARED DYNAMIC</label><h2>选择两个人的星座</h2><p>称呼只用于文案称谓，不作为配对判断依据。</p></div></div>
   <div className="pair-fields" style={{ alignItems: 'start' }}><PersonFields title="甲方" value={personA} onChange={setPersonA}/><span className="pair-mark">＋</span><PersonFields title="乙方" value={personB} onChange={setPersonB}/></div>
   <button className="primary" type="submit" disabled={loading || invalidCustom}>✧　{loading ? '生成中…' : '生成配对手记'}</button>
   <p className="astrology-disclaimer">{astrologyDisclaimer}</p>
  </form>
  <ResultNotice error={error} loading={loading}/>
  {reading && <section className="astrology-report">
   <div className="astrology-report-heading"><div><label>AN EXPLORATORY READING</label><h2>{nameFor(reading.input.personA.sign)} × {nameFor(reading.input.personB.sign)}</h2><p>{displayLabel(reading.input.personA)}　与　{displayLabel(reading.input.personB)}</p></div><span>✦</span></div>
   <div className="pair-overview"><label>关系概览</label><p>{reading.result.overview}</p></div>
   <div className="astrology-result-grid"><ResultList title="可能的互补" items={reading.result.complementaryDynamics}/><ResultList title="可能的摩擦" items={reading.result.frictionPoints}/><ResultList title="相处建议" items={reading.result.practicalAdvice}/></div>
   <p className="astrology-disclaimer">{astrologyDisclaimer}</p>
  </section>}
 </div>;
}
