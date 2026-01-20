/**
 * TIPOS DE INYECCIÓN DE DEPENDENCIAS
 *
 * Define símbolos únicos para identificar cada tipo de dependencia en el contenedor DI.
 * Aunque en esta implementación no se usan activamente (se usa un container simplificado),
 * están preparados para evolucionar hacia un sistema DI más robusto como InversifyJS.
 *
 * USO DE SYMBOLS:
 * - Symbol.for() crea símbolos globales únicos
 * - Garantiza que no haya colisiones de nombres
 * - Permite identificar dependencias de forma type-safe
 *
 * FUTURA EXPANSIÓN:
 * Si se migra a una librería DI como InversifyJS, estos símbolos se usarían así:
 * @inject(TYPES.IListadoPreguntas) repository: IListadoPreguntas
 */
export const TYPES = {
  /** Símbolo para el repositorio de preguntas */
  IListadoPreguntas: Symbol.for("IListadoPreguntas"),

  /** Símbolo para el caso de uso de obtención de preguntas */
  GetPreguntaUseCase: Symbol.for("GetPreguntaUseCase"),

  /** Símbolo para el caso de uso de reseteo del juego */
  ResetGameUseCase: Symbol.for("ResetGameUseCase"),

  /** Símbolo para el caso de uso de validación de respuestas */
  ValidateAnswerUseCase: Symbol.for("ValidateAnswerUseCase"),

  /** Símbolo para el caso de uso de cálculo de dificultad */
  CalculateDifficultyUseCase: Symbol.for("CalculateDifficultyUseCase"),
};
