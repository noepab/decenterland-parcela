import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  AudioSource,
  pointerEventsSystem,
  InputAction,
  Entity
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color3, Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'

// === MATERIALES GLOBALES ===
const glassMaterial = {
  material: {
    $case: 'pbr' as const,
    pbr: {
      baseColor: Color4.create(0.2, 0.8, 1, 0.3),
      emissiveColor: Color3.create(0, 0.4, 0.6),
      emissiveIntensity: 0.5,
      metallic: 0.1,
      roughness: 0.1,
      alphaTest: 0.5
    }
  }
}

const aluminumMaterial = {
  material: {
    $case: 'pbr' as const,
    pbr: {
      baseColor: Color4.create(0.8, 0.8, 0.9, 1),
      metallic: 0.9,
      roughness: 0.2
    }
  }
}

const emissiveWhiteMaterial = {
  material: {
    $case: 'pbr' as const,
    pbr: {
      baseColor: Color4.create(1, 1, 1, 1),
      emissiveColor: Color3.create(1, 1, 1),
      emissiveIntensity: 2.0
    }
  }
}

// === EDIFICIO PRINCIPAL ===
function createBuilding() {
  const floors = [1, 5, 9, 13, 17] // Alturas de cada piso
  
  floors.forEach((height, index) => {
    // Piso
    const floor = engine.addEntity()
    Transform.create(floor, {
      position: Vector3.create(8, height, 8),
      scale: Vector3.create(16, 0.2, 16)
    })
    MeshRenderer.setBox(floor)
    Material.setMaterial(floor, aluminumMaterial)
    
    // Paredes de vidrio
    const walls = [
      { pos: [0, height + 2, 8], scale: [0.2, 4, 16] }, // Izquierda
      { pos: [16, height + 2, 8], scale: [0.2, 4, 16] }, // Derecha  
      { pos: [8, height + 2, 0], scale: [16, 4, 0.2] }, // Frente
      { pos: [8, height + 2, 16], scale: [16, 4, 0.2] } // Atrás
    ]
    
    walls.forEach(wall => {
      const wallEntity = engine.addEntity()
      Transform.create(wallEntity, {
        position: Vector3.create(wall.pos[0], wall.pos[1], wall.pos[2]),
        scale: Vector3.create(wall.scale[0], wall.scale[1], wall.scale[2])
      })
      MeshRenderer.setBox(wallEntity)
      Material.setMaterial(wallEntity, glassMaterial)
    })
  })
  
  console.log("Edificio de 5 pisos creado")
}

// === LETRERO AGP ===
function createAGPSign() {
  const sign = engine.addEntity()
  Transform.create(sign, {
    position: Vector3.create(8, 8, 0.2),
    scale: Vector3.create(6, 1.5, 0.2)
  })
  MeshRenderer.setBox(sign)
  Material.setMaterial(sign, emissiveWhiteMaterial)
  
  // Sonido de encendido
  AudioSource.create(sign, {
    audioClip: { url: 'sounds/agp-sign-on.wav' },
    volume: 0.4
  })
  
  console.log("Letrero AGP creado")
}

