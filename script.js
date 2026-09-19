const data = {
  1: {
    words: [
      ["안녕하세요", "你好 / 您好", "annyeonghaseyo"],
      ["감사합니다", "谢谢", "gamsahamnida"],
      ["친구", "朋友", "chingu"],
      ["학교", "学校", "hakgyo"],
      ["물", "水", "mul"],
      ["밥", "饭", "bap"]
    ],
    sentences: [
      ["안녕하세요!", "你好！", "annyeonghaseyo"],
      ["감사합니다.", "谢谢。", "gamsahamnida"],
      ["저는 학생이에요.", "我是学生。", "jeoneun haksaeng-ieyo"]
    ]
  },
  2: {
    words: [
      ["오늘", "今天", "oneul"],
      ["내일", "明天", "naeil"],
      ["좋아하다", "喜欢", "joahada"],
      ["먹다", "吃", "meokda"],
      ["가다", "去", "gada"],
      ["공부", "学习", "gongbu"]
    ],
    sentences: [
      ["오늘 학교에 가요.", "今天去学校。", "oneul hakgyoe gayo"],
      ["저는 한국어를 공부해요.", "我学习韩语。", "jeoneun hangugeoreul gongbuhaeyo"],
      ["무엇을 좋아해요?", "你喜欢什么？", "mueoseul joahaeyo"]
    ]
  },
  3: {
    words: [
      ["약속", "约定 / 约会", "yaksok"],
      ["경험", "经验", "gyeongheom"],
      ["준비하다", "准备", "junbihada"],
      ["필요하다", "需要", "piryohada"],
      ["생각하다", "想 / 认为", "saenggakhada"],
      ["연습하다", "练习", "yeonseuphada"]
    ],
    sentences: [
      ["주말에 친구와 약속이 있어요.", "周末和朋友有约。", "jumare chinguwa yaksogi isseoyo"],
      ["한국어를 더 열심히 연습하고 있어요.", "正在更加努力地练习韩语。", "hangugeoreul deo yeolsimhi yeonseuphago isseoyo"],
      ["이것은 정말 필요한 것 같아요.", "我觉得这个真的很有必要。", "igeoseun jeongmal piryohan geot gatayo"]
    ]
  }
};

let currentLevel = 1;
let quizIndex = 0;
let score = 0;

const content = document.getElementById("content");

document.querySelectorAll(".level").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".level").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLevel = Number(btn.dataset.level);
    quizIndex = 0;
    score = 0;
    content.innerHTML = '<div class="welcome">레벨이 바뀌었어요! 공부할 내용을 선택해 보세요. 😊</div>';
  });
});

document.querySelectorAll(".choice").forEach(btn => {
  btn.addEventListener("click", () => showSection(btn.dataset.section));
});

function showSection(section) {
  if (section === "words") showWords();
  if (section === "sentences") showSentences();
  if (section === "quiz") startQuiz();
}

function showWords() {
  const words = data[currentLevel].words;
  content.innerHTML = `<h3>📖 단어 공부</h3>` +
    words.map(w => `
      <div class="word">
        <div><strong>${w[0]}</strong><br><small>${w[2]}</small></div>
        <div class="cn">${w[1]}</div>
      </div>`).join("");
}

function showSentences() {
  const sentences = data[currentLevel].sentences;
  content.innerHTML = `<h3>💬 문장 공부</h3>` +
    sentences.map(s => `
      <div class="word">
        <div><strong>${s[0]}</strong><br><small>${s[2]}</small></div>
        <div class="cn">${s[1]}</div>
      </div>`).join("");
}

function startQuiz() {
  quizIndex = 0;
  score = 0;
  renderQuiz();
}

function renderQuiz() {
  const questions = data[currentLevel].words;
  if (quizIndex >= questions.length) {
    content.innerHTML = `
      <h3>🎉 퀴즈 완료!</h3>
      <div class="quiz-question">점수: ${score} / ${questions.length}</div>
      <button onclick="startQuiz()">🔄 다시 풀기</button>`;
    return;
  }

  const q = questions[quizIndex];
  const options = [...questions].sort(() => Math.random() - .5).slice(0, 4);
  if (!options.some(o => o[0] === q[0])) options[0] = q;
  options.sort(() => Math.random() - .5);

  content.innerHTML = `
    <div class="quiz-question">${quizIndex + 1}. 「${q[0]}」의 뜻은?</div>
    <div class="quiz-options">
      ${options.map(o => `<button data-answer="${o[0]}">${o[1]}</button>`).join("")}
    </div>`;

  content.querySelectorAll("[data-answer]").forEach(btn => {
    btn.addEventListener("click", () => {
      const correct = btn.dataset.answer === q[0];
      btn.classList.add(correct ? "correct" : "wrong");
      if (correct) score++;
      setTimeout(() => { quizIndex++; renderQuiz(); }, 550);
    });
  });
}
