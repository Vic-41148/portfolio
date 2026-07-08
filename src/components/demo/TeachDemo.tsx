"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { HandLandmarker, FilesetResolver, type NormalizedLandmark } from "@mediapipe/tasks-vision";
import { Camera, CameraOff, RefreshCw, Plus, Trash2, Trophy, Shield, Hand, Lightbulb, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GestureClass {
  id: string;
  name: string;
  samples: number[][];
  color: string;
}

interface Prediction {
  label: string;
  confidence: number;
}

function normalizeLandmarks(
  landmarks: NormalizedLandmark[]
): number[] {
  if (landmarks.length === 0) return [];

  const wrist = landmarks[0];
  const features: number[] = [];

  for (let i = 0; i < landmarks.length; i++) {
    features.push(landmarks[i].x - wrist.x);
    features.push(landmarks[i].y - wrist.y);
    features.push(landmarks[i].z - wrist.z);
  }

  const mag = Math.sqrt(features.reduce((s, v) => s + v * v, 0));
  if (mag > 0) {
    for (let i = 0; i < features.length; i++) {
      features[i] /= mag;
    }
  }

  return features;
}

function knnPredict(
  features: number[],
  classes: GestureClass[],
  k: number = 5
): Prediction | null {
  const allSamples: { features: number[]; label: string }[] = [];
  for (const cls of classes) {
    for (const sample of cls.samples) {
      allSamples.push({ features: sample, label: cls.name });
    }
  }

  if (allSamples.length === 0) return null;

  const distances = allSamples.map((sample) => {
    let dist = 0;
    for (let i = 0; i < features.length; i++) {
      const diff = features[i] - sample.features[i];
      dist += diff * diff;
    }
    return { dist: Math.sqrt(dist), label: sample.label };
  });

  distances.sort((a, b) => a.dist - b.dist);

  const topK = distances.slice(0, k);
  const votes: Record<string, number> = {};
  for (const { label } of topK) {
    votes[label] = (votes[label] || 0) + 1;
  }

  let bestLabel = "";
  let bestCount = 0;
  for (const [label, count] of Object.entries(votes)) {
    if (count > bestCount) {
      bestCount = count;
      bestLabel = label;
    }
  }

  return { label: bestLabel, confidence: bestCount / k };
}

const CLASS_COLORS = ["#22D3EE", "#22D68C", "#F5A623", "#FF6B6B", "#A78BFA"];

const STEPS = [
  { icon: Hand, label: "Show a gesture" },
  { icon: Lightbulb, label: "Teach it the name" },
  { icon: Sparkles, label: "It learns instantly" },
];

export function TeachDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const lastClassifyRef = useRef<number>(0);

  const [cameraActive, setCameraActive] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gestureClasses, setGestureClasses] = useState<GestureClass[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [isTrained, setIsTrained] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [newClassName, setNewClassName] = useState("");

  const startCamera = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      let handLandmarker: HandLandmarker;
      try {
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      } catch {
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      }

      handLandmarkerRef.current = handLandmarker;
      setModelLoaded(true);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setCameraActive(true);
      setLoading(false);
    } catch (err) {
      console.error("Camera/model init error:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize");
      setLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setCameraActive(false);
    setPrediction(null);
    setIsTrained(false);
    setGestureClasses([]);
  }, []);

  const addClass = useCallback(() => {
    const name = newClassName.trim() || `Gesture ${gestureClasses.length + 1}`;
    if (gestureClasses.some((c) => c.name === name)) return;
    setGestureClasses((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        samples: [],
        color: CLASS_COLORS[prev.length % CLASS_COLORS.length],
      },
    ]);
    setNewClassName("");
  }, [gestureClasses, newClassName]);

  const removeClass = useCallback((id: string) => {
    setGestureClasses((prev) => prev.filter((c) => c.id !== id));
    setIsTrained(false);
    setPrediction(null);
  }, []);

  const captureSamples = useCallback(
    async (classId: string) => {
      const video = videoRef.current;
      const handLandmarker = handLandmarkerRef.current;
      if (!video || !handLandmarker || !cameraActive) return;

      setIsCapturing(true);
      setCaptureProgress(0);
      setShowControls(false);

      const targetSamples = 20;
      const collected: number[][] = [];

      for (let i = 0; i < targetSamples; i++) {
        const result = handLandmarker.detectForVideo(video, performance.now());

        if (result.landmarks && result.landmarks.length > 0) {
          const features = normalizeLandmarks(result.landmarks[0]);
          if (features.length > 0) {
            collected.push(features);
          }
        }

        setCaptureProgress(((i + 1) / targetSamples) * 100);

        await new Promise((r) => setTimeout(r, 50));
      }

      if (collected.length >= 5) {
        setGestureClasses((prev) =>
          prev.map((c) =>
            c.id === classId
              ? { ...c, samples: [...c.samples, ...collected] }
              : c
          )
        );
      }

      setIsCapturing(false);
      setCaptureProgress(0);
      setShowControls(true);
    },
    [cameraActive]
  );

  const trainAndClassify = useCallback(() => {
    const hasSamples = gestureClasses.some((c) => c.samples.length > 0);
    if (!hasSamples) return;
    setIsTrained(true);
  }, [gestureClasses]);

  const resetAll = useCallback(() => {
    setGestureClasses([]);
    setIsTrained(false);
    setPrediction(null);
    setShowControls(true);
  }, []);

  useEffect(() => {
    if (!cameraActive || !modelLoaded || !isTrained) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const handLandmarker = handLandmarkerRef.current;
    if (!video || !canvas || !handLandmarker) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const classifyFrame = (timestamp: number) => {
      if (video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(classifyFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const result = handLandmarker.detectForVideo(video, timestamp);

      if (result.landmarks && result.landmarks.length > 0) {
        for (const landmarks of result.landmarks) {
          ctx.strokeStyle = "#22D3EE";
          ctx.lineWidth = 2;

          const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20],
            [5, 9], [9, 13], [13, 17],
          ];

          for (const [i, j] of connections) {
            ctx.beginPath();
            ctx.moveTo(landmarks[i].x * canvas.width, landmarks[i].y * canvas.height);
            ctx.lineTo(landmarks[j].x * canvas.width, landmarks[j].y * canvas.height);
            ctx.stroke();
          }

          for (const lm of landmarks) {
            ctx.beginPath();
            ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "#22D3EE";
            ctx.fill();
          }

          if (isTrained && Date.now() - lastClassifyRef.current > 100) {
            const features = normalizeLandmarks(landmarks);
            if (features.length > 0) {
              const pred = knnPredict(features, gestureClasses);
              if (pred) {
                setPrediction(pred);
              }
            }
            lastClassifyRef.current = Date.now();
          }
        }
      } else {
        setPrediction(null);
      }

      animFrameRef.current = requestAnimationFrame(classifyFrame);
    };

    animFrameRef.current = requestAnimationFrame(classifyFrame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cameraActive, modelLoaded, isTrained, gestureClasses]);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-demo-warning/10 border border-demo-warning/20 flex items-center justify-center mb-5">
          <CameraOff className="w-7 h-7 text-demo-warning" />
        </div>
        <h3 className="text-xl font-display font-semibold mb-2">
          Camera unavailable
        </h3>
        <p className="text-sm text-text-muted mb-6 max-w-md">{error}</p>
        <button
          onClick={startCamera}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:brightness-110 transition-all active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </button>
      </div>
    );
  }

  // Loading state
  if (loading && !cameraActive) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-muted border border-accent/20 flex items-center justify-center mb-5">
          <RefreshCw className="w-7 h-7 text-accent animate-spin" />
        </div>
        <h3 className="text-lg font-display font-semibold mb-2">
          Loading the model
        </h3>
        <p className="text-sm text-text-muted max-w-sm">
          Downloading MediaPipe Hand Landmarker — ~4.2MB. One-time load, then
          everything runs offline.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Main panel */}
      <div className="relative">
        {/* Idle state: camera not yet active */}
        {!cameraActive && (
          <div className="flex flex-col items-center justify-center py-14 sm:py-16 px-6 text-center">
            {/* Preview illustration with radiating pulse rings */}
            <div className="relative w-20 h-20 rounded-2xl bg-accent-muted border border-accent/20 flex items-center justify-center mb-5">
              <span className="pulse-ring" aria-hidden="true" />
              <span className="pulse-ring pulse-ring-late" aria-hidden="true" />
              <Camera className="w-9 h-9 text-accent" />
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-semibold tracking-tight mb-2">
              Teach my page to see you
            </h3>
            <p className="text-sm text-text-secondary max-w-lg mb-8 leading-relaxed">
              Turn on your camera, show it two hand gestures, and the model learns
              to tell them apart — live, in your browser, in seconds.
            </p>

            {/* How it works — 3 steps, icon + short label only */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-2xl w-full">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex flex-col items-center gap-2.5 px-5 py-4 rounded-xl bg-elevated/60 border border-border min-w-[9rem]"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent-muted flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-xs font-medium text-text-primary text-center">{step.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Privacy badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-elevated border border-border text-xs text-text-muted mb-6"
            >
              <Shield className="w-3 h-3 text-demo-success" />
              <span>Nothing leaves your device — zero uploads, private by design</span>
            </motion.div>

            <motion.button
              onClick={startCamera}
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-accent-foreground text-base font-medium transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 glow-pulse btn-sheen"
            >
              <Camera className="w-4 h-4" />
              Turn on camera
            </motion.button>
          </div>
        )}

        {/* Camera active: video feed + prediction */}
        {cameraActive && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-[4/3] object-cover hidden"
            />
            <canvas
              ref={canvasRef}
              className="w-full aspect-[4/3] object-cover"
            />

            <AnimatePresence>
              {prediction && isTrained && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-4 left-4 right-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-strong">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-demo-success"
                      animate={{ opacity: [1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="text-xs text-text-secondary">Live</span>
                  </div>

                  <div className="px-3 py-1.5 rounded-full glass-strong flex items-center gap-2 border border-accent/40 glow-accent">
                    <Trophy className="w-3.5 h-3.5 text-accent" />
                    <span className="text-sm font-medium text-accent">
                      {prediction.label}
                    </span>
                    <div className="w-16 h-1.5 rounded-full bg-elevated overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 12 }}
                      />
                    </div>
                    <span className="text-xs text-text-muted font-mono">
                      {Math.round(prediction.confidence * 100)}%
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-strong text-xs text-text-muted">
                    <Shield className="w-3 h-3 text-demo-success" />
                    On-device
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isTrained && cameraActive && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass-strong text-xs">
                <motion.div
                  className="w-2 h-2 rounded-full bg-demo-success"
                  animate={{ opacity: [1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-text-secondary">Ready to learn</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls below the panel */}
      {cameraActive && (
        <div className="px-5 pb-5 pt-4 border-t border-border space-y-4">
          {!isTrained ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-medium text-text-primary mr-2">
                  1. Add gestures to teach:
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Gesture name"
                    className="w-32 px-2.5 py-1.5 rounded-lg bg-elevated border border-border text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && addClass()}
                  />
                  <button
                    onClick={addClass}
                    disabled={gestureClasses.length >= 5}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:brightness-110 transition-all disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
              </div>

              {/* Gesture classes */}
              <AnimatePresence>
                {gestureClasses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {gestureClasses.map((cls, i) => (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-elevated"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cls.color }}
                        />
                        <span className="text-sm text-text-primary">{cls.name}</span>
                        <span className="text-xs text-text-muted font-mono">
                          {cls.samples.length > 0
                            ? `${cls.samples.reduce((s, v) => s + v.length, 0)} feats`
                            : "0 samples"}
                        </span>
                        <button
                          onClick={() => captureSamples(cls.id)}
                          disabled={isCapturing}
                          className="px-2.5 py-1 rounded-md bg-accent/20 text-accent text-xs font-mono hover:bg-accent/30 transition-colors disabled:opacity-30"
                        >
                          {isCapturing ? "..." : "Capture"}
                        </button>
                        <button
                          onClick={() => removeClass(cls.id)}
                          className="p-1 text-text-muted hover:text-text-primary transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Capture progress */}
              {isCapturing && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Capturing samples...</span>
                    <span>{Math.round(captureProgress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${captureProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Train button */}
              {gestureClasses.some((c) => c.samples.length > 0) && (
                <motion.button
                  onClick={trainAndClassify}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-demo-success text-demo-success-foreground text-sm font-medium hover:brightness-110 transition-all"
                >
                  <Trophy className="w-4 h-4" />
                  Train model &amp; start classifying
                </motion.button>
              )}

              {gestureClasses.length === 0 && showControls && (
                <p className="text-xs text-text-muted">
                  Add at least 2 gestures, capture samples for each, then train
                  the model. It&apos;ll learn to tell them apart in seconds.
                </p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-demo-success"
                  animate={{ opacity: [1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <p className="text-sm text-text-secondary">
                  Model trained on {gestureClasses.length} gestures — making live
                  predictions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsTrained(false);
                    setPrediction(null);
                    setShowControls(true);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  Add more data
                </button>
                <button
                  onClick={resetAll}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={stopCamera}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  <CameraOff className="w-3 h-3" />
                  Stop
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
