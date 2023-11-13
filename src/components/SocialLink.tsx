export function SocialLink({ icon: Icon, ...props }: any) {
  return (
    <a className="group flex text-sm font-medium transition text-zinc-200 hover:text-primary-500" {...props} title={props['aria-label']}>
      <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-primary-500" />
      <span className="ml-4">{props['aria-label']}</span>
    </a>
  )
}