---
title: "Backup Automático do PostgreSQL com GitHub Actions e Cloudflare R2"
description: "Aprenda a configurar um workflow no GitHub Actions para fazer backup do seu banco de dados PostgreSQL e armazená-lo no Cloudflare R2"
date: "02/19/2025"
draft: true
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

| Nome do Secret            | Valor |
|---------------------------|-------|
| `POSTGRES_URL`            | URL do seu banco PostgreSQL |
| `R2_ACCESS_KEY_ID`        | Access Key ID do Cloudflare R2 |
| `R2_SECRET_ACCESS_KEY`    | Secret Access Key do Cloudflare R2 |
| `R2_BUCKET_NAME`          | Nome do bucket no R2 |
| `R2_ENDPOINT_URL`         | Endpoint do R2 (ex: `https://<account-id>.r2.cloudflarestorage.com`) |

---

## Passo 3: Criar o Workflow no GitHub Actions
Agora, crie um arquivo no seu repositório:  
**`.github/workflows/postgres_backup.yml`**

```yaml
name: Backup PostgreSQL para Cloudflare R2

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
          export PGPASSWORD=$(echo ${{ secrets.POSTGRES_URL }} | sed 's/.*:.*@\(.*\)\/.*/\1/')
          pg_dump --format=custom --no-owner --no-privileges ${{ secrets.POSTGRES_URL }} > backup.dump

      - name: Instalar AWS CLI (compatível com R2)
        run: |
          sudo apt-get install -y awscli
          aws --version

      - name: Enviar backup para o Cloudflare R2
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          AWS_ENDPOINT_URL: ${{ secrets.R2_ENDPOINT_URL }}
        run: |
          TIMESTAMP=$(date +'%Y-%m-%d_%H-%M-%S')
          aws s3 cp backup.dump s3://${{ secrets.R2_BUCKET_NAME }}/postgres_backup_$TIMESTAMP.dump --endpoint-url $AWS_ENDPOINT_URL
```
**O que esse workflow faz?**
- Faz backup do PostgreSQL usando pg_dump.
- Envia o backup para o Cloudflare R2.
- Roda diariamente às 03:00 UTC ou manualmente via GitHub Actions.

## Passo 4: Configurar a Expiração Automática no Cloudflare R2
Para evitar o acúmulo de backups antigos, vamos configurar uma regra de expiração no Cloudflare R2:

**Criando a Regra de Expiração**
1. Vá até **Cloudflare Dashboard → R2** e clique no seu bucket.
2. Acesse **Lifecycle Rules** e clique em **"Create Rule"**.
3. Defina:
   - **Prefix:** `postgres_backup_` (ou deixe vazio para afetar todos os arquivos).
   - **Expiration: 7 dias**.
   - **Action: Delete**.
Salve a regra e pronto! Agora, backups mais antigos que 7 dias serão apagados automaticamente.

## Conclusão
Agora você tem um backup automático do PostgreSQL integrado ao GitHub Actions, armazenado no Cloudflare R2, e com uma limpeza automática de arquivos antigos!

Se quiser mais segurança, pode criptografar os backups antes do upload ou configurar notificações por e-mail ao final do processo.
