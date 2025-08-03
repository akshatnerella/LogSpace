export default function EmptyProjectsIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-6"
    >
      {/* Background Circle */}
      <circle
        cx="60"
        cy="60"
        r="60"
        fill="currentColor"
        className="text-surface opacity-50"
      />
      
      {/* Folder Base */}
      <rect
        x="35"
        y="50"
        width="50"
        height="35"
        rx="4"
        fill="currentColor"
        className="text-muted-foreground opacity-30"
      />
      
      {/* Folder Tab */}
      <rect
        x="35"
        y="45"
        width="20"
        height="8"
        rx="2"
        fill="currentColor"
        className="text-muted-foreground opacity-40"
      />
      
      {/* Plus Icon */}
      <circle
        cx="60"
        cy="67"
        r="8"
        fill="currentColor"
        className="text-primary opacity-80"
      />
      <rect
        x="58"
        y="63"
        width="4"
        height="8"
        rx="2"
        fill="white"
      />
      <rect
        x="56"
        y="65"
        width="8"
        height="4"
        rx="2"
        fill="white"
      />
      
      {/* Floating Dots */}
      <circle
        cx="45"
        cy="35"
        r="2"
        fill="currentColor"
        className="text-primary opacity-60"
      />
      <circle
        cx="75"
        cy="40"
        r="1.5"
        fill="currentColor"
        className="text-primary opacity-40"
      />
      <circle
        cx="85"
        cy="75"
        r="2"
        fill="currentColor"
        className="text-primary opacity-50"
      />
    </svg>
  )
}
