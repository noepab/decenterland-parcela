import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  AudioSource,
  pointerEventsSystem,
  InputAction,
  Entity,
  Schemas
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { aluminumMaterial } from './materials'
import * as ui from '@dcl/sdk/ui' // FIX: Import ui from @dcl/sdk/ui

const floors = [
  { name: "Planta Baja (Recepción)", height: 1 },
  { name: "Piso 1 (Oficinas)", height: 5 },
  { name: "Piso 2 (Oficinas)", height: 9 },
  { name: "Piso 3 (Galería/Snack)", height: 13 },
  { name: "Azotea (Drone)", height: 17 }
]

function moveElevator(elevator: Entity, targetHeight: number) {
  const currentPos = Transform.get(elevator).position

  AudioSource.createOrReplace(elevator, {
    audioClipUrl: 'sounds/elevator-move.wav', // FIX: audioClipUrl
    playing: true,
    loop: false,
    volume: 0.5
  })

  utils.tweens.startTranslation(
    elevator,
    currentPos,
    Vector3.create(currentPos.x, targetHeight, currentPos.z),
    2,
    utils.InterpolationType.EASEOUTQUAD, // FIX: EASEOUTQUAD
    () => {
      AudioSource.getMutable(elevator).playing = false
      console.log(`Ascensor llegó al piso con altura: ${targetHeight}`)
    }
  )
}

function showElevatorUI(elevator: Entity) {
  const options = floors.map((floor, index) => ({
    label: floor.name,
    value: index.toString()
  }))

  ui.displayAnnouncement( // FIX: ui.displayAnnouncement
    'Selecciona un piso:',
    {
      duration: 10,
      color: Color4.White(),
      fontSize: 14,
      // noFullWidth: false, // This property doesn't exist in the new ui.displayAnnouncement
      // value: string, // This is the callback
      // options: options
    },
    (value: string) => { // FIX: value: string
      const selectedFloorIndex = parseInt(value)
      const targetHeight = floors[selectedFloorIndex].height
      moveElevator(elevator, targetHeight)
      ui.displayAnnouncement(`Subiendo a ${floors[selectedFloorIndex].name}...`, { duration: 3 }) // FIX: ui.displayAnnouncement
    },
    options
  )
}


export function createReceptionist() {
  const receptionist = engine.addEntity()
  Transform.create(receptionist, {
    position: Vector3.create(5, 2, 5),
    scale: Vector3.create(0.8, 2, 0.8)
  })
  MeshRenderer.setCylinder(receptionist)
  Material.setPbrMaterial(receptionist, aluminumMaterial) // FIX: setPbrMaterial

  pointerEventsSystem.onPointerDown(
    { entity: receptionist, opts: { button: InputAction.IA_PRIMARY, hoverText: '🤖 Hablar con recepcionista' } },
    () => {
      console.log("👋 Interacción con recepcionista")

      AudioSource.createOrReplace(receptionist, {
        audioClipUrl: 'sounds/reception-voice.wav', // FIX: audioClipUrl
        volume: 0.7,
        playing: true
      })

      ui.displayAnnouncement("Bienvenidos a AutoGestionPro. ¿Cómo te llamas? Puedo ayudarte en algo?", { duration: 5, color: Color4.White(), fontSize: 16 }) // FIX: ui.displayAnnouncement
    }
  )

  console.log("🤖 Recepcionista interactivo creado")
}

const SeatState = engine.defineComponent('seatState', {
  occupiedBy: Schemas.Optional(Schemas.Entity)
})

export function createDrone() {
  const drone = engine.addEntity()
  Transform.create(drone, {
    position: Vector3.create(8, 21, 8),
    scale: Vector3.create(2, 0.5, 1)
  })
  MeshRenderer.setBox(drone)
  Material.setPbrMaterial(drone, aluminumMaterial) // FIX: setPbrMaterial

  const seat1 = engine.addEntity()
  Transform.create(seat1, {
    position: Vector3.create(-0.5, 0.5, 0),
    parent: drone
  })
  SeatState.create(seat1, { occupiedBy: undefined })

  const seat2 = engine.addEntity()
  Transform.create(seat2, {
    position: Vector3.create(0.5, 0.5, 0),
    parent: drone
  })
  SeatState.create(seat2, { occupiedBy: undefined })

  const seats = [seat1, seat2]

  pointerEventsSystem.onPointerDown(
    { entity: drone, opts: { button: InputAction.IA_PRIMARY, hoverText: 'Subir / Bajar del Drone' } },
    () => {
      const player = engine.PlayerEntity
      const playerTransform = Transform.getMutable(player)

      for (const seat of seats) {
        const seatState = SeatState.get(seat)
        if (seatState.occupiedBy === player) {
          playerTransform.parent = undefined
          SeatState.getMutable(seat).occupiedBy = undefined
          ui.displayAnnouncement("Has bajado del drone.", { duration: 3 }) // FIX: ui.displayAnnouncement
          return
        }
      }

      for (const seat of seats) {
        const seatState = SeatState.get(seat)
        if (!seatState.occupiedBy) {
          playerTransform.parent = seat
          SeatState.getMutable(seat).occupiedBy = player
          ui.displayAnnouncement("¡Bienvenido a bordo del drone!", { duration: 3 }) // FIX: ui.displayAnnouncement
          return
        }
      }

      ui.displayAnnouncement("El drone está lleno.", { duration: 3 }) // FIX: ui.displayAnnouncement
    }
  )


  const propeller1 = engine.addEntity()
  Transform.create(propeller1, {
    position: Vector3.create(0, 0.25, 0.7),
    scale: Vector3.create(1.5, 0.1, 0.1),
    parent: drone
  })
  MeshRenderer.setBox(propeller1)

  const propeller2 = engine.addEntity()
  Transform.create(propeller2, {
    position: Vector3.create(0, 0.25, -0.7),
    scale: Vector3.create(1.5, 0.1, 0.1),
    parent: drone
  })
  MeshRenderer.setBox(propeller2)

  utils.perpetualMotions.startRotation(drone, Quaternion.fromEulerDegrees(0, 30, 0))
  
  utils.perpetualMotions.startRotation(propeller1, Quaternion.fromEulerDegrees(0, 1080, 0))
  utils.perpetualMotions.startRotation(propeller2, Quaternion.fromEulerDegrees(0, 1080, 0))


  AudioSource.create(drone, {
    audioClipUrl: 'sounds/drone-helices.wav', // FIX: audioClipUrl
    loop: true,
    volume: 0.3,
    playing: true
  })

  console.log("🚁 Drone biplaza abordable creado")
}

export function createElevator() {
  const elevator = engine.addEntity()
  Transform.create(elevator, {
    position: Vector3.create(13, 1, 8),
    scale: Vector3.create(2, 3, 2)
  })
  MeshRenderer.setBox(elevator)
  Material.setPbrMaterial(elevator, aluminumMaterial) // FIX: setPbrMaterial

  pointerEventsSystem.onPointerDown(
    { entity: elevator, opts: { button: InputAction.IA_PRIMARY, hoverText: '🛗 Usar ascensor' } },
    () => {
      console.log("🛗 Ascensor activado - mostrando UI")
      showElevatorUI(elevator)
    }
  )

  console.log("🛗 Ascensor interactivo creado con UI")
}
