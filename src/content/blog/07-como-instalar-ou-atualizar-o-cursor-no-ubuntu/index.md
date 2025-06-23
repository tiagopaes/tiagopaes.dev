---
title: "Como Instalar ou Atualizar o Cursor no Ubuntu"
description: "Aprenda a instalar ou atualizar o editor Cursor no Ubuntu usando AppImage"
date: "06/23/2025"
---

Manter seu editor atualizado é essencial para garantir performance, segurança e acesso a novos recursos. Neste tutorial, você vai aprender a:

- Instalar ou atualizar o Cursor no Ubuntu usando o arquivo AppImage.
- Adicionar um atalho com ícone ao menu de aplicativos para facilitar o acesso.

## Pré-requisitos

Antes de começar, certifique-se de que você tem:

- Ubuntu (ou outra distro baseada em Linux).
- Permissão de administrador (sudo).
- Acesso à internet para baixar o AppImage e o ícone.

## Passo 1: Baixar o AppImage do Cursor
1. Acesse o site oficial do Cursor e baixe a versão mais recente do arquivo .AppImage.
2. O arquivo será salvo normalmente em ~/Downloads.

## Passo 2: Atualizar ou Instalar o Cursor

No terminal, execute os comandos abaixo para remover a versão antiga (se existir), mover o novo AppImage para /opt e dar permissão de execução:
```sh
sudo rm /opt/cursor.appimage
sudo mv ~/Downloads/Cursor-<versao>-x86_64.AppImage /opt/cursor.appimage
sudo chmod +x /opt/cursor.appimage
```
> Substitua `<versao>` pelo número da versão que você baixou (ex: 1.1.3).

## Passo 3: Baixar e Salvar o Ícone do Cursor
1. Baixe um ícone do Cursor (formato .png). Você pode usar o logo oficial ou um ícone de sua preferência.
2. Salve o arquivo como cursor.png em ~/Pictures ou baixe direto para lá.
3. (Opcional) Mova o ícone para uma pasta de ícones do sistema:
```sudo cp ~/Pictures/cursor.png /usr/share/pixmaps/cursor.png```

## Passo 4: Criar o Atalho no Menu de Aplicativos

Crie um arquivo desktop para o Cursor:

```sudo nano /usr/share/applications/cursor.desktop```

Cole o conteúdo abaixo (ajuste o caminho do ícone se necessário):
```
[Desktop Entry]
Name=Cursor
Comment=Editor Cursor
Exec=/opt/cursor.appimage
Icon=/usr/share/pixmaps/cursor.png
Type=Application
Categories=Development;Editor;
Terminal=false
```
Salve e feche o editor (Ctrl+O, Enter, depois Ctrl+X).

## Passo 5: Dar Permissão ao Atalho
```sudo chmod +x /usr/share/applications/cursor.desktop```

## Passo 6: Atualizar o Menu de Aplicativos

Para garantir que o novo atalho apareça, atualize o banco de dados de atalhos:

```update-desktop-database ~/.local/share/applications```

Ou reinicie a sessão do usuário.

## Passo 7: Abrir o Cursor pelo Menu

Agora, basta procurar por Cursor no menu de aplicativos do Ubuntu e abrir normalmente, já com o ícone personalizado!

## Dica Extra: Remover o Cursor

Se quiser remover o Cursor do sistema, basta rodar:

sudo rm /opt/cursor.appimage
sudo rm /usr/share/applications/cursor.desktop
sudo rm /usr/share/pixmaps/cursor.png

## Conclusão

Pronto! Agora você tem o Cursor instalado ou atualizado no Ubuntu, com atalho e ícone no menu de aplicativos. Sempre que sair uma nova versão, basta repetir o processo de download e substituição do AppImage.
Se quiser, pode personalizar o ícone ou criar atalhos adicionais conforme sua preferência.
