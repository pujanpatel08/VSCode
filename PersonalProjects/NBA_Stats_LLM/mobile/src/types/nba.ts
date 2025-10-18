export interface Player {
  id: string;
  firstname: string;
  lastname: string;
  team?: {
    id: string;
    name: string;
    code: string;
  };
  position?: string;
  height?: string;
  weight?: string;
  birth?: {
    date: string;
    country: string;
  };
}

export interface PlayerStats {
  points?: number;
  totReb?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  fgm?: number;
  fga?: number;
  fgp?: number;
  tpm?: number;
  tpa?: number;
  tpp?: number;
  ftm?: number;
  fta?: number;
  ftp?: number;
  turnovers?: number;
  games?: GameStats[];
}

export interface GameStats {
  id: string;
  date: string;
  points: number;
  totReb: number;
  assists: number;
  steals: number;
  blocks: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  ftm: number;
  fta: number;
  turnovers: number;
  team: {
    name: string;
  };
  opponent: {
    name: string;
  };
}

export interface Team {
  id: string;
  name: string;
  code: string;
  city: string;
  logo: string;
}

export interface Season {
  year: string;
  type: 'regular' | 'playoffs';
}

export interface AIResponse {
  response: string;
  confidence?: number;
  sources?: string[];
}
