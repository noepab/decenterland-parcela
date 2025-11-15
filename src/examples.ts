// ============================================
// EJEMPLO DE USO - Herramientas de Desarrollo
// ============================================
// Este archivo muestra cómo usar las nuevas herramientas incluidas
// Puedes copiar y modificar estos ejemplos para tu propio desarrollo

import { engine, Transform, MeshRenderer, Material } from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'

// Importar sistemas de debugging y progreso
import { initDebugSystem, logSuccess, logWarning, logError } from './modules/debug'
import { initProgressSystem, showNotification } from './modules/progress'
import {
  EntityFactory,
  AnimationHelper,
  MathUtils,
  ColorUtils,
  Vector3Utils,
  TestHelper,
} from './modules/utils'

// ============================================
// EJEMPLO 1: Inicializar Sistemas de Debug
// ============================================

export function exampleInitDebugSystems(): void {
  console.log('=== EJEMPLO 1: Inicializando sistemas de debug ===')

  // Iniciar sistema de debugging
  initDebugSystem()
  logSuccess('Debug system initialized', 'Example 1')

  // Iniciar sistema de progreso visual
  initProgressSystem()
  logSuccess('Progress system initialized', 'Example 1')

  // Mostrar notificación en pantalla
  setTimeout(() => {
    showNotification('¡Sistemas iniciados correctamente!', 3, Color4.Green())
  }, 1000)
}

// ============================================
// EJEMPLO 2: Crear Entidades Fácilmente
// ============================================

export function exampleCreateEntities(): void {
  console.log('=== EJEMPLO 2: Creando entidades con EntityFactory ===')

  // Crear una caja roja
  const redBox = EntityFactory.createBox(
    Vector3.create(2, 1, 2),
    Vector3Utils.uniform(1),
    Color4.Red()
  )
  logSuccess('Red box created at (2, 1, 2)', 'Example 2')

  // Crear una esfera verde
  const greenSphere = EntityFactory.createSphere(
    Vector3.create(-2, 1, 2),
    0.5,
    Color4.Green()
  )
  logSuccess('Green sphere created at (-2, 1, 2)', 'Example 2')

  // Crear un plano azul
  const bluePlane = EntityFactory.createPlane(
    Vector3.create(0, 0.1, 4),
    Vector3.create(3, 1, 2),
    ColorUtils.fromHex('#00CCF0') // Color AGP
  )
  logSuccess('Blue plane created with AGP color', 'Example 2')

  // Mostrar notificación
  setTimeout(() => {
    showNotification('Entidades creadas', 2, Color4.Cyan())
  }, 500)
}

// ============================================
// EJEMPLO 3: Añadir Interactividad
// ============================================

export function exampleAddInteractivity(): void {
  console.log('=== EJEMPLO 3: Añadiendo interactividad ===')

  // Crear una caja clickeable
  const clickableBox = EntityFactory.createBox(
    Vector3.create(0, 1, 3),
    Vector3Utils.uniform(1),
    Color4.Yellow()
  )

  // Hacer clickeable
  EntityFactory.createClickable(clickableBox, 'Click me!', () => {
    logSuccess('Box was clicked!', 'Example 3')
    showNotification('¡Caja clickeada!', 2, Color4.Yellow())

    // Cambiar color al hacer click
    Material.setPbrMaterial(clickableBox, {
      albedoColor: ColorUtils.random(),
    })
  })

  logSuccess('Interactive box created', 'Example 3')
}

// ============================================
// EJEMPLO 4: Animaciones
// ============================================

