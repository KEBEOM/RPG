let quizBank = [];
let studyBank = [];
let treeData = {}; 
let gradesList = [];
let subjectsList = [];
let activeQuizBank = [];

let player = { 
    currentChar: "char_01", ownedChars: ["char_01"], hp: 100, maxHp: 100, 
    gold: 0, floor: 1, inventory: {}, baseAtk: 15, evasion: 0, potions: 3, 
    totalGoldEarned: 0, totalPotionsUsed: 0, totalWrongAnswers: 0, totalEvasions: 0, bossBag: [] 
};
let monster = null;
let activeEffects = { shield: 0, powerUp: 0, weaken: 0, armorBreak: 0, revive: 0 };
let savedHighScore = 1;
let isTutorialMode = false;
let tutorialStep = 0;

let textArtFrame = 0;
let currentDifficulty = 'normal'; 

let curGameGrade = '3학년';
let curGameSemester = 'all'; 
let curGameSubject = 'all';

let curStudyGrade = '3학년';
let curStudySemester = 'all';
let curStudySubject = 'all';

setInterval(() => {
    try {
        textArtFrame = (textArtFrame + 1) % 2;
        
        const pArea = document.getElementById('player-area');
        if (pArea && pArea.style.display !== 'none' && player && player.currentChar) {
            const pImg = document.getElementById('player-image-ui');
            const charData = typeof PLAYER_CHARS !== 'undefined' ? (PLAYER_CHARS.find(c => c.id === player.currentChar) || PLAYER_CHARS[0]) : {icon:"(・_・)", anim:"eye"};
            
            if(pImg) {
                pImg.innerText = Array.isArray(charData.icon) ? charData.icon[textArtFrame] : charData.icon;
                pImg.style.transform = "none";
                if (charData.anim === "swing") pImg.style.transform = `rotate(${textArtFrame === 0 ? -5 : 5}deg)`;
                else if (charData.anim === "bounce") pImg.style.transform = `translateY(${textArtFrame === 0 ? 0 : -8}px)`;
                else if (charData.anim === "arm") pImg.style.transform = `scale(${textArtFrame === 0 ? 1 : 1.08})`;
            }
        }

        const mArea = document.getElementById('monster-area');
        if (mArea && mArea.style.display !== 'none' && monster) {
            const mImg = document.getElementById('monster-image');
            if (mImg && mImg.dataset.isText === "true") {
                mImg.innerText = Array.isArray(monster.icon) ? monster.icon[textArtFrame] : monster.icon;
                if (monster.isBoss) mImg.style.transform = `scale(${textArtFrame === 0 ? 1 : 1.05})`;
                else mImg.style.transform = `translateY(${textArtFrame === 0 ? 0 : -5}px)`;
            }
        }
    } catch(e) { }
}, 500);

let audioCtx = null; 
let bgmInterval = null; 
let isMuted = true; 
let currentBgmMode = 'title'; 
let noteIndex = 0;

function playRetroBeep() {
    if (!audioCtx || isMuted || typeof MELODIES === 'undefined') return;
    if (audioCtx.state === 'suspended') audioCtx.resume(); 
    
    const modeData = MELODIES[currentBgmMode]; 
    if(!modeData) return;
    const freq = modeData.notes[noteIndex];
    
    if (freq > 0) {
        const osc = audioCtx.createOscillator(); 
        const gain = audioCtx.createGain(); 
        osc.type = 'square'; 
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime); 
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(modeData.vol, audioCtx.currentTime + 0.01); 
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25); 
        osc.connect(gain); 
        gain.connect(audioCtx.destination); 
        osc.start(); 
        osc.stop(audioCtx.currentTime + 0.3); 
    }
    noteIndex = (noteIndex + 1) % modeData.notes.length;
}

function changeBgmMode(newMode) {
    if (currentBgmMode === newMode) return;
    currentBgmMode = newMode; 
    noteIndex = 0; 
    if (bgmInterval) { 
        clearInterval(bgmInterval); 
        if (!isMuted && typeof MELODIES !== 'undefined' && MELODIES[currentBgmMode]) {
            bgmInterval = setInterval(playRetroBeep, MELODIES[currentBgmMode].tempo); 
        }
    }
}

function toggleBGM() {
    const btn = document.getElementById('sound-btn'); 
    isMuted = !isMuted;
    if (isMuted) { 
        if(bgmInterval){ clearInterval(bgmInterval); bgmInterval = null; } 
        btn.innerText = "음악 끔"; 
        btn.style.backgroundColor = "#616161"; 
    } else { 
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
        btn.innerText = "음악 켬"; 
        btn.style.backgroundColor = "#e65100"; 
        if(!bgmInterval && typeof MELODIES !== 'undefined' && MELODIES[currentBgmMode]) {
            bgmInterval = setInterval(playRetroBeep, MELODIES[currentBgmMode].tempo); 
        }
    }
}

