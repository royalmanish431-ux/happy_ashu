import { useEffect, useState } from 'react';
import { MONTHS } from '../data/fixedWish';

interface CountdownTimerProps {
  birthDay: number;
  birthMonth: number;
  recipientName: string;
  variant?: 'light' | 'dark';
  compact?: boolean;
}

interface CountdownState {
  isBirthdayToday: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetYear: number;
}

function computeCountdown(birthDay: number, birthMonth: number): CountdownState {
  const now = new Date();
  const safeMonth = Math.min(12, Math.max(1, birthMonth || 1)) - 1;
  const maxDayInMonth = new Date(now.getFullYear(), safeMonth + 1, 0).getDate();
  const safeDay = Math.min(maxDayInMonth, Math.max(1, birthDay || 1));

  const isToday = now.getMonth() === safeMonth && now.getDate() === safeDay;
  if (isToday) {
    return {
      isBirthdayToday: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetYear: now.getFullYear(),
    };
  }

  let target = new Date(now.getFullYear(), safeMonth, safeDay, 0, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    const nextYear = now.getFullYear() + 1;
    const nextMaxDay = new Date(nextYear, safeMonth + 1, 0).getDate();
    target = new Date(nextYear, safeMonth, Math.min(nextMaxDay, safeDay), 0, 0, 0, 0);
  }

  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    isBirthdayToday: false,
    days,
    hours,
    minutes,
    seconds,
    targetYear: target.getFullYear(),
  };
}

export function CountdownTimer({
  birthDay,
  birthMonth,
  recipientName,
  variant = 'light',
  compact = false,
}: CountdownTimerProps) {
  const [state, setState] = useState<CountdownState>(() =>
    computeCountdown(birthDay, birthMonth)
  );

  useEffect(() => {
    setState(computeCountdown(birthDay, birthMonth));
    const timer = window.setInterval(() => {
      setState(computeCountdown(birthDay, birthMonth));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [birthDay, birthMonth]);

  const monthName = MONTHS[(birthMonth - 1 + 12) % 12] || 'January';
  const isDark = variant === 'dark';

  const units = [
    { label: 'Days', value: state.days },
    { label: 'Hours', value: state.hours },
    { label: 'Minutes', value: state.minutes },
    { label: 'Seconds', value: state.seconds },
  ];

  if (state.isBirthdayToday) {
    return (
      <div
        className={`rounded-2xl border p-5 text-center ${
          isDark
            ? 'border-[#F6C177]/35 bg-[#2A1735]/80 text-[#FFFBF4]'
            : 'border-[#D94F70]/25 bg-[#FFF4F6] text-[#231924]'
        }`}
      >
        <p
          className={`text-xs font-semibold tracking-wide ${
            isDark ? 'text-[#F6C177]' : 'text-[#B84A62]'
          }`}
        >
          {monthName} {birthDay} · Midnight Magic Unlocked
        </p>
        <p className="mt-1.5 font-display text-2xl font-semibold">
          Today is {recipientName || 'their'} birthday
        </p>
        <p className={`mt-1 text-sm ${isDark ? 'text-[#E7D8DF]/80' : 'text-[#5E4B56]'}`}>
          The celebration is live right now.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      } ${
        isDark
          ? 'border-white/12 bg-[#251630]/85 text-[#FFFBF4]'
          : 'border-[#E6DAD1] bg-white text-[#231924]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`text-xs font-medium ${isDark ? 'text-[#E7D8DF]/80' : 'text-[#6E5A63]'}`}>
          Countdown to {recipientName ? `${recipientName}'s` : 'the'} birthday
        </p>
        <p
          className={`text-xs font-semibold ${
            isDark ? 'text-[#F6C177]' : 'text-[#B84A62]'
          }`}
        >
          {monthName} {birthDay}, {state.targetYear}
        </p>
      </div>

      <div className={`mt-3 grid grid-cols-4 ${compact ? 'gap-2' : 'gap-2.5 sm:gap-3'}`}>
        {units.map((u) => (
          <div
            key={u.label}
            className={`rounded-xl border text-center ${
              compact ? 'px-2 py-2.5' : 'px-3 py-3.5'
            } ${
              isDark
                ? 'border-white/10 bg-[#180E20]/80'
                : 'border-[#EFE5DC] bg-[#FCF8F5]'
            }`}
          >
            <div
              className={`font-mono font-semibold tabular-nums ${
                compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
              } ${isDark ? 'text-[#FFFBF4]' : 'text-[#231924]'}`}
            >
              {String(u.value).padStart(2, '0')}
            </div>
            <div
              className={`mt-1 text-[11px] font-medium ${
                isDark ? 'text-[#D6C3CD]/75' : 'text-[#7A6770]'
              }`}
            >
              {u.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
