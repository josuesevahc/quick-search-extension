# Quick Search

[English](README.md)

Quick Search é uma extensão Chromium Manifest V3 para alternar entre buscadores internos e abrir pesquisas a partir de um popup compacto.

A extensão mantém sua própria lista de provedores, monta URLs a partir de templates com `{searchTerms}` e abre buscas na aba atual ou em uma nova aba. Ela não lê conteúdo de páginas, histórico de navegação, cookies, favoritos ou dados de formulários.

Repositório: <https://github.com/josuesevahc/quick-search-extension>

## Funcionalidades

- Campo de busca no popup.
- Lista de buscadores ativos.
- Busca na aba atual ou em nova aba.
- Seleção de buscador padrão interno.
- Preferência temporária de buscador por aba.
- Preferência de tema claro, escuro ou padrão do navegador.
- Ativação e desativação de provedores built-in.
- Adição, edição e remoção de provedores customizados.
- Validação de URLs `https://` com `{searchTerms}`.
- Configurações salvas em `chrome.storage.local`.

## Requisitos

- Node.js 20 ou superior.
- npm 10 ou superior.
- Chrome ou outro navegador Chromium compatível com extensões Manifest V3.

## Instalação Local

```bash
npm install
npm run build
```

Para carregar a extensão:

1. Abra `chrome://extensions`.
2. Ative o "Modo do desenvolvedor".
3. Clique em "Carregar sem compactação".
4. Selecione a pasta `dist` gerada.
5. Fixe o Quick Search na barra de ferramentas do navegador.

## Baixar e Testar

O caminho público preferencial de distribuição é a Chrome Web Store assim que o Quick Search for aprovado.

Antes de a listagem da Chrome Web Store estar disponível, builds de teste podem ser baixadas pelo GitHub Releases:

- [Release mais recente](https://github.com/josuesevahc/quick-search-extension/releases/latest)
- [Release v1.0.0](https://github.com/josuesevahc/quick-search-extension/releases/tag/v1.0.0)
- [Guia de instalação/teste em português](docs/release/USER_TESTING_INSTALL_GUIDE.pt-BR.md)
- [Guia de instalação/teste em inglês](docs/release/USER_TESTING_INSTALL_GUIDE.md)

Baixe o ZIP da release, descompacte o arquivo e carregue a pasta descompactada no Chrome.

Arquivos ZIP de release são distribuídos pelo GitHub Releases e não são versionados no repositório.

## Scripts

```bash
npm run dev
npm run build
npm run icons
npm test
npm run lint
npm run zip
```

- `npm run dev`: gera builds em modo watch.
- `npm run build`: gera a extensão de produção em `dist/`.
- `npm run icons`: gera PNGs a partir de `public/icons/icon.svg`.
- `npm test`: executa testes unitários.
- `npm run lint`: verifica o padrão de código.
- `npm run zip`: gera a extensão e cria um ZIP em `release/`.

## Uso

1. Abra o popup do Quick Search.
2. Digite um termo de busca.
3. Selecione um provedor.
4. Clique em "Buscar na aba atual" ou "Buscar em nova aba" para enviar, ou pressione Enter quando nenhuma sugestão local estiver destacada.
5. Use a página de opções para gerenciar provedores, escolher tema claro/escuro/padrão do navegador e restaurar padrões.

Se as sugestões locais do histórico estiverem ativadas, selecionar uma sugestão apenas preenche o campo. A busca só é executada após uma ação explícita de envio.

Provedores customizados devem usar um template de URL `https://` contendo `{searchTerms}`, por exemplo:

```text
https://example.com/search?q={searchTerms}
```

## Estrutura do Projeto

```text
src/background/   Service worker Manifest V3
src/config/       Metadados, textos de UI e provedores padrão
src/domain/       Validação, seleção e geração de URLs dos provedores
src/manifest/     Template do manifest
src/options/      Página de opções
src/popup/        UI do popup
src/shared/       Utilitários compartilhados de browser, DOM e storage
scripts/          Scripts de build, ícones e empacotamento
tests/            Testes unitários
public/icons/     Asset fonte do ícone
docs/             Documentação técnica complementar
```

## Documentação

- Idioma: [README em inglês](README.md)
- Testes: [Guia de instalação para testes](docs/release/USER_TESTING_INSTALL_GUIDE.pt-BR.md) / [guia em inglês](docs/release/USER_TESTING_INSTALL_GUIDE.md)
- Release: [Checklist de envio para a Chrome Web Store](docs/release/CHROME_WEB_STORE_SUBMISSION_CHECKLIST.pt-BR.md), [checklist em inglês](docs/release/CHROME_WEB_STORE_SUBMISSION_CHECKLIST.md), [instruções de teste](docs/release/TEST_INSTRUCTIONS.md), [rascunho da listagem da loja](docs/release/STORE_LISTING_DRAFT.md) e [revisão de risco da loja](docs/release/STORE_POLICY_RISK_REVIEW.md)
- Privacidade e segurança: [Política de privacidade](docs/release/PRIVACY_POLICY.md), [justificativa de permissões](docs/release/PERMISSIONS_JUSTIFICATION.md) e [auditoria de segurança](docs/security/EXTENSION_SECURITY_AUDIT.md)
- Desenvolvimento: [Manual](docs/manual.md) e [limitações da plataforma](docs/platform-limitations.md)