export function exampleAnimations(): void {
  console.log('=== EJEMPLO 4: Creando animaciones ===')

  // Crear cubo para animar
  const animatedBox = EntityFactory.createBox(
    Vector3.create(3, 1, 3),
    Vector3Utils.uniform(0.8),
    Color4.Magenta()
  )

  // Animación 1: Rotar constantemente
  AnimationHelper.rotateConstantly(animatedBox, 45, 'y')
  logSuccess('Rotating animation started', 'Example 4')

  // Crear esfera para animar
  const bouncingSphere = EntityFactory.createSphere(
    Vector3.create(-3, 1, 3),
    0.4,
    Color4.Cyan()
  )

  // Animación 2: Bounce (rebotar)
  AnimationHelper.bounce(bouncingSphere, 1, 0.5, 2)
  logSuccess('Bouncing animation started', 'Example 4')

  // Crear cubo para animar posición
  const movingBox = EntityFactory.createBox(
    Vector3.create(0, 1, 5),
    Vector3Utils.uniform(0.5),
    Color4.Green()
  )

  // Animación 3: Mover de A a B
  const startPos = Vector3.create(0, 1, 5)
  const endPos = Vector3.create(3, 1, 5)

  AnimationHelper.animatePosition(movingBox, startPos, endPos, 2, () => {
    logSuccess('Movement animation completed', 'Example 4')
    // Volver al inicio
    AnimationHelper.animatePosition(movingBox, endPos, startPos, 2)
  })

  showNotification('Animaciones iniciadas', 3, Color4.Magenta())
}

// ============================================
// EJEMPLO 5: Usar Utilidades Matemáticas
// ============================================

export function exampleMathUtils(): void {
  console.log('=== EJEMPLO 5: Utilizando MathUtils ===')

  // Generar número aleatorio
  const randomValue = MathUtils.randomRange(1, 10)
  console.log('Random value (1-10):', randomValue)

  // Interpolar entre valores
  const lerp = MathUtils.lerp(0, 100, 0.5) // 50
  console.log('Lerp (0 to 100 at 0.5):', lerp)

  // Clamp value
  const clamped = MathUtils.clamp(150, 0, 100) // 100
  console.log('Clamped (150 between 0-100):', clamped)

  // Calcular distancia
  const point1 = Vector3.create(0, 0, 0)
  const point2 = Vector3.create(3, 4, 0)
  const distance = MathUtils.distance(point1, point2)
  console.log('Distance between points:', distance) // 5

  logSuccess('Math utilities demonstrated', 'Example 5')
}

// ============================================
// EJEMPLO 6: Usar Utilidades de Color
// ============================================

export function exampleColorUtils(): void {
  console.log('=== EJEMPLO 6: Utilizando ColorUtils ===')

  // Crear color desde HEX
  const agpColor = ColorUtils.fromHex('#00CCF0')
  console.log('AGP Color from hex:', agpColor)

  // Interpolar entre colores
  const red = Color4.Red()
  const blue = Color4.Blue()
  const purple = ColorUtils.lerp(red, blue, 0.5)

  // Crear cubo con color interpolado
  const colorBox = EntityFactory.createBox(Vector3.create(4, 1, 0), Vector3Utils.uniform(1), purple)

  logSuccess('Color utilities demonstrated', 'Example 6')

  // Crear varios cubos con colores de la paleta
  let xOffset = -4
  Object.entries(ColorUtils.Palette).forEach(([name, color]) => {
    EntityFactory.createBox(Vector3.create(xOffset, 0.5, -2), Vector3.create(0.5, 0.5, 0.5), color)
    xOffset += 0.6
  })

  showNotification('Paleta de colores mostrada', 3, Color4.White())
}

// ============================================
// EJEMPLO 7: Testing Helpers
// ============================================

export function exampleTestHelpers(): void {
  console.log('=== EJEMPLO 7: Utilizando TestHelper ===')

  // Crear grid de prueba
  TestHelper.createTestGrid(5, 2)
  logSuccess('Test grid created', 'Example 7')

  // Crear indicadores de ejes (X=Red, Y=Green, Z=Blue)
  TestHelper.createAxisIndicators(3)
  logSuccess('Axis indicators created', 'Example 7')

  // Log info de una entidad
  const testEntity = EntityFactory.createBox(Vector3.create(0, 1, 0), Vector3Utils.uniform(1), Color4.White())
  TestHelper.logEntity(testEntity, 'Test Box')

  showNotification('Herramientas de testing mostradas', 3, Color4.White())
}

// ============================================
// EJEMPLO 8: Sistema de Notificaciones
// ============================================

export function exampleNotifications(): void {
  console.log('=== EJEMPLO 8: Sistema de notificaciones ===')

  // Notificación básica
  showNotification('Notificación básica', 3)

  // Notificación con color personalizado
  setTimeout(() => {
    showNotification('Notificación verde', 3, Color4.Green())
  }, 1000)

  setTimeout(() => {
    showNotification('Notificación roja', 3, Color4.Red())
  }, 2000)

  setTimeout(() => {
    showNotification('Notificación amarilla', 3, Color4.Yellow())
  }, 3000)

  logSuccess('Notification examples queued', 'Example 8')
}

