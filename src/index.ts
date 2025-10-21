import { engine, Transform, MeshRenderer } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export function main() {
  // Create a box
  const box = engine.addEntity()
  Transform.create(box, {
    position: Vector3.create(8, 1, 8)
  })
  MeshRenderer.setBox(box)
}
