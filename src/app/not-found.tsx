import Link from "next/link";

export default function NotFoundPage() {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-950 text-slate-200 min-h-screen">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">页面不存在</h2>
            <p className="text-sm text-slate-500 mb-4">找不到您要访问的页面</p>
            <Link href="/dashboard" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
              返回控制台
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
