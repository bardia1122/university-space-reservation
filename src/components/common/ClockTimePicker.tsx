import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface ClockTimePickerProps {
  /** Current value as `HH:MM` (24-hour). Empty string means unset. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  /** Minute granularity offered on the dial. Defaults to 5. */
  minuteStep?: number;
}

const SIZE = 240;
const CENTER = SIZE / 2;
const R_OUTER = 96;
const R_INNER = 62;
const NUM = 16; // half of a 32px number bubble
const PANEL_W = 288;
const PANEL_H = 366;

const pad = (n: number) => String(n).padStart(2, '0');

function parse(value: string): { h: number | null; m: number | null } {
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return { h: null, m: null };
  const h = Number(match[1]);
  const m = Number(match[2]);
  return { h: h >= 0 && h <= 23 ? h : null, m: m >= 0 && m <= 59 ? m : null };
}

/** Polar → cartesian, with 0° at the top of the dial and angles increasing clockwise. */
function polar(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: CENTER + r * Math.sin(rad), y: CENTER - r * Math.cos(rad) };
}

// Hour bubbles: outer ring = 1..12 (12 at top), inner ring = 0/13..23 (00 at top).
const OUTER_HOURS = Array.from({ length: 12 }, (_, i) => ({ idx: i, val: i === 0 ? 12 : i }));
const INNER_HOURS = Array.from({ length: 12 }, (_, i) => ({ idx: i, val: i === 0 ? 0 : i + 12 }));

