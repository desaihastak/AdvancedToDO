// Session validation is now handled by middleware.ts for better performance
// This layout only renders the dashboard UI for authenticated users

export default async function DashboardLayout({
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
