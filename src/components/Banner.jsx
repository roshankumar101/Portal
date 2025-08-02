import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const imagePaths = [
  "/assets/P1.jpg",
  "/assets/P2.jpg",
  "/assets/P3.jpg",
  "/assets/P4.jpg",
  "/assets/P5.jpg",
];

const BannerCarousel = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const statementRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const statementEl = statementRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 70);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Resize handler
    function resizeRenderer() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    }
    resizeRenderer();
    window.addEventListener("resize", resizeRenderer);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(30, 30, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -20;
    floor.receiveShadow = true;
    scene.add(floor);

    // Carousel parameters
    const radius = 30;
    const totalCards = imagePaths.length;
    const theta = (2 * Math.PI) / totalCards;

    // Cards group
    const group = new THREE.Group();
    scene.add(group);

    const loader = new THREE.TextureLoader();
    const cards = [];

    // Create cards with textures mapped
    imagePaths.forEach((src, i) => {
      const geometry = new THREE.PlaneGeometry(16, 9); // ratio 16:9
      const texture = loader.load(src);
      texture.minFilter = THREE.LinearFilter;
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0.3,
        color: 0xffffff,
        emissive: 0x000000,
        emissiveIntensity: 0,
      });

      const card = new THREE.Mesh(geometry, material);
      card.position.set(
        radius * Math.sin(theta * i),
        0,
        radius * Math.cos(theta * i)
      );
      card.castShadow = true;
      card.receiveShadow = true;

      card.lookAt(new THREE.Vector3(0, 0, 0)); // face center/camera

      group.add(card);
      cards.push(card);
    });

    // Update spotlight: white glow on front card & scale up
    function updateSpotlight(rotationY) {
      let norm = rotationY % (2 * Math.PI);
      if (norm < 0) norm += 2 * Math.PI;

      let frontIndex = 0;
      let minDiff = 2 * Math.PI;

      for (let i = 0; i < totalCards; i++) {
        let cardAngle = (theta * i + norm) % (2 * Math.PI);
        let diff = Math.min(Math.abs(cardAngle), 2 * Math.PI - Math.abs(cardAngle));
        if (diff < minDiff) {
          minDiff = diff;
          frontIndex = i;
        }
      }

      cards.forEach((card, idx) => {
        const mat = card.material;
        if (idx === frontIndex) {
          mat.color.set(0xffffff);
          mat.emissive.set(0xffffff);
          mat.emissiveIntensity = 0.6;
          gsap.to(card.scale, { x: 1.1, y: 1.1, z: 1, duration: 0.3, ease: "power2.out" });
        } else {
          mat.color.set(0xdddddd);
          mat.emissive.set(0x000000);
          mat.emissiveIntensity = 0;
          gsap.to(card.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: "power2.out" });
        }
      });
    }

    // User interaction variables
    let isDragging = false;
    let previousX = 0;
    let rotationY = 0;
    let velocity = 0;

    function onPointerDown(e) {
      isDragging = true;
      previousX = e.clientX;
    }

    function onPointerMove(e) {
      if (!isDragging) return;

      const deltaX = e.clientX - previousX;
      previousX = e.clientX;

      velocity = deltaX * 0.01;
      rotationY += velocity;
    }

    function onPointerUp() {
      isDragging = false;
    }

    container.addEventListener("pointerdown", onPointerDown, { passive: true });
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerup", onPointerUp, { passive: true });
    container.addEventListener("pointerleave", onPointerUp, { passive: true });

    // Initial states
    group.rotation.y = 0;
    group.position.x = 0;
    group.scale.set(1.3, 1.3, 1.3);

    statementEl.style.opacity = "0";
    statementEl.style.transform = "translateX(100px)";

    // Entrance animation timeline
    const entranceTl = gsap.timeline();

    // small pause
    entranceTl.to({}, { duration: 0.5 });

    // rotate 360deg in 4 seconds
    entranceTl.to(
      group.rotation,
      {
        y: "+=6.28319",
        duration: 4,
        ease: "power2.inOut",
        onUpdate: () => {
          updateSpotlight(group.rotation.y);
        },
      },
      0
    );

    // move right and scale down in 2 seconds
    entranceTl.to(
      group.position,
      { x: window.innerWidth * 0.25, duration: 2, ease: "power3.inOut" },
      "+=0.5"
    );
    entranceTl.to(
      group.scale,
      { x: 0.8, y: 0.8, z: 0.8, duration: 2, ease: "power3.inOut" },
      "<"
    );

    // show statement faded in and slide in
    entranceTl.to(
      statementEl.style,
      { opacity: 1, transform: "translateX(0)", duration: 1.5, ease: "power2.out" },
      "<"
    );

    // animation loop
    function animate() {
      resizeRenderer();

      if (!isDragging) {
        velocity *= 0.93;
        rotationY += 0.003 + velocity;
      } else {
        velocity *= 0.93;
        rotationY += velocity;
      }

      group.rotation.y = rotationY % (2 * Math.PI);
      updateSpotlight(group.rotation.y);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", resizeRenderer);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);

      // Dispose materials and textures to prevent memory leaks
      cards.forEach(card => {
        if (card.material) {
          card.material.map?.dispose();
          card.material.dispose();
        }
        card.geometry.dispose();
        scene.remove(card);
      });

      renderer.dispose();
    };
  }, []);

  return (
    <>
      <style>{`
        #container {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 5vw;
          box-sizing: border-box;
          background: #121212;
          user-select: none;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        #three-canvas {
          width: 50vw;
          height: 80vh;
          display: block;
        }
        #statement {
          color: white;
          font-weight: 900;
          font-size: 3.5rem;
          max-width: 30vw;
          margin-left: 5vw;
          user-select: none;
          opacity: 0;
          transform: translateX(100px);
          transition: opacity 1.5s ease, transform 1.5s ease;
          align-self: center;
          pointer-events: none;
        }
        #statement.visible {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 1000px) {
          #three-canvas {
            width: 70vw;
            height: 60vh;
          }
          #statement {
            font-size: 2rem;
            max-width: 40vw;
            margin-left: 3vw;
          }
        }
      `}</style>

      <div id="container" ref={containerRef} tabIndex={0} aria-label="3D interactive rotating image carousel with statement">
        <canvas id="three-canvas" ref={canvasRef} aria-label="3D Carousel Canvas"></canvas>
        <div id="statement" ref={statementRef} aria-live="polite" role="banner">
          WE BUILD THOSE WHO GET IT DONE
        </div>
      </div>
    </>
  );
};

export default BannerCarousel;