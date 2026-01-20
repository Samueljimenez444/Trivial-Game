/**
 * INTERFAZ DE CASO DE USO: ICalculateDifficultyUseCase
 *
 * Define el contrato para calcular la dificultad progresiva del juego.
 * Este caso de uso implementa la lógica de negocio que hace que las preguntas
 * sean más difíciles a medida que avanza el juego.
 *
 * LÓGICA DE NEGOCIO:
 * - El juego tiene 15 preguntas para ganar
 * - La dificultad aumenta progresivamente de 1 a 10
 * - Fórmula: dificultad = ceil((numeroPregunta / totalPreguntas) * 10)
 *
 * EJEMPLO:
 * - Pregunta 1: dificultad 1
 * - Pregunta 7-8: dificultad 5
 * - Pregunta 15: dificultad 10
 */
export interface ICalculateDifficultyUseCase {
  /**
   * Calcula el nivel de dificultad para una pregunta específica
   *
   * @param numeroPregunta - Número de la pregunta actual (1-15)
   * @returns Nivel de dificultad calculado (1-10)
   */
  execute(numeroPregunta: number): number;

  /**
   * Obtiene la cantidad total de preguntas necesarias para ganar
   *
   * @returns Número total de preguntas para completar el juego (15)
   */
  getPreguntasParaGanar(): number;
}
