import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface SupportCaseFormProps {
  caseId: string;
}

interface PrefilledData {
  email?: string;
  subject?: string;
  description?: string;
  additionalDetails?: string;
}

// Use the same API base URL logic as in index.tsx
const apiBase = import.meta.env.PROD
  ? 'https://compass-ts.paulchrisluke.workers.dev'
  : 'http://localhost:5173';

const SupportCaseForm: FunctionalComponent<SupportCaseFormProps> = ({ caseId }) => {
  const [form, setForm] = useState<PrefilledData>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Load prefilled data
  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/support-case/${caseId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          email: data.email || '',
          subject: data.subject || '',
          description: data.description || '',
          additionalDetails: data.additionalDetails || ''
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
      const res = await fetch('/api/help-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          caseId,
        })
      });
      if (!res.ok) throw new Error('Failed to submit support case.');
      setSubmitted(true);
    } catch (err) {
      setError('There was an error submitting your support case.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedback = async (rating: number) => {
    setFeedback(rating);
  };

  const handleFeedbackSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      await fetch('/support-case/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          rating: feedback,
          comments: feedbackComment
        })
      });
      setFeedbackSubmitted(true);
    } catch {
      // ignore feedback errors
    }
  };

  // --- UI ---
  if (loading) return <div class="card"><div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>;
  if (error) return <div class="card error-message">{error}</div>;

  return (
    <div class="card support-case-form-card">
      {!submitted ? (
        <form class="support-case-form" onSubmit={handleSubmit}>
          <h2>Review and Submit Your Support Case</h2>
          <label>Email<span class="required">*</span>
            <input
              type="email"
              name="email"
              value={form.email || ''}
              onInput={handleChange}
              required
              class="form-input"
            />
          </label>
          <label>Subject<span class="required">*</span>
            <input
              type="text"
              name="subject"
              value={form.subject || ''}
              onInput={handleChange}
              required
              class="form-input"
            />
          </label>
          <label>Description<span class="required">*</span>
            <textarea
              name="description"
              value={form.description || ''}
              onInput={handleChange}
              required
              class="form-input"
              rows={4}
            />
          </label>
          <label>Additional Details
            <textarea
              name="additionalDetails"
              value={form.additionalDetails || ''}
              onInput={handleChange}
              class="form-input"
              rows={2}
            />
          </label>
          <button type="submit" class="schedule-button" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Support Case'}
          </button>
          {error && <div class="error-message">{error}</div>}
        </form>
      ) : (
        <div class="support-case-confirmation">
          <h3>Thank you!</h3>
          <p>Your support case has been submitted.</p>
          {!feedbackSubmitted ? (
            <form class="feedback-form" onSubmit={handleFeedbackSubmit}>
              <div class="feedback-label">How satisfied were you with your AI support experience?</div>
              <div class="feedback-options">
                {[1,2,3,4,5].map(n => (
                  <button
                    type="button"
                    class={`feedback-emoji${feedback === n ? ' selected' : ''}`}
                    onClick={() => handleFeedback(n)}
                    aria-label={`Rating ${n}`}
                  >
                    {['😡','��','😐','🙂','😃'][n-1]}
                  </button>
                ))}
              </div>
              <textarea
                class="form-input"
                placeholder="Additional comments (optional)"
                value={feedbackComment}
                onInput={e => setFeedbackComment((e.target as HTMLTextAreaElement).value)}
                rows={2}
              />
              <button type="submit" class="schedule-button" disabled={!feedback}>
                Submit Feedback
              </button>
            </form>
          ) : (
            <div class="feedback-thankyou">Thank you for your feedback!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportCaseForm; 