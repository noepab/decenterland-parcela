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
  PointerEventType
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
let isCyanColor: boolean = true
const originalBoxScale = Vector3.create(2, 2, 2)

// ============================================
// Scene Configuration
// ============================================

/**
 * setupScene: Creates and configures all scene entities
 * This function orchestrates entity creation in a modular way
 * Includes: floor, walls, box, sphere, welcome text
 */
function setupScene(): void {
  // Create floor base
  createFloor()
  
  // Create main decorative box
  boxEntity = createStyledBox()
  
  // Create warm-colored decorative sphere (light source) with animation
  createDecorativeSphere()
  
  // Create wall behind the box
  createWall()
  
  // Create welcome text message
  createWelcomeText()
  
  // Setup animation system
  setupAnimationSystem()
}

/**
 * createFloor: Creates a large base plane (floor) with neutral grey color
 * Provides visual foundation for the scene
 */
function createFloor(): void {
  // Create a new entity for the floor
  const floor = engine.addEntity()
  
  // Configure Transform: Position and Scale
  Transform.create(floor, {
    position: Vector3.create(8, 0, 8),
    scale: Vector3.create(16, 0.2, 16)  // Wide, flat base plane
  })
  
  // Configure Mesh Renderer: Box geometry (scaled flat acts as floor)
  MeshRenderer.setBox(floor)
  
  // Configure Material: Neutral grey for floor
  const floorMaterial = Material.getPbrMaterial(floor)
  floorMaterial.albedoColor = Color4.create(0.3, 0.3, 0.3, 1)  // Neutral grey
}

/**
 * createStyledBox: Creates a styled cyan box with custom color and scale
 * This is the main focal point of the scene
 * Includes click interaction for color and scale toggling
 */
function createStyledBox(): any {
  // Create a new entity for the box
  const box = engine.addEntity()
  
  // Configure Transform: Position and Scale
  Transform.create(box, {
    position: Vector3.create(8, 1, 8),
    scale: Vector3.create(2, 2, 2)  // Scale 2x on all axes
  })
  
  // Configure Mesh Renderer: Box geometry
  MeshRenderer.setBox(box)
  
  // Configure Material: Vibrant cyan/turquoise with high metallic finish
  const boxMaterial = Material.getPbrMaterial(box)
  boxMaterial.albedoColor = Color4.create(0, 1, 1, 1)  // Cyan color
  boxMaterial.metallic = 0.8  // High metallic for shine
  boxMaterial.roughness = 0.2  // Low roughness for glossy finish
  
  // Add pointer events for click interaction
  PointerEvents.create(box, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: 'ANY',
          hoverText: '✨ Click to toggle color & scale'
        }
      }
    ]
  })
  
  return box
}

/**
 * toggleBoxColor: Toggles the box color between cyan and magenta
 * Also slightly adjusts the scale for visual feedback
 */
function toggleBoxColor(box: any): void {
  const boxMaterial = Material.getPbrMaterial(box)
  const currentTransform = Transform.get(box)
  
  if (isCyanColor) {
    // Switch to magenta
    boxMaterial.albedoColor = Color4.create(1, 0, 1, 1)  // Magenta
    // Slightly increase scale
    Transform.mutate(box, {
      scale: Vector3.create(2.3, 2.3, 2.3)
    })
  } else {
    // Switch back to cyan
    boxMaterial.albedoColor = Color4.create(0, 1, 1, 1)  // Cyan
    // Return to original scale
    Transform.mutate(box, {
      scale: Vector3.create(2, 2, 2)
    })
  }
  
  isCyanColor = !isCyanColor
}

/**
 * createDecorativeSphere: Creates a warm-colored decorative sphere (light effect)
 * Positioned next to the box with warm orange-yellow tones
 * Acts as a secondary visual accent with floating animation
 */
function createDecorativeSphere(): any {
  // Create a new entity for the sphere
  const sphere = engine.addEntity()
  
  // Configure Transform: Position to the side of the box with smaller scale
  Transform.create(sphere, {
    position: Vector3.create(11, 2, 8),  // Offset to the right and elevated
    scale: Vector3.create(1.2, 1.2, 1.2)  // Smaller than box for accent
  })
  
  // Configure Mesh Renderer: Sphere geometry
  MeshRenderer.setSphere(sphere)
  
  // Configure Material: Warm color (orange-yellow) with emissive glow effect
  const sphereMaterial = Material.getPbrMaterial(sphere)
  sphereMaterial.albedoColor = Color4.create(1, 0.6, 0.2, 1)  // Warm orange-yellow
  sphereMaterial.metallic = 0.6  // Medium metallic for reflectivity
  sphereMaterial.roughness = 0.3  // Medium roughness for diffused light feel
  sphereMaterial.emissiveColor = Color4.create(1, 0.4, 0.1, 1)  // Warm emissive glow
  sphereMaterial.emissiveIntensity = 0.5  // Moderate glow intensity
  
  return sphere
}

/**
 * createWall: Creates a simple wall behind the main box
 * Serves as a backdrop and visual anchor
 */
function createWall(): void {
  // Create a new entity for the wall
  const wall = engine.addEntity()
  
  // Configure Transform: Position behind the box
  Transform.create(wall, {
    position: Vector3.create(8, 2, 4),  // Behind and centered with box
    scale: Vector3.create(6, 4, 0.3)  // Wide, tall, thin (wall-like)
  })
  
  // Configure Mesh Renderer: Box geometry (scaled thin acts as wall)
  MeshRenderer.setBox(wall)
  
  // Configure Material: Subtle dark color as backdrop
  const wallMaterial = Material.getPbrMaterial(wall)
  wallMaterial.albedoColor = Color4.create(0.15, 0.15, 0.2, 1)  // Dark slate color
  wallMaterial.metallic = 0.3  // Low metallic
  wallMaterial.roughness = 0.8  // High roughness for matte finish
}

/**
 * createWelcomeText: Creates a welcome message entity
 * Displays a text mesh with a welcome message
 * Note: Uses a simple scaled box as visual placeholder for welcome area
 */
function createWelcomeText(): void {
  // Create a new entity for the welcome text
  const welcomeText = engine.addEntity()
  
  // Configure Transform: Position above the scene
  Transform.create(welcomeText, {
    position: Vector3.create(8, 3.5, 8),  // Elevated and centered
    scale: Vector3.create(1, 1, 1)  // Standard scale for visibility
  })
  
  // Configure Mesh Renderer: Create as box placeholder (text not directly available)
  // In a real scenario with TextShape component, this would display the text
  MeshRenderer.setBox(welcomeText)
  
  // Configure Material: Light color for text visibility
  const textMaterial = Material.getPbrMaterial(welcomeText)
  textMaterial.albedoColor = Color4.create(1, 1, 0.8, 1)  // Light yellow/cream
  textMaterial.emissiveColor = Color4.create(0.8, 0.8, 0.6, 1)  // Subtle emissive glow
  textMaterial.emissiveIntensity = 0.3
}

/**
 * setupAnimationSystem: Sets up the animation loop for all animated entities
 * Handles floating sphere animation and click interactions
 */
function setupAnimationSystem(): void {
  // Use a frame update system for continuous animation
  engine.addSystem((dt: number) => {
    animationTime += dt
    
    // Animate floating sphere
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
