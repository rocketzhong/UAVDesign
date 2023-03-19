<template>
    <canvas id="uav-model" width="400" height="400"></canvas>
</template>

<script lang="ts" setup>
import { planeStatus } from '../sw'
import { onMounted } from 'vue'
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
onMounted(() => {
    const canvas: HTMLCanvasElement = document.querySelector('#uav-model')!
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xbbbbbb)
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    const { width, height } = canvas;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    // 相机
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000);
    camera.position.set(-7, 3, 0);
    camera.lookAt(0, 0, 0);

    // 光线
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    // 加载模型
    const loader = new GLTFLoader().setPath('assets/');
    let model:any
    loader.load('uav.glb', (gltf:any) => {
        if (gltf.scene) model = gltf.scene;
        scene.add(gltf.scene);
    });
    const animationFrame = () => {
        if (model) {
            model.rotation.x = planeStatus.ROL / 180 * Math.PI;
            model.rotation.z = planeStatus.PIT / 180 * Math.PI;
            model.rotation.y = -planeStatus.YAW / 180 * Math.PI;
        }
        renderer.render(scene, camera);
        window.requestAnimationFrame(animationFrame);
    };
    window.requestAnimationFrame(animationFrame);

})
</script>

<style lang="scss" scoped></style>