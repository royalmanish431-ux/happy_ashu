import { useState } from 'react';
import {
  ArrowRight,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Download,
} from 'lucide-react';
import type { BirthdayWish } from '../types/wish';
import { CakeIllustration } from './CakeIllustration';
import { ConfettiCanvas } from './ConfettiCanvas';
import { CountdownTimer } from './CountdownTimer';
import { VoicePlayer } from './VoicePlayer';
import { downloadBirthdayShareCard } from '../utils/shareCard';
import {
  playBalloonPop,
  playBirthdayMelody,
  playBowRelease,
  playCandleChime,
} from '../utils/sound';

interface CelebrationExperienceProps {
  wish: BirthdayWish;
}

const SCENE_TITLES = [
  'Countdown',
  'Birthday Cake',
  'Heart Reveal',
  'Balloon Wishes',
  'Gallery & Voice',
  'Birthday Letter',
  'Finale',
];

const BALLOON_COLORS = [
  { fill: '#EB6F92', accent: '#FBC2D2', border: 'border-[#EB6F92]/50' },
  { fill: '#9CCFD8', accent: '#D5EEF2', border: 'border-[#9CCFD8]/50' },
  { fill: '#C4A7E7', accent: '#E6DAF8', border: 'border-[#C4A7E7]/50' },
  { fill: '#F6C177', accent: '#FDE4BF', border: 'border-[#F6C177]/50' },
  { fill: '#EA9A97', accent: '#F9D6D4', border: 'border-[#EA9A97]/50' },
];

