import { ICalculateDifficultyUseCase } from "../Interfaces/ICalculateDifficultyUseCase";

/**
 * CASO DE USO: CalculateDifficultyUseCase
 *
 * Implementa la lógica de negocio para calcular la dificultad progresiva del juego.
 * Este caso de uso es fundamental para crear una experiencia de juego balanceada
 * donde la dificultad aumenta gradualmente a medida que el jugador avanza.
 *
 * LÓGICA DE DIFICULTAD PROGRESIVA:
 * - Total de preguntas para ganar: 15
 * - Rango de dificultad: 1 a 10
 * - Fórmula: dificultad = techo((numeroPregunta / totalPreguntas) * 10)
 *
 * PROGRESIÓN DETALLADA:
 * - Pregunta 1: dificultad 1  (7% progreso)
 * - Pregunta 2: dificultad 2  (13% progreso)
 * - Pregunta 5: dificultad 4  (33% progreso)
 * - Pregunta 8: dificultad 6  (53% progreso)
 * - Pregunta 11: dificultad 8 (73% progreso)
 * - Pregunta 15: dificultad 10 (100% progreso)
 *
 * PROPÓSITO:
 * - Crea una curva de dificultad natural
 * - Las primeras preguntas son más fáciles (onboarding)
 * - Las últimas preguntas son más difíciles (desafío final)
 */
export class CalculateDifficultyUseCase implements ICalculateDifficultyUseCase {
  /**
   * Constante que define cuántas preguntas debe responder el jugador para ganar
   * IMPORTANTE: Este valor determina la duración total del juego
   */
  private readonly PREGUNTAS_PARA_GANAR = 15;

  /**
   * Calcula el nivel de dificultad basándose en el progreso del jugador
   *
   * @param numeroPregunta - Número de la pregunta actual (1-15)
   * @returns Nivel de dificultad calculado (1-10)
   *
   * EJEMPLO:
   * - execute(1) -> 1  (primera pregunta, fácil)
   * - execute(8) -> 6  (mitad del juego, dificultad media)
   * - execute(15) -> 10 (última pregunta, máxima dificultad)
   */
  execute(numeroPregunta: number): number {
    // Calcular el porcentaje de progreso (0.0 a 1.0)
    const porcentajeProgreso = numeroPregunta / this.PREGUNTAS_PARA_GANAR;

    // Escalar a rango 1-10 y redondear hacia arriba
    // Math.ceil asegura que la primera pregunta sea dificultad 1 (no 0)
    return Math.ceil(porcentajeProgreso * 10);
  }

  /**
   * Obtiene el total de preguntas necesarias para completar el juego
   *
   * @returns Número de preguntas para ganar (15)
   *
   * USO:
   * - Para mostrar progreso al usuario ("Pregunta 5 de 15")
   * - Para determinar cuándo el jugador ha ganado
   * - Para calcular preguntas restantes
   */
  getPreguntasParaGanar(): number {
    return this.PREGUNTAS_PARA_GANAR;
  }
}
