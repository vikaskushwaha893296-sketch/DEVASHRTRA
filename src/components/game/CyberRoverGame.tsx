import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, Pause, Play, RotateCcw, ArrowLeft, Trophy, Shield, Zap, Sparkles } from 'lucide-react';

interface CyberRoverGameProps {
  onBackToApp: () => void;
  onSaveHighScore?: (score: number) => void;
}

export const CyberRoverGame: React.FC<CyberRoverGameProps> = ({
  onBackToApp,
  onSaveHighScore,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Game UI States: 'title' | 'playing' | 'paused' | 'gameover' | 'victory'
  const [gameState, setGameState] = useState<'title' | 'playing' | 'paused' | 'gameover' | 'victory'>('title');
  const [score, setScore] = useState<number>(0);
  const [shield, setShield] = useState<number>(100);
  const [energy, setEnergy] = useState<number>(100);
  const [coresRemaining, setCoresRemaining] = useState<number>(8);
  const [muted, setMuted] = useState<boolean>(false);

  // References for mutable game loop state
  const stateRef = useRef({
    gameState: 'title',
    score: 0,
    shield: 100,
    energy: 100,
    coresRemaining: 8,
    muted: false,
    keys: { forward: false, backward: false, left: false, right: false, boost: false },
  });

  // Keep stateRef synced with React state
  useEffect(() => {
    stateRef.current.gameState = gameState;
    stateRef.current.muted = muted;
  }, [gameState, muted]);

  // Procedural Web Audio Sound Synthesizer
  const playSound = (type: 'pickup' | 'hit' | 'boost' | 'start' | 'win') => {
    if (stateRef.current.muted) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'pickup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'boost') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        osc.frequency.setValueAtTime(1046.50, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // AudioContext not allowed before user gesture
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a14);
    scene.fog = new THREE.FogExp2(0x060a14, 0.018);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 12, -18);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting Rig (Warm key + cool hemisphere + soft rim)
    const keyLight = new THREE.DirectionalLight(0xa5f3fc, 2.4);
    keyLight.position.set(20, 30, 20);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2);
    scene.add(hemiLight);

    // 3. Terrain with Sci-Fi Grid
    const terrainGeo = new THREE.PlaneGeometry(160, 160, 40, 40);
    terrainGeo.rotateX(-Math.PI / 2);

    // Procedural terrain texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0a101d';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    const gridTexture = new THREE.CanvasTexture(canvas);
    gridTexture.wrapS = THREE.RepeatWrapping;
    gridTexture.wrapT = THREE.RepeatWrapping;
    gridTexture.repeat.set(16, 16);
    gridTexture.colorSpace = THREE.SRGBColorSpace;

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x091222,
      roughness: 0.85,
      metalness: 0.2,
      map: gridTexture,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 4. Composite 3-12 Part Procedural Rover Model (THREE.Group)
    const rover = new THREE.Group();

    // Part 1: Main Chassis (hull)
    const hullGeo = new THREE.BoxGeometry(2.4, 0.8, 3.6);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Electric Azure
      metalness: 0.85,
      roughness: 0.2,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.y = 1.0;
    hull.castShadow = true;
    rover.add(hull);

    // Part 2: Cockpit Canopy Glass
    const cockpitGeo = new THREE.SphereGeometry(0.9, 16, 12);
    cockpitGeo.scale(1, 0.7, 1.4);
    const cockpitMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.85,
    });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.set(0, 1.5, 0.2);
    rover.add(cockpit);

    // Part 3-6: 4 All-Terrain Cyber Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.45, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1,
    });

    const wheelPositions = [
      [-1.4, 0.6, 1.2],
      [1.4, 0.6, 1.2],
      [-1.4, 0.6, -1.2],
      [1.4, 0.6, -1.2],
    ];
    const wheels: THREE.Mesh[] = [];
    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      rover.add(wheel);
      wheels.push(wheel);
    });

    // Part 7: Sensor Antenna Mast
    const mastGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0.8, 1.8, -1.2);
    rover.add(mast);

    // Part 8: Front Headlights (Emissive Cyan)
    const lightGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const leftLight = new THREE.Mesh(lightGeo, lightMat);
    leftLight.position.set(-0.8, 1.0, 1.85);
    const rightLight = new THREE.Mesh(lightGeo, lightMat);
    rightLight.position.set(0.8, 1.0, 1.85);
    rover.add(leftLight);
    rover.add(rightLight);

    // Part 9: Rear Turbo Thruster Exhaust with Flame
    const exhaustGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.5, 12);
    exhaustGeo.rotateX(Math.PI / 2);
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
    const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
    exhaust.position.set(0, 1.0, -1.9);
    rover.add(exhaust);

    const flameGeo = new THREE.ConeGeometry(0.25, 0.8, 8);
    flameGeo.rotateX(-Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, 1.0, -2.4);
    flame.visible = false;
    rover.add(flame);

    // Contact Shadow Grounding
    const shadowGeo = new THREE.PlaneGeometry(3.6, 4.8);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.position.y = 0.03;
    rover.add(contactShadow);

    scene.add(rover);

    // 5. Data Cores (Gems to collect)
    const coreCount = 8;
    const coreMeshes: THREE.Mesh[] = [];
    const coreGeo = new THREE.OctahedronGeometry(0.8, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber Gold
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.8,
    });

    const coreLocations = [
      [-15, 1.5, 12],
      [18, 1.5, 20],
      [-25, 1.5, -15],
      [22, 1.5, -28],
      [0, 1.5, 32],
      [-12, 1.5, 38],
      [15, 1.5, -10],
      [-32, 1.5, 5],
    ];

    coreLocations.forEach((pos) => {
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(pos[0], pos[1], pos[2]);
      core.castShadow = true;
      scene.add(core);
      coreMeshes.push(core);
    });

    // 6. Monolith Obstacles
    const monolithGeo = new THREE.BoxGeometry(3, 8, 3);
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.3,
    });
    const monoliths: THREE.Mesh[] = [];
    const monolithPositions = [
      [8, 4, 10],
      [-10, 4, -8],
      [15, 4, -18],
      [-20, 4, 25],
      [25, 4, 15],
    ];
    monolithPositions.forEach((pos) => {
      const mono = new THREE.Mesh(monolithGeo, monolithMat);
      mono.position.set(pos[0], pos[1], pos[2]);
      mono.castShadow = true;
      scene.add(mono);
      monoliths.push(mono);
    });

    // 7. Input Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') stateRef.current.keys.forward = true;
      if (code === 'KeyS' || code === 'ArrowDown') stateRef.current.keys.backward = true;
      if (code === 'KeyA' || code === 'ArrowLeft') stateRef.current.keys.left = true;
      if (code === 'KeyD' || code === 'ArrowRight') stateRef.current.keys.right = true;
      if (code === 'Space') {
        stateRef.current.keys.boost = true;
        if (stateRef.current.gameState === 'title') {
          setGameState('playing');
          playSound('start');
        }
      }
      if (code === 'Escape' || code === 'KeyP') {
        if (stateRef.current.gameState === 'playing') setGameState('paused');
        else if (stateRef.current.gameState === 'paused') setGameState('playing');
      }
      if (code === 'Enter' && stateRef.current.gameState === 'title') {
        setGameState('playing');
        playSound('start');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') stateRef.current.keys.forward = false;
      if (code === 'KeyS' || code === 'ArrowDown') stateRef.current.keys.backward = false;
      if (code === 'KeyA' || code === 'ArrowLeft') stateRef.current.keys.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') stateRef.current.keys.right = false;
      if (code === 'Space') stateRef.current.keys.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 8. Physics & Simulation Loop
    let lastTime = performance.now();
    let roverSpeed = 0;
    let roverHeading = 0;
    let animId = 0;

    const clock = new THREE.Clock();

    const gameLoop = () => {
      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);

      // Title screen idle rotation
      if (stateRef.current.gameState === 'title') {
        rover.rotation.y += 0.01;
        coreMeshes.forEach((c, idx) => {
          c.rotation.y += 0.02;
          c.position.y = 1.5 + Math.sin(Date.now() * 0.003 + idx) * 0.3;
        });
        renderer.render(scene, camera);
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      if (stateRef.current.gameState === 'playing') {
        const { keys } = stateRef.current;

        // Steering
        const turnSpeed = 2.4;
        if (keys.left) roverHeading += turnSpeed * dt;
        if (keys.right) roverHeading -= turnSpeed * dt;
        rover.rotation.y = roverHeading;

        // Acceleration
        let maxSpeed = 16.0;
        let accel = 22.0;

        if (keys.boost && stateRef.current.energy > 5) {
          maxSpeed = 26.0;
          accel = 38.0;
          flame.visible = true;
          stateRef.current.energy = Math.max(0, stateRef.current.energy - dt * 25);
          setEnergy(Math.round(stateRef.current.energy));
          if (Math.random() < 0.1) playSound('boost');
        } else {
          flame.visible = false;
          stateRef.current.energy = Math.min(100, stateRef.current.energy + dt * 10);
          setEnergy(Math.round(stateRef.current.energy));
        }

        if (keys.forward) {
          roverSpeed = Math.min(roverSpeed + accel * dt, maxSpeed);
        } else if (keys.backward) {
          roverSpeed = Math.max(roverSpeed - accel * dt, -maxSpeed * 0.5);
        } else {
          roverSpeed *= Math.exp(-3.0 * dt); // Friction damping
        }

        // Apply Velocity
        rover.position.x += Math.sin(roverHeading) * roverSpeed * dt;
        rover.position.z += Math.cos(roverHeading) * roverSpeed * dt;

        // Boundary clamp
        rover.position.x = Math.max(-70, Math.min(70, rover.position.x));
        rover.position.z = Math.max(-70, Math.min(70, rover.position.z));

        // Rotate wheels
        wheels.forEach((w) => {
          w.rotation.x += roverSpeed * 0.2;
        });

        // Rotate Cores & Collision Detection
        coreMeshes.forEach((core) => {
          if (!core.visible) return;
          core.rotation.y += 0.03;
          core.position.y = 1.5 + Math.sin(Date.now() * 0.004) * 0.25;

          const dist = rover.position.distanceTo(core.position);
          if (dist < 2.5) {
            core.visible = false;
            playSound('pickup');
            stateRef.current.score += 250;
            stateRef.current.coresRemaining -= 1;
            setScore(stateRef.current.score);
            setCoresRemaining(stateRef.current.coresRemaining);

            if (stateRef.current.coresRemaining <= 0) {
              setGameState('victory');
              playSound('win');
              if (onSaveHighScore) onSaveHighScore(stateRef.current.score);
            }
          }
        });

        // Monolith Hazard Collisions
        monoliths.forEach((m) => {
          const dist = rover.position.distanceTo(m.position);
          if (dist < 3.2) {
            // Bounce back
            roverSpeed = -roverSpeed * 0.6;
            rover.position.x -= Math.sin(roverHeading) * 1.5;
            rover.position.z -= Math.cos(roverHeading) * 1.5;
            stateRef.current.shield = Math.max(0, stateRef.current.shield - 18);
            setShield(Math.round(stateRef.current.shield));
            playSound('hit');

            if (stateRef.current.shield <= 0) {
              setGameState('gameover');
              playSound('hit');
            }
          }
        });

        // Smooth Follow Camera
        const targetCamX = rover.position.x - Math.sin(roverHeading) * 14;
        const targetCamY = rover.position.y + 8;
        const targetCamZ = rover.position.z - Math.cos(roverHeading) * 14;

        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4, dt);
        camera.lookAt(rover.position.x, rover.position.y + 1.2, rover.position.z);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const resetGame = () => {
    setScore(0);
    setShield(100);
    setEnergy(100);
    setCoresRemaining(8);
    setGameState('playing');
    playSound('start');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060a14] font-sans select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* TOP PERIMETER HUD (Active during play) */}
      {gameState === 'playing' && (
        <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none p-6 flex items-start justify-between">
          {/* Top Left: Score & Cores */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 pointer-events-auto">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Score</div>
              <div className="font-mono text-xl font-bold text-amber-300 tabular-nums">{score}</div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Cores Remaining</div>
              <div className="font-mono text-xl font-bold text-cyan-300 tabular-nums">{coresRemaining} / 8</div>
            </div>
          </div>

          {/* Top Right: Shield & Energy Clusters + Controls */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-400" />
                <div>
                  <div className="text-[10px] text-slate-400">SHIELD</div>
                  <div className="text-white font-bold tabular-nums">{shield}%</div>
                </div>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <div>
                  <div className="text-[10px] text-slate-400">BOOST</div>
                  <div className="text-cyan-300 font-bold tabular-nums">{energy}%</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setMuted(!muted)}
              className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors"
              title="Toggle Audio"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setGameState('paused')}
              className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors"
              title="Pause (Esc)"
            >
              <Pause className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROL HINT BAR (Minimal, single flat line) */}
      {gameState === 'playing' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-xs font-mono text-slate-400 bg-slate-950/70 border border-slate-800/80 px-4 py-1.5 rounded-full">
          WASD / Arrows Steer · Space Thruster Boost · Avoid Monoliths · Esc Pause
        </div>
      )}

      {/* TITLE SCREEN (Full-Viewport Game Shell) */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12 bg-gradient-to-t from-[#060a14]/90 via-transparent to-[#060a14]/70">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToApp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Devashtra Workspace</span>
            </button>
            <div className="text-xs font-mono text-cyan-400">Devashtra Junior 3D Lab</div>
          </div>

          {/* Center Title Lockup over 30-40% Negative Space */}
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>3D Interactive Simulation</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none">
              CYBER ROVER: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">DATA CORE RESCUE</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Pilot the algorithmic Mars Rover across the grid terrain. Recover the 8 scattered cryptographic Data Cores before shields deplete.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setGameState('playing');
                  playSound('start');
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-heading font-bold text-sm hover:from-cyan-300 hover:to-teal-300 shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
              >
                START MISSION (Space / Enter)
              </button>
            </div>
          </div>

          {/* Bottom Control Hint */}
          <div className="text-center text-xs font-mono text-slate-500">
            W, A, S, D to Steer · Space to Boost · 60 FPS Procedural PBR Physics
          </div>
        </div>
      )}

      {/* PAUSE MODAL */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#091122] p-8 text-center space-y-6">
            <h2 className="font-heading text-2xl font-bold text-white">Mission Paused</h2>
            <div className="space-y-3">
              <button
                onClick={() => setGameState('playing')}
                className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors"
              >
                Resume Mission
              </button>
              <button
                onClick={resetGame}
                className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
              >
                Restart Mission
              </button>
              <button
                onClick={onBackToApp}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-300"
              >
                Exit to Devashtra Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {gameState === 'victory' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/75">
          <div className="w-full max-w-md rounded-2xl border border-teal-500/40 bg-[#091122] p-8 text-center space-y-5 shadow-2xl shadow-teal-500/20">
            <div className="h-16 w-16 rounded-full bg-teal-500/20 text-teal-300 mx-auto flex items-center justify-center border border-teal-500/40">
              <Trophy className="h-8 w-8" />
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-white">
              Mission Accomplished!
            </h2>
            <p className="text-slate-300 text-sm">
              All 8 cryptographic Data Cores successfully recovered! Rover shields intact at {shield}%.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm text-cyan-300">
              Final Score: <strong className="text-white text-lg">{score}</strong> (+350 XP awarded)
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={resetGame}
                className="flex-1 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase hover:bg-cyan-300 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={onBackToApp}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase hover:bg-slate-700 transition-colors"
              >
                Exit Lab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER MODAL */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/75">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-[#091122] p-8 text-center space-y-5 shadow-2xl shadow-rose-500/20">
            <h2 className="font-heading text-3xl font-extrabold text-white">
              Shield Depleted
            </h2>
            <p className="text-slate-300 text-sm">
              The rover sustained critical structural damage from monolith collisions.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm text-slate-300">
              Cores Recovered: {8 - coresRemaining} / 8 · Score: {score}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={resetGame}
                className="flex-1 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase hover:bg-cyan-300 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onBackToApp}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase hover:bg-slate-700 transition-colors"
              >
                Exit Lab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
