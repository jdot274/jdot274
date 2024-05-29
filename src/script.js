import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Function to evaluate Spline scene code
function evaluateSplineCode(code) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const context = renderer.getContext();
    renderer.setPixelRatio(window.devicePixelRatio);

    const exportScene = new Function('THREE', 'scene', 'camera', 'renderer', code);
    exportScene(THREE, scene, camera, renderer);

    return scene;
}

// Export scene to GLTF
function exportToGLTF(scene) {
    const exporter = new GLTFExporter();
    exporter.parse(scene, function (result) {
        const output = JSON.stringify(result, null, 2);
        saveString(output, 'scene.gltf');
    });
}

// Save GLTF string as file
function saveString(text, filename) {
    const blob = new Blob([text], { type: 'application/json' });
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

document.getElementById('convertButton').addEventListener('click', () => {
    const splineCode = document.getElementById('splineCode').value;
    const scene = evaluateSplineCode(splineCode);
    exportToGLTF(scene);
});
