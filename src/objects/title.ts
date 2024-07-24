import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export const renderTitle = async (
  group: THREE.Group<THREE.Object3DEventMap>
) => {
  const orbMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.5,
    envMapIntensity: 5,
  });

  // Load the model
  const fbxLoader = new FBXLoader();
  const orb = await fbxLoader.loadAsync("/assets/orb.fbx");
  const orbMixer = new THREE.AnimationMixer(orb);
  if (orb.animations[0]) {
    const orbAction = orbMixer.clipAction(orb.animations[0]);
    orbAction.play();
  }
  orb.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = orbMaterial;
    }
  });
  orb.position.set(0, 0, 0);
  orb.scale.setScalar(0.001);
  group.add(orb);
};
