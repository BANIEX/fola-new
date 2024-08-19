import React, {useState, useEffect} from 'react'
import {Canvas} from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei";
import Suitcase from '../../../public/Suitcase';
import TankTop from '../../../public/TankTop';
import Shoe from '../../../public/Shoe'


const ThreeD = ({product}: any) => {
  const [ModelComponent, setModelComponent] = useState(null);
  const nameInPublic = product?.variants.items[0].model.name;

  useEffect(() => {
    const loadModel = async () => {
      if (product) {
        const { default: LoadedModel } = await import(
          `../../../public/${nameInPublic}.jsx`
        );
        setModelComponent(() => LoadedModel);
      }
    };
    loadModel();
  }, [product]);

  if (!ModelComponent) return <div>Loading model...</div>;
  // console.log(ModelComponent)
  
  return (
    <div className="border-2 rounded-lg w-full h-full sm:px-0 max-w-7xl mx-2 mx-auto">

      <Canvas>
        <ambientLight intensity={6} />
        <OrbitControls enableZoom={false} />

        {/* <Suitcase position={[0, -1.3, 0]} scale={0.05} /> */}
        {/* <TankTop position={[0, -1.3, 0]} scale={6} /> */}
        {/* <Shoe position={[0, -1.3, 0]} scale={9} /> */}
        {/* <Jars-cup /> */}
        <ModelComponent position={[0, -1.3, 0]} scale={9} />
      </Canvas>

    </div>
  );
}

export default ThreeD