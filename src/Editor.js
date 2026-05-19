import './Editor.css';

function Editor() {
  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>CodeSync</h2>
        <div className="header-right">
          <span className="room-info">Room: ABC123</span>
          <button className="leave-btn">Leave Room</button>
        </div>
      </div>

      <div className="editor-body">
        <div className="sidebar">
          <h3>Members</h3>
          <div className="member">
            <span className="dot"></span>
            <span>Kunal</span>
          </div>
        </div>

        <div className="code-area">
          <textarea placeholder="Start coding here..."></textarea>
        </div>
      </div>
    </div>
  );
}

export default Editor;