export function CelebrationExperience({ wish }: CelebrationExperienceProps) {
  const [scene, setScene] = useState(0);
  const [muted, setMuted] = useState(false);
  const [confettiKey, setConfettiKey] = useState(1);

  // Scene 1: Cake state
  const [cakeStage, setCakeStage] = useState<'unlit' | 'lit' | 'blown' | 'cut'>('lit');

  // Scene 2: Bow & Arrow state
  const [bowPull, setBowPull] = useState(0);
  const [arrowReleased, setArrowReleased] = useState(false);

  // Scene 3: Popped balloons
  const [poppedIndices, setPoppedIndices] = useState<number[]>([]);

  // Scene 4: Photo gallery index + lightbox
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const recipient = wish.recipientName;
  const sender = wish.senderName;
  const photos = wish.photos;
  const balloons = wish.balloons;

  const triggerBurst = () => setConfettiKey((k) => k + 1);

  const goToScene = (next: number) => {
    const clamped = Math.max(0, Math.min(SCENE_TITLES.length - 1, next));
    setScene(clamped);
    if (clamped === 6) {
      triggerBurst();
      playBirthdayMelody(muted);
    }
  };

  const handleCakeAction = () => {
    if (cakeStage === 'unlit') {
      setCakeStage('lit');
      playCandleChime(muted);
      triggerBurst();
    } else if (cakeStage === 'lit') {
      setCakeStage('blown');
      playCandleChime(muted);
      triggerBurst();
    } else if (cakeStage === 'blown') {
      setCakeStage('cut');
      playBirthdayMelody(muted);
      triggerBurst();
    } else {
      goToScene(2);
    }
  };

  const handleShootArrow = () => {
    if (arrowReleased) return;
    setBowPull(100);
    window.setTimeout(() => {
      setArrowReleased(true);
      playBowRelease(muted);
      triggerBurst();
    }, 180);
  };

  const handlePopBalloon = (idx: number) => {
    if (!poppedIndices.includes(idx)) {
      setPoppedIndices((prev) => [...prev, idx]);
      playBalloonPop(muted);
      triggerBurst();
    }
  };

  const currentPhoto = photos[activePhotoIdx];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#1B1124] text-[#FFFBF4]">
      {/* Ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(217,79,112,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(246,193,119,0.14),transparent_50%)]"
      />
      <ConfettiCanvas triggerKey={confettiKey} ambient />

      {/* Top Celebration Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#1B1124]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => goToScene(0)}
            className="font-display text-lg font-semibold tracking-tight text-[#FFFBF4] whitespace-nowrap shrink-0"
          >
            For {recipient}
          </button>

          <nav className="hidden items-center gap-1.5 md:flex">
            {SCENE_TITLES.map((title, idx) => (
              <button
                key={title}
                type="button"
                onClick={() => goToScene(idx)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  scene === idx
                    ? 'bg-[#F6C177] text-[#1B1124]'
                    : 'text-[#DFCDD7]/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                {title}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-xs text-[#F6C177] tabular-nums md:hidden">
              0{scene + 1} / 0{SCENE_TITLES.length}
            </span>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Unmute celebration sounds' : 'Mute celebration sounds'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#FFFBF4] transition-colors hover:bg-white/10"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Scene Stage */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-132px)] max-w-5xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-12">
        {/* SCENE 0: COUNTDOWN & WELCOME */}
        {scene === 0 && (
          <section className="mx-auto w-full max-w-2xl text-center">
            <p className="text-xs font-medium tracking-wide text-[#F6C177]">
              Made with love by {sender}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Happy Birthday, <span className="italic text-[#F6C177]">{recipient}</span>
            </h1>
            {wish.turningAge && (
              <p className="mt-3 text-base text-[#E7D8DF]/85">
                Celebrating {wish.turningAge} bright years ahead
              </p>
            )}

            <div className="mt-8">
              <CountdownTimer
                birthDay={wish.birthDay}
                birthMonth={wish.birthMonth}
                recipientName={recipient}
                variant="dark"
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  playCandleChime(muted);
                  triggerBurst();
                  goToScene(1);
                }}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#F6C177] px-7 py-3 text-sm font-semibold text-[#1B1124] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Open Birthday Surprise
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* SCENE 1: CAKE & CANDLE WISH */}
        {scene === 1 && (
          <section className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
            <p className="text-xs font-medium text-[#F6C177]">
              First things first · Light, wish & slice
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              {cakeStage === 'lit' && `Make a wish, ${recipient}`}
              {cakeStage === 'blown' && 'Wish captured! Now cut the cake'}
              {cakeStage === 'cut' && `Cheers to ${recipient}!`}
              {cakeStage === 'unlit' && 'Tap the cake to light the candle'}
            </h2>

            <button
              type="button"
              onClick={handleCakeAction}
              className="group my-6 flex flex-col items-center rounded-3xl p-4 transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-[#F6C177]"
            >
              <CakeIllustration
                flavor={wish.cakeFlavor}
                candleLit={cakeStage === 'lit'}
                blownOut={cakeStage === 'blown' || cakeStage === 'cut'}
                sliced={cakeStage === 'cut'}
                size="lg"
              />
            </button>

            <p className="text-sm text-[#E7D8DF]/80">
              {cakeStage === 'lit' && 'Tap the cake to blow out the candle'}
              {cakeStage === 'blown' && 'Tap again to cut the first celebratory slice'}
              {cakeStage === 'cut' && 'Sweetness unlocked — ready for the next surprise'}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCakeAction}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#F6C177] px-6 py-2.5 text-sm font-semibold text-[#1B1124] transition-colors hover:bg-[#FAD194]"
              >
                {cakeStage === 'lit' && 'Blow Out Candle'}
                {cakeStage === 'blown' && 'Cut Birthday Cake'}
                {cakeStage === 'cut' && 'Continue to Heart Reveal'}
                {cakeStage === 'unlit' && 'Light Candle'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* SCENE 2: PULL & RELEASE BOW HEART REVEAL */}
        {scene === 2 && (
          <section className="mx-auto w-full max-w-2xl">
            {!arrowReleased ? (
              <div className="rounded-3xl border border-[#F6C177]/20 bg-gradient-to-b from-[#FFF5EF] to-[#FCE6DC] p-6 text-center text-[#3B222C] shadow-2xl sm:p-10">
                <p className="font-display text-lg italic text-[#B84A62]">
                  a little something, for you
                </p>

                <div className="my-8 flex flex-col items-center justify-center gap-10">
                  <div className="relative flex h-28 w-28 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#EB6F92]/25 blur-xl" />
                    <Heart className="relative h-20 w-20 fill-[#EB6F92] text-[#EB6F92] animate-gentle-float" />
                  </div>

                  <div className="w-full max-w-xs space-y-4">
                    <div className="flex items-center justify-center">
                      <svg viewBox="0 0 120 90" className="h-24 w-32" aria-hidden="true">
                        <path
                          d="M20 55 Q60 85 100 55"
                          fill="none"
                          stroke="#6B4423"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <path
                          d={`M20 55 Q60 ${55 + bowPull * 0.25} 100 55`}
                          fill="none"
                          stroke="#8C6239"
                          strokeWidth="1.5"
                        />
                        <line
                          x1="60"
                          y1={12 + bowPull * 0.2}
                          x2="60"
                          y2={68 + bowPull * 0.2}
                          stroke="#D94F70"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <polygon
                          points={`60,${4 + bowPull * 0.2} 54,${16 + bowPull * 0.2} 66,${16 + bowPull * 0.2}`}
                          fill="#F6C177"
                        />
                      </svg>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={bowPull}
                      onChange={(e) => setBowPull(Number(e.target.value))}
                      onMouseUp={() => {
                        if (bowPull > 40) handleShootArrow();
                      }}
                      onTouchEnd={() => {
                        if (bowPull > 40) handleShootArrow();
                      }}
                      aria-label="Pull bow string to shoot arrow"
                      className="w-full accent-[#D94F70]"
                    />
                    <p className="text-xs font-semibold tracking-widest text-[#9E475C]">
                      PULL & RELEASE OR TAP BELOW
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShootArrow}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#D94F70] px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C23E5E]"
                >
                  Release Arrow
                </button>
              </div>
            ) : (
              <div className="celebration-grid rounded-3xl border border-white/15 bg-gradient-to-b from-[#E53E7E] via-[#C92A68] to-[#981D4F] p-8 text-center text-white shadow-2xl sm:p-12">
                <p className="font-display text-lg italic text-[#FFE0EA]">
                  it&apos;s officially your day
                </p>
                <h2 className="mt-4 font-display text-5xl font-bold leading-tight text-balance sm:text-6xl">
                  Happy Birthday,
                  <br />
                  {recipient}
                </h2>
                <div className="mx-auto my-6 h-1 w-40 rounded-full bg-[#F6C177]" />
                <p className="text-base text-[#FFE8F0]">
                  {wish.turningAge
                    ? `And just like that, you are turning ${wish.turningAge}`
                    : 'To someone deeply worth celebrating'}
                </p>

                <button
                  type="button"
                  onClick={() => goToScene(3)}
                  className="mt-8 inline-flex min-h-[46px] items-center gap-2 rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-[#981D4F] transition-transform hover:scale-[1.02]"
                >
                  Pop Your Balloons
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* SCENE 3: POP THE BALLOONS */}
        {scene === 3 && (
          <section className="mx-auto w-full max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Pop the balloons
            </h2>
            <p className="mt-2 text-sm text-[#E7D8DF]/80">
              {balloons.length} balloons · Tap each one to reveal a reason you are loved
            </p>

            <div className="mt-7 space-y-3 text-left">
              {balloons.map((reason, idx) => {
                const isPopped = poppedIndices.includes(idx);
                const color = BALLOON_COLORS[idx % BALLOON_COLORS.length];

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePopBalloon(idx)}
                    className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${
                      isPopped
                        ? `${color.border} bg-[#281834]/90`
                        : 'border-white/15 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#1B1124] transition-transform"
                        style={{
                          backgroundColor: isPopped ? color.accent : color.fill,
                          transform: isPopped ? 'scale(0.92)' : 'scale(1)',
                        }}
                      >
                        {isPopped ? `0${idx + 1}` : 'Pop'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#F6C177]">
                          Reason No. {idx + 1}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-[#FFFBF4] sm:text-base">
                          {isPopped ? reason : 'Tap to pop this balloon'}
                        </p>
                      </div>
                    </div>
                    <Sparkles
                      className={`h-4 w-4 shrink-0 ${
                        isPopped ? 'text-[#F6C177]' : 'text-white/30'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              {poppedIndices.length < balloons.length && (
                <button
                  type="button"
                  onClick={() => {
                    setPoppedIndices(balloons.map((_, i) => i));
                    playBalloonPop(muted);
                    triggerBurst();
                  }}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-[#FFFBF4] hover:bg-white/10"
                >
                  Pop All
                </button>
              )}
              <button
                type="button"
                onClick={() => goToScene(4)}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#F6C177] px-7 py-2.5 text-sm font-semibold text-[#1B1124] hover:bg-[#FAD194]"
              >
                Memories & Voice Note
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* SCENE 4: PHOTO GALLERY + VOICE NOTE */}
        {scene === 4 && (
          <section className="mx-auto w-full max-w-4xl">
            <div className="text-center">
              <p className="text-xs font-medium text-[#F6C177]">
                Captured moments & recorded voice
              </p>
              <h2 className="mt-1.5 font-display text-3xl font-semibold sm:text-4xl">
                Photo Gallery & Voice Note
              </h2>
            </div>

            <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                {currentPhoto && (
                  <div className="relative overflow-hidden rounded-3xl border-2 border-white/80 bg-[#23142E] shadow-2xl">
                    <svg
                      viewBox="0 0 400 28"
                      className="pointer-events-none absolute left-0 right-0 top-0 z-10 w-full"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 2 Q200 18 400 2"
                        fill="none"
                        stroke="rgba(255,255,255,0.75)"
                        strokeWidth="1.5"
                      />
                      {[
                        { x: 18, c: '#F6C177' },
                        { x: 58, c: '#EB6F92' },
                        { x: 98, c: '#9CCFD8' },
                        { x: 138, c: '#EA9A97' },
                        { x: 178, c: '#C4A7E7' },
                        { x: 218, c: '#FFFBF4' },
                        { x: 258, c: '#F6C177' },
                        { x: 298, c: '#EB6F92' },
                        { x: 338, c: '#9CCFD8' },
                      ].map((flag, idx) => (
                        <polygon
                          key={idx}
                          points={`${flag.x},6 ${flag.x + 28},8 ${flag.x + 14},26`}
                          fill={flag.c}
                        />
                      ))}
                    </svg>

                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="block aspect-[4/3] w-full overflow-hidden bg-[#180E20]"
                    >
                      <img
                        src={currentPhoto.src}
                        alt={currentPhoto.caption}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </button>

                    <div className="flex items-center justify-between gap-4 bg-[#180E20]/95 px-5 py-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#FFFBF4]">
                          {currentPhoto.caption}
                        </p>
                        <p className="text-xs text-[#DFCDD7]/75">
                          Photo {activePhotoIdx + 1} of {photos.length} · Tap photo to zoom
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setActivePhotoIdx((i) => (i - 1 + photos.length) % photos.length)
                          }
                          aria-label="Previous photo"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/15"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePhotoIdx((i) => (i + 1) % photos.length)}
                          aria-label="Next photo"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/15"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {photos.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-opacity ${
                        idx === activePhotoIdx
                          ? 'border-[#F6C177] opacity-100'
                          : 'border-transparent opacity-55 hover:opacity-85'
                      }`}
                    >
                      <img
                        src={p.src}
                        alt={p.caption}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 lg:col-span-5">
                <VoicePlayer
                  dataUrl={wish.voiceNoteUrl}
                  duration={wish.voiceDuration}
                  title={wish.voiceTitle}
                  senderName={sender}
                  variant="dark"
                />

                <div className="rounded-2xl border border-white/15 bg-[#251630]/75 p-5">
                  <p className="text-xs font-medium text-[#F6C177]">From {sender}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#E7D8DF]">
                    Every snapshot here holds a piece of why this day matters. Press play on the voice note while flipping through each memory.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => goToScene(5)}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#F6C177] px-6 py-3 text-sm font-semibold text-[#1B1124] hover:bg-[#FAD194]"
                >
                  Read Birthday Letter
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SCENE 5: CUSTOM BIRTHDAY LETTER */}
        {scene === 5 && (
          <section className="mx-auto w-full max-w-2xl">
            <div className="lined-paper rounded-3xl border border-[#E6D5C3] p-6 text-[#2B1F29] shadow-2xl sm:p-10">
              <h2 className="font-display text-2xl font-semibold italic text-[#7B4B2A] sm:text-3xl">
                Dear {recipient},
              </h2>
              <div className="mt-5 whitespace-pre-wrap text-[15px] leading-[36px] text-[#2B1F29] sm:text-base sm:leading-[36px]">
                {wish.letter}
              </div>
              <p className="mt-8 text-right font-display text-lg font-semibold italic text-[#8D5B36]">
                With all my love,
                <br />— {sender}
              </p>
            </div>

            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={() => goToScene(6)}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#F6C177] px-8 py-3 text-sm font-semibold text-[#1B1124] hover:bg-[#FAD194]"
              >
                Continue to Birthday Finale
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* SCENE 6: GRAND FINALE */}
        {scene === 6 && (
          <section className="mx-auto w-full max-w-xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
              HAPPY BIRTHDAY
              <br />
              <span className="italic text-[#F6C177]">{recipient}!</span>
            </h2>
            <p className="mt-4 text-base text-[#E7D8DF]/90">
              Made with love just for you — {sender}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => triggerBurst()}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#F6C177] px-6 py-2.5 text-sm font-semibold text-[#1B1124] hover:bg-[#FAD194]"
              >
                <Sparkles className="h-4 w-4" />
                Replay Confetti
              </button>
              <button
                type="button"
                onClick={() => downloadBirthdayShareCard(wish)}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-semibold text-[#FFFBF4] hover:bg-white/15"
              >
                <Download className="h-4 w-4" />
                Save Keepsake Card
              </button>
              <button
                type="button"
                onClick={() => goToScene(0)}
                className="inline-flex min-h-[46px] items-center rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-[#DFCDD7] hover:bg-white/10"
              >
                Restart Story
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Scene Navigation */}
      <footer className="sticky bottom-0 z-20 border-t border-white/10 bg-[#1B1124]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          <button
            type="button"
            onClick={() => goToScene(scene - 1)}
            disabled={scene === 0}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-xs font-medium text-[#E7D8DF] hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {SCENE_TITLES.map((title, idx) => (
              <button
                key={title}
                type="button"
                onClick={() => goToScene(idx)}
                aria-label={`Go to ${title}`}
                className={`h-2 rounded-full transition-all ${
                  scene === idx ? 'w-6 bg-[#F6C177]' : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToScene(scene + 1)}
            disabled={scene === SCENE_TITLES.length - 1}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-xs font-medium text-[#F6C177] hover:bg-white/10 disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {/* Lightbox Modal for Photos */}
      {lightboxOpen && currentPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-[#1B1124]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close photo zoom"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-[4/3] w-full bg-black">
              <img
                src={currentPhoto.src}
                alt={currentPhoto.caption}
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="px-5 py-4 text-center text-sm text-[#FFFBF4]">
              {currentPhoto.caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
