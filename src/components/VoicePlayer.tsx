import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoicePlayerProps {
  dataUrl: string;
  duration?: number;
  title?: string;
  senderName?: string;
  variant?: 'dark' | 'light';
}

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

const WAVE_HEIGHTS = [28, 52, 74, 42, 88, 64, 96, 48, 70, 84, 56, 38, 76, 92, 58, 44, 68, 82, 50, 34, 62, 78, 46, 30];

export function VoicePlayer({
  dataUrl,
  duration = 0,
  title = 'Birthday Voice Note',
  senderName,
  variant = 'dark',
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(dataUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [dataUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const pct = totalDuration > 0 ? Math.min(100, (currentTime / totalDuration) * 100) : 0;
  const isDark = variant === 'dark';

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 ${
        isDark
          ? 'border-white/15 bg-[#2A1838]/90 text-[#FFFBF4]'
          : 'border-[#E6DAD1] bg-[#FCF8F5] text-[#231924]'
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95 ${
            isDark
              ? 'bg-[#F6C177] text-[#1B1124] hover:bg-[#F9D092]'
              : 'bg-[#D94F70] text-white hover:bg-[#C23E5E]'
          }`}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{title}</p>
              {senderName && (
                <p
                  className={`truncate text-xs ${
                    isDark ? 'text-[#DFCDD7]/75' : 'text-[#6E5A63]'
                  }`}
                >
                  From {senderName}
                </p>
              )}
            </div>
            <div
              className={`flex items-center gap-1.5 font-mono text-xs tabular-nums ${
                isDark ? 'text-[#F6C177]' : 'text-[#6E5A63]'
              }`}
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>
          </div>

          <div
            className="mt-3 flex h-8 cursor-pointer items-center gap-1"
            onClick={(e) => {
              const audio = audioRef.current;
              if (!audio || !totalDuration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              audio.currentTime = ratio * totalDuration;
              setCurrentTime(audio.currentTime);
            }}
            role="slider"
            aria-label="Voice note progress"
            aria-valuemin={0}
            aria-valuemax={Math.round(totalDuration)}
            aria-valuenow={Math.round(currentTime)}
            tabIndex={0}
          >
            {WAVE_HEIGHTS.map((h, idx) => {
              const barPct = ((idx + 1) / WAVE_HEIGHTS.length) * 100;
              const active = barPct <= pct;
              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-full transition-colors ${
                    active
                      ? isDark
                        ? 'bg-[#F6C177]'
                        : 'bg-[#D94F70]'
                      : isDark
                      ? 'bg-white/20'
                      : 'bg-[#DFD2C8]'
                  }`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
