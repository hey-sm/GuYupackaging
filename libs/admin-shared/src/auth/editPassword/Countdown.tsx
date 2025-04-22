import { Button } from 'antd';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export type CountdownRef = {
  start: () => void;
};

export type CountdownProps = {
  onClick?: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  placeholder?: string;
  initialCountdown?: number;
  format?: (countdown: number) => string;
  [key: string]: any;
};

const Countdown = forwardRef<CountdownRef, CountdownProps>(
  (
    {
      initialCountdown = 60,
      format = (countdown) => `${countdown}秒后重发`,
      onStart,
      onEnd,
      onClick,
      placeholder = '点击获取验证码',
    }: CountdownProps,
    ref
  ) => {
    const [countdown, setCountdown] = useState<number>(initialCountdown);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handler = () => {
      let localCountdown = countdown;

      if (localCountdown === 0) {
        if (timeoutRef.current) clearInterval(timeoutRef.current);

        setCountdown(initialCountdown);

        onEnd?.();
        return;
      }

      localCountdown -= 1;
      setCountdown(localCountdown);
    };

    // eslint-disable-next-line @typescript-eslint/ban-types
    const savedCallback = useRef<Function>(handler);

    useEffect(() => {
      savedCallback.current = handler;
    });

    const start = () => {
      timeoutRef.current = setInterval(() => savedCallback.current(), 1000);
    };

    useImperativeHandle(ref, () => ({
      start: () => {
        onStart?.();
        start();
      },
    }));

    const handleClick = useCallback(() => {
      if (onClick) {
        onClick();
        return;
      }
      onStart?.();
      start();
    }, [onClick, onStart]);

    return (
      <Button
        type="primary"
        disabled={initialCountdown !== countdown}
        onClick={handleClick}
      >
        {initialCountdown === countdown || countdown === 0
          ? placeholder
          : format(countdown)}
      </Button>
    );
  }
);

export default Countdown;
