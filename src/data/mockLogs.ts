export interface MockLog {
  id: string
  user: string
  avatar: string
  timestamp: string
  content: string
  icon?: string
}

export const mockLogs: MockLog[] = [
  {
    id: "1",
    user: "Nina G.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face&auto=format",
    timestamp: "2 hours ago",
    content: "Refactored the landing page animation for smoother entry 🌀",
    icon: "⚙️"
  },
  {
    id: "2", 
    user: "Kai W.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face&auto=format",
    timestamp: "5 hours ago",
    content: "Just pushed v0.2 of my AI API wrapper ⚡",
    icon: "🚢"
  },
  {
    id: "3",
    user: "Ravi P.", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format",
    timestamp: "1 day ago",
    content: "Got feedback from 3 users. Going to redo onboarding flow 🔁",
    icon: "🧠"
  },
  {
    id: "4",
    user: "Sarah M.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face&auto=format", 
    timestamp: "2 days ago",
    content: "Launched beta version! 50 signups in first hour 🎉",
    icon: "🚢"
  },
  {
    id: "5",
    user: "Alex C.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face&auto=format",
    timestamp: "3 days ago", 
    content: "Had a breakthrough with the database optimization. 40% faster queries!",
    icon: "⚡"
  }
]
