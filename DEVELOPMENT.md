# Guía de Desarrollo - Decenterland Parcela

Esta guía proporciona información detallada sobre la arquitectura, patrones y mejores prácticas del proyecto.

## 📐 Arquitectura del Proyecto

### Visión General

El proyecto está construido con Decentraland SDK 7 usando TypeScript, siguiendo una arquitectura modular que separa las responsabilidades en módulos independientes.

```
┌─────────────────────────────────────────────────┐
│                  index.ts                        │
│            (Punto de Entrada)                    │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼─────┐         ┌────▼─────┐
   │ scene.ts │         │ modules/ │
   └──────────┘         └────┬─────┘
                             │
        ┌────────────────────┼────────────────────┐
        │         │          │          │         │
   ┌────▼───┐ ┌──▼───┐ ┌───▼────┐ ┌──▼──┐  ┌───▼────┐
   │ audio  │ │building│ │gallery │ │lighting│ │interactives│
   └────────┘ └────────┘ └────────┘ └───────┘ └────────────┘
```

### Principios de Diseño

1. **Modularidad**: Cada funcionalidad está en su propio módulo
2. **Reutilización**: Funciones y componentes reutilizables
3. **Separación de Responsabilidades**: Cada módulo tiene un propósito específico
4. **Extensibilidad**: Fácil añadir nuevas funcionalidades
5. **Mantenibilidad**: Código limpio y bien documentado

## 🏗️ Estructura de Módulos

### index.ts - Punto de Entrada Principal
**Propósito**: Inicialización y coordinación de la escena

**Responsabilidades**:
- Sistema de animación avanzado
- Control de entidades principales
- Loop de actualización principal
- Manejo de estado global

**Funciones Clave**:
- `setupScene()`: Inicializa todos los componentes
- `animateBlueSphere()`: Sistema de animación circular
- `handleModelClick()`: Manejo de interacciones
- `calculateCircularMotion()`: Cálculo de movimiento
- `calculateHeightVariation()`: Variación de altura

### scene.ts - Configuración de Escena
**Propósito**: Configuración y setup inicial

**Responsabilidades**:
- Configuración de la escena
- Definición de parámetros base
- Inicialización de recursos

### modules/audio.ts - Sistema de Audio
**Propósito**: Gestión de sonidos y música

**Capacidades**:
- Música ambiental
- Efectos de sonido
- Audio espacial
- Control de volumen
- Sonidos activados por eventos

**Ejemplo de uso**:
```typescript
import { playSound, playMusic } from './modules/audio'

playSound('sounds/click.mp3')
playMusic('sounds/ambient.mp3', true) // loop
```

### modules/building.ts - Estructura del Edificio
**Propósito**: Construcción del edificio de 5 pisos

**Componentes**:
- Planta baja (recepción)
- Pisos 1-2 (oficinas)
- Piso 3 (galería + snack-bar)
- Azotea (con drone)
- Paredes, pisos, techos
- Escaleras y ascensores

**Características**:
- Diseño modular por piso
- Materiales personalizados
- Colisiones configuradas
- Optimización de geometría

### modules/gallery.ts - Galería de Arte
**Propósito**: Sistema de galería interactiva

**Funcionalidades**:
- Display de obras de arte
- Información de artista
- Interacción con piezas
- Iluminación especializada
- Rotación de exposiciones

### modules/interactives.ts - Elementos Interactivos
**Propósito**: Gestión de interacciones del usuario

**Elementos**:
- Recepcionista IA (diálogo)
- Botones y controles
- Puertas automáticas
- Paneles informativos
- Trigger zones

**Patrón de Interacción**:
```typescript
PointerEvents.createOrReplace(entity, {
  pointerEvents: [{
    eventType: PointerEventType.PET_DOWN,
    eventInfo: {
      button: 'PRIMARY',
      hoverText: 'Hacer click',
      callback: () => {
        // Acción a ejecutar
      }
    }
  }]
})
```

### modules/lighting.ts - Sistema de Iluminación
**Propósito**: Control de iluminación ambiental y dinámica

