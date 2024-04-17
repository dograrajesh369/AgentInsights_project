// pages/index.js

import { useState, useEffect } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(10).fill(null));
  const [violationCount, setViolationCount] = useState(0);
  const [showFullScreenBlocker, setShowFullScreenBlocker] = useState(false);

  useEffect(() => {
    // Fetch questions from JSON file (questions.json)
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleAnswerSelect = (optionIndex) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz completed, calculate score
      const score = selectedAnswers.reduce((acc, answer, index) => {
        return answer === questions[index].correctAnswer ? acc + 1 : acc;
      }, 0);
      alert(`Your score: ${score}/${questions.length}`);
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setViolationCount(violationCount + 1);
      setShowFullScreenBlocker(true);
    } else {
      setShowFullScreenBlocker(false);
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [violationCount]);

  useEffect(() => {
    const storedIndex = localStorage.getItem('currentIndex');
    const storedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'));
    if (storedIndex !== null && storedAnswers !== null) {
      setCurrentIndex(parseInt(storedIndex));
      setSelectedAnswers(storedAnswers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentIndex', currentIndex);
    localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
  }, [currentIndex, selectedAnswers]);

  return (
    <div>
      <h1>Quiz App</h1>
      {showFullScreenBlocker && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <p>Please switch to full-screen mode to continue the quiz.</p>
        </div>
      )}
      <p>Violation Count: {violationCount}</p>
      {questions.length > 0 && currentIndex < questions.length && (
        <div>
          <h2>Question {currentIndex + 1}</h2>
          <p>{questions[currentIndex].question}</p>
          <ul>
            {questions[currentIndex].options.map((option, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name="options"
                    value={index}
                    checked={selectedAnswers[currentIndex] === index}
                    onChange={() => handleAnswerSelect(index)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleNextQuestion}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
