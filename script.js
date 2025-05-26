let currentPage = 1;
const totalPages = 6;

function showPage(pageNum) {
  for (let i = 1; i <= totalPages; i++) {
    const page = document.getElementById(`page-${i}`);
    if (page) page.classList.remove("active");
  }
  const current = document.getElementById(`page-${pageNum}`);
  if (current) current.classList.add("active");

  document.getElementById("page-indicator").innerText = `第 ${pageNum} 页 / ${totalPages} 页`;
  currentPage = pageNum;
}

function nextPage() {
  if (currentPage < totalPages) {
    showPage(currentPage + 1);
  }
}

function prevPage() {
  if (currentPage > 1) {
    showPage(currentPage - 1);
  }
}

// 初始显示第一页
showPage(1);

// 倒计时逻辑
const birthday = new Date("2024-05-20");
const today = new Date();
const diffTime = Math.abs(today - birthday);
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
document.getElementById("days-count").innerText = `${diffDays} 天 🎈`;

// 拼图逻辑，保证拼图区域在page-2显示
function startPuzzle() {
  const puzzleArea = document.getElementById("puzzle-area");
  puzzleArea.style.display = "block";

  const puzzle = document.getElementById("puzzle");
  puzzle.innerHTML = "";

  const order = Array.from({ length: 9 }, (_, i) => i);
  shuffleArray(order);

  order.forEach((pos, idx) => {
    const piece = document.createElement("div");
    piece.className = "puzzle-piece";
    piece.style.backgroundPosition = `-${(pos % 3) * 100}px -${Math.floor(pos / 3) * 100}px`;
    piece.dataset.correct = pos; // 正确的位置编号
    piece.dataset.index = idx;   // 当前所在位置编号
    piece.draggable = true;

    piece.addEventListener("dragstart", dragStart);
    piece.addEventListener("dragover", e => e.preventDefault());
    piece.addEventListener("drop", dropPiece);

    puzzle.appendChild(piece);
  });
}

function dropPiece(e) {
  if (!dragged || dragged === e.target) return;

  // 交换样式
  const tempStyle = dragged.style.backgroundPosition;
  const tempCorrect = dragged.dataset.correct;

  dragged.style.backgroundPosition = e.target.style.backgroundPosition;
  dragged.dataset.correct = e.target.dataset.correct;

  e.target.style.backgroundPosition = tempStyle;
  e.target.dataset.correct = tempCorrect;

  checkWin();
}

function checkWin() {
  const pieces = document.querySelectorAll(".puzzle-piece");
  let correct = true;
  pieces.forEach((el, idx) => {
    if (parseInt(el.dataset.correct) !== idx) {
      correct = false;
    }
  });
  if (correct) {
    showBlessing();
  }
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showBlessing() {
  showPage(3); // 自动翻到轮播页
  startCarousel();
  typeBlessing([
    "🎉 解锁成功！",
    "愿你：",
    "每天都像生日一样被爱包围，",
    "快乐如期而至，",
    "好运奔向你，",
    "你也奔向我 :)"
  ]);
}

function startCarousel() {
  const images = document.querySelectorAll(".carousel-img");
  let index = 0;
  images.forEach(img => img.classList.remove("active"));
  images[0].classList.add("active");
  setInterval(() => {
    images.forEach(img => img.classList.remove("active"));
    index = (index + 1) % images.length;
    images[index].classList.add("active");
  }, 3000);
}

function typeBlessing(lines) {
  const container = document.getElementById("blessing-text");
  container.innerHTML = "";
  let i = 0;

  function showLine() {
    if (i < lines.length) {
      const p = document.createElement("div");
      p.textContent = "";
      container.appendChild(p);
      let charIndex = 0;
      const typing = setInterval(() => {
        p.textContent += lines[i][charIndex];
        charIndex++;
        if (charIndex === lines[i].length) {
          clearInterval(typing);
          i++;
          setTimeout(showLine, 600);
        }
      }, 50);
    }
  }

  showLine();
}

// 音乐开关
function toggleMusic() {
  const music = document.getElementById("bg-music");
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

// 抽卡小游戏（第6页）示例简易实现
function drawCard() {
  const cards = [
    {text: "祝你天天开心！", rarity: "普通"},
    {text: "好运连连！", rarity: "普通"},
    {text: "闪耀如星！", rarity: "闪卡✨"},
    {text: "永远被爱包围！", rarity: "闪卡✨"},
    {text: "抽中我请你喝奶茶🧋！", rarity: "隐藏卡🔥"}
  ];
  const randIndex = Math.floor(Math.random() * cards.length);
  const card = cards[randIndex];
  const cardResult = document.getElementById("card-result");
  cardResult.innerHTML = `<p>【${card.rarity}】${card.text}</p>`;
}
