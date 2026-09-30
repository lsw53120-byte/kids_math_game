// 6세 맞춤형 수학 모험 게임 로직

// 레벨 및 난이도별 목표 설정 (1단계: 1~5 추가 및 4단계 체계)
const LEVEL_CONFIG = {
  1: { level: 1, name: '1단계 (1~5)', addGoal: 3, subGoal: 2, reward: '👑' },
  2: { level: 2, name: '2단계 (6~10)', addGoal: 4, subGoal: 3, reward: '🏆' },
  3: { level: 3, name: '3단계 (11~15)', addGoal: 4, subGoal: 4, reward: '🌟' },
  4: { level: 4, name: '4단계 (16~20)', addGoal: 5, subGoal: 5, reward: '🚀' }
};

// 전역 상태
const STATE = {
  stars: 0,
  currentMode: null, // 'add', 'sub', 'quiz'
  difficulty: 1,     // 1단계: 1~5, 2단계: 6~10, 3단계: 11~15, 4단계: 16~20
  unlockedLevel: 1,
  missions: {},
  currentTheme: 'animals', // 'animals', 'dino', 'space', 'car'
  currentProblem: null,
  eatenCount: 0,
  poppedCount: 0,
  stickers: [],
  soundMuted: false,
  answered: false,
  attemptHadMistake: false,
  activityDone: false,
};

// 테마 정의 (자연스러운 쉼표 호흡 및 다정한 말투 적용)
const THEMES = {
  animals: {
    id: 'animals',
    name: '동물 친구들',
    mascot: '🐻',
    title: '냠냠 팡팡!<br>수학 놀이터',
    voiceIntro: '안녕? 오늘은 동물 친구들과 함께, 천천히 세어 보자.',
    targets: [
      { icon: '🐻', name: '곰돌이' },
      { icon: '🐰', name: '토끼' },
      { icon: '🐼', name: '판다' },
      { icon: '🐶', name: '강아지' },
      { icon: '🐱', name: '야옹이' },
      { icon: '🦁', name: '사자' }
    ],
    addItems: ['🍎', '🍓', '🍌', '🍇', '🥕', '🍩', '🍪', '🥞'],
    addPrompt: (t, n1, n2) => `${t.name}에게 간식 ${n1}개가 있어. ${n2}개를 더 주면 모두 몇 개일까? 그림을 하나씩 눌러서 같이 세어 보자.`,
    addTitle: (t) => `${t.icon} ${t.name}에게 줄 간식은 모두 몇 개일까?`,
    addFeedAction: () => window.sound.playNom(),
    subItems: ['🎈', '🔴', '🟡', '🟢', '🟣', '🟠', '🔵'],
    subPrompt: (n1, n2) => `풍선 ${n1}개가 있네. ${n2}개를 터뜨리고, 남은 풍선을 세어 볼까?`,
    subTitle: (n2) => `풍선 ${n2}개를 톡! 터뜨리고 남은 개수를 맞춰봐!`,
    subUnit: '개',
    subAction: () => window.sound.playPop()
  },
  dino: {
    id: 'dino',
    name: '공룡 대탐험',
    mascot: '🦖',
    title: '쿵쿵 크아앙!<br>공룡 수학 모험',
    voiceIntro: '쿵쿵, 공룡 친구들이 왔네! 같이 하나씩 세어 보자.',
    targets: [
      { icon: '🦖', name: '티라노' },
      { icon: '🦕', name: '브라키오' },
      { icon: '🦅', name: '프테라노돈' },
      { icon: '🐊', name: '아기공룡' }
    ],
    addItems: ['🍖', '🥩', '🍗', '🌿', '🪵', '🍄', '🍎'],
    addPrompt: (t, n1, n2) => `${t.name}에게 먹이 ${n1}개가 있어. ${n2}개를 더 주면 모두 몇 개일까? 하나씩 눌러서 같이 세어 보자.`,
    addTitle: (t) => `${t.icon} ${t.name}에게 줄 먹이는 모두 몇 개일까?`,
    addFeedAction: () => window.sound.playDinoStomp(),
    subItems: ['🥚', '🥚', '🥚', '🥚', '🥚', '🥚', '🥚'],
    subPrompt: (n1, n2) => `공룡 알 ${n1}개가 있네. ${n2}개를 톡 깨뜨리고, 남은 알을 세어 볼까?`,
    subTitle: (n2) => `공룡 알 ${n2}개를 톡! 깨뜨리고 남은 알을 세어봐!`,
    subUnit: '개',
    subAction: () => window.sound.playDinoStomp()
  },
  space: {
    id: 'space',
    name: '우주 별나라',
    mascot: '🚀',
    title: '슈우웅 퓨융!<br>우주 수학 탐험',
    voiceIntro: '우주로 출발해 볼까? 반짝이는 별을 같이 세어 보자.',
    targets: [
      { icon: '🚀', name: '우주선' },
      { icon: '🛸', name: 'UFO' },
      { icon: '👨‍🚀', name: '우주비행사' },
      { icon: '👾', name: '외계인 친구' }
    ],
    addItems: ['⭐', '⚡', '🔋', '💎', '🪐', '💫', '🌟'],
    addPrompt: (t, n1, n2) => `${t.name}에 별 ${n1}개가 있어. ${n2}개를 더 채우면 모두 몇 개일까? 하나씩 눌러 보자.`,
    addTitle: (t) => `${t.icon} ${t.name}에 충전할 에너지는 모두 몇 개일까?`,
    addFeedAction: () => window.sound.playStar(),
    subItems: ['☄️', '🌑', '🪐', '🌌', '🛸', '🛰️', '💫'],
    subPrompt: (n1, n2) => `운석 ${n1}개가 있네. ${n2}개를 쏘고 나면 몇 개가 남을까?`,
    subTitle: (n2) => `운석 ${n2}개를 레이저로 팡! 쏘고 남은 것을 세어봐!`,
    subUnit: '개',
    subAction: () => window.sound.playLaser()
  },
  car: {
    id: 'car',
    name: '씽씽 자동차',
    mascot: '🏎️',
    title: '부릉부릉 빵빵!<br>자동차 수학 레이싱',
    voiceIntro: '부릉부릉, 자동차가 왔네! 같이 세어 볼까?',
    targets: [
      { icon: '🅿️', name: '주차장' },
      { icon: '🏁', name: '도착지' },
      { icon: '⛽', name: '주유소' },
      { icon: '🚏', name: '정류장' }
    ],
    addItems: ['🚗', '🚙', '🚕', '🚓', '🚑', '🚒', '🚚', '🏎️'],
    addPrompt: (t, n1, n2) => `${t.name}에 자동차 ${n1}대가 있어. ${n2}대가 더 오면 모두 몇 대일까? 차를 하나씩 눌러 보자.`,
    addTitle: (t) => `${t.icon} ${t.name}에 모인 자동차는 모두 몇 대일까?`,
    addFeedAction: () => window.sound.playCarHonk(),
    subItems: ['🚗', '🚕', '🚙', '🏎️', '🚐', '🚚', '🛵'],
    subPrompt: (n1, n2) => `자동차 ${n1}대가 있네. ${n2}대를 출발시키고, 남은 차를 세어 볼까?`,
    subTitle: (n2) => `자동차 ${n2}대를 탭해서 슝 출발시키고 남은 차를 세어봐!`,
    subUnit: '대',
    subAction: () => window.sound.playCarHonk()
  }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  setupUIEventListeners();
  updateHeaderStats();
  updateLevelGoalProgress();
});

