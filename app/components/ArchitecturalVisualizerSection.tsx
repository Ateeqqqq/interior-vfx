"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Ambience preset configurations
interface AmbienceConfig {
  id: string;
  name: string;
  label: string;
  kelvin: string;
  sunColor: number;
  skyColor: number;
  groundColor: number;
  sunIntensity: number;
  ambientIntensity: number;
  interiorEmissive: number;
  sunPosition: [number, number, number];
  skyGradient: string;
}

const AMBIENCE_PRESETS: Record<string, AmbienceConfig> = {
  "warm-sun": {
    id: "warm-sun",
    name: "Warm Sun",
    label: "Midday Solar",
    kelvin: "5600K",
    sunColor: 0xfff6e6,
    skyColor: 0xe0edff,
    groundColor: 0x3a352f,
    sunIntensity: 2.2,
    ambientIntensity: 0.8,
    interiorEmissive: 0.3,
    sunPosition: [12, 18, 10],
    skyGradient: "from-sky-950/40 via-[#0d121c] to-black",
  },
  "golden-hour": {
    id: "golden-hour",
    name: "Golden Hour",
    label: "Warm Sunset",
    kelvin: "3200K",
    sunColor: 0xffa447,
    skyColor: 0xff8c42,
    groundColor: 0x24140b,
    sunIntensity: 2.6,
    ambientIntensity: 0.65,
    interiorEmissive: 0.9,
    sunPosition: [18, 5, 8],
    skyGradient: "from-amber-950/40 via-[#180f12] to-black",
  },
  twilight: {
    id: "twilight",
    name: "Dusk / Twilight",
    label: "Blue Hour",
    kelvin: "4200K",
    sunColor: 0x9fb4ff,
    skyColor: 0x3a4f88,
    groundColor: 0x111624,
    sunIntensity: 0.9,
    ambientIntensity: 0.5,
    interiorEmissive: 1.5,
    sunPosition: [-14, 3, -12],
    skyGradient: "from-indigo-950/50 via-[#0a0d18] to-black",
  },
  "night-mood": {
    id: "night-mood",
    name: "Night Mood",
    label: "Midnight Luxe",
    kelvin: "2700K",
    sunColor: 0x48649e,
    skyColor: 0x0f172a,
    groundColor: 0x05070a,
    sunIntensity: 0.35,
    ambientIntensity: 0.3,
    interiorEmissive: 2.4,
    sunPosition: [-8, 12, -10],
    skyGradient: "from-slate-950 via-[#050608] to-black",
  },
};

// Floor Plans / Spaces in the Villa
interface FloorPlanZone {
  id: string;
  name: string;
  level: string;
  area: string;
  elevation: string;
  badge: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  description: string;
}

const FLOOR_PLANS: FloorPlanZone[] = [
  {
    id: "ground",
    name: "Ground Living Pavilion",
    level: "Level 01",
    area: "3,850 sq.ft",
    elevation: "+0.00m",
    badge: "Active Zone",
    cameraPos: [-6.5, 2.0, 7.0],
    targetPos: [0, 0, 0],
    description: "Floor-to-ceiling structural glass curtain walls with open travertine hearth.",
  },
  {
    id: "master",
    name: "Cantilevered Master Suite",
    level: "Level 02",
    area: "1,620 sq.ft",
    elevation: "+3.60m",
    badge: "Cantilever",
    cameraPos: [6.0, 3.8, 5.5],
    targetPos: [0, 0.4, 0],
    description: "Post-tensioned cantilever extending over water with panoramic corner glass.",
  },
  {
    id: "pool",
    name: "Teak Deck & Infinity Pool",
    level: "Exterior",
    area: "2,400 sq.ft",
    elevation: "-0.20m",
    badge: "Outdoor",
    cameraPos: [7.5, 1.8, 4.2],
    targetPos: [0, -0.3, 0],
    description: "Submerged stepping stones, linear perimeter overflow, and Brazilian teak decking.",
  },
  {
    id: "wellness",
    name: "Wellness Atrium & Fireplace",
    level: "Level 01",
    area: "980 sq.ft",
    elevation: "+0.00m",
    badge: "Interior",
    cameraPos: [-4.2, 1.6, 4.8],
    targetPos: [0, 0, 0],
    description: "Monolithic Calacatta fireplace wall and acoustic micro-slat wood ceiling.",
  },
  {
    id: "roof",
    name: "Rooftop Observation Sky Deck",
    level: "Level 03",
    area: "2,150 sq.ft",
    elevation: "+6.80m",
    badge: "Skyline",
    cameraPos: [0.01, 11, 0.01],
    targetPos: [0, 0, 0],
    description: "Ultra-thin cantilevered roof slab with recessed warm LED perimeter illumination.",
  },
];

// Material Presets for dynamic 3D swap
interface MaterialPreset {
  id: string;
  name: string;
  category: string;
  finish: string;
  previewColor: string;
  threeProps: {
    color: number;
    roughness: number;
    metalness: number;
    clearcoat?: number;
  };
}

