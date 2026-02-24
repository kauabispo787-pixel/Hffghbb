import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, Pause, RotateCcw, Users, Activity, History, ChevronRight, Goal, ShieldAlert, Info } from 'lucide-react';
import { MatchState, Team, MatchEvent, Player } from './types';
import { TEAMS } from './constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Scoreboard = ({ state }: { state: MatchState }) => {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-8">
        {/* Home Team */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <div className="text-right">
            <h2 className="font-display font-bold text-2xl tracking-tight">{state.homeTeam.name}</h2>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{state.homeTeam.tactics.formation}</p>
          </div>
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-zinc-800 shadow-inner"
            style={{ backgroundColor: state.homeTeam.color }}
          >
            <span className="text-white font-bold text-xl">{state.homeTeam.shortName}</span>
          </div>
        </div>

        {/* Score & Time */}
        <div className="flex flex-col items-center min-w-[120px]">
          <div className="bg-zinc-950 px-4 py-1 rounded-full border border-zinc-800 mb-2">
            <span className="font-mono text-emerald-400 font-bold">
              {String(state.minute).padStart(2, '0')}:{String(state.second).padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-display font-black tracking-tighter">{state.homeScore}</span>
            <span className="text-2xl text-zinc-700 font-black">-</span>
            <span className="text-6xl font-display font-black tracking-tighter">{state.awayScore}</span>
          </div>
          {state.isFinished && (
            <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 animate-pulse">
              Fim de Jogo
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-zinc-800 shadow-inner"
            style={{ backgroundColor: state.awayTeam.color }}
          >
            <span className="text-white font-bold text-xl">{state.awayTeam.shortName}</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl tracking-tight">{state.awayTeam.name}</h2>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{state.awayTeam.tactics.formation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pitch = ({ state }: { state: MatchState }) => {
  // Simplified 2D representation of players moving
  // We'll use some random movement based on possession
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  
  useEffect(() => {
    if (state.isPaused || state.isFinished) return;
    
    const interval = setInterval(() => {
      // Move ball towards the attacking team's side
      // Possession > 50 means home team (left to right) is attacking
      const bias = state.possession > 50 ? 1 : -1;
      setBallPos(prev => ({
        x: Math.max(5, Math.min(95, prev.x + (Math.random() - 0.5 + (bias * 0.1)) * 5)),
        y: Math.max(10, Math.min(90, prev.y + (Math.random() - 0.5) * 5))
      }));
    }, 500);
    
    return () => clearInterval(interval);
  }, [state.isPaused, state.isFinished, state.possession]);

  return (
    <div className="relative w-full aspect-[16/9] bg-emerald-900 rounded-3xl overflow-hidden border-8 border-zinc-800 shadow-2xl grass-gradient">
      <div className="absolute inset-0 pitch-pattern opacity-30" />
      
      {/* Pitch Markings */}
      <div className="absolute inset-4 border-2 border-white/20 rounded-sm pointer-events-none">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20" />
        {/* Center Circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full" />
        {/* Penalty Areas */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-48 border-2 border-white/20" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-48 border-2 border-white/20" />
      </div>

      {/* Ball */}
      <motion.div 
        animate={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        className="absolute w-3 h-3 bg-white rounded-full shadow-lg z-20 border border-zinc-400"
      />

      {/* Simplified Players (Dots) */}
      {[...Array(10)].map((_, i) => (
        <React.Fragment key={i}>
          {/* Home Players */}
          <motion.div 
            animate={{ 
              left: `${15 + (i * 3) + (Math.random() * 10)}%`, 
              top: `${15 + (i * 7)}%` 
            }}
            className="absolute w-4 h-4 rounded-full border border-white/50 z-10"
            style={{ backgroundColor: state.homeTeam.color }}
          />
          {/* Away Players */}
          <motion.div 
            animate={{ 
              left: `${85 - (i * 3) - (Math.random() * 10)}%`, 
              top: `${15 + (i * 7)}%` 
            }}
            className="absolute w-4 h-4 rounded-full border border-white/50 z-10"
            style={{ backgroundColor: state.awayTeam.color }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

const EventLog = ({ events }: { events: MatchEvent[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-bottom border-zinc-800 flex items-center gap-2 bg-zinc-900/80">
        <History className="w-4 h-4 text-zinc-400" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Eventos da Partida</h3>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "p-3 rounded-xl border flex items-start gap-3",
                event.type === 'GOAL' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-zinc-800/50 border-zinc-700/50"
              )}
            >
              <div className="font-mono text-xs font-bold text-zinc-500 mt-0.5">{event.minute}'</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {event.type === 'GOAL' && <Goal className="w-3 h-3 text-emerald-400" />}
                  {event.type === 'YELLOW_CARD' && <div className="w-2 h-3 bg-yellow-400 rounded-sm" />}
                  {event.type === 'RED_CARD' && <div className="w-2 h-3 bg-red-500 rounded-sm" />}
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    event.type === 'GOAL' ? "text-emerald-400" : "text-zinc-300"
                  )}>
                    {event.type === 'GOAL' ? 'GOL!' : event.type}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatsPanel = ({ state, setMatchState }: { state: MatchState, setMatchState: React.Dispatch<React.SetStateAction<MatchState | null>> }) => {
  const stats = [
    { label: 'Posse de Bola', home: state.possession, away: 100 - state.possession, unit: '%' },
    { label: 'Finalizações', home: Math.floor(state.homeScore * 4 + Math.random() * 5), away: Math.floor(state.awayScore * 4 + Math.random() * 5) },
    { label: 'Escanteios', home: Math.floor(Math.random() * 8), away: Math.floor(Math.random() * 8) },
    { label: 'Faltas', home: Math.floor(Math.random() * 12), away: Math.floor(Math.random() * 12) },
  ];

  const updateStyle = (style: 'Attacking' | 'Defensive' | 'Balanced') => {
    setMatchState(prev => prev ? ({
      ...prev,
      homeTeam: {
        ...prev.homeTeam,
        tactics: { ...prev.homeTeam.tactics, style }
      }
    }) : null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Estatísticas em Tempo Real</h3>
        </div>
        <div className="space-y-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                <span>{stat.home.toFixed(0)}{stat.unit || ''}</span>
                <span>{stat.label}</span>
                <span>{stat.away.toFixed(0)}{stat.unit || ''}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ width: `${(stat.home / (stat.home + stat.away)) * 100}%`, backgroundColor: state.homeTeam.color }}
                />
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ width: `${(stat.away / (stat.home + stat.away)) * 100}%`, backgroundColor: state.awayTeam.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Controls */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldAlert className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Controle Tático</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['Defensive', 'Balanced', 'Attacking'] as const).map((style) => (
            <button
              key={style}
              disabled={state.isFinished}
              onClick={() => updateStyle(style)}
              className={cn(
                "py-3 px-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all",
                state.homeTeam.tactics.style === style
                  ? "bg-emerald-500 border-emerald-400 text-zinc-950"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
              )}
            >
              {style === 'Attacking' ? 'Ataque' : style === 'Defensive' ? 'Defesa' : 'Equilibrado'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [selectedHome, setSelectedHome] = useState(TEAMS[0]);
  const [selectedAway, setSelectedAway] = useState(TEAMS[1]);
  const [isSelecting, setIsSelecting] = useState(true);

  const startMatch = () => {
    setMatchState({
      homeTeam: selectedHome,
      awayTeam: selectedAway,
      homeScore: 0,
      awayScore: 0,
      minute: 0,
      second: 0,
      isPaused: false,
      isFinished: false,
      events: [{
        id: 'start',
        minute: 0,
        type: 'COMMENTARY',
        description: 'Apita o árbitro! Começa a partida.'
      }],
      possession: 50
    });
    setIsSelecting(false);
  };

  const resetMatch = () => {
    setMatchState(null);
    setIsSelecting(true);
  };

  // Match Engine Logic
  useEffect(() => {
    if (!matchState || matchState.isPaused || matchState.isFinished) return;

    const timer = setInterval(() => {
      setMatchState(prev => {
        if (!prev) return null;
        
        let { minute, second, homeScore, awayScore, events, possession } = prev;
        
        // Update time
        second += 10; // Speed up simulation
        if (second >= 60) {
          second = 0;
          minute += 1;
        }

        // End match
        if (minute >= 90) {
          return {
            ...prev,
            minute: 90,
            second: 0,
            isFinished: true,
            events: [...events, {
              id: `end-${Date.now()}`,
              minute: 90,
              type: 'COMMENTARY',
              description: 'Fim de jogo! O árbitro encerra a partida.'
            }]
          };
        }

        // Random Events
        const newEvents = [...events];
        let newHomeScore = homeScore;
        let newAwayScore = awayScore;
        let newPossession = possession + (Math.random() - 0.5) * 4;
        newPossession = Math.max(30, Math.min(70, newPossession));

        // Chance of goal (very low per tick)
        const goalChance = 0.005;
        if (Math.random() < goalChance) {
          const isHome = Math.random() < (possession / 100);
          const scoringTeam = isHome ? prev.homeTeam : prev.awayTeam;
          const player = scoringTeam.players[Math.floor(Math.random() * scoringTeam.players.length)];
          
          if (isHome) newHomeScore++; else newAwayScore++;
          
          newEvents.push({
            id: `goal-${Date.now()}`,
            minute,
            type: 'GOAL',
            teamId: scoringTeam.id,
            playerId: player.id,
            description: `GOL de ${player.name} para o ${scoringTeam.name}!`
          });
        }

        // Chance of card
        if (Math.random() < 0.002) {
          const isHome = Math.random() > 0.5;
          const team = isHome ? prev.homeTeam : prev.awayTeam;
          const player = team.players[Math.floor(Math.random() * team.players.length)];
          const isRed = Math.random() < 0.1;

          newEvents.push({
            id: `card-${Date.now()}`,
            minute,
            type: isRed ? 'RED_CARD' : 'YELLOW_CARD',
            teamId: team.id,
            playerId: player.id,
            description: `${player.name} recebe cartão ${isRed ? 'vermelho' : 'amarelo'}.`
          });
        }

        return {
          ...prev,
          minute,
          second,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          events: newEvents,
          possession: newPossession
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [matchState?.isPaused, matchState?.isFinished, !!matchState]);

  if (isSelecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Trophy className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-5xl font-display font-black tracking-tighter mb-4">STRIKERS MANAGER</h1>
            <p className="text-zinc-500 max-w-md mx-auto">Prepare sua tática, escolha seu time e domine o gramado no simulador de futebol definitivo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Home Selection */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 block">Time da Casa</label>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {TEAMS.map(team => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedHome(team)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200",
                      selectedHome.id === team.id 
                        ? "bg-zinc-800 border-zinc-600 scale-[1.02] shadow-lg" 
                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: team.color }}>
                      <span className="text-white text-xs font-bold">{team.shortName}</span>
                    </div>
                    <span className="font-bold">{team.name}</span>
                    {selectedHome.id === team.id && <ChevronRight className="w-4 h-4 ml-auto text-zinc-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Away Selection */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 block">Time Visitante</label>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {TEAMS.map(team => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedAway(team)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200",
                      selectedAway.id === team.id 
                        ? "bg-zinc-800 border-zinc-600 scale-[1.02] shadow-lg" 
                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: team.color }}>
                      <span className="text-white text-xs font-bold">{team.shortName}</span>
                    </div>
                    <span className="font-bold">{team.name}</span>
                    {selectedAway.id === team.id && <ChevronRight className="w-4 h-4 ml-auto text-zinc-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startMatch}
            disabled={selectedHome.id === selectedAway.id}
            className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-black text-xl rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          >
            <Play className="w-6 h-6 fill-current" />
            INICIAR PARTIDA
          </button>
          {selectedHome.id === selectedAway.id && (
            <p className="text-center mt-4 text-xs text-red-400 font-bold uppercase tracking-widest">Escolha times diferentes para jogar</p>
          )}
        </motion.div>
      </div>
    );
  }

  if (!matchState) return null;

  return (
    <div className="min-h-screen bg-zinc-950 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Match View */}
        <div className="lg:col-span-8 space-y-8">
          <Scoreboard state={matchState} />
          
          <div className="relative group">
            <Pitch state={matchState} />
            
            {/* Controls Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={() => setMatchState(prev => prev ? ({ ...prev, isPaused: !prev.isPaused }) : null)}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                {matchState.isPaused ? <Play className="w-5 h-5 fill-white" /> : <Pause className="w-5 h-5 fill-white" />}
              </button>
              <button 
                onClick={resetMatch}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StatsPanel state={matchState} setMatchState={setMatchState} />
            
            {/* Lineups Preview */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Escalações</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-3">{matchState.homeTeam.name}</p>
                  {matchState.homeTeam.players.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">{p.name}</span>
                      <span className="font-mono text-zinc-600">{p.position}</span>
                    </div>
                  ))}
                </div>
                <div className="w-px bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-3 text-right">{matchState.awayTeam.name}</p>
                  {matchState.awayTeam.players.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-600">{p.position}</span>
                      <span className="text-zinc-400">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 h-[calc(100vh-6rem)] sticky top-12">
          <EventLog events={matchState.events} />
        </div>
      </div>
      {/* Match End Overlay */}
      <AnimatePresence>
        {matchState.isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 text-center shadow-2xl"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
                <Trophy className="w-12 h-12 text-amber-500" />
              </div>
              <h2 className="text-4xl font-display font-black tracking-tighter mb-2">FIM DE PARTIDA</h2>
              <p className="text-zinc-500 mb-8 uppercase tracking-[0.3em] text-xs font-bold">Resultado Final</p>
              
              <div className="flex items-center justify-center gap-8 mb-12">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-zinc-800 mb-4 mx-auto" style={{ backgroundColor: matchState.homeTeam.color }}>
                    <span className="text-white font-bold text-xl">{matchState.homeTeam.shortName}</span>
                  </div>
                  <p className="font-bold text-2xl">{matchState.homeScore}</p>
                </div>
                <div className="text-4xl font-black text-zinc-800">-</div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-zinc-800 mb-4 mx-auto" style={{ backgroundColor: matchState.awayTeam.color }}>
                    <span className="text-white font-bold text-xl">{matchState.awayTeam.shortName}</span>
                  </div>
                  <p className="font-bold text-2xl">{matchState.awayScore}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={resetMatch}
                  className="w-full py-5 bg-white text-zinc-950 font-black rounded-2xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3"
                >
                  <RotateCcw className="w-5 h-5" />
                  NOVA PARTIDA
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