function loadSavedData() {
  try {
    const savedStars = localStorage.getItem('math_kids_stars');
    const savedStickers = localStorage.getItem('math_kids_stickers');
    const savedDiff = localStorage.getItem('math_kids_diff');
    const savedUnlocked = localStorage.getItem('math_kids_unlocked_level');
    const savedMissions = localStorage.getItem('math_kids_missions');
    const savedTheme = localStorage.getItem('math_kids_theme');
    if (savedStars) STATE.stars = Math.max(0, Number(savedStars) || 0);
    if (savedStickers) {
      const stickers = JSON.parse(savedStickers);
      STATE.stickers = Array.isArray(stickers) ? stickers : [];
    }
    // 이전 버전은 아무 단계나 고를 수 있었으므로 새 미션은 1단계부터 시작한다.
    STATE.unlockedLevel = Math.max(1, Math.min(4, parseInt(savedUnlocked, 10) || 1));
    STATE.difficulty = Math.max(1, Math.min(STATE.unlockedLevel, parseInt(savedDiff, 10) || 1));
    if (savedMissions) STATE.missions = JSON.parse(savedMissions);
    if (!STATE.missions || typeof STATE.missions !== 'object' || Array.isArray(STATE.missions)) STATE.missions = {};
    if (savedTheme && THEMES[savedTheme]) {
      applyTheme(savedTheme, false);
    }
  } catch (e) {
    console.warn(e);
  }
  updateDifficultyButtons();
}

function saveData() {
  try {
    localStorage.setItem('math_kids_stars', STATE.stars);
    localStorage.setItem('math_kids_unlocked_level', STATE.unlockedLevel);
    localStorage.setItem('math_kids_missions', JSON.stringify(STATE.missions));
    localStorage.setItem('math_kids_stickers', JSON.stringify(STATE.stickers));
    localStorage.setItem('math_kids_diff', STATE.difficulty);
    localStorage.setItem('math_kids_theme', STATE.currentTheme);
  } catch (e) {
    console.warn(e);
  }
}

