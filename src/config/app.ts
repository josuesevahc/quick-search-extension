export const APP_META = {
  productName: "Quick Search",
  shortName: "Quick Search",
  description: "Alternância rápida entre buscadores."
} as const;

export const UI_TEXT = {
  searchPlaceholder: "Digite sua pesquisa...",
  openSettings: "Configurações",
  defaultProvider: "Padrão",
  setDefaultProvider: "Definir padrão",
  temporaryForTab: "Temporário para esta aba",
  searchCurrentTab: "Buscar na aba atual",
  searchNewTab: "Buscar em nova aba",
  noActiveProviders: "Nenhum buscador ativo.",
  searchTermRequired: "Digite um termo para buscar.",
  providerUnavailable: "Buscador indisponível.",
  providersTitle: "Buscadores disponíveis",
  addProvider: "Adicionar buscador",
  save: "Salvar",
  cancel: "Cancelar",
  edit: "Editar",
  remove: "Remover",
  restoreDefaults: "Restaurar padrões",
  confirmRestoreDefaults: "Deseja restaurar as configurações padrão?",
  confirmRemoveProvider: "Excluir este buscador?",
  providerSaved: "Buscador salvo com sucesso.",
  providerNameLabel: "Nome",
  providerUrlLabel: "URL template (HTTPS)",
  providerUrlHelp: "Use {searchTerms} onde o termo de busca deve entrar.",
  providerUrlPlaceholder: "https://example.com/search?q={searchTerms}",
  invalidUrl: "URL inválida. Deve começar com https:// e conter {searchTerms}.",
  duplicateId: "ID já existe.",
  nameRequired: "Nome é obrigatório.",
  urlRequired: "URL é obrigatória."
} as const;
