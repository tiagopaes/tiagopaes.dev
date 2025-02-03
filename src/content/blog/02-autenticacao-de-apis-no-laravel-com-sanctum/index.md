---
title: "Autenticação de APIs no Laravel com Sanctum"
description: "Este tutorial ensina como configurar a autenticação de APIs no Laravel utilizando Sanctum, com um passo a passo detalhado."
date: "02/03/2025"
---

> 🎥 **Assista ao vídeo completo sobre esse tutorial no meu canal do YouTube:** https://youtu.be/0zhArwO8W8o?si=QHszb97SgPiMezsN

A autenticação em APIs é essencial para garantir a segurança das informações dos usuários. No Laravel, uma das melhores formas de implementar isso é utilizando o Laravel Sanctum. Neste tutorial, vamos configurar a autenticação de uma API passo a passo.

> ⚠️ **Este tutorial foi feito utilizando o Laravel 11, que é a versão atual no momento. Se você estiver usando uma versão diferente, pode ser necessário adaptar alguns passos.**

## 1. Instalando o Sanctum

Para instalar o Sanctum no seu projeto Laravel, basta rodar o seguinte comando:

```bash
php artisan install:api
```

Isso configurará automaticamente o Sanctum e publicará as migrações necessárias.

## 2. Configurando o modelo de usuário

Agora, vamos modificar o modelo `User.php` para utilizar o Sanctum. Abra o arquivo `app/Models/User.php` e adicione o trait `HasApiTokens`:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

Isso permitirá que os usuários gerem tokens para autenticar requisições na API.

## 3. Criando as rotas da API

No arquivo `routes/api.php`, defina as rotas para registro e login:

```php
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```

Aqui, estamos protegendo a rota `/user` com o middleware `auth:sanctum`, garantindo que apenas usuários autenticados tenham acesso.

## 4. Criando o AuthController

Agora, precisamos criar um controller para lidar com a autenticação. No arquivo `app/Http/Controllers/AuthController.php`, adicione o seguinte código:

```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json($user, 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only(['email', 'password']))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token]);
    }
}
```

Esse controlador permite que os usuários se registrem e façam login. No login, retornamos um token que o cliente deve enviar nas requisições autenticadas.

## 5. Testando a API

Agora, podemos testar nossa API usando o Postman ou o curl. Para registrar um usuário:

```bash
curl -X POST \
  http://localhost/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "123456"}'
```

Para fazer login:

```bash
curl -X POST \
  http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "123456"}'
```

Isso retornará um token. Para acessar uma rota protegida:

```bash
curl -X GET \
  http://localhost/api/user \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

Se o token for válido, a API responderá com os dados do usuário autenticado.

---

Com esses passos, você configurou a autenticação de uma API Laravel utilizando Sanctum! Para mais detalhes e demonstrações práticas, **não se esqueça de assistir ao vídeo completo** no meu canal do YouTube. 🚀

