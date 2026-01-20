import { Preguntas } from "../../Domain/Entities/Pregunta";
import { IListadoPreguntas } from "../../Domain/Repositories/IListadoPreguntas";

/**
 * REPOSITORIO: ListadoPreguntas
 *
 * Implementación concreta del repositorio de preguntas para la capa de Data.
 * Este repositorio maneja la persistencia en memoria de las preguntas del trivial.
 *
 * ARQUITECTURA - CAPA DE DATOS:
 * - Implementa la interfaz IListadoPreguntas definida en Domain
 * - Gestiona dos arrays: uno inmutable (fuente de datos) y uno mutable (estado activo)
 * - Proporciona acceso a las preguntas sin exponer la implementación interna
 *
 * SISTEMA DE ARRAYS DUAL:
 * 1. PREGUNTAS_INMUTABLES (readonly static):
 *    - Array original con todas las preguntas
 *    - NUNCA se modifica durante el juego
 *    - Se usa como fuente para resetear el juego
 *
 * 2. preguntasMutables (private):
 *    - Copia del array inmutable
 *    - Se elimina una pregunta cada vez que se usa
 *    - Se resetea al iniciar nueva partida
 *
 * FLUJO DE DATOS:
 * - Inicio de partida: preguntasMutables = [...PREGUNTAS_INMUTABLES]
 * - Durante juego: se van eliminando preguntas de preguntasMutables
 * - Fin de partida: se resetea preguntasMutables
 *
 * PRINCIPIOS APLICADOS:
 * - Single Responsibility: Solo maneja preguntas
 * - Open/Closed: Cerrado para modificación, abierto para extensión
 * - Dependency Inversion: Implementa una interfaz del Domain
 */
export class ListadoPreguntas implements IListadoPreguntas {
  /**
   * Array mutable que contiene las preguntas disponibles actualmente
   * Se reduce a medida que se usan preguntas para evitar repeticiones
   */
  private preguntasMutables: Preguntas[] = [];

  /**
   * Array inmutable con TODAS las preguntas del juego
   * Sirve como fuente de datos original y para resetear el juego
   *
   * ESTRUCTURA DE PREGUNTAS:
   * - 30 preguntas en total
   * - Distribuidas en 10 niveles de dificultad (1-10)
   * - Cada pregunta tiene 4 opciones de respuesta
   *
   * FORMATO: new Preguntas(id, enunciado, [respuestas], índiceCorrecta, dificultad)
   * - id: Identificador único (1-30)
   * - enunciado: Texto de la pregunta
   * - respuestas: Array con 4 opciones
   * - índiceCorrecta: Posición de la respuesta correcta (0-3)
   * - dificultad: Nivel de dificultad (1-10)
   */
  private static readonly PREGUNTAS_INMUTABLES: Preguntas[] = [
    // NIVEL 1 - Preguntas muy fáciles (cultura general básica)
    new Preguntas(1, "¿Cuál es la capital de Francia?", ["Londres", "París", "Madrid", "Berlín"], 1, 1),
    new Preguntas(2, "¿Cuántos continentes hay en el mundo?", ["5", "6", "7", "8"], 2, 1),
    new Preguntas(3, "¿De qué color es el cielo en un día despejado?", ["Verde", "Azul", "Rojo", "Amarillo"], 1, 1),

    // NIVEL 2 - Preguntas fáciles
    new Preguntas(4, "¿Qué planeta es conocido como el planeta rojo?", ["Venus", "Marte", "Júpiter", "Saturno"], 1, 2),
    new Preguntas(5, "¿En qué año llegó el hombre a la Luna?", ["1967", "1969", "1971", "1973"], 1, 2),
    new Preguntas(6, "¿Cuántas patas tiene una araña?", ["6", "8", "10", "12"], 1, 2),

    // NIVEL 3 - Preguntas moderadas
    new Preguntas(7, "¿Quién pintó la Mona Lisa?", ["Van Gogh", "Picasso", "Leonardo da Vinci", "Miguel Ángel"], 2, 3),
    new Preguntas(8, "¿Cuál es el océano más grande del mundo?", ["Atlántico", "Índico", "Ártico", "Pacífico"], 3, 3),
    new Preguntas(9, "¿En qué país se originó el tango?", ["Brasil", "Argentina", "España", "México"], 1, 3),

    // NIVEL 4 - Preguntas de dificultad media
    new Preguntas(10, "¿Cuál es el elemento químico con símbolo 'Au'?", ["Plata", "Oro", "Hierro", "Aluminio"], 1, 4),
    new Preguntas(11, "¿En qué país se encuentra la Torre Eiffel?", ["Italia", "España", "Francia", "Alemania"], 2, 4),
    new Preguntas(12, "¿Cuál es el animal terrestre más rápido?", ["León", "Guepardo", "Antílope", "Caballo"], 1, 4),

    // NIVEL 5 - Preguntas intermedias
    new Preguntas(13, "¿Cuál es el río más largo del mundo?", ["Nilo", "Amazonas", "Yangtsé", "Misisipi"], 1, 5),
    new Preguntas(14, "¿Quién escribió 'Don Quijote de la Mancha'?", ["Lope de Vega", "Cervantes", "Shakespeare", "Góngora"], 1, 5),
    new Preguntas(15, "¿Cuántos lados tiene un hexágono?", ["4", "5", "6", "7"], 2, 5),

    // NIVEL 6 - Preguntas desafiantes
    new Preguntas(16, "¿Cuántos huesos tiene el cuerpo humano adulto?", ["196", "206", "216", "226"], 1, 6),
    new Preguntas(17, "¿En qué año comenzó la Segunda Guerra Mundial?", ["1937", "1939", "1941", "1943"], 1, 6),
    new Preguntas(18, "¿Qué instrumento mide los terremotos?", ["Barómetro", "Sismógrafo", "Termómetro", "Anemómetro"], 1, 6),

    // NIVEL 7 - Preguntas difíciles
    new Preguntas(19, "¿Cuál es la montaña más alta del mundo?", ["K2", "Everest", "Kilimanjaro", "Aconcagua"], 1, 7),
    new Preguntas(20, "¿Qué científico desarrolló la teoría de la relatividad?", ["Newton", "Einstein", "Galileo", "Hawking"], 1, 7),
    new Preguntas(21, "¿Cuál es el planeta más grande del sistema solar?", ["Saturno", "Júpiter", "Neptuno", "Urano"], 1, 7),

    // NIVEL 8 - Preguntas muy difíciles
    new Preguntas(22, "¿Cuál es la moneda de Japón?", ["Won", "Yuan", "Yen", "Dong"], 2, 8),
    new Preguntas(23, "¿En qué continente se encuentra Egipto?", ["Asia", "África", "Europa", "Oceanía"], 1, 8),
    new Preguntas(24, "¿Quién escribió 'Romeo y Julieta'?", ["Dickens", "Shakespeare", "Cervantes", "Molière"], 1, 8),

    // NIVEL 9 - Preguntas expertas
    new Preguntas(25, "¿Cuál es el idioma más hablado del mundo?", ["Inglés", "Chino mandarín", "Español", "Hindi"], 1, 9),
    new Preguntas(26, "¿Qué gas es esencial para la respiración?", ["Hidrógeno", "Nitrógeno", "Oxígeno", "Dióxido de carbono"], 2, 9),
    new Preguntas(27, "¿En qué año cayó el Muro de Berlín?", ["1987", "1989", "1991", "1993"], 1, 9),

    // NIVEL 10 - Preguntas maestras (máxima dificultad)
    new Preguntas(28, "¿Cuál es el país más grande del mundo por extensión?", ["Canadá", "China", "Estados Unidos", "Rusia"], 3, 10),
    new Preguntas(29, "¿Quién fue el primer presidente de Estados Unidos?", ["Jefferson", "Washington", "Lincoln", "Adams"], 1, 10),
    new Preguntas(30, "¿Cuál es el metal más abundante en la corteza terrestre?", ["Hierro", "Aluminio", "Cobre", "Oro"], 1, 10),
  ];

