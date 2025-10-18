// =======================
// Grade 11 Web Design App
// =======================

// Define lessons
const lessons = [
  {
    id: "intro",
    title_en: "Introduction to Web Design",
    title_am: "የድር ንድፍ መግቢያ",
    content_en: `
      <p>Welcome! In this course, you’ll learn how to build your own website using three core technologies:</p>
      <ul>
        <li><strong>HTML</strong> — the structure of a webpage.</li>
        <li><strong>CSS</strong> — the style and colors.</li>
        <li><strong>JavaScript</strong> — adds interactivity.</li>
      </ul>
    `,
    content_am: `
      <p>እንኳን ወደ የድር ንድፍ ኮርስ በደህና መጡ። በዚህ ኮርስ የድር ገፅ እንዴት እንደሚፈጥሩ ታማሩ:</p>
      <ul>
        <li><strong>HTML</strong> — የገፁን መዋቅር ይፈጥራል።</li>
        <li><strong>CSS</strong> — ቀለምና ንድፍን ይጨምራል።</li>
        <li><strong>JavaScript</strong> — ገፁን እንቅስቃሴ ያቀርባል።</li>
      </ul>
    `,
    quiz: [
      { q: "Which language is used to structure a web page?", a: "HTML" },
      { q: "Which language adds styles and colors?", a: "CSS" }
    ]
  },
  {
    id: "html",
    title_en: "HTML Basics",
    title_am: "HTML መሠረታዊ ነጥቦች",
    content_en: `
      <p>HTML uses <em>tags</em> to define elements on a webpage.</p>
      <div class="code">
        &lt;h1&gt;Hello World&lt;/h1&gt;<br>
        &lt;p&gt;This is my first web page.&lt;/p&gt;
      </div>
    `,
    content_am: `
      <p>HTML ታጎችን በመጠቀም የገፁን ክፍሎች ይፈጥራል።</p>
      <div class="code">
        &lt;h1&gt;ሰላም አለም&lt;/h1&gt;<br>
        &lt;p&gt;ይህ የመጀመሪያ ገፄ ነው።&lt;/p&gt;
      </div>
    `,
    quiz: [
      { q: "Which HTML tag creates a main heading?", a: "h1" },
      { q: "Which tag is used for paragraphs?", a: "p" }
    ]
  },
  {
    id: "css",
    title_en: "CSS Styling",
    title_am: "CSS ንድፍ",
    content_en: `
      <p>CSS adds color and style to your pages.</p>
      <div class="code">
        h1 { color: blue; }<br>
        p { font-size: 16px; }
      </div>
    `,
    content_am: `
      <p>CSS የገፁን ቀለምና ንድፍ ያቀርባል።</p>
      <div class="code">
        h1 { color: blue; }<br>
        p { font-size: 16px; }
      </div>
    `,
    quiz: [
      { q: "Which CSS property changes text color?", a: "color" },
      { q: "Which property sets text size?", a: "font-size" }
    ]
  }
];

// Elements
const lessonList = document.getElementById("lessonList");
const lessonView = document.getElementById("lessonView");
const quizView = document.getElementById("quizView");
const assistantInput = document.getElementById("assistantInput");
const assistantOutput = document.getElementById("assistantOutput");
const askBtn = document.getElementById("askBtn");
const practiceBtn = document.getElementById("practiceBtn");
const langSelect = document.getElementById("langSelect");
const resetBtn = document.getElementById("resetBtn");

let state = {
  currentLesson: "intro",
  lang: localStorage.getItem("lang") || "en",
  progress: JSON.parse(localStorage.getItem("progress") || "{}"),
};

// Save to local storage
function saveProgress() {
  localStorage.setItem("lang", state.lang);
  localStorage.setItem("progress", JSON.stringify(state.progress));
}

// Render lessons
function renderLessonList() {
  lessonList.innerHTML = "";
  lessons.forEach((lesson) => {
    const btn = document.createElement("button");
    btn.textContent = state.lang === "am" ? lesson.title_am : lesson.title_en;
    if (lesson.id === state.currentLesson) btn.classList.add("active");
    btn.onclick = () => {
      state.currentLesson = lesson.id;
      renderLesson();
    };
    lessonList.appendChild(btn);
  });
}

// Render current lesson
function renderLesson() {
  renderLessonList();
  const lesson = lessons.find((l) => l.id === state.currentLesson);
  if (!lesson) return;
  const title = state.lang === "am" ? lesson.title_am : lesson.title_en;
  const content = state.lang === "am" ? lesson.content_am : lesson.content_en;

  lessonView.innerHTML = `
    <h2>${title}</h2>
    <div>${content}</div>
    <button class="primary" id="quizBtn">Take Quiz</button>
  `;

  document.getElementById("quizBtn").onclick = () => renderQuiz(lesson);
}

// Quiz rendering
function renderQuiz(lesson) {
  quizView.classList.remove("hidden");
  quizView.innerHTML = `<h3>Quiz - ${lesson.title_en}</h3>`;

  lesson.quiz.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>Q${i + 1}:</strong> ${q.q}</p>
      <input type="text" id="answer${i}" placeholder="Your answer" />
      <button onclick="checkAnswer('${lesson.id}', ${i}, '${q.a}')">Submit</button>
      <p id="result${i}" style="color:#0066cc"></p>
    `;
    quizView.appendChild(div);
  });
}

window.checkAnswer = function (lessonId, index, correct) {
  const input = document.getElementById(`answer${index}`).value.trim().toLowerCase();
  const result = document.getElementById(`result${index}`);
  if (input === correct.toLowerCase()) {
    result.textContent = "✅ Correct!";
    state.progress[lessonId] = (state.progress[lessonId] || 0) + 1;
    saveProgress();
  } else {
    result.textContent = `❌ Try again (Hint: ${correct})`;
  }
};

// AI Assistant (basic offline)
askBtn.onclick = () => {
  const question = assistantInput.value.trim();
  if (!question) return (assistantOutput.textContent = "Please type a question first!");
  assistantOutput.textContent = "🤖 (Offline AI) — Think about this: " + question;
};

practiceBtn.onclick = () => {
  const lesson = lessons.find((l) => l.id === state.currentLesson);
  if (!lesson) return;
  const random = lesson.quiz[Math.floor(Math.random() * lesson.quiz.length)];
  assistantOutput.innerHTML = `<strong>Practice Question:</strong> ${random.q}`;
};

// Language switch
langSelect.onchange = (e) => {
  state.lang = e.target.value;
  saveProgress();
  renderLesson();
};

// Reset
resetBtn.onclick = () => {
  if (confirm("Are you sure you want to reset progress?")) {
    state.progress = {};
    saveProgress();
    renderLesson();
  }
};

// Initialize
renderLesson();
