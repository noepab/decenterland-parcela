// ============================================
// Progress Tracking & Visual Indicators System
// ============================================
// Provides in-scene UI elements to show progress, notifications,
// and visual feedback for better user experience during development and gameplay.

import {
  engine,
  Transform,
  TextShape,
  Billboard,
  BillboardMode,
} from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'

// ============================================
// Configuration
// ============================================

export interface ProgressConfig {
  showFPSCounter: boolean
  showEntityCounter: boolean
  showNotifications: boolean
  showWelcomeMessage: boolean
  notificationDuration: number // seconds
}

const PROGRESS_CONFIG: ProgressConfig = {
  showFPSCounter: true,
  showEntityCounter: true,
  showNotifications: true,
  showWelcomeMessage: true,
  notificationDuration: 3,
}

// ============================================
// FPS Counter UI
// ============================================

let fpsCounterEntity: any = null
let currentFPS: number = 0
let frameCount: number = 0
let lastFpsUpdate: number = Date.now()

export function createFPSCounter(): void {
  if (!PROGRESS_CONFIG.showFPSCounter) return

  fpsCounterEntity = engine.addEntity()

  Transform.create(fpsCounterEntity, {
    position: Vector3.create(0.5, 2.8, 2),
    scale: Vector3.create(0.3, 0.3, 0.3),
  })

  TextShape.create(fpsCounterEntity, {
    text: 'FPS: --',
    fontSize: 5,
    textColor: Color4.Green(),
  })

  Billboard.create(fpsCounterEntity, {
    billboardMode: BillboardMode.BM_Y,
  })

  console.log('✅ FPS Counter created')
}

export function updateFPSCounter(): void {
  if (!fpsCounterEntity || !PROGRESS_CONFIG.showFPSCounter) return

  frameCount++
  const now = Date.now()
  const elapsed = now - lastFpsUpdate

  if (elapsed >= 1000) {
    currentFPS = Math.round((frameCount * 1000) / elapsed)
    frameCount = 0
    lastFpsUpdate = now

    const textShape = TextShape.getMutable(fpsCounterEntity)
    textShape.text = `FPS: ${currentFPS}`

    // Change color based on performance
    if (currentFPS >= 50) {
      textShape.textColor = Color4.Green()
    } else if (currentFPS >= 30) {
      textShape.textColor = Color4.Yellow()
    } else {
      textShape.textColor = Color4.Red()
    }
  }
}

// ============================================
// Entity Counter UI
// ============================================

let entityCounterEntity: any = null

export function createEntityCounter(): void {
  if (!PROGRESS_CONFIG.showEntityCounter) return

  entityCounterEntity = engine.addEntity()

  Transform.create(entityCounterEntity, {
    position: Vector3.create(-0.5, 2.8, 2),
    scale: Vector3.create(0.3, 0.3, 0.3),
  })

  TextShape.create(entityCounterEntity, {
    text: 'Entities: --',
    fontSize: 5,
    textColor: Color4.Cyan(),
  })

  Billboard.create(entityCounterEntity, {
    billboardMode: BillboardMode.BM_Y,
  })

  console.log('✅ Entity Counter created')
}

export function updateEntityCounter(): void {
  if (!entityCounterEntity || !PROGRESS_CONFIG.showEntityCounter) return

  let count = 0
  for (const [entity] of engine.getEntitiesWith(Transform)) {
    count++
  }

  const textShape = TextShape.getMutable(entityCounterEntity)
  textShape.text = `Entities: ${count}`
}

// ============================================
// Notification System
// ============================================

interface Notification {
  entity: any
  createdAt: number
  duration: number
}

const activeNotifications: Notification[] = []
let notificationYOffset = 3.5

export function showNotification(
  message: string,
  duration: number = PROGRESS_CONFIG.notificationDuration,
  color: Color4 = Color4.White()
): void {
  if (!PROGRESS_CONFIG.showNotifications) return

  const entity = engine.addEntity()

  Transform.create(entity, {
    position: Vector3.create(0, notificationYOffset, 3),
    scale: Vector3.create(0.4, 0.4, 0.4),
  })

  TextShape.create(entity, {
    text: message,
    fontSize: 4,
    textColor: color,
  })

  Billboard.create(entity, {
    billboardMode: BillboardMode.BM_Y,
  })

  activeNotifications.push({
    entity,
    createdAt: Date.now(),
    duration: duration * 1000,
  })

  notificationYOffset += 0.3

  console.log(`📢 Notification: ${message}`)
}

