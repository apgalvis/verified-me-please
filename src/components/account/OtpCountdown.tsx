import { useState, useEffect, useCallback, useRef } from "react";

interface OtpCountdownProps {
  /** If provided, resume from this remaining time instead of starting fresh */
  resumeSeconds?: number;
  initialSeconds?: number;
  onResend: () => void;
  /** Called every second with remaining seconds so parent can persist */
  onTick?: (remaining: number) => void;
}

const OtpCountdown = ({
  resumeSeconds,
  initialSeconds = 60,
  onResend,
  onTick,
}: OtpCountdownProps) => {
  const startValue = resumeSeconds != null && resumeSeconds > 0 ? resumeSeconds : initialSeconds;
  const [seconds, setSeconds] = useState(startValue);
  const [isActive, setIsActive] = useState(startValue > 0);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!isActive || seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((s) => {
        const next = s - 1;
        onTickRef.current?.(next);
        if (next <= 0) {
          setIsActive(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, seconds]);

  const handleResend = useCallback(() => {
    onResend();
    setSeconds(initialSeconds);
    setIsActive(true);
  }, [onResend, initialSeconds]);

  if (isActive && seconds > 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Reenviar código en{" "}
        <span className="font-semibold text-foreground">{seconds}s</span>
      </p>
    );
  }

  return (
    <button
      onClick={handleResend}
      className="text-sm font-medium text-primary hover:underline transition-colors"
    >
      Reenviar código
    </button>
  );
};

export default OtpCountdown;
