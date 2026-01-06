"use client"
import { Dashboard } from "./_components/dashboard";
import { Nav } from "./_components/nav";

export default function Page() {
  return (
    <main className="p-4 relative">
    
      <Nav/>
      
      <Dashboard />
    </main>
  );
}
