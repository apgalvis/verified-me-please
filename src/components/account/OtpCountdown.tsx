import { useState, useEffect, useCallback } from "react";

interface OtpCountdownProps {
  initialSeconds?: number;
  onResend: () => void;
}

const OtpCountdown = ({ initialSeconds = 60, onResend }: OtpCountdownProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setIsActive(false);
          return 0;
        }
        return s - 1;
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
