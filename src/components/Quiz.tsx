import React, { useRef, useState } from 'react';
import './Quiz.css';
import QuizQuestion from '../core/QuizQuestion';
import QuizCore from '../core/QuizCore';

const Quiz: React.FC = () => {
  const quizCoreRef = useRef<QuizCore>(new QuizCore());
  const quizCore = quizCoreRef.current;

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(() => quizCore.getCurrentQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(() => quizCore.getCurrentQuestion() === null);

  const totalQuestions = quizCore.getTotalQuestions();
  const isLastQuestion = currentQuestion ? !quizCore.hasNextQuestion() : false;

  const handleOptionSelect = (option: string): void => {
    setSelectedAnswer(option);
  };

  const handleButtonClick = (): void => {
    if (!currentQuestion || !selectedAnswer) {
      return;
    }

    quizCore.answerQuestion(selectedAnswer);

    if (quizCore.hasNextQuestion()) {
      quizCore.nextQuestion();
      setCurrentQuestion(quizCore.getCurrentQuestion());
      setSelectedAnswer(null);
      setQuestionNumber((prevQuestionNumber) => prevQuestionNumber + 1);
      return;
    }

    setQuizCompleted(true);
    setCurrentQuestion(null);
  };

  if (quizCompleted) {
    return (
      <section className="quiz quiz-result">
        <h2>Quiz Completed</h2>
        <p className="result-score">
          Final Score: {quizCore.getScore()} out of {totalQuestions}
        </p>
      </section>
    );
  }

  if (!currentQuestion) {
    return (
      <section className="quiz quiz-result">
        <h2>No Questions Available</h2>
      </section>
    );
  }

  return (
    <section className="quiz">
      <h2>Quiz Question {questionNumber}</h2>
      <p className="question-text">{currentQuestion.question}</p>

      <h3>Answer Options</h3>
      <ul className="answer-list">
        {currentQuestion.options.map((option) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => handleOptionSelect(option)}
              className={`answer-option ${selectedAnswer === option ? 'selected' : ''}`}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      <p className="selected-answer">
        Selected Answer: <strong>{selectedAnswer ?? 'No answer selected'}</strong>
      </p>

      <button type="button" onClick={handleButtonClick} disabled={!selectedAnswer}>
        {isLastQuestion ? 'Submit' : 'Next Question'}
      </button>
    </section>
  );
};

export default Quiz;
