"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [samplingRate, setSamplingRate] = useState<number>(500);
  const [loading, setLoading] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Будь ласка, оберіть файл для аналізу.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sampling_rate", samplingRate.toString());

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await axios.post(
        `${backendUrl}/api/analyze-file/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error("Помилка під час аналізу файлу:", error);
      //   alert("Не вдалося обробити файл. Перевірте формат.");
    } finally {
      setLoading(false);
    }
  };

  // Твої налаштування графіків
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#94a3b8", font: { family: "sans-serif", size: 12 } },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#38bdf8",
        bodyColor: "#f8fafc",
        borderColor: "#334155",
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { color: "#1e293b" }, ticks: { color: "#64748b" } },
      y: { grid: { color: "#1e293b" }, ticks: { color: "#64748b" } },
    },
  };

  const signalData = analytics
    ? {
        labels: analytics.time.slice(0, 500).map((t: number) => t.toFixed(3)),
        datasets: [
          {
            label: "Радіосигнал (З файлу)",
            data: analytics.signal.slice(0, 500),
            borderColor: "#06b6d4",
            backgroundColor: "rgba(6, 182, 212, 0.05)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.1,
          },
        ],
      }
    : null;

  const spectrumData = analytics
    ? {
        labels: analytics.frequencies.map((f: number) => f.toFixed(1)),
        datasets: [
          {
            label: "Амплітудний спектр сигналу",
            data: analytics.amplitudes,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            borderWidth: 2,
            pointRadius: 1,
          },
        ],
      }
    : null;

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
      <header className="mb-8 pb-6 border-b border-[#1e2631]">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
          Аналіз реального ефіру (Data Upload)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Завантажте файл з відліками SDR приймача (.csv або .txt) для
          проведення ШПФ.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        {/* Ліва панель (Завантаження) */}
        <section className="flex flex-col bg-[#11161d] p-6 rounded-xl border border-[#1e2631] shadow-2xl h-fit">
          <h2 className="text-lg font-semibold text-white mb-6 uppercase border-b border-[#1e2631] pb-3">
            Джерело даних
          </h2>

          <div className="mb-6">
            <label className="text-sm text-slate-400 block mb-2">
              Файл сигналу
            </label>
            <div
              className="border-2 border-dashed border-[#1e2631] rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500/50 transition-colors bg-[#0b0f14]"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv,.txt"
              />
              <span className="text-sm text-slate-400">
                {file ? file.name : "Натисніть, щоб обрати файл"}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <label className="text-sm text-slate-400 block mb-2">
              Частота дискретизації SDR (Гц)
            </label>
            <input
              type="number"
              value={samplingRate}
              onChange={(e) => setSamplingRate(Number(e.target.value))}
              className="w-full bg-[#0b0f14] border border-[#1e2631] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Обробка файлу..." : "Провести аналіз"}
          </button>

          {/* Результати класифікації (той самий блок, що й на головній) */}
          {analytics && (
            <div
              className={`mt-6 p-4 rounded-lg border transition-all ${
                analytics.metrics.is_threat
                  ? "bg-red-950/30 border-red-900/50"
                  : "bg-emerald-950/30 border-emerald-900/50"
              }`}
            >
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">
                Результати
              </h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Частота:</span>
                  <span className="text-white font-bold">
                    {analytics.metrics.detected_frequency} Гц
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SNR:</span>
                  <span className="text-white font-bold">
                    {analytics.metrics.snr_db} dB
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Права панель з графіками */}
        <main className="flex flex-col gap-6">
          {analytics ? (
            <>
              <div className="bg-[#11161d] p-5 rounded-xl border border-[#1e2631] shadow-xl">
                <div className="h-[280px] w-full">
                  <Line data={signalData!} options={chartOptions} />
                </div>
              </div>
              <div className="bg-[#11161d] p-5 rounded-xl border border-[#1e2631] shadow-xl">
                <div className="h-[280px] w-full">
                  <Line data={spectrumData!} options={chartOptions} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[586px] border-2 border-dashed border-[#1e2631] rounded-xl bg-[#11161d]/30 p-8 text-center">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg text-slate-300">Очікування файлу</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Завантажте CSV масив відліків для побудови спектраграми.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
