import { memo, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useSession } from "../hooks/use-session";
import { useWakeLock } from "../hooks/use-wake-lock";
import { malaBeads, malaCaption, malaSize } from "../lib/mala";
import { playBead, playBell } from "../lib/sound";
import {
  selectedText,
  type Session as SessionData,
  type Settings,
} from "../lib/types";
import type { Copy } from "../lib/translations";
import { Completion, formatTime } from "./completion";
import { Lotus } from "./lotus";
import { Mala } from "./mala";
const OPENING_MS = 4000;
const OPENING_SEC = OPENING_MS / 1000;
const CLOSING_MS = 3000;
const CLOSING_SEC = CLOSING_MS / 1000;
function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
function countdown(ms: number, onTick: (seconds: number) => void, onDone: () => void) {
  const started = Date.now();
  const tick = () =>
    onTick(Math.max(1, Math.ceil((ms - (Date.now() - started)) / 1000)));
  tick();
  const interval = window.setInterval(tick, 200);
  const timeout = window.setTimeout(onDone, ms);
  return () => {
    window.clearInterval(interval);
    window.clearTimeout(timeout);
  };
}
const SacredHeading = memo(function SacredHeading({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  return (
    <>
      <p className="eyebrow">{label}</p>
      <h1 className="session-mantra">{text}</h1>
    </>
  );
});
interface Props {
  onMounted: () => void;
  autoStart: boolean;
  settings: Settings;
  initial: SessionData;
  copy: Copy;
  onSave: (session: SessionData) => void;
  onAgain: () => void;
  onHome: () => void;
  onLeave: () => void;
  onSound: (sound: boolean) => void;
  onQuiet: (quiet: boolean) => void;
}
export function Session({
  settings,
  initial,
  copy: t,
  onSave,
  onAgain,
  onHome,
  onLeave,
  onSound,
  autoStart,
  onMounted,
  onQuiet,
}: Props) {
  const fresh =
    autoStart &&
    !initial.completed &&
    initial.count === 0 &&
    initial.elapsed < 1 &&
    !reducedMotion();
  const [opening, setOpening] = useState(fresh);
  const [left, setLeft] = useState(OPENING_SEC);
  const [restLeft, setRestLeft] = useState(CLOSING_SEC);
  const [closed, setClosed] = useState(initial.completed);
  const [focus, setFocus] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const began = useRef(false);
  const startedComplete = useRef(initial.completed);
  const { session, running, count, undo, finish, start, toggle } = useSession(
    settings,
    initial,
    onSave,
    autoStart && !fresh,
  );
  const sound = Boolean(settings.sound);
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const begin = () => {
    if (began.current) return;
    began.current = true;
    setOpening(false);
    start();
    if (soundRef.current) playBell();
  };
  useEffect(() => {
    onMounted();
  }, [onMounted]);
  useLayoutEffect(() => {
    onQuiet(!startedComplete.current && !closed);
    return () => onQuiet(false);
  }, [closed, onQuiet]);
  const reveal = () => setClosed(true);
  useEffect(() => {
    if (!opening) return;
    return countdown(OPENING_MS, setLeft, begin);
  }, [opening]);
  useEffect(() => {
    if (!session.completed || closed || startedComplete.current) return;
    if (sound) playBell();
    if (reducedMotion()) {
      reveal();
      return;
    }
    setRestLeft(CLOSING_SEC);
    return countdown(CLOSING_MS, setRestLeft, reveal);
  }, [session.completed, closed, sound]);
  const closing = session.completed && !closed && !startedComplete.current;
  useWakeLock(opening || running || closing);
  if (session.completed && (closed || startedComplete.current))
    return (
      <Completion
        session={session}
        settings={settings}
        copy={t}
        onAgain={onAgain}
        onHome={onHome}
      />
    );
  const isBreath = settings.mode === "breath";
  const phase = Math.floor(session.elapsed / settings.breathSeconds) % 2;
  const round = malaSize(settings.target);
  const caption =
    settings.mode === "count"
      ? malaCaption(session.count, settings.target, t)
      : null;
  const tap = () => {
    if (opening) {
      begin();
      return;
    }
    if (!running) return;
    const completing = settings.target > 0 && session.count + 1 >= settings.target;
    count();
    if (sound && !completing) playBead();
  };
  if (closing)
    return (
      <section className="practice-screen screen-enter">
        <SacredHeading text={selectedText(settings)} label={t[settings.kind]} />
        <Lotus className="completion-lotus" />
        <p className="practice-instruction">{t.closing}</p>
        <div className="session-controls">
          <button
            className="primary-button"
            onClick={reveal}
            aria-live="polite"
            aria-label={`${t.continue} ${restLeft}`}
          >
            <span className="begin-wait">
              {t.continue} · {restLeft}
            </span>
          </button>
        </div>
      </section>
    );
  return (
    <section className="practice-screen screen-enter">
      <SacredHeading text={selectedText(settings)} label={t[settings.kind]} />
      {settings.mode === "count" ? (
        <div className="practice-focus">
          <Mala filled={malaBeads(session.count, round)} total={round} />
          <button
            className="practice-orb count-orb"
            onClick={tap}
            disabled={!opening && !running}
            aria-label={`${t.count}: ${session.count}`}
          >
            {opening && (
              <span
                className="breathing-halo"
                style={
                  {
                    "--breath-duration": "4s",
                    animationPlayState: "running",
                  } as CSSProperties
                }
              />
            )}
            <span className="orb-number">
              {opening || focus ? "·" : session.count}
            </span>
            {opening ? null : focus ? (
              <span className="orb-caption">{t[settings.kind]}</span>
            ) : caption ? (
              <span className="orb-caption">{caption}</span>
            ) : settings.target ? (
              <span className="orb-caption">/ {settings.target}</span>
            ) : null}
          </button>
        </div>
      ) : (
        <div
          className={`practice-orb ${isBreath ? "breath-orb" : "timer-orb"}`}
        >
          <span
            className="breathing-halo"
            style={
              {
                "--breath-duration": `${settings.breathSeconds * 2}s`,
                animationPlayState: running || opening ? "running" : "paused",
              } as CSSProperties
            }
          />
          <span className="orb-number">
            {opening
              ? "◌"
              : isBreath
                ? running
                  ? phase === 0
                    ? t.inhale
                    : t.exhale
                  : "◌"
                : focus
                  ? "◷"
                  : formatTime(
                      Math.max(0, settings.minutes * 60 - session.elapsed),
                    )}
          </span>
          <span className="orb-caption">
            {opening ? t.opening : isBreath ? t.breath : t.time}
          </span>
        </div>
      )}
      <p className="practice-instruction">
        {opening
          ? t.opening
          : !running
            ? t.pausedHint
            : settings.mode === "count"
              ? t.tap
              : isBreath
                ? t.natural
                : t.timeHint}
      </p>
      <div className="session-controls">
        {opening ? (
          <button
            className="primary-button"
            onClick={begin}
            aria-live="polite"
            aria-label={`${t.sitBegin} ${left}`}
          >
            <span className="begin-wait">
              {t.sitBegin} · {left}
            </span>
          </button>
        ) : (
          <>
            {settings.mode === "count" && (
              <button
                className="secondary-button"
                onClick={undo}
                disabled={session.count === 0}
              >
                {t.undo}
              </button>
            )}
            <button className="primary-button" onClick={toggle}>
              {running ? t.pause : t.resume}
            </button>
            <button className="secondary-button" onClick={finish}>
              {t.finish}
            </button>
          </>
        )}
      </div>
      {!opening && !isBreath && (
        <button
          className="text-button"
          aria-pressed={focus}
          onClick={() => setFocus((value) => !value)}
        >
          {focus ? t.show : t.focus}
        </button>
      )}
      <button
        type="button"
        className="text-button"
        aria-pressed={sound}
        onClick={() => onSound(!sound)}
      >
        {sound ? t.soundOn : t.soundOff}
      </button>
      {leaving ? (
        <div className="leave-confirm">
          <p>{t.confirmLeave}</p>
          <div className="leave-confirm-actions">
            <button type="button" className="secondary-button" onClick={() => setLeaving(false)}>
              {t.keepGoing}
            </button>
            <button type="button" className="secondary-button" onClick={onLeave}>
              {t.leaveConfirm}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="text-button" onClick={() => setLeaving(true)}>
          {t.leave}
        </button>
      )}
    </section>
  );
}
