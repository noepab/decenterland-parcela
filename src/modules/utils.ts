// ============================================
// Testing Utilities & Helper Functions
// ============================================
// Provides utility functions to make development and testing easier

import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  GltfContainer,
  PointerEvents,
  PointerEventType,
  AudioSource,
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4, Color3 } from '@dcl/sdk/math'

// ============================================
// Math Utilities
// ============================================

export class MathUtils {
  /**
   * Linear interpolation between two values
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t
  }

  /**
   * Clamp value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }

  /**
   * Calculate distance between two Vector3 points
   */
  static distance(a: Vector3, b: Vector3): number {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dz = b.z - a.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Random number between min and max
   */
  static randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  /**
   * Random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Convert degrees to radians
   */
  static degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180
  }

  /**
   * Convert radians to degrees
   */
  static radToDeg(radians: number): number {
    return (radians * 180) / Math.PI
  }

  /**
   * Check if value is approximately equal (within epsilon)
   */
  static approximately(a: number, b: number, epsilon: number = 0.001): boolean {
    return Math.abs(a - b) < epsilon
  }
}

// ============================================
// Vector3 Utilities
// ============================================

export class Vector3Utils {
  /**
   * Create Vector3 with same value for all components
   */
  static uniform(value: number): Vector3 {
    return Vector3.create(value, value, value)
  }

  /**
   * Lerp between two Vector3
   */
  static lerp(start: Vector3, end: Vector3, t: number): Vector3 {
    return Vector3.create(
      MathUtils.lerp(start.x, end.x, t),
      MathUtils.lerp(start.y, end.y, t),
      MathUtils.lerp(start.z, end.z, t)
    )
  }

  /**
   * Get random position within a box
   */
  static randomInBox(min: Vector3, max: Vector3): Vector3 {
    return Vector3.create(
      MathUtils.randomRange(min.x, max.x),
      MathUtils.randomRange(min.y, max.y),
      MathUtils.randomRange(min.z, max.z)
    )
  }

  /**
   * Copy Vector3
   */
  static clone(v: Vector3): Vector3 {
    return Vector3.create(v.x, v.y, v.z)
  }

  /**
   * Check if two Vector3 are approximately equal
   */
  static approximately(a: Vector3, b: Vector3, epsilon: number = 0.001): boolean {
    return (
      MathUtils.approximately(a.x, b.x, epsilon) &&
      MathUtils.approximately(a.y, b.y, epsilon) &&
      MathUtils.approximately(a.z, b.z, epsilon)
    )
  }
}

// ============================================
// Color Utilities
// ============================================

export class ColorUtils {
  /**
   * Create color from hex string
   */
  static fromHex(hex: string): Color4 {
    // Remove # if present
    hex = hex.replace('#', '')

    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1

    return Color4.create(r, g, b, a)
  }

  /**
   * Lerp between two colors
   */
  static lerp(start: Color4, end: Color4, t: number): Color4 {
    return Color4.create(
      MathUtils.lerp(start.r, end.r, t),
      MathUtils.lerp(start.g, end.g, t),
      MathUtils.lerp(start.b, end.b, t),
      MathUtils.lerp(start.a, end.a, t)
    )
  }

  /**
   * Random color
   */
  static random(alpha: number = 1): Color4 {
    return Color4.create(Math.random(), Math.random(), Math.random(), alpha)
  }

  /**
   * Common color palette
   */
  static readonly Palette = {
    Red: Color4.Red(),
    Green: Color4.Green(),
    Blue: Color4.Blue(),
    Yellow: Color4.Yellow(),
    Cyan: Color4.create(0, 1, 1, 1),
    Magenta: Color4.Magenta(),
    White: Color4.White(),
    Black: Color4.Black(),
    Gray: Color4.Gray(),
    Orange: Color4.create(1, 0.5, 0, 1),
    Purple: Color4.create(0.5, 0, 1, 1),
    Pink: Color4.create(1, 0.75, 0.8, 1),
  }
}

// ============================================
// Entity Creation Helpers
// ============================================

export class EntityFactory {
  /**
   * Create a simple box entity
   */
  static createBox(
    position: Vector3,
    scale: Vector3 = Vector3Utils.uniform(1),
    color: Color4 = Color4.White()
  ): any {
    const entity = engine.addEntity()

    Transform.create(entity, {
      position,
      scale,
    })

    MeshRenderer.setBox(entity)

    Material.setPbrMaterial(entity, {
      albedoColor: color,
    })

    return entity
  }