function currentMission() {
  const level = STATE.difficulty;
  const saved = STATE.missions[level];
  if (!saved || typeof saved !== 'object') STATE.missions[level] = { add: [], sub: [] };
  const mission = STATE.missions[level];
  if (!Array.isArray(mission.add)) mission.add = [];
  if (!Array.isArray(mission.sub)) mission.sub = [];
  return mission;
}

function problemKey(problem) {
  if (problem.type === '+') return `${Math.min(problem.num1, problem.num2)}+${Math.max(problem.num1, problem.num2)}`;
  return `${problem.num1}-${problem.num2}`;
}

function freshProblem(type) {
  const seen = currentMission()[type];
  let problem = generateProblem(type);
  for (let tries = 0; tries < 60 && seen.includes(problemKey(problem)); tries++) {
    problem = generateProblem(type);
  }
  return problem;
}

function updateDifficultyButtons() {
  document.querySelectorAll('.diff-btn').forEach(btn => {
    const level = Number(btn.dataset.level);
    btn.disabled = level > STATE.unlockedLevel;
    btn.classList.toggle('active', level === STATE.difficulty);
    btn.setAttribute('aria-label', `${level}단계 ${btn.disabled ? '잠김' : '선택 가능'}`);
  });
}

function applyTheme(themeId, speakAnnouncement = true) {
  const theme = THEMES[themeId];
  if (!theme) return;
  STATE.currentTheme = themeId;
  saveData();

  // 바디 클래스 변경
  document.body.className = themeId === 'animals' ? '' : `theme-${themeId}`;

  // 마스코트 & 타이틀 변경
  const mascotEl = document.getElementById('main-mascot');
  if (mascotEl) mascotEl.textContent = theme.mascot;

  const titleEl = document.querySelector('.main-title');
  if (titleEl) titleEl.innerHTML = theme.title;

  // 탭 active 갱신
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === themeId);
  });

  if (speakAnnouncement) {
    window.sound.speak(theme.voiceIntro);
  }
}

function updateHeaderStats() {
  document.getElementById('star-count-display').textContent = STATE.stars;
  document.getElementById('sticker-count-display').textContent = STATE.stickers.length;
}

// 이벤트 리스너 세팅
function setupUIEventListeners() {
  // 첫 터치/클릭 시 오디오 활성화
  document.body.addEventListener('touchstart', () => window.sound.init(), { once: true });
  document.body.addEventListener('click', () => window.sound.init(), { once: true });

  // 상단 홈 버튼
  document.getElementById('home-btn').addEventListener('click', () => {
    window.sound.playClick();
    clearPendingNext();
    window.sound.stopSpeech();
    document.getElementById('reward-modal-overlay').classList.remove('active');
    document.getElementById('levelup-modal-overlay').classList.remove('active');
    STATE.currentMode = null;
    showScreen('home-screen');
  });

  // 상단 소리 토글 버튼
  const soundBtn = document.getElementById('sound-toggle-btn');
  soundBtn.addEventListener('click', () => {
    STATE.soundMuted = !STATE.soundMuted;
    window.sound.isMuted = STATE.soundMuted;
    window.sound.speechEnabled = !STATE.soundMuted;
    if (STATE.soundMuted) window.sound.stopSpeech();
    soundBtn.textContent = STATE.soundMuted ? '🔇' : '🔊';
    if (!STATE.soundMuted) window.sound.playClick();
  });

  // 테마 선택 버튼 클릭 이벤트
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      window.sound.playClick();
      const themeId = e.currentTarget.dataset.theme;
      applyTheme(themeId, true);
    });
  });

  // 난이도 선택 버튼 (1단계: 1~5부터 4단계: 16~20까지)
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedLevel = Number(e.currentTarget.dataset.level);
      if (selectedLevel > STATE.unlockedLevel) return;
      window.sound.playClick();
      STATE.difficulty = selectedLevel;
      updateDifficultyButtons();
      saveData();
      updateLevelGoalProgress();
      
      const diffNames = {
        1: '1단계야. 다섯까지 함께 세어 볼까?',
        2: '2단계야. 열까지 도전해 보자!',
        3: '3단계야. 열다섯까지 해 볼까?',
        4: '4단계야. 스물까지 도전해 보자!'
      };
      window.sound.speak(diffNames[STATE.difficulty]);
    });
  });

  // 게임 모드 선택
  document.getElementById('btn-mode-add').addEventListener('click', () => startAddMode());
  document.getElementById('btn-mode-sub').addEventListener('click', () => startSubMode());
  document.getElementById('btn-mode-quiz').addEventListener('click', () => startQuizMode());
  document.getElementById('btn-mode-stickers').addEventListener('click', () => openStickerBook());

  // 음성 다시 듣기 버튼
  document.getElementById('replay-voice-btn').addEventListener('click', () => {
    window.sound.playClick();
    if (STATE.currentProblem && STATE.currentProblem.voiceText) {
      window.sound.speak(STATE.currentProblem.voiceText);
    }
  });

  // 다음 문제 모달 버튼
  document.getElementById('modal-next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    goToNextProblem();
  });
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(screenId);
  screen.classList.add('active');
  screen.scrollTop = 0;
}

