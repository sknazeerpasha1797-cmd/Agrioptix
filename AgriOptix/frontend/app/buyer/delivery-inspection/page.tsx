"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Farmer = {
  name?: string;
  farm?: string;
  crop?: string;
  location?: string;
  distance?: number;
  quantity?: number;
  quality?: string;
  price?: number;
  delivery?: string;
  verified?: boolean;
  freshness?: string;
  rating?: number;
};

export default function DeliveryInspectionPage() {
  const router = useRouter();

  // =========================================================
  // SAME ORDER DATA USED BY ORDER TRACKING
  // =========================================================

  const [farmer, setFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    try {
      const savedFarmer =
        localStorage.getItem("selectedFarmer");

      if (savedFarmer) {
        setFarmer(JSON.parse(savedFarmer));
      }
    } catch (error) {
      console.error(
        "Unable to load selected order:",
        error
      );
    }
  }, []);

  // =========================================================
  // ORDER DETAILS
  // These use the SAME selectedFarmer data as orders/page.tsx
  // =========================================================

  const crop =
    farmer?.crop || "Tomato";

  const supplier =
    farmer?.farm || "Green Field Organics";

  const farmerName =
    farmer?.name || "Ravi Kumar";

  const farmerLocation =
    farmer?.location || "Nalgonda";

  const expectedQuantity =
    farmer?.quantity || 2000;

  const orderedQuality =
    farmer?.quality || "Grade A";

  const orderedPrice =
    farmer?.price || 29;

  // =========================================================
  // DELIVERY VERIFICATION STATES
  // =========================================================

  const [receivedQuantity, setReceivedQuantity] =
    useState("");

  const [quantityVerified, setQuantityVerified] =
    useState(true);

  const [qualityVerified, setQualityVerified] =
    useState(true);

  const [freshnessVerified, setFreshnessVerified] =
    useState(true);

  // Set received quantity after selected order is loaded.
  // Demo uses 2 kg less than expected.
  useEffect(() => {
    if (farmer?.quantity) {
      setReceivedQuantity(
        Math.max(farmer.quantity - 2, 0).toString()
      );
    } else {
      setReceivedQuantity(
        Math.max(2000 - 2, 0).toString()
      );
    }
  }, [farmer]);

  const received =
    Number(receivedQuantity) || 0;

  const difference =
    expectedQuantity - received;

  // =========================================================
  // CAMERA STATES
  // =========================================================

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [capturedImage, setCapturedImage] =
    useState<string | null>(null);

  const [cameraError, setCameraError] =
    useState("");

  const allVerified =
    quantityVerified &&
    qualityVerified &&
    freshnessVerified &&
    received > 0 &&
    capturedImage !== null;

  // =========================================================
  // STOP CAMERA
  // =========================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    setCameraOpen(false);
  };

  // =========================================================
  // CLEAN CAMERA WHEN PAGE CLOSES
  // =========================================================

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  // =========================================================
  // OPEN CAMERA
  // =========================================================

  const openCamera = async () => {
    setCameraError("");

    try {
      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        setCameraError(
          "Camera access is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
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

      setCameraOpen(true);

      setTimeout(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;

          try {
            await videoRef.current.play();
          } catch (error) {
            console.error(
              "Unable to start video:",
              error
            );
          }
        }
      }, 100);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      setCameraError(
        "Camera permission was denied or the camera is unavailable. Please allow camera access and try again."
      );

      setCameraOpen(false);
    }
  };

  // =========================================================
  // CAPTURE IMAGE
  // =========================================================

  const captureImage = () => {
    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;

    if (!video || !canvas) {
      setCameraError(
        "Camera is not ready. Please try again."
      );
      return;
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setCameraError(
        "Camera is still starting. Please wait a moment and try again."
      );
      return;
    }

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      setCameraError(
        "Unable to capture the image."
      );
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData =
      canvas.toDataURL(
        "image/jpeg",
        0.9
      );

    setCapturedImage(
      imageData
    );

    stopCamera();

    setCameraError("");
  };

  // =========================================================
  // RETAKE
  // =========================================================

  const retakeImage = () => {
    setCapturedImage(null);
    setCameraError("");

    openCamera();
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = () => {
    setCapturedImage(null);
    setCameraError("");
  };

  // =========================================================
  // BACK
  // =========================================================

  const handleBack = () => {
    router.push(
      "/buyer/orders"
    );
  };

  // =========================================================
  // CONFIRM PAYMENT
  // =========================================================

  const handleConfirmPayment = () => {
    if (!capturedImage) {
      alert(
        "Please capture the produce image before continuing."
      );
      return;
    }

    if (!quantityVerified) {
      alert(
        "Please verify the quantity before continuing."
      );
      return;
    }

    if (!qualityVerified) {
      alert(
        "Please verify the quality before continuing."
      );
      return;
    }

    if (!freshnessVerified) {
      alert(
        "Please verify the freshness before continuing."
      );
      return;
    }

    router.push(
      "/buyer/payment"
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5faff",
        padding: "30px 18px 60px",
        color: "#17324d",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "980px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            style={{
              border: "none",
              background:
                "transparent",
              color: "#168acb",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              padding: "0",
              marginBottom:
                "18px",
            }}
          >
            ← Back to Order Tracking
          </button>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap: "18px",
              flexWrap:
                "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin:
                    "0 0 7px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing:
                    "1.5px",
                  color:
                    "#168acb",
                }}
              >
                DELIVERY INSPECTION
              </p>

              <h1
                style={{
                  margin: 0,
                  fontSize:
                    "clamp(27px, 4vw, 40px)",
                  lineHeight: 1.15,
                  color:
                    "#17324d",
                }}
              >
                Verify your delivery
              </h1>

              <p
                style={{
                  margin:
                    "10px 0 0",
                  color:
                    "#687b8d",
                  fontSize:
                    "14px",
                  lineHeight:
                    1.6,
                  maxWidth:
                    "600px",
                }}
              >
                Check quantity,
                quality and
                freshness before
                confirming your
                produce.
              </p>
            </div>

            <div
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                gap: "8px",
                padding:
                  "9px 14px",
                borderRadius:
                  "999px",
                background:
                  "#e9f8ef",
                color:
                  "#16844a",
                fontSize:
                  "12px",
                fontWeight:
                  800,
              }}
            >
              <span>●</span>
              Delivery Arrived
            </div>
          </div>
        </div>

        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <section
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #e0edf5",
            borderRadius:
              "20px",
            padding:
              "24px",
            marginBottom:
              "20px",
            boxShadow:
              "0 8px 30px rgba(24, 86, 120, 0.06)",
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "15px",
              flexWrap:
                "wrap",
              marginBottom:
                "20px",
            }}
          >
            <div>
              <p
                style={{
                  margin:
                    "0 0 5px",
                  color:
                    "#8192a1",
                  fontSize:
                    "11px",
                  fontWeight:
                    800,
                  letterSpacing:
                    "1px",
                }}
              >
                CURRENT ORDER
              </p>

              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "22px",
                  color:
                    "#17324d",
                }}
              >
                {crop} Delivery
              </h2>
            </div>

            <span
              style={{
                padding:
                  "8px 13px",
                borderRadius:
                  "9px",
                background:
                  "#eaf7ff",
                color:
                  "#0787bd",
                fontSize:
                  "12px",
                fontWeight:
                  800,
              }}
            >
              Ready for inspection
            </span>
          </div>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
            }}
          >
            <InfoBox
              label="Produce"
              value={crop}
            />

            <InfoBox
              label="Supplier"
              value={supplier}
            />

            <InfoBox
              label="Quality Ordered"
              value={orderedQuality}
            />

            <InfoBox
              label="Price"
              value={`₹${orderedPrice}/kg`}
            />
          </div>
        </section>

        {/* =================================================
            QUANTITY + QUALITY
        ================================================= */}

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            marginBottom:
              "20px",
          }}
        >

          {/* =================================================
              QUANTITY
          ================================================= */}

          <section
            style={{
              background:
                "#ffffff",
              border:
                "1px solid #e0edf5",
              borderRadius:
                "20px",
              padding:
                "24px",
              boxShadow:
                "0 8px 30px rgba(24, 86, 120, 0.06)",
            }}
          >
            <SectionTitle
              number="01"
              title="Quantity Verification"
              subtitle="Compare expected and received quantity."
            />

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "14px",
                marginTop:
                  "22px",
              }}
            >
              <InfoBox
                label="Expected Quantity"
                value={`${expectedQuantity.toLocaleString()} kg`}
              />

              <div
                style={{
                  padding:
                    "15px",
                  borderRadius:
                    "13px",
                  background:
                    "#f7fbfe",
                  border:
                    "1px solid #dcebf3",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "11px",
                    fontWeight:
                      800,
                    color:
                      "#7c8e9e",
                    marginBottom:
                      "8px",
                  }}
                >
                  RECEIVED QUANTITY
                </label>

                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                  }}
                >
                  <input
                    value={
                      receivedQuantity
                    }
                    onChange={(
                      event
                    ) =>
                      setReceivedQuantity(
                        event.target
                          .value
                      )
                    }
                    type="number"
                    min="0"
                    style={{
                      width:
                        "100%",
                      border:
                        "none",
                      outline:
                        "none",
                      background:
                        "transparent",
                      fontSize:
                        "20px",
                      fontWeight:
                        800,
                      color:
                        "#17324d",
                    }}
                  />

                  <span
                    style={{
                      fontWeight:
                        700,
                      color:
                        "#718494",
                    }}
                  >
                    kg
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop:
                  "15px",
                padding:
                  "12px 14px",
                borderRadius:
                  "11px",
                background:
                  difference === 0
                    ? "#eefaf3"
                    : "#fff8e9",
                color:
                  difference === 0
                    ? "#16844a"
                    : "#a56b00",
                fontSize:
                  "13px",
                fontWeight:
                  700,
              }}
            >
              {difference === 0
                ? "✓ Full quantity received"
                : difference > 0
                  ? `⚠ ${difference} kg less than expected`
                  : `✓ ${Math.abs(
                      difference
                    )} kg above expected quantity`}
            </div>

            <VerificationRow
              checked={
                quantityVerified
              }
              onChange={() =>
                setQuantityVerified(
                  (value) =>
                    !value
                )
              }
              title="Quantity Verified"
              description="Received quantity checked against the order."
            />
          </section>

          {/* =================================================
              QUALITY
          ================================================= */}

          <section
            style={{
              background:
                "#ffffff",
              border:
                "1px solid #e0edf5",
              borderRadius:
                "20px",
              padding:
                "24px",
              boxShadow:
                "0 8px 30px rgba(24, 86, 120, 0.06)",
            }}
          >
            <SectionTitle
              number="02"
              title="Quality Verification"
              subtitle="Confirm the delivered produce quality."
            />

            <div
              style={{
                marginTop:
                  "22px",
                padding:
                  "18px",
                borderRadius:
                  "15px",
                background:
                  "#f5fbff",
                border:
                  "1px solid #dceef7",
              }}
            >
              <span
                style={{
                  fontSize:
                    "11px",
                  fontWeight:
                    800,
                  color:
                    "#7b8d9c",
                  letterSpacing:
                    "0.8px",
                }}
              >
                QUALITY ORDERED
              </span>

              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  marginTop:
                    "9px",
                  gap:
                    "15px",
                  flexWrap:
                    "wrap",
                }}
              >
                <strong
                  style={{
                    fontSize:
                      "25px",
                    color:
                      "#16844a",
                  }}
                >
                  {orderedQuality}
                </strong>

                <span
                  style={{
                    padding:
                      "7px 11px",
                    borderRadius:
                      "8px",
                    background:
                      "#e9f8ef",
                    color:
                      "#16844a",
                    fontSize:
                      "12px",
                    fontWeight:
                      800,
                  }}
                >
                  Order Standard
                </span>
              </div>
            </div>

            <VerificationRow
              checked={
                qualityVerified
              }
              onChange={() =>
                setQualityVerified(
                  (value) =>
                    !value
                )
              }
              title="Quality Verified"
              description={`Produce quality checked against the agreed ${orderedQuality} standard.`}
            />

            {/* =================================================
                CAMERA
            ================================================= */}

            <div
              style={{
                marginTop:
                  "18px",
                padding:
                  "18px",
                borderRadius:
                  "16px",
                border:
                  "1px solid #dce8ef",
                background:
                  "#fbfdff",
              }}
            >
              <canvas
                ref={
                  canvasRef
                }
                style={{
                  display:
                    "none",
                }}
              />

              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  gap:
                    "12px",
                  flexWrap:
                    "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "12px",
                      fontWeight:
                        800,
                      letterSpacing:
                        "0.7px",
                      color:
                        "#168acb",
                    }}
                  >
                    AI QUALITY INSPECTION
                  </p>

                  <h4
                    style={{
                      margin:
                        "5px 0 0",
                      fontSize:
                        "17px",
                      color:
                        "#17324d",
                    }}
                  >
                    Capture produce image
                  </h4>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      fontSize:
                        "12px",
                      lineHeight:
                        1.5,
                      color:
                        "#718494",
                    }}
                  >
                    Capture a clear
                    image of the
                    delivered{" "}
                    {crop.toLowerCase()}{" "}
                    for quality
                    assessment.
                  </p>
                </div>

                <div
                  style={{
                    padding:
                      "7px 10px",
                    borderRadius:
                      "8px",
                    background:
                      "#e9f7fd",
                    color:
                      "#0787bd",
                    fontSize:
                      "11px",
                    fontWeight:
                      800,
                  }}
                >
                  YOLO + EfficientNet
                </div>
              </div>

              {/* =================================================
                  LIVE CAMERA
              ================================================= */}

              {cameraOpen && (
                <div
                  style={{
                    marginTop:
                      "16px",
                  }}
                >
                  <div
                    style={{
                      position:
                        "relative",
                      width:
                        "100%",
                      overflow:
                        "hidden",
                      borderRadius:
                        "14px",
                      background:
                        "#10202d",
                      aspectRatio:
                        "16 / 9",
                    }}
                  >
                    <video
                      ref={
                        videoRef
                      }
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width:
                          "100%",
                        height:
                          "100%",
                        objectFit:
                          "cover",
                        display:
                          "block",
                      }}
                    />

                    <div
                      style={{
                        position:
                          "absolute",
                        inset:
                          "12%",
                        border:
                          "2px solid rgba(255,255,255,0.85)",
                        borderRadius:
                          "16px",
                        pointerEvents:
                          "none",
                      }}
                    />

                    <div
                      style={{
                        position:
                          "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding:
                          "16px",
                        display:
                          "flex",
                        justifyContent:
                          "center",
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.55))",
                      }}
                    >
                      <button
                        type="button"
                        onClick={
                          captureImage
                        }
                        style={{
                          width:
                            "68px",
                          height:
                            "68px",
                          borderRadius:
                            "50%",
                          border:
                            "5px solid #ffffff",
                          background:
                            "#079bd3",
                          cursor:
                            "pointer",
                          boxShadow:
                            "0 5px 20px rgba(0,0,0,0.3)",
                        }}
                        aria-label="Capture produce"
                      />
                    </div>
                  </div>

                  <p
                    style={{
                      margin:
                        "9px 0 0",
                      textAlign:
                        "center",
                      color:
                        "#718494",
                      fontSize:
                        "12px",
                    }}
                  >
                    Place the{" "}
                    {crop.toLowerCase()}{" "}
                    inside the frame
                    and capture a
                    clear image.
                  </p>
                </div>
              )}

              {/* =================================================
                  CAPTURED IMAGE
              ================================================= */}

              {capturedImage &&
                !cameraOpen && (
                  <div
                    style={{
                      marginTop:
                        "16px",
                    }}
                  >
                    <div
                      style={{
                        position:
                          "relative",
                        overflow:
                          "hidden",
                        borderRadius:
                          "14px",
                        background:
                          "#10202d",
                      }}
                    >
                      <img
                        src={
                          capturedImage
                        }
                        alt="Captured produce"
                        style={{
                          width:
                            "100%",
                          maxHeight:
                            "360px",
                          objectFit:
                            "cover",
                          display:
                            "block",
                        }}
                      />

                      <div
                        style={{
                          position:
                            "absolute",
                          top:
                            "12px",
                          right:
                            "12px",
                          padding:
                            "7px 10px",
                          borderRadius:
                            "8px",
                          background:
                            "#ffffff",
                          color:
                            "#16844a",
                          fontSize:
                            "11px",
                          fontWeight:
                            800,
                        }}
                      >
                        ✓ Image Captured
                      </div>
                    </div>

                    <div
                      style={{
                        display:
                          "flex",
                        gap:
                          "10px",
                        marginTop:
                          "12px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={
                          retakeImage
                        }
                        style={{
                          flex: 1,
                          minWidth:
                            "130px",
                          padding:
                            "12px 16px",
                          borderRadius:
                            "10px",
                          border:
                            "1px solid #cfe1eb",
                          background:
                            "#ffffff",
                          color:
                            "#168acb",
                          fontWeight:
                            800,
                          cursor:
                            "pointer",
                        }}
                      >
                        ↻ Retake
                      </button>

                      <button
                        type="button"
                        onClick={
                          removeImage
                        }
                        style={{
                          flex: 1,
                          minWidth:
                            "130px",
                          padding:
                            "12px 16px",
                          borderRadius:
                            "10px",
                          border:
                            "1px solid #f0d7d7",
                          background:
                            "#fff8f8",
                          color:
                            "#c15c5c",
                          fontWeight:
                            800,
                          cursor:
                            "pointer",
                        }}
                      >
                        Remove Image
                      </button>
                    </div>

                    <div
                      style={{
                        marginTop:
                          "12px",
                        padding:
                          "12px",
                        borderRadius:
                          "10px",
                        background:
                          "#eef9f3",
                        color:
                          "#16844a",
                        fontSize:
                          "12px",
                        lineHeight:
                          1.5,
                      }}
                    >
                      ✓ Image captured
                      successfully.
                      <br />

                      <span
                        style={{
                          color:
                            "#527465",
                        }}
                      >
                        Image is ready
                        for FastAPI →
                        YOLO →
                        EfficientNet /
                        MobileNet
                        analysis.
                      </span>
                    </div>
                  </div>
                )}

              {/* =================================================
                  OPEN CAMERA
              ================================================= */}

              {!cameraOpen &&
                !capturedImage && (
                  <button
                    type="button"
                    onClick={
                      openCamera
                    }
                    style={{
                      width:
                        "100%",
                      marginTop:
                        "16px",
                      padding:
                        "14px 18px",
                      border:
                        "none",
                      borderRadius:
                        "11px",
                      background:
                        "#079bd3",
                      color:
                        "#ffffff",
                      fontSize:
                        "14px",
                      fontWeight:
                        800,
                      cursor:
                        "pointer",
                      boxShadow:
                        "0 7px 18px rgba(7, 155, 211, 0.2)",
                    }}
                  >
                    📷 Open Camera
                  </button>
                )}

              {cameraError && (
                <div
                  style={{
                    marginTop:
                      "12px",
                    padding:
                      "11px 13px",
                    borderRadius:
                      "10px",
                    background:
                      "#fff4f4",
                    border:
                      "1px solid #f0d4d4",
                    color:
                      "#b54d4d",
                    fontSize:
                      "12px",
                    lineHeight:
                      1.5,
                  }}
                >
                  {cameraError}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =================================================
            FRESHNESS
        ================================================= */}

        <section
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #e0edf5",
            borderRadius:
              "20px",
            padding:
              "24px",
            marginBottom:
              "20px",
            boxShadow:
              "0 8px 30px rgba(24, 86, 120, 0.06)",
          }}
        >
          <SectionTitle
            number="03"
            title="Freshness Verification"
            subtitle="Confirm the produce is suitable for receiving and sale."
          />

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap:
                "12px",
              marginTop:
                "20px",
            }}
          >
            <FreshnessItem
              icon="✓"
              text="Fresh appearance"
            />

            <FreshnessItem
              icon="✓"
              text="No visible damage"
            />

            <FreshnessItem
              icon="✓"
              text="Suitable for delivery"
            />
          </div>

          <VerificationRow
            checked={
              freshnessVerified
            }
            onChange={() =>
              setFreshnessVerified(
                (value) =>
                  !value
              )
            }
            title="Freshness Verified"
            description="Freshness has been checked before accepting the order."
          />
        </section>

        {/* =================================================
            SUPPLIER + DRIVER
        ================================================= */}

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap:
              "20px",
            marginBottom:
              "24px",
          }}
        >
          <PersonCard
            title="SUPPLIER"
            name={farmerName}
            subtitle={supplier}
            location={farmerLocation}
            initials={getInitials(
              farmerName
            )}
          />

          <PersonCard
            title="DRIVER"
            name="Rajesh Kumar"
            subtitle="Truck • TS 09 AB 4821"
            location="Delivery completed"
            initials="RK"
          />
        </div>

        {/* =================================================
            FINAL CONFIRMATION
        ================================================= */}

        <section
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #d8eaf4",
            borderRadius:
              "20px",
            padding:
              "24px",
            boxShadow:
              "0 10px 35px rgba(24, 86, 120, 0.08)",
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap:
                "18px",
              flexWrap:
                "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin:
                    "0 0 7px",
                  fontSize:
                    "12px",
                  fontWeight:
                    800,
                  color:
                    "#168acb",
                  letterSpacing:
                    "1px",
                }}
              >
                INSPECTION COMPLETE
              </p>

              <h3
                style={{
                  margin: 0,
                  fontSize:
                    "21px",
                  color:
                    "#17324d",
                }}
              >
                Ready to confirm delivery?
              </h3>

              <p
                style={{
                  margin:
                    "7px 0 0",
                  color:
                    "#718494",
                  fontSize:
                    "13px",
                }}
              >
                Your verification
                results will be
                used for
                settlement.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleConfirmPayment
              }
              disabled={
                !allVerified
              }
              style={{
                border:
                  "none",
                borderRadius:
                  "12px",
                padding:
                  "15px 24px",
                background:
                  allVerified
                    ? "#079bd3"
                    : "#aebdc7",
                color:
                  "#ffffff",
                fontSize:
                  "14px",
                fontWeight:
                  800,
                cursor:
                  allVerified
                    ? "pointer"
                    : "not-allowed",
                boxShadow:
                  allVerified
                    ? "0 8px 22px rgba(7, 155, 211, 0.22)"
                    : "none",
              }}
            >
              Confirm & Continue to Payment →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding:
          "15px",
        borderRadius:
          "13px",
        background:
          "#f7fbfe",
        border:
          "1px solid #dcebf3",
      }}
    >
      <span
        style={{
          display:
            "block",
          fontSize:
            "11px",
          fontWeight:
            800,
          color:
            "#7c8e9e",
          marginBottom:
            "7px",
          letterSpacing:
            "0.5px",
        }}
      >
        {label.toUpperCase()}
      </span>

      <strong
        style={{
          display:
            "block",
          fontSize:
            "17px",
          color:
            "#17324d",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        display:
          "flex",
        alignItems:
          "flex-start",
        gap:
          "13px",
      }}
    >
      <div
        style={{
          minWidth:
            "34px",
          height:
            "34px",
          borderRadius:
            "10px",
          display:
            "grid",
          placeItems:
            "center",
          background:
            "#e9f7fd",
          color:
            "#0787bd",
          fontSize:
            "12px",
          fontWeight:
            900,
        }}
      >
        {number}
      </div>

      <div>
        <h2
          style={{
            margin:
              0,
            fontSize:
              "20px",
            color:
              "#17324d",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin:
              "5px 0 0",
            color:
              "#718494",
            fontSize:
              "13px",
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   VERIFICATION ROW
========================================================= */

function VerificationRow({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width:
          "100%",
        marginTop:
          "18px",
        padding:
          "13px",
        borderRadius:
          "12px",
        border:
          checked
            ? "1px solid #bfe6cf"
            : "1px solid #dbe6ed",
        background:
          checked
            ? "#f0fbf4"
            : "#ffffff",
        display:
          "flex",
        alignItems:
          "center",
        gap:
          "12px",
        textAlign:
          "left",
        cursor:
          "pointer",
      }}
    >
      <span
        style={{
          width:
            "25px",
          height:
            "25px",
          borderRadius:
            "50%",
          display:
            "grid",
          placeItems:
            "center",
          flexShrink:
            0,
          background:
            checked
              ? "#20a35a"
              : "#e5edf2",
          color:
            "#ffffff",
          fontSize:
            "13px",
          fontWeight:
            900,
        }}
      >
        {checked
          ? "✓"
          : ""}
      </span>

      <span>
        <strong
          style={{
            display:
              "block",
            color:
              checked
                ? "#16844a"
                : "#52697a",
            fontSize:
              "13px",
          }}
        >
          {title}
        </strong>

        <span
          style={{
            display:
              "block",
            marginTop:
              "3px",
            color:
              "#81909d",
            fontSize:
              "11px",
          }}
        >
          {description}
        </span>
      </span>
    </button>
  );
}

