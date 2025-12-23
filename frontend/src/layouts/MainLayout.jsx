import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      {/* Header/Navbar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AppChat</h1>
            <div className="flex gap-4">{/* Add navigation links here */}</div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2025 AppChat. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
