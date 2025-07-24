import React, { useState, useEffect } from 'react';
import './App.css';

interface Equation {
  id: number;
  a: number;
  b: number;
  c: number;
  solution: string;
  created_at: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [equations, setEquations] = useState<Equation[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchEquations();
  }, []);

  const fetchEquations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/equations`);
      const data = await response.json();
      if (data.success) {
        setEquations(data.equations);
      }
    } catch (error) {
      console.error('Error fetching equations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/api/equation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          a: parseFloat(a),
          b: parseFloat(b),
          c: parseFloat(c),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.equation.solution);
        fetchEquations();
        setA('');
        setB('');
        setC('');
      } else {
        setResult('Lỗi: ' + data.error);
      }
    } catch (error) {
      setResult('Lỗi kết nối: ' + error);
    }
  };

  const handleEdit = (equation: Equation) => {
    setEditingId(equation.id);
    setA(equation.a.toString());
    setB(equation.b.toString());
    setC(equation.c.toString());
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/equation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          a: parseFloat(a),
          b: parseFloat(b),
          c: parseFloat(c),
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchEquations();
        setEditingId(null);
        setA('');
        setB('');
        setC('');
        setResult(data.equation.solution);
      }
    } catch (error) {
      console.error('Error updating equation:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa phương trình này?')) {
      try {
        const response = await fetch(`${API_URL}/api/equation/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
          fetchEquations();
        }
      } catch (error) {
        console.error('Error deleting equation:', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setA('');
    setB('');
    setC('');
    setResult('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧮 Giải Phương Trình Bậc 2</h1>
        <p>Nhập hệ số a, b, c để giải phương trình ax² + bx + c = 0</p>
      </header>

      <main className="main-content">
        <div className="form-container">
          <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleSubmit}>
            <div className="input-group">
              <label htmlFor="a">Hệ số a:</label>
              <input
                type="number"
                id="a"
                value={a}
                onChange={(e) => setA(e.target.value)}
                step="any"
                required
                placeholder="Nhập hệ số a"
              />
            </div>

            <div className="input-group">
              <label htmlFor="b">Hệ số b:</label>
              <input
                type="number"
                id="b"
                value={b}
                onChange={(e) => setB(e.target.value)}
                step="any"
                required
                placeholder="Nhập hệ số b"
              />
            </div>

            <div className="input-group">
              <label htmlFor="c">Hệ số c:</label>
              <input
                type="number"
                id="c"
                value={c}
                onChange={(e) => setC(e.target.value)}
                step="any"
                required
                placeholder="Nhập hệ số c"
              />
            </div>

            <div className="button-group">
              {editingId ? (
                <>
                  <button type="submit" className="btn btn-update">Cập nhật</button>
                  <button type="button" onClick={cancelEdit} className="btn btn-cancel">Hủy</button>
                </>
              ) : (
                <button type="submit" className="btn btn-solve">Giải phương trình</button>
              )}
            </div>
          </form>

          {result && (
            <div className="result">
              <h3>Kết quả:</h3>
              <p>{result}</p>
            </div>
          )}
        </div>

        <div className="equations-list">
          <h2>📋 Danh sách phương trình đã giải</h2>
          {equations.length === 0 ? (
            <p>Chưa có phương trình nào được lưu.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Hệ số a</th>
                    <th>Hệ số b</th>
                    <th>Hệ số c</th>
                    <th>Nghiệm</th>
                    <th>Thời gian</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {equations.map((eq) => (
                    <tr key={eq.id}>
                      <td>{eq.id}</td>
                      <td>{eq.a}</td>
                      <td>{eq.b}</td>
                      <td>{eq.c}</td>
                      <td className="solution">{eq.solution}</td>
                      <td>{new Date(eq.created_at).toLocaleString('vi-VN')}</td>
                      <td>
                        <button 
                          onClick={() => handleEdit(eq)}
                          className="btn btn-edit"
                          disabled={editingId !== null}
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(eq.id)}
                          className="btn btn-delete"
                          disabled={editingId !== null}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

