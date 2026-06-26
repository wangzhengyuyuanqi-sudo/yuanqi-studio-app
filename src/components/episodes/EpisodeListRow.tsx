import Link from "next/link";
import type { EpisodeListItem } from "@/types";
import Button from "@/components/ui/Button";

interface EpisodeListRowProps { episode: EpisodeListItem; isEdit: boolean; onDelete?: (ep: EpisodeListItem) => void; }

export default function EpisodeListRow({ episode, isEdit, onDelete }: EpisodeListRowProps) {
  return (
    <Link href={`/episodes/${episode.id}`} className="flex items-center gap-5 px-5 sm:px-6 py-4 sm:py-5 neumorph-raised rounded-2xl group">
      <div className="w-12 h-12 rounded-2xl neumorph-inset flex items-center justify-center text-champagne-300/60 font-mono text-sm font-bold shrink-0 group-hover:text-gold-400/80 group-hover:shadow-[0_0_16px_rgba(212,160,32,0.15)] transition-all duration-500">{episode.episodeNumber}</div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-champagne-300/80 group-hover:text-champagne-300 transition-colors duration-300">{episode.title}</h3>
        {episode.summary && <p className="text-sm text-noir-500 line-clamp-1 mt-1.5 group-hover:text-noir-400 transition-colors">{episode.summary}</p>}
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-sm text-noir-500 font-mono tabular-nums">{episode._count.assets} 个资产</span>
        {episode.scriptName && <span className="text-xs text-gold-500/30 font-mono">剧本</span>}
        {isEdit && onDelete && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.preventDefault()}>
            <Button variant="danger" size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(episode); }}>删除</Button>
          </div>
        )}
      </div>
    </Link>
  );
}
