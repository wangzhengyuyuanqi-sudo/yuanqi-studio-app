import Link from "next/link";
import type { EpisodeListItem } from "@/types";
import Button from "@/components/ui/Button";

interface EpisodeListRowProps {
  episode: EpisodeListItem;
  isEdit: boolean;
  onDelete?: (episode: EpisodeListItem) => void;
}

export default function EpisodeListRow({ episode, isEdit, onDelete }: EpisodeListRowProps) {
  return (
    <Link
      href={`/episodes/${episode.id}`}
      className="flex items-center gap-5 px-5 py-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300 group"
    >
      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-noir-400 font-mono text-xs shrink-0 group-hover:bg-gold-500/10 group-hover:text-gold-400 group-hover:border-gold-500/20 transition-all duration-300">
        {episode.episodeNumber}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-noir-200 group-hover:text-noir-50 transition-colors duration-200">
          {episode.title}
        </h3>
        {episode.summary && (
          <p className="text-xs text-noir-500 line-clamp-1 mt-1 group-hover:text-noir-400 transition-colors">
            {episode.summary}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="text-xs text-noir-600 font-mono tabular-nums">{episode._count.assets} 个资产</span>
        {episode.scriptName && (
          <span className="text-xs text-gold-400/40 font-mono">剧本</span>
        )}

        {isEdit && onDelete && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.preventDefault()}>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(episode); }}
            >
              删除
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
}
