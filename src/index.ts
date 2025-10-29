// ============================================
// Decenterland Parcela - Advanced Scene Setup
// ============================================
// Enhanced animation system with circular motion,
// sine-wave height variation, interactive controls,
// and external 3D model loading with advanced interactions
import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  Color4,
  PointerEvents,
  PointerEventType,
  Quaternion,
  GltfContainer,
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
 * - speedMultiplier: Applied when model is clicked
 * - selfRotationSpeed: Speed of self-axis rotation
 */
const ANIMATION_CONFIG = {
  sphereRadius: 4,
  sphereBaseHeight: 2,
  heightAmplitude: 1.5,
  baseSpeed: 0.02,
  speedMultiplier: 2.5,
  speedDecayFrames: 120, // Frames until speed returns to normal
  selfRotationSpeed: 0.1, // Self-axis rotation speed
}

// Color palette for sphere state changes
const COLOR_PALETTE = {
  blue: Color4.create(0, 0.5, 1, 1),
  cyan: Color4.create(0, 1, 1, 1),
  magenta: Color4.create(1, 0, 1, 1),
  yellow: Color4.create(1, 1, 0, 1),
  green: Color4.create(0, 1, 0, 1),
}

// ============================================
// Global State for Animations & Interactions
// ============================================

/** Track animation time for floating effect */
let animationTime: number = 0
/** Speed multiplier state for sphere acceleration */
let speedMultiplierActive: number = 1.0
let speedDecayCounter: number = 0
/** Store references to interactive entities */
let blueSphereEntity: any = null
let modelEntity: any = null
let wallEntity: any = null
/** Track color state for cycling through colors */
let currentColorIndex: number = 0
const colorKeys = Object.keys(COLOR_PALETTE)
/** Track if self-rotation is active */
let isSelfRotating: boolean = false

// ============================================
// Animation Functions (Modular)
// ============================================

/**
 * calculateCircularMotion: Computes position on circular path in XZ plane
 * Uses parametric equations for smooth circular motion
 * @param time - Current animation time
 * @param radius - Radius of circular path
 * @returns Object with x, z coordinates on circle
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
 * Gradually returns speed to normal after model click
 */
function updateSpeedMultiplier(): void {
  if (speedMultiplierActive > 1.0) {
    speedDecayCounter++
    if (speedDecayCounter >= ANIMATION_CONFIG.speedDecayFrames) {
      speedMultiplierActive = 1.0
      speedDecayCounter = 0
      // Stop self-rotation after speed decay completes
      isSelfRotating = false
    }
  }
}

/**
 * changeSpherColor: Cycles sphere through color palette
 * Called when model is clicked
 */
function changeSphereColor(): void {
  if (!blueSphereEntity) return
  currentColorIndex = (currentColorIndex + 1) % colorKeys.length
  const colorKey = colorKeys[currentColorIndex]
  const newColor = COLOR_PALETTE[colorKey as keyof typeof COLOR_PALETTE]
  Material.setPbrMaterial(blueSphereEntity, {
    albedoColor: newColor,
  })
  console.log(`Sphere color changed to: ${colorKey}`)
}

/**
 * animateBlueSphere: Updates blue sphere position with circular + vertical motion
 * Combines XZ circular motion with Y sine wave for complex 3D animation
 * Includes self-axis rotation when activated
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

  // Circular motion rotation in Y axis
  const circularRotationY = animationTime * ANIMATION_CONFIG.baseSpeed * speedMultiplierActive

  // Self-axis rotation when activated (roll on X axis)
  let selfRotationX = 0
  if (isSelfRotating) {
    selfRotationX = animationTime * ANIMATION_CONFIG.selfRotationSpeed
  }

  // Combine rotations: Z-axis slight tilt + X-axis self-rotation
  const tiltZ = Math.sin(animationTime * 0.01) * 10
  transform.rotation = Quaternion.fromEulerDegrees(selfRotationX, circularRotationY, tiltZ)
}

/**
 * handleModelClick: Triggered when user clicks the 3D model
 * - Accelerates sphere movement
 * - Changes sphere color
 * - Enables self-rotation
 */
function handleModelClick(): void {
  console.log('Model clicked - Accelerating sphere, changing color, and activating rotation!')
  speedMultiplierActive = ANIMATION_CONFIG.speedMultiplier
  speedDecayCounter = 0
  isSelfRotating = true
  changeSphereColor()
}

// ============================================
// Entity Creation Functions (Modular)
// ============================================

/**
 * createBlueSphere: Creates animated blue sphere
 * Initial color is blue
 */
function createBlueSphere(): void {
  blueSphereEntity = engine.addEntity()
  MeshRenderer.setBox(blueSphereEntity)
  Material.setPbrMaterial(blueSphereEntity, {
    albedoColor: COLOR_PALETTE.blue,
  })
  Transform.create(blueSphereEntity, {
    position: Vector3.create(ANIMATION_CONFIG.sphereRadius, ANIMATION_CONFIG.sphereBaseHeight, 0),
    scale: Vector3.create(0.8, 0.8, 0.8),
  })
  console.log('Blue sphere created')
}

/**
 * createModelFromGLB: Creates interactive 3D model from external .glb file
 * Replaces the previous red box with a custom 3D model
 * @param modelPath - Path to the .glb model file (e.g., 'models/my_model.glb')
 */
function createModelFromGLB(modelPath: string): void {
  modelEntity = engine.addEntity()

  // Load the external .glb model
  GltfContainer.create(modelEntity, {
    src: modelPath,
  })

  Transform.create(modelEntity, {
    position: Vector3.create(0, 1, 0),
    scale: Vector3.create(1, 1, 1),
  })

  // Add click interaction to the model
  PointerEvents.createOrReplace(modelEntity, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: 'PRIMARY',
          hoverText: 'Click to boost sphere',
          callback: handleModelClick,
        },
      },
    ],
  })

  console.log(`3D model loaded from: ${modelPath}`)
}

/**
 * createWall: Creates background wall for scene context
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
  console.log('Background wall created')
}

// ============================================
// Scene Setup
// ============================================

/**
 * setupScene: Initializes all scene entities
 * Creates modular structure for easy maintenance
 * @param modelPath - Path to the 3D model .glb file
 */
function setupScene(modelPath: string = 'models/interactive_model.glb'): void {
  console.log('Setting up enhanced animation scene with external model...')
  createBlueSphere()
  createModelFromGLB(modelPath)
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
// Initialization
// ============================================

/**
 * Initialize the scene when the script loads
 * Update the modelPath parameter if your model is located elsewhere
 */
setupScene('models/interactive_model.glb')
console.log('Advanced animation system loaded!')
console.log('Features: Circular motion, sine-wave height variation, color cycling, self-rotation, and external model integration')
