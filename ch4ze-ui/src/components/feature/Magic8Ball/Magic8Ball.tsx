import { useEffect, useRef, useState } from 'react';
import { EIGHT_BALL_ANSWERS } from '../../../sample-data/answers';
import { makeBall } from './makeBall';
import styles from './Magic8Ball.module.css';

export interface Magic8BallProps {
  answers?: string[];
  meta?: string;
  rng?: () => number;
  className?: string;
}

const BASE_ANGLE = -2.35;

function prefersReducedMotion(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function Magic8Ball({
  answers = EIGHT_BALL_ANSWERS,
  meta = 'magic 8-ball · 20 answers',
  rng = Math.random,
  className,
}: Magic8BallProps): JSX.Element {
  const [angle, setAngle] = useState(BASE_ANGLE);
  const [shaking, setShaking] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [murk, setMurk] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [dieVisible, setDieVisible] = useState(false);
  const [status, setStatus] = useState<{ label: string; busy: boolean }>({ label: 'ready', busy: false });
  const [respHtml, setRespHtml] = useState<{ mode: 'hint' | 'lead-ans' | 'typing'; text: string; typed: string }>({
    mode: 'hint',
    text: '// the 8 is up — shake to flip the ball and consult the oracle',
    typed: '',
  });

  const rafRef = useRef<number>(0);
  const typeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakingRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (typeTimerRef.current != null) clearTimeout(typeTimerRef.current);
    };
  }, []);

  function typeResp(answer: string) {
    if (typeTimerRef.current != null) clearTimeout(typeTimerRef.current);
    let i = 0;
    setRespHtml({ mode: 'typing', text: answer, typed: '' });
    function step() {
      if (i <= answer.length) {
        const typed = answer.slice(0, i);
        i++;
        setRespHtml({ mode: 'typing', text: answer, typed });
        typeTimerRef.current = setTimeout(step, 26);
      } else {
        setRespHtml({ mode: 'lead-ans', text: answer, typed: answer });
      }
    }
    step();
  }

  function settle(chosenAnswer: string) {
    shakingRef.current = false;
    setShaking(false);
    setMurk(false);
    setAnswerText(chosenAnswer);
    setDieVisible(true);
    setStatus({ label: 'answered', busy: false });
    typeResp(chosenAnswer);
  }

  function shake() {
    if (shakingRef.current) return;

    if (prefersReducedMotion()) {
      // Reduced-motion fast path: skip animation, show answer immediately
      const answer = answers[Math.floor(rng() * answers.length)];
      setFlipped(true);
      setAnswerText(answer);
      setDieVisible(true);
      setStatus({ label: 'answered', busy: false });
      setRespHtml({ mode: 'lead-ans', text: answer, typed: answer });
      return;
    }

    shakingRef.current = true;
    setShaking(true);
    setFlipped(true);
    setMurk(true);
    setDieVisible(false);
    setRespHtml({ mode: 'hint', text: '// shaking… the die is surfacing', typed: '' });
    setStatus({ label: 'shaking…', busy: true });

    const answer = answers[Math.floor(rng() * answers.length)];
    const dur = 900;
    const start = performance.now();

    cancelAnimationFrame(rafRef.current);

    function frame(now: number) {
      const p = (now - start) / dur;
      if (p < 1) {
        const a = BASE_ANGLE + p * 14 + Math.sin(now / 40) * 0.6;
        setAngle(a);
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setAngle(BASE_ANGLE);
        settle(answer);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }

  const ballText = makeBall(angle);

  const wrapClass = [styles['cc8-ballwrap'], shaking ? styles['shaking'] : ''].filter(Boolean).join(' ');
  const flipClass = [styles['cc8-flip'], flipped ? styles['flipped'] : ''].filter(Boolean).join(' ');
  const windowClass = [styles['cc8-window'], murk ? styles['murk'] : ''].filter(Boolean).join(' ');
  const dieClass = [styles['cc8-dieface'], dieVisible ? styles['show'] : ''].filter(Boolean).join(' ');
  const statusClass = [styles['cc8-status'], status.busy ? styles['busy'] : ''].filter(Boolean).join(' ');

  return (
    <section className={[styles.cc8, className].filter(Boolean).join(' ')}>
      <div className={styles['cc8-prompt']}>
        <span className={styles.u}>chase</span>
        <span className={styles.at}>@louisville</span>
        <span className={styles.path}>:~</span>
        <span className={styles.chev}>❯</span>
        <span className={styles['cc8-cmd']}>8ball</span>
      </div>
      <div className={styles['cc8-meta']}>{meta}</div>
      <div className={styles['cc8-out']}>
        <div className={wrapClass}>
          <pre className={styles['cc8-ball']}>{ballText}</pre>
          <div className={styles['cc8-medallion']}>
            <div className={flipClass}>
              <div className={styles['cc8-back']}>
                <div className={styles['cc8-num']}>8</div>
              </div>
              <div className={windowClass}>
                <div className={styles['cc8-window-clip']}>
                  <div className={dieClass} aria-hidden="true">
                    <div className={styles['cc8-tri']}></div>
                    <div className={styles['cc8-txt']} data-text={answerText}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['cc8-side']}>
          <div className={styles['cc8-resp']}>
            {respHtml.mode === 'hint' && (
              <span className={styles.hint}>{respHtml.text}</span>
            )}
            {(respHtml.mode === 'typing' || respHtml.mode === 'lead-ans') && (
              <>
                <span className={styles.lead}>oracle ❯ </span>
                <span className={respHtml.mode === 'typing' ? `${styles.ans} ${styles.typing}` : styles.ans}>
                  {respHtml.typed}
                </span>
              </>
            )}
          </div>
          <div className={styles['cc8-row']}>
            <button
              className={styles['cc8-btn']}
              onClick={shake}
              disabled={shaking}
            >
              Shake
            </button>
            <span className={statusClass}>
              <span className={styles.dot}>●</span>
              <span>{status.label}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
