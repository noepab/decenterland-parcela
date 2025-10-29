// ============================================
// Decenterland Parcela - Enhanced Scene Setup
// ============================================
// Imports - Organized by source
import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  Color4
} from '@dcl/sdk/ecs'
import {
  Vector3
} from '@dcl/sdk/math'

// ============================================
// Scene Configuration
// ============================================

/**
 * setupScene: Creates and configures all scene entities
 * This function orchestrates entity creation in a modular way
 * Future: walls, decorations, interactive objects, etc.
 */
function setupScene(): void {
  // Create floor base
  createFloor()
  
  // Create main decorative box
  createStyledBox()
  
  // Create warm-colored decorative sphere (light source)
  createDecorativeSphere()
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
 */
function createStyledBox(): void {
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
}

/**
 * createDecorativeSphere: Creates a warm-colored decorative sphere (light effect)
 * Positioned next to the box with warm orange-yellow tones
 * Acts as a secondary visual accent
 */
function createDecorativeSphere(): void {
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
