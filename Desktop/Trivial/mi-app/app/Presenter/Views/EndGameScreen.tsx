import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Props del componente EndGameScreen
 */
interface EndGameScreenProps {
  playerName: string; // Nombre del jugador
  score: number; // Puntuación final
  totalQuestions: number; // Total de preguntas del juego
  hasWon: boolean; // Si el jugador ganó
  onRestartGame: () => void; // Callback para reiniciar con el mismo jugador
  onGoToStart: () => void; // Callback para volver al inicio
}

/**
 * Pantalla final del juego
 * Muestra los resultados de la partida (victoria o derrota)
 * y opciones para jugar de nuevo o volver al inicio
 */
export const EndGameScreen: React.FC<EndGameScreenProps> = ({
  playerName,
  score,
  totalQuestions,
  hasWon,
  onRestartGame,
  onGoToStart,
}) => {
  /**
   * Obtiene el mensaje a mostrar según el resultado
   */
  const getMessage = () => {
    if (hasWon) return '¡Victoria!';
    return '¡Has perdido!';
  };

  /**
   * Obtiene el título según el resultado
   */
  const getTitle = () => {
    if (hasWon) return 'Felicidades';
    return 'Game Over';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Título principal (Felicidades / Game Over) */}
        <Text style={[styles.title, !hasWon && styles.titleLost]}>{getTitle()}</Text>

        {/* Nombre del jugador */}
        <View style={styles.playerContainer}>
          <Text style={styles.playerName}>{playerName}</Text>
        </View>

        {/* Puntuación final */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Tu puntuación:</Text>
          <Text style={[styles.scoreValue, !hasWon && styles.scoreLost]}>
            {score} / {totalQuestions}
          </Text>
        </View>

        {/* Mensaje de victoria/derrota */}
        <Text style={[styles.message, hasWon ? styles.messageWin : styles.messageLost]}>
          {getMessage()}
        </Text>

        {/* Botones de acción */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={onRestartGame}>
            <Text style={styles.primaryButtonText}>Jugar de nuevo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onGoToStart}>
            <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#16c79a',
    marginBottom: 30,
    textAlign: 'center',
  },
  titleLost: {
    color: '#ef4444',
  },
  playerContainer: {
    backgroundColor: 'rgba(22, 199, 154, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#16c79a',
    marginBottom: 40,
  },
  playerName: {
    fontSize: 22,
    color: '#16c79a',
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#16c79a',
    width: '100%',
    maxWidth: 300,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#16c79a',
  },
  scoreLost: {
    color: '#ef4444',
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
  messageWin: {
    color: '#ffd700',
  },
  messageLost: {
    color: '#ef4444',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#16c79a',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16c79a',
  },
  secondaryButtonText: {
    color: '#16c79a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
