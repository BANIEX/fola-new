/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 Schoolbriefcaseglb.glb 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Schoolbriefcaseglb(props) {
  const { nodes, materials } = useGLTF(
    "https://firebasestorage.googleapis.com/v0/b/ranforte-a86c2.appspot.com/o/Schoolbriefcaseglb.glb?alt=media&token=982680d9-48a7-490b-9752-a194e035b609"
  );
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Sweep.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_1.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_2.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_1_1.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_2_1.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_1_2.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_2_2.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_1_3.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_2_3.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_1_4.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cap_2_4.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Plane.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Plane_1.geometry} material={materials['Mat.1']} />
      <mesh geometry={nodes.Plane_2.geometry} material={materials['Mat.1']} />
      <mesh geometry={nodes.Cube.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cube_1.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Cube_2.geometry} material={materials['Mat.1']} />
      <mesh geometry={nodes.Sweep_1.geometry} material={materials['Mat.1']} />
      <mesh geometry={nodes.Plane_3.geometry} material={materials['Mat.1']} />
      <mesh geometry={nodes.Plane_4.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Plane_5.geometry} material={materials['Mat.1']} />
      <mesh geometry={nodes.Sweep_2.geometry} material={materials.Mat} />
      <mesh geometry={nodes.Plane_6.geometry} material={materials['Mat.1']} />
      <mesh geometry={nodes.Plane_7.geometry} material={materials['Mat.1']} />
    </group>
  )
}

useGLTF.preload(
  "https://firebasestorage.googleapis.com/v0/b/ranforte-a86c2.appspot.com/o/Schoolbriefcaseglb.glb?alt=media&token=982680d9-48a7-490b-9752-a194e035b609"
);
