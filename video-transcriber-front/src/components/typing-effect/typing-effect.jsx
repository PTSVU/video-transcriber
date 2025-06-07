import React, { useState, useEffect } from 'react';
import './typing-effect.css';

export default function TypingEffect({ 
  phrases = ["Hello World!", "Video-Transcriber для удобной сводки информации"], 
  speed = 100,
  eraseSpeed = 50,
  pauseBetween = 1000 }) { 

  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timer;
    
    if (!isDeleting) {
      if (currentIndex < currentPhrase.length) {
        timer = setTimeout(() => {
          setCurrentText(currentPhrase.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, speed);
      } 
      else if (currentIndex === currentPhrase.length) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseBetween);
      }
    } 
    else {
      if (currentIndex > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentPhrase.substring(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        }, eraseSpeed);
      } 
      else {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, phraseIndex, phrases, speed, eraseSpeed, pauseBetween]);

  return (
    <div className="typing-container">
      <span className="typing-text">{currentText}</span>
      <span className="cursor">|</span>
    </div>
  );
};