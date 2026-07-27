import { FormEvent, useRef, useState } from 'react'
import { advancedFeatureOptions, budgetOptions } from '../data/site'
import { useI18n } from '../i18n/I18nProvider'
import { Button, Container, Icon, SectionLabel } from './Primitives'

type FormValues = {
  name: string
  email: string
  businessName: string
  website: string
  problem: string
  budget: string
  features: string[]
  company: string
}

type FieldName = Exclude<keyof FormValues, 'features'>
type Errors = Partial<Record<FieldName, string>>

const initialValues: FormValues = {
  name: '', email: '', businessName: '', website: '', problem: '', budget: '', features: [], company: '',
}

const requiredFields: FieldName[] = ['name', 'email', 'businessName', 'problem', 'budget']
const fieldOrder: FieldName[] = ['name', 'email', 'businessName', 'website', 'problem', 'budget']

export function ProjectApplication({ compact = false }: { compact?: boolean }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const startedAt = useRef(Date.now())
  const formRef = useRef<HTMLFormElement>(null)
  const { t } = useI18n()

  const validate = () => {
    const next: Errors = {}
    requiredFields.forEach((field) => {
      if (!values[field].trim()) next[field] = t('Please complete this field.')
    })
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = t('Enter a valid email address.')
    if (values.website && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(values.website)) next.website = t('Include the full address, beginning with http:// or https://.')
    setErrors(next)
    const firstError = fieldOrder.find((field) => next[field])
    if (firstError) requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus())
    return !firstError
  }

  const update = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const toggleFeature = (feature: string) => {
    setValues((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return
    if (!validate()) return
    setStatus('submitting')
    setServerMessage('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, startedAt: startedAt.current, source: window.location.href }),
      })
      const result = await response.json().catch(() => ({})) as { message?: string }
      if (!response.ok) throw new Error(result.message || 'The form could not be sent. Please try again.')
      setStatus('success')
      setValues(initialValues)
      setErrors({})
    } catch (error) {
      setStatus('error')
      setServerMessage(error instanceof Error ? error.message : 'The form could not be sent. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <section className={`application-section application-section--success ${compact ? 'application-section--compact' : ''}`} id="apply" aria-labelledby="application-success-title">
        <Container>
          <div className="application-success" role="status">
            <span><Icon name="check" size={24} /></span>
            <SectionLabel>{t('Details received')}</SectionLabel>
            <h2 id="application-success-title">{t('Your project is on our desk.')}</h2>
            <p>{t('SALYIOR will review the context and reply with the most useful next step.')}</p>
            <button type="button" className="arrow-link" onClick={() => { setStatus('idle'); startedAt.current = Date.now() }}>{t('Send another inquiry')} <Icon name="arrow-right" /></button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className={`application-section ${compact ? 'application-section--compact' : ''}`} id="apply" aria-labelledby="application-title">
      <Container>
        <div className="application-panel reveal">
          <div className="application-copy">
            <SectionLabel>{t('Start a project')}</SectionLabel>
            <h2 id="application-title">{t('Tell us what')}<br />{t('needs to change.')}</h2>
            <p>{t('A short brief is enough. We’ll review the opportunity and reply with a focused next step.')}</p>
            <div className="application-signals" aria-label="Project inquiry details">
              <span><i />{t('Projects from $500')}</span>
              <span><i />{t('Remote collaboration worldwide')}</span>
              <span><i />{t('Direct reply from the person building it')}</span>
            </div>
            <a className="application-email" href="mailto:salyiorbusiness@gmail.com">{t('Prefer email?')} <strong>salyiorbusiness@gmail.com</strong> <Icon name="arrow-up-right" /></a>
          </div>

          <form ref={formRef} className="project-form" action="/api/contact" method="post" onSubmit={submit} noValidate>
            <div className="form-heading"><span>{t('Project inquiry')}</span><p>{t('Five useful details. About two minutes.')}</p></div>

            {status === 'error' && <div className="form-error-summary" role="alert"><strong>{t('We couldn’t send your details.')}</strong><p>{serverMessage}</p></div>}

            <div className="form-honeypot" aria-hidden="true">
              <label>Company website<input name="company" value={values.company} onChange={(event) => update('company', event.target.value)} tabIndex={-1} autoComplete="off" /></label>
            </div>

            <div className="form-fields">
              <div className="form-row">
                <Field label={t('Your name')} name="name" value={values.name} error={errors.name} autoComplete="name" placeholder={t('How should we address you?')} onChange={update} />
                <Field label={t('Email')} name="email" type="email" value={values.email} error={errors.email} autoComplete="email" placeholder="you@company.com" onChange={update} />
              </div>
              <div className="form-row">
                <Field label={t('Business or brand')} name="businessName" value={values.businessName} error={errors.businessName} autoComplete="organization" placeholder={t('Company name')} onChange={update} />
                <Field label={t('Current website')} name="website" type="url" value={values.website} error={errors.website} placeholder={t('Optional')} onChange={update} />
              </div>
              <TextAreaField label={t('What are you building—and what should it achieve?')} name="problem" value={values.problem} error={errors.problem} placeholder={t('A few sentences about the business, the current problem and the result you want.')} onChange={update} />
              <fieldset className={`choice-group ${errors.budget ? 'field--error' : ''}`} aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? 'budget-error' : undefined}>
                <legend>{t('Comfortable investment range')}</legend>
                <div className="choice-grid">{budgetOptions.map((option) => <Choice key={option} value={option} label={t(option)} selected={values.budget === option} onChange={update} />)}</div>
                {errors.budget && <span className="field-error" id="budget-error">{errors.budget}</span>}
              </fieldset>
              <fieldset className="choice-group feature-group">
                <legend>{t('Advanced functionality')} <span>{t('Optional')}</span></legend>
                <p>{t('Select anything that may matter. We’ll recommend only what the project needs.')}</p>
                <div className="choice-grid">
                  {advancedFeatureOptions.map((option) => (
                    <FeatureChoice key={option} value={option} label={t(option)} selected={values.features.includes(option)} onChange={toggleFeature} />
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="form-actions">
              <p className="form-privacy">{t('Used only to review and respond to this inquiry.')}</p>
              <Button type="submit" disabled={status === 'submitting'}>{t(status === 'submitting' ? 'Sending…' : 'Send inquiry')} <Icon name="arrow-up-right" /></Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  )
}

type FieldProps = {
  label: string
  name: FieldName
  value: string
  error?: string
  type?: string
  placeholder?: string
  autoComplete?: string
  onChange: (name: FieldName, value: string) => void
}

function Field({ label, name, value, error, type = 'text', placeholder, autoComplete, onChange }: FieldProps) {
  const id = `field-${name}`
  const maxLength = name === 'email' ? 254 : name === 'website' ? 500 : 200
  return <label className={`field ${error ? 'field--error' : ''}`} htmlFor={id}><span>{label}</span><input id={id} name={name} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete} required={requiredFields.includes(name)} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(name, event.target.value)} />{error && <small className="field-error" id={`${id}-error`}>{error}</small>}</label>
}

function TextAreaField({ label, name, value, error, placeholder, onChange }: FieldProps) {
  const id = `field-${name}`
  return <label className={`field ${error ? 'field--error' : ''}`} htmlFor={id}><span>{label}</span><textarea id={id} name={name} value={value} placeholder={placeholder} rows={4} required={requiredFields.includes(name)} maxLength={4000} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(name, event.target.value)} />{error && <small className="field-error" id={`${id}-error`}>{error}</small>}</label>
}

function Choice({ value, label, selected, onChange }: { value: string; label: string; selected: boolean; onChange: (name: FieldName, value: string) => void }) {
  return <label className={`choice ${selected ? 'choice--selected' : ''}`}><input type="radio" name="budget" value={value} checked={selected} required onChange={() => onChange('budget', value)} /><span>{label}</span><i>{selected && <Icon name="check" size={13} />}</i></label>
}

function FeatureChoice({ value, label, selected, onChange }: { value: string; label: string; selected: boolean; onChange: (value: string) => void }) {
  return <label className={`choice feature-choice ${selected ? 'choice--selected' : ''}`}><input type="checkbox" name="features" value={value} checked={selected} onChange={() => onChange(value)} /><span>{label}</span><i>{selected && <Icon name="check" size={13} />}</i></label>
}
