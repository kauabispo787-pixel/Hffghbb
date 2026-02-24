export enum PlayerPosition {
  GK = 'Goleiro',
  DF = 'Defensor',
  MF = 'Meio-Campo',
  FW = 'Atacante'
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: PlayerPosition;
  rating: number; // 1-100
  stamina: number; // 0-100
  stats: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  logo: string;
  players: Player[];
  tactics: {
    formation: string;
    style: 'Attacking' | 'Defensive' | 'Balanced';
  };
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'COMMENTARY';
  teamId?: string;
  playerId?: string;
  description: string;
}

export interface MatchState {
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  minute: number;
  second: number;
  isPaused: boolean;
  isFinished: boolean;
  events: MatchEvent[];
  possession: number; // 0-100 (home team percentage)
}
