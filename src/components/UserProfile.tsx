"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function UserProfile() {
  const { data: session, isLoading } = useSession()

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Notes App</CardTitle>
          <CardDescription>Sign in to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <a href="/login">Sign In</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const userInitials = session.user.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase() || "U"

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
            <AvatarFallback className="text-lg font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>Manage your account and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-sm">{session.user.name}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-sm">{session.user.email}</p>
          </div>
        </div>
        <Separator />
        <Button 
          onClick={() => signOut()}
          variant="outline"
          className="w-full"
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
}