// ----------------------------------------------------
// 목표 진행도 및 상단 상태 UI 갱신
// ----------------------------------------------------
function updateLevelGoalProgress() {
  const config = LEVEL_CONFIG[STATE.difficulty] || LEVEL_CONFIG[1];
  const badgeEl = document.getElementById('current-level-badge');
  const textEl = document.getElementById('goal-remaining-text');
  const fillEl = document.getElementById('goal-progress-fill');
  
  if (badgeEl) badgeEl.textContent = config.name;
  
  const mission = currentMission();
  const addCount = Math.min(mission.add.length, config.addGoal);
  const subCount = Math.min(mission.sub.length, config.subGoal);
  const pct = Math.round(((addCount + subCount) / (config.addGoal + config.subGoal)) * 100);

  if (textEl) {
    textEl.textContent = `더하기 ${addCount}/${config.addGoal} · 빼기 ${subCount}/${config.subGoal}`;
  }
  const guide = document.getElementById('home-mission-guide');
  if (guide) guide.textContent = `그림을 세고 한 번에 맞히기 · 더하기 ${config.addGoal}개, 빼기 ${config.subGoal}개를 완료하면 선물 🎁`;
  if (fillEl) fillEl.style.width = `${pct}%`;
}

// 오답 패널티 플로팅 토스트 표시
function triggerPenaltyToast() {
  const toast = document.getElementById('penalty-toast');
  if (!toast) return;
  toast.classList.remove('active');
  void toast.offsetWidth; // 리플로우
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 1600);
}

// ----------------------------------------------------
// 문제 생성기 (1단계: 1~5, 2단계: 6~10, 3단계: 11~15, 4단계: 16~20)
// ----------------------------------------------------
function generateProblem(type) {
  let num1, num2, ans;
  
  if (type === 'add') {
    if (STATE.difficulty === 1) {
      // 1단계: 1~5 (합이 2~5)
      ans = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
      num1 = Math.floor(Math.random() * (ans - 1)) + 1;
      num2 = ans - num1;
    } else if (STATE.difficulty === 2) {
      // 2단계: 6~10 (합이 6~10)
      ans = Math.floor(Math.random() * 5) + 6; // 6, 7, 8, 9, 10
      num1 = Math.floor(Math.random() * (ans - 2)) + 1;
      num2 = ans - num1;
    } else if (STATE.difficulty === 3) {
      // 3단계: 11~15 (합이 11~15)
      ans = Math.floor(Math.random() * 5) + 11; // 11, 12, 13, 14, 15
      num1 = Math.floor(Math.random() * 5) + 4;
      num2 = ans - num1;
    } else {
      // 4단계: 16~20 (합이 16~20)
      ans = Math.floor(Math.random() * 5) + 16; // 16, 17, 18, 19, 20
      num1 = Math.floor(Math.random() * 6) + 7;
      num2 = ans - num1;
    }
    return { num1, num2, ans, type: '+' };
  } else {
    // 뺄셈
    if (STATE.difficulty === 1) {
      // 1단계: 1~5 (num1이 2~5)
      num1 = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
      num2 = Math.floor(Math.random() * num1) + 1;
      ans = num1 - num2;
    } else if (STATE.difficulty === 2) {
      // 2단계: 6~10 (num1이 6~10)
      num1 = Math.floor(Math.random() * 5) + 6; // 6 ~ 10
      num2 = Math.floor(Math.random() * num1) + 1;
      ans = num1 - num2;
    } else if (STATE.difficulty === 3) {
      // 3단계: 11~15 (num1이 11~15)
      num1 = Math.floor(Math.random() * 5) + 11;
      num2 = Math.floor(Math.random() * 5) + 3;
      ans = num1 - num2;
    } else {
      // 4단계: 16~20 (num1이 16~20)
      num1 = Math.floor(Math.random() * 5) + 16;
      num2 = Math.floor(Math.random() * 6) + 5;
      ans = num1 - num2;
    }
    return { num1, num2, ans, type: '-' };
  }
}

