import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Your Next.js app with Tailwind CSS and shadcn/ui is ready.
          </p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </main>
  )
}