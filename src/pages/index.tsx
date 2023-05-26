import { useEffect, Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { SocialLink } from '@/components/SocialLink';
import { GitHubIcon, LinkedInIcon, MailIcon, TwitterIcon } from '@/components/SocialIcons';

const data = {
  name: 'Tiago Paes',
  navigation: [
    { name: 'About', href: '#' },
    { name: 'Projects', href: '#' },
    { name: 'Clients', href: '#' },
    { name: 'Contact', href: '#contact' },
  ],
  role: 'Desenvolvedor de Software',
  cta: "Entre em contato",
  description: "Sou Tiago Paes, um desenvolvedor com mais de 7 anos de experiência, especializado em criar soluções digitais personalizadas e impactantes. Com habilidades sólidas em desenvolvimento de websites e sistemas online, estou pronto para ajudar sua empresa a alcançar seus objetivos online.",
};

export default function Home() {

  const closeNavigationMenu = () => {
    const button: HTMLButtonElement | null = document.querySelector('.close-navigation-button');
    if (button) {
      button.click();
    }
  };

  const handleCta = (e: any) => {
    e.preventDefault();
    const contactLink: HTMLAnchorElement | null = document.querySelector('a[href="#contact"]');
    if (contactLink) {
      contactLink.click();
    }
  };

  useEffect(() => {
    AOS.init();
  })

  return (
    <>

      {/* Header */}
      <header className='mx-auto max-w-7xl hidden'>
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <Link href="/" className="-m-1.5 p-1.5 font-semibold text-primary-white text-xl">
            {data.name}
          </Link>
          <div className="flex md:hidden">
            <Popover >
              <Popover.Button className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-500 hover:text-gray-300">
              <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
              <Transition.Root>
                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
                </Transition.Child>
                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel
                    focus
                    className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl p-8 ring-1 bg-zinc-900 ring-zinc-800"
                  >
                    <div className="flex flex-row-reverse items-center justify-between">
                      <Popover.Button aria-label="Close menu" className="-m-1 p-1 close-navigation-button">
                        <XMarkIcon className="h-6 w-6 text-zinc-400" />
                      </Popover.Button>
                      <h2 className="text-sm font-medium text-zinc-400">
                        Navigation
                      </h2>
                    </div>
                    <nav className="mt-6">
                      <ul className="-my-2 divide-y text-base divide-zinc-100/5 text-zinc-300">
                      {data.navigation.map((item) => (
                        <li key={item.name}>
                          <a href={item.href} onClick={closeNavigationMenu} className="block py-2 font-medium">
                            {item.name}
                          </a>
                        </li>
                      ))}
                      </ul>
                    </nav>
                  </Popover.Panel>
                </Transition.Child>
              </Transition.Root>
            </Popover>
          </div>
          <div className="hidden md:flex md:gap-x-10">
            {data.navigation.map((item) => (
              <a key={item.name} href={item.href} className=" font-semibold leading-6 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:text-primary-500">
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <div className='mx-auto max-w-7xl grid grid-cols-2 gap-6 px-6 lg:px-8 py-12 md:py-40' data-aos='fade-up' data-aos-duration='2000'>
        <div className='col-span-2 md:col-span-1 flex items-center order-2 md:order-none'>
          <div className='flex flex-col gap-1 text-center md:text-left sm:px-4 md:px-0'>
            <h1 className='text-white font-semibold text-4xl md:text-6xl'>{data.name}</h1>
            <span className='text-primary-600 font-semibold text-xl md:text-3xl'>{data.role}</span>
            <p className='leading-8 text-gray-300 mt-6 tracking-tight font-normal text-lg text-center md:text-left'>{data.description}</p>
            <div className='mt-6 flex justify-center md:justify-start'>
              <a href='https://wa.me/5511953411568' target='_blank' rel="noreferrer" className='rounded-full bg-primary-600 hover:bg-primary-500 px-12 py-2.5 font-semibold text-white shadow-xl text-xl transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300'>
                {data.cta}
              </a>
            </div>
            <div className="mt-6 flex gap-4 justify-center md:justify-start">
              <SocialLink
                target="_blank"
                href="https://twitter.com/tiagopaees"
                aria-label="Me siga no tweeter"
                icon={TwitterIcon}
              />
              <SocialLink
                target="_blank"
                href="https://www.linkedin.com/in/tiagopaees"
                aria-label="Veja meu perfil do linkedin"
                title="Veja meu perfil do linkedin"
                icon={LinkedInIcon}
              />
              <SocialLink
                target="_blank"
                href="mailto:tiagopaes37@gmail.com"
                aria-label="Me envie um email"
                title="Me envie um email"
                icon={MailIcon}
              />
            </div>
          </div>
        </div>
        <div className='col-span-2 md:col-span-1 flex justify-center p-6'>
          <img src='avatar.jpg' className='w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-primary-600 object-cover object-center shadow-xl' />
        </div>

      </div>

      {/* Contact */}
      <div className="relative isolate hidden" id="contact">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ring-1 ring-white/5">
                
                <div
                  className="absolute -left-56 top-[calc(100%-13rem)] transform-gpu blur-3xl lg:left-[max(-14rem,calc(100%-59rem))] lg:top-[calc(50%-7rem)]"
                  aria-hidden="true"
                >
                  <div
                    className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-[#80caff] to-[#4f46e5] opacity-20"
                    style={{
                      clipPath:
                        'polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)',
                    }}
                  />
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white" data-aos='fade-up' data-aos-duration='2000'>Get in touch</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300" data-aos='fade-up' data-aos-duration='2000'>
                Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu. Sed ut tincidunt
                integer elementum id sem. Arcu sed malesuada et magna.
              </p>
              <dl className="mt-10 space-y-4 text-base leading-7 text-gray-300" data-aos='fade-up' data-aos-duration='2000'>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Telephone</span>
                    <PhoneIcon className="h-7 w-6 text-gray-400" aria-hidden="true" />
                  </dt>
                  <dd>
                    <a className="hover:text-white" href="tel:+1 (555) 234-5678">
                      +55 (11) 95341-1568
                    </a>
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Email</span>
                    <EnvelopeIcon className="h-7 w-6 text-gray-400" aria-hidden="true" />
                  </dt>
                  <dd>
                    <a className="hover:text-white" href="mailto:hello@example.com">
                      me@tiagopaes.dev
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <form action="#" method="POST" className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg bg-gray-800 p-6 rounded-lg" data-aos='fade-up' data-aos-duration='2000'>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className='sm:col-span-2'>
                  <label htmlFor="name" className="block text-sm font-semibold leading-6 text-white">
                    Name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold leading-6 text-white">
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-white">
                    Phone number
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="tel"
                      name="phone-number"
                      id="phone-number"
                      autoComplete="tel"
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-semibold leading-6 text-white">
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-primary-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  Send message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </>
  )
}