  /**
   * Constructor del repositorio
   * Inicializa el array mutable copiando todas las preguntas inmutables
   */
  constructor() {
    this.resetPreguntas();
  }

  /**
   * Obtiene una pregunta aleatoria del nivel de dificultad especificado
   *
   * ALGORITMO:
   * 1. Filtra preguntas por dificultad
   * 2. Selecciona una aleatoriamente
   * 3. Retorna la pregunta (o null si no hay disponibles)
   *
   * @param dificultad - Nivel de dificultad deseado (1-10)
   * @returns Pregunta aleatoria del nivel solicitado, o null si no hay disponibles
   */
  getPregunta(dificultad: number): Preguntas | null {
    // Filtrar preguntas del nivel de dificultad solicitado
    const preguntasFiltradas = this.preguntasMutables.filter(
      p => p.getDificultad() === dificultad
    );

    // Si no hay preguntas de ese nivel, retornar null
    if (preguntasFiltradas.length === 0) {
      return null;
    }

    // Seleccionar una pregunta aleatoria del conjunto filtrado
    const index = Math.floor(Math.random() * preguntasFiltradas.length);
    return preguntasFiltradas[index];
  }

  /**
   * Elimina una pregunta del array mutable por su ID
   * Se usa para evitar que la misma pregunta aparezca dos veces en una partida
   *
   * IMPORTANTE: Solo elimina del array mutable, no del inmutable
   *
   * @param id - Identificador único de la pregunta a eliminar
   */
  deletePregunta(id: number): void {
    this.preguntasMutables = this.preguntasMutables.filter(p => p.getId() !== id);
  }

  /**
   * Restaura el array mutable a su estado original
   * Copia todas las preguntas desde el array inmutable
   *
   * USO:
   * - Al iniciar una nueva partida
   * - Al reiniciar el juego desde la pantalla de fin
   *
   * TÉCNICA: Spread operator [...] crea una copia superficial del array
   */
  resetPreguntas(): void {
    this.preguntasMutables = [...ListadoPreguntas.PREGUNTAS_INMUTABLES];
  }

  /**
   * Obtiene la cantidad de preguntas aún disponibles en el array mutable
   *
   * @returns Número de preguntas que quedan sin usar
   */
  getCantidadPreguntasDisponibles(): number {
    return this.preguntasMutables.length;
  }
}
