import { useState, useCallback } from 'react';
import { GetPreguntaUseCase } from '../../Domain/UseCases/GetPreguntaUseCase';
import { ResetGameUseCase } from '../../Domain/UseCases/ResetGameUseCase';
import { ValidateAnswerUseCase } from '../../Domain/UseCases/ValidateAnswerUseCase';
import { CalculateDifficultyUseCase } from '../../Domain/UseCases/CalculateDifficultyUseCase';
import { Preguntas } from '../../Domain/Entities/Pregunta';
import DIContainer from '../../DI/container';

export interface GameState {
  playerName: string;
  currentQuestion: Preguntas | null;
  currentQuestionNumber: number;
  selectedAnswer: number | null;
  isAnswerRevealed: boolean;
  isCorrect: boolean | null;
  gameStatus: 'waiting' | 'playing' | 'finished';
  score: number;
  hasWon: boolean;
}

export const useGameViewModel = () => {
  const container = DIContainer.getInstance();
  const getPreguntaUseCase = container.getGetPreguntaUseCase();
  const resetGameUseCase = container.getResetGameUseCase();
  const validateAnswerUseCase = container.getValidateAnswerUseCase();
  const calculateDifficultyUseCase = container.getCalculateDifficultyUseCase();

  const [gameState, setGameState] = useState<GameState>({
    playerName: '',
    currentQuestion: null,
    currentQuestionNumber: 0,
    selectedAnswer: null,
    isAnswerRevealed: false,
    isCorrect: null,
    gameStatus: 'waiting',
    score: 0,
    hasWon: false,
  });

  const setPlayerName = useCallback((name: string) => {
    setGameState(prev => ({
      ...prev,
      playerName: name,
    }));
  }, []);

  const startGame = useCallback(() => {
    resetGameUseCase.execute();
    const dificultad = calculateDifficultyUseCase.execute(1);
    const firstQuestion = getPreguntaUseCase.execute(dificultad);

    setGameState(prev => ({
      ...prev,
      currentQuestion: firstQuestion,
      currentQuestionNumber: 1,
      selectedAnswer: null,
      isAnswerRevealed: false,
      isCorrect: null,
      gameStatus: 'playing',
      score: 0,
    }));
  }, [getPreguntaUseCase, resetGameUseCase, calculateDifficultyUseCase]);

  const selectAnswer = useCallback((answerIndex: number) => {
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
    }));
  }, []);

  const revealAnswer = useCallback(() => {
    if (gameState.currentQuestion && gameState.selectedAnswer !== null) {
      const isCorrect = validateAnswerUseCase.execute(
        gameState.currentQuestion,
        gameState.selectedAnswer
      );

      setGameState(prev => ({
        ...prev,
        isAnswerRevealed: true,
        isCorrect,
        score: isCorrect ? prev.score + 1 : prev.score,
      }));

      return isCorrect;
    }
    return false;
  }, [gameState.currentQuestion, gameState.selectedAnswer, validateAnswerUseCase]);

  const nextQuestion = useCallback(() => {
    if (gameState.isCorrect === false) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        hasWon: false,
      }));
      return;
    }

    const nextQuestionNumber = gameState.currentQuestionNumber + 1;
    const totalQuestions = calculateDifficultyUseCase.getPreguntasParaGanar();

    if (nextQuestionNumber > totalQuestions) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        hasWon: true,
      }));
      return;
    }

    const dificultad = calculateDifficultyUseCase.execute(nextQuestionNumber);
    const nextQuestion = getPreguntaUseCase.execute(dificultad);

    if (!nextQuestion) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        hasWon: true,
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentQuestion: nextQuestion,
      currentQuestionNumber: nextQuestionNumber,
      selectedAnswer: null,
      isAnswerRevealed: false,
      isCorrect: null,
    }));
  }, [gameState.currentQuestionNumber, gameState.isCorrect, getPreguntaUseCase, calculateDifficultyUseCase]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const goToStart = useCallback(() => {
    resetGameUseCase.execute();
    setGameState({
      playerName: '',
      currentQuestion: null,
      currentQuestionNumber: 0,
      selectedAnswer: null,
      isAnswerRevealed: false,
      isCorrect: null,
      gameStatus: 'waiting',
      score: 0,
      hasWon: false,
    });
  }, [resetGameUseCase]);

  const getTotalQuestions = useCallback(() => {
    return calculateDifficultyUseCase.getPreguntasParaGanar();
  }, [calculateDifficultyUseCase]);

  return {
    gameState,
    setPlayerName,
    startGame,
    selectAnswer,
    revealAnswer,
    nextQuestion,
    restartGame,
    goToStart,
    getTotalQuestions,
  };
};
