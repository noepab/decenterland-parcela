import { engine, Transform, MeshRenderer, Material, AudioSource, pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'
import { Vector3, Color4, Quaternion, Color3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { emissiveWhiteMaterial, aluminumMaterial } from './materials'
import * as ui from '@dcl/sdk/ui' // FIX: Import ui from @dcl/sdk/ui

export function createAGPSign() {
  const sign = engine.addEntity()
  Transform.create(sign, {
    position: Vector3.create(8, 8, 0.2),
    scale: Vector3.create(6, 1.5, 0.2)
  })
  MeshRenderer.setBox(sign)
  Material.setPbrMaterial(sign, emissiveWhiteMaterial)

  AudioSource.create(sign, {
    audioClipUrl: 'sounds/agp-sign-on.wav', // FIX: audioClipUrl
    volume: 0.4
  })

  console.log("🔆 Letrero AGP creado")
}

export function createGallery() {
  const artworks = [
    { 
      pos: Vector3.create(5, 13, 15.8), 
      rot: Quaternion.fromEulerDegrees(0, 0, 0), 
      title: "Nebulosa Cósmica", 
      url: "https://picsum.photos/seed/nebula/512/512" 
    },
    { 
      pos: Vector3.create(11, 13, 15.8), 
      rot: Quaternion.fromEulerDegrees(0, 0, 0), 
      title: "Ciudad Futurista", 
      url: "https://picsum.photos/seed/city/512/512" 
    },
    { 
      pos: Vector3.create(0.2, 13, 10), 
      rot: Quaternion.fromEulerDegrees(0, 90, 0), 
      title: "Bosque Alienígena", 
      url: "https://picsum.photos/seed/forest/512/512" 
    },
    { 
      pos: Vector3.create(15.8, 13, 10), 
      rot: Quaternion.fromEulerDegrees(0, -90, 0), 
      title: "Océano de Silicio", 
      url: "https://picsum.photos/seed/ocean/512/512" 
    }
  ]
  
  artworks.forEach(artwork => {
    const frame = engine.addEntity()
    Transform.create(frame, {
      position: artwork.pos,
      rotation: artwork.rot,
      scale: Vector3.create(2.5, 2.5, 0.1)
    })
    MeshRenderer.setPlane(frame)

    Material.setPbrMaterial(frame, {
        texture: { src: artwork.url }, // FIX: direct src
        emissiveTexture: { src: artwork.url }, // FIX: direct src
        emissiveIntensity: 0.4,
        emissiveColor: Color3.White(),
        roughness: 1.0
    })

    pointerEventsSystem.onPointerDown(
      { entity: frame, opts: { button: InputAction.IA_PRIMARY, hoverText: `Ver "${artwork.title}"` } },
      () => {
        ui.displayAnnouncement(artwork.title, { duration: 3, color: Color4.White(), fontSize: 16 }) // FIX: ui.displayAnnouncement
      }
    )
  })
  
  const snackBar = engine.addEntity()
  Transform.create(snackBar, {
    position: Vector3.create(8, 13, 8),
    scale: Vector3.create(4, 1, 2)
  })
  MeshRenderer.setBox(snackBar)
  Material.setPbrMaterial(snackBar, aluminumMaterial)

  const items = [
    { name: 'Bebida Energética', pos: Vector3.create(-1, 0.7, 0), message: '¡Recargando energía!', color: Color4.Green() },
    { name: 'Café Espacial', pos: Vector3.create(0, 0.7, 0), message: '¡Café listo!', color: Color4.fromHexString("#8B4513") },
    { name: 'Snack Proteico', pos: Vector3.create(1, 0.7, 0), message: '¡A disfrutar tu snack!', color: Color4.Blue() }
  ]

  items.forEach(item => {
    const itemEntity = engine.addEntity()
    Transform.create(itemEntity, {
      position: item.pos,
      scale: Vector3.create(0.3, 0.6, 0.3),
      parent: snackBar
    })
    MeshRenderer.setCylinder(itemEntity, 0.5) // FIX: setCylinder takes number
    
    Material.setPbrMaterial(itemEntity, {
        baseColor: item.color,
        metallic: 0.8,
        roughness: 0.4
    })

    pointerEventsSystem.onPointerDown(
      { entity: itemEntity, opts: { button: InputAction.IA_PRIMARY, hoverText: `Tomar ${item.name}` } },
      () => {
        ui.displayAnnouncement(item.message, { duration: 2, color: Color4.White(), fontSize: 14 }) // FIX: ui.displayAnnouncement
      }
    )
  })
  
  console.log("🎨 Galería de arte interactiva y snack-bar creados")
}