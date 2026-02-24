import { PlayerPosition, Team } from './types';

const generatePlayers = (teamName: string, prefix: string): any[] => {
  const positions = [
    { pos: PlayerPosition.GK, count: 1 },
    { pos: PlayerPosition.DF, count: 4 },
    { pos: PlayerPosition.MF, count: 4 },
    { pos: PlayerPosition.FW, count: 2 },
  ];

  let players = [];
  let idCounter = 1;

  for (const p of positions) {
    for (let i = 0; i < p.count; i++) {
      players.push({
        id: `${prefix}-${idCounter}`,
        name: `${prefix} Player ${idCounter}`,
        number: idCounter,
        position: p.pos,
        rating: Math.floor(Math.random() * 20) + 75,
        stamina: 100,
        stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
      });
      idCounter++;
    }
  }
  return players;
};

export const TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Flamengo',
    shortName: 'FLA',
    color: '#E30613',
    secondaryColor: '#000000',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FLA',
    players: generatePlayers('Flamengo', 'FLA'),
    tactics: { formation: '4-4-2', style: 'Attacking' }
  },
  {
    id: 't2',
    name: 'Palmeiras',
    shortName: 'PAL',
    color: '#006437',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PAL',
    players: generatePlayers('Palmeiras', 'PAL'),
    tactics: { formation: '4-3-3', style: 'Balanced' }
  },
  {
    id: 't3',
    name: 'São Paulo',
    shortName: 'SAO',
    color: '#FE0000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SAO',
    players: generatePlayers('São Paulo', 'SAO'),
    tactics: { formation: '4-2-3-1', style: 'Balanced' }
  },
  {
    id: 't4',
    name: 'Corinthians',
    shortName: 'COR',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=COR',
    players: generatePlayers('Corinthians', 'COR'),
    tactics: { formation: '4-4-2', style: 'Defensive' }
  },
  {
    id: 't5',
    name: 'Santos',
    shortName: 'SAN',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SAN',
    players: generatePlayers('Santos', 'SAN'),
    tactics: { formation: '4-3-3', style: 'Attacking' }
  },
  {
    id: 't6',
    name: 'Grêmio',
    shortName: 'GRE',
    color: '#0D80BF',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GRE',
    players: generatePlayers('Grêmio', 'GRE'),
    tactics: { formation: '4-2-3-1', style: 'Balanced' }
  },
  {
    id: 't7',
    name: 'Internacional',
    shortName: 'INT',
    color: '#E30613',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=INT',
    players: generatePlayers('Internacional', 'INT'),
    tactics: { formation: '4-4-2', style: 'Balanced' }
  },
  {
    id: 't8',
    name: 'Atlético Mineiro',
    shortName: 'CAM',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CAM',
    players: generatePlayers('Atlético Mineiro', 'CAM'),
    tactics: { formation: '4-3-3', style: 'Attacking' }
  },
  {
    id: 't9',
    name: 'Cruzeiro',
    shortName: 'CRU',
    color: '#005BA3',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CRU',
    players: generatePlayers('Cruzeiro', 'CRU'),
    tactics: { formation: '4-4-2', style: 'Balanced' }
  },
  {
    id: 't10',
    name: 'Botafogo',
    shortName: 'BOT',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BOT',
    players: generatePlayers('Botafogo', 'BOT'),
    tactics: { formation: '4-2-3-1', style: 'Balanced' }
  },
  {
    id: 't11',
    name: 'Fluminense',
    shortName: 'FLU',
    color: '#8A191D',
    secondaryColor: '#006437',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FLU',
    players: generatePlayers('Fluminense', 'FLU'),
    tactics: { formation: '4-3-3', style: 'Attacking' }
  },
  {
    id: 't12',
    name: 'Vasco da Gama',
    shortName: 'VAS',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=VAS',
    players: generatePlayers('Vasco da Gama', 'VAS'),
    tactics: { formation: '4-4-2', style: 'Defensive' }
  }
];
