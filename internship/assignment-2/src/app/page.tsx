import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Summariser</h1>
      <form className="flex flex-col gap-4 w-full max-w-md">
        <Input type="url" placeholder="Enter blog URL" required />
        <Button type="submit">Summarise</Button>
      </form>
    </main>
  );
}