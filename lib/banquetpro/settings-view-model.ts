import { getDefaultBusinessSettings } from './settings';
import { getDefaultTemplates } from './templates';

export interface SettingsPageViewModel {
  business: {
    businessName: string;
    address: string;
    phone?: string;
    email?: string;
    currencyCode: string;
    taxRate: number;
    gratuityRate: number;
    timezone: string;
  };
  branding: {
    appName: string;
    shortName: string;
    businessName: string;
    logoUrl?: string;
    printLogoUrl?: string;
    sidebarLogoUrl?: string;
    icon192Url?: string;
    icon512Url?: string;
    themeColor?: string;
    backgroundColor?: string;
  };
  templates: Array<{
    id: string;
    key: string;
    name: string;
    description?: string;
    active: boolean;
  }>;
}

export function buildDefaultSettingsPageViewModel(): SettingsPageViewModel {
  const settings = getDefaultBusinessSettings();
  const templates = getDefaultTemplates();

  return {
    business: {
      businessName: settings.profile.businessName,
      address: settings.profile.address,
      phone: settings.profile.phone,
      email: settings.profile.email,
      currencyCode: settings.profile.currencyCode,
      taxRate: settings.profile.taxRate,
      gratuityRate: settings.profile.gratuityRate,
      timezone: settings.profile.timezone,
    },
    branding: {
      appName: settings.branding.appName,
      shortName: settings.branding.shortName,
      businessName: settings.branding.businessName,
      logoUrl: settings.branding.logoUrl,
      printLogoUrl: settings.branding.printLogoUrl,
      sidebarLogoUrl: settings.branding.sidebarLogoUrl,
      icon192Url: settings.branding.icon192Url,
      icon512Url: settings.branding.icon512Url,
      themeColor: settings.branding.themeColor,
      backgroundColor: settings.branding.backgroundColor,
    },
    templates: templates.map((template) => ({
      id: template.id,
      key: template.key,
      name: template.name,
      description: template.description,
      active: template.active,
    })),
  };
}
