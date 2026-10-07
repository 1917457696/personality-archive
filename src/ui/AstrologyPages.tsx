import { useState } from 'react';
import type { AstrologyResult, CompatibilityInput, CompatibilityPersonInput, SingleSignInput, ZodiacSignId } from '../types/domain';
import { astrologyDisclaimer, zodiacElementNames, zodiacElementNotes, zodiacSigns } from '../config/providers';

type SingleReading = Extract<AstrologyResult, { kind: 'single' }>;
type PairReading = Extract<AstrologyResult, { kind: 'compatibility' }>;
type SinglePageProps = { onGenerate: (input: SingleSignInput) => void; reading: SingleReading | null; error: string; loading: boolean };
type PairPageProps = { onGenerate: (input: CompatibilityInput) => void; reading: PairReading | null; error: string; loading: boolean };

function SignSelect({ label, value, onChange }: { label: string; value: ZodiacSignId; onChange: (value: ZodiacSignId) => void }) {
 return <label className="field astrology-field">{label}<select value={value} onChange={event => onChange(event.target.value as ZodiacSignId)}>{zodiacSigns.map(sign => <option key={sign.id} value={sign.id}>{sign.name} · {zodiacElementNames[sign.element]}</option>)}</select></label>;
}

function ZodiacElementGuide() {
 return <div className="zodiac-guide"><b>四元素分类</b><span>火象 · 行动与热情</span><span>土象 · 务实与稳定</span><span>风象 · 交流与思考</span><span>水象 · 情感与感受</span><small>这是占星文化中的象征分类，不是对个人性格的科学判断。</small></div>;
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
   <div className="astrology-form-copy"><span>✧</span><div><label>ONE SIGN, ONE REFLECTION</label><h2>选择一个星座</h2><p>这里选的是大家常说的生日星座，也叫太阳星座；不用填写出生时间或地点。</p></div></div>
   <SignSelect label="太阳星座（生日星座）" value={sign} onChange={setSign}/>
   <ZodiacElementGuide/>
   <button className="primary" type="submit" disabled={loading}>✧　{loading ? '生成中…' : '生成关系解读'}</button>
   <p className="astrology-disclaimer">{astrologyDisclaimer}</p>
  </form>
  <ResultNotice error={error} loading={loading}/>
  {reading && <section className="astrology-report">
   <div className="astrology-report-heading"><div><label>AN EXPLORATORY READING</label><h2>{zodiacSigns.find(item => item.id === reading.input.sign)!.name} · {zodiacElementNames[zodiacSigns.find(item => item.id === reading.input.sign)!.element]}关系手记</h2><p>{zodiacElementNotes[zodiacSigns.find(item => item.id === reading.input.sign)!.element]}</p></div><span>✦</span></div>
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
  <SignSelect label="太阳星座（生日星座）" value={value.sign} onChange={sign => onChange({ ...value, sign })}/>
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
 const signWithElement = (id: ZodiacSignId) => { const sign = zodiacSigns.find(item => item.id === id)!; return `${sign.name}（${zodiacElementNames[sign.element]}）`; };
 return <div className="astrology-page">
  <section className="astrology-intro"><p className="eyebrow">A NOTE ON THE ZODIAC　✦　02</p><h1>双人配对</h1><p>把两种星座意象放在一起，观察可能的互补、摩擦与沟通入口。</p></section>
  <form className="astrology-form" onSubmit={event => { event.preventDefault(); onGenerate(pairInput); }}>
   <div className="astrology-form-copy"><span>☾</span><div><label>TWO SIGNS, A SHARED DYNAMIC</label><h2>选择两个人的星座</h2><p>选择大家常说的生日星座（太阳星座）；下拉选项也会标出对应元素。</p></div></div>
   <ZodiacElementGuide/>
   <div className="pair-fields" style={{ alignItems: 'start' }}><PersonFields title="甲方" value={personA} onChange={setPersonA}/><span className="pair-mark">＋</span><PersonFields title="乙方" value={personB} onChange={setPersonB}/></div>
   <button className="primary" type="submit" disabled={loading || invalidCustom}>✧　{loading ? '生成中…' : '生成配对手记'}</button>
   <p className="astrology-disclaimer">{astrologyDisclaimer}</p>
  </form>
  <ResultNotice error={error} loading={loading}/>
  {reading && <section className="astrology-report">
   <div className="astrology-report-heading"><div><label>AN EXPLORATORY READING</label><h2>{signWithElement(reading.input.personA.sign)} × {signWithElement(reading.input.personB.sign)}</h2><p>{displayLabel(reading.input.personA)}　与　{displayLabel(reading.input.personB)}</p></div><span>✦</span></div>
   <div className="pair-overview"><label>关系概览</label><p>{reading.result.overview}</p></div>
   <div className="astrology-result-grid"><ResultList title="可能的互补" items={reading.result.complementaryDynamics}/><ResultList title="可能的摩擦" items={reading.result.frictionPoints}/><ResultList title="相处建议" items={reading.result.practicalAdvice}/></div>
   <p className="astrology-disclaimer">{astrologyDisclaimer}</p>
  </section>}
 </div>;
}
