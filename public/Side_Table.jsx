/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 Side_Table.glb 
*/

import React from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export default function Side_Table(props) {
  const group = React.useRef()
  const { nodes, materials, animations } = useGLTF(
    "https://firebasestorage.googleapis.com/v0/b/ranforte-a86c2.appspot.com/o/Side_Table.glb?alt=media&token=5c8d6200-87f2-4a01-89ea-3d93fce2ca86"
  );
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Side_Table" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh name="Table" geometry={nodes.Table.geometry} material={materials.M_Table} />
          <mesh name="Wheel_1" geometry={nodes.Wheel_1.geometry} material={materials.M_Table} />
          <mesh name="Wheel_2" geometry={nodes.Wheel_2.geometry} material={materials.M_Table} />
          <mesh name="Wheel_3" geometry={nodes.Wheel_3.geometry} material={materials.M_Table} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(
  "https://firebasestorage.googleapis.com/v0/b/ranforte-a86c2.appspot.com/o/Side_Table.glb?alt=media&token=5c8d6200-87f2-4a01-89ea-3d93fce2ca86"
);
