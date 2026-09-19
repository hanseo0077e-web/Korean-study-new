const easy=[
["안녕하세요","你好 / 您好","annyeonghaseyo"],
["감사합니다","谢谢","gamsahamnida"],
["친구","朋友","chingu"],
["학교","学校","hakgyo"],
["물","水","mul"],
["밥","饭","bap"],
["사랑","爱","sarang"],
["엄마","妈妈","eomma"],
["아빠","爸爸","appa"],
["고양이","猫","goyangi"],
["강아지","小狗","gangaji"],
["책","书","chaek"]
];
const middle=[
["오늘","今天","oneul"],["내일","明天","naeil"],["좋아해요","喜欢","joahaeyo"],
["먹어요","吃","meogeoyo"],["가요","去","gayo"],["공부해요","学习","gongbuhaeyo"],
["예뻐요","漂亮","yeppeoyo"],["재미있어요","有趣","jaemiisseoyo"],["준비해요","准备","junbihaeyo"]
];
let words=easy,currentLevel="easy",quizIndex=0,score=0;
const $=s=>document.querySelector(s);

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
 document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
 b.classList.add("active"); $("#"+b.dataset.page).classList.add("active");
 if(b.dataset.page==="quiz") startQuiz();
});
document.querySelectorAll(".level").forEach(b=>b.onclick=()=>{
 document.querySelectorAll(".level").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 currentLevel=b.dataset.level;words=currentLevel==="easy"?easy:middle;renderWords();
});
function speak(text,lang){if("speechSynthesis" in window){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=.82;speechSynthesis.speak(u)}}
function renderWords(){
 $("#wordList").innerHTML=words.map((w,i)=>`<article class="word-card">
 <div class="word-top"><div class="ko">${w[0]}</div><button class="speaker" onclick="speak('${w[0]}','ko-KR')">🔊</button></div>
 <div class="cn">${w[1]}</div><div class="pinyin">${w[2]}</div>
 <div class="card-buttons"><button onclick="speak('${w[0]}','ko-KR')">🇰🇷 한국어 듣기</button><button onclick="speak('${w[1].split(' / ')[0]}','zh-CN')">🇨🇳 中文 듣기</button></div>
 </article>`).join("");
}
renderWords();

const letters=[["가",4],["나",4],["다",4],["라",3],["마",4],["바",4],["사",4]];
let currentLetter=0,animTimer;
$("#letterChoice").innerHTML=letters.map((x,i)=>`<button class="${i===0?'active':''}" data-i="${i}">${x[0]}</button>`).join("");
document.querySelectorAll("#letterChoice button").forEach(b=>b.onclick=()=>selectLetter(+b.dataset.i));
function selectLetter(i){
 currentLetter=i;document.querySelectorAll("#letterChoice button").forEach(b=>b.classList.toggle("active",+b.dataset.i===i));
 $("#strokeLetter").textContent=letters[i][0];$("#strokeProgress").style.setProperty("--progress","0%");
}
function playStroke(){
 clearInterval(animTimer);let total=letters[currentLetter][1],n=0;
 $("#strokeLetter").classList.remove("animating");void $("#strokeLetter").offsetWidth;$("#strokeLetter").classList.add("animating");
 animTimer=setInterval(()=>{n++;$("#strokeProgress").style.setProperty("--progress",(n/total*100)+"%");if(n>=total)clearInterval(animTimer)},500);
}
$("#playStroke").onclick=playStroke;
$("#clearCanvas").onclick=()=>ctx.clearRect(0,0,canvas.width,canvas.height);

const canvas=$("#drawCanvas"),ctx=canvas.getContext("2d");let drawing=false;
function pos(e){const r=canvas.getBoundingClientRect(),p=e.touches?e.touches[0]:e;return{x:(p.clientX-r.left)*canvas.width/r.width,y:(p.clientY-r.top)*canvas.height/r.height}}
function start(e){drawing=true;let p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault()}
function move(e){if(!drawing)return;let p=pos(e);ctx.lineTo(p.x,p.y);ctx.strokeStyle="#6657d9";ctx.lineWidth=9;ctx.lineCap="round";ctx.stroke();e.preventDefault()}
canvas.addEventListener("mousedown",start);canvas.addEventListener("mousemove",move);canvas.addEventListener("mouseup",()=>drawing=false);
canvas.addEventListener("touchstart",start,{passive:false});canvas.addEventListener("touchmove",move,{passive:false});canvas.addEventListener("touchend",()=>drawing=false);

function startQuiz(){quizIndex=0;score=0;renderQuiz()}
function renderQuiz(){
 if(quizIndex>=words.length){$("#quizCard").innerHTML=`<div class="score">🎉 퀴즈 끝!</div><p>${words.length}문제 중 <b>${score}</b>개 맞혔어요!</p><button class="answer" onclick="startQuiz()">🔄 다시 하기</button>`;return}
 let q=words[quizIndex],opts=[q,...words.filter(x=>x!==q).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
 $("#quizCard").innerHTML=`<div class="q-number">${quizIndex+1} / ${words.length}</div><div class="question">「${q[0]}」의 뜻은?</div><div class="answers">${opts.map(o=>`<button class="answer" data-v="${o[0]}">${o[1].split(" / ")[0]}</button>`).join("")}</div>`;
 document.querySelectorAll(".answer[data-v]").forEach(b=>b.onclick=()=>{
   let ok=b.dataset.v===q[0];b.classList.add(ok?"correct":"wrong");if(ok){score++;speak("정답이에요","ko-KR")}else speak("다시 생각해 봐요","ko-KR");
   setTimeout(()=>{quizIndex++;renderQuiz()},650);
 });
}
