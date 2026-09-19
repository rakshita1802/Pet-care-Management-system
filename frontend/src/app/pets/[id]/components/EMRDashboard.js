"use client";

import { useEffect, useState } from "react";
import { fetchMedicalRecords, createMedicalRecord, uploadAttachment } from "@/app/api/emr";
import { useAuth } from "@/context/AuthContext";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function EMRDashboard({ petId }) {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingRecordId, setUploadingRecordId] = useState(null);

  // New Record Form State
  const [newRecord, setNewRecord] = useState({
    veterinarian_name: user?.name || "Dr. Staff",
    weight_kg: "",
    temperature_c: "",
    heart_rate_bpm: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });

  useEffect(() => {
    loadRecords();
  }, [petId]);

  async function loadRecords() {
    setLoading(true);
    try {
      const data = await fetchMedicalRecords(petId);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMedicalRecord({
        ...newRecord,
        pet_id: parseInt(petId),
        weight_kg: newRecord.weight_kg ? parseFloat(newRecord.weight_kg) : null,
        temperature_c: newRecord.temperature_c ? parseFloat(newRecord.temperature_c) : null,
        heart_rate_bpm: newRecord.heart_rate_bpm ? parseInt(newRecord.heart_rate_bpm) : null,
      });
      setIsCreating(false);
      setNewRecord({
        veterinarian_name: user?.name || "Dr. Staff",
        weight_kg: "", temperature_c: "", heart_rate_bpm: "",
        subjective: "", objective: "", assessment: "", plan: ""
      });
      loadRecords();
    } catch (err) {
      alert("Failed to create record");
    }
  };

  const handleFileUpload = async (e, recordId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingRecordId(recordId);
    try {
      await uploadAttachment(recordId, file);
      loadRecords();
    } catch (err) {
      alert("Upload failed. Make sure you are a staff member.");
    } finally {
      setUploadingRecordId(null);
    }
  };

  // Chart Data preparation
  const chartRecords = [...records].reverse().filter(r => r.weight_kg || r.temperature_c);
  
  const chartData = {
    labels: chartRecords.map(r => new Date(r.record_date).toLocaleDateString()),
    datasets: [
      {
        label: "Weight (kg)",
        data: chartRecords.map(r => r.weight_kg),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: 'y',
      },
      {
        label: "Temp (°C)",
        data: chartRecords.map(r => r.temperature_c),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: 'y1',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    stacked: false,
    scales: {
      y: { type: 'linear', display: true, position: 'left' },
      y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } },
    }
  };

  if (loading) return <div>Loading EMR data...</div>;

  return (
    <div className="space-y-8">
      {/* HEADER & CONTROLS */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clinical Records (EMR)</h2>
          <p className="text-gray-500 text-sm mt-1">Manage notes, vitals, and attachments.</p>
        </div>
        {user?.role === "staff" && (
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold shadow-md transition-all"
          >
            {isCreating ? "Cancel" : "+ New Note"}
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4 shadow-inner">
          <h3 className="font-bold text-lg text-blue-900">New SOAP Note</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Weight (kg)</label>
              <input type="number" step="0.1" className="w-full p-2 rounded-lg border border-blue-200" value={newRecord.weight_kg} onChange={e => setNewRecord({...newRecord, weight_kg: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Temp (°C)</label>
              <input type="number" step="0.1" className="w-full p-2 rounded-lg border border-blue-200" value={newRecord.temperature_c} onChange={e => setNewRecord({...newRecord, temperature_c: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Heart Rate (bpm)</label>
              <input type="number" className="w-full p-2 rounded-lg border border-blue-200" value={newRecord.heart_rate_bpm} onChange={e => setNewRecord({...newRecord, heart_rate_bpm: e.target.value})} />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Subjective (Owner&apos;s report)</label>
              <textarea className="w-full p-2 rounded-lg border border-blue-200 h-20" value={newRecord.subjective} onChange={e => setNewRecord({...newRecord, subjective: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Objective (Clinical findings)</label>
              <textarea className="w-full p-2 rounded-lg border border-blue-200 h-20" value={newRecord.objective} onChange={e => setNewRecord({...newRecord, objective: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Assessment (Diagnosis)</label>
              <textarea className="w-full p-2 rounded-lg border border-blue-200 h-20" value={newRecord.assessment} onChange={e => setNewRecord({...newRecord, assessment: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Plan (Treatment & meds)</label>
              <textarea className="w-full p-2 rounded-lg border border-blue-200 h-20" value={newRecord.plan} onChange={e => setNewRecord({...newRecord, plan: e.target.value})}></textarea>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-800 transition-all">Save EMR</button>
          </div>
        </form>
      )}

      {/* VITALS CHART */}
      {chartRecords.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Vitals Flowsheet</h3>
          <div className="h-64">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      )}

      {/* RECORDS TIMELINE */}
      <div className="space-y-6">
        {records.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm">No medical records found.</div>
        ) : (
          records.map(record => (
            <div key={record.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
              
              {/* Note Details */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <span className="text-sm text-gray-500 font-mono">{new Date(record.record_date).toLocaleString()}</span>
                    <h3 className="font-bold text-lg">Dr. {record.veterinarian_name}</h3>
                  </div>
                  <div className="flex gap-4 text-sm font-semibold bg-gray-50 px-4 py-2 rounded-lg">
                    {record.weight_kg && <span className="text-blue-600">WT: {record.weight_kg}kg</span>}
                    {record.temperature_c && <span className="text-red-600">T: {record.temperature_c}°C</span>}
                    {record.heart_rate_bpm && <span className="text-green-600">HR: {record.heart_rate_bpm}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs mb-1">Subjective</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]">{record.subjective || "-"}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs mb-1">Objective</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]">{record.objective || "-"}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs mb-1">Assessment</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]">{record.assessment || "-"}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs mb-1">Plan</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]">{record.plan || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Attachments Sidebar */}
              <div className="w-full md:w-64 bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                  Attachments
                  {user?.role === "staff" && (
                    <label className="cursor-pointer text-blue-600 hover:text-blue-800">
                      <input 
                        type="file" className="hidden" 
                        onChange={(e) => handleFileUpload(e, record.id)}
                        disabled={uploadingRecordId === record.id}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </label>
                  )}
                </h4>
                
                {uploadingRecordId === record.id && <p className="text-xs text-blue-600 mb-2 animate-pulse">Uploading...</p>}

                <div className="flex-1 space-y-2 overflow-y-auto max-h-48">
                  {record.attachments.length === 0 ? (
                    <p className="text-xs text-gray-400">No attachments yet.</p>
                  ) : (
                    record.attachments.map(att => (
                      <a 
                        key={att.id} 
                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}${att.file_url}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="bg-gray-100 p-1 rounded">
                          {att.file_type.includes("image") ? "🖼️" : "📄"}
                        </div>
                        <p className="text-xs truncate w-full" title={att.file_name}>{att.file_name}</p>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
