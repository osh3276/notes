import UserProfile from "@/components/UserProfile";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Notes App</h1>
          <p className="text-xl text-muted-foreground">
            Your personal note-taking companion
          </p>
        </div>
        <UserProfile />
      </main>
    </div>
  );
}