import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans dark:bg-background p-4" style={{ background: 'linear-gradient(to bottom right, var(--color-dark-amethyst), var(--color-indigo-ink), var(--color-indigo-velvet))' }}>
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-16 px-4 sm:px-8">
        <Card className="w-full">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold text-foreground">
              AdvancedToDo
            </CardTitle>
            <CardDescription className="text-lg text-muted">
              Your modern task management solution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted">
              Looking for a starting point or more instructions? Head over to{" "}
              <a
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                className="font-medium text-primary hover:underline"
              >
                Templates
              </a>{" "}
              or the{" "}
              <a
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                className="font-medium text-primary hover:underline"
              >
                Learning
              </a>{" "}
              center.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button
                className="w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Deploy Now
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
