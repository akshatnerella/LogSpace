import { Plus } from 'lucide-react'

interface FloatingCreateButtonProps {
  projectSlug: string
}

export function FloatingCreateButton({ projectSlug }: FloatingCreateButtonProps) {
  return (
    <a
      href={`/project/${projectSlug}/create-log`}
      className="group fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary hover:bg-primary-hover rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-float"
      aria-label="Create new log"
    >
      <Plus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
    </a>
  )
}
