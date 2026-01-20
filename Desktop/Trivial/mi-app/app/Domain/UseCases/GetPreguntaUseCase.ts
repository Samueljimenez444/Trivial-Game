import { IListadoPreguntas } from "../Repositories/IListadoPreguntas";
import { Preguntas } from "../Entities/Pregunta";
import { IGetPreguntaUseCase } from "../Interfaces/IGetPreguntaUseCase";

/**
 * CASO DE USO: GetPreguntaUseCase
 *
 * Implementa la lógica de negocio para obtener una pregunta y marcarla como usada.
 * Este caso de uso coordina dos operaciones:
 * 1. Obtener una pregunta aleatoria del nivel de dificultad solicitado
 * 2. Eliminarla del pool disponible para evitar repeticiones
 *
 * PATRÓN APLICADO: Dependency Injection
 * - El repositorio se inyecta en el constructor
 * - Permite fácil testing con mocks
 * - Desacopla el caso de uso de la implementación concreta del repositorio
 *
 * FLUJO:
 * 1. Se solicita una pregunta al repositorio
 * 2. Si existe la pregunta, se elimina del pool mutable
 * 3. Se retorna la pregunta (o null si no hay disponibles)
 */
export class GetPreguntaUseCase implements IGetPreguntaUseCase {
  /**
   * Constructor con inyección de dependencias
   * @param repository - Repositorio de preguntas (implementación de IListadoPreguntas)
   */
  constructor(private repository: IListadoPreguntas) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param dificultad - Nivel de dificultad requerido (1-10)
   * @returns La pregunta obtenida, o null si no hay preguntas disponibles
   */
  execute(dificultad: number): Preguntas | null {
    // Paso 1: Obtener pregunta del repositorio
    const pregunta = this.repository.getPregunta(dificultad);

    // Paso 2: Si la pregunta existe, eliminarla para evitar repeticiones
    if (pregunta) {
      this.repository.deletePregunta(pregunta.getId());
    }

    // Paso 3: Retornar la pregunta obtenida
    return pregunta;
  }
}
