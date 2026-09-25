"use client";

import { useEffect, useRef, useState } from "react";

type QualityCameraProps = {
  onImageCaptured?: (imageData: string) => void;
};

export default function QualityCamera({
  onImageCaptured,
}: QualityCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState("");

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const openCamera = async () => {
    setCameraError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Camera access is not supported by this browser."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraOpen(true);
    } catch (error) {
      console.error("Camera access error:", error);

      setCameraError(
        "Camera permission was denied or the camera is unavailable."
      );
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError("Camera is not ready yet. Please wait a moment.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Unable to capture the camera image.");
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData = canvas.toDataURL("image/jpeg", 0.9);

    setCapturedImage(imageData);

    onImageCaptured?.(imageData);

    stopCamera();
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setCameraError("");
    openCamera();
  };

  const removeImage = () => {
    setCapturedImage(null);
    setCameraError("");
    onImageCaptured?.("");
  };

  return (
    <div
      style={{
        marginTop: "18px",
        padding: "18px",
        borderRadius: "16px",
        border: "1px solid #dce8ef",
        background: "#fbfdff",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      {/* TITLE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.7px",
              color: "#168acb",
            }}
          >
            AI QUALITY INSPECTION
          </p>

          <h4
            style={{
              margin: "5px 0 0",
              fontSize: "17px",
              color: "#17324d",
            }}
          >
            Capture produce image
          </h4>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: "12px",
              lineHeight: 1.5,
              color: "#718494",
            }}
          >
            Capture a clear image of the delivered produce for quality
            assessment.
          </p>
        </div>

        <div
          style={{
            padding: "7px 10px",
            borderRadius: "8px",
            background: "#e9f7fd",
            color: "#0787bd",
            fontSize: "11px",
            fontWeight: 800,
          }}
        >
          YOLO + EfficientNet
        </div>
      </div>

      {/* CAMERA VIEW */}
      {cameraOpen && (
        <div style={{ marginTop: "16px" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              overflow: "hidden",
              borderRadius: "14px",
              background: "#10202d",
              aspectRatio: "16 / 9",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* CAMERA GUIDE */}
            <div
              style={{
                position: "absolute",
                inset: "12%",
                border: "2px solid rgba(255,255,255,0.85)",
                borderRadius: "16px",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "16px",
                display: "flex",
                justifyContent: "center",
                background:
                  "linear-gradient(transparent, rgba(0,0,0,0.55))",
              }}
            >
              <button
                type="button"
                onClick={captureImage}
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  border: "5px solid #ffffff",
                  background: "#079bd3",
                  cursor: "pointer",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.3)",
                }}
                aria-label="Capture produce"
              />
            </div>
          </div>

          <p
            style={{
              margin: "9px 0 0",
              textAlign: "center",
              color: "#718494",
              fontSize: "12px",
            }}
          >
            Place the produce inside the frame and capture a clear image.
          </p>
        </div>
      )}

      {/* CAPTURED IMAGE */}
      {capturedImage && !cameraOpen && (
        <div style={{ marginTop: "16px" }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "14px",
              background: "#10202d",
            }}
          >
            <img
              src={capturedImage}
              alt="Captured produce"
              style={{
                width: "100%",
                maxHeight: "360px",
                objectFit: "cover",
                display: "block",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                padding: "7px 10px",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#16844a",
                fontSize: "11px",
                fontWeight: 800,
              }}
            >
              ✓ Image Captured
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={retakeImage}
              style={{
                flex: 1,
                minWidth: "130px",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #cfe1eb",
                background: "#ffffff",
                color: "#168acb",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              ↻ Retake
            </button>

            <button
              type="button"
              onClick={removeImage}
              style={{
                flex: 1,
                minWidth: "130px",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #f0d7d7",
                background: "#fff8f8",
                color: "#c15c5c",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Remove Image
            </button>
          </div>

          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              borderRadius: "10px",
              background: "#eef9f3",
              color: "#16844a",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            ✓ Image captured successfully.
            <br />
            The next AI step will send this image to the FastAPI quality
            assessment service.
          </div>
        </div>
      )}

      {/* OPEN CAMERA */}
      {!cameraOpen && !capturedImage && (
        <button
          type="button"
          onClick={openCamera}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "14px 18px",
            border: "none",
            borderRadius: "11px",
            background: "#079bd3",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow:
              "0 7px 18px rgba(7, 155, 211, 0.2)",
          }}
        >
          📷 Open Camera
        </button>
      )}

      {/* ERROR */}
      {cameraError && (
        <div
          style={{
            marginTop: "12px",
            padding: "11px 13px",
            borderRadius: "10px",
            background: "#fff4f4",
            border: "1px solid #f0d4d4",
            color: "#b54d4d",
            fontSize: "12px",
            lineHeight: 1.5,
          }}
        >
          {cameraError}
        </div>
      )}
    </div>
  );
}