**Tipos de Luz**:
- Luz ambiental
- Luz direccional
- Point lights
- Spot lights

**Características**:
- Modo día/noche
- Intensidad ajustable
- Colores configurables
- Sombras optimizadas

### modules/materials.ts - Materiales y Texturas
**Propósito**: Biblioteca de materiales reutilizables

**Materiales Disponibles**:
- Material AGP (azul corporativo)
- Materiales metálicos
- Materiales emisivos
- Vidrio y transparencias

### modules/teleport-ui.ts - Sistema de Teletransporte
**Propósito**: Navegación rápida entre pisos

**Funcionalidades**:
- UI de selección de piso
- Teletransporte suave
- Prevención de glitches
- Feedback visual

## 🎮 Sistema de Entidades y Componentes

### Entity Component System (ECS)

Decentraland usa un patrón ECS donde:
- **Entity**: Contenedor de componentes (ID único)
- **Component**: Datos y comportamiento
- **System**: Lógica que opera sobre componentes

**Ejemplo**:
```typescript
// Crear entidad
const entity = engine.addEntity()

// Añadir componente Transform
Transform.create(entity, {
  position: Vector3.create(0, 1, 0),
  scale: Vector3.create(1, 1, 1),
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})

// Añadir componente MeshRenderer
MeshRenderer.setBox(entity)

// Añadir componente Material
Material.setPbrMaterial(entity, {
  albedoColor: Color4.Red()
})
```

## 🔄 Ciclo de Vida y Sistemas

### Engine Systems

Los sistemas se ejecutan cada frame:

```typescript
engine.addSystem((dt: number) => {
  // dt = deltaTime desde último frame
  // Actualizar animaciones
  // Procesar lógica de juego
  // Actualizar UI
})
```

### Orden de Ejecución
1. **Inicialización**: `setupScene()`
2. **Loop Principal**: Systems ejecutados cada frame
3. **Eventos**: Callbacks de interacción
4. **Cleanup**: Eliminación de entidades

## 🎨 Patrones de Diseño Utilizados

### 1. Module Pattern
Cada módulo exporta funciones públicas y mantiene estado privado:

```typescript
// modules/ejemplo.ts
let estadoPrivado = 0

export function funcionPublica() {
  estadoPrivado++
  return estadoPrivado
}
```

### 2. Factory Pattern
Creación de entidades complejas:

```typescript
export function crearBoton(text: string, position: Vector3) {
  const entity = engine.addEntity()
  // Configuración compleja
  return entity
}
```

### 3. Observer Pattern
Sistema de eventos y callbacks:

```typescript
function onEvent(callback: () => void) {
  // Registrar callback
  callbacks.push(callback)
}
```

### 4. Singleton Pattern
Estado global y configuración:

```typescript
class GameState {
  private static instance: GameState
  private constructor() {}
  
  static getInstance() {
    if (!GameState.instance) {
      GameState.instance = new GameState()
    }
    return GameState.instance
  }
}
```

## 🚀 Mejores Prácticas

### Performance

#### 1. Optimización de Geometría
```typescript
// ✅ Bueno: Reutilizar geometrías
const boxMesh = MeshRenderer.setBox(entity1)
MeshRenderer.setBox(entity2) // Reutiliza internamente

// ❌ Malo: Crear geometrías complejas innecesarias
```

#### 2. Gestión de Texturas
```typescript
// ✅ Bueno: Texturas optimizadas (power of 2, comprimidas)
// 512x512, 1024x1024, 2048x2048

// ❌ Malo: Texturas grandes sin comprimir
// 4096x4096 sin optimizar
```

#### 3. LOD (Level of Detail)
```typescript
// Mostrar menos detalles cuando está lejos
if (distanceToPlayer > 10) {
  // Reducir complejidad
}
```

#### 4. Pooling de Entidades
```typescript
// Reutilizar entidades en lugar de crear/destruir
const pool: Entity[] = []

function getEntityFromPool() {
  return pool.pop() || engine.addEntity()
}

function returnToPool(entity: Entity) {
  pool.push(entity)
}
```

