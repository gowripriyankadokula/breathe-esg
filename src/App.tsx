import { useEffect, useState } from "react";
import axios from "axios";

type DataRow = {
  id: number;
  quantity: number;
  unit: string;
  anomalies: string;
  status: string;
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH TABLE DATA
  // =========================
  const fetchData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/data/");
      setData(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // UPLOAD FILE
  // =========================
  const uploadFile = async () => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/upload-sap/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPLOAD RESPONSE:", res.data);

      alert(`Uploaded successfully! Rows: ${res.data.rows}`);

      fetchData(); // refresh table
    } catch (err) {
      console.log("Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>🌱 Breathe ESG Dashboard</h2>

      {/* UPLOAD SECTION */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button onClick={uploadFile} disabled={loading}>
          {loading ? "Uploading..." : "Upload SAP File"}
        </button>
      </div>

      {/* TABLE SECTION */}
      <h3>📊 Data Table</h3>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Anomalies</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5}>No data available</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.anomalies}</td>
                <td>{item.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;