// ----------------------------------------------------
// [모드 1: 덧셈] 테마 맞춤형 합치기 모험
// ----------------------------------------------------
function startAddMode() {
  const mission = currentMission();
  const config = LEVEL_CONFIG[STATE.difficulty];
  if (mission.add.length >= config.addGoal && mission.sub.length < config.subGoal) return startSubMode();
  STATE.currentMode = 'add';
  showScreen('game-play-screen');
  nextAddProblem();
}

function nextAddProblem() {
  clearPendingNext();
  STATE.answered = false;
  STATE.attemptHadMistake = false;
  STATE.activityDone = false;
  const prob = freshProblem('add');
  STATE.currentProblem = prob;
  STATE.eatenCount = 0;

  const theme = THEMES[STATE.currentTheme] || THEMES.animals;
  const target = theme.targets[Math.floor(Math.random() * theme.targets.length)];
  const item1 = theme.addItems[Math.floor(Math.random() * theme.addItems.length)];
  let item2 = theme.addItems[Math.floor(Math.random() * theme.addItems.length)];
  while (item2 === item1) {
    item2 = theme.addItems[Math.floor(Math.random() * theme.addItems.length)];
  }

  // 수식 표시
  document.getElementById('eq-num1').textContent = prob.num1;
  document.getElementById('eq-operator').textContent = '+';
  document.getElementById('eq-num2').textContent = prob.num2;
  document.getElementById('eq-ans').textContent = '?';

  // 문제 음성 텍스트
  const voice = theme.addPrompt(target, prob.num1, prob.num2);
  prob.voiceText = voice;
  document.getElementById('prompt-text').textContent = theme.addTitle(target);
  window.sound.speak(voice);

  // 스테이지 렌더링
  const stage = document.getElementById('game-stage');
  stage.innerHTML = `
    <div class="feeder-stage">
      <div class="animal-avatar" id="animal-target">
        ${target.icon}
        <div class="food-count-bubble" id="eaten-counter">0</div>
      </div>
      <div class="food-groups">
        <div class="food-basket"><strong>${prob.num1}개</strong><div class="food-group" id="food-group-1"></div></div>
        <span class="group-plus">+</span>
        <div class="food-basket"><strong>${prob.num2}개</strong><div class="food-group" id="food-group-2"></div></div>
      </div>
    </div>
  `;

  // 바구니에 아이템 채우기
  const basket1 = document.getElementById('food-group-1');
  const basket2 = document.getElementById('food-group-2');
  for (let i = 0; i < prob.num1; i++) {
    basket1.appendChild(createFoodItem(item1, theme));
  }
  for (let i = 0; i < prob.num2; i++) {
    basket2.appendChild(createFoodItem(item2, theme));
  }

  // 보기 버튼 생성
  renderChoices(prob.ans);
}

function createFoodItem(itemEmoji, theme) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'food-item';
  item.textContent = itemEmoji;
  item.setAttribute('aria-label', '하나 세기');
  item.addEventListener('click', () => {
    if (STATE.answered || item.classList.contains('eaten')) return;
    item.classList.add('eaten');
    item.disabled = true;
    
    // 테마별 액션 사운드
    theme.addFeedAction();
    STATE.eatenCount++;
    
    // 애니메이션
    const target = document.getElementById('animal-target');
    target.classList.remove('nom-nom');
    void target.offsetWidth;
    target.classList.add('nom-nom');

    document.getElementById('eaten-counter').textContent = STATE.eatenCount;
    window.sound.speakCount(STATE.eatenCount, STATE.eatenCount === STATE.currentProblem.ans);

    if (STATE.eatenCount === STATE.currentProblem.ans) {
      unlockAnswers('모두 셌어요! 이제 답을 골라봐요.');
      window.sound.playStar();
    }
  });
  return item;
}

// ----------------------------------------------------
// [모드 2: 뺄셈] 테마 맞춤형 터뜨리기 / 출발 모험
// ----------------------------------------------------
function startSubMode() {
  const mission = currentMission();
  const config = LEVEL_CONFIG[STATE.difficulty];
  if (mission.sub.length >= config.subGoal && mission.add.length < config.addGoal) return startAddMode();
  STATE.currentMode = 'sub';
  showScreen('game-play-screen');
  nextSubProblem();
}

