---

title: "Backup Automático do PostgreSQL com GitHub Actions e Cloudflare R2"
description: "Aprenda a configurar um workflow no GitHub Actions para fazer backup do seu banco de dados PostgreSQL e armazená-lo no Cloudflare R2"
date: "02/26/2025"
---

Fazer backups regulares do banco de dados é essencial para garantir a segurança dos dados. Neste tutorial, você aprenderá a:

- Criar um fluxo de trabalho no **GitHub Actions** para fazer backup do seu banco PostgreSQL.
- Armazenar o backup no **Cloudflare R2**.
- Configurar regras de **expiração automática** para excluir backups antigos.

## Pré-requisitos

Antes de começar, certifique-se de que você tem:

1. **Um banco de dados PostgreSQL** acessível via URL.
2. **Uma conta Cloudflare** com R2 ativado.
3. **Acesso ao repositório GitHub** onde deseja configurar o workflow.

---

## Passo 1: Criar credenciais no Cloudflare R2

Para armazenar os backups no Cloudflare R2, siga estes passos:

1. Acesse o **Painel da Cloudflare** e vá até **R2**.
2. Crie um **novo bucket** e anote o nome dele.
3. Vá até **"Gerenciar Acessos" → "Chaves de API"** e gere um **Access Key ID** e um **Secret Access Key**.
4. Copie também o **Endpoint da API S3** (algo como `https://<account-id>.r2.cloudflarestorage.com`).

---

## Passo 2: Adicionar as variáveis ao GitHub

Agora, vá até **Settings → Secrets and variables → Actions** no seu repositório do GitHub e adicione:

| Nome do Secret         | Valor                              |
| ---------------------- | ---------------------------------- |
| `POSTGRES_URL`         | URL do seu banco PostgreSQL        |
| `R2_ACCOUNT_ID`        | Account ID do Cloudflare R2        |
| `R2_ACCESS_KEY_ID`     | Access Key ID do Cloudflare R2     |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key do Cloudflare R2 |
| `R2_BUCKET_NAME`       | Nome do bucket no R2               |

---

## Passo 3: Criar o Workflow no GitHub Actions

Agora, crie um arquivo no seu repositório:\
**`.github/workflows/postgres_backup.yml`**

```yaml
name: PostgreSQL Backup to Cloudflare R2

on:
  schedule:
    - cron: '0 3 * * *' # Roda todo dia às 03:00 UTC
  workflow_dispatch: # Permite execução manual

jobs:
  backup:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout do repositório
        uses: actions/checkout@v4

      - name: Instalar cliente PostgreSQL
        run: sudo apt-get update && sudo apt-get install -y postgresql-client

      - name: Criar backup do PostgreSQL
        run: |
          export TIMESTAMP=$(date +'%Y-%m-%d_%H-%M-%S')
          pg_dump --format=custom --no-owner --no-privileges ${{ secrets.POSTGRES_URL }} > backup_$TIMESTAMP.dump
          mkdir -p backup
          mv backup_$TIMESTAMP.dump backup/

      - name: Enviar backup para o Cloudflare R2
        uses: ryand56/r2-upload-action@latest
        with:
          r2-account-id: ${{ secrets.R2_ACCOUNT_ID }}
          r2-access-key-id: ${{ secrets.R2_ACCESS_KEY_ID }}
          r2-secret-access-key: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          r2-bucket: ${{ secrets.R2_BUCKET_NAME }}
          source-dir: backup
          destination-dir: backups
          output-file-url: true
          multipart-size: 50
          max-retries: 5
          multipart-concurrent: true
```

**O que esse workflow faz?**

- Faz backup do PostgreSQL usando `pg_dump`.
- Envia o backup para o Cloudflare R2.
- Roda diariamente às 03:00 UTC ou manualmente via GitHub Actions.

## Passo 4: Configurar a Expiração Automática no Cloudflare R2

Para evitar o acúmulo de backups antigos, vamos configurar uma regra de expiração no Cloudflare R2:

### Criando a Regra de Expiração

1. Vá até **Cloudflare Dashboard → R2** e clique no seu bucket.
2. Acesse **Lifecycle Rules** e clique em **"Create Rule"**.
3. Defina:
   - **Prefix:** `backups/` (para afetar apenas arquivos de backup).
   - **Expiration: 7 dias**.
   - **Action: Delete**.
4. Salve a regra e pronto! Agora, backups mais antigos que **7 dias serão apagados automaticamente**.

---

## Passo 5: Restaurando um Backup com Docker

Para restaurar um backup salvo no Cloudflare R2, faça o download do arquivo e use o seguinte comando no mesmo diretório em que se encontra o arquivo:

```sh
docker run --rm -v $(pwd):/backup postgres:latest \
    pg_restore --verbose --no-owner \
    --dbname={REPLACE_BY_DB_CONNECTION_STRING} \
    /backup/backup_SEU_TIMESTAMP.dump
```

Substitua `REPLACE_BY_DB_CONNECTION_STRING` pela URL de conexão do banco de dados que você deseja restaurar o backup, e subistitua`backup_SEU_TIMESTAMP.dump` pelo nome correto do arquivo.

---

## Conclusão

Agora você tem um **backup automático** do PostgreSQL integrado ao **GitHub Actions**, armazenado no **Cloudflare R2**, e com uma limpeza automática de arquivos antigos! 🚀

Se quiser mais segurança, pode criptografar os backups antes do upload ou configurar notificações por e-mail ao final do processo.
