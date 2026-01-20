import { IListadoPreguntas } from "../Domain/Repositories/IListadoPreguntas";
import { ListadoPreguntas } from "../Data/Repositories/ListadoPreguntas";
import { GetPreguntaUseCase } from "../Domain/UseCases/GetPreguntaUseCase";
import { ResetGameUseCase } from "../Domain/UseCases/ResetGameUseCase";
import { ValidateAnswerUseCase } from "../Domain/UseCases/ValidateAnswerUseCase";
import { CalculateDifficultyUseCase } from "../Domain/UseCases/CalculateDifficultyUseCase";

/**
 * CONTENEDOR DE INYECCIÓN DE DEPENDENCIAS (DI Container)
 *
 * Implementa un contenedor de IoC (Inversion of Control) simplificado para gestionar
 * las dependencias de la aplicación siguiendo el patrón Singleton.
 *
 * PATRÓN SINGLETON:
 * - Solo existe UNA instancia del contenedor en toda la aplicación
 * - Garantiza que todos los componentes usen las mismas instancias de repositorios
 * - El método getInstance() asegura la creación controlada de la instancia única
 *
 * RESPONSABILIDADES:
 * 1. Crear y mantener instancias de repositorios
 * 2. Proveer casos de uso con sus dependencias ya inyectadas
 * 3. Centralizar la configuración de dependencias
 *
 * VENTAJAS DE ESTE PATRÓN:
 * - Desacoplamiento: Las capas superiores no conocen las implementaciones concretas
 * - Testabilidad: Fácil de mockear para testing
 * - Mantenibilidad: Cambios en dependencias solo afectan este archivo
 * - Single Source of Truth: Un solo lugar donde se configuran las dependencias
 *
 * FLUJO DE USO:
 * 1. ViewModel solicita un UseCase al contenedor
 * 2. El contenedor crea el UseCase con sus dependencias inyectadas
 * 3. El ViewModel usa el UseCase sin conocer los detalles de implementación
 *
 * EJEMPLO DE USO:
 * ```typescript
 * const container = DIContainer.getInstance();
 * const useCase = container.getGetPreguntaUseCase();
 * const pregunta = useCase.execute(5); // dificultad 5
 * ```
 */
class DIContainer {
  /** Instancia única del contenedor (patrón Singleton) */
  private static instance: DIContainer;

  /**
   * Repositorio compartido de preguntas
   * Se crea UNA SOLA VEZ y se reutiliza en todos los UseCases que lo necesiten
   * Esto asegura que todos trabajen con el mismo estado de preguntas
   */
  private listadoPreguntasRepository: IListadoPreguntas;

  /**
   * Constructor privado - parte del patrón Singleton
   * Previene la creación directa de instancias con 'new DIContainer()'
   * Solo se puede obtener la instancia mediante getInstance()
   */
  private constructor() {
    // Inicializar el repositorio con su implementación concreta
    // Aquí se decide qué implementación usar (en este caso, ListadoPreguntas)
    this.listadoPreguntasRepository = new ListadoPreguntas();
  }

  /**
   * Obtiene la instancia única del contenedor (patrón Singleton)
   *
   * THREAD-SAFE (en JavaScript): La primera llamada crea la instancia,
   * las siguientes llamadas retornan siempre la misma instancia
   *
   * @returns La instancia única del DIContainer
   */
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Provee una instancia de GetPreguntaUseCase con sus dependencias inyectadas
   *
   * INYECCIÓN DE DEPENDENCIAS:
   * - Pasa el repositorio al constructor del UseCase
   * - El UseCase no conoce la implementación concreta del repositorio
   *
   * @returns Nueva instancia de GetPreguntaUseCase lista para usar
   */
  getGetPreguntaUseCase(): GetPreguntaUseCase {
    return new GetPreguntaUseCase(this.listadoPreguntasRepository);
  }

  /**
   * Provee una instancia de ResetGameUseCase con sus dependencias inyectadas
   *
   * @returns Nueva instancia de ResetGameUseCase lista para usar
   */
  getResetGameUseCase(): ResetGameUseCase {
    return new ResetGameUseCase(this.listadoPreguntasRepository);
  }

  /**
   * Provee una instancia de ValidateAnswerUseCase
   *
   * NOTA: Este UseCase no tiene dependencias externas,
   * solo trabaja con la lógica de comparación
   *
   * @returns Nueva instancia de ValidateAnswerUseCase lista para usar
   */
  getValidateAnswerUseCase(): ValidateAnswerUseCase {
    return new ValidateAnswerUseCase();
  }

  /**
   * Provee una instancia de CalculateDifficultyUseCase
   *
   * NOTA: Este UseCase es puramente algorítmico,
   * no depende de repositorios ni servicios externos
   *
   * @returns Nueva instancia de CalculateDifficultyUseCase lista para usar
   */
  getCalculateDifficultyUseCase(): CalculateDifficultyUseCase {
    return new CalculateDifficultyUseCase();
  }
}

export default DIContainer;
