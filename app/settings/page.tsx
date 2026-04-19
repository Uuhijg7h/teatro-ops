'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { buildDefaultSettingsPageViewModel } from '../../lib/banquetpro/settings-view-model';

export default function SettingsPage() {
  const fallback = buildDefaultSettingsPageViewModel();
  const [vm, setVm] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function load() {
      try {
        const [{ data: orgRows }, { data: templateRows }] = await Promise.all([
          supabase.from('organizations').select('*').limit(1),
          supabase.from('booking_templates').select('*').order('name', { ascending: true }),
        ]);

        const organization = orgRows?.[0];
        if (organization?.id) setOrganizationId(organization.id);

        const templates = (templateRows || []).map((template: any) => ({
          id: template.id,
          key: template.template_key,
          name: template.name,
          description: template.description,
          active: template.active,
        }));

        if (!organization && templates.length === 0) {
          setVm(fallback);
          setLoading(false);
          return;
        }

        setVm({
          business: {
            businessName: organization?.business_name || fallback.business.businessName,
            address: organization?.address || fallback.business.address,
            phone: organization?.phone || fallback.business.phone,
            email: organization?.email || fallback.business.email,
            currencyCode: organization?.currency_code || fallback.business.currencyCode,
            taxRate: Number(organization?.tax_rate ?? fallback.business.taxRate),
            gratuityRate: Number(organization?.gratuity_rate ?? fallback.business.gratuityRate),
            timezone: organization?.timezone || fallback.business.timezone,
          },
          branding: fallback.branding,
          templates: templates.length ? templates : fallback.templates,
        });
      } catch {
        setVm(fallback);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function saveBusinessSettings() {
    setSaving(true);
    try {
      const payload = {
        id: organizationId || undefined,
        business_name: vm.business.businessName,
        address: vm.business.address,
        phone: vm.business.phone,
        email: vm.business.email,
        currency_code: vm.business.currencyCode,
        tax_rate: vm.business.taxRate,
        gratuity_rate: vm.business.gratuityRate,
        timezone: vm.business.timezone,
      };

      const { data } = await supabase.from('organizations').upsert(payload).select('id').single();
      if (data?.id) setOrganizationId(data.id);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage BanquetPro business profile, branding defaults, and document templates from the web app.
          </p>
        </div>
        <button onClick={saveBusinessSettings} disabled={saving || loading} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Business Profile</h2>
          {loading ? <div className="text-sm text-gray-400">Loading business settings...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-gray-600 mb-1">Business Name</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2" value={vm.business.businessName} onChange={(e) => setVm((current) => ({ ...current, business: { ...current.business, businessName: e.target.value } }))} />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Phone</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2" value={vm.business.phone || ''} onChange={(e) => setVm((current) => ({ ...current, business: { ...current.business, phone: e.target.value } }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 mb-1">Address</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2" value={vm.business.address} onChange={(e) => setVm((current) => ({ ...current, business: { ...current.business, address: e.target.value } }))} />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2" value={vm.business.email || ''} onChange={(e) => setVm((current) => ({ ...current, business: { ...current.business, email: e.target.value } }))} />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Currency</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2" value={vm.business.currencyCode} onChange={(e) => setVm((current) => ({ ...current, business: { ...current.business, currencyCode: e.target.value } }))} />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Tax Rate</label>
                <input type="number" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2" value={vm.business.taxRate} onChange={(e) => setVm((current) => ({ ...current, business: { ...current.business, taxRate: Number(e.target.value || 0) } }))} />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Gratuity Rate</label>
                <input type="number" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2" value={vm.business.gratuityRate} onChange={(e) => setVm((current) => ({ ...current, business: { ...current.business, gratuityRate: Number(e.target.value || 0) } }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 mb-1">Timezone</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2" value={vm.business.timezone} onChange={(e) => setVm((current) => ({ ...current, business: { ...current.business, timezone: e.target.value } }))} />
              </div>
            </div>
          )}
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
