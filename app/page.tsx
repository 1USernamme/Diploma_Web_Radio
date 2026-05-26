'use client';

import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Реєструємо компоненти графіка
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  // Параметри сигналу, які користувач може змінювати
  const [frequency, setFrequency] = useState<number>(25);
  const [noiseLevel, setNoiseLevel] = useState<number>(0.3);
  const [loading, setLoading] = useState<boolean>(false);

  // Результати аналізу від Django
  const [analytics, setAnalytics] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // Змінено на localhost для стабільної маршрутизації в Windows
      const response = await axios.post('http://localhost:8000/api/analyze/', {
        frequency: frequency,
        noise_level: noiseLevel,
        sampling_rate: 500
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Помилка під час запиту до Django:", error);
      alert("Не вдалося зв'язатися з сервером аналізу.");
    } finally {
      setLoading(false);
    }
  };

  // Налаштування даних для графіка часового сигналу
  const signalData = analytics ? {
    labels: analytics.time.slice(0, 150).map((t: number) => t.toFixed(3)),
    datasets: [{
      label: 'Радіосигнал із шумом (Часова область)',
      data: analytics.signal.slice(0, 150),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
    }]
  } : null;

  // Налаштування даних для графіка спектра (FFT)
  const spectrumData = analytics ? {
    labels: analytics.frequencies.map((f: number) => f.toFixed(1)),
    datasets: [{
      label: 'Амплітудний спектр сигналу (Частотна область)',
      data: analytics.amplitudes,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 2,
      pointRadius: 1,
    }]
  } : null;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #334155', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#38bdf8' }}>Комплекс розпізнавання та дослідження РЕЗ та загроз</h1>
        <p style={{ color: '#94a3b8' }}>Спеціальність 172 — Дипломний інженерний прототип</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        {/* Панель керування параметрами */}
        <section style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Параметри РЕЗ</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Частота сигналу: {frequency} Гц</label>
            <input 
              type="range" min="1" max="100" value={frequency} 
              onChange={(e) => setFrequency(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Рівень завад (шуму): {noiseLevel}</label>
            <input 
              type="range" min="0" max="3" step="0.1" value={noiseLevel} 
              onChange={(e) => setNoiseLevel(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', backgroundColor: '#0284c7', 
              color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            {loading ? 'Обчислення FFT...' : 'Запустити сканування'}
          </button>

          {/* Вивід метрик класифікатора */}
          {analytics && (
            <div style={{ marginTop: '25px', padding: '15px', backgroundColor: analytics.metrics.is_threat ? '#451a03' : '#064e3b', borderRadius: '6px', border: '1px solid' }}>
              <h3>Результат аналізу:</h3>
              <p>Виявлена частота: <strong>{analytics.metrics.detected_frequency} Гц</strong></p>
              <p>Макс. амплітуда: <strong>{analytics.metrics.max_amplitude}</strong></p>
              <p>Статус загрози: <strong style={{ color: analytics.metrics.is_threat ? '#f87171' : '#4ade80' }}>
                {analytics.metrics.is_threat ? '⚠️ ВИЯВЛЕНО РЕЗ ЗАГРОЗУ' : '✅ СИГНАЛ БЕЗПЕЧНИЙ'}
              </strong></p>
            </div>
          )}
        </section>

        {/* Візуалізація графіків */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {analytics ? (
            <>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px' }}>
                <Line data={signalData!} options={{ responsive: true }} />
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px' }}>
                <Line data={spectrumData!} options={{ responsive: true }} />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', border: '2px dashed #334155', borderRadius: '8px', color: '#64748b' }}>
              Встановіть параметри та натисніть кнопку для моделювання радіоефіру
            </div>
          )}
        </main>
      </div>
    </div>
  );
}