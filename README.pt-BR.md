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
4. Pressione Enter para buscar na aba atual, ou use Shift+Enter para abrir uma nova aba.
5. Use a página de opções para gerenciar provedores e restaurar padrões.

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

- [Manual](docs/manual.md)
- [Limitações da plataforma](docs/platform-limitations.md)
