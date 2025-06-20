// src/components/FaceAI.jsx
import React, { useRef, useEffect, useState } from "react";
import Human from "@vladmandic/human";

const human = new Human({
  cacheSensitivity: 0,
  modelBasePath: "/models", // Make sure models are in public/models
  face: { enabled: true },
  age: { enabled: true },
  emotion: { enabled: true },
  body: { enabled: false },
  hand: { enabled: false },
});

export default function FaceAI() {
  const videoRef = useRef(null);
  const [age, setAge] = useState(null);
  const [emotion, setEmotion] = useState(null);

  useEffect(() => {
    const start = async () => {
      await human.load();
      await human.warmup();

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const runDetection = async () => {
        if (videoRef.current) {
          const result = await human.detect(videoRef.current);
          if (result.face?.length > 0) {
            const face = result.face[0];
            setAge(face.age?.toFixed(1));
            setEmotion(face.emotion?.[0]?.emotion || "neutral");
          }
        }
        requestAnimationFrame(runDetection);
      };

      runDetection();
    };

    start();
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <video
        ref={videoRef}
        className="w-96 rounded-lg shadow-lg"
        muted
        autoPlay
      />
      <div className="mt-4 text-xl font-semibold">
        {age && <p>👶 Estimated Age: {age}</p>}
        {emotion && <p>🙂 Emotion: {emotion}</p>}
      </div>
    </div>
  );
}