function nextSubProblem() {
  clearPendingNext();
  STATE.answered = false;
  STATE.attemptHadMistake = false;
  STATE.activityDone = false;
  const prob = freshProblem('sub');
  STATE.currentProblem = prob;
  STATE.poppedCount = 0;

  const theme = THEMES[STATE.currentTheme] || THEMES.animals;

  // 수식 표시
  document.getElementById('eq-num1').textContent = prob.num1;
  document.getElementById('eq-operator').textContent = '-';
  document.getElementById('eq-num2').textContent = prob.num2;
  document.getElementById('eq-ans').textContent = '?';

  const voice = theme.subPrompt(prob.num1, prob.num2);
  prob.voiceText = voice;
  document.getElementById('prompt-text').textContent = theme.subTitle(prob.num2);
  window.sound.speak(voice);

  // 스테이지 렌더링
  const stage = document.getElementById('game-stage');
  stage.innerHTML = `
    <div style="font-size:14px; color:#e03131; margin-bottom:8px; font-weight:bold;">
      목표: <span id="pop-target-display">${prob.num2}</span>${theme.subUnit} 중 <span id="pop-current-display">0</span>${theme.subUnit} 완료!
    </div>
    <div class="balloon-grid" id="balloon-grid"></div>
  `;

  const grid = document.getElementById('balloon-grid');
  const items = theme.subItems;
  for (let i = 0; i < prob.num1; i++) {
    const balloon = document.createElement('button');
    balloon.type = 'button';
    balloon.className = 'balloon';
    balloon.textContent = items[i % items.length];
    balloon.setAttribute('aria-label', '하나 빼기');
    balloon.style.animationDelay = `${(i * 0.22).toFixed(2)}s`;

    balloon.addEventListener('click', () => {
      if (STATE.answered || balloon.classList.contains('popped')) return;
      
      if (STATE.poppedCount < prob.num2) {
        balloon.classList.add('popped');
        balloon.disabled = true;
        theme.subAction();
        STATE.poppedCount++;
        document.getElementById('pop-current-display').textContent = STATE.poppedCount;

        if (STATE.poppedCount === prob.num2) {
          unlockAnswers('남은 것을 세고 답을 골라봐요.');
          window.sound.speakAfterPause('좋아. 이제 남아 있는 것만 하나씩 세어 보자.', 500);
        } else {
          window.sound.speakCount(STATE.poppedCount);
        }
      } else {
        window.sound.speakAfterPause('이제 남은 것을 세고 답을 골라 보자.');
      }
    });
    grid.appendChild(balloon);
  }

  // 보기 버튼 생성
  renderChoices(prob.ans);
}

// ----------------------------------------------------
// [모드 3: 스피드 퀴즈] 별나라 모험
// ----------------------------------------------------
function startQuizMode() {
  STATE.currentMode = 'quiz';
  showScreen('game-play-screen');
  nextQuizProblem();
}

function nextQuizProblem() {
  clearPendingNext();
  STATE.answered = false;
  STATE.attemptHadMistake = false;
  STATE.activityDone = true;
  const isAdd = Math.random() > 0.5;
  const prob = generateProblem(isAdd ? 'add' : 'sub');
  STATE.currentProblem = prob;

  document.getElementById('eq-num1').textContent = prob.num1;
  document.getElementById('eq-operator').textContent = prob.type;
  document.getElementById('eq-num2').textContent = prob.num2;
  document.getElementById('eq-ans').textContent = '?';

  const voice = prob.type === '+'
    ? `별 ${prob.num1}개와 ${prob.num2}개를 함께 세면 몇 개일까? 천천히 살펴보자.`
    : `보석 ${prob.num1}개에서 ${prob.num2}개를 빼면 몇 개가 남을까? 천천히 생각해 보자.`;
  prob.voiceText = voice;
  document.getElementById('prompt-text').textContent = `⭐ 그림을 보고 답을 골라봐!`;
  window.sound.speak(voice);

  const stage = document.getElementById('game-stage');
  const itemIcon = prob.type === '+' ? '⭐' : '💎';
  
  let visualHtml = '';
  if (prob.type === '+') {
    visualHtml = `
      <div style="display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap;">
        <div style="background:#fff9db; padding:10px; border-radius:12px; border:2px solid #ffe066;">
          ${Array(prob.num1).fill(itemIcon).join(' ')}
        </div>
        <span style="font-size:24px; font-weight:bold; color:#f08c00;">+</span>
        <div style="background:#e7f5ff; padding:10px; border-radius:12px; border:2px solid #a5d8ff;">
          ${Array(prob.num2).fill(itemIcon).join(' ')}
        </div>
      </div>
    `;
  } else {
    visualHtml = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
        <div style="background:#fff5f5; padding:10px; border-radius:12px; border:2px solid #ffc9c9;">
          ${Array.from({length: prob.num1}, (_, i) => `<span class="quiz-object ${i < prob.num2 ? 'removed' : ''}">${itemIcon}</span>`).join('')}
        </div>
        <div style="color:#e03131; font-size:15px; font-weight:bold;">
          여기서 ${prob.num2}개를 쏙 빼면 몇 개가 남을까요?
        </div>
      </div>
    `;
  }

  stage.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:14px;">
      ${visualHtml}
    </div>
  `;

  renderChoices(prob.ans);
}

// ----------------------------------------------------
// 보기 버튼(키패드) 생성 및 정답 판별
// ----------------------------------------------------
function renderChoices(correctAns) {
  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';
  document.getElementById('answer-hint').textContent = STATE.currentMode === 'quiz'
    ? '연습 문제예요. 단계 미션에는 포함되지 않아요.'
    : '먼저 그림을 톡톡 누르며 세어봐요.';

  // 오답 후보 2개 생성 (0도 정답으로 허용)
  const choices = [correctAns];
  let loopCount = 0;
  while (choices.length < 3 && loopCount < 40) {
    loopCount++;
    const diff = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
    const candidate = correctAns + diff;
    if (candidate >= 0 && !choices.includes(candidate)) {
      choices.push(candidate);
    }
  }
  let fallback = 0;
  while (choices.length < 3) {
    if (!choices.includes(fallback)) choices.push(fallback);
    fallback++;
  }

  // 보기 섞기
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  choices.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = val;
    btn.disabled = !STATE.activityDone;
    btn.addEventListener('click', () => handleAnswer(val, correctAns, btn));
    choicesArea.appendChild(btn);
  });
}

