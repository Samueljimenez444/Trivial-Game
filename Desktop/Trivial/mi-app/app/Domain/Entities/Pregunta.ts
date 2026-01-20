/**
 * ENTIDAD: Pregunta
 *
 * Representa una pregunta del juego de trivial siguiendo los principios de Clean Architecture.
 * Esta clase es parte de la capa de Domain (Dominio) y contiene la lógica de negocio central.
 *
 * PRINCIPIOS APLICADOS:
 * - Encapsulación: Todas las propiedades son privadas
 * - Single Responsibility: Solo maneja la lógica relacionada con una pregunta
 * - Inmutabilidad: Los getters retornan copias cuando es necesario (arrays)
 */
export class Preguntas {
  // PROPIEDADES PRIVADAS - Solo accesibles mediante getters/setters

  /** Identificador único de la pregunta */
  private id: number;

  /** Texto de la pregunta que se mostrará al usuario */
  private enunciado: string;

  /** Array con las 4 opciones de respuesta posibles */
  private respuestas: string[] = [];

  /** Índice (0-3) de la respuesta correcta en el array de respuestas */
  private respuestaCorrecta: number;

  /** Indica si la pregunta ya ha sido contestada por el usuario */
  private preguntaRespondida: boolean = false;

  /** Nivel de dificultad de la pregunta (1-10) */
  private dificultad: number;

  /**
   * Constructor de la entidad Pregunta
   *
   * @param id - Identificador único de la pregunta
   * @param enunciado - Texto de la pregunta
   * @param respuestas - Array de 4 opciones de respuesta
   * @param respuestaCorrecta - Índice de la respuesta correcta (0-3)
   * @param dificultad - Nivel de dificultad (1-10)
   * @throws Error si la dificultad no está entre 1 y 10
   */
  constructor(
    id: number,
    enunciado: string,
    respuestas: string[],
    respuestaCorrecta: number,
    dificultad: number
  ) {
    this.id = id;
    this.enunciado = enunciado;
    this.respuestas = respuestas;
    this.respuestaCorrecta = respuestaCorrecta;

    // VALIDACIÓN: La dificultad debe estar en el rango válido
    if (dificultad < 1 || dificultad > 10) {
      throw new Error("La dificultad debe estar entre 1 y 10");
    }

    this.dificultad = dificultad;
  }

  /**
   * Alterna el estado de si la pregunta ha sido respondida
   * Se puede usar para marcar una pregunta como contestada
   */
  public setPreguntaRespondida(): void {
    this.preguntaRespondida = !this.preguntaRespondida;
  }

  /**
   * Obtiene el identificador único de la pregunta
   * @returns El ID de la pregunta
   */
  public getId(): number {
    return this.id;
  }

  /**
   * Obtiene el nivel de dificultad de la pregunta
   * @returns Número entre 1 y 10 representando la dificultad
   */
  public getDificultad(): number {
    return this.dificultad;
  }

  /**
   * Obtiene el texto/enunciado de la pregunta
   * @returns El texto de la pregunta que se mostrará al usuario
   */
  public getEnunciado(): string {
    return this.enunciado;
  }

  /**
   * Obtiene las opciones de respuesta
   * IMPORTANTE: Retorna una COPIA del array para mantener la inmutabilidad
   * Esto previene que código externo modifique el array original
   *
   * @returns Copia del array con las 4 opciones de respuesta
   */
  public getRespuestas(): string[] {
    return [...this.respuestas];
  }

  /**
   * Obtiene el índice de la respuesta correcta
   * @returns Índice (0-3) que indica cuál opción del array de respuestas es la correcta
   */
  public getRespuestaCorrecta(): number {
    return this.respuestaCorrecta;
  }

  /**
   * Verifica si la pregunta ya ha sido respondida
   * @returns true si la pregunta fue contestada, false en caso contrario
   */
  public isPreguntaRespondida(): boolean {
    return this.preguntaRespondida;
  }
}