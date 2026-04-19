'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getDefaultTemplates } from '../../lib/banquetpro/templates';

export default function TemplatesPage() {
  const defaults = getDefaultTemplates();
  const [templates, setTemplates] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from('booking_templates').select('*').order('name', { ascending: true });
        if (data && data.length) {
          setTemplates(
            data.map((template: any) => ({
              id: template.id,
              key: template.template_key,
              name: template.name,
              description: template.description,
              active: template.active,
              content: template.content,
            })),
          );
        } else {
          setTemplates(defaults);
        }
      } catch {
        setTemplates(defaults);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function saveTemplate(id: string) {
    const template = templates.find((t) => t.id === id);
    if (!template) return;
    if (!template.name.trim() || !template.content.trim()) {
      setError('Template name and content are required.');
      setMessage('');
      return;
    }

    setSavingId(id);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.from('booking_templates').upsert({
        id: template.id.startsWith('tpl-') ? undefined : template.id,
        organization_id: null,
        template_key: template.key,
        name: template.name,
        description: template.description,
        content: template.content,
        active: template.active,
      });
      if (error) throw error;
      setMessage(`Saved template: ${template.name}`);
    } catch {
      setError(`Could not save template: ${template.name}`);
    } finally {
      setSavingId(null);
    }
  }

  function updateTemplate(id: string, patch: Partial<(typeof templates)[number]>) {
    setTemplates((current) => current.map((template) => (template.id === id ? { ...template, ...patch } : template)));
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Document Templates</h1>
        <p className="text-sm text-gray-500 mt-1">
          BanquetPro templates control BEOs, quotes, invoices, run sheets, and booking summaries.
        </p>
      </div>

      {message ? <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="text-sm text-gray-400">Loading templates...</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <section key={template.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <input
                  className="text-sm font-semibold text-gray-900 bg-transparent border border-gray-200 rounded-lg px-2 py-1 outline-none w-full"
                  value={template.name}
                  onChange={(e) => updateTemplate(template.id, { name: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">{template.key}</p>
              </div>
              <label className="text-xs flex items-center gap-2 text-gray-600">
                <input type="checkbox" checked={template.active} onChange={(e) => updateTemplate(template.id, { active: e.target.checked })} />
                Active
              </label>
            </div>
            <div className="p-5 space-y-3">
              <textarea
                className="w-full min-h-[240px] border border-gray-200 rounded-lg px-3 py-3 text-xs leading-6 text-gray-700"
                value={template.content}
                onChange={(e) => updateTemplate(template.id, { content: e.target.value })}
              />
              <div className="text-xs text-gray-500">Available tokens: {'{{client_name}}'}, {'{{event_title}}'}, {'{{event_date}}'}, {'{{venue_name}}'}, {'{{grand_total}}'}, {'{{balance_due}}'}</div>
              <div className="flex justify-end">
                <button
                  onClick={() => saveTemplate(template.id)}
                  disabled={savingId === template.id}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
                >
                  {savingId === template.id ? 'Saving…' : 'Save Template'}
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
