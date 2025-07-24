"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const templates = [
  {
    id: 1,
    name: "Modern",
    img: "/templates/modern.png", // Place your image in public/templates/
  },
  {
    id: 2,
    name: "Classic",
    img: "/templates/classic.png",
  },
  {
    id: 3,
    name: "Minimal",
    img: "/templates/minimal.png",
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  // Dummy auth check: replace with your real logic
  const isLoggedIn = false; // Set to true if user is logged in

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/"); // Redirect to login (homepage)
    }
  }, [isLoggedIn, router]);

  const handleSelect = (templateId: number) => {
    // If not logged in, redirect (extra safety)
    if (!isLoggedIn) {
      router.replace("/");
      return;
    }
    // Otherwise, proceed (e.g., go to editor)
    alert(`Selected template ${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-8">Choose a Resume Template</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleSelect(tpl.id)}
          >
            <img
              src={tpl.img}
              alt={tpl.name}
              className="w-48 h-64 object-cover rounded-lg mb-4 border border-gray-200 dark:border-gray-700"
            />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{tpl.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}