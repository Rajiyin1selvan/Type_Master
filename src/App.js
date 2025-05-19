import { useState, useEffect, useRef } from 'react';
import './index.css';

// Sample paragraphs for typing practice
const paragraphs = [
  "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet and is commonly used for typing practice.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. The way to get started is to quit talking and begin doing.",
  "Life is what happens when you're busy making other plans. The future belongs to those who believe in the beauty of their dreams.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. It is during our darkest moments that we must focus to see the light."
];

export default function TypingPractice() {
  const [text, setText] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState(null);
  const inputRef = useRef(null);

  // Add font imports
  useEffect(() => {
    const fontImport = document.createElement('link');
    fontImport.rel = 'stylesheet';
    fontImport.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700&display=swap';
    document.head.appendChild(fontImport);
    
    return () => {
      document.head.removeChild(fontImport);
    };
  }, []);

  // Initialize with a random paragraph
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    setParagraph(paragraphs[randomIndex]);
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (isTyping && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTyping) {
      endTest();
    }
    
    return () => clearInterval(timer);
  }, [isTyping, timeLeft]);

  // Handle typing start
  const handleInputFocus = () => {
    if (!isTyping && !isFinished && timeLeft === 30) {
      setIsTyping(true);
      setStartTime(new Date());
    }
  };

  // Handle text input
  const handleChange = (e) => {
    if (isTyping && !isFinished) {
      setText(e.target.value);
      calculateStatistics(e.target.value);
    }
  };

  // Calculate WPM and accuracy
  const calculateStatistics = (currentText) => {
    // Calculate WPM (Words Per Minute)
    const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = currentText.trim().split(/\s+/).length;
    const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(currentWpm);

    // Calculate accuracy
    let correctChars = 0;
    const typedChars = currentText.length;
    
    for (let i = 0; i < typedChars; i++) {
      if (i < paragraph.length && currentText[i] === paragraph[i]) {
        correctChars++;
      }
    }
    
    const currentAccuracy = typedChars > 0 
      ? Math.round((correctChars / typedChars) * 100) 
      : 100;
    
    setAccuracy(currentAccuracy);
  };

  // End the typing test
  const endTest = () => {
    setIsTyping(false);
    setIsFinished(true);
    calculateStatistics(text);
  };

  // Reset the test with a new paragraph
  const resetTest = () => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    setParagraph(paragraphs[randomIndex]);
    setText('');
    setTimeLeft(30);
    setIsTyping(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
    
    // Focus on the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Highlight matched and mismatched characters
  const renderParagraph = () => {
    return paragraph.split('').map((char, index) => {
      let className = '';
      
      if (index < text.length) {
        className = text[index] === char ? 'correct-char' : 'incorrect-char';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="app-container">
      {/* Game title and greeting */}
      <h1 className="game-title">TYPE MASTER</h1>
      <h2 className="game-subtitle">Ready Player One... Start Typing!</h2>
      
      <div className="game-panel">
        <div className="status-bar">
          <div className="timer">TIME: <span className="timer-value">{timeLeft}s</span></div>
          <div className="stats">
            <div className="wpm">WPM: <span className="wpm-value">{wpm}</span></div>
            <div className="accuracy">ACCURACY: <span className={`accuracy-value ${
              accuracy > 90 ? 'high-accuracy' : accuracy > 70 ? 'medium-accuracy' : 'low-accuracy'
            }`}>{accuracy}%</span></div>
          </div>
        </div>
        
        <div className="text-display">
          {renderParagraph()}
        </div>
        
        <textarea
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onFocus={handleInputFocus}
          disabled={isFinished}
          className="text-input"
          placeholder={isFinished ? "GAME OVER!" : "CLICK HERE TO START YOUR QUEST..."}
        />
      </div>
      
      {isFinished && (
        <div className="results-panel">
          <h2 className="results-title">GAME STATS</h2>
          <div className="results-grid">
            <div className="result-box wpm-box">
              <div className="result-label">WORDS PER MINUTE</div>
              <div className="result-value wpm-result">{wpm}</div>
            </div>
            <div className="result-box accuracy-box">
              <div className="result-label">ACCURACY</div>
              <div className={`result-value accuracy-result ${
                accuracy > 90 ? 'high-accuracy' : accuracy > 70 ? 'medium-accuracy' : 'low-accuracy'
              }`}>
                {accuracy}%
              </div>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={resetTest}
        className="game-button"
      >
        {isFinished ? "PLAY AGAIN" : "RESTART"}
      </button>
    </div>
  );
}