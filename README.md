# Minha Cozinha — guia para iniciantes

Painel de cozinha leve, feito para o iPad mini 1 (iOS 9). Funciona sozinho (modo local) ou sincronizado entre PC e iPad (Supabase).

## Arquivos
index.html, style.css, app.js (painel) · supabase-schema.sql (banco) · teste.html (diagnóstico no iPad) · README.md (este guia)

## PARTE 1 — Publicar no GitHub Pages
1. Acesse https://github.com e clique em **Sign up**. Crie a conta (e-mail, senha, nome de usuário) e confirme o e-mail. Anote o nome de usuário.
2. Logado, clique no **+** (canto superior direito) → **New repository**.
3. Em **Repository name** escreva `painel-cozinha`. Marque **Public**. Clique em **Create repository**.
4. Na página do repositório, clique em **uploading an existing file**.
5. No PC, abra a pasta com os arquivos, selecione `index.html`, `style.css`, `app.js`, `teste.html`, `supabase-schema.sql` e `README.md` e arraste para a página (ou use **choose your files**).
6. Role até o fim e clique em **Commit changes**.
7. Clique em **Settings** (aba do repositório) → **Pages** (menu da esquerda).
8. Em **Branch**, escolha **main**, pasta **/ (root)** e clique **Save**.
9. Espere 1 a 2 minutos e atualize a página. O endereço aparece no topo: `https://SEU-USUARIO.github.io/painel-cozinha/`
10. Abra esse endereço no PC e depois no Safari do iPad.

## PARTE 2 — Testar no iPad (faça antes da Parte 3)
Abra `https://SEU-USUARIO.github.io/painel-cozinha/teste.html` no iPad e toque em **Testar**. "OK" significa que o iPad alcança o serviço. "FALHOU" pode ser certificado de segurança antigo ou falta de internet: me conte o resultado e eu proponho alternativa.

## PARTE 3 — Supabase (sincronizar PC e iPad)
1. Acesse https://supabase.com, **Start your project**, entre com GitHub ou e-mail.
2. **New project**: dê um nome, crie uma senha do banco (guarde), escolha região (South America, São Paulo) e crie. Aguarde alguns minutos.
3. Menu **SQL Editor** → **New query** → cole o conteúdo de `supabase-schema.sql` → **Run**. Deve aparecer "Success".
4. Menu **Authentication** → **Providers** → **Email** deve estar ligado. Para facilitar, em **Sign In / Providers** (ou Settings) desligue **Confirm email** (opcional).
5. Menu **Project Settings** → **API** (ou **Data API / API Keys**): copie **Project URL** e a chave **anon / public**. **Nunca** use a chave `service_role`.
6. No painel (PC): **Conta e ajustes**, cole URL e chave anon, digite seu e-mail e uma senha e toque **Criar conta**, depois **Entrar**. Repita no iPad com a mesma conta. O topo mostra "Sincronizado".
Limites gratuitos e pausa por inatividade mudam com o tempo: confira em supabase.com/pricing.

## PARTE 4 — Pesquisa de vídeos (opcional)
1. https://console.cloud.google.com → crie um projeto.
2. **APIs e serviços** → **Biblioteca** → procure **YouTube Data API v3** → **Ativar**.
3. **Credenciais** → **Criar credenciais** → **Chave de API**.
4. Em **Editar chave**: **Restrições de aplicativo** = Sites (referenciadores HTTP) → adicione `https://SEU-USUARIO.github.io/*`. **Restrições de API** = YouTube Data API v3. Salve.
5. Cota gratuita padrão: 10.000 unidades/dia; cada pesquisa custa 100 (cerca de 100 buscas/dia).
6. Cole a chave em **Conta e ajustes → Chave da YouTube API**. Ela fica na sua conta Supabase (protegida), nunca no GitHub. Sem chave, o botão Buscar abre o YouTube.

## Usar no dia a dia
- **Tela inicial**: cartões no estilo escuro; toque num cartão para abrir (Vídeos, Receitas, Música, Relógio e clima, Compras, Notas...) e em **‹ Voltar** para retornar. O ícone no canto superior direito abre os **Ajustes**, onde está o botão **Editar painel**.
- **Editar painel**: em cada cartão você muda título, descrição, ícone (emoji), cor (6 opções), tamanho da letra (A-/A+), largura (Metade/Inteiro), move com ◀ ▶ e exclui. Toque no cartão em modo de edição para editar o conteúdo (links, fotos, local do clima). **Salvar e sair** envia ao Supabase. A cor do fundo fica em Ajustes.
- **Fotos**: cole links diretos de imagens (terminam em .jpg/.png). Com a tela parada, a apresentação aparece sozinha; toque para sair.
- **Tela do iPad**: Ajustes → Geral → Bloqueio Automático → **Nunca**. No Safari: Compartilhar → **Adicionar à Tela de Início** para abrir em tela cheia.

## Atualizar o site
No GitHub, abra o arquivo → lápis (Edit) → altere → **Commit changes**. Ou **Add file → Upload files** com o arquivo novo (mesmo nome substitui).

## Limitações
- Vídeo embutido pode não tocar no Safari 9; use "Abrir no YouTube".
- Música: só atalhos. Áudio para quando a tela bloqueia e o Spotify/YouTube Music podem não funcionar no iOS 9.
- Upload de fotos direto não está nesta versão (use links). Fica como próximo passo (Supabase Storage).