const MATERIAL_PRESETS: MaterialPreset[] = [
  {
    id: "concrete",
    name: "Cast Architectural Concrete",
    category: "Structure",
    finish: "Smooth Board-Formed (Matte)",
    previewColor: "#9a9690",
    threeProps: { color: 0x9a9690, roughness: 0.74, metalness: 0.08 },
  },
  {
    id: "marble",
    name: "Calacatta Gold Marble",
    category: "Stone",
    finish: "Bookmatched Honed Slab",
    previewColor: "#ece8df",
    threeProps: { color: 0xf5f3ee, roughness: 0.22, metalness: 0.12, clearcoat: 0.4 },
  },
  {
    id: "glass",
    name: "Low-E Acoustic Solar Glass",
    category: "Glazing",
    finish: "Reflective Tinted Curtain",
    previewColor: "#7bb4d6",
    threeProps: { color: 0x5a9bc4, roughness: 0.08, metalness: 0.4 },
  },
  {
    id: "wood",
    name: "Smoked American Walnut",
    category: "Timber",
    finish: "Natural Oil Organic Grain",
    previewColor: "#7a4b2c",
    threeProps: { color: 0x6e4327, roughness: 0.62, metalness: 0.05 },
  },
  {
    id: "bronze",
    name: "Champagne Anodized Bronze",
    category: "Metal",
    finish: "Brushed Architectural Mullions",
    previewColor: "#c29b6d",
    threeProps: { color: 0x8a6d4b, roughness: 0.32, metalness: 0.85 },
  },
];

