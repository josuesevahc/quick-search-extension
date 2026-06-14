import { SearchProvider } from './provider';

type ProviderSelectionInput = {
  providers: SearchProvider[];
  defaultProviderId: string | null;
  tabProviderId?: string | null;
};

export function getEffectiveProvider({
  providers,
  defaultProviderId,
  tabProviderId,
}: ProviderSelectionInput): SearchProvider | null {
  const activeProviders = providers.filter(provider => provider.enabled);

  if (tabProviderId) {
    const tabProvider = activeProviders.find(provider => provider.id === tabProviderId);
    if (tabProvider) return tabProvider;
  }

  if (defaultProviderId) {
    const defaultProvider = activeProviders.find(provider => provider.id === defaultProviderId);
    if (defaultProvider) return defaultProvider;
  }

  return activeProviders[0] ?? null;
}
