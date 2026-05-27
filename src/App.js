import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';
import Editor from './Editor';

function Landing() {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

useEffect(() => {
  const roomFromUrl = searchParams.get('room');
  if (roomFromUrl) {
    setRoomId(roomFromUrl);
  }
}, [searchParams]);

  function createRoom() {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
  }

  function joinRoom() {
  if (name && roomId) {
    navigate('/editor', { state: { name, roomId } });
  }
}

  return (
    <div className="container">
      <h1>CodeSync</h1>
      <p>Real-time collaborative code editor</p>

      <div className="card">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
        <span className="divider">— or —</span>
        <button className="btn-secondary" onClick={createRoom}>
          Create New Room
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;