// === RECEPCIONISTA ===
function createReceptionist() {
  const receptionist = engine.addEntity()
  Transform.create(receptionist, {
    position: Vector3.create(5, 2, 5),
    scale: Vector3.create(0.8, 2, 0.8)
  })
  MeshRenderer.setCylinder(receptionist)
  Material.setMaterial(receptionist, aluminumMaterial)
  
  // Interacción
  pointerEventsSystem.onPointerDown(
    { entity: receptionist, opts: { button: InputAction.IA_PRIMARY, hoverText: 'Hablar con recepcionista' } },
    () => {
      console.log("Interacción con recepcionista")
      
      // Reproducir voz
      AudioSource.createOrReplace(receptionist, {
        audioClip: { url: 'sounds/reception-voice.wav' },
        volume: 0.7
      })
      
      // Mensaje de bienvenida
      console.log("Bienvenidos a AutoGestionPro
Puedo ayudarle en algo?")
    }
  )
  
  console.log("Recepcionista interactivo creado")
}

// === DRONE ===
function createDrone() {
  const drone = engine.addEntity()
  Transform.create(drone, {
    position: Vector3.create(8, 21, 8),
    scale: Vector3.create(2, 0.5, 1)
  })
  MeshRenderer.setBox(drone)
  Material.setMaterial(drone, aluminumMaterial)
  
  // Hélices
  const propeller1 = engine.addEntity()
  Transform.create(propeller1, {
    position: Vector3.create(7, 21.5, 8),
    scale: Vector3.create(0.1, 0.1, 1),
    parent: drone
  })
  MeshRenderer.setBox(propeller1)
  
  const propeller2 = engine.addEntity()
  Transform.create(propeller2, {
    position: Vector3.create(9, 21.5, 8),
    scale: Vector3.create(0.1, 0.1, 1),
    parent: drone
  })
  MeshRenderer.setBox(propeller2)
  
  // Animación de vuelo circular
  utils.perpetualMotions.startRotation(drone, Vector3.create(0, 1, 0), 30)
  utils.perpetualMotions.startRotation(propeller1, Vector3.create(0, 1, 0), 360)
  utils.perpetualMotions.startRotation(propeller2, Vector3.create(0, 1, 0), -360)
  
  // Sonido de hélices
  AudioSource.create(drone, {
    audioClip: { url: 'sounds/drone-helices.wav' },
    loop: true,
    volume: 0.3
  })
  
  console.log("Drone biplaza animado creado")
}

// === OFICINAS ===
function createOffices() {
  const offices = [
    { pos: [5, 5, 2], name: "Oficina 1" },
    { pos: [11, 5, 2], name: "Oficina 2" },
    { pos: [8, 9, 2], name: "Oficina 3" }
  ]
  
  offices.forEach(office => {
    const officeEntity = engine.addEntity()
    Transform.create(officeEntity, {
      position: Vector3.create(office.pos[0], office.pos[1], office.pos[2]),
      scale: Vector3.create(3, 3, 0.2)
    })
    MeshRenderer.setBox(officeEntity)
    Material.setMaterial(officeEntity, aluminumMaterial)
    
    // Puerta visual
    const door = engine.addEntity()
    Transform.create(door, {
      position: Vector3.create(office.pos[0], office.pos[1] - 1, office.pos[2] - 0.1),
      scale: Vector3.create(1, 2, 0.1)
    })
    MeshRenderer.setBox(door)
    Material.setMaterial(door, glassMaterial)
  })
  
  console.log("3 oficinas creadas")
}

// === GALERÍA DE ARTE ===
function createGallery() {
  // Cuadros
  const artworks = [
    { pos: [5, 13, 15.9] },
    { pos: [11, 13, 15.9] },
    { pos: [0.1, 13, 10] },
    { pos: [15.9, 13, 10] }
  ]
  
  artworks.forEach((artwork, index) => {
    const frame = engine.addEntity()
    Transform.create(frame, {
      position: Vector3.create(artwork.pos[0], artwork.pos[1], artwork.pos[2]),
      scale: Vector3.create(2, 2, 0.1)
    })
    MeshRenderer.setPlane(frame)
    Material.setMaterial(frame, emissiveWhiteMaterial)
  })
  
  // Snack-bar
  const snackBar = engine.addEntity()
  Transform.create(snackBar, {
    position: Vector3.create(8, 13, 8),
    scale: Vector3.create(4, 1, 2)
  })
  MeshRenderer.setBox(snackBar)
  Material.setMaterial(snackBar, aluminumMaterial)
  
  // Música ambiental
  const ambientZone = engine.addEntity()
  Transform.create(ambientZone, {
    position: Vector3.create(8, 13, 8)
  })
  AudioSource.create(ambientZone, {
    audioClip: { url: 'sounds/ambient-gallery.wav' },
    loop: true,
    volume: 0.2
  })
  
  console.log("Galería de arte + snack-bar creados")
}

// === ASCENSOR ===
function createElevator() {
  const elevator = engine.addEntity()
  Transform.create(elevator, {
    position: Vector3.create(13, 1, 8),
    scale: Vector3.create(2, 3, 2)
  })
  MeshRenderer.setBox(elevator)
  Material.setMaterial(elevator, aluminumMaterial)
  
  // Interacción básica
  pointerEventsSystem.onPointerDown(
    { entity: elevator, opts: { button: InputAction.IA_PRIMARY, hoverText: 'Usar ascensor' } },
    () => {
      console.log("Ascensor activado")
      
      AudioSource.createOrReplace(elevator, {
        audioClip: { url: 'sounds/elevator-move.wav' },
        volume: 0.5
      })
    }
  )
  
  console.log("Ascensor básico creado")
}

// === FUNCIÓN PRINCIPAL ===

// === MEJORA #1: PANTALLAS LED DINÁMICAS ===
const ledMessages = [
  "BIENVENIDOS A AGP",
  "AUTOGESTIÓN PROFESIONAL", 
  "VISITANTES ONLINE: {visitors}",
  "OFICINAS DISPONIBLES",
  "NUEVA EXPO NFT GALLERY"
]

let currentMessageIndex = 0
let visitorCount = 0

function createLEDScreens() {
  // Pantalla principal (fachada frontal)
  const mainScreen = engine.addEntity()
  Transform.create(mainScreen, { 
    position: Vector3.create(8, 8, 0.1), 
    scale: Vector3.create(6, 2, 0.1),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0)
  })
  MeshRenderer.setPlane(mainScreen)
  
  // Material LED con emisión
  const ledMaterial = Material.create(mainScreen, {
    material: {
      $case: 'pbr',
      pbr: {
        baseColor: Color4.create(0, 0.8, 1, 1), // Azul AGP
        emissiveColor: Color3.create(0, 0.6, 0.8),
        emissiveIntensity: 2.0,
        metallic: 0.1,
        roughness: 0.9
      }
    }
  })
  
  // Pantalla lateral (información secundaria)
  const sideScreen = engine.addEntity()
  Transform.create(sideScreen, { 
    position: Vector3.create(0.1, 6, 4), 
    scale: Vector3.create(0.1, 3, 4),
    rotation: Quaternion.fromEulerDegrees(0, 90, 0)
  })
  MeshRenderer.setPlane(sideScreen)
  Material.setMaterial(sideScreen, ledMaterial)
  
  // Sistema de rotación de mensajes
  utils.timers.setInterval(() => {
    rotateLEDMessage()
  }, 5000) // Cambia cada 5 segundos
  
  // Contador de visitantes (simulado)
  utils.timers.setInterval(() => {
    visitorCount = Math.floor(Math.random() * 50) + 10 // 10-60 visitantes
  }, 30000) // Actualiza cada 30 segundos
  
  return { mainScreen, sideScreen }
}

