"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface UrgencyTimerProps {
  durationHours?: number;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}

export default function UrgencyTimer({ 
  durationHours = 2, 
  className = "", 
  style = {},
  compact = false
}: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: durationHours,
    minutes: 14,
    seconds: 35
  });

  useEffect(() => {
    // Check if we have a saved end time in sessionStorage for consistent urgency during session
    const savedEndTime = sessionStorage.getItem("ibqa_urgency_timer");
    let endTime: number;

    if (savedEndTime) {
      endTime = parseInt(savedEndTime, 10);
      if (isNaN(endTime) || endTime < Date.now()) {
        endTime = Date.now() + durationHours * 3600 * 1000 + 14 * 60 * 1000 + 35 * 1000;
        sessionStorage.setItem("ibqa_urgency_timer", endTime.toString());
      }
    } else {
      endTime = Date.now() + durationHours * 3600 * 1000 + 14 * 60 * 1000 + 35 * 1000;
      sessionStorage.setItem("ibqa_urgency_timer", endTime.toString());
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, endTime - now);

      if (diff === 0) {
        // Reset timer when expired to maintain urgency
        const newEndTime = Date.now() + durationHours * 3600 * 1000 + 14 * 60 * 1000 + 35 * 1000;
        sessionStorage.setItem("ibqa_urgency_timer", newEndTime.toString());
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [durationHours]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (compact) {
    return (
      <div 
        className={className} 
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "#B8860B",
          backgroundColor: "#FFF9E6",
          padding: "3px 8px",
          borderRadius: "4px",
          border: "1px solid rgba(184, 134, 11, 0.3)",
          ...style
        }}
      >
        <Clock size={12} className="animate-pulse" />
        <span>⚡ Ends in {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s</span>
      </div>
    );
  }

  return (
    <div 
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(90deg, #FFF9E6 0%, #FDFBF7 100%)",
        border: "1px solid rgba(201, 169, 110, 0.5)",
        borderRadius: "6px",
        padding: "0.6rem 1rem",
        margin: "0.8rem 0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        ...style
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Clock size={16} style={{ color: "#B8860B" }} />
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1F1F1F", letterSpacing: "0.5px" }}>
          LIMITED TIME GLOW OFFER
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 700, fontSize: "0.9rem", color: "#B8860B", fontFamily: "monospace" }}>
        <span style={{ background: "#000", color: "#D4AF37", padding: "2px 6px", borderRadius: "3px" }}>{pad(timeLeft.hours)}</span>:
        <span style={{ background: "#000", color: "#D4AF37", padding: "2px 6px", borderRadius: "3px" }}>{pad(timeLeft.minutes)}</span>:
        <span style={{ background: "#000", color: "#D4AF37", padding: "2px 6px", borderRadius: "3px" }}>{pad(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}
