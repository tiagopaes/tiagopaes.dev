---
title: "Como configurar o Laravel para rodar atrás de um Proxy Reverso (Reverse Proxy)"
description: "Aprenda como configurar corretamente sua aplicação Laravel para rodar atrás de um proxy reverso."
date: "02/07/2025"
---

Ao hospedar uma aplicação Laravel em plataformas como **Railway, Heroku, Digital Ocean Apps, Coolify, Easypanel, Fly.io**, entre outras, ou até mesmo em um servidor próprio com o **NGINX**, é comum que ela rode atrás de um **proxy reverso** (**reverse proxy**). Isso pode causar problemas se a aplicação não estiver configurada corretamente para reconhecer a URL correta e os cabeçalhos da requisição.

Para garantir que o Laravel funcione corretamente atrás de um reverse proxy, faço sempre três configurações essenciais antes de fazer o deploy da aplicação em produção.

## 1. Configurando a URL da Aplicação para HTTPS

O Laravel precisa saber qual é a URL correta da aplicação, especialmente quando está atrás de um proxy que faz a terminação SSL. Para garantir que a aplicação use **HTTPS**, defina a variável `APP_URL` no arquivo `.env`:

```ini
# .env
APP_URL=https://myapp.com # Defina a URL com HTTPS
```

Além disso, force o Laravel a utilizar essa URL configurada. No arquivo `app/Providers/AppServiceProvider.php`, adicione a seguinte lógica dentro do método `boot`:

```php
use Illuminate\Support\Facades\URL;

public function boot()
{
    if ($this->app->environment('production')) {
        URL::forceRootUrl(config('app.url'));
    }
}
```

Isso garante que todas as URLs geradas pelo Laravel utilizem a raiz correta, evitando redirecionamentos ou erros de conteúdo misto (mixed content).

## 2. Confiando em Todos os Proxies

Como a aplicação pode estar atrás de múltiplos proxies gerenciados pela plataforma de hospedagem, precisamos garantir que o Laravel confie nesses proxies para interpretar corretamente os cabeçalhos da requisição. Isso é feito no arquivo `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
})
```

O caractere `*` indica que todos os proxies devem ser confiáveis. Se preferir, você pode configurar proxies específicos com seus IPs, mas em ambientes gerenciados, confiar em todos geralmente é a melhor opção.

## 3. Definindo a URL dos Assets para HTTPS

Além da URL principal, o Laravel também utiliza a variável `ASSET_URL` para carregar arquivos estáticos corretamente. Se essa configuração não for feita, os assets podem ser carregados via HTTP, causando problemas de segurança. Para evitar isso, defina a variável `ASSET_URL` no `.env`:

```ini
# .env
ASSET_URL=https://myapp.com # Normalmente, o mesmo valor de APP_URL
```

Essa configuração garante que todos os assets, como CSS e JavaScript, sejam carregados corretamente via HTTPS, evitando erros de mixed content nos navegadores.

---

## Conclusão

Seguindo esses três passos simples, sua aplicação Laravel estará totalmente preparada para rodar atrás de um proxy reverso, garantindo que todas as URLs sejam interpretadas corretamente, que os proxies sejam confiáveis e que os assets sejam carregados de maneira segura.

Se você está implantando sua aplicação em plataformas como **Railway, Heroku, Digital Ocean Apps, Coolify, Easypanel, Fly.io**, certifique-se de aplicar essas configurações para evitar problemas em produção. 🚀

