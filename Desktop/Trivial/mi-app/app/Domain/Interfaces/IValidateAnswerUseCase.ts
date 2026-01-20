import { Preguntas } from "../Entities/Pregunta";

/**
 * INTERFAZ DE CASO DE USO: IValidateAnswerUseCase
 *
 * Define el contrato para validar si una respuesta del usuario es correcta.
 * Este caso de uso encapsula la lógica de negocio para verificar si el índice
 * de respuesta seleccionado coincide con la respuesta correcta de la pregunta.
 *
 * PRINCIPIO: Single Responsibility - Solo valida respuestas
 * PATRÓN: Strategy Pattern - Permite cambiar la estrategia de validación si es necesario
 */
export interface IValidateAnswerUseCase {
  /**
   * Ejecuta el caso de uso para validar una respuesta
   *
   * @param pregunta - La pregunta que está siendo respondida
   * @param respuestaSeleccionada - Índice (0-3) de la respuesta elegida por el usuario
   * @returns true si la respuesta es correcta, false en caso contrario
   */
  execute(pregunta: Preguntas, respuestaSeleccionada: number): boolean;
}
