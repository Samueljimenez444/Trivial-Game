import { Preguntas } from "../Entities/Pregunta";
import { IValidateAnswerUseCase } from "../Interfaces/IValidateAnswerUseCase";

/**
 * CASO DE USO: ValidateAnswerUseCase
 *
 * Implementa la lógica de negocio para validar si una respuesta es correcta.
 * Este caso de uso compara el índice de la respuesta seleccionada por el usuario
 * con el índice de la respuesta correcta almacenada en la pregunta.
 *
 * LÓGICA:
 * - Las respuestas están indexadas de 0 a 3 (4 opciones)
 * - Se hace una comparación directa entre índices
 * - Retorna true si coinciden, false en caso contrario
 *
 * PATRÓN: Strategy Pattern
 * - Permite cambiar la estrategia de validación sin afectar otras capas
 * - Por ejemplo, se podría implementar validación con puntos parciales
 *
 * USO EN EL JUEGO:
 * - Se ejecuta cuando el usuario presiona "Resolver"
 * - El resultado determina si el usuario continúa o pierde
 */
export class ValidateAnswerUseCase implements IValidateAnswerUseCase {
  /**
   * Ejecuta la validación de la respuesta
   *
   * @param pregunta - La pregunta que está siendo respondida
   * @param respuestaSeleccionada - Índice (0-3) de la opción elegida por el usuario
   * @returns true si la respuesta es correcta, false si es incorrecta
   */
  execute(pregunta: Preguntas, respuestaSeleccionada: number): boolean {
    // Comparación directa: índice seleccionado vs índice correcto
    return pregunta.getRespuestaCorrecta() === respuestaSeleccionada;
  }
}
