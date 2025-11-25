import AquariumSplat from "../../data/aquarium_world.ply"
import { PackedSplats, SplatMesh } from "@sparkjsdev/spark";

const loadSplat = async (url) => {
    const packedSplats = new PackedSplats({ url: url });
    return packedSplats
}

function SplatTest({ scene, camera, renderer }) {

    const aquariumPackedSplat = loadSplat(AquariumSplat);
    const aquariumSplatMesh = new SplatMesh({ aquariumPackedSplat });

    scene.add(aquariumSplatMesh);

    renderer.setAnimationLoop(function animate(time) {
        renderer.render(scene, camera)
    });

    return <div>Splat Test Component</div>;
}

export default SplatTest;