# Guia de Instalação para Testes de Usuário

Idioma: [English](USER_TESTING_INSTALL_GUIDE.md) | Português (Brasil)

Navegação: [README em português](../../README.pt-BR.md) | [Checklist de envio para a Chrome Web Store](CHROME_WEB_STORE_SUBMISSION_CHECKLIST.pt-BR.md)

Este guia é para testes manuais antes da publicação na loja.

O caminho público recomendado para distribuir o Quick Search é a Chrome Web Store. Até que a extensão seja aprovada e listada lá, testadores podem baixar um ZIP de teste em GitHub Releases e carregá-lo manualmente no Chrome.

## Baixar a Build de Teste

- [Release mais recente](https://github.com/josuesevahc/quick-search-extension/releases/latest)
- [Release v1.0.0](https://github.com/josuesevahc/quick-search-extension/releases/tag/v1.0.0)
- [Todas as releases](https://github.com/josuesevahc/quick-search-extension/releases)

Baixe o asset `.zip` anexado à release, descompacte o arquivo no seu computador e carregue a pasta descompactada da extensão no Chrome.

Importante: o Chrome não carrega o ZIP diretamente. Você precisa descompactar o arquivo primeiro e depois selecionar a pasta descompactada da extensão.

## Instalar no Chrome

1. Abra o Chrome.
2. Acesse `chrome://extensions`.
3. Ative o "Modo do desenvolvedor".
4. Clique em "Carregar sem compactação".
5. Selecione a pasta descompactada da extensão.
6. Fixe o Quick Search na barra de ferramentas do Chrome.
7. Abra o popup do Quick Search.
8. Digite um termo de busca, escolha um provedor e teste a abertura das buscas.

## Atualizar para uma Build de Teste Mais Nova

1. Baixe o ZIP mais novo em GitHub Releases.
2. Descompacte o novo ZIP.
3. Substitua a pasta descompactada anterior pela pasta mais nova.
4. Abra `chrome://extensions`.
5. Encontre o Quick Search.
6. Clique no botão de recarregar da extensão.
7. Abra o popup e confirme que a nova build funciona.

Se o Chrome ainda mostrar a build antiga, remova a extensão e carregue novamente a pasta descompactada mais nova.

## Remover a Build de Teste

1. Abra `chrome://extensions`.
2. Encontre o Quick Search.
3. Clique em "Remover".
4. Confirme a remoção.

Você também pode apagar a pasta descompactada da extensão do seu computador depois de removê-la do Chrome.

## Solução de Problemas

### O Chrome diz que o pacote é inválido

Você provavelmente selecionou o arquivo ZIP em vez da pasta descompactada. Descompacte o arquivo primeiro, depois clique em "Carregar sem compactação" e selecione a pasta extraída.

### O Chrome não mostra o Quick Search depois do carregamento

Verifique se você selecionou a pasta que contém `manifest.json`. Se você selecionou uma pasta acima dela, o Chrome pode não encontrar a extensão.

### O botão "Carregar sem compactação" não aparece

O Modo do desenvolvedor provavelmente está desativado. Abra `chrome://extensions` e ative o "Modo do desenvolvedor" na área superior direita da página.

### A extensão está instalada, mas não aparece

O Quick Search pode não estar fixado. Clique no ícone de extensões na barra de ferramentas do Chrome, encontre o Quick Search e fixe a extensão.

### A build antiga ainda está carregada

O Chrome pode ainda estar usando a pasta descompactada anterior. Substitua a pasta antiga e clique em recarregar em `chrome://extensions`. Se isso não funcionar, remova o Quick Search e carregue novamente a pasta descompactada mais nova.

## Nota de Privacidade

O Quick Search abre uma URL de busca somente depois que você digita uma consulta e envia uma busca.

Seus termos de busca vão para o provedor de busca que você selecionou, como Google, Bing, DuckDuckGo ou outro provedor, como parte da navegação normal na web. O Quick Search não coleta, vende ou compartilha dados de usuários com o desenvolvedor da extensão.
