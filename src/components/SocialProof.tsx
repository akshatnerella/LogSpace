import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: "LogSpace has transformed how I share my building journey. The transparency has led to amazing connections and opportunities.",
    author: "Sarah Chen",
    role: "Indie Hacker",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
  },
  {
    quote: "Finally, a place where I can document my projects without the noise. Clean, focused, and perfect for builders.",
    author: "Marcus Rodriguez",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
  },
  {
    quote: "The community aspect is incredible. I've gotten feedback that's helped me pivot and improve my products significantly.",
    author: "Emma Thompson",
    role: "Solo Founder",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
  }
]

const stats = [
  { value: '2,500+', label: 'Active Builders' },
  { value: '12,000+', label: 'Projects Shared' },
  { value: '98%', label: 'User Satisfaction' },
  { value: '150+', label: 'Countries' }
]

export function SocialProof() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-text-secondary text-sm lg:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-display-md font-bold text-foreground mb-4">
            Loved by builders worldwide
          </h2>
          <div className="flex items-center justify-center space-x-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-text-secondary">4.9/5 from 200+ reviews</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-surface border border-border rounded-2xl p-8 hover:border-border-hover transition-colors">
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center space-x-3">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-text-secondary text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