  /**
   * Create a simple sphere entity
   */
  static createSphere(
    position: Vector3,
    radius: number = 0.5,
    color: Color4 = Color4.White()
  ): any {
    const entity = engine.addEntity()

    Transform.create(entity, {
      position,
      scale: Vector3Utils.uniform(radius * 2),
    })

    MeshRenderer.setSphere(entity)

    Material.setPbrMaterial(entity, {
      albedoColor: color,
    })

    return entity
  }

  /**
   * Create a plane entity
   */
  static createPlane(
    position: Vector3,
    scale: Vector3 = Vector3Utils.uniform(1),
    color: Color4 = Color4.White()
  ): any {
    const entity = engine.addEntity()

    Transform.create(entity, {
      position,
      scale,
    })

    MeshRenderer.setPlane(entity)

    Material.setPbrMaterial(entity, {
      albedoColor: color,
    })

    return entity
  }

  /**
   * Create entity from GLB model
   */
  static createModel(position: Vector3, modelPath: string, scale?: Vector3): any {
    const entity = engine.addEntity()

    Transform.create(entity, {
      position,
      scale: scale || Vector3Utils.uniform(1),
    })

    GltfContainer.create(entity, {
      src: modelPath,
    })

    return entity
  }

  /**
   * Create clickable entity
   */
  static createClickable(
    entity: any,
    hoverText: string,
    callback: () => void
  ): void {
    PointerEvents.createOrReplace(entity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: 'PRIMARY',
            hoverText: hoverText,
            callback: callback,
          },
        },
      ],
    })
  }
}

// ============================================
// Animation Helpers
// ============================================

export class AnimationHelper {
  /**
   * Animate position over time
   */
  static animatePosition(
    entity: any,
    start: Vector3,
    end: Vector3,
    duration: number,
    onComplete?: () => void
  ): void {
    const startTime = Date.now()

    const systemId = engine.addSystem(() => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / (duration * 1000), 1)

      const transform = Transform.getMutable(entity)
      transform.position = Vector3Utils.lerp(start, end, t)

      if (t >= 1) {
        engine.removeSystem(systemId)
        if (onComplete) onComplete()
      }
    })
  }

  /**
   * Animate scale over time
   */
  static animateScale(
    entity: any,
    start: Vector3,
    end: Vector3,
    duration: number,
    onComplete?: () => void
  ): void {
    const startTime = Date.now()

    const systemId = engine.addSystem(() => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / (duration * 1000), 1)

      const transform = Transform.getMutable(entity)
      transform.scale = Vector3Utils.lerp(start, end, t)

      if (t >= 1) {
        engine.removeSystem(systemId)
        if (onComplete) onComplete()
      }
    })
  }

  /**
   * Rotate entity continuously
   */
  static rotateConstantly(
    entity: any,
    speed: number,
    axis: 'x' | 'y' | 'z' = 'y'
  ): number {
    let rotation = 0

    const systemId = engine.addSystem((dt: number) => {
      rotation += speed * dt

      const transform = Transform.getMutable(entity)
      if (axis === 'y') {
        transform.rotation = Quaternion.fromEulerDegrees(0, rotation, 0)
      } else if (axis === 'x') {
        transform.rotation = Quaternion.fromEulerDegrees(rotation, 0, 0)
      } else {
        transform.rotation = Quaternion.fromEulerDegrees(0, 0, rotation)
      }
    })

    return systemId
  }

  /**
   * Bounce entity up and down
   */
  static bounce(
    entity: any,
    baseHeight: number,
    amplitude: number,
    speed: number
  ): number {
    let time = 0

    const systemId = engine.addSystem((dt: number) => {
      time += speed * dt

      const transform = Transform.getMutable(entity)
      const currentPos = transform.position
      transform.position = Vector3.create(
        currentPos.x,
        baseHeight + Math.sin(time) * amplitude,
        currentPos.z
      )
    })

    return systemId
  }
}

// ============================================
// Audio Helpers
// ============================================

export class AudioHelper {
  /**
   * Play sound on entity
   */
  static playSound(
    entity: any,
    audioPath: string,
    loop: boolean = false,
    volume: number = 1.0
  ): void {
    AudioSource.createOrReplace(entity, {
      audioClipUrl: audioPath,
      loop: loop,
      playing: true,
      volume: volume,
    })
  }

  /**
   * Stop sound on entity
   */
  static stopSound(entity: any): void {
    const audioSource = AudioSource.getMutableOrNull(entity)
    if (audioSource) {
      audioSource.playing = false
    }
  }

