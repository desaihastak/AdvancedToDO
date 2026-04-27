export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-violet-500 via-purple-500 to-indigo-600">
      {children}
    </div>
  )
}
