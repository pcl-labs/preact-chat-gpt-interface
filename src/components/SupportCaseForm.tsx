import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface SupportCaseFormProps {
  caseId: string;
  onFeedbackComplete?: () => void;
}

interface PrefilledData {
  name?: string;
  email?: string;
  message?: string;
}

// Use the same API base URL logic as in index.tsx
const apiBase = import.meta.env.PROD
  ? 'https://compass-ts.paulchrisluke.workers.dev'
  : 'http://localhost:5173';

const SupportCaseForm: FunctionalComponent<SupportCaseFormProps> = ({ caseId, onFeedbackComplete }) => {
  const [form, setForm] = useState<PrefilledData>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load prefilled data
  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/support-case/${caseId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name || '',
          email: data.email || '',
          message: data.message || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load case details.');
        setLoading(false);
      });
  }, [caseId]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/help-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message
        })
      });
      if (!res.ok) throw new Error('Failed to submit support case.');
      const data = await res.json().catch(() => ({}));
      setSuccessMessage(data.message || 'Your support case has been submitted.');
      setSubmitted(true);
    } catch (err) {
      setError('There was an error submitting your support case.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedback = async (rating: number) => {
    setFeedback(rating);
    // Immediately submit feedback and end chat
    try {
      await fetch(`${apiBase}/support-case/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          rating,
          comments: feedbackComment
        })
      });
    } catch {}
    setFeedbackSubmitted(true);
    if (typeof onFeedbackComplete === 'function') onFeedbackComplete();
  };

  // --- UI ---
  if (loading) return <div class="card support-case-form-card"><div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>;
  if (error) return <div class="card support-case-form-card error-message">{error}</div>;

  return (
    <div class="time-of-day-selector support-case-form-card">
      {!submitted ? (
        <form class="support-case-form" onSubmit={handleSubmit}>
          <div class="time-selector-title support-case-form-header">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="calendar-icon"><rect x="3" y="7" width="18" height="13" rx="2" ry="2"></rect><path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"></path></svg>
            <h3 class="support-case-form-title">Submit a Support Case</h3>
          </div>
          <div class="support-case-form-field">
            <label class="support-case-form-label">Name<span class="required">*</span></label>
            <input
              type="text"
              name="name"
              value={form.name || ''}
              onInput={handleChange}
              required
              class="form-input"
            />
          </div>
          <div class="support-case-form-field">
            <label class="support-case-form-label">Email<span class="required">*</span></label>
            <input
              type="email"
              name="email"
              value={form.email || ''}
              onInput={handleChange}
              required
              class="form-input"
            />
          </div>
          <div class="support-case-form-field">
            <label class="support-case-form-label">Message<span class="required">*</span></label>
            <textarea
              name="message"
              value={form.message || ''}
              onInput={handleChange}
              required
              class="form-input"
              rows={4}
            />
          </div>
          <button type="submit" class="schedule-button" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Support Case'}
          </button>
          {error && <div class="error-message">{error}</div>}
        </form>
      ) : (
        <div class="support-case-confirmation">
          <div class="support-case-form-header" style={{ justifyContent: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="calendar-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M9 16l2 2 4-4"></path></svg>
          </div>
          <h3 class="support-case-form-title" style={{ textAlign: 'center' }}>Thank you!</h3>
          <p class="feedback-label" style={{ textAlign: 'center' }}>{successMessage || 'Your support case has been submitted.'}</p>
          {!feedbackSubmitted ? (
            <div class="feedback-form">
              <div class="feedback-label">How satisfied were you with your AI support experience?</div>
              <div class="feedback-options">
                {[1,2,3,4,5].map(n => (
                  <button
                    type="button"
                    class={`feedback-emoji${feedback === n ? ' selected' : ''}`}
                    onClick={() => handleFeedback(n)}
                    aria-label={`Rating ${n}`}
                  >
                    {['😡','🙁','😐','🙂','😃'][n-1]}
                  </button>
                ))}
              </div>
              <textarea
                class="form-input"
                placeholder="Additional comments (optional)"
                value={feedbackComment}
                onInput={e => setFeedbackComment((e.target as HTMLTextAreaElement).value)}
                rows={2}
                disabled={feedbackSubmitted}
              />
            </div>
          ) : (
            <div class="feedback-thankyou">Thank you for your feedback!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportCaseForm; 