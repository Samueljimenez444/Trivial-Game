import { Preguntas } from "../Entities/Pregunta";

/**
 * INTERFAZ DE CASO DE USO: IGetPreguntaUseCase
 *
 * Define el contrato para obtener una pregunta del repositorio.
 * Este caso de uso encapsula la lógica de negocio para recuperar una pregunta
 * según su dificultad y eliminarla del pool de preguntas disponibles.
 *
 * PATRÓN: Command Pattern - Encapsula una acción como un objeto
 * PRINCIPIO: Single Responsibility - Solo se encarga de obtener preguntas
 */
export interface IGetPreguntaUseCase {
  /**
   * Ejecuta el caso de uso para obtener una pregunta
   *
   * @param dificultad - Nivel de dificultad de la pregunta a obtener (1-10)
   * @returns Una pregunta del nivel especificado, o null si no hay disponibles
   */
  execute(dificultad: number): Preguntas | null;
}
