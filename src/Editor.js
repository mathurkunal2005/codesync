import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useLocation } from 'react-router-dom';
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

const socket = io('http://localhost:5001', {
  autoConnect: false
});

function EditorPage() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Start coding here...');
  const [members, setMembers] = useState([]);
  const location = useLocation();
  const { name, roomId } = location.state || {};
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

    return () => {
      socket.off('code-update');
      socket.off('members-update');
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
          <button className="leave-btn">Leave Room</button>
        </div>
      </div>

      <div className="editor-body">
        <div className="sidebar">s
          <h3>Members</h3>
          {members.map((member) => (
            <div className="member">
            <span className="dot"></span>
            <span>{member.name}</span>
          </div>
          ))}
        </div>

        <div className="code-area">
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
      </div>
    </div>
  );
}

export default EditorPage;