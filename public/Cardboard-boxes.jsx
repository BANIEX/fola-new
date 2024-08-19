/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 Cardboard-boxes.gltf 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF(
    "https://firebasestorage.googleapis.com/v0/b/ranforte-a86c2.appspot.com/o/Cardboard-boxes.gltf?alt=media&token=5be81ed3-1439-4363-b1d8-ed2ffad0d5b5"
  );
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cardboard_Boxes_1.geometry} material={materials['Cardboard Boxes']} />
    </group>
  )
}

useGLTF.preload(
  "https://firebasestorage.googleapis.com/v0/b/ranforte-a86c2.appspot.com/o/Cardboard-boxes.gltf?alt=media&token=5be81ed3-1439-4363-b1d8-ed2ffad0d5b5"
);
