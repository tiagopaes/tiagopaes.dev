import { SocialLink } from '@/components/SocialLink';
import { GitHubIcon, LinkedInIcon, MailIcon } from '@/components/SocialIcons';
import Image from 'next/image';
import Head from 'next/head';

export default function Home() {

  return (
    <>
      <Head>
        <title>Tiago Paes</title>
      </Head>
      <div className='mx-auto w-full max-w-4xl px-4 lg:px-8 py-12 md:py-36 flex flex-col items-start justify-start gap-y-10' data-aos='fade-up' data-aos-duration='2000'>
        
        <div>
          <Image alt="Foto de perfil" src='/profile-pic.png' width="600" height="600" className="rounded-full bg-zinc-800 object-cover h-32 w-32" unoptimized />
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white ">Hey, Tiago Paes aqui 👋</h1>
        </div>

        <div className="space-y-7 text-base text-zinc-400">
          <p>
            Sou um <span className='font-bold tracking-tight text-zinc-200'>Desenvolvedor de Software</span> com 
            mais de {(new Date().getFullYear()) - 2016} anos de experiência no mundo da programação.
            Ao longo da minha carreira, trabalhei em diversos projetos desafiadores, o que me deu uma bagagem 
            valiosa para entender como tirar ideias do papel e transformá-las em soluções práticas.
          </p>
          <p className='hidden'>
            Você pode ver alguns dos projetos que desenvolvi e contribuí acessando meu portifólio.
          </p>
          <p>
            Fique a vontade para entrar em contato comigo através dos links abaixo ou por email.
            Vamos nos conectar e ver como podemos trabalhar juntos para alcançar os objetivos do seu negócio!
          </p>
        </div>

        <div className="mt-6">
          <ul role="list" className='space-y-4'>
            <li className="flex">
              <SocialLink
                target="_blank"
                href="https://www.linkedin.com/in/tiagopaees"
                aria-label="Veja meu perfil do Linkedin"
                icon={LinkedInIcon}
              />
            </li>
            <li className="flex">
              <SocialLink
                target="_blank"
                href="https://github.com/tiagopaes"
                aria-label="Veja meu perfil do Github"
                icon={GitHubIcon}
              />
            </li>
            <li className="flex">
              <SocialLink
                target="_blank"
                href="mailto:me@tiagopaes.dev"
                aria-label="me@tiagopaes.dev"
                icon={MailIcon}
              />
            </li>
          </ul>
        </div>

      </div>
    </>
  )
}