### Código Limpio

#### Nombrado
```typescript
// ✅ Bueno: Nombres descriptivos
function createInteractiveButton() {}
const playerPosition = Vector3.create(0, 0, 0)

// ❌ Malo: Nombres crípticos
function cib() {}
const pp = Vector3.create(0, 0, 0)
```

#### Funciones Pequeñas
```typescript
// ✅ Bueno: Una responsabilidad
function calculateDistance(a: Vector3, b: Vector3) {
  return Vector3.distance(a, b)
}

// ❌ Malo: Hace demasiadas cosas
function doEverything() {
  // 500 líneas de código...
}
```

#### Constantes
```typescript
// ✅ Bueno: Constantes nombradas
const MAX_SPEED = 10
const GRAVITY = -9.8

// ❌ Malo: Magic numbers
velocity = velocity + (-9.8)
```

### Error Handling

```typescript
// Validación de entrada
function loadModel(path: string) {
  if (!path) {
    console.error('Model path is required')
    return
  }
  
  try {
    GltfContainer.create(entity, { src: path })
  } catch (error) {
    console.error('Failed to load model:', error)
  }
}
```

## 🐛 Debugging

### Console Logging

```typescript
// Diferentes niveles
console.log('Info:', value)
console.warn('Warning:', warning)
console.error('Error:', error)

// Debug condicional
const DEBUG = true
if (DEBUG) {
  console.log('Debug info:', debugInfo)
}
```

### Visual Debugging

```typescript
// Mostrar posiciones
function showDebugMarker(position: Vector3) {
  const marker = engine.addEntity()
  Transform.create(marker, { position })
  MeshRenderer.setSphere(marker)
  Material.setPbrMaterial(marker, {
    albedoColor: Color4.Red()
  })
}
```

### Performance Profiling

```typescript
// Medir tiempo de ejecución
const startTime = Date.now()
// ... operación costosa ...
const endTime = Date.now()
console.log(`Tiempo: ${endTime - startTime}ms`)
```

## 📊 Límites y Restricciones

### Límites de Decentraland (por parcela 1x1)

- **Triángulos**: ~10,000
- **Entidades**: ~200
- **Materiales**: ~20
- **Texturas**: 10MB total
- **Sonidos**: 10MB total
- **Scripts**: Sin límite de tamaño, pero evitar bucles infinitos

### Optimización

```typescript
// Contar entidades activas
let entityCount = 0
for (const [entity] of engine.getEntitiesWith(Transform)) {
  entityCount++
}
console.log('Entidades activas:', entityCount)
```

## 🔧 Herramientas de Desarrollo

### NPM Scripts

```bash
npm run build    # Compilar TypeScript
npm run watch    # Compilar automáticamente
npm start        # Servidor de desarrollo
npm run lint     # Verificar código
npm run status   # Estado del proyecto
```

### Inspector de Decentraland

```bash
npm run ecs-install  # Instalar inspector
# Presiona I en la escena para abrir
```

### VS Code Extensions Recomendadas

- TypeScript + JavaScript
- ESLint
- Prettier
- GitLens
- Decentraland SDK Snippets

## 📚 Recursos Adicionales

### Documentación Oficial
- [Decentraland Docs](https://docs.decentraland.org/)
- [SDK 7 Reference](https://docs.decentraland.org/creator/development-guide/sdk7/)
- [Examples Repository](https://github.com/decentraland/sdk7-goerli-plaza)

### Comunidad
- [Decentraland Discord](https://dcl.gg/discord)
- [Forum](https://forum.decentraland.org/)
- [GitHub Discussions](https://github.com/decentraland/sdk/discussions)

### Herramientas
- [Blender](https://www.blender.org/) - Modelado 3D
- [Audacity](https://www.audacityteam.org/) - Edición de audio
- [GIMP](https://www.gimp.org/) - Edición de imágenes

---

¿Preguntas? Consulta [CONTRIBUTING.md](CONTRIBUTING.md) o abre un Issue en GitHub.
