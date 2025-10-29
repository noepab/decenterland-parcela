// ============================================
// Decenterland Parcela - Advanced Scene Setup
// ============================================
// Enhanced animation system with circular motion,
// sine-wave height variation, and interactive controls

import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  Color4,
  PointerEvents,
  PointerEventType,
  Quaternion,
} from '@dcl/sdk/ecs'

import { Vector3 } from '@dcl/sdk/math'

// ============================================
// Animation Configuration Constants
// ============================================
/**
 * Configuration object for blue sphere animation
 * - radius: Distance from center (XZ plane)
 * - height: Base height in Y axis
 * - heightAmplitude: Maximum deviation in Y using sine wave
 * - baseSpeed: Base rotation speed (radians per frame)
 * - speedMultiplier: Applied when accelerated by red box click
 */
const ANIMATION_CONFIG = {
  sphereRadius: 4,
  sphereBaseHeight: 2,
  heightAmplitude: 1.5,
  baseSpeed: 0.02,
  speedMultiplier: 2.5,
  speedDecayFrames: 120, // Frames until speed returns to normal
}

// ============================================
// Global State for Animations & Interactions
// ============================================
/** Track animation time for floating effect */
let animationTime: number = 0

/** Speed multiplier state for blue sphere acceleration */
let speedMultiplierActive: number = 1.0
let speedDecayCounter: number = 0

/** Store references to interactive entities */
let blueSphereEntity: any = null
let redBoxEntity: any = null
let wallEntity: any = null
let welcomeTextEntity: any = null

let isCyanColor: boolean = true
const originalBoxScale = Vector3.create(2, 2, 2)

// ============================================
// Animation Functions (Modular)
// ============================================

/**
 * calculateCircularMotion: Computes position on circular path in XZ plane
 * Uses parametric equations for smooth circular motion
 * @param time - Current animation time
 * @param radius - Radius of circular path
 * @returns Vector3 with x, z on circle, y unchanged
 */
function calculateCircularMotion(time: number, radius: number): { x: number; z: number } {
  const angle = time * ANIMATION_CONFIG.baseSpeed * speedMultiplierActive
  return {
    x: Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
  }
}

/**
 * calculateHeightVariation: Computes vertical oscillation using sine wave
 * Creates smooth up-down floating motion
 * @param time - Current animation time
 * @param baseHeight - Center point for oscillation
 * @param amplitude - Maximum deviation from center
 * @returns Height value in Y axis
 */
function calculateHeightVariation(time: number, baseHeight: number, amplitude: number): number {
  const frequency = ANIMATION_CONFIG.baseSpeed * speedMultiplierActive * 0.5
  return baseHeight + Math.sin(time * frequency) * amplitude
}

/**
 * updateSpeedMultiplier: Manages acceleration decay over time
 * Gradually returns speed to normal after red box click
 */
function updateSpeedMultiplier(): void {
  if (speedMultiplierActive > 1.0) {
    speedDecayCounter++
    if (speedDecayCounter >= ANIMATION_CONFIG.speedDecayFrames) {
      speedMultiplierActive = 1.0
      speedDecayCounter = 0
    }
  }
}

/**
 * animateBlueSphere: Updates blue sphere position with circular + vertical motion
 * Combines XZ circular motion with Y sine wave for complex 3D animation
 */
function animateBlueSphere(): void {
  if (!blueSphereEntity) return

  const circularPos = calculateCircularMotion(animationTime, ANIMATION_CONFIG.sphereRadius)
  const height = calculateHeightVariation(
    animationTime,
    ANIMATION_CONFIG.sphereBaseHeight,
    ANIMATION_CONFIG.heightAmplitude
  )

  const transform = Transform.getMutable(blueSphereEntity)
  transform.position = Vector3.create(circularPos.x, height, circularPos.z)

  // Add subtle rotation for visual interest
  const rotationSpeed = 0.05 * speedMultiplierActive
  const currentRotation = transform.rotation
  transform.rotation = Quaternion.fromEulerDegrees(
    0,
    rotationSpeed * animationTime,
    Math.sin(animationTime * 0.01) * 10
  )
}

