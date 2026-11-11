export interface EquipeChallengermode {
  id: string;
  jeu: 'hok' | 'mlbb';
  nom: string;
  logo?: string;
  tournoiUrl: string;
  membres: { id: string; pseudo: string; capitaine: boolean }[];
}

export interface VitrineChallengermode {
  equipes: EquipeChallengermode[];
  updatedAt: string;
  stale: boolean;
}