function rotateLEDMessage() {
  currentMessageIndex = (currentMessageIndex + 1) % ledMessages.length
  const message = ledMessages[currentMessageIndex].replace('{visitors}', visitorCount.toString())
  
  // Efecto de parpadeo al cambiar mensaje
  const screens = engine.getEntitiesWith(Transform, MeshRenderer)
  screens.forEach(([entity, transform, mesh]) => {
    if (transform.position.x === 8 && transform.position.y === 8) { // Pantalla principal
      // Animación de brillo
      utils.tweens.startScaling(entity, 
        Vector3.create(6, 2, 0.1), 
        Vector3.create(6.2, 2.2, 0.1), 
        200, 
        utils.InterpolationType.EASEINOUT
      )
      
      // Sonido de actualización
      AudioSource.createOrReplace(entity, {
        audioClip: { url: 'sounds/led-update.wav' },
        volume: 0.2
      })
    }
  })
  
  // Mostrar mensaje en UI (temporal)
  ui.displayAnnouncement(`${message}`, 3000)
}

// Efecto nocturno mejorado
function enhanceNightMode() {
  const currentHour = new Date().getHours()
  const isNight = currentHour >= 19 || currentHour <= 6
  
  if (isNight) {
    // Intensificar LEDs de noche
    const screens = engine.getEntitiesWith(Transform, Material)
    screens.forEach(([entity, transform, material]) => {
      if (material.material?.$case === 'pbr') {
        material.material.pbr.emissiveIntensity = 3.0 // Más brillo
      }
    })
  }
}


export function main() {
  createLEDScreens()
  enhanceNightMode()
  
  // Actualizar modo nocturno cada hora
  utils.timers.setInterval(() => {
    enhanceNightMode()
  }, 3600000) // 1 hora
  console.log("Iniciando AutoGestionPro HQ...")
  
  createBuilding()
  createAGPSign()
  createReceptionist()
  createDrone()
  createOffices()
  createGallery()
  createElevator()
  
  console.log("AutoGestionPro HQ completado - -51,144")
}