export function updateNotifications(): void {
  const now = Date.now()
  const toRemove: number[] = []

  activeNotifications.forEach((notification, index) => {
    const age = now - notification.createdAt

    if (age >= notification.duration) {
      engine.removeEntity(notification.entity)
      toRemove.push(index)
    } else {
      // Fade out effect
      const remaining = notification.duration - age
      if (remaining < 500) {
        const alpha = remaining / 500
        const textShape = TextShape.getMutable(notification.entity)
        const currentColor = textShape.textColor
        textShape.textColor = Color4.create(currentColor.r, currentColor.g, currentColor.b, alpha)
      }
    }
  })

  // Remove expired notifications
  toRemove.reverse().forEach((index) => {
    activeNotifications.splice(index, 1)
  })

  // Reset Y offset if all cleared
  if (activeNotifications.length === 0) {
    notificationYOffset = 3.5
  }
}

// ============================================
// Welcome Message
// ============================================

let welcomeMessageEntity: any = null

export function createWelcomeMessage(): void {
  if (!PROGRESS_CONFIG.showWelcomeMessage) return

  welcomeMessageEntity = engine.addEntity()

  Transform.create(welcomeMessageEntity, {
    position: Vector3.create(0, 2.2, 4),
    scale: Vector3.create(0.5, 0.5, 0.5),
  })

  TextShape.create(welcomeMessageEntity, {
    text: 'Bienvenido a AutoGestionPro HQ\n\n🏢 Explora el edificio\n🎨 Visita la galería\n🤖 Habla con el recepcionista\n✈️ Sube al drone',
    fontSize: 3,
    textColor: Color4.White(),
  })

  Billboard.create(welcomeMessageEntity, {
    billboardMode: BillboardMode.BM_Y,
  })

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (welcomeMessageEntity) {
      engine.removeEntity(welcomeMessageEntity)
      welcomeMessageEntity = null
      console.log('Welcome message hidden')
    }
  }, 10000)

  console.log('✅ Welcome message created')
}

// ============================================
// Progress Bar System
// ============================================

export interface ProgressBarOptions {
  position: Vector3
  width: number
  height: number
  color: Color4
  backgroundColor: Color4
  label?: string
}

export class ProgressBar {
  private containerEntity: any
  private barEntity: any
  private labelEntity: any | null = null
  private progress: number = 0
  private options: ProgressBarOptions

  constructor(options: ProgressBarOptions) {
    this.options = options
    this.createBar()
  }

  private createBar(): void {
    // Background
    this.containerEntity = engine.addEntity()
    Transform.create(this.containerEntity, {
      position: this.options.position,
      scale: Vector3.create(this.options.width, this.options.height, 0.1),
    })

    // Foreground (progress)
    this.barEntity = engine.addEntity()
    Transform.create(this.barEntity, {
      position: Vector3.create(
        this.options.position.x - this.options.width / 2,
        this.options.position.y,
        this.options.position.z - 0.05
      ),
      scale: Vector3.create(0, this.options.height, 0.11),
    })

    // Label
    if (this.options.label) {
      this.labelEntity = engine.addEntity()
      Transform.create(this.labelEntity, {
        position: Vector3.create(
          this.options.position.x,
          this.options.position.y + this.options.height + 0.2,
          this.options.position.z
        ),
        scale: Vector3.create(0.3, 0.3, 0.3),
      })

      TextShape.create(this.labelEntity, {
        text: this.options.label,
        fontSize: 5,
        textColor: Color4.White(),
      })

      Billboard.create(this.labelEntity, {
        billboardMode: BillboardMode.BM_Y,
      })
    }
  }

  setProgress(value: number): void {
    this.progress = Math.max(0, Math.min(1, value))

    const transform = Transform.getMutable(this.barEntity)
    transform.scale.x = this.options.width * this.progress

    // Update position to grow from left
    transform.position.x =
      this.options.position.x - this.options.width / 2 + (this.options.width * this.progress) / 2
  }