function checkAndApplyBGM() {
    if (player && player.hp > 0 && player.hp <= player.maxHp * 0.3) changeBgmMode('danger');
    else if (monster && monster.isBoss) changeBgmMode('boss');
    else if (monster && monster.isElite) changeBgmMode('elite');
    else if (monster) changeBgmMode('normal');
    else { 
        if(typeof PLAYER_CHARS !== 'undefined') {
            let charData = PLAYER_CHARS.find(c => c.id === player.currentChar); 
            if (charData && charData.bgm) { changeBgmMode(charData.bgm); return; } 
        }
        changeBgmMode('hub');
    }
}

function initAudio() { 
    if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } 
    if (audioCtx.state === 'suspended') audioCtx.resume(); 
}

function playBGM() { 
    if (isMuted || typeof MELODIES === 'undefined') return; 
    initAudio(); 
    if (!bgmInterval && MELODIES[currentBgmMode]) { bgmInterval = setInterval(playRetroBeep, MELODIES[currentBgmMode].tempo); } 
}

function stopBGM() {
    if (bgmInterval) { clearInterval(bgmInterval); bgmInterval = null; }
}

function getSafeStorage(key, fallback) { 
    try { let val = localStorage.getItem(key); return val !== null ? val : fallback; } 
    catch(e) { return fallback; } 
}

function setSafeStorage(key, value) { 
    try { localStorage.setItem(key, value); } catch(e) { } 
}

function getGlobalData() {
    const globalStr = getSafeStorage('historyTowerGlobal', null);
    if (globalStr) { try { return JSON.parse(globalStr); } catch(e) {} }
    const oldSave = getSafeStorage('historyTowerSave', null);
    if (oldSave) { 
        try { 
            const p = JSON.parse(oldSave).player; 
            if (p) { 
                return { 
                    ownedChars: p.ownedChars || ["char_01"], 
                    currentChar: p.currentChar || "char_01", 
                    totalGoldEarned: p.totalGoldEarned || 0, 
                    totalPotionsUsed: p.totalPotionsUsed || 0, 
                    totalWrongAnswers: p.totalWrongAnswers || 0, 
                    totalEvasions: p.totalEvasions || 0 
                }; 
            } 
        } catch(e) {} 
    }
    return { 
        ownedChars: ["char_01"], currentChar: "char_01", 
        totalGoldEarned: 0, totalPotionsUsed: 0, totalWrongAnswers: 0, totalEvasions: 0 
    };
}

function checkLoadButton() {
    const saved = getSafeStorage('historyTowerSave', null); 
    const btn = document.getElementById('btn-continue'); 
    if (!btn) return;
    if (saved) { 
        try { 
            const data = JSON.parse(saved); 
            if (data.player && data.player.hp > 0) { btn.style.display = 'block'; return; } 
        } catch(e) {} 
    }
    btn.style.display = 'none';
}

function saveGame(isManual = false) {
    if (isTutorialMode) { 
        if (isManual) addLog("[안내] 튜토리얼 중에는 저장할 수 없습니다.", "#ffeb3b"); 
        return; 
    }
    const globalData = { 
        ownedChars: player.ownedChars, currentChar: player.currentChar, 
        totalGoldEarned: player.totalGoldEarned, totalPotionsUsed: player.totalPotionsUsed, 
        totalWrongAnswers: player.totalWrongAnswers, totalEvasions: player.totalEvasions 
    };
    setSafeStorage('historyTowerGlobal', JSON.stringify(globalData)); 
    setSafeStorage('historyTowerSave', JSON.stringify({ player: player, effects: activeEffects }));
    if (isManual) { 
        addLog("게임이 성공적으로 저장되었습니다.", "#a5d6a7"); 
        alert("현재 진행 상황이 저장되었습니다."); 
    } else { 
        addLog("[시스템] 진행 상황이 자동 저장되었습니다.", "#7f8c8d"); 
    }
    checkLoadButton();
}

function resetAllData() { 
    if(confirm("모든 기록이 완전히 초기화됩니다. 계속할까요?")) { 
        try { localStorage.clear(); } catch(e) {} 
        location.reload(); 
    } 
}

