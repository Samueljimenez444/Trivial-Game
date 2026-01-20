import { IListadoPreguntas } from "../Repositories/IListadoPreguntas";
import { IResetGameUseCase } from "../Interfaces/IResetGameUseCase";

/**
 * CASO DE USO: ResetGameUseCase
 *
 * Implementa la lógica de negocio para reiniciar el juego.
 * Este caso de uso se encarga de restaurar el repositorio de preguntas
 * a su estado inicial, permitiendo comenzar una nueva partida con todas
 * las preguntas disponibles nuevamente.
 *
 * CUÁNDO SE USA:
 * - Al iniciar una nueva partida
 * - Cuando el jugador selecciona "Jugar de nuevo" en la pantalla de fin
 * - Cuando el jugador vuelve al inicio desde la pantalla de fin
 *
 * PATRÓN: Dependency Injection
 */
export class ResetGameUseCase implements IResetGameUseCase {
  /**
   * Constructor con inyección de dependencias
   * @param repository - Repositorio de preguntas que será reseteado
   */
  constructor(private repository: IListadoPreguntas) {}

  /**
   * Ejecuta el caso de uso para resetear el juego
   * Delega en el repositorio la operación de restaurar las preguntas
   */
  execute(): void {
    this.repository.resetPreguntas();
  }
}
