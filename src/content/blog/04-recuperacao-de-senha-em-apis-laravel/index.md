---
title: "Recuperação de Senha em APIs Laravel"
description: "Aprenda a implementar um fluxo de redefinição de senha em uma API Laravel."
date: "06/02/2025"
---

Este post é a continuação do nosso tutorial sobre **Autenticação de APIs no Laravel com Sanctum**. Se você ainda não conferiu, recomendo dar uma olhada antes de seguir adiante: [Autenticação de APIs no Laravel com Sanctum](https://tiagopaes.dev/blog/02-autenticacao-de-apis-no-laravel-com-sanctum).

A redefinição de senha é uma funcionalidade essencial em qualquer API. No Laravel, podemos implementá-la de forma simples e segura utilizando o sistema de notificações e o pacote de recuperação de senha do próprio framework.

## 1. Criando as Rotas de Redefinição de Senha

No arquivo `routes/api.php`, defina as rotas para solicitar a redefinição e para redefinir a senha:

```php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->name('auth.forgot-password');
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->name('auth.reset-password');
```

## 2. Implementando os Métodos no AuthController

Agora, no `app/Http/Controllers/AuthController.php`, adicione os métodos responsáveis pelo envio do link de redefinição e pela atualização da senha.

```php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        Password::sendResetLink($request->only('email'));

        return response()->json(status: Response::HTTP_OK);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));
                $user->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(status: Response::HTTP_OK);
        }

        return response()->json(['message' => 'Erro ao redefinir a senha'], status: Response::HTTP_BAD_REQUEST);
    }
}
```

## 3. Criando a Notificação Personalizada de Redefinição de Senha

No Laravel, podemos personalizar completamente a notificação de redefinição de senha criando uma classe de notificação própria.

Antes de criar a classe de notificação, vamos gerar um template de e-mail (Mailable) para redefinição de senha.

### Gerando o template de e-mail

Para gerar essa classe, utilize o seguinte comando artisan:

```bash
php artisan make:mail ResetPasswordNotificationMail
```

O conteúdo da nossa classe `ResetPasswordNotificationMail` ficará assim:
```php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $url)
    {
        //
    }

    public function build()
    {
        return $this->subject('Redefinição de Senha')
                    ->view('emails.password-reset')
                    ->with(['url' => $this->url]);
    }
}
```
A classe `ResetPasswordNotificationMail` recebe o link de redefinição de senha como argumento e utiliza o template `password-reset.blade.php` para exibir o link.

O template de e-mail de redefinição pode ser personalizado conforme necessário. Aqui está um modelo simples para o arquivo `resources/views/emails/password-reset.blade.php`:

```blade
<div style="font-family: Arial, sans-serif">
    <p>Clique no link abaixo para redefinir sua senha:</p>
    <a href="{{ $url }}">{{ $url }}</a>
</div>
```

Este é um template minimalista que reflete minha preferência pessoal, mas pode ser ajustado conforme necessário para atender às necessidades do projeto.

### Gerando a classe de notificação

Para gerar a classe de notificação, utilize o seguinte comando artisan:

```bash
php artisan make:notification ResetPasswordNotification
```

O conteúdo da nossa classe `ResetPasswordNotification` ficará assim:

```php
namespace App\Notifications;

use App\Mail\ResetPasswordNotificationMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(public string $url)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): ResetPasswordNotificationMail
    {
        return (new ResetPasswordNotificationMail($this->url))
            ->to($notifiable->email);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
```
A classe `ResetPasswordNotification` é responsável por enviar o e-mail de redefinição de senha. Ela recebe o link de redefinição de senha como argumento e utiliza a classe `ResetPasswordNotificationMail` que criamos anteriormente para enviar o e-mail.

## 4. Enviando a Notificação personalizada de Redefinição de Senha

Para que o Laravel use nossa notificação personalizada, precisamos sobrescrever o método `sendPasswordResetNotification` no modelo `User`.

No arquivo `app/Models/User.php`, sobrescrevemos o método `sendPasswordResetNotification` para enviar nossa própria notificação personalizada:

```php
public function sendPasswordResetNotification($token): void
{
    $url = config('services.frontend.url') . '/reset-password?token=' . $token . '&email=' . $this->email;
    $this->notify(new ResetPasswordNotification($url));
}
```

Dessa forma, o Laravel usará nossa notificação personalizada para enviar o e-mail de redefinição de senha.

O link de redefinição de senha é gerado a partir da URL do frontend que também recebe o token e o e-mail do usuário como parâmetros. Com essas informações, o frontend é responsável por receber a nova senha do usuário e fazer a chamada para o nosso endpoint de redefinição de senha `/api/auth/reset-password` com os parâmetros necessários (token, email e nova senha).

### Por que usar a URL do frontend?

Nossa aplicação Laravel serve apenas como **API**, enquanto o usuário final interage com o **frontend** separado. Por isso, ao gerar o link de redefinição de senha, direcionamos o usuário para o frontend, onde ele poderá inserir uma nova senha. 

Essa URL do frontend poderia ser recebida como argumento caso a api suportasse mais de um frontend. Nesse exemplo estamos usando apenas um frontend, então prefiro armazenar a url do frontend nas variáveis de ambiente do Laravel (`.env`) e referenciá-la na configuração `services.frontend.url`.

## 5. Testando a Funcionalidade

Agora que tudo está configurado, podemos testar as rotas com o Postman ou `curl`.

**Solicitar a redefinição de senha:**
```bash
curl -X POST http://localhost/api/auth/forgot-password -H "Content-Type: application/json" -d '{"email": "user@example.com"}'
```

Um e-mail de redefinição de senha será enviado para o usuário com um link para redefinir a senha.

**Redefinir a senha:**
```bash
curl -X POST http://localhost/api/auth/reset-password -H "Content-Type: application/json" -d '{"token": "SEU_TOKEN", "email": "user@example.com", "password": "novasenha", "password_confirmation": "novasenha"}'
```

Se a senha for redefinida com sucesso, a API retornará um status 200 OK e o usuário poderá logar com a nova senha no endpoint `/api/auth/login`.

---

Com isso, sua API agora suporta **redefinição de senha de forma segura e eficiente**!

Para mais informações sobre boas práticas na redefinição de senha no Laravel, recomendo dar uma olhada na [Documentação oficial do Laravel sobre redefinição de senha](https://laravel.com/docs/11.x/passwords).

Se ainda não conferiu o tutorial anterior, recomendo dar uma olhada para entender a base da autenticação: [Autenticação de APIs no Laravel com Sanctum](https://tiagopaes.dev/blog/02-autenticacao-de-apis-no-laravel-com-sanctum).