function parseDataString(rawData, mode) {
    const lines = rawData.split('\n');

    lines.forEach(l => {
        let ln = l.trim(); 
        if (!ln || ln.startsWith('//')) return;
        
        if (ln.startsWith('[') && ln.endsWith(']')) { 
            let content = ln.slice(1, -1);
            let parts = content.split('|').map(x => x.trim());
            
            let fullText = content; 
            let cg = "3학년", cs = "공통", cc = "일반", cu = "기본";

            if (fullText.includes('3학년')) cg = '3학년';
            else if (fullText.includes('4학년')) cg = '4학년';
            else if (fullText.includes('5학년')) cg = '5학년';
            else if (fullText.includes('6학년') || fullText.includes('보완')) cg = '6학년';

            if (fullText.includes('사회')) cs = '사회';
            else if (fullText.includes('과학')) cs = '과학';

            if (parts.length >= 4) { cc = parts[2]; cu = parts[3]; } 
            else if (parts.length === 3) { cc = parts[2]; cu = "기본"; } 
            else if (parts.length === 2) { cc = parts[1]; cu = "기본"; } 
            else { cc = fullText; cu = "기본"; }
            
            let semStr = "공통";
            if (fullText.includes('1학기') || fullText.includes('보완')) semStr = "1학기";
            else if (fullText.includes('2학기')) semStr = "2학기";

            if (semStr !== "공통" && !cc.includes('학기') && !cc.includes('보완')) {
                cc = `[${semStr}] ` + cc;
            }

            window.tempParsedHeader = { cg, cs, cc, cu }; 
            
            if(!treeData[cg]) treeData[cg] = {};
            if(!treeData[cg][cs]) treeData[cg][cs] = {};
            if(!treeData[cg][cs][cc]) treeData[cg][cs][cc] = [];
            if(!treeData[cg][cs][cc].includes(cu)) treeData[cg][cs][cc].push(cu);
            
            if(!gradesList.includes(cg)) gradesList.push(cg);
            if(!subjectsList.includes(cs)) subjectsList.push(cs);
        } else { 
            let p = ln.split('|').map(x => x.trim()); 
            let { cg, cs, cc, cu } = window.tempParsedHeader || { cg: "3학년", cs: "공통", cc: "일반", cu: "기본" };

            if (mode === 'quiz' && p.length >= 5) {
                quizBank.push({ grade: cg, subject: cs, chapter: cc, unit: cu, q: p[0], options: [p[1], p[2], p[3]], answer: parseInt(p[4]) - 1 }); 
            } else if (mode === 'study') {
                let idx = ln.indexOf('|');
                if (idx !== -1) {
                    let keyword = ln.substring(0, idx).trim();
                    let desc = ln.substring(idx + 1).trim(); 
                    if(keyword && desc) {
                        studyBank.push({ grade: cg, subject: cs, chapter: cc, unit: cu, keyword: keyword, desc: desc }); 
                    }
                }
            }
        }
    });
}

function initSelectOptions() {
    gradesList.sort(); 
    subjectsList.sort();
    
    if(typeof setGameGrade === 'function') setGameGrade('3학년');
    if(typeof setGameSemester === 'function') setGameSemester('all'); 
    if(typeof setGameSubject === 'function') setGameSubject('all');
    if(typeof setStudyGrade === 'function') setStudyGrade('3학년');
    if(typeof setStudySubject === 'function') setStudySubject('all');
    if(typeof setStudySemester === 'function') setStudySemester('all'); 
}

function parseAllData() {
    try {
        savedHighScore = parseInt(getSafeStorage('historyTowerMaxFloor', 1), 10);
        if (isNaN(savedHighScore)) savedHighScore = 1;
        const hsEl = document.getElementById('high-score-ui'); 
        if(hsEl) hsEl.innerText = savedHighScore;

        quizBank = [];
        studyBank = [];
        treeData = {}; 
        gradesList = [];
        subjectsList = [];
        window.tempParsedHeader = null;

        if (typeof rawQuizData !== 'undefined') parseDataString(rawQuizData, 'quiz');
        if (typeof rawStudyData !== 'undefined') parseDataString(rawStudyData, 'study');

        if (quizBank.length === 0) {
            quizBank.push({ grade: "3학년", subject: "기본", chapter: "일반", unit: "기본문제", q: "조선을 건국한 왕은 누구일까요?", options: ["이성계", "왕건", "이순신"], answer: 0 });
            treeData = { "3학년": { "기본": { "일반": ["기본문제"] } } }; 
            document.getElementById('data-status').innerText = "데이터 없음 (샘플 모드)"; 
            document.getElementById('data-status').style.color = "#ffb74d";
        } else {
            document.getElementById('data-status').innerText = "지식 데이터 준비 완료!";
            document.getElementById('data-status').style.color = "#00e676";
        }

        initSelectOptions();
        checkLoadButton();
        changeBgmMode('title');
    } catch(err) { 
        console.error(err); 
        document.getElementById('data-status').innerText = "로딩 에러 발생! 코드를 확인하세요.";
        document.getElementById('data-status').style.color = "#ff5252";
    }
}

function showHelp() { 
    if (isTutorialMode) return; 
    alert("[ 🏰 지식 타워 초보자 가이드 ]\n\n⚔️ 배틀 방법:\n사회/과학 문제를 맞히면 방해꾼의 '에너지'를 깎을 수 있어요!\n반대로 틀리면 내 '집중력(체력)'이 떨어지니 조심하세요.\n\n💡 내 상태 설명:\n- 집중력 : 나의 체력이에요. 0이 되면 게임이 끝나요.\n- 기억력 : 퀴즈를 맞혔을 때 방해꾼의 에너지를 더 많이 깎는 힘!\n- 딴짓 피하기 : 방해꾼의 공격을 요리조리 피할 확률이에요."); 
}

function addLog(msg, color="#fff") { 
    const box = document.getElementById('log-box'); 
    if(!box) return; 
    const p = document.createElement('p'); 
    p.style.color = color; 
    p.innerHTML = msg; 
    box.appendChild(p); 
    box.scrollTop = box.scrollHeight; 
}