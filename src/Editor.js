import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './Editor.css';

const LANGUAGES = [
  'javascript',
  'python',
  'cpp',
  'java',
  'typescript',
  'html',
  'css',
];

const socket = io('https://codesync-tigk.onrender.com', {
  autoConnect: false
});

function EditorPage() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Start coding here...');
  const [members, setMembers] = useState([]);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const location = useLocation();
  const { name, roomId } = location.state || {};
  const navigate = useNavigate();
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    socket.connect();
    socket.emit('join-room', { roomId, name });

    socket.on('code-update', (newCode) => {
      isRemoteUpdate.current = true;
      setCode(newCode);
    });

    socket.on('members-update', (updatedMembers) => {
      setMembers(updatedMembers);
    });

    socket.on('output-update', (newOutput) => {
      setOutput(newOutput);
    });

    return () => {
      socket.off('code-update');
      socket.off('members-update');
      socket.off('output-update');
      socket.disconnect();
    };
  }, [roomId, name]);

  function handleCodeChange(newCode) {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    setCode(newCode);
    socket.emit('code-change', { roomId, code: newCode });
  }

  function leaveRoom() {
    socket.disconnect();
    navigate('/');
  }

  function copyRoomId() {
  const roomLink = `${window.location.origin}/?room=${roomId}`;
  navigator.clipboard.writeText(roomLink);
  toast.success('Room link copied!');
}

  async function runCode() {
    setIsRunning(true);
    setOutput('Running...');

    const languageIds = {
      javascript: 63,
      python: 71,
      cpp: 54,
      java: 62,
      typescript: 74,
      html: 43,
      css: 43,
    };

    try {
      const response = await fetch('https://ce.judge0.com/submissions?wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageIds[language],
        }),
      });

      const result = await response.json();
      const finalOutput = result.stdout || result.stderr || result.compile_output || 'No output';
      setOutput(finalOutput);
      socket.emit('output-update', { roomId, output: finalOutput });
    } catch (error) {
      setOutput('Error running code. Try again.');
    }

    setIsRunning(false);
  }
  function downloadCode() {
  const extensions = {
    javascript: 'js',
    python: 'py',
    cpp: 'cpp',
    java: 'java',
    typescript: 'ts',
    html: 'html',
    css: 'css',
  };

  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `code.${extensions[language]}`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Code downloaded!');
}

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>CodeSync</h2>
        <div className="header-right">
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <span className="room-info">Room: {roomId}</span>
          <button className="copy-btn" onClick={copyRoomId}>Copy ID</button>
          <button className="run-btn" onClick={runCode} disabled={isRunning}>
          <button className="copy-btn" onClick={downloadCode}>Download</button>
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button className="leave-btn" onClick={leaveRoom}>Leave Room</button>
        </div>
      </div>

      <div className="editor-body">
        <div className="sidebar">
          <h3>Members</h3>
          {members.map((member) => (
            <div className="member" key={member.id}>
              <span className="dot" style={{ backgroundColor: member.color }}></span>
              <span>{member.name}</span>
            </div>
          ))}
        </div>

        <div className="code-area">
          <div className="editor-section">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={handleCodeChange}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>
          <div className="output-section">
            <div className="output-header">Output</div>
            <pre className="output-content">{output || 'Run your code to see output here...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;