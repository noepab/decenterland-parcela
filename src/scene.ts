import { engine } from '@dcl/sdk/ecs'
import { createBuilding, createOffices } from './modules/building'
import { createAGPSign, createGallery } from './modules/gallery'
import { createReceptionist, createDrone, createElevator } from './modules/interactives'
import { createBuildingLights, manageNightLights } from './modules/lighting'
import { createAudioZones } from './modules/audio'
import { createTeleportUI } from './modules/teleport-ui'

export function main() {
  console.log("🚀 Iniciando AutoGestionPro HQ...")

  // Añadir sistemas que se ejecutan en cada frame
  engine.addSystem(manageNightLights)

  // Crear todos los elementos de la escena
  createBuilding()
  createOffices()
  createAGPSign()
  createGallery()
  createReceptionist()
  createDrone()
  createElevator()
  createBuildingLights()
  createAudioZones() // Activar el nuevo sistema de audio
  createTeleportUI() // Añadir el nuevo panel de teletransporte

  console.log("✅ AutoGestionPro HQ completado con sistemas avanzados.")
}