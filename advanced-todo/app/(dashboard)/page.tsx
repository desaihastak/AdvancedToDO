export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-violet-500 via-purple-500 to-indigo-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Dashboard</h1>
          <p className="text-muted">Welcome to your AdvancedToDo dashboard!</p>
          <p className="mt-4 text-muted">
            You have successfully logged in. Your task management experience will be built here.
          </p>
        </div>
      </div>
    </div>
  )
}