function unlockAnswers(message) {
  STATE.activityDone = true;
  document.querySelectorAll('.choice-btn').forEach(btn => { btn.disabled = false; });
  document.getElementById('answer-hint').textContent = message;
}

let feedbackTimer = null;

function clearPendingNext() {
  clearTimeout(feedbackTimer);
  feedbackTimer = null;
}

// 다음 문제로 넘어가기 공통 함수
function goToNextProblem() {
  if (!STATE.currentMode) return;
  clearPendingNext();
  document.getElementById('reward-modal-overlay').classList.remove('active');
  if (STATE.currentMode === 'add') nextAddProblem();
  else if (STATE.currentMode === 'sub') nextSubProblem();
  else if (STATE.currentMode === 'quiz') nextQuizProblem();
  document.getElementById('game-play-screen').scrollTop = 0;
}

// 첫 시도 정답과 세기 활동을 모두 마친 문제만 미션에 반영한다.
function handleAnswer(selectedVal, correctAns, btnElement) {
  if (STATE.answered || !STATE.activityDone || STATE.currentProblem?.ans !== correctAns) return;
  if (selectedVal === correctAns) {
    STATE.answered = true;
    document.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true; });

    window.sound.playCorrect();
    document.getElementById('eq-ans').textContent = correctAns;

    const config = LEVEL_CONFIG[STATE.difficulty];
    const mission = currentMission();
    const mode = STATE.currentMode;
    const key = problemKey(STATE.currentProblem);
    const goal = mode === 'add' ? config.addGoal : config.subGoal;
    const earnedStar = mode !== 'quiz' && !STATE.attemptHadMistake &&
      mission[mode].length < goal && !mission[mode].includes(key);
    if (earnedStar) {
      mission[mode].push(key);
      STATE.stars += 1;
    }
    saveData();
    updateHeaderStats();
    updateLevelGoalProgress();
    if (earnedStar) triggerConfetti();

    if (mission.add.length >= config.addGoal && mission.sub.length >= config.subGoal) {
      showLevelUpModal(config);
    } else {
      if (mode !== 'quiz') {
        if (mission.add.length >= config.addGoal && mission.sub.length < config.subGoal) STATE.currentMode = 'sub';
        if (mission.sub.length >= config.subGoal && mission.add.length < config.addGoal) STATE.currentMode = 'add';
      }
      const praise = earnedStar ? '하나씩 세어서 답을 찾았네! 미션 별을 하나 모았어.' :
        mode === 'quiz' ? '차근차근 생각해서 답을 찾았네!' : '끝까지 다시 풀었구나. 잘했어!';
      window.sound.speak(`잘했어! ${praise}`);
      feedbackTimer = setTimeout(() => {
        showRewardModal(praise, earnedStar);
      }, 450);
    }
  } else {
    STATE.attemptHadMistake = true;
    window.sound.playEncourage();
    btnElement.classList.add('shake-it');
    setTimeout(() => btnElement.classList.remove('shake-it'), 400);
    btnElement.disabled = true;
    triggerPenaltyToast();
    document.getElementById('answer-hint').textContent = '다시 세어봐요. 이번 문제는 연습으로 마무리해요.';
    const hint = STATE.currentMode === 'add'
      ? '괜찮아. 두 묶음의 그림을 처음부터 차례대로 다시 세어 보자.'
      : STATE.currentMode === 'sub'
        ? '괜찮아. 떠난 것은 빼고, 남아 있는 것만 다시 세어 보자.'
        : '괜찮아. 그림을 보면서 하나씩 다시 생각해 보자.';
    window.sound.speak(hint);
  }
}

