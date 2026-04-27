import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-violet-500 via-purple-500 to-indigo-600 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-foreground">Dashboard</CardTitle>
            <CardDescription className="text-muted">Welcome to your AdvancedToDo dashboard!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted">
              You have successfully logged in. Your task management experience will be built here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
