import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase, ref, push, set, onValue, remove
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAnaa4aZ99w98BTOTe0wpvB3vg_qUrGZq4",
    authDomain: "security-web-project.firebaseapp.com",
    databaseURL: "https://security-web-project-default-rtdb.firebaseio.com",
    projectId: "security-web-project",
    storageBucket: "security-web-project.firebasestorage.app",
    messagingSenderId: "427668780302",
    appId: "1:427668780302:web:053c39c52375d94803935f"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const postsRef = ref(db, "posts");

function post() {
  const writer = document.getElementById("writer").value;
  const content = document.getElementById("content").value;

  if (!writer || !content) return alert("모든 칸을 입력하세요");

  const postData = {
    writer: sanitize(writer),
    content: sanitize(content),
    createdAt: Date.now()
  };

  const newPostRef = push(postsRef);
  set(newPostRef, postData);
  document.getElementById("content").value = "";
}

onValue(postsRef, (snapshot) => {
  const data = snapshot.val();
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let id in data) {
    const post = data[id];
    const li = document.createElement("li");
    li.innerHTML = `<strong>${post.writer}</strong>: ${post.content}`;
    board.appendChild(li);
  }
});

// XSS 방지를 위한 간단한 필터링
function sanitize(str) {
  return str.replace(/[<>&"'`]/g, (char) => {
    const map = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;', '`': '&#x60;' };
    return map[char];
  });
}

window.post = post;
