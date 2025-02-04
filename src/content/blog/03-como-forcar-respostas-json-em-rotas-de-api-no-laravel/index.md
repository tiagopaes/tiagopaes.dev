---
title: "Como forçar respostas JSON em rotas de API no Laravel"
description: "Aprenda como garantir que todas as respostas da sua API Laravel sejam retornadas em JSON, utilizando middleware e configuração de exceções."
date: "02/04/2025"
---

Ao desenvolver APIs no Laravel, é essencial garantir que todas as respostas sejam retornadas no formato JSON. Isso evita problemas com requisições que podem receber respostas HTML inesperadas, como erros e exceções.

No Laravel, podemos garantir que nossa API sempre responda em JSON utilizando um **middleware** e configurando o tratamento de exceções corretamente. Vamos ver como fazer isso passo a passo.

> ⚠️ **Este tutorial foi feito utilizando o Laravel 11, que é a versão atual no momento. Se você estiver usando uma versão diferente, pode ser necessário adaptar alguns passos.**

## 1. Criando o Middleware ForceJsonResponse

Para garantir que todas as requisições feitas para a API retornem JSON, criamos um middleware chamado `ForceJsonResponse`. Aqui está a implementação dele:

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceJsonResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
```

Esse middleware modifica o cabeçalho da requisição, definindo que a resposta esperada é do tipo `application/json`.

## 2. Adicionando o Middleware nas Rotas da API

Agora, precisamos garantir que esse middleware seja aplicado a todas as rotas da API. Para isso, devemos adicioná-lo no grupo `api` dentro do arquivo `app/Http/Kernel.php`.

Aqui está a configuração correta:

```php
protected $middlewareGroups = [
    'api' => [
        \App\Http\Middleware\ForceJsonResponse::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

### Importante

O `ForceJsonResponse` deve ser **o primeiro middleware** da lista. Esse é o motivo pelo qual precisamos redeclarar manualmente o middleware `SubstituteBindings`. Dessa forma, garantimos que todas as requisições API recebam respostas JSON antes que qualquer outra lógica seja aplicada.

## 3. Configurando o Tratamento de Exceções para JSON

Além de forçar o formato JSON nas requisições, também precisamos garantir que as **exceções sejam tratadas corretamente**. Isso pode ser feito com a seguinte configuração no `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->shouldRenderJsonWhen(function (Request $request) {
        if ($request->is('api/*')) {
            return true;
        }

        return $request->expectsJson();
    });
})
```

Essa configuração faz com que qualquer exceção lançada dentro do grupo `api/*` seja automaticamente formatada como JSON, evitando respostas HTML indesejadas.

## 4. Testando a Configuração

Agora que tudo está configurado, podemos testar nossa API com o Postman ou `curl`.

### Testando uma rota normal da API:
```bash
curl -X GET http://localhost/api/teste
```
A resposta deve ser em JSON, mesmo sem o cabeçalho `Accept: application/json`.

### Testando um erro da API:
```bash
curl -X GET http://localhost/api/rota-inexistente
```
A resposta também será retornada em JSON, garantindo um comportamento consistente.
```json
{
  "message": "The route api/rota-inexistente could not be found."
}
```
---

Com essa configuração, garantimos que **todas as respostas da API Laravel sejam sempre JSON**, independentemente da requisição feita pelo cliente. Isso melhora a previsibilidade da API e evita erros indesejados.

Se você quiser aprender mais sobre Laravel, fique ligado nos meus outros posts e no [meu canal no youtube](https://youtube.com/@tiagopaees?sub_confirmation=1)! 🚀

