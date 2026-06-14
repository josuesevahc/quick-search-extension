# Checklist de Envio para a Chrome Web Store

Idioma: [English](CHROME_WEB_STORE_SUBMISSION_CHECKLIST.md) | Português (Brasil)

Navegação: [README em português](../../README.pt-BR.md) | [Guia de instalação para testes](USER_TESTING_INSTALL_GUIDE.pt-BR.md) | [Política de privacidade](PRIVACY_POLICY.md) | [Auditoria de segurança](../security/EXTENSION_SECURITY_AUDIT.md)

Use este checklist para o primeiro envio do Quick Search.

## Decisão de Release

Visibilidade recomendada para a primeira release: Não listado.

Motivo:

Não listado permite um fluxo real de revisão e instalação pela Chrome Web Store sem descoberta pública ampla. Mude para Público depois que o pacote, a listagem, a URL da política de privacidade, as capturas de tela e o resultado da revisão forem verificados.

Privado é apropriado somente para um piloto interno fechado. Público é razoável depois que a primeira release não listada aceita for testada.

## Verificações Antes do Envio

- [ ] Confirme que a árvore de trabalho não contém segredos, chaves privadas CRX, arquivos `.env`, credenciais OAuth ou materiais de assinatura gerados.
- [ ] Execute `npm install`.
- [ ] Execute `npm run release:check`.
- [ ] Execute `npm run release:zip`.
- [ ] Confirme que o ZIP existe em `release/`.
- [ ] Confirme que a raiz do ZIP contém `manifest.json`.
- [ ] Confirme que `manifest.json` solicita apenas `storage`.
- [ ] Confirme que `host_permissions` está vazio.
- [ ] Confirme que não há `chrome_settings_overrides`.
- [ ] Confirme que não há `chrome_url_overrides`.
- [ ] Confirme que não há chave `omnibox`.
- [ ] Confirme que não há content scripts.
- [ ] Confirme que a extensão não usa código remoto hospedado.
- [ ] Confirme que source maps, testes, docs, configuração local ou `node_modules` não estão incluídos no ZIP.
- [ ] Complete os testes manuais em `docs/release/TEST_INSTRUCTIONS.md`.

## Build de Teste no GitHub Release

- [ ] Crie uma tag GitHub para a versão da release.
- [ ] Crie um GitHub Release a partir dessa tag.
- [ ] Anexe o ZIP gerado em `release/` ao GitHub Release.
- [ ] Verifique se o link de download do README aponta para a página de GitHub Releases.
- [ ] Verifique se `docs/release/USER_TESTING_INSTALL_GUIDE.md` explica download, descompactação, instalação, atualização, remoção, solução de problemas e notas de privacidade.
- [ ] Verifique se `docs/release/USER_TESTING_INSTALL_GUIDE.pt-BR.md` contém orientação equivalente em português.
- [ ] Confirme que o ZIP gerado permanece ignorado ou não rastreado e não é commitado no repositório.

## Regra de Documentação Bilíngue

Qualquer alteração em documentação voltada a usuários, release, privacidade, listagem da loja, guia de instalação ou README deve atualizar os documentos em inglês e português juntos. Se apenas um idioma for atualizado, a tarefa está incompleta.

Inglês continua sendo o idioma principal do repositório, e a documentação em português deve permanecer equivalente para usuários finais. Contrapartes em português dos documentos de release usam a convenção de nomes `*.pt-BR.md` ao lado do arquivo original em inglês.

## Política de Privacidade

- [ ] Publique `docs/release/PRIVACY_POLICY.md` em uma URL pública estável.
- [ ] Adicione a URL da política de privacidade no Chrome Developer Dashboard.
- [ ] Confirme que a política declara que os termos de busca são enviados ao provedor selecionado pelo usuário quando ele envia uma busca.
- [ ] Confirme que a política declara que o desenvolvedor não recebe termos de busca ou configurações.

## Listagem da Loja

- [ ] Use o rascunho de listagem em `docs/release/STORE_LISTING_DRAFT.md`.
- [ ] Mantenha a descrição precisa e restrita.
- [ ] Não afirme que a extensão altera o mecanismo de busca padrão do Chrome.
- [ ] Não afirme busca privada ou anônima em provedores de terceiros.
- [ ] Mencione que as buscas são iniciadas pelo usuário a partir do popup.
- [ ] Mencione que a extensão não solicita host permissions.
- [ ] Prepare capturas de tela sem dados pessoais.
- [ ] Garanta que o idioma da UI nas capturas corresponda ao idioma da listagem ou seja explicado por ela.

## Aba de Práticas de Privacidade

- [ ] Informe a declaração de propósito único de `docs/release/PERMISSIONS_JUSTIFICATION.md`.
- [ ] Justifique `storage`.
- [ ] Confirme que nenhuma host permission está listada.
- [ ] Confirme que dados não são vendidos.
- [ ] Confirme que dados não são usados para finalidades não relacionadas.
- [ ] Confirme que dados não são usados para análise de crédito ou empréstimo.
- [ ] Informe que os termos de busca enviados são incluídos na URL aberta no provedor selecionado pelo usuário se o dashboard perguntar sobre transmissão para fora do dispositivo.

## Etapas Manuais no Dashboard

1. Abra o Chrome Developer Dashboard.
2. Crie um novo item.
3. Envie `release/quick-search-extension-1.0.0.zip`.
4. Complete os campos da listagem usando `docs/release/STORE_LISTING_DRAFT.md`.
5. Envie capturas de tela e assets de ícone.
6. Defina a categoria como Produtividade.
7. Complete as práticas de privacidade usando `docs/release/PERMISSIONS_JUSTIFICATION.md`.
8. Adicione a URL hospedada da política de privacidade.
9. Defina a visibilidade como Não listado para a primeira release revisada.
10. Envie para revisão.
11. Depois da aprovação, instale pela listagem da Web Store e repita os testes manuais.
12. Mude a visibilidade para Público somente depois que as verificações de instalação e divulgação passarem.

## Google Cloud Project

Não é necessário para a release atual.

Quick Search não usa OAuth, Google APIs, Firebase, serviços de backend ou a Chrome Web Store Publish API.

## Chrome Web Store Publish API

Não é necessária para a release atual.

Use envio manual pelo Developer Dashboard para a v1. Considere a Publish API somente depois que o processo manual de release estiver estável e houver necessidade de publicação automatizada.

## Status do Envio

Pronto para o primeiro envio depois que:

- as verificações automatizadas de release passarem,
- o ZIP for gerado por `npm run release:zip`,
- a política de privacidade estiver hospedada em uma URL pública,
- as capturas de tela forem preparadas,
- os testes manuais no Chrome passarem.
