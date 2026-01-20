import React from "react";
import { View, StyleSheet } from "react-native";
import { useGameViewModel } from "./Presenter/ViewModels/GameViewModel";
import { StartScreen } from "./Presenter/Views/StartScreen";
import { GameScreen } from "./Presenter/Views/GameScreen";
import { EndGameScreen } from "./Presenter/Views/EndGameScreen";

export default function Index() {
  const {
    gameState,
    setPlayerName,
    startGame,
    selectAnswer,
    revealAnswer,
    nextQuestion,
    restartGame,
    goToStart,
    getTotalQuestions,
  } = useGameViewModel();

  const handleStartGame = (name: string) => {
    setPlayerName(name);
    startGame();
  };

  return (
    <View style={styles.container}>
      {gameState.gameStatus === 'waiting' && (
        <StartScreen onStartGame={handleStartGame} />
      )}

      {gameState.gameStatus === 'playing' && (
        <GameScreen
          playerName={gameState.playerName}
          currentQuestion={gameState.currentQuestion}
          currentQuestionNumber={gameState.currentQuestionNumber}
          totalQuestions={getTotalQuestions()}
          selectedAnswer={gameState.selectedAnswer}
          isAnswerRevealed={gameState.isAnswerRevealed}
          isCorrect={gameState.isCorrect}
          onSelectAnswer={selectAnswer}
          onRevealAnswer={revealAnswer}
          onNextQuestion={nextQuestion}
        />
      )}

      {gameState.gameStatus === 'finished' && (
        <EndGameScreen
          playerName={gameState.playerName}
          score={gameState.score}
          totalQuestions={getTotalQuestions()}
          hasWon={gameState.hasWon}
          onRestartGame={restartGame}
          onGoToStart={goToStart}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
