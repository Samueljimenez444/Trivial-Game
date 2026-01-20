import { Preguntas } from "../Entities/Pregunta";

/**
 * INTERFAZ DE REPOSITORIO: IListadoPreguntas
 *
 * Define el contrato que debe cumplir cualquier implementación de repositorio de preguntas.
 * Esta interfaz forma parte de la capa de Domain y establece qué operaciones se pueden
 * realizar con el listado de preguntas, sin importar cómo se implementen.
 *
 * PRINCIPIOS DE CLEAN ARCHITECTURE:
 * - Dependency Inversion: Las capas superiores dependen de esta abstracción, no de la implementación
 * - Interface Segregation: Solo incluye métodos necesarios para el manejo de preguntas
 *
 * RESPONSABILIDADES:
 * - Obtener preguntas por dificultad
 * - Eliminar preguntas ya usadas para evitar repeticiones
 * - Resetear el listado al estado inicial
 * - Consultar cantidad de preguntas disponibles
 */
export interface IListadoPreguntas {
  /**
   * Obtiene una pregunta aleatoria del nivel de dificultad especificado
   *
   * @param dificultad - Nivel de dificultad deseado (1-10)
   * @returns Una pregunta del nivel especificado, o null si no hay preguntas disponibles
   */
  getPregunta(dificultad: number): Preguntas | null;

  /**
   * Elimina una pregunta del listado mutable por su ID
   * Se usa después de mostrar una pregunta para evitar repeticiones
   *
   * @param id - Identificador de la pregunta a eliminar
   */
  deletePregunta(id: number): void;

  /**
   * Restaura el listado de preguntas a su estado original
   * Se llama al iniciar una nueva partida para tener todas las preguntas disponibles
   */
  resetPreguntas(): void;

  /**
   * Obtiene la cantidad de preguntas que aún están disponibles en el listado mutable
   *
   * @returns Número de preguntas disponibles
   */
  getCantidadPreguntasDisponibles(): number;
}