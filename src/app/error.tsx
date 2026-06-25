"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-200 mb-2">出错了</h2>
        <p className="text-sm text-slate-500 mb-4">请刷新页面重试</p>
        <button
          onClick={reset}
          className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  );
}
