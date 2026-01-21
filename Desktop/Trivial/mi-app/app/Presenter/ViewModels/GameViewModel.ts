import { useState, useCallback } from 'react';
import { GetPreguntaUseCase } from '../../Domain/UseCases/GetPreguntaUseCase';
import { ResetGameUseCase } from '../../Domain/UseCases/ResetGameUseCase';
import { ValidateAnswerUseCase } from '../../Domain/UseCases/ValidateAnswerUseCase';
import { CalculateDifficultyUseCase } from '../../Domain/UseCases/CalculateDifficultyUseCase';
import { Preguntas } from '../../Domain/Entities/Pregunta';
import DIContainer from '../../DI/container';

/**
 * Interface que define el estado completo del juego
 * Contiene toda la información necesaria para representar el estado actual de la partida
 */
export interface GameState {
  playerName: string; // Nombre del jugador
  currentQuestion: Preguntas | null; // Pregunta actual que se está mostrando
  currentQuestionNumber: number; // Número de la pregunta actual (1-indexed)
  selectedAnswer: number | null; // Índice de la respuesta seleccionada por el usuario
  isAnswerRevealed: boolean; // Indica si ya se ha revelado la respuesta correcta
  isCorrect: boolean | null; // Indica si la respuesta del usuario fue correcta
  gameStatus: 'waiting' | 'playing' | 'finished'; // Estado actual del flujo del juego
  score: number; // Puntuación acumulada del jugador
  hasWon: boolean; // Indica si el jugador ha ganado la partida
}

/**
 * Hook personalizado que gestiona toda la lógica del juego Trivial
 * Implementa el patrón MVVM actuando como ViewModel
 *
 * @returns Objeto con el estado del juego y métodos para manipularlo
 */
export const useGameViewModel = () => {
  // Obtención del contenedor de inyección de dependencias (Singleton)
  const container = DIContainer.getInstance();

  // Inyección de los casos de uso necesarios para la lógica del juego
  const getPreguntaUseCase = container.getGetPreguntaUseCase();
  const resetGameUseCase = container.getResetGameUseCase();
  const validateAnswerUseCase = container.getValidateAnswerUseCase();
  const calculateDifficultyUseCase = container.getCalculateDifficultyUseCase();

  // Estado principal del juego, inicializado con valores por defecto
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

  /**
   * Establece el nombre del jugador en el estado
   * @param name - Nombre del jugador
   */
  const setPlayerName = useCallback((name: string) => {
    setGameState(prev => ({
      ...prev,
      playerName: name,
    }));
  }, []);

  /**
   * Inicia una nueva partida del juego
   * Resetea el estado del juego, calcula la dificultad de la primera pregunta
   * y la obtiene del repositorio
   */
  const startGame = useCallback(() => {
    resetGameUseCase.execute(); // Reinicia el estado del juego en el repositorio
    const dificultad = calculateDifficultyUseCase.execute(1); // Calcula dificultad para pregunta 1
    const firstQuestion = getPreguntaUseCase.execute(dificultad); // Obtiene pregunta aleatoria

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

  /**
   * Registra la respuesta seleccionada por el usuario
   * @param answerIndex - Índice de la respuesta seleccionada (0-3)
   */
  const selectAnswer = useCallback((answerIndex: number) => {
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
    }));
  }, []);

  /**
   * Revela si la respuesta seleccionada es correcta o incorrecta
   * Valida la respuesta usando el caso de uso correspondiente
   * y actualiza la puntuación si es correcta
   *
   * @returns true si la respuesta es correcta, false en caso contrario
   */
  const revealAnswer = useCallback(() => {
    if (gameState.currentQuestion && gameState.selectedAnswer !== null) {
      // Valida la respuesta usando el caso de uso
      const isCorrect = validateAnswerUseCase.execute(
        gameState.currentQuestion,
        gameState.selectedAnswer
      );

      setGameState(prev => ({
        ...prev,
        isAnswerRevealed: true,
        isCorrect,
        score: isCorrect ? prev.score + 1 : prev.score, // Incrementa score solo si es correcta
      }));

      return isCorrect;
    }
    return false;
  }, [gameState.currentQuestion, gameState.selectedAnswer, validateAnswerUseCase]);

  /**
   * Avanza a la siguiente pregunta o finaliza el juego
   *
   * Lógica:
   * - Si la respuesta actual fue incorrecta -> Game Over (pierde)
   * - Si ya respondió todas las preguntas -> Victoria (gana)
   * - Si aún quedan preguntas -> Carga la siguiente pregunta con su dificultad calculada
   */
  const nextQuestion = useCallback(() => {
    // Si falló la pregunta actual, termina el juego (derrota)
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

    // Si ya respondió todas las preguntas correctamente, gana
    if (nextQuestionNumber > totalQuestions) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        hasWon: true,
      }));
      return;
    }

    // Calcula la dificultad de la siguiente pregunta (escala progresiva)
    const dificultad = calculateDifficultyUseCase.execute(nextQuestionNumber);
    const nextQuestion = getPreguntaUseCase.execute(dificultad);

    // Si no hay preguntas disponibles, finaliza como victoria
    if (!nextQuestion) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        hasWon: true,
      }));
      return;
    }

    // Actualiza el estado con la nueva pregunta
    setGameState(prev => ({
      ...prev,
      currentQuestion: nextQuestion,
      currentQuestionNumber: nextQuestionNumber,
      selectedAnswer: null,
      isAnswerRevealed: false,
      isCorrect: null,
    }));
  }, [gameState.currentQuestionNumber, gameState.isCorrect, getPreguntaUseCase, calculateDifficultyUseCase]);

  /**
   * Reinicia el juego manteniendo el mismo jugador
   * Comienza una nueva partida sin volver a la pantalla de inicio
   */
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  /**
   * Vuelve a la pantalla de inicio (pantalla de bienvenida)
   * Resetea completamente el estado del juego incluyendo el nombre del jugador
   */
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

  /**
   * Obtiene el número total de preguntas necesarias para ganar
   * @returns Número total de preguntas del juego
   */
  const getTotalQuestions = useCallback(() => {
    return calculateDifficultyUseCase.getPreguntasParaGanar();
  }, [calculateDifficultyUseCase]);

  // Retorna el estado y todas las funciones expuestas a la vista
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