// ============================================
// EJEMPLO 9: Logging con Formato
// ============================================

export function exampleLogging(): void {
  console.log('=== EJEMPLO 9: Sistema de logging ===')

  // Diferentes tipos de logs
  logSuccess('Operation completed successfully', 'Example 9')
  logWarning('This is a warning message', 'Example 9')
  logError(new Error('This is an error'), 'Example 9')

  // Logs condicionales para debugging
  const DEBUG = true
  if (DEBUG) {
    console.log('Debug info: Value =', 42)
  }
}

// ============================================
// EJEMPLO 10: Combinar Todo
// ============================================

export function exampleCombineAll(): void {
  console.log('=== EJEMPLO 10: Combinando todas las herramientas ===')

  // Crear una escena interactiva completa
  const mainEntity = EntityFactory.createBox(
    Vector3.create(0, 1.5, 6),
    Vector3Utils.uniform(1.2),
    ColorUtils.fromHex('#FF6B6B')
  )

  // Añadir interactividad
  let clickCount = 0
  EntityFactory.createClickable(mainEntity, '🎯 Demo Completo', () => {
    clickCount++
    logSuccess(`Clicked ${clickCount} times`, 'Complete Demo')

    // Cambiar color aleatoriamente
    Material.setPbrMaterial(mainEntity, {
      albedoColor: ColorUtils.random(),
    })

    // Mostrar notificación
    showNotification(`Click #${clickCount}`, 2, ColorUtils.random())

    // Animar escala
    const currentScale = Transform.get(mainEntity).scale
    const newScale = Vector3Utils.uniform(MathUtils.randomRange(0.8, 1.5))

    AnimationHelper.animateScale(mainEntity, currentScale, newScale, 0.5)
  })

  // Añadir rotación constante
  AnimationHelper.rotateConstantly(mainEntity, 30, 'y')

  logSuccess('Complete demo entity created', 'Example 10')
  showNotification('🎉 ¡Demo completo creado!\nClick en el cubo rojo', 5, Color4.White())
}

// ============================================
// EXPORTAR FUNCIÓN PRINCIPAL PARA TESTING
// ============================================

export function runAllExamples(): void {
  console.log('\n')
  console.log('╔════════════════════════════════════════╗')
  console.log('║   EJEMPLOS DE HERRAMIENTAS DE DEBUG   ║')
  console.log('╚════════════════════════════════════════╝')
  console.log('\n')

  // Ejecutar todos los ejemplos con delays
  exampleInitDebugSystems()

  setTimeout(() => exampleCreateEntities(), 1000)
  setTimeout(() => exampleAddInteractivity(), 2000)
  setTimeout(() => exampleAnimations(), 3000)
  setTimeout(() => exampleMathUtils(), 4000)
  setTimeout(() => exampleColorUtils(), 5000)
  setTimeout(() => exampleTestHelpers(), 6000)
  setTimeout(() => exampleNotifications(), 7000)
  setTimeout(() => exampleLogging(), 8000)
  setTimeout(() => exampleCombineAll(), 9000)

  console.log('\n')
  console.log('📝 Todos los ejemplos se ejecutarán en 10 segundos')
  console.log('💡 Abre la consola del navegador para ver los comandos disponibles')
  console.log('🎮 Usa DCL_DEBUG, DCL_PROGRESS y DCL_UTILS para más funciones')
  console.log('\n')
}

// ============================================
// COMENTARIO: Cómo usar este archivo
// ============================================
/*
Para probar estos ejemplos:

1. Importa en src/index.ts:
   import { runAllExamples } from './examples'

2. Llama en setupScene():
   runAllExamples()

3. Compila y ejecuta:
   npm run build
   npm start

4. Abre la consola del navegador (F12) y experimenta con:
   - DCL_DEBUG.help()
   - DCL_DEBUG.fps()
   - DCL_DEBUG.entities()
   - DCL_PROGRESS.showNotification('Test')
   - DCL_UTILS.Entity.createBox(...)

¡Diviértete desarrollando! 🚀
*/