/**
 * handleRedBoxClick: Triggered when user clicks red box
 * Accelerates blue sphere animation temporarily
 */
function handleRedBoxClick(): void {
  console.log('Red box clicked - Accelerating blue sphere!')
  speedMultiplierActive = ANIMATION_CONFIG.speedMultiplier
  speedDecayCounter = 0
}

// ============================================
// Entity Creation Functions (Modular)
// ============================================

/**
 * createBlueSphere: Creates animated blue sphere
 */
function createBlueSphere(): void {
  blueSphereEntity = engine.addEntity()

  MeshRenderer.setBox(blueSphereEntity)
  Material.setPbrMaterial(blueSphereEntity, {
    albedoColor: Color4.create(0, 0.5, 1, 1), // Blue
  })

  Transform.create(blueSphereEntity, {
    position: Vector3.create(ANIMATION_CONFIG.sphereRadius, ANIMATION_CONFIG.sphereBaseHeight, 0),
    scale: Vector3.create(0.8, 0.8, 0.8),
  })
}

/**
 * createRedBox: Creates interactive red box
 */
function createRedBox(): void {
  redBoxEntity = engine.addEntity()

  MeshRenderer.setBox(redBoxEntity)
  Material.setPbrMaterial(redBoxEntity, {
    albedoColor: Color4.create(1, 0, 0, 1), // Red
  })

  Transform.create(redBoxEntity, {
    position: Vector3.create(0, 1, 0),
    scale: Vector3.create(2, 2, 2),
  })

  // Add click interaction
  PointerEvents.createOrReplace(redBoxEntity, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: 'PRIMARY',
          hoverText: 'Click to accelerate sphere',
        },
      },
    ],
  })
}

/**
 * createWall: Creates background wall
 */
function createWall(): void {
  wallEntity = engine.addEntity()

  MeshRenderer.setBox(wallEntity)
  Material.setPbrMaterial(wallEntity, {
    albedoColor: Color4.create(0.5, 0.5, 0.5, 1),
  })

  Transform.create(wallEntity, {
    position: Vector3.create(0, 2, -5),
    scale: Vector3.create(10, 4, 0.2),
  })
}

// ============================================
// Scene Setup
// ============================================

/**
 * setupScene: Initializes all scene entities
 * Creates modular structure for easy maintenance
 */
function setupScene(): void {
  console.log('Setting up enhanced animation scene...')
  createBlueSphere()
  createRedBox()
  createWall()
  console.log('Scene setup complete!')
}

// ============================================
// Main Update Loop
// ============================================

/**
 * Main animation loop - called every frame
 * Updates animation states and entity positions
 */
engine.addSystem(() => {
  animationTime += 1
  updateSpeedMultiplier()
  animateBlueSphere()
})

// ============================================
// Input Handling
// ============================================

/**
 * Pointer event handler for interactive elements
 */
engine.addSystem((dt: number) => {
  if (!redBoxEntity) return

  // Check for pointer down events
  const pointerEvents = PointerEvents.get(redBoxEntity)
  if (pointerEvents && pointerEvents.pointerEvents && pointerEvents.pointerEvents.length > 0) {
    // Handle click interaction
    engine.addSystem(() => {
      PointerEvents.createOrReplace(redBoxEntity, {
        pointerEvents: [
          {
            eventType: PointerEventType.PET_DOWN,
            eventInfo: {
              button: 'PRIMARY',
              hoverText: 'Click to accelerate sphere',
              callback: handleRedBoxClick,
            },
          },
        ],
      })
    }, 0.016)
  }
})

// Initialize the scene when the script loads
setupScene()

console.log('Advanced animation system loaded!')
console.log('Features: Circular motion, sine-wave height variation, interactive acceleration')
