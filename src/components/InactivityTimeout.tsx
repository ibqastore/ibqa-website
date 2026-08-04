"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export default function InactivityTimeout() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const logout = async () => {
      await supabase.auth.signOut();
      router.push("/admin/login");
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, TIMEOUT_MS);
    };

    // Throttle the reset to avoid performance issues (hanging) on rapid events like scrolling/touching
    let lastResetTime = Date.now();
    const throttledResetTimer = () => {
      const now = Date.now();
      if (now - lastResetTime > 5000) { // Only reset if 5 seconds have passed
        resetTimer();
        lastResetTime = now;
      }
    };

    // Initialize timer
    resetTimer();

    // Listen to user activity events
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, throttledResetTimer, { passive: true });
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, throttledResetTimer);
      });
    };
  }, [router, supabase]);

  return null; // This component doesn't render anything
}