export function ClockTimePicker({
  value,
  onChange,
  placeholder = 'انتخاب ساعت',
  id,
  required,
  minuteStep = 5,
}: ClockTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'hours' | 'minutes'>('hours');
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const { h, m } = parse(value);

  const place = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    let left = rect.right - PANEL_W; // align to the right edge (RTL-friendly)
    left = Math.max(8, Math.min(left, window.innerWidth - PANEL_W - 8));
    let top = rect.bottom + 6;
    if (top + PANEL_H > window.innerHeight - 8) top = rect.top - PANEL_H - 6;
    top = Math.max(8, top);
    setPos({ top, left });
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onReflow = () => place();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onReflow);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onReflow);
    };
  }, [open]);

  const commit = (nh: number | null, nm: number | null) => {
    const hh = nh ?? h ?? 0;
    const mm = nm ?? m ?? 0;
    onChange(`${pad(hh)}:${pad(mm)}`);
  };

  const openPicker = () => {
    setView('hours');
    setOpen(true);
  };

  // Map a pointer position on the dial to an hour or minute, then apply it.
  const applyFromPoint = (clientX: number, clientY: number) => {
    const dial = panelRef.current?.querySelector('[data-dial]') as HTMLElement | null;
    if (!dial) return;
    const rect = dial.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const dx = x - CENTER;
    const dy = y - CENTER;
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (deg < 0) deg += 360;

    if (view === 'hours') {
      const idx = Math.round(deg / 30) % 12;
      const dist = Math.hypot(dx, dy);
      const inner = dist < (R_OUTER + R_INNER) / 2;
      const hour = inner ? (idx === 0 ? 0 : idx + 12) : idx === 0 ? 12 : idx;
      commit(hour, m ?? 0);
    } else {
      let minute = Math.round(deg / 6) % 60;
      minute = (Math.round(minute / minuteStep) * minuteStep) % 60;
      commit(h ?? 0, minute);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    applyFromPoint(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) applyFromPoint(e.clientX, e.clientY);
  };
  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (view === 'hours') setView('minutes');
    else setOpen(false);
  };

  // Hand geometry for the current selection.
  const handHour = h ?? 0;
  const handRing = view === 'hours' && (handHour === 0 || handHour > 12) ? R_INNER : R_OUTER;
  const handDeg = view === 'hours' ? (handHour % 12) * 30 : (m ?? 0) * 6;
  const handR = view === 'minutes' ? R_OUTER : handRing;
  const knob = polar(handDeg, handR);
  const hasSelection = view === 'hours' ? h !== null : m !== null;

  const minuteMarks = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <>
      <button
        type="button"
        id={id}
        ref={triggerRef}
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={clsx('input-field flex items-center justify-between text-right', {
          'text-gray-400 dark:text-slate-500': h === null,
        })}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{h !== null && m !== null ? `${pad(h)}:${pad(m)}` : placeholder}</span>
        <Clock size={16} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />
      </button>
      {/* Keep a hidden field so native `required` validation still participates in the form. */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden
          required
          value={value}
          onChange={() => {}}
          className="sr-only"
        />
      )}

      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            style={{ position: 'fixed', top: pos.top, left: pos.left, width: PANEL_W }}
            className="z-[60] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            {/* Digital header — click a segment to switch which the dial edits */}
            <div className="mb-3 flex items-center justify-center gap-1 text-3xl font-bold tabular-nums">
              <button
                type="button"
                onClick={() => setView('hours')}
                className={clsx(
                  'rounded-lg px-2 py-0.5 transition-colors',
                  view === 'hours'
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300'
                    : 'text-gray-700 dark:text-slate-200',
                )}
              >
                {h !== null ? pad(h) : '--'}
              </button>
              <span className="text-gray-400 dark:text-slate-500">:</span>
              <button
                type="button"
                onClick={() => setView('minutes')}
                className={clsx(
                  'rounded-lg px-2 py-0.5 transition-colors',
                  view === 'minutes'
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300'
                    : 'text-gray-700 dark:text-slate-200',
                )}
              >
                {m !== null ? pad(m) : '--'}
              </button>
            </div>

            <div
              data-dial
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="relative mx-auto touch-none select-none rounded-full bg-gray-100 dark:bg-slate-800"
              style={{ width: SIZE, height: SIZE }}
            >
              {/* Hand + selection knob */}
              <svg width={SIZE} height={SIZE} className="pointer-events-none absolute inset-0">
                {hasSelection && (
                  <>
                    <line
                      x1={CENTER}
                      y1={CENTER}
                      x2={knob.x}
                      y2={knob.y}
                      className="stroke-primary-500"
                      strokeWidth={2}
                    />
                    <circle cx={knob.x} cy={knob.y} r={NUM} className="fill-primary-500" />
                  </>
                )}
                <circle cx={CENTER} cy={CENTER} r={3} className="fill-primary-600" />
              </svg>

              {/* Number bubbles */}
              {view === 'hours' ? (
                <>
                  {OUTER_HOURS.map(({ idx, val }) => {
                    const p = polar(idx * 30, R_OUTER);
                    const selected = h === val;
                    return (
                      <span
                        key={`o${val}`}
                        className={clsx(
                          'pointer-events-none absolute flex h-8 w-8 items-center justify-center rounded-full text-sm tabular-nums',
                          selected
                            ? 'font-semibold text-white'
                            : 'text-gray-700 dark:text-slate-200',
                        )}
                        style={{ left: p.x - NUM, top: p.y - NUM }}
                      >
                        {pad(val)}
                      </span>
                    );
                  })}
                  {INNER_HOURS.map(({ idx, val }) => {
                    const p = polar(idx * 30, R_INNER);
                    const selected = h === val;
                    return (
                      <span
                        key={`i${val}`}
                        className={clsx(
                          'pointer-events-none absolute flex h-8 w-8 items-center justify-center rounded-full text-xs tabular-nums',
                          selected
                            ? 'font-semibold text-white'
                            : 'text-gray-400 dark:text-slate-400',
                        )}
                        style={{ left: p.x - NUM, top: p.y - NUM }}
                      >
                        {pad(val)}
                      </span>
                    );
                  })}
                </>
              ) : (
                minuteMarks.map((val) => {
                  const p = polar(val * 6, R_OUTER);
                  const selected = m === val;
                  return (
                    <span
                      key={`m${val}`}
                      className={clsx(
                        'pointer-events-none absolute flex h-8 w-8 items-center justify-center rounded-full text-sm tabular-nums',
                        selected ? 'font-semibold text-white' : 'text-gray-700 dark:text-slate-200',
                      )}
                      style={{ left: p.x - NUM, top: p.y - NUM }}
                    >
                      {pad(val)}
                    </span>
                  );
                })
              )}
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {view === 'hours' ? 'ساعت را انتخاب کنید' : 'دقیقه را انتخاب کنید'}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-300"
              >
                تأیید
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
