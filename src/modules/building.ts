import { engine, Transform, MeshRenderer, Material, pointerEventsSystem, InputAction, Schemas, GltfContainer } from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { glassMaterial, aluminumMaterial } from './materials'

const DoorState = engine.defineComponent('doorState', {
  isOpen: Schemas.Boolean
})

export function createBuilding() {
  const buildingEntity = engine.addEntity()
  Transform.create(buildingEntity, {
    position: Vector3.create(8, 10, 8),
    scale: Vector3.create(16, 20, 16) 
  })
  GltfContainer.create(buildingEntity, {
    src: 'https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/Box/glTF-Binary/Box.glb'
  })
  console.log("🏢 Edificio cargado desde un modelo .glb de ejemplo.")
}

export function createOffices() {
    const offices = [
    { pos: [5, 5, 2], name: "Oficina 1" },
    { pos: [11, 5, 2], name: "Oficina 2" },
    { pos: [8, 9, 2], name: "Oficina 3" }
  ]
  
  offices.forEach((office, index) => {
    const officeWall = engine.addEntity()
    Transform.create(officeWall, {
      position: Vector3.create(office.pos[0], office.pos[1], office.pos[2]),
      scale: Vector3.create(3, 3, 0.2)
    })
    MeshRenderer.setBox(officeWall)
    Material.setPbrMaterial(officeWall, aluminumMaterial)
    
    const doorPivot = engine.addEntity()
    Transform.create(doorPivot, {
      position: Vector3.create(office.pos[0] - 1.5, office.pos[1], office.pos[2]),
    })
    const door = engine.addEntity()
    Transform.create(door, {
      position: Vector3.create(0.5, 0, 0),
      scale: Vector3.create(1, 2, 0.05),
      parent: doorPivot
    })
    MeshRenderer.setBox(door)
    Material.setPbrMaterial(door, glassMaterial)
    DoorState.create(door, { isOpen: false })

    pointerEventsSystem.onPointerDown(
      { entity: door, opts: { button: InputAction.IA_PRIMARY, hoverText: 'Abrir / Cerrar' } },
      () => {
        const state = DoorState.getMutable(door)
        const isOpen = state.isOpen
        const targetRotation = isOpen ? Quaternion.fromEulerDegrees(0, 0, 0) : Quaternion.fromEulerDegrees(0, -90, 0)
        utils.tweens.startRotation(
          doorPivot,
          Transform.get(doorPivot).rotation,
          targetRotation,
          0.5,
          utils.InterpolationType.EASEOUTQUAD
        )
        state.isOpen = !isOpen
      }
    )

    const screen = engine.addEntity()
    Transform.create(screen, {
        position: Vector3.create(office.pos[0], office.pos[1], office.pos[2] + 0.01),
        scale: Vector3.create(2.5, 1.5, 0.1),
    })
    MeshRenderer.setPlane(screen)

    const imageUrl = `https://picsum.photos/seed/office${index}/800/450`

    Material.setPbrMaterial(screen, {
        texture: { src: imageUrl },
        emissiveTexture: { src: imageUrl },
        emissiveIntensity: 0.7,
        emissiveColor: Color3.White(),
        roughness: 1.0
    })
  })
  
  console.log("💼 3 oficinas con puertas y pantallas interactivas creadas")
}
