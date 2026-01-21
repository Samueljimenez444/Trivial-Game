import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { Preguntas } from '../../Domain/Entities/Pregunta';

/**
 * Props del componente GameScreen
 */
interface GameScreenProps {
  playerName: string; // Nombre del jugador
  currentQuestion: Preguntas | null; // Pregunta actual
  currentQuestionNumber: number; // Número de pregunta actual
  totalQuestions: number; // Total de preguntas para ganar
  selectedAnswer: number | null; // Índice de la respuesta seleccionada
  isAnswerRevealed: boolean; // Si se ha revelado la respuesta
  isCorrect: boolean | null; // Si la respuesta es correcta
  onSelectAnswer: (answerIndex: number) => void; // Callback al seleccionar respuesta
  onRevealAnswer: () => void; // Callback al revelar respuesta
  onNextQuestion: () => void; // Callback para siguiente pregunta
}

/**
 * Pantalla principal del juego donde se muestran las preguntas
 * Muestra:
 * - Información del jugador y progreso
 * - Pregunta actual
 * - Opciones de respuesta
 * - Feedback visual de respuesta correcta/incorrecta
 */
export const GameScreen: React.FC<GameScreenProps> = ({
  playerName,
  currentQuestion,
  currentQuestionNumber,
  totalQuestions,
  selectedAnswer,
  isAnswerRevealed,
  isCorrect,
  onSelectAnswer,
  onRevealAnswer,
  onNextQuestion,
}) => {
  // Animación de fade-in para cada nueva pregunta
  const fadeAnim = new Animated.Value(0);

  // Efecto para animar la entrada de cada pregunta
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion]);

  // Efecto para avanzar automáticamente después de revelar la respuesta
  useEffect(() => {
    if (isAnswerRevealed && isCorrect !== null) {
      const timer = setTimeout(() => {
        onNextQuestion();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAnswerRevealed, isCorrect, onNextQuestion]);

  // Validación de seguridad: si no hay pregunta, muestra error
  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay preguntas disponibles</Text>
      </View>
    );
  }

  // Obtiene los datos de la pregunta actual
  const respuestas = currentQuestion.getRespuestas();
  const respuestaCorrecta = currentQuestion.getRespuestaCorrecta();
  const preguntasRestantes = totalQuestions - currentQuestionNumber;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.playerName}>Jugador: {playerName}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.questionNumber}>
              Pregunta {currentQuestionNumber} de {totalQuestions}
            </Text>
            <Text style={styles.questionsRemaining}>
              {preguntasRestantes} {preguntasRestantes === 1 ? 'pregunta' : 'preguntas'} para ganar
            </Text>
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.getEnunciado()}</Text>
        </View>

        {/* Lista de respuestas posibles */}
        <View style={styles.answersContainer}>
          {respuestas.map((respuesta, index) => {
            // Determina el estado visual de cada respuesta
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = isAnswerRevealed && index === respuestaCorrecta;
            const isWrongAnswer = isAnswerRevealed && isSelected && !isCorrectAnswer;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerButton,
                  isSelected && !isAnswerRevealed && styles.answerButtonSelected,
                  isCorrectAnswer && styles.answerButtonCorrect,
                  isWrongAnswer && styles.answerButtonWrong,
                ]}
                onPress={() => !isAnswerRevealed && onSelectAnswer(index)}
                disabled={isAnswerRevealed}
              >
                <View style={styles.answerContent}>
                  {/* Etiqueta de la respuesta (A, B, C, D) */}
                  <Text style={styles.answerLabel}>{String.fromCharCode(65 + index)}</Text>
                  <Text
                    style={[
                      styles.answerText,
                      (isCorrectAnswer || (isSelected && !isAnswerRevealed)) &&
                        styles.answerTextSelected,
                    ]}
                  >
                    {respuesta}
                  </Text>
                  {/* Marca de verificación para respuesta correcta */}
                  {isCorrectAnswer && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botón para confirmar la respuesta seleccionada */}
        {!isAnswerRevealed && (
          <TouchableOpacity
            style={[styles.submitButton, selectedAnswer === null && styles.submitButtonDisabled]}
            onPress={onRevealAnswer}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.submitButtonText}>Resolver</Text>
          </TouchableOpacity>
        )}

        {/* Mensaje de feedback (correcto/incorrecto) */}
        {isAnswerRevealed && (
          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, isCorrect ? styles.correctText : styles.wrongText]}>
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </Text>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  playerName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },
  progressContainer: {
    backgroundColor: 'rgba(22, 199, 154, 0.1)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#16c79a',
  },
  questionNumber: {
    fontSize: 16,
    color: '#16c79a',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  questionsRemaining: {
    fontSize: 14,
    color: '#fff',
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#16c79a',
  },
  questionText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  answersContainer: {
    gap: 12,
    marginBottom: 24,
  },
  answerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  answerButtonSelected: {
    backgroundColor: 'rgba(22, 199, 154, 0.2)',
    borderColor: '#16c79a',
  },
  answerButtonCorrect: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    borderColor: '#22c55e',
  },
  answerButtonWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: '#ef4444',
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16c79a',
    marginRight: 12,
    width: 24,
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  answerTextSelected: {
    fontWeight: '600',
  },
  checkMark: {
    fontSize: 24,
    color: '#22c55e',
    fontWeight: 'bold',
  },
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  correctText: {
    color: '#22c55e',
  },
  wrongText: {
    color: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    textAlign: 'center',
  },
});