  getProgress(): number {
    return this.progress
  }

  updateLabel(text: string): void {
    if (this.labelEntity) {
      const textShape = TextShape.getMutable(this.labelEntity)
      textShape.text = text
    }
  }

  destroy(): void {
    engine.removeEntity(this.containerEntity)
    engine.removeEntity(this.barEntity)
    if (this.labelEntity) {
      engine.removeEntity(this.labelEntity)
    }
  }
}

// ============================================
// Loading Indicator
// ============================================

let loadingIndicator: ProgressBar | null = null

export function showLoadingIndicator(label: string = 'Cargando...'): void {
  if (loadingIndicator) {
    loadingIndicator.destroy()
  }

  loadingIndicator = new ProgressBar({
    position: Vector3.create(0, 2, 5),
    width: 2,
    height: 0.2,
    color: Color4.Blue(),
    backgroundColor: Color4.Gray(),
    label: label,
  })

  // Animate progress
  let progress = 0
  const interval = setInterval(() => {
    progress += 0.02
    if (progress >= 1) {
      clearInterval(interval)
      if (loadingIndicator) {
        setTimeout(() => {
          if (loadingIndicator) {
            loadingIndicator.destroy()
            loadingIndicator = null
          }
        }, 500)
      }
    } else {
      if (loadingIndicator) {
        loadingIndicator.setProgress(progress)
      }
    }
  }, 50)
}

// ============================================
// Interactive Markers
// ============================================

export function createInteractionMarker(
  position: Vector3,
  text: string = '▼ Click here',
  color: Color4 = Color4.Yellow()
): any {
  const entity = engine.addEntity()

  Transform.create(entity, {
    position: Vector3.create(position.x, position.y + 0.5, position.z),
    scale: Vector3.create(0.3, 0.3, 0.3),
  })

  TextShape.create(entity, {
    text: text,
    fontSize: 5,
    textColor: color,
  })

  Billboard.create(entity, {
    billboardMode: BillboardMode.BM_Y,
  })

  return entity
}

// ============================================
// System Initialization
// ============================================

export function initProgressSystem(): void {
  console.log('🎯 Initializing Progress & Visual Indicators System...')

  createFPSCounter()
  createEntityCounter()
  createWelcomeMessage()

  // Add update system
  engine.addSystem(() => {
    updateFPSCounter()
    updateNotifications()
  })

  // Update entity counter every 2 seconds
  setInterval(() => {
    updateEntityCounter()
  }, 2000)

  // Show initial notification
  setTimeout(() => {
    showNotification('Sistema de progreso iniciado', 3, Color4.Green())
  }, 1000)

  console.log('✅ Progress system initialized')
}

// ============================================
// Configuration Helpers
// ============================================

export function toggleFPSCounter(): void {
  PROGRESS_CONFIG.showFPSCounter = !PROGRESS_CONFIG.showFPSCounter
  if (!PROGRESS_CONFIG.showFPSCounter && fpsCounterEntity) {
    engine.removeEntity(fpsCounterEntity)
    fpsCounterEntity = null
  } else {
    createFPSCounter()
  }
  console.log(`FPS Counter: ${PROGRESS_CONFIG.showFPSCounter}`)
}

export function toggleEntityCounter(): void {
  PROGRESS_CONFIG.showEntityCounter = !PROGRESS_CONFIG.showEntityCounter
  if (!PROGRESS_CONFIG.showEntityCounter && entityCounterEntity) {
    engine.removeEntity(entityCounterEntity)
    entityCounterEntity = null
  } else {
    createEntityCounter()
  }
  console.log(`Entity Counter: ${PROGRESS_CONFIG.showEntityCounter}`)
}

export function toggleNotifications(): void {
  PROGRESS_CONFIG.showNotifications = !PROGRESS_CONFIG.showNotifications
  console.log(`Notifications: ${PROGRESS_CONFIG.showNotifications}`)
}

// Export for global access
if (typeof window !== 'undefined') {
  ;(window as any).DCL_PROGRESS = {
    showNotification,
    showLoadingIndicator,
    createInteractionMarker,
    toggleFPSCounter,
    toggleEntityCounter,
    toggleNotifications,
  }
  console.log('📊 Progress tools available: DCL_PROGRESS')
}