export default function ArchitecturalVisualizerSection() {
  // UI States
  const [activeAmbience, setActiveAmbience] = useState<string>("warm-sun");
  const [lightIntensity, setLightIntensity] = useState<number>(75);
  const [hvacTemp, setHvacTemp] = useState<number>(22);
  const [hvacMode, setHvacMode] = useState<"cold" | "wind" | "sleep">("cold");
  const [activeTab, setActiveTab] = useState<"plans" | "materials">("plans");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("ground");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("concrete");
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [sunHour, setSunHour] = useState<number>(14.5); // 2:30 PM
  const [isPlayingSun, setIsPlayingSun] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<string>("perspective");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDraggingGauge, setIsDraggingGauge] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);

  // Three.js References
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    sunLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
    hemiLight: THREE.HemisphereLight;
    interiorLights: THREE.PointLight[];
    poolLight: THREE.PointLight;
    modelGroup: THREE.Group;
    waterMesh: THREE.Mesh | null;
    concreteMeshes: THREE.Mesh[];
    marbleMeshes: THREE.Mesh[];
    woodMeshes: THREE.Mesh[];
    glassMeshes: THREE.Mesh[];
    targetCamPos: THREE.Vector3;
    targetLookAt: THREE.Vector3;
    isTransitioningCam: boolean;
    invalidate: () => void;
  } | null>(null);

  // Initialize Three.js Scene with On-Demand Rendering (frameloop="demand")
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 10.5);

    // Renderer: Cap DPR strictly to [1, 1.5] to prevent heavy rendering on high-res displays
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 1.5);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    // Optimize performance: Disable expensive real-time shadow map depth-passes on 750k vertices
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Controls: Configured for touch orbital controls and on-demand interaction with smooth damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.5;
    controls.maxDistance = 25;
    controls.target.set(0, 0, 0);
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.4;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true;
    // Explicit mobile touch controls: single finger to rotate, pinch to zoom
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    renderer.domElement.style.touchAction = "none";

    // On-Demand Rendering Engine (equivalent to R3F frameloop="demand" + invalidate)
    let renderRequested = false;
    const invalidate = () => {
      if (renderRequested) return;
      renderRequested = true;
      requestAnimationFrame(() => {
        renderRequested = false;
        if (!threeRef.current) return;
        const { renderer, scene, camera, controls, isTransitioningCam, targetCamPos, targetLookAt } =
          threeRef.current;

        // Smooth camera fly-to interpolation when triggered
        if (isTransitioningCam) {
          camera.position.lerp(targetCamPos, 0.08);
          controls.target.lerp(targetLookAt, 0.08);
          if (
            camera.position.distanceTo(targetCamPos) < 0.02 &&
            controls.target.distanceTo(targetLookAt) < 0.02
          ) {
            threeRef.current.isTransitioningCam = false;
          } else {
            invalidate(); // Continue animating until settled
          }
        }

        controls.update();
        renderer.render(scene, camera);
      });
    };

    // Wire up OrbitControls change event to trigger re-renders properly on demand
    controls.addEventListener("change", () => {
      invalidate();
    });

    // Lights (optimized - no shadow map passes)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222630, 0.9);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaee, 2.6);
    sunLight.position.set(10, 14, 12);
    sunLight.castShadow = false; // Disabled to eliminate shadow-pass lag
    scene.add(sunLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xdde8ff, 1.3);
    fillLight.position.set(-10, 8, 8);
    scene.add(fillLight);

    // Rim Backlight
    const rimLight = new THREE.DirectionalLight(0xffeedd, 1.1);
    rimLight.position.set(0, 10, -12);
    scene.add(rimLight);

    // Interior Warm Lighting Fixtures
    const interiorLight1 = new THREE.PointLight(0xffd199, 1.8, 12);
    interiorLight1.position.set(-1.5, 1.5, 0);
    scene.add(interiorLight1);

    const interiorLight2 = new THREE.PointLight(0xffbf69, 1.6, 10);
    interiorLight2.position.set(1.5, 1.5, 0);
    scene.add(interiorLight2);

    const poolLight = new THREE.PointLight(0x00d2ff, 1.4, 8);
    poolLight.position.set(2.5, -0.5, 1.5);
    scene.add(poolLight);

    // Architectural Ground Grid
    const gridHelper = new THREE.GridHelper(26, 26, 0xdfb479, 0x262b35);
    gridHelper.position.y = -2.4;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    // High-Performance Baked Contact Shadow Plane (0 GPU shadow-map overhead)
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const radGrad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      radGrad.addColorStop(0, "rgba(0, 0, 0, 0.85)");
      radGrad.addColorStop(0.35, "rgba(0, 0, 0, 0.45)");
      radGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.12)");
      radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = radGrad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8.5, 8.5),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.38;
    scene.add(shadowPlane);

    // Floating Pedestal Glow Ring
    const ringGeo = new THREE.RingGeometry(3.6, 4.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xdfb479,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.16,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -2.39;
    scene.add(ringMesh);

    // Mesh tracking arrays
    const concreteMeshes: THREE.Mesh[] = [];
    const marbleMeshes: THREE.Mesh[] = [];
    const woodMeshes: THREE.Mesh[] = [];
    const glassMeshes: THREE.Mesh[] = [];
    let waterMesh: THREE.Mesh | null = null;
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Load /3d-model/3d-model.glb (User's custom 3D model)
    const loader = new GLTFLoader();
    loader.load(
      "/3d-model/3d-model.glb",
      (gltf) => {
        const root = gltf.scene;

        // Auto-center and normalize scale to fit the stage in the center
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = maxDim > 0 ? 8.5 / maxDim : 1;
        root.scale.set(targetScale, targetScale, targetScale);

        // Center on X, Y, and Z so it rotates symmetrically around its center
        root.position.x = -center.x * targetScale;
        root.position.y = -center.y * targetScale;
        root.position.z = -center.z * targetScale;

        // Optimize Meshes: Disable castShadow and receiveShadow on heavy 750k-vertex geometry
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false; // Key optimization: eliminates secondary shadow depth-pass
            mesh.receiveShadow = false;

            const name = (mesh.name || "").toLowerCase();
            const matName = (
              Array.isArray(mesh.material)
                ? mesh.material[0]?.name || ""
                : mesh.material?.name || ""
            ).toLowerCase();

            if (name.includes("concrete") || matName.includes("concrete") || name.includes("wall")) {
              concreteMeshes.push(mesh);
            } else if (name.includes("marble") || matName.includes("marble") || name.includes("stone") || name.includes("floor")) {
              marbleMeshes.push(mesh);
            } else if (name.includes("wood") || matName.includes("wood") || name.includes("deck")) {
              woodMeshes.push(mesh);
            } else if (name.includes("glass") || matName.includes("glass") || name.includes("window")) {
              glassMeshes.push(mesh);
            } else if (name.includes("water") || matName.includes("water") || name.includes("pool")) {
              waterMesh = mesh;
            } else {
              concreteMeshes.push(mesh);
            }
          }
        });
        modelGroup.add(root);
        setIsModelLoaded(true);
        setLoadingProgress(100);
        invalidate(); // Render initial frame on load
      },
      (xhr) => {
        if (xhr.total) {
          setLoadingProgress(Math.min(99, Math.round((xhr.loaded / xhr.total) * 100)));
        } else {
          setLoadingProgress((prev) => Math.min(95, prev + 12));
        }
      },
      (err) => {
        console.warn("GLTF loader fallback:", err);
        setIsModelLoaded(true);
        invalidate();
      }
    );

    threeRef.current = {
      renderer,
      scene,
      camera,
      controls,
      sunLight,
      ambientLight,
      hemiLight,
      interiorLights: [interiorLight1, interiorLight2],
      poolLight,
      modelGroup,
      waterMesh,
      concreteMeshes,
      marbleMeshes,
      woodMeshes,
      glassMeshes,
      targetCamPos: new THREE.Vector3(0, 3.2, 10.5),
      targetLookAt: new THREE.Vector3(0, 0, 0),
      isTransitioningCam: false,
      invalidate,
    };

    // Initial on-demand render
    invalidate();

    // Window Resize Handler with on-demand invalidation
    const handleResize = () => {
      if (!container || !threeRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      threeRef.current.camera.aspect = w / h;
      threeRef.current.camera.updateProjectionMatrix();
      threeRef.current.renderer.setSize(w, h);
      threeRef.current.invalidate();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Ambience & Lighting in 3D Scene (triggers on-demand invalidation)
  useEffect(() => {
    if (!threeRef.current) return;
    const preset = AMBIENCE_PRESETS[activeAmbience] || AMBIENCE_PRESETS["warm-sun"];
    const intensityMultiplier = lightIntensity / 100;

    const { sunLight, ambientLight, hemiLight, interiorLights } = threeRef.current;

    // Apply colors & intensities
    sunLight.color.setHex(preset.sunColor);
    sunLight.intensity = preset.sunIntensity * intensityMultiplier;
    sunLight.position.set(...preset.sunPosition);

    ambientLight.intensity = preset.ambientIntensity * intensityMultiplier;
    hemiLight.color.setHex(preset.skyColor);
    hemiLight.groundColor.setHex(preset.groundColor);

    interiorLights.forEach((light) => {
      light.intensity = preset.interiorEmissive * (1.4 - intensityMultiplier * 0.4);
    });

    threeRef.current.invalidate();
  }, [activeAmbience, lightIntensity]);

  // Update Dynamic Sun Hour Position (triggers on-demand invalidation)
  useEffect(() => {
    if (!threeRef.current) return;
    const { sunLight, hemiLight } = threeRef.current;

    // Map sunHour (8 to 20) to solar trajectory arc
    const progress = (sunHour - 8) / 12; // 0 to 1
    const angle = progress * Math.PI; // 0 to PI
    const radius = 22;
    const sunX = Math.cos(angle) * radius;
    const sunY = Math.sin(angle) * 16 + 2;
    const sunZ = Math.sin(angle) * 8 + 4;

    sunLight.position.set(sunX, sunY, sunZ);

    // Warm colors at low angles, crisp daylight at midday
    if (progress < 0.25 || progress > 0.75) {
      sunLight.color.setHex(0xff9944);
      hemiLight.color.setHex(0xff7733);
    } else {
      sunLight.color.setHex(0xfff6e6);
      hemiLight.color.setHex(0xe0edff);
    }

    threeRef.current.invalidate();
  }, [sunHour]);

  // Handle Sun Timeline Playback
  useEffect(() => {
    if (!isPlayingSun) return;
    const interval = setInterval(() => {
      setSunHour((prev) => {
        if (prev >= 20) return 8;
        return Number((prev + 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlayingSun]);

  // Update Auto Rotate: Dedicated render loop only when spin is active, halts immediately when stopped
  useEffect(() => {
    if (!threeRef.current) return;
    threeRef.current.controls.autoRotate = isAutoRotate;
    if (isAutoRotate) {
      let animId: number;
      const spin = () => {
        animId = requestAnimationFrame(spin);
        if (threeRef.current) {
          threeRef.current.controls.update();
          threeRef.current.renderer.render(threeRef.current.scene, threeRef.current.camera);
        }
      };
      spin();
      return () => cancelAnimationFrame(animId);
    } else {
      threeRef.current.invalidate();
    }
  }, [isAutoRotate]);

  // Update Wireframe (triggers on-demand invalidation)
  useEffect(() => {
    if (!threeRef.current) return;
    threeRef.current.modelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => ((m as any).wireframe = isWireframe));
        } else if (mesh.material) {
          (mesh.material as any).wireframe = isWireframe;
        }
      }
    });
    threeRef.current.invalidate();
  }, [isWireframe]);

  // Update Material Preset Swapping (triggers on-demand invalidation)
  useEffect(() => {
    if (!threeRef.current) return;
    const mat = MATERIAL_PRESETS.find((m) => m.id === selectedMaterialId);
    if (!mat) return;

    threeRef.current.concreteMeshes.forEach((mesh) => {
      if (mesh.material && !Array.isArray(mesh.material)) {
        (mesh.material as THREE.MeshStandardMaterial).color.setHex(mat.threeProps.color);
        (mesh.material as THREE.MeshStandardMaterial).roughness = mat.threeProps.roughness;
        (mesh.material as THREE.MeshStandardMaterial).metalness = mat.threeProps.metalness;
        mesh.material.needsUpdate = true;
      }
    });
    threeRef.current.invalidate();
  }, [selectedMaterialId]);

  // Handle Camera Fly-To when Floor Plan changes (triggers on-demand invalidation)
  const flyToZone = useCallback((plan: FloorPlanZone) => {
    if (!threeRef.current) return;
    setSelectedPlanId(plan.id);
    threeRef.current.targetCamPos.set(...plan.cameraPos);
    threeRef.current.targetLookAt.set(...plan.targetPos);
    threeRef.current.isTransitioningCam = true;
    threeRef.current.invalidate();
  }, []);

  const setCameraView = (view: "perspective" | "isometric" | "front" | "roof") => {
    if (!threeRef.current) return;
    setCameraPreset(view);
    threeRef.current.isTransitioningCam = true;

    if (view === "perspective") {
      threeRef.current.targetCamPos.set(0, 3.2, 10.5);
      threeRef.current.targetLookAt.set(0, 0, 0);
    } else if (view === "isometric") {
      threeRef.current.targetCamPos.set(7.5, 6.5, 7.5);
      threeRef.current.targetLookAt.set(0, 0, 0);
    } else if (view === "front") {
      threeRef.current.targetCamPos.set(0, 0.5, 10.5);
      threeRef.current.targetLookAt.set(0, 0, 0);
    } else if (view === "roof") {
      threeRef.current.targetCamPos.set(0.01, 13, 0.01);
      threeRef.current.targetLookAt.set(0, 0, 0);
    }
    threeRef.current.invalidate();
  };

  // Circular gauge slider math for "Customizable Ambience"
  const handleGaugeClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    let angle = Math.atan2(y, x) * (180 / Math.PI); // -180 to 180
    // Normalize to 135 to 405 (270 deg sweep)
    if (angle < -45) angle += 360;
    const progress = Math.max(0, Math.min(1, (angle - 135) / 270));
    setLightIntensity(Math.round(progress * 100));
  };

  const currentAmbience = AMBIENCE_PRESETS[activeAmbience];
  const activePlan = FLOOR_PLANS.find((p) => p.id === selectedPlanId) || FLOOR_PLANS[0];

  return (
    <section
      id="architectural-visualizer"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden border-t border-zinc-900/80"
    >
      {/* Background Ambient Glows & Grid Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#dfb479]/10 rounded-full blur-[160px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Section Header: Subtitle & Badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#dfb479]">
                Interactive Spatial Engine
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
              3D Architectural <span className="font-serif italic text-[#dfb479]">Visualizer</span>
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl font-light">
              Real-time WebGL BIM digital twin. Dynamically simulate diurnal lighting, modify HVAC climate telemetry, swap structural materials, and tour architectural volumes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAutoRotate ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
              <span>{isAutoRotate ? "Auto-Spin: Active" : "On-Demand (Idle 0%)"}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-[#dfb479]">DPR: 1.5x</span>
            </div>
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
                isAutoRotate
                  ? "bg-[#dfb479]/20 text-[#dfb479] border-[#dfb479]/40 shadow-[0_0_15px_rgba(223,180,121,0.2)]"
                  : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              {isAutoRotate ? "⟳ Spin: ON" : "⏸ Demand: ON"}
            </button>
          </div>
        </div>

        {/* ================= MAIN SPATIAL OS DASHBOARD CONTAINER ================= */}
        {/* Recreating exact layout, proportions, and visual hierarchy from reference */}
        <div className="relative w-full rounded-[36px] p-4 sm:p-6 lg:p-7 bg-gradient-to-br from-[#12141c]/90 via-[#0d0f15]/95 to-[#161219]/90 border border-white/15 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Subtle iridescent border glow */}
          <div className="absolute -inset-[1px] rounded-[36px] bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-blue-500/10 -z-10 pointer-events-none" />

          {/* ================= TOP NAVIGATION & SEARCH DOCK ================= */}
          <div className="flex items-center justify-between gap-4 mb-5 pb-2">
            
            {/* Top Left Studio Pill */}
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-[#dfb479]" />
              <span className="text-xs font-medium tracking-wider text-white uppercase font-mono">
                INT-VFX OS
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">v4.2</span>
            </div>

            {/* Top Center Curved Navigation Pill Dock (Exact from reference) */}
            <div className="flex items-center gap-1.5 sm:gap-4 px-4 sm:px-6 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-lg mx-auto">
              {[
                { id: "home", icon: "⌂", label: "Overview", active: true },
                { id: "sun", icon: "☼", label: "Ambience", active: false },
                { id: "bim", icon: "◫", label: "BIM Levels", active: false },
                { id: "clock", icon: "⏱", label: "Sun Path", active: false },
                { id: "layers", icon: "▤", label: "Layers", active: false },
              ].map((item) => (
                <button
                  key={item.id}
                  title={item.label}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm transition-all cursor-pointer ${
                    item.active
                      ? "bg-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.3)] border border-white/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>

            {/* Top Right Search Bar & User Avatar (Exact from reference) */}
            <div className="flex items-center gap-2.5">
              <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl text-xs text-zinc-300">
                <input
                  type="text"
                  placeholder="Search spaces & specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500 w-32 lg:w-44 font-sans font-light"
                />
                <span className="text-zinc-400 text-xs">🔍</span>
              </div>

              {/* Notification Pill */}
              <button
                title="Notifications"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/15 flex items-center justify-center text-xs text-zinc-300 transition-all cursor-pointer"
              >
                ✉
              </button>

              {/* User Avatar with Green Active Dot */}
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#dfb479] to-[#8a6d4b] border border-white/30 flex items-center justify-center text-xs font-semibold text-black uppercase overflow-hidden">
                  <span>AT</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#12141c]" />
              </div>
            </div>
          </div>

          {/* ================= 3-COLUMN MAIN SHOWCASE LAYOUT ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* ================= LEFT COLUMN: 2 STACKED GLASS CARDS (approx 27%) ================= */}
            <div className="order-2 lg:order-1 lg:col-span-3 flex flex-col gap-5 justify-between">
              
              {/* CARD 1: Customizable Ambience & Lighting */}
              <div className="relative p-5 rounded-[24px] bg-white/[0.05] border border-white/15 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-white/25 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-300 font-mono font-medium">
                    Customizable Ambience
                  </h3>
                  <span className="text-[11px] font-mono text-[#dfb479]">
                    {currentAmbience.kelvin}
                  </span>
                </div>

                {/* Circular Arc Intensity Gauge */}
                <div className="relative flex flex-col items-center justify-center my-3">
                  <svg
                    viewBox="0 0 160 120"
                    className="w-44 h-32 cursor-pointer select-none"
                    onClick={handleGaugeClick}
                  >
                    {/* Background Arc Track */}
                    <path
                      d="M 25 105 A 55 55 0 1 1 135 105"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.12)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Active Arc Progress */}
                    <path
                      d="M 25 105 A 55 55 0 1 1 135 105"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="216"
                      strokeDashoffset={216 - (216 * lightIntensity) / 100}
                      className="transition-all duration-300"
                    />
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="50%" stopColor="#dfb479" />
                        <stop offset="100%" stopColor="#fb923c" />
                      </linearGradient>
                    </defs>

                    {/* Dim & Bright lightbulb icons at ends */}
                    <text x="18" y="112" fill="#71717a" fontSize="10" textAnchor="middle">
                      ☼
                    </text>
                    <text x="142" y="112" fill="#dfb479" fontSize="13" textAnchor="middle">
                      ☀
                    </text>
                  </svg>

                  {/* Gauge Center Value Badge */}
                  <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">
                      Intensity
                    </span>
                    <span className="text-2xl font-bold tracking-tight text-white font-mono">
                      {lightIntensity}%
                    </span>
                  </div>
                </div>

                {/* Preset Circles: (1) (2) (3) (4) matching reference */}
                <div className="flex items-center justify-center gap-2.5 my-2">
                  {Object.keys(AMBIENCE_PRESETS).map((key, idx) => {
                    const preset = AMBIENCE_PRESETS[key];
                    const isSelected = activeAmbience === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveAmbience(key)}
                        title={`${preset.name} (${preset.kelvin})`}
                        className={`w-8 h-8 rounded-full text-xs font-mono font-medium flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white text-black scale-110 shadow-[0_0_14px_rgba(255,255,255,0.6)]"
                            : "bg-white/[0.08] hover:bg-white/20 text-zinc-300 border border-white/10"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Preset Name label */}
                <div className="text-center text-[11px] text-zinc-400 font-mono mt-1">
                  Active: <span className="text-[#dfb479]">{currentAmbience.name}</span>
                </div>

                {/* Footer link matching reference */}
                <div className="mt-3 pt-3 border-t border-white/10 text-center">
                  <a
                    href="#materials"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("materials");
                    }}
                    className="text-[11px] text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 font-mono"
                  >
                    <span>Inspect Lumens &amp; Lux Balance</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* CARD 2: Set Temperature & HVAC Controls */}
              <div className="relative p-5 rounded-[24px] bg-white/[0.05] border border-white/15 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-white/25 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-300 font-mono font-medium">
                    Set Temperature
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400">
                    ECO OPTIMIZED
                  </span>
                </div>

                {/* Circular Thermostat Dial (Exact from reference) */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="relative w-32 h-32 rounded-full border border-white/15 bg-white/[0.03] shadow-inner flex items-center justify-center">
                    
                    {/* Dial Ticks */}
                    <div className="absolute inset-1 rounded-full border border-dashed border-white/20" />

                    {/* Red / Warm Temperature Indicator Point on Rim */}
                    <div
                      className="absolute w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]"
                      style={{
                        top: "14%",
                        right: "14%",
                      }}
                    />

                    {/* Temperature Center Display with +/- Controls */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setHvacTemp((prev) => Math.max(16, prev - 1))}
                          className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer font-bold"
                          title="Decrease Temperature"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold tracking-tight text-white font-mono">
                          {hvacTemp}°C
                        </span>
                        <button
                          onClick={() => setHvacTemp((prev) => Math.min(30, prev + 1))}
                          className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer font-bold"
                          title="Increase Temperature"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono mt-0.5">
                        Indoor Climate
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Bottom Mode Pills: Cold ❄️, Wind 💨, Sleep 💤 (Exact from reference) */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: "cold", icon: "❄", label: "Cold" },
                    { id: "wind", icon: "༄", label: "Wind" },
                    { id: "sleep", icon: "☾", label: "Sleep" },
                  ].map((mode) => {
                    const isSelected = hvacMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setHvacMode(mode.id as any)}
                        className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white/20 text-white border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                            : "bg-white/[0.04] text-zinc-400 hover:text-zinc-200 border border-white/10"
                        }`}
                      >
                        <span className="text-sm">{mode.icon}</span>
                        <span className="text-[10px] font-mono">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= CENTER STAGE: 3D THREE.JS CANVAS (approx 46%) ================= */}
            {/* Stacks first on mobile (<1024px) right below top control bar */}
            <div className="order-1 lg:order-2 lg:col-span-6 relative rounded-[28px] border border-white/15 bg-gradient-to-b from-[#0d0f17]/90 via-[#07080d]/95 to-[#0d0f17]/90 overflow-hidden flex flex-col min-h-[350px] h-[440px] sm:h-[540px] lg:h-[700px] shadow-2xl">
              
              {/* Top Center Branding & Digital Twin Status */}
              <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#dfb479] animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#dfb479] uppercase">
                    3D MODEL VIEW
                  </span>
                </div>

                {/* Centered Brand Title */}
                <div className="text-center">
                  <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] text-white/90 uppercase font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    INT-VFX SPATIAL
                  </h4>
                </div>

                {/* Real-time wireframe / view mode */}
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => setIsWireframe(!isWireframe)}
                    title="Toggle Architectural Wireframe"
                    className={`px-2.5 py-1 rounded-full text-[9.5px] sm:text-[10px] font-mono transition-all border cursor-pointer ${
                      isWireframe
                        ? "bg-[#dfb479] text-black border-[#dfb479] font-bold"
                        : "bg-black/60 text-zinc-400 border-white/15 hover:text-white"
                    }`}
                  >
                    {isWireframe ? "WIREFRAME" : "SHADED"}
                  </button>
                </div>
              </div>

              {/* Three.js Interactive Canvas Container (takes 100% full height) */}
              <div
                ref={canvasContainerRef}
                style={{ touchAction: "none" }}
                className="relative flex-1 w-full h-full min-h-[350px] cursor-grab active:cursor-grabbing select-none touch-none"
              />

              {/* Loading State Overlay */}
              {!isModelLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md transition-opacity duration-500 pointer-events-none">
                  <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#dfb479] animate-spin mb-3 shadow-[0_0_20px_rgba(223,180,121,0.3)]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-300">
                    Loading 3D Model • {loadingProgress}%
                  </span>
                  <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden mt-2.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#dfb479] to-amber-300 transition-all duration-300"
                      style={{ width: `${Math.max(8, loadingProgress)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Bottom Interactive Tips & Orbit Controls Bar */}
              <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 flex items-center justify-between z-20 pointer-events-none gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 bg-black/70 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 backdrop-blur-md truncate">
                  {isAutoRotate ? "⟳ Auto-Spin" : "⏸ On-Demand (0% GPU)"} • Touch / Drag to Orbit • Pinch to Zoom
                </span>
                <div className="pointer-events-auto shrink-0">
                  <button
                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                    className="text-[9px] sm:text-[10px] font-mono text-[#dfb479] bg-black/70 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#dfb479]/30 hover:border-[#dfb479] backdrop-blur-md cursor-pointer transition-all"
                  >
                    {isAutoRotate ? "Pause" : "Auto-Rotate"}
                  </button>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: 2 STACKED GLASS CARDS (approx 27%) ================= */}
            <div className="order-3 lg:order-3 lg:col-span-3 flex flex-col gap-5 justify-between">
              
              {/* CARD 3: Floor Plans & Material Presets (Tabbed like Shows / Movies in reference) */}
              <div className="relative p-5 rounded-[24px] bg-white/[0.05] border border-white/15 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-white/25 transition-all">
                
                {/* Tabs matching "Shows | Movies" in reference */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <button
                      onClick={() => setActiveTab("plans")}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeTab === "plans" ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <span>📐</span>
                      <span>Spaces</span>
                    </button>
                    <span className="text-zinc-700">|</span>
                    <button
                      onClick={() => setActiveTab("materials")}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeTab === "materials" ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <span>🧱</span>
                      <span>Materials</span>
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {activeTab === "plans" ? "5 Zones" : "5 Finishes"}
                  </span>
                </div>

                {/* TAB 1: Spaces List (5 items with thumbnails matching reference cards) */}
                {activeTab === "plans" && (
                  <div className="flex flex-col gap-2">
                    {FLOOR_PLANS.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => flyToZone(plan)}
                          className={`group/item p-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white/[0.15] border border-white/30 shadow-md translate-x-1"
                              : "bg-white/[0.03] hover:bg-white/[0.08] border border-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Round Thumbnail Badge */}
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-[#dfb479] text-black font-bold"
                                  : "bg-white/10 text-zinc-300 group-hover/item:bg-white/20"
                              }`}
                            >
                              {plan.level.replace("Level ", "L").replace("Exterior", "EXT")}
                            </div>
                            <div className="truncate">
                              <h4 className="text-xs font-medium text-white truncate">
                                {plan.name}
                              </h4>
                              <p className="text-[10px] font-mono text-zinc-400">
                                {plan.area} • {plan.elevation}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 pl-2">
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? "bg-white text-black font-semibold"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {plan.badge}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 2: Materials List (Swatches dynamically swap 3D textures) */}
                {activeTab === "materials" && (
                  <div className="flex flex-col gap-2">
                    {MATERIAL_PRESETS.map((mat) => {
                      const isSelected = selectedMaterialId === mat.id;
                      return (
                        <div
                          key={mat.id}
                          onClick={() => setSelectedMaterialId(mat.id)}
                          className={`group/item p-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white/[0.15] border border-white/30 shadow-md translate-x-1"
                              : "bg-white/[0.03] hover:bg-white/[0.08] border border-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Color Swatch Circle */}
                            <div
                              className="w-9 h-9 rounded-full border border-white/20 shrink-0 shadow-sm"
                              style={{ backgroundColor: mat.previewColor }}
                            />
                            <div className="truncate">
                              <h4 className="text-xs font-medium text-white truncate">
                                {mat.name}
                              </h4>
                              <p className="text-[10px] font-mono text-zinc-400">
                                {mat.category} • {mat.finish}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 pl-2">
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? "bg-[#dfb479] text-black font-semibold"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {isSelected ? "Applied" : "Apply"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Dots at bottom matching reference (••••) */}
                <div className="flex items-center justify-center gap-1.5 mt-3 pt-2">
                  {[0, 1, 2, 3].map((dot) => (
                    <span
                      key={dot}
                      className={`h-1.5 rounded-full transition-all ${
                        dot === (activeTab === "plans" ? 0 : 1)
                          ? "w-4 bg-white"
                          : "w-1.5 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* CARD 4: Sun Path Diurnal Simulation & Viewport Media Player Controls */}
              <div className="relative p-5 rounded-[24px] bg-white/[0.05] border border-white/15 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-white/25 transition-all">
                
                {/* Title matching media player header ("The Wild Robot" in reference) */}
                <div className="text-center mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    Sun Path Diurnal Simulation
                  </span>
                  <h4 className="text-xs font-semibold text-white font-mono mt-0.5">
                    {Math.floor(sunHour)}:{Math.round((sunHour % 1) * 60)
                      .toString()
                      .padStart(2, "0")}{" "}
                    {sunHour >= 12 ? "PM" : "AM"} • Trajectory:{" "}
                    {Math.round(((sunHour - 8) / 12) * 180)}°
                  </h4>
                </div>

                {/* Waveform / Sun timeline scrubber */}
                <div className="relative my-2 px-1">
                  <input
                    type="range"
                    min="8"
                    max="20"
                    step="0.1"
                    value={sunHour}
                    onChange={(e) => setSunHour(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#dfb479]"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500 mt-1">
                    <span>08:00 AM (Dawn)</span>
                    <span className="text-[#dfb479]">12:00 PM (Zenith)</span>
                    <span>08:00 PM (Dusk)</span>
                  </div>
                </div>

                {/* Media Playback Controls (|< << ▶ >> >| exact from reference) */}
                <div className="flex items-center justify-center gap-3 mt-2">
                  {/* Prev Zone */}
                  <button
                    onClick={() => {
                      const idx = FLOOR_PLANS.findIndex((p) => p.id === selectedPlanId);
                      const prevIdx = (idx - 1 + FLOOR_PLANS.length) % FLOOR_PLANS.length;
                      flyToZone(FLOOR_PLANS[prevIdx]);
                    }}
                    title="Previous Space"
                    className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/20 text-zinc-300 flex items-center justify-center text-xs transition-all cursor-pointer"
                  >
                    ⏮
                  </button>

                  {/* Rewind Sun 1 hour */}
                  <button
                    onClick={() => setSunHour((prev) => Math.max(8, prev - 1))}
                    title="Rewind Sun -1h"
                    className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/20 text-zinc-300 flex items-center justify-center text-xs transition-all cursor-pointer"
                  >
                    ⏪
                  </button>

                  {/* Play / Pause Solar Cycle */}
                  <button
                    onClick={() => setIsPlayingSun(!isPlayingSun)}
                    title={isPlayingSun ? "Pause Solar Cycle" : "Play Solar Cycle"}
                    className="w-9 h-9 rounded-full bg-white text-black hover:bg-zinc-200 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all cursor-pointer font-bold"
                  >
                    {isPlayingSun ? "⏸" : "▶"}
                  </button>

                  {/* Forward Sun 1 hour */}
                  <button
                    onClick={() => setSunHour((prev) => Math.min(20, prev + 1))}
                    title="Advance Sun +1h"
                    className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/20 text-zinc-300 flex items-center justify-center text-xs transition-all cursor-pointer"
                  >
                    ⏩
                  </button>

                  {/* Next Zone */}
                  <button
                    onClick={() => {
                      const idx = FLOOR_PLANS.findIndex((p) => p.id === selectedPlanId);
                      const nextIdx = (idx + 1) % FLOOR_PLANS.length;
                      flyToZone(FLOOR_PLANS[nextIdx]);
                    }}
                    title="Next Space"
                    className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/20 text-zinc-300 flex items-center justify-center text-xs transition-all cursor-pointer"
                  >
                    ⏭
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
