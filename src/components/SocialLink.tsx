export function SocialLink({ icon: Icon, ...props }: any) {
  return (
    <a className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-gray-300 transition group-hover:fill-primary-400" />
    </a>
  )
}