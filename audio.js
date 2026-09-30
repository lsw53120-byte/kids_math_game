// Web Audio API 기반 효과음 합성기 + Web Speech API 한국어 TTS
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.speechEnabled = true;
    this.currentSpeechAudio = null;
    this.speechTimer = null;
    this.countTimer = null;
    this.speechToken = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration, type = 'sine', gainVal = 0.2) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  }

  // 뿅 터지는 소리
  playPop() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch(e) {}
  }

  // 냠냠 먹는 소리
  playNom() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [350, 420, 280].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + i * 0.06);
        gain.gain.setValueAtTime(0.25, t + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.06 + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.06);
        osc.stop(t + i * 0.06 + 0.05);
      });
    } catch(e) {}
  }

  // 정답 팡파레
  playCorrect() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const t = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.1);
        gain.gain.setValueAtTime(0.28, t + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + (idx === 3 ? 0.45 : 0.15));
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.1);
        osc.stop(t + idx * 0.1 + (idx === 3 ? 0.5 : 0.18));
      });
    } catch(e) {}
  }

  // 격려 사운드
  playEncourage() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [523.25, 440]; // C5, A4
      const t = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.15);
        gain.gain.setValueAtTime(0.18, t + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.15 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.15);
        osc.stop(t + idx * 0.15 + 0.22);
      });
    } catch(e) {}
  }

  // 별 획득 소리
  playStar() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [783.99, 987.77, 1174.66, 1567.98];
      const t = this.ctx.currentTime;
      notes.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + i * 0.07);
        gain.gain.setValueAtTime(0.2, t + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.07);
        osc.stop(t + i * 0.07 + 0.27);
      });
    } catch(e) {}
  }

  // 버튼 클릭음
  playClick() {
    this.playTone(600, 0.05, 'triangle', 0.15);
  }

  // 테마 특화 사운드: 공룡 쿵 (묵직한 발걸음)
  playDinoStomp() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch(e) {}
  }

  // 테마 특화 사운드: 우주 레이저 (퓨융!)
  playLaser() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.19);
    } catch(e) {}
  }

  // 테마 특화 사운드: 자동차 빵빵 (경적)
  playCarHonk() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [349.23, 440].forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.setValueAtTime(0.25, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
      });
    } catch(e) {}
  }

  // 패널티 사운드: 별이 도망가는 소리 (뾰로롱 하강음)
  playPenalty() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [659.25, 587.33, 493.88, 392.00]; // E5 -> D5 -> B4 -> G4 하강
      const t = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);
        gain.gain.setValueAtTime(0.2, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.2);
      });
    } catch(e) {}
  }

  // 레벨업 대축제 팡파레 (화려한 상승 팡파레)
  playLevelUp() {
    if (this.isMuted || !this.ctx) return;
    try {
      // C4 -> E4 -> G4 -> C5 -> E5 -> G5 -> C6
      const fanfare = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      const t = this.ctx.currentTime;
      fanfare.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.09);
        const dur = (idx === fanfare.length - 1) ? 0.6 : 0.12;
        gain.gain.setValueAtTime(0.25, t + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.09);
        osc.stop(t + idx * 0.09 + dur + 0.05);
      });
    } catch(e) {}
  }

  // 진행 중인 모든 음성 중지
  stopSpeech() {
    this.speechToken++;
    clearTimeout(this.speechTimer);
    this.speechTimer = null;
    clearTimeout(this.countTimer);
    this.countTimer = null;
    if (this.currentSpeechAudio) {
      try {
        this.currentSpeechAudio.pause();
        this.currentSpeechAudio.currentTime = 0;
      } catch (e) {}
      this.currentSpeechAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    document.body.classList.remove('is-ai-speaking');
  }

  // 숫자를 한국어 표준 고유어 발음(수관형사)으로 변환하는 필터 (예: 5대 -> 다섯 대, 3개 -> 세 개, 1! -> 하나!)
  formatKoreanNaturalSpeech(text) {
    if (!text) return '';

    // 1. 단위명사(개, 대, 마리, 알, 명 등) 앞의 숫자 변환 (1~20)
    const nativeUnits = {
      1: '한', 2: '두', 3: '세', 4: '네', 5: '다섯',
      6: '여섯', 7: '일곱', 8: '여덟', 9: '아홉', 10: '열',
      11: '열한', 12: '열두', 13: '열세', 14: '열네', 15: '열다섯',
      16: '열여섯', 17: '열일곱', 18: '열여덟', 19: '열아홉', 20: '스무'
    };

    // "5대", "3개", "5개와", "2대 중" 등 단위 앞 숫자를 순우리말로 치환
    let formatted = text.replace(/(\d+)\s*(개|대|마리|알|명|송이|권|그릇|조각|가지)/g, (match, numStr, unit) => {
      const n = parseInt(numStr, 10);
      if (nativeUnits[n]) {
        return `${nativeUnits[n]} ${unit}`;
      }
      return match;
    });

    // 2. 단독 카운팅 숫자 (터치할 때 "1!", "2!", "3!" 등)를 "하나!", "둘!", "셋!"으로 변환
    const countingWords = {
      1: '하나', 2: '둘', 3: '셋', 4: '넷', 5: '다섯',
      6: '여섯', 7: '일곱', 8: '여덟', 9: '아홉', 10: '열',
      11: '열하나', 12: '열둘', 13: '열셋', 14: '열넷', 15: '열다섯',
      16: '열여섯', 17: '열일곱', 18: '열여덟', 19: '열아홉', 20: '스물'
    };

    formatted = formatted.replace(/^(\d+)([!?.~]*)$/, (match, numStr, punc) => {
      const n = parseInt(numStr, 10);
      if (countingWords[n]) {
        return `${countingWords[n]}${punc}`;
      }
      return match;
    });

    return formatted;
  }

  // 고품질 자연스러운 한국어 음성(Voice) 탐색
  getBestKoreanVoice(offlineOnly = false) {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 기기에 설치된 자연스러운 한국어 음성을 우선한다.
    let koVoices = voices.filter(v => v.lang && (v.lang.toLowerCase().startsWith('ko') || v.lang.toLowerCase().includes('korean')));
    if (offlineOnly || !navigator.onLine) koVoices = koVoices.filter(v => v.localService);
    if (koVoices.length === 0) return null;

    const score = voice => {
      const name = (voice.name || '').toLowerCase();
      return (/(natural|neural)/.test(name) ? 100 : 0) +
        (name.includes('online') ? 40 : 0) +
        (name.includes('google') ? 25 : 0) +
        (/(sunhi|yuna|sora|injoon)/.test(name) ? 10 : 0);
    };
    return koVoices.sort((a, b) => score(b) - score(a))[0];
  }

  speakCount(number, final = false) {
    // 연속 터치마다 긴 설명을 끊지 않고, 아이가 잠시 멈추면 마지막 숫자만 읽는다.
    const word = this.formatKoreanNaturalSpeech(`${number}!`).replace('!', '');
    this.speakAfterPause(final ? `모두 ${this.formatKoreanNaturalSpeech(`${number}개`)}네. 이제 답을 골라볼까?` : `${word}.`, final ? 500 : 650, { count: !final });
  }

  speakAfterPause(text, delay = 500, options = {}) {
    clearTimeout(this.countTimer);
    this.countTimer = setTimeout(() => {
      this.countTimer = null;
      this.speak(text, options);
    }, delay);
  }

  // 문제 설명은 차분하게, 짧은 숫자 읽기는 경쾌하게 들려준다.
  speak(text, options = {}) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;
    clearTimeout(this.countTimer);
    this.countTimer = null;
    clearTimeout(this.speechTimer);
    const token = ++this.speechToken;
    
    // 1단계: 순우리말 표준 발음 변환 (5대 -> 다섯 대, 3개 -> 세 개, 1! -> 하나!)
    const naturalText = this.formatKoreanNaturalSpeech(text);

    // 2단계: 이모지 및 불필요한 기호 제거하여 더욱 맑고 자연스러운 발음 유도
    const cleanText = naturalText
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '') // 이모지 제거
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      // 크롬/사파리 일시정지 상태 해제
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      // 이전 음성의 취소가 끝난 뒤 최신 문장만 재생한다.
      this.speechTimer = setTimeout(() => {
        if (!this.speechEnabled || token !== this.speechToken) return;
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'ko-KR';

        const bestVoice = this.getBestKoreanVoice(options.offlineOnly);
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        utterance.rate = options.count ? 0.98 : 0.92;
        utterance.pitch = options.count ? 1.04 : 1.0;

        utterance.onstart = () => {
          document.body.classList.add('is-ai-speaking');
        };
        utterance.onend = () => {
          document.body.classList.remove('is-ai-speaking');
        };
        utterance.onerror = () => {
          document.body.classList.remove('is-ai-speaking');
          if (token === this.speechToken && !options.offlineOnly) {
            this.speak(text, { ...options, offlineOnly: true });
          }
        };

        window.speechSynthesis.speak(utterance);
      }, 40);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  }
}

// 브라우저 음성 목록 비동기 프리로드
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    if (window.sound) window.sound.getBestKoreanVoice();
  };
}

window.sound = new SoundManager();
