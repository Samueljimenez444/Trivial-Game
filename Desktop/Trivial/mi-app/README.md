# Trivial Game - Juego de Preguntas

Aplicación de trivial desarrollada con React Native, Expo y TypeScript, implementando Clean Architecture y el patrón MVVM.

## Características

- **Clean Architecture**: Separación clara entre capas de Domain, Data y Presentation
- **MVVM Pattern**: ViewModel para gestión de estado y lógica de negocio
- **Dificultad Progresiva**: Las preguntas aumentan de dificultad conforme avanza el juego
- **Sin Repeticiones**: Sistema de arrays inmutable/mutable para evitar preguntas duplicadas
- **Interfaz Intuitiva**: Diseño moderno y responsive
- **Feedback Visual**: Indicadores claros de respuestas correctas/incorrectas
- **Sistema de Puntuación**: Tracking de aciertos y estadísticas finales

## Estructura del Proyecto

```
app/
├── DI/                          # Dependency Injection
│   ├── container.ts             # Contenedor de dependencias
│   └── types.ts                 # Definición de tipos para DI
│
├── Domain/                      # Capa de Dominio
│   ├── Entities/
│   │   └── Pregunta.ts          # Entidad Pregunta
│   ├── Repositories/
│   │   └── IListadoPreguntas.ts # Interfaz del repositorio
│   └── UseCases/
│       ├── GetPreguntaUseCase.ts
│       ├── ResetGameUseCase.ts
│       ├── ValidateAnswerUseCase.ts
│       └── CalculateDifficultyUseCase.ts
│
├── Data/                        # Capa de Datos
│   └── Repositories/
│       └── ListadoPreguntas.ts  # Implementación del repositorio
│
├── Presenter/                   # Capa de Presentación
│   ├── ViewModels/
│   │   └── GameViewModel.ts     # ViewModel del juego
│   └── Views/
│       ├── StartScreen.tsx      # Pantalla de inicio
│       ├── GameScreen.tsx       # Pantalla del juego
│       └── EndGameScreen.tsx    # Pantalla de resultados
│
└── index.tsx                    # Punto de entrada
```

## Arquitectura

### Clean Architecture

La aplicación está organizada en tres capas principales:

1. **Domain (Dominio)**: Contiene la lógica de negocio pura
   - Entidades: Modelos de datos core
   - Use Cases: Casos de uso de la aplicación
   - Interfaces: Contratos que deben cumplir las implementaciones

2. **Data (Datos)**: Implementación de repositorios
   - Gestión de arrays inmutable/mutable de preguntas
   - Lógica de selección aleatoria
   - Persistencia de datos (actualmente en memoria)

3. **Presenter (Presentación)**: Capa de UI
   - Views: Componentes React Native
   - ViewModels: Lógica de estado y coordinación

### Flujo del Juego

1. **Inicio**: Usuario introduce su nombre
2. **Juego**:
   - Se muestran 10 preguntas con dificultad progresiva
   - El jugador selecciona una respuesta y la confirma
   - Se muestra feedback visual (tick verde para correctas)
   - Espera de 2.5 segundos antes de la siguiente pregunta
3. **Fin**:
   - Muestra puntuación final y porcentaje
   - Opciones para jugar de nuevo o volver al inicio

### Sistema de Dificultad

La dificultad aumenta progresivamente según la fórmula:
```
dificultad = Math.ceil((numeroPregunta / totalPreguntas) * 10)
```

- Pregunta 1: Dificultad 1
- Pregunta 5: Dificultad 5
- Pregunta 10: Dificultad 10

## Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar la aplicación:
   ```bash
   npx expo start
   ```

3. Opciones de ejecución:
   - Presiona `a` para abrir en Android emulator
   - Presiona `i` para abrir en iOS simulator
   - Presiona `w` para abrir en navegador web
   - Escanea el QR con Expo Go en tu dispositivo móvil

## Tecnologías Utilizadas

- **React Native** 0.81.5
- **Expo** ~54.0.31
- **TypeScript** ~5.9.2
- **Expo Router** 6.0.21 (File-based routing)
- **React Navigation** 7.1.8
- **React Native Reanimated** 4.1.1

## Inyección de Dependencias

El proyecto utiliza un sistema de DI simplificado mediante un contenedor singleton:

```typescript
const container = DIContainer.getInstance();
const useCase = container.getGetPreguntaUseCase();
```

## Personalización

### Añadir Más Preguntas

Edita el array `PREGUNTAS_INMUTABLES` en [app/Data/Repositories/ListadoPreguntas.ts](app/Data/Repositories/ListadoPreguntas.ts):

```typescript
new Preguntas(
  id,
  "¿Tu pregunta?",
  ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  indiceRespuestaCorrecta, // 0-3
  dificultad // 1-10
)
```

### Modificar Cantidad de Preguntas

Edita la constante en [app/Domain/UseCases/CalculateDifficultyUseCase.ts](app/Domain/UseCases/CalculateDifficultyUseCase.ts):

```typescript
private readonly PREGUNTAS_PARA_GANAR = 10; // Cambiar aquí
```

## Principios de Diseño

- **SOLID**: Aplicación de principios de diseño orientado a objetos
- **Separation of Concerns**: Cada capa tiene una responsabilidad única
- **Dependency Inversion**: Las capas superiores no dependen de las inferiores
- **Single Responsibility**: Cada clase/componente tiene una única razón para cambiar
- **Clean Code**: Código legible, mantenible y bien organizado

## Estado del Proyecto

✅ Implementación completa con todas las funcionalidades solicitadas
✅ Clean Architecture aplicada correctamente
✅ MVVM implementado
✅ Inyección de dependencias
✅ Sistema de dificultad progresiva
✅ Interfaz intuitiva y atractiva
✅ Feedback visual de respuestas
✅ Sistema de puntuación

## Licencia

Proyecto personal para uso en concursos con amigos.
