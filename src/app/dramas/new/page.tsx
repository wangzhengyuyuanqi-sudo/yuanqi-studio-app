"use client";

import Navbar from "@/components/layout/Navbar";
import DramaForm from "@/components/episodes/DramaForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewDramaPage() {
  const router = useRouter();

  async function handleSubmit(data: { title: string; description: string }) {
    const res = await fetch("/api/dramas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("创建失败");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8 animate-fade-in">
        <Link href="/dramas" className="text-xs text-noir-500 hover:text-noir-300 transition-colors duration-200">
          ← 返回
        </Link>
        <h1 className="text-2xl font-bold text-noir-50 mt-3 mb-8">新建剧集</h1>
        <DramaForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
