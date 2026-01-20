/**
 * INTERFAZ DE CASO DE USO: IResetGameUseCase
 *
 * Define el contrato para reiniciar el juego.
 * Este caso de uso se encarga de restaurar el estado del repositorio de preguntas
 * a su estado inicial, permitiendo comenzar una nueva partida.
 *
 * PATRÓN: Command Pattern
 * USO: Se ejecuta al iniciar una nueva partida o al volver a jugar
 */
export interface IResetGameUseCase {
  /**
   * Ejecuta el caso de uso para resetear el juego
   * Restaura todas las preguntas al estado original
   */
  execute(): void;
}
