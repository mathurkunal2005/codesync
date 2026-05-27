# CodeSync ⚡

A real-time collaborative code editor where multiple users can join a shared room and code simultaneously — like Google Docs, but for code.

🔗 **Live Demo:** [codesync-livid.vercel.app](https://codesync-livid.vercel.app)

---

## Features

- 🔴 **Real-time collaboration** — Multiple users can code together simultaneously
- 🎨 **Unique user colors** — Every collaborator gets a distinct color in the members list
- 💻 **Monaco Editor** — The same editor that powers VS Code
- 🚀 **Run code** — Execute code directly in the browser using Judge0 API
- 🔄 **Synced output** — Code execution results visible to all room members
- 🌐 **7 languages** — JavaScript, Python, C++, Java, TypeScript, HTML, CSS
- 📋 **Copy room link** — Share a link that auto-fills the room ID
- ⬇️ **Download code** — Save your code as a file with the correct extension
- 🦇 **Batman themed** — Because why not

---

## Tech Stack

| Frontend | Backend | Deployment |
|---|---|---|
| React.js | Node.js | Vercel |
| Monaco Editor | Express.js | Render |
| Socket.io Client | Socket.io | GitHub |
| React Router | Judge0 API | |
| React Hot Toast | | |

---

## How It Works

```
User creates a room → gets a unique Room ID
Share the room link with collaborators
Everyone joins the same room
Code syncs in real-time via Socket.io
Run code → output visible to all members
```

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/mathurkunal2005/codesync.git

# Install frontend dependencies
cd codesync
npm install

# Install backend dependencies
cd server
npm install

# Start backend
node index.js

# Start frontend (new terminal)
cd ..
npm start
```

---

## Architecture

```
Frontend (React)  ←→  Backend (Node.js + Socket.io)
     ↓                          ↓
  Vercel                     Render
  (UI hosting)           (Server hosting)
```

---

Built by [Kunal Mathur](https://github.com/mathurkunal2005)