import { engine, Entity, Transform, AudioSource, trigger, TriggerType } from '@dcl/sdk/ecs' // FIX: Import trigger, TriggerType from @dcl/sdk/ecs
import { Vector3 } from '@dcl/sdk/math'
// import * as utils from '@dcl-sdk/utils' // No longer needed for triggers

const audioZones = {
  lobby: {
    source: { audioClipUrl: 'sounds/lobby-music.wav', loop: true, volume: 0.4 },
    triggerBox: { position: Vector3.create(8, 3, 8), scale: Vector3.create(16, 5, 16) }
  },
  offices: {
    source: { audioClipUrl: 'sounds/office-ambience.wav', loop: true, volume: 0.2 },
    triggerBox: { position: Vector3.create(8, 9, 8), scale: Vector3.create(16, 8, 16) }
  },
  gallery: {
    source: { audioClipUrl: 'sounds/ambient-gallery.wav', loop: true, volume: 0.3 },
    triggerBox: { position: Vector3.create(8, 15, 8), scale: Vector3.create(16, 5, 16) }
  },
  rooftop: {
    source: { audioClipUrl: 'https://your-live-stream-url.mp3', loop: true, volume: 0.5 },
    triggerBox: { position: Vector3.create(8, 20, 8), scale: Vector3.create(16, 8, 16) }
  }
}

let audioPlayer: Entity

export function createAudioZones() {
  audioPlayer = engine.addEntity()
  Transform.create(audioPlayer)
  AudioSource.create(audioPlayer, { playing: false, audioClipUrl: '' })

  for (const key in audioZones) {
    const zone = audioZones[key as keyof typeof audioZones]
    const triggerEntity = engine.addEntity()
    Transform.create(triggerEntity, zone.triggerBox)

    trigger.addTrigger(
      triggerEntity,
      TriggerType.ON_ENTER, // FIX: TriggerType
      () => {
        console.log(`Entrando en la zona de audio: ${key}`)
        Transform.getMutable(audioPlayer).position = zone.triggerBox.position
        const source = AudioSource.getMutable(audioPlayer)
        source.audioClipUrl = zone.source.audioClipUrl
        source.playing = true
      },
    )
  }

  const baseTrigger = engine.addEntity()
  Transform.create(baseTrigger, { position: Vector3.create(8, 10, 8), scale: Vector3.create(22, 25, 22) })
  trigger.addTrigger(
    baseTrigger,
    TriggerType.ON_EXIT, // FIX: TriggerType
    () => {
        console.log("Saliendo del edificio, deteniendo música.")
        AudioSource.getMutable(audioPlayer).playing = false
    }
  )
  console.log("🎵 Zonas de audio ambiental creadas.")
}