// ============================================
// Decenterland Parcela - Enhanced Scene Setup
// ============================================
// Imports - Organized by source
import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  Color4,
  PointerEvents,
  PointerEventType,
  Quaternion
} from '@dcl/sdk/ecs'
import {
  Vector3
} from '@dcl/sdk/math'

// ============================================
// Global State for Animations & Interactions
// ============================================
// Track animation time for floating effect
let animationTime: number = 0
// Store references to interactive entities
let boxEntity: any = null
let wallEntity: any = null
let welcomeTextEntity: any = null
let isCyanColor: boolean = true
const originalBoxScale = Vector3.create(2, 2, 2)

// ============================================
// Scene Configuration
// ============================================
/**
 * setupScene: Creates and configures all scene entities
 * This function orchestrates entity creation in a modular way
 * Includes: floor, walls, box, spheres, welcome text, and new entities
 */
function setupScene(): void {
  // Create floor base
  createFloor()
  
  // Create main decorative box
  boxEntity = createStyledBox()
  
  // Create warm-colored decorative sphere (light source) with animation
  createDecorativeSphere()
  
  // Create wall behind the box (with rotation effect)
  wallEntity = createWall()
  
  // Create welcome text message (with pulse effect)
  welcomeTextEntity = createWelcomeText()
  
  // Create additional entities: floating blue sphere
  createFloatingBlueSphere()
  
  // Create small red box at other end of floor
  createRedBox()
  
  // Setup animation system
  setupAnimationSystem()
}

/**
 * createFloor: Creates a large base plane (floor) with neutral grey color
 * Provides a solid foundation for the scene
 */
function createFloor(): void {
  const floor = engine.addEntity()
  Transform.create(floor, {
    position: Vector3.create(8, 0, 8),
    scale: Vector3.create(16, 0.5, 16)
  })
  MeshRenderer.setBox(floor)
  const floorMaterial = Material.getPbrMaterial(floor)
  floorMaterial.albedoColor = Color4.create(0.6, 0.6, 0.6, 1) // Grey
  floorMaterial.metallic = 0.1
  floorMaterial.roughness = 0.8
}

/**
 * createStyledBox: Creates a cyan/magenta toggle-able decorative box
 * Responds to pointer down events to toggle color
 */
function createStyledBox(): any {
  const box = engine.addEntity()
  Transform.create(box, {
    position: Vector3.create(8, 1, 8),
    scale: originalBoxScale
  })
  MeshRenderer.setBox(box)
  const boxMaterial = Material.getPbrMaterial(box)
  boxMaterial.albedoColor = Color4.create(0, 1, 1, 1) // Cyan
  boxMaterial.metallic = 0.6
  boxMaterial.roughness = 0.4
  
  // Add pointer events for interactivity
  PointerEvents.create(box, {
    pointerEvents: [{
      eventType: PointerEventType.PET_DOWN,
      eventInfo: {}
    }]
  })
  
  return box
}

/**
 * toggleBoxColor: Toggles the box between cyan and magenta colors
 */
function toggleBoxColor(boxToToggle: any): void {
  const boxMaterial = Material.getPbrMaterial(boxToToggle)
  if (isCyanColor) {
    boxMaterial.albedoColor = Color4.create(1, 0, 1, 1) // Magenta
  } else {
    boxMaterial.albedoColor = Color4.create(0, 1, 1, 1) // Cyan
  }
  isCyanColor = !isCyanColor
}

/**
 * createDecorativeSphere: Creates a warm-colored sphere with animation
 * Positioned at corner and floats smoothly
 */
function createDecorativeSphere(): void {
  const sphere = engine.addEntity()
  Transform.create(sphere, {
    position: Vector3.create(11, 2, 8),
    scale: Vector3.create(1.5, 1.5, 1.5)
  })
  MeshRenderer.setSphere(sphere)
  const sphereMaterial = Material.getPbrMaterial(sphere)
  sphereMaterial.albedoColor = Color4.create(1, 0.7, 0.5, 1) // Warm orange
  sphereMaterial.metallic = 0.3
  sphereMaterial.roughness = 0.5
  sphereMaterial.emissiveColor = Color4.create(1, 0.5, 0.2, 1)
  sphereMaterial.emissiveIntensity = 0.2
}

/**
 * createFloatingBlueSphere: Creates a blue sphere floating in a corner
 * NEW: Additional entity for visual interest
 */
function createFloatingBlueSphere(): void {
  const blueSphere = engine.addEntity()
  Transform.create(blueSphere, {
    position: Vector3.create(3, 3, 13), // Corner position with height
    scale: Vector3.create(1.2, 1.2, 1.2)
  })
  MeshRenderer.setSphere(blueSphere)
  const blueMaterial = Material.getPbrMaterial(blueSphere)
  blueMaterial.albedoColor = Color4.create(0.2, 0.5, 1, 1) // Blue
  blueMaterial.metallic = 0.4
  blueMaterial.roughness = 0.4
  blueMaterial.emissiveColor = Color4.create(0.3, 0.6, 1, 1)
  blueMaterial.emissiveIntensity = 0.3
}

/**
 * createRedBox: Creates a small red box at the other end of the floor
 * NEW: Additional entity for balanced composition
 */
