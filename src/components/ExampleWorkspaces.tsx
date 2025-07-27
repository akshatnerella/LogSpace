import { Button } from './Button'

const exampleWorkspaces = [
  {
    title: "Yash's AI Meme Generator",
    description: "Building an AI-powered meme creation tool with React and OpenAI",
    tags: ['React', 'OpenAI', 'TypeScript']
  },
  {
    title: "Jules' Indie Hacker SaaS",
    description: "Documenting the journey from idea to $1K MRR",
    tags: ['Next.js', 'Stripe', 'PostgreSQL']
  }
]

export function ExampleWorkspaces() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Example Workspaces</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {exampleWorkspaces.map((workspace, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-accent/20 transition-colors">
              <h3 className="text-xl font-semibold mb-3">{workspace.title}</h3>
              <p className="text-gray-600 mb-4">{workspace.description}</p>
              <div className="flex flex-wrap gap-2">
                {workspace.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-3 py-1 bg-muted text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="primary">
            → View All Workspaces
          </Button>
        </div>
      </div>
    </section>
  )
}
