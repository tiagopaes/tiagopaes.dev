---
title: "Melhorando a eficiência com processamento assíncrono em filas"
description: "Nesse post eu explico sobre como resolvi um problema usando processamento assíncrono com filas."
date: "May 13 2024"
---

Há alguns meses assumi o desenvolvimento de um projeto e logo de cara precisei resolver um problema que estava acontecendo na geração de relatórios. Nesse post eu vou explicar um pouco mais sobre esse problema e como resolvi usando processamento assíncrono com filas.

## Cenário problemático
O sistema estava desenhado para quando o usuário clicar no botão de "Baixar relatório", um endpoint no backend era chamado. O endpoint buscava os dados do banco de dados, processava os dados e retornava para o frontend em formato csv, então o arquivo csv era baixado para a máquina do usuário.

Esse fluxo até que funcionava bem quando o relatório tinha poucos registros, mas quando o número de registros aumentava, isso já gerava alguns problemas como timeout na requisição, e as vezes até travava a aplicação inteira pelo consumo exagerado de memória no processamento dos dados.

## Solução
A solução adotada foi mudar o fluxo de download dos relatórios, agora quando o usuário solicita um relatório, o backend vai criar um "job" para esse relatório, adiciona-lo a uma fila de processamento e retornar a requisição imediatamente para o frontend informando que o job foi criado.

Agora, com esse job adicionado na fila, o sistema em um outro processo que vai consumir os jobs que chegam na fila, vai gerar o relatório e quando terminar vai notificar o usuário que o solicitou.

Além de mover o processamento do relatório para ser executado em segundo plano, o processamento também foi dividido em pequenas partes (chunks), ou seja, invés de buscar 1 milhão de registros no banco de dados, trazer isso para a memória da aplicação e processar, agora a aplicação busca os registros de 100 em 100 por exemplo, processa os 100, quando termina de processar, busca mais 100 até processar o relatório todo.

Dessa forma, o problema de timout foi resolvido, já que o endpoint não processa mais o relatório todo na mesma requisição. O problema de consumo de memória também foi resolvido, já que agora há um número limitado de registros que podem ser processados ao mesmo tempo.

## Tecnologias
Para esse projeto, eu utilizei as ferramentas do ecosistema Laravel. Usei as filas do laravel, integrada com o redis, e para processar e agrupar os chunks usei os Job batches.

## Conclusão
Independente da tecnologia, o mais importante é entender o conceito de filas e processamento assíncrono e saber quando utilizar. Nesse caso específico a solução proposta funcionou bem e o problema foi resolvido.
