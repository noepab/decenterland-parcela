import { Color3, Color4 } from '@dcl/sdk/math'

// Material de Vidrio
export const glassMaterial = {
  baseColor: Color4.create(0.2, 0.8, 1, 0.3),
  emissiveColor: Color3.create(0, 0.4, 0.6),
  emissiveIntensity: 0.5,
  metallic: 0.1,
  roughness: 0.1,
  alphaTest: 0.5
}

// Material de Aluminio
export const aluminumMaterial = {
  baseColor: Color4.create(0.8, 0.8, 0.9, 1),
  metallic: 0.9,
  roughness: 0.2
}

// Material Blanco Emisivo
export const emissiveWhiteMaterial = {
  baseColor: Color4.create(1, 1, 1, 1),
  emissiveColor: Color3.create(1, 1, 1),
  emissiveIntensity: 2.0
}
