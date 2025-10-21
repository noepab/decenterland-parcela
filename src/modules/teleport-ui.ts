
import { engine, Transform, MeshRenderer, Material, pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'

// Definimos los pisos y sus coordenadas de destino
const floors = [
  { name: "PB (Recepción)", position: Vector3.create(10, 1, 8) },
  { name: "Piso 1 (Oficinas)", position: Vector3.create(10, 5, 8) },
  { name: "Piso 2 (Oficinas)", position: Vector3.create(10, 9, 8) },
  { name: "Piso 3 (Galería)", position: Vector3.create(10, 13, 8) },
  { name: "Azotea (Drone)", position: Vector3.create(10, 17, 8) }
]

// Color para los botones
const buttonMaterial = Material.create(engine.addEntity(), {
  material: {
    $case: 'pbr',
    pbr: {
      albedoColor: Color4.fromHexString("#3498db"),
      metallic: 0.8,
      roughness: 0.3
    }
  }
})

export function createTeleportUI() {
  const panel = engine.addEntity()
  Transform.create(panel, {
    position: Vector3.create(7, 1.5, 6.5), // Posición del panel en la recepción
    scale: Vector3.create(1.5, 1, 0.1)
  })
  MeshRenderer.setBox(panel)
  Material.setPbrMaterial(panel, {
    albedoColor: Color4.fromHexString("#2c3e50"),
    metallic: 0.5,
    roughness: 0.5
  })

  // Crear un botón para cada piso
  floors.forEach((floor, index) => {
    const button = engine.addEntity()
    const yOffset = 0.4 - (index * 0.2)

    Transform.create(button, {
      position: Vector3.create(0, yOffset, -0.6),
      scale: Vector3.create(0.8, 0.15, 0.5),
      parent: panel
    })

    MeshRenderer.setBox(button)
    Material.setPbrMaterial(button, {
        albedoColor: Color4.fromHexString("#3498db"),
        metallic: 0.8,
        roughness: 0.3
    })

    pointerEventsSystem.onPointerDown(
      { entity: button, opts: { button: InputAction.IA_PRIMARY, hoverText: `Ir a ${floor.name}` } },
      () => {
        console.log(`Teletransportando a ${floor.name}`)
        movePlayerTo({
          newRelativePosition: floor.position
        })
      }
    )

    // Etiqueta para el botón
    const label = engine.addEntity()
    Transform.create(label, {
        position: Vector3.create(0, 0, -0.3),
        parent: button
    })
    
    // ui.createComponent(ui.UIText, { value: floor.name, fontSize: 2, parent: button }) // No se puede añadir texto a una entidad 3D directamente
    // En su lugar, crearemos una entidad de texto
    const textEntity = engine.addEntity()
    Transform.create(textEntity, {
        position: Vector3.create(0, 0, -0.3),
        scale: Vector3.create(0.1, 0.1, 0.1),
        parent: button
    })
    
    // Nota: El SDK7 no tiene un componente de texto 3D nativo y fácil de usar como el SDK6.
    // La forma correcta sería usar un modelo 3D para cada letra o una textura con el texto.
    // Por simplicidad, este ejemplo no mostrará el texto en los botones, pero la funcionalidad existe.
    // El hoverText cumple la función de identificar el botón.
  })

  console.log("✅ Panel de Teletransporte Rápido creado en la recepción.")
}
