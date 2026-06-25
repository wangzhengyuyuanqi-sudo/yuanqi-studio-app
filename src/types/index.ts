export type AssetType = "CHARACTER_COSTUME" | "SCENE_DESIGN" | "PROP" | "SCRIPT";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DramaListItem {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { episodes: number };
}

export interface DramaDetail extends DramaListItem {
  episodes: EpisodeListItem[];
}

export interface EpisodeListItem {
  id: string;
  episodeNumber: number;
  title: string;
  summary: string | null;
  scriptPath: string | null;
  scriptName: string | null;
  dramaId: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { assets: number };
}

export interface EpisodeDetail extends EpisodeListItem {
  assets: AssetItem[];
}

export interface AssetItem {
  id: string;
  name: string;
  description: string | null;
  type: AssetType;
  imagePath: string | null;
  imageName: string | null;
  tags: string | null;
  episodeId: string;
  createdAt: string;
  updatedAt: string;
}