// 레벨업 대축제 모달 표시 (목표 달성 시 화려한 승급)
function showLevelUpModal(currentConfig) {
  window.sound.playLevelUp();
  triggerConfetti();

  const isMaxLevel = STATE.difficulty >= 4;
  const nextLevelNum = isMaxLevel ? 4 : STATE.difficulty + 1;
  const bonusReward = currentConfig.reward || '👑';
  STATE.stickers.push(bonusReward);
  
  // 미션 완료 후에만 선물과 다음 단계를 연다.
  STATE.missions[STATE.difficulty] = { add: [], sub: [] };
  if (!isMaxLevel) {
    STATE.difficulty = nextLevelNum;
    STATE.unlockedLevel = Math.max(STATE.unlockedLevel, nextLevelNum);
  }
  saveData();
  updateHeaderStats();
  updateLevelGoalProgress();

  // 홈 화면 난이도 버튼 활성화 상태 동기화
  updateDifficultyButtons();

  const modalOverlay = document.getElementById('levelup-modal-overlay');
  const titleEl = document.getElementById('modal-levelup-title');
  const descEl = document.getElementById('modal-levelup-desc');
  const bonusItemEl = document.getElementById('levelup-bonus-item');
  const nextBtn = document.getElementById('modal-levelup-btn');

  if (isMaxLevel) {
    titleEl.textContent = '🌟 수학 챔피언 등극!';
    descEl.textContent = '축하해요! 모든 단계를 완벽하게 정복했어요!';
    nextBtn.textContent = '계속해서 최고 마스터 도전하기! 🚀';
    window.sound.speak('와, 어려운 문제까지 차근차근 풀었네! 정말 대단해. 선물도 받았어!');
  } else {
    titleEl.textContent = '🎉 레벨업 대축제!';
    descEl.textContent = `축하해요! 이제 ${LEVEL_CONFIG[nextLevelNum].name}로 승급합니다!`;
    nextBtn.textContent = `${LEVEL_CONFIG[nextLevelNum].name}로 모험 떠나기! 🚀`;
    window.sound.speak(`와, 더하기와 빼기를 모두 해냈구나! 선물을 받았어. 이제 다음 단계도 같이 해 보자.`);
  }

  bonusItemEl.textContent = bonusReward;
  modalOverlay.classList.add('active');

  nextBtn.onclick = (e) => {
    e.stopPropagation();
    modalOverlay.classList.remove('active');
    goToNextProblem();
  };
}

// 정답 확인 화면. 선물은 단계 미션을 마쳤을 때만 준다.
function showRewardModal(praise, earnedStar) {
  document.getElementById('modal-reward-icon').textContent = earnedStar ? '⭐' : '😊';
  document.getElementById('modal-reward-title').textContent = '참 잘했어요!';
  document.getElementById('modal-reward-desc').textContent = praise;
  
  const modalOverlay = document.getElementById('reward-modal-overlay');
  modalOverlay.classList.add('active');

  // 모달 영역 아무 곳이나 탭해도 즉시 넘어가기
  modalOverlay.onclick = () => goToNextProblem();

}

// ----------------------------------------------------
// [스티커 보관함]
// ----------------------------------------------------
function openStickerBook() {
  showScreen('sticker-book-screen');
  window.sound.speak(STATE.stickers.length
    ? `우와, 선물이 ${STATE.stickers.length}개야! 미션을 잘 해냈구나.`
    : '아직 선물이 없네. 미션을 마치면 받을 수 있어!');
  
  const board = document.getElementById('sticker-board');
  board.innerHTML = '';

  if (STATE.stickers.length === 0) {
    board.innerHTML = `
      <div class="sticker-board-empty">
        <div style="font-size: 48px;">🌟</div>
        <p>아직 스티커가 없어요!</p>
        <p>더하기와 빼기 미션을 마치면 선물을 받을 수 있어요!</p>
      </div>
    `;
    return;
  }

  STATE.stickers.forEach(stk => {
    const el = document.createElement('div');
    el.className = 'placed-sticker';
    el.textContent = stk;
    el.addEventListener('click', () => {
      window.sound.playStar();
    });
    board.appendChild(el);
  });
}

// ----------------------------------------------------
// 컨페티(별가루 파티클) 효과
// ----------------------------------------------------
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  const particles = [];
  const colors = ['#ff6b8b', '#ffd43b', '#4dabf7', '#51cf66', '#cc5de8', '#ff922b'];

  for (let i = 0; i < 45; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.8) * 14,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.35,
      opacity: 1
    });
  }

  let animFrame;
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.opacity -= 0.015;
      if (p.opacity > 0) {
        alive = true;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    if (alive) {
      animFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animFrame);
    }
  }
  render();
}
