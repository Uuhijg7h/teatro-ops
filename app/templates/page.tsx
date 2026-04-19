'use client';

import { getDefaultTemplates } from '../../lib/banquetpro/templates';

export default function TemplatesPage() {
  const templates = getDefaultTemplates();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Document Templates</h1>
        <p className="text-sm text-gray-500 mt-1">
          BanquetPro templates control BEOs, quotes, invoices, run sheets, and booking summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <section key={template.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{template.name}</h2>
                <p className="text-xs text-gray-500 mt-1">{template.description}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${template.active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                {template.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <pre className="p-5 text-xs leading-6 text-gray-700 whitespace-pre-wrap break-words bg-gray-50">{template.content}</pre>
          </section>
        ))}
      </div>
    </div>
  );
}