  /**
   * Set volume on entity
   */
  static setVolume(entity: any, volume: number): void {
    const audioSource = AudioSource.getMutableOrNull(entity)
    if (audioSource) {
      audioSource.volume = MathUtils.clamp(volume, 0, 1)
    }
  }
}

// ============================================
// Timer Utilities
// ============================================

export class Timer {
  private callbacks: Map<number, () => void> = new Map()
  private nextId: number = 0

  /**
   * Execute callback after delay
   */
  setTimeout(callback: () => void, delayMs: number): number {
    const id = this.nextId++
    setTimeout(() => {
      callback()
      this.callbacks.delete(id)
    }, delayMs)
    this.callbacks.set(id, callback)
    return id
  }

  /**
   * Execute callback repeatedly
   */
  setInterval(callback: () => void, intervalMs: number): number {
    const id = this.nextId++
    const intervalId = setInterval(callback, intervalMs)
    this.callbacks.set(id, () => clearInterval(intervalId))
    return id
  }

  /**
   * Cancel timer
   */
  clear(id: number): void {
    const callback = this.callbacks.get(id)
    if (callback) {
      callback()
      this.callbacks.delete(id)
    }
  }

  /**
   * Clear all timers
   */
  clearAll(): void {
    this.callbacks.forEach((callback) => callback())
    this.callbacks.clear()
  }
}

export const timer = new Timer()

// ============================================
// Validation Utilities
// ============================================

export class Validator {
  /**
   * Check if file path exists (basic check)
   */
  static isValidPath(path: string): boolean {
    return path && path.length > 0 && !path.includes('..')
  }

  /**
   * Check if position is within bounds
   */
  static isPositionInBounds(position: Vector3, min: Vector3, max: Vector3): boolean {
    return (
      position.x >= min.x &&
      position.x <= max.x &&
      position.y >= min.y &&
      position.y <= max.y &&
      position.z >= min.z &&
      position.z <= max.z
    )
  }

  /**
   * Check if color is valid
   */
  static isValidColor(color: Color4): boolean {
    return (
      color.r >= 0 &&
      color.r <= 1 &&
      color.g >= 0 &&
      color.g <= 1 &&
      color.b >= 0 &&
      color.b <= 1 &&
      color.a >= 0 &&
      color.a <= 1
    )
  }
}

// ============================================
// Testing Helpers
// ============================================

export class TestHelper {
  /**
   * Create test scene with grid
   */
  static createTestGrid(size: number = 5, spacing: number = 2): void {
    const halfSize = Math.floor(size / 2)

    for (let x = -halfSize; x <= halfSize; x++) {
      for (let z = -halfSize; z <= halfSize; z++) {
        const color =
          (x + z) % 2 === 0 ? Color4.White() : Color4.create(0.8, 0.8, 0.8, 1)

        EntityFactory.createBox(
          Vector3.create(x * spacing, 0.05, z * spacing),
          Vector3.create(spacing * 0.9, 0.1, spacing * 0.9),
          color
        )
      }
    }

    console.log(`✅ Test grid created: ${size}x${size}`)
  }

  /**
   * Create axis indicators
   */
  static createAxisIndicators(length: number = 5): void {
    // X axis (red)
    EntityFactory.createBox(
      Vector3.create(length / 2, 0.1, 0),
      Vector3.create(length, 0.1, 0.1),
      Color4.Red()
    )

    // Y axis (green)
    EntityFactory.createBox(
      Vector3.create(0, length / 2, 0),
      Vector3.create(0.1, length, 0.1),
      Color4.Green()
    )

    // Z axis (blue)
    EntityFactory.createBox(
      Vector3.create(0, 0.1, length / 2),
      Vector3.create(0.1, 0.1, length),
      Color4.Blue()
    )

    console.log('✅ Axis indicators created')
  }

  /**
   * Log entity information
   */
  static logEntity(entity: any, label: string = 'Entity'): void {
    const transform = Transform.getOrNull(entity)
    if (transform) {
      console.log(`${label} Info:`)
      console.log('  Position:', transform.position)
      console.log('  Scale:', transform.scale)
      console.log('  Rotation:', transform.rotation)
    } else {
      console.log(`${label}: No transform component`)
    }
  }
}

// ============================================
// Export for global access
// ============================================

if (typeof window !== 'undefined') {
  ;(window as any).DCL_UTILS = {
    Math: MathUtils,
    Vector3: Vector3Utils,
    Color: ColorUtils,
    Entity: EntityFactory,
    Animation: AnimationHelper,
    Audio: AudioHelper,
    Timer: timer,
    Validator: Validator,
    Test: TestHelper,
  }
  console.log('🛠️ Utility tools available: DCL_UTILS')
}
