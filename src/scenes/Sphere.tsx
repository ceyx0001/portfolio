import react, { useRef } from 'react'
// Three
import * as THREE from 'three'
// R3F and Drei
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { OrbitControls, CubeCamera } from '@react-three/drei'
// Shaders
import SphereMaterial, { SphereShaderMaterialProps } from '../shaders/SphereMaterial'
import LiquidMaterial, { LiquidMaterialProps } from '../shaders/LiquidMaterial'

extend({
  SphereMaterial
})

extend({
  LiquidMaterial
})




export function SphereScene() {
  const backgroundShaderRef = useRef<LiquidMaterialProps>()
  const sphereShaderRef = useRef<SphereShaderMaterialProps>()

  useFrame(({ clock }) => {
    if (backgroundShaderRef.current) {
      backgroundShaderRef.current.uTime = clock.getElapsedTime()
    }
  })

  return (
    <>
      <CubeCamera>
        {(texture) => (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 64, 64]} />
            <sphereShaderMaterial ref={sphereShaderRef} uCube={texture} side={THREE.DoubleSide} />
          </mesh>
        )}
      </CubeCamera>
    </>
  )
}
