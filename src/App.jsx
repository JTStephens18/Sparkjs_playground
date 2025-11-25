import React, { useEffect, useRef } from 'react';
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PackedSplats, SplatMesh, SplatFileType } from "@sparkjsdev/spark";

import AquariumSplatUrl from '../data/aquarium_world.ply';

function App() {

  const mountRef = useRef(null);

  useEffect(() => {
    // 1. SETUP: Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF), 1);
    
    // Mount the renderer to the DOM
    if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
    }

    // 2. CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.3;
    controls.maxDistance = 20;

    // 3. SPLAT LOADING (The Logic Fix)
    // We instantiate PackedSplats directly. The library usually handles the fetch internally.
    console.log('Splat URL:', AquariumSplatUrl);
    const cleanUrl = AquariumSplatUrl.split('?')[0];
    console.log('Clean Splat URL:', cleanUrl);
    const packedSplats = new PackedSplats({ url: AquariumSplatUrl, fileType: SplatFileType.PLY });

    // We pass the specific key 'packedSplats' that the library expects
    const splatMesh = new SplatMesh({ packedSplats: packedSplats });
    
    // Optional: Adjust position/rotation if needed
    // splatMesh.quaternion.set(1, 0, 0, 0); 
    scene.add(splatMesh);

    // 4. ANIMATION LOOP
    renderer.setAnimationLoop((time) => {
        controls.update();
        renderer.render(scene, camera);
    });

    // 5. RESIZE HANDLER
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    };
    window.addEventListener('resize', onWindowResize);

    // 6. CLEANUP (React Best Practice)
    // Runs when component unmounts to prevent memory leaks
    return () => {
        window.removeEventListener('resize', onWindowResize);
        renderer.setAnimationLoop(null);
        if (mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
        }
        // distinct cleanup for geometry/materials if strictly needed
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />
    </>
  )
}

export default App
