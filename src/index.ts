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
 * setupScene: Creates and configures scene entities
 * This function is designed to scale easily for adding multiple entities
 * in the future (walls, decorations, interactive objects, etc.)
 */
function setupScene(): void {
  // Create the main box entity
  const box = createStyledBox()
}

/**
 * createStyledBox: Creates a styled box with custom color and scale
 * Returns the created entity ID
 */
function createStyledBox() {
  // Create a new entity
  const box = engine.addEntity()
  
  // Configure Transform: Position and Scale
  Transform.create(box, {
    position: Vector3.create(8, 1, 8),
    scale: Vector3.create(2, 2, 2)  // Escala 2x en todos los ejes
  })
  
  // Configure Mesh Renderer: Box geometry
  MeshRenderer.setBox(box)
  
  // Configure Material: Custom color (cyan/turquoise)
  const material = Material.getPbrMaterial(box)
  material.albedoColor = Color4.create(0, 1, 1, 1)  // Cyan color
  
  return box
}

// ============================================
// Main Execution
// ============================================

/**
 * main: Entry point for the scene initialization
 */
export function main(): void {
  setupScene()
}
