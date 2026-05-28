"use client";

import { useState } from "react";
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

export default function DiagramsPage() {
  const [frequency, setFrequency] = useState<number>(25);
  const [noiseLevel, setNoiseLevel] = useState<number>(0.3);
  const [loading, setLoading] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await axios.post(`${backendUrl}/api/analyze/`, {
        frequency: frequency,
        noise_level: noiseLevel,
        sampling_rate: 500,
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Помилка під час запиту до Django:", error);
      alert("Не вдалося зв'язатися з сервером аналізу.");
    } finally {
      setLoading(false);
    }
  };

  // Футуристичні темні налаштування для графіків
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#94a3b8", // slate-400
          font: { family: "sans-serif", size: 12 },
        },
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
      x: {
        grid: { color: "#1e293b" }, // дуже темна сітка
        ticks: { color: "#64748b" }, // slate-500
      },
      y: {
        grid: { color: "#1e293b" },
        ticks: { color: "#64748b" },
      },
    },
  };

  const signalData = analytics
    ? {
        labels: analytics.time.slice(0, 150).map((t: number) => t.toFixed(3)),
        datasets: [
          {
            label: "Радіосигнал із шумом (Часова область)",
            data: analytics.signal.slice(0, 150),
            borderColor: "#06b6d4", // Неоновий cyan
            backgroundColor: "rgba(6, 182, 212, 0.05)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.1, // легке згладжування лінії
          },
        ],
      }
    : null;

  const spectrumData = analytics
    ? {
        labels: analytics.frequencies.map((f: number) => f.toFixed(1)),
        datasets: [
          {
            label: "Амплітудний спектр сигналу (Частотна область)",
            data: analytics.amplitudes,
            borderColor: "#3b82f6", // Неоновий синій
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            borderWidth: 2,
            pointRadius: 1,
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-100 font-sans p-6 lg:p-10">
      {/* Шапка комплексу */}
      <header className="mb-8 pb-6 border-b border-[#1e2631]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
              Комплекс розпізнавання та дослідження РЕЗ та загроз
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Спеціальність 172 — Дипломний інженерний прототип (Спектральний
              аналітик)
            </p>
          </div>
        </div>
      </header>

      {/* Головна сітка */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        {/* Ліва бокова панель параметрів */}
        <section className="flex flex-col bg-[#11161d] p-6 rounded-xl border border-[#1e2631] shadow-2xl h-fit">
          <h2 className="text-lg font-semibold text-white mb-6 tracking-wide uppercase border-b border-[#1e2631] pb-3">
            Параметри РЕЗ
          </h2>

          {/* Слайдер 1 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-slate-400">Частота сигналу</label>
              <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">
                {frequency} Гц
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Слайдер 2 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-slate-400">
                Рівень завад (шуму)
              </label>
              <span className="text-sm font-mono font-bold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/50">
                {noiseLevel.toFixed(1)} σ
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Головна кнопка запуску */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-cyan-950/50 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Обчислення FFT...</span>
              </>
            ) : (
              "Запустити сканування"
            )}
          </button>

          {/* Вивід класифікатора загрози */}
          {analytics && (
            <div
              className={`mt-6 p-4 rounded-lg border transition-all ${
                analytics.metrics.is_threat
                  ? "bg-red-950/30 border-red-900/50"
                  : "bg-emerald-950/30 border-emerald-900/50"
              }`}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Результати класифікації
              </h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Виявлена частота:</span>
                  <span className="text-white font-bold">
                    {analytics.metrics.detected_frequency} Гц
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Макс. амплітуда:</span>
                  <span className="text-white font-bold">
                    {analytics.metrics.max_amplitude}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#1e2631] mt-2 flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 uppercase mb-1">
                    Статус джерела
                  </span>
                  <span
                    className={`text-sm font-bold uppercase tracking-wide px-3 py-1 rounded w-full text-center ${
                      analytics.metrics.is_threat
                        ? "bg-red-900/40 text-red-400 border border-red-700/50 animate-pulse"
                        : "bg-emerald-900/40 text-emerald-400 border border-emerald-700/50"
                    }`}
                  >
                    {analytics.metrics.is_threat
                      ? "⚠️ ВИЯВЛЕНО ЗАГРОЗУ"
                      : "✅ СИГНАЛ БЕЗПЕЧНИЙ"}
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
              {/* Графік 1 */}
              <div className="bg-[#11161d] p-5 rounded-xl border border-[#1e2631] shadow-xl">
                <div className="h-[280px] w-full">
                  <Line data={signalData!} options={chartOptions} />
                </div>
              </div>

              {/* Графік 2 */}
              <div className="bg-[#11161d] p-5 rounded-xl border border-[#1e2631] shadow-xl">
                <div className="h-[280px] w-full">
                  <Line data={spectrumData!} options={chartOptions} />
                </div>
              </div>
            </>
          ) : (
            /* Стан очікування */
            <div className="flex flex-col items-center justify-center h-[586px] border-2 border-dashed border-[#1e2631] rounded-xl bg-[#11161d]/30 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#131922] border border-[#222c3c] flex items-center justify-center text-slate-500 mb-4 animate-pulse">
                📡
              </div>
              <h3 className="text-lg font-medium text-slate-300">
                Ефір не відскановано
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                Встановіть необхідну частоту генератора та рівень білого
                гаусового шуму, після чого запустіть швидке перетворення Фур'є
                (FFT).
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