function createRedBox(): void {
  const redBox = engine.addEntity()
  Transform.create(redBox, {
    position: Vector3.create(13, 0.5, 3), // Opposite corner at floor level
    scale: Vector3.create(1, 1, 1) // Small size
  })
  MeshRenderer.setBox(redBox)
  const redMaterial = Material.getPbrMaterial(redBox)
  redMaterial.albedoColor = Color4.create(1, 0.2, 0.2, 1) // Red
  redMaterial.metallic = 0.3
  redMaterial.roughness = 0.6
  redMaterial.emissiveColor = Color4.create(1, 0, 0, 1)
  redMaterial.emissiveIntensity = 0.2
}

/**
 * createWall: Creates a decorative wall behind the box
 * MODIFIED: Now rotates continuously on Y axis
 */
function createWall(): any {
  const wall = engine.addEntity()
  Transform.create(wall, {
    position: Vector3.create(8, 1, 4),
    scale: Vector3.create(10, 2, 0.5),
    rotation: Quaternion.identity()
  })
  MeshRenderer.setBox(wall)
  const wallMaterial = Material.getPbrMaterial(wall)
  wallMaterial.albedoColor = Color4.create(0.9, 0.9, 0.9, 1) // Light grey
  wallMaterial.metallic = 0.2
  wallMaterial.roughness = 0.7
  
  return wall
}

/**
 * createWelcomeText: Creates a welcome message box
 * MODIFIED: Now has pulse/heartbeat scale effect
 */
function createWelcomeText(): any {
  const welcomeText = engine.addEntity()
  Transform.create(welcomeText, {
    position: Vector3.create(8, 3.5, 8),
    scale: Vector3.create(2, 1, 0.5)
  })
  
  // Configure Mesh Renderer: Create as box placeholder (text not directly available)
  // In a real scenario with TextShape component, this would display the text
  MeshRenderer.setBox(welcomeText)
  
  // Configure Material: Light color for text visibility
  const textMaterial = Material.getPbrMaterial(welcomeText)
  textMaterial.albedoColor = Color4.create(1, 1, 0.8, 1) // Light yellow/cream
  textMaterial.emissiveColor = Color4.create(0.8, 0.8, 0.6, 1) // Subtle emissive glow
  textMaterial.emissiveIntensity = 0.3
  
  return welcomeText
}

/**
 * applyWallRotation: Applies continuous rotation to the wall around Y axis
 * Called from animation system each frame
 */
function applyWallRotation(wall: any, deltaTime: number): void {
  if (!wall) return
  
  const currentTransform = Transform.get(wall)
  // Slow continuous rotation: 30 degrees per second around Y axis
  const rotationSpeed = 30 * (Math.PI / 180) // Convert to radians
  
  // Create rotation quaternion around Y axis
  const angle = (animationTime * rotationSpeed) * 0.5 // Gentle speed
  const rotationQuat = Quaternion.fromAxisAngle(
    Vector3.create(0, 1, 0), // Y axis
    angle
  )
  
  Transform.mutate(wall, {
    rotation: rotationQuat
  })
}

/**
 * applyWelcomeTextPulse: Applies heartbeat pulse to welcome text scale
 * Called from animation system each frame
 */
function applyWelcomeTextPulse(welcomeText: any, deltaTime: number): void {
  if (!welcomeText) return
  
  const currentTransform = Transform.get(welcomeText)
  // Pulse effect using sine wave for smooth heartbeat
  // Oscillates between 0.8 and 1.2 of original scale
  const pulseAmount = Math.sin(animationTime * 3) * 0.2 + 1.0 // Range: 0.8 - 1.2
  const baseScale = Vector3.create(2, 1, 0.5)
  
  const pulsingScale = Vector3.create(
    baseScale.x * pulseAmount,
    baseScale.y * pulseAmount,
    baseScale.z * pulseAmount
  )
  
  Transform.mutate(welcomeText, {
    scale: pulsingScale
  })
}

/**
 * setupAnimationSystem: Sets up the animation loop for all animated entities
 * Handles: wall rotation, welcome text pulse, floating sphere, and click interactions
 */
function setupAnimationSystem(): void {
  // Use a frame update system for continuous animation
  engine.addSystem((dt: number) => {
    animationTime += dt
    
    // Apply wall rotation effect
    if (wallEntity) {
      applyWallRotation(wallEntity, dt)
    }
    
    // Apply welcome text pulse effect
    if (welcomeTextEntity) {
      applyWelcomeTextPulse(welcomeTextEntity, dt)
    }
    
    // Animate floating sphere (original sphere)
    const sphere = engine.getEntityOrNull(2)  // Sphere entity ID (typically 2)
    if (sphere) {
      const currentTransform = Transform.get(sphere)
      // Calculate vertical float using sine wave
      const floatHeight = Math.sin(animationTime * 1.5) * 0.5  // Amplitude: 0.5, Speed: 1.5x
      Transform.mutate(sphere, {
        position: Vector3.create(
          11,
          2 + floatHeight,  // Original Y + sine wave
          8
        )
      })
    }
    
    // Handle box click interactions
    if (boxEntity) {
      const events = PointerEvents.get(boxEntity)?.pointerEvents || []
      for (const event of events) {
        if (event.eventType === PointerEventType.PET_DOWN) {
          toggleBoxColor(boxEntity)
        }
      }
    }
  })
}

// ============================================
// Main Execution
// ============================================
/**
 * main: Entry point for the scene initialization
 * Exports the main function to be called by the SDK
 */
export function main(): void {
  setupScene()
}
