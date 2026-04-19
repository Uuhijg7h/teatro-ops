'use client';

import { buildDefaultSettingsPageViewModel } from '../../lib/banquetpro/settings-view-model';

export default function SettingsPage() {
  const vm = buildDefaultSettingsPageViewModel();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage BanquetPro business profile, branding defaults, and document templates from the web app.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Business Profile</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Business:</span> <span className="font-medium text-gray-900">{vm.business.businessName}</span></div>
            <div><span className="text-gray-500">Address:</span> <span className="font-medium text-gray-900">{vm.business.address}</span></div>
            <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{vm.business.phone || '—'}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-900">{vm.business.email || '—'}</span></div>
            <div><span className="text-gray-500">Currency:</span> <span className="font-medium text-gray-900">{vm.business.currencyCode}</span></div>
            <div><span className="text-gray-500">Tax:</span> <span className="font-medium text-gray-900">{Math.round(vm.business.taxRate * 100)}%</span></div>
            <div><span className="text-gray-500">Gratuity:</span> <span className="font-medium text-gray-900">{Math.round(vm.business.gratuityRate * 100)}%</span></div>
            <div><span className="text-gray-500">Timezone:</span> <span className="font-medium text-gray-900">{vm.business.timezone}</span></div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Branding</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">App Name:</span> <span className="font-medium text-gray-900">{vm.branding.appName}</span></div>
            <div><span className="text-gray-500">Short Name:</span> <span className="font-medium text-gray-900">{vm.branding.shortName}</span></div>
            <div><span className="text-gray-500">Business Name:</span> <span className="font-medium text-gray-900">{vm.branding.businessName}</span></div>
            <div><span className="text-gray-500">Theme Color:</span> <span className="font-medium text-gray-900">{vm.branding.themeColor || '—'}</span></div>
            <div><span className="text-gray-500">Background Color:</span> <span className="font-medium text-gray-900">{vm.branding.backgroundColor || '—'}</span></div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Logo, print logo, app icon, and sidebar branding will be connected to uploaded assets next.
          </div>
        </section>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Document Templates</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {vm.templates.map((template) => (
            <div key={template.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{template.name}</div>
                <div className="text-xs text-gray-500">{template.key}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${template.active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                {template.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
