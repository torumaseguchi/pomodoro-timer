import React, { useState, useEffect, useMemo } from 'react'
import './App.css'

function App() {
  // SVG icons for play, pause and reset
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );
  
  const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  );
  
  const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  );
  // 基本的な状態
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [cycles, setCycles] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(25 * 60);

  // タイマー設定
  const timerModes = {
    work: 25,
    shortBreak: 5,
    longBreak: 15
  };
  
  // 円形プログレスバーの計算
  const calculateProgress = useMemo(() => {
    const progress = totalSeconds / initialTotalSeconds;
    return progress;
  }, [totalSeconds, initialTotalSeconds]);

  // タイマーロジック
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            // タイマー完了処理
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
            setTotalSeconds(prev => prev - 1);
          }
        } else {
          setSeconds(seconds - 1);
          setTotalSeconds(prev => prev - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  // タイマー完了時の処理
  const handleTimerComplete = () => {
    if (mode === 'work') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      if (newCycles % 4 === 0) {
        setMode('longBreak');
        const newTime = timerModes.longBreak * 60;
        setMinutes(timerModes.longBreak);
        setTotalSeconds(newTime);
        setInitialTotalSeconds(newTime);
      } else {
        setMode('shortBreak');
        const newTime = timerModes.shortBreak * 60;
        setMinutes(timerModes.shortBreak);
        setTotalSeconds(newTime);
        setInitialTotalSeconds(newTime);
      }
    } else {
      setMode('work');
      const newTime = timerModes.work * 60;
      setMinutes(timerModes.work);
      setTotalSeconds(newTime);
      setInitialTotalSeconds(newTime);
    }
    
    setSeconds(0);
  };

  // タイマーの開始/停止
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // タイマーのリセット
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(timerModes[mode]);
    setSeconds(0);
    const newTime = timerModes[mode] * 60;
    setTotalSeconds(newTime);
    setInitialTotalSeconds(newTime);
  };

  // モードの切り替え
  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(timerModes[newMode]);
    setSeconds(0);
    const newTime = timerModes[newMode] * 60;
    setTotalSeconds(newTime);
    setInitialTotalSeconds(newTime);
  };

  return (
    <div className="pomodoro-container">
      <h1>Pomodoro Timer</h1>
      
      <div className="mode-buttons">
        <button 
          className={mode === 'work' ? 'active' : ''} 
          onClick={() => switchMode('work')}
        >
          Work
        </button>
        <button 
          className={mode === 'shortBreak' ? 'active' : ''} 
          onClick={() => switchMode('shortBreak')}
        >
          Short Break
        </button>
        <button 
          className={mode === 'longBreak' ? 'active' : ''} 
          onClick={() => switchMode('longBreak')}
        >
          Long Break
        </button>
      </div>
      
      <div className="timer-container">
        <div className="timer">
          <svg className="progress-ring" width="270" height="270">
            <circle
              className="progress-ring-circle-bg"
              stroke="rgba(226, 232, 240, 0.3)"
              strokeWidth="8"
              fill="none"
              r="120"
              cx="135"
              cy="135"
            />
            <circle
              className="progress-ring-circle"
              stroke="#3182ce"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              r="120"
              cx="135"
              cy="135"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={-2 * Math.PI * 120 * (1 - calculateProgress)}
              style={{
                transition: 'stroke-dashoffset 1s linear'
              }}
            />
          </svg>
          <div className="time">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
      
      <div className="controls">
        <button className="control-button icon-button" onClick={toggleTimer}>
          {isActive ? <PauseIcon /> : <PlayIcon />}
          <span className="button-text">{isActive ? 'Pause' : 'Start'}</span>
        </button>
        <button className="control-button icon-button" onClick={resetTimer}>
          <ResetIcon />
          <span className="button-text">Reset</span>
        </button>
      </div>
      
      <div className="cycles">
        Cycles: {cycles}
      </div>
    </div>
  )
}

export default App
