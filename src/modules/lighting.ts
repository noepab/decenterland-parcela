import { engine, Entity, Material, MeshRenderer, Transform, Schemas } from '@dcl/sdk/ecs'
import { Color3, Vector3 } from '@dcl/sdk/math'
import { EnvironmentApi } from '@dcl/sdk/apis' // FIX: Import EnvironmentApi from @dcl/sdk/apis

export const NightLight = engine.defineComponent('nightLight', { isOn: Schemas.Boolean })

const lightOnMaterial = {
    material: {
        $case: 'pbr',
        pbr: {
            emissiveColor: Color3.Yellow(),
            emissiveIntensity: 2
        }
    }
}

const lightOffMaterial = {
    material: {
        $case: 'pbr',
        pbr: {
            emissiveColor: Color3.Black(),
            emissiveIntensity: 0
        }
    }
}

export function createBuildingLights() {
    const lightPositions = [
        Vector3.create(5, 7, 2), 
        Vector3.create(11, 7, 2),
        Vector3.create(8, 11, 2),
        Vector3.create(3, 15, 13),
        Vector3.create(13, 15, 13),
        Vector3.create(0.5, 19, 0.5),
        Vector3.create(15.5, 19, 0.5),
        Vector3.create(0.5, 19, 15.5),
        Vector3.create(15.5, 19, 15.5)
    ]

    lightPositions.forEach(pos => {
        const light = engine.addEntity()
        Transform.create(light, {
            position: pos,
            scale: Vector3.create(0.2, 0.2, 0.2)
        })
        MeshRenderer.setSphere(light)
        Material.setPbrMaterial(light, lightOffMaterial) // FIX: setPbrMaterial
        NightLight.create(light, { isOn: false })
    })

    console.log("💡 Sistema de iluminación dinámica creado.")
}

let lastCheck = 0
const CHECK_INTERVAL = 5 // Segundos

export function manageNightLights() {
    const now = Date.now() / 1000
    if (now - lastCheck < CHECK_INTERVAL) {
        return
    }
    lastCheck = now

    EnvironmentApi.getEnvironment().then((env: any) => { // FIX: EnvironmentApi.getEnvironment and env: any
        if (!env) return

        const skyColor = env.skyColor
        const isNight = skyColor.r < 0.1 && skyColor.g < 0.1 && skyColor.b < 0.1

        const lights = engine.getEntitiesWith(NightLight)

        for (const [entity, lightState] of lights) {
            if (isNight && !lightState.isOn) {
                Material.setPbrMaterial(entity, lightOnMaterial) // FIX: setPbrMaterial
                NightLight.getMutable(entity).isOn = true
            } else if (!isNight && lightState.isOn) {
                Material.setPbrMaterial(entity, lightOffMaterial) // FIX: setPbrMaterial
                NightLight.getMutable(entity).isOn = false
            }
        }
    })
}
