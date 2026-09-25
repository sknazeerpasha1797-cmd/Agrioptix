"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Settlement = {
  status: string;
  sale_value: number;
  logistics_cost: number;
  handling_cost: number;
  net_settlement: number;
};

export default function PaymentPage() {
  const router = useRouter();

  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettlement() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/settlements/1"
        );

        if (!response.ok) {
          throw new Error("Unable to load settlement");
        }

        const data = await response.json();
        setSettlement(data);
      } catch (err) {
        console.error(err);
        setError("Unable to connect to AgriOptix settlement service.");
      } finally {
        setLoading(false);
      }
    }

    loadSettlement();
  }, []);

  const handlePayment = async () => {
    setPaying(true);

    // Demo payment confirmation.
    // Actual settlement data comes from FastAPI.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setPaid(true);
    setPaying(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <h2 className="text-xl font-bold text-slate-800">
            Loading Settlement
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Connecting to AgriOptix FastAPI...
          </p>
        </div>
      </main>
    );
  }

  if (error || !settlement) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
            !
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Settlement Unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "No settlement data was returned."}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Delivery Inspection
          </button>
        </div>
      </main>
    );
  }

  const totalCosts =
    settlement.logistics_cost + settlement.handling_cost;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-3 text-sm font-semibold text-slate-500 hover:text-blue-600"
            >
              ← Back to Delivery Inspection
            </button>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Payment & Settlement
            </h1>

            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Verified delivery • Optimized logistics • Transparent settlement
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {paid ? "PAYMENT COMPLETED" : settlement.status}
          </div>
        </div>

        {/* Technology pipeline */}
        <section className="mb-6 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            AgriOptix Decision Pipeline
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "YOLO Quality Verification",
              "XGBoost / LightGBM",
              "PostGIS",
              "DBSCAN",
              "OSRM",
              "OR-Tools / MILP",
              "FastAPI",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main settlement */}
          <section className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-lg md:p-8">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-400">
                  ORDER SETTLEMENT
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Produce Delivery #AGT5678
                </h2>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-center">
                <p className="text-xs font-medium text-emerald-600">
                  VERIFIED
                </p>
                <p className="text-lg font-bold text-emerald-700">
                  ✓
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
              <p className="text-sm font-medium text-blue-100">
                NET PAYABLE
              </p>

              <p className="mt-2 text-4xl font-extrabold">
                ₹{settlement.net_settlement.toLocaleString("en-IN")}
              </p>

              <p className="mt-2 text-sm text-blue-100">
                Calculated from verified produce value and optimized
                delivery costs.
              </p>
            </div>

            {/* Breakdown */}
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Settlement Breakdown
              </h3>

              <div className="space-y-3">

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-800">
                      Produce Value
                    </p>
                    <p className="text-xs text-slate-500">
                      Quality-verified market value
                    </p>
                  </div>

                  <p className="font-bold text-slate-900">
                    ₹{settlement.sale_value.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-800">
                      Logistics Cost
                    </p>
                    <p className="text-xs text-slate-500">
                      OSRM route + OR-Tools optimization
                    </p>
                  </div>

                  <p className="font-bold text-red-600">
                    − ₹{settlement.logistics_cost.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-800">
                      Handling Cost
                    </p>
                    <p className="text-xs text-slate-500">
                      Delivery handling
                    </p>
                  </div>

                  <p className="font-bold text-red-600">
                    − ₹{settlement.handling_cost.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-extrabold text-slate-900">
                      Net Settlement
                    </p>

                    <p className="text-2xl font-extrabold text-emerald-600">
                      ₹{settlement.net_settlement.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Payment */}
            {!paid ? (
              <button
                onClick={handlePayment}
                disabled={paying}
                className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paying
                  ? "Processing Payment..."
                  : `Confirm & Pay ₹${settlement.net_settlement.toLocaleString(
                      "en-IN"
                    )}`}
              </button>
            ) : (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">
                  ✓
                </div>

                <h3 className="mt-3 text-lg font-bold text-emerald-800">
                  Payment Successful
                </h3>

                <p className="mt-1 text-sm text-emerald-700">
                  Settlement completed successfully.
                </p>
              </div>
            )}
          </section>

          {/* Right panel */}
          <aside className="space-y-6">

            {/* Verification */}
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900">
                Verification
              </h3>

              <div className="mt-4 space-y-3">

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      Quality Verified
                    </p>
                    <p className="text-xs text-slate-500">
                      PyTorch + YOLO pipeline
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      Delivery Verified
                    </p>
                    <p className="text-xs text-slate-500">
                      Buyer inspection completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      Settlement Calculated
                    </p>
                    <p className="text-xs text-slate-500">
                      FastAPI settlement service
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Optimization */}
            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Optimization
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Smart Logistics
              </h3>

              <div className="mt-5 space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-400">Route engine</span>
                  <span className="font-semibold">OSRM</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Optimization</span>
                  <span className="font-semibold">OR-Tools / MILP</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Spatial data</span>
                  <span className="font-semibold">PostGIS</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Total costs</span>
                  <span className="font-semibold">
                    ₹{totalCosts.toLocaleString("en-IN")}
                  </span>
                </div>

              </div>
            </div>

            {/* Backend */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    AgriOptix Backend
                  </p>

                  <p className="text-xs text-slate-500">
                    Python + FastAPI • Settlement API connected
                  </p>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}