/* =========================================================
   FRESHNESS ITEM
========================================================= */

function FreshnessItem({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div
      style={{
        display:
          "flex",
        alignItems:
          "center",
        gap:
          "10px",
        padding:
          "13px",
        borderRadius:
          "12px",
        background:
          "#f0fbf4",
        border:
          "1px solid #d3efdd",
        color:
          "#16844a",
        fontSize:
          "13px",
        fontWeight:
          700,
      }}
    >
      <span>
        {icon}
      </span>

      {text}
    </div>
  );
}

/* =========================================================
   PERSON CARD
========================================================= */

function PersonCard({
  title,
  name,
  subtitle,
  location,
  initials,
}: {
  title: string;
  name: string;
  subtitle: string;
  location: string;
  initials: string;
}) {
  return (
    <section
      style={{
        background:
          "#ffffff",
        border:
          "1px solid #e0edf5",
        borderRadius:
          "20px",
        padding:
          "22px",
        boxShadow:
          "0 8px 30px rgba(24, 86, 120, 0.06)",
      }}
    >
      <p
        style={{
          margin:
            "0 0 14px",
          fontSize:
            "11px",
          fontWeight:
            800,
          color:
            "#8192a1",
          letterSpacing:
            "1px",
        }}
      >
        {title}
      </p>

      <div
        style={{
          display:
            "flex",
          alignItems:
            "center",
          gap:
            "13px",
        }}
      >
        <div
          style={{
            width:
              "46px",
            height:
              "46px",
            borderRadius:
              "50%",
            display:
              "grid",
            placeItems:
              "center",
            background:
              "#e9f7fd",
            color:
              "#0787bd",
            fontWeight:
              900,
          }}
        >
          {initials}
        </div>

        <div>
          <strong
            style={{
              display:
                "block",
              color:
                "#17324d",
              fontSize:
                "15px",
            }}
          >
            {name}
          </strong>

          <span
            style={{
              display:
                "block",
              marginTop:
                "3px",
              color:
                "#647887",
              fontSize:
                "12px",
            }}
          >
            {subtitle}
          </span>

          <span
            style={{
              display:
                "block",
              marginTop:
                "3px",
              color:
                "#8796a2",
              fontSize:
                "11px",
            }}
          >
            {location}
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(
  name: string
) {
  return name
    .split(" ")
    .filter(Boolean)
    .map(
      (part) =>
        part[0]
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}