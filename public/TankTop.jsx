/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 TankTop.gltf 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function TankTop(props) {
  const { nodes, materials } = useGLTF(
    "https://firebasestorage.googleapis.com/v0/b/ranforte-a86c2.appspot.com/o/TankTop.gltf?alt=media&token=6da2fcc9-4d38-4442-bbab-31a990d2cf7a"
  );
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.TankTop.geometry} material={materials.TankTop} />
    </group>
  )
}

useGLTF.preload(
  "https://firebasestorage.googleapis.com/v0/b/ranforte-a86c2.appspot.com/o/TankTop.gltf?alt=media&token=6da2fcc9-4d38-4442-bbab-31a990d2cf7a"
);
