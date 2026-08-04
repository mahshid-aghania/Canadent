"use client";
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    expired: diff === 0,
  };
}

export function CourseCountdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 60_000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (time.expired) return null;

  const units = [
    { value: time.days, label: "Days" },
    { value: time.hours, label: "Hours" },
    { value: time.minutes, label: "Min" },
  ];

  return (
    <div className="mb-6">
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/35 mb-2">
        Starts In
      </p>
      <div className="flex items-start gap-1">
        {units.map(({ value, label }, i) => (
          <>
            {i > 0 && (
              <span key={`sep-${i}`} className="countdown-sep">:</span>
            )}
            <div key={label} className="countdown-unit">
              <span className="countdown-num">
                {String(value).padStart(2, "0")}
              </span>
              <span className="countdown-label">{label}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
