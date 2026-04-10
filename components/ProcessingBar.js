'use client';

import { useEffect, useRef } from 'react';

const STEPS = [
  { target: 20, label: 'Fetching transcript...' },
  { target: 45, label: 'Generating blog post...' },
  { target: 65, label: 'Writing Twitter thread...' },
  { target: 80, label: 'Creating LinkedIn & email...' },
  { target: 92, label: 'Finalizing outputs...' },
];

export default function ProcessingBar({ state }) {
  // state: 'idle' | 'running' | 'done'
  const fillRef = useRef(null);
  const labelRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (state === 'running') {
      let progress = 0;
      let stepIndex = 0;

      intervalRef.current = setInterval(() => {
        if (stepIndex >= STEPS.length) {
          clearInterval(intervalRef.current);
          return;
        }
        const step = STEPS[stepIndex];
        if (progress < step.target) {
          progress += 2;
          if (fillRef.current) fillRef.current.style.width = progress + '%';
          if (labelRef.current && labelRef.current.textContent !== step.label) {
            labelRef.current.textContent = step.label;
          }
        } else {
          stepIndex++;
        }
      }, 80);
    }

    if (state === 'done') {
      clearInterval(intervalRef.current);
      if (fillRef.current) fillRef.current.style.width = '100%';
      if (labelRef.current) labelRef.current.textContent = 'Done.';
    }

    if (state === 'idle') {
      clearInterval(intervalRef.current);
      if (fillRef.current) fillRef.current.style.width = '0%';
      if (labelRef.current) labelRef.current.textContent = '';
    }

    return () => clearInterval(intervalRef.current);
  }, [state]);

  return (
    <>
      <div className={`processing-bar${state !== 'idle' ? ' active' : ''}`}>
        <div className="processing-bar-fill" ref={fillRef} />
      </div>
      <div className="processing-label" ref={labelRef} />
    </>
  );
}
