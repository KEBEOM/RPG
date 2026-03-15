function setGameGrade(g) {
    curGameGrade = g;
    ['3', '4', '5', '6'].forEach(gr => {
        let el = document.getElementById('g-grade-' + gr);
        if(el) el.style.backgroundColor = (g === gr+'학년') ? '#e65100' : '#616161';
    });
    updateChapterOptions();
}

function setGameSemester(sem) {
    curGameSemester = sem;
    document.getElementById('g-sem-1').style.backgroundColor = (sem === '1학기') ? '#8e44ad' : '#616161';
    document.getElementById('g-sem-2').style.backgroundColor = (sem === '2학기') ? '#8e44ad' : '#616161';
    document.getElementById('g-sem-all').style.backgroundColor = (sem === 'all') ? '#8e44ad' : '#616161';
    updateChapterOptions();
}

function setGameSubject(s) {
    curGameSubject = s;
    document.getElementById('g-subj-soc').style.backgroundColor = (s === '사회') ? '#0277bd' : '#616161';
    document.getElementById('g-subj-sci').style.backgroundColor = (s === '과학') ? '#0277bd' : '#616161';
    document.getElementById('g-subj-all').style.backgroundColor = (s === 'all') ? '#0277bd' : '#616161';
    updateChapterOptions();
}

function updateChapterOptions() {
    let chapWrap = document.getElementById('chapter-range-wrapper');
    let chapSel = document.getElementById('chapter-select');
    let unitWrap = document.getElementById('sub-unit-range-wrapper');
    
    let chapMap = treeData[curGameGrade]?.[curGameSubject];
    
    if (curGameGrade !== 'all' && curGameSubject !== 'all' && chapMap) {
        let chapters = Object.keys(chapMap).filter(c => {
            if (curGameSemester === '1학기') return c.includes('1학기') || c.includes('보완');
            if (curGameSemester === '2학기') return c.includes('2학기');
            return true;
        });

        if (chapters.length > 0) {
            chapters.sort((a, b) => a.localeCompare(b, 'ko', { numeric: true }));

            chapWrap.style.display = 'block';
            let html = '<option value="all">전체 단원</option>';
            chapters.forEach(c => {
                let cleanName = c.replace(/^(?:\[[0-9]학기\]\s*|(?:[0-9]학기|보완)\s*)[0-9]+\.\s*/, '').replace(/^보완\.\s*/, '');
                html += `<option value="${c}">${cleanName}</option>`;
            });
            chapSel.innerHTML = html;
        } else {
            chapWrap.style.display = 'none';
            unitWrap.style.display = 'none';
        }
    } else {
        chapWrap.style.display = 'none';
        unitWrap.style.display = 'none';
    }
    updateSubUnitOptions();
}

function updateSubUnitOptions() {
    let chap = document.getElementById('chapter-select').value;
    let unitWrap = document.getElementById('sub-unit-range-wrapper');
    let startSel = document.getElementById('start-category');
    let endSel = document.getElementById('end-category');
    
    let unitList = treeData[curGameGrade]?.[curGameSubject]?.[chap];
    
    if (curGameGrade !== 'all' && curGameSubject !== 'all' && chap !== 'all' && unitList) {
        unitWrap.style.display = 'block';
        let html = '';
        unitList.forEach((u, i) => { 
            html += `<option value="${i}">${u}</option>`;
        });
        startSel.innerHTML = html;
        endSel.innerHTML = html;
        if(unitList.length > 0) endSel.value = unitList.length - 1;
    } else {
        unitWrap.style.display = 'none';
    }
}

function openCategoryScreen() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('range-screen').style.display = 'flex';
    document.getElementById('category-box').style.display = 'block';
    document.getElementById('difficulty-box').style.display = 'none';
    
    setGameGrade('3학년');
    setGameSemester('all');
    setGameSubject('all');
}

function closeRangeScreen() { 
    document.getElementById('range-screen').style.display = 'none'; 
    document.getElementById('title-screen').style.display = 'flex'; 
}

function backToCategoryScreen() { 
    document.getElementById('difficulty-box').style.display = 'none'; 
    document.getElementById('category-box').style.display = 'block'; 
}

function goToDifficultyScreen() {
    let unitWrap = document.getElementById('sub-unit-range-wrapper');
    if (unitWrap.style.display === 'block') {
        let startCat = document.getElementById('start-category');
        let endCat = document.getElementById('end-category');
        if (startCat.options.length > 0 && endCat.options.length > 0) {
            let sIdx = parseInt(startCat.value);
            let eIdx = parseInt(endCat.value);
            if (sIdx > eIdx) return alert("소단원 범위가 잘못되었습니다. 시작 단원이 끝 단원보다 앞서야 합니다.");
        }
    }

    document.getElementById('category-box').style.display = 'none';
    document.getElementById('difficulty-box').style.display = 'block';
}

function startGameWithDifficulty(diff) { 
    currentDifficulty = diff; 
    startCustomGame(); 
}

function updatePlayerAreaUI() {
    let charData = PLAYER_CHARS.find(c => c.id === player.currentChar) || PLAYER_CHARS[0];
    document.getElementById('player-name-ui').innerText = charData.name;
    document.getElementById('player-image-ui').innerText = Array.isArray(charData.icon) ? charData.icon[0] : charData.icon;
}

function updateMonsterImageUI(m) {
    const mImg = document.getElementById('monster-image');
    if(mImg) {
        mImg.innerText = Array.isArray(m.icon) ? m.icon[0] : m.icon;
        if(m.isBoss) mImg.style.color = "#f4ffb3";
        else if(m.isElite) mImg.style.color = "#e6b3ff";
        else mImg.style.color = "#ffb74d";
    }
}

function checkHiddenUnlocks() {
    let newUnlocks = false;
    
    if (savedHighScore >= 20 && !player.ownedChars.includes('hidden_01')) { player.ownedChars.push('hidden_01'); addLog("[해금] 히든 스킨 '정복자' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
    if (player.totalGoldEarned >= 1000 && !player.ownedChars.includes('hidden_02')) { player.ownedChars.push('hidden_02'); addLog("[해금] 히든 스킨 '갑부' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
    if (player.totalPotionsUsed >= 10 && !player.ownedChars.includes('hidden_03')) { player.ownedChars.push('hidden_03'); addLog("[해금] 히든 스킨 '초코덕후' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
    if (player.totalWrongAnswers >= 10 && !player.ownedChars.includes('hidden_04')) { player.ownedChars.push('hidden_04'); addLog("[해금] 히든 스킨 '오답달인' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
    if (player.totalEvasions >= 10 && !player.ownedChars.includes('hidden_05')) { player.ownedChars.push('hidden_05'); addLog("[해금] 히든 스킨 '방랑자' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
    
    if (currentDifficulty === 'hard') {
        if (player.floor >= 10 && !player.ownedChars.includes('hard_01')) { player.ownedChars.push('hard_01'); addLog("[해금] 하드 전용 스킨 '불굴의 도전자' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
        if (player.floor >= 15 && !player.ownedChars.includes('hard_02')) { player.ownedChars.push('hard_02'); addLog("[해금] 하드 전용 스킨 '고독한 현자' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
        if (player.floor >= 20 && !player.ownedChars.includes('hard_03')) { player.ownedChars.push('hard_03'); addLog("[해금] 하드 전용 스킨 '심연의 지배자' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
        if (player.floor >= 25 && !player.ownedChars.includes('hard_04')) { player.ownedChars.push('hard_04'); addLog("[해금] 하드 전용 스킨 '역사 마스터' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
        if (player.floor >= 30 && !player.ownedChars.includes('hard_05')) { player.ownedChars.push('hard_05'); addLog("[해금] 하드 전용 스킨 '타워의 전설' 획득!", TIER_COLORS.hidden); newUnlocks = true; }
    }
    if (currentDifficulty === 'normal' && player.floor >= 100 && !player.ownedChars.includes('legend_02')) { player.ownedChars.push('legend_02'); addLog("[해금] 전설 스킨 '타워 정복자' 획득!", TIER_COLORS.legend); newUnlocks = true; }
    if (currentDifficulty === 'hard' && player.floor >= 100 && !player.ownedChars.includes('legend_03')) { player.ownedChars.push('legend_03'); addLog("[해금] 전설 스킨 '불멸의 신' 획득!", TIER_COLORS.legend); newUnlocks = true; }

    let nonLegendIds = PLAYER_CHARS.filter(c => c.tier !== 'legend').map(c => c.id);
    let hasAllNonLegends = nonLegendIds.every(id => player.ownedChars.includes(id));
    if (hasAllNonLegends && !player.ownedChars.includes('legend_01')) { player.ownedChars.push('legend_01'); addLog("[해금] 전설 스킨 '컬렉터 마스터' 획득!", TIER_COLORS.legend); newUnlocks = true; }
    
    if (newUnlocks) saveGame(false);
}

function startCustomGame() {
    let chap = document.getElementById('chapter-select').value;
    let unitWrap = document.getElementById('sub-unit-range-wrapper');

    activeQuizBank = quizBank.filter(q => {
        let matchG = (curGameGrade === 'all' || q.grade === curGameGrade);
        let matchS = (curGameSubject === 'all' || q.subject === curGameSubject);
        let matchC = (chap === 'all' || q.chapter === chap);
        let matchSem = true;
        
        if (curGameSemester === '1학기') matchSem = q.chapter.includes('1학기') || q.chapter.includes('보완');
        else if (curGameSemester === '2학기') matchSem = q.chapter.includes('2학기');
        
        return matchG && matchS && matchC && matchSem;
    });
    
    if (unitWrap.style.display === 'block') {
        let startCat = document.getElementById('start-category');
        let endCat = document.getElementById('end-category');
        
        if (startCat && endCat && startCat.value && endCat.value) {
            let sIdx = parseInt(startCat.value);
            let eIdx = parseInt(endCat.value);
            
            let unitList = treeData[curGameGrade]?.[curGameSubject]?.[chap];
            if (unitList && Array.isArray(unitList)) {
                let units = unitList.slice(sIdx, eIdx + 1);
                activeQuizBank = activeQuizBank.filter(q => units.includes(q.unit));
            }
        }
    }

    if (activeQuizBank.length === 0) {
        alert("선택한 범위에 문제가 없어 전체 문제로 진행합니다.");
        activeQuizBank = quizBank;
    }
    
    initAudio(); 
    playBGM(); 
    
    document.getElementById('range-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    document.getElementById('main-screen').style.display = 'flex'; 
    
    const gData = getGlobalData();
    let startHp = currentDifficulty === 'easy' ? 150 : 100;
    
    player = { 
        hp: startHp, maxHp: startHp, gold: 50, potions: 3, floor: 1, inventory: {}, baseAtk: 15, evasion: 0, 
        currentChar: gData.currentChar, ownedChars: gData.ownedChars, 
        totalGoldEarned: gData.totalGoldEarned, totalPotionsUsed: gData.totalPotionsUsed, 
        totalWrongAnswers: gData.totalWrongAnswers, totalEvasions: gData.totalEvasions,
        bossBag: Array.from({length: BOSS_MONSTERS.length}, (_, i) => i).sort(() => Math.random() - 0.5)
    };
    activeEffects = { shield: 0, powerUp: 0, weaken: 0, armorBreak: 0, revive: 0 };
    
    const logBox = document.getElementById('log-box'); 
    if(logBox) logBox.innerHTML = ""; 
    
    let diffText = currentDifficulty === 'easy' ? "쉬움" : currentDifficulty === 'hard' ? "어려움" : "보통";
    addLog(`[안내] 지식 타워에 입장했습니다! (난이도: ${diffText})`, "#ffd700"); 
    
    enterHub();
}

function loadGameFromTitle() {
    let saved = getSafeStorage('historyTowerSave', null);
    if (!saved) return alert("저장된 게임 데이터가 없습니다.");
    
    try {
        let data = JSON.parse(saved);
        player = Object.assign({ 
            hp: 100, maxHp: 100, gold: 0, potions: 3, floor: 1, inventory: {}, baseAtk: 15, evasion: 0, 
            currentChar: "char_01", ownedChars: ["char_01"], totalGoldEarned: 0, totalPotionsUsed: 0, 
            totalWrongAnswers: 0, totalEvasions: 0, bossBag: [] 
        }, data.player);
        
        if (player.baseAtk < 15) player.baseAtk = 15; 
        
        activeEffects = data.effects || { shield: 0, powerUp: 0, weaken: 0, armorBreak: 0, revive: 0 };
        if(activeEffects.revive === undefined) activeEffects.revive = 0;
        
        activeQuizBank = quizBank; 
        
        initAudio(); 
        playBGM();
        
        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'flex';
        document.getElementById('main-screen').style.display = 'flex'; 
        
        const logBox = document.getElementById('log-box'); 
        if(logBox) logBox.innerHTML = ""; 
        
        addLog("저장된 게임을 불러왔습니다."); 
        enterHub();
    } catch (e) { alert("데이터를 불러오는 중 오류가 발생했습니다."); }
}

function confirmReturnToTitle() {
    if (isTutorialMode) return addLog("[안내] 튜토리얼 중단은 안내창의 [중단하고 나가기]를 이용하세요.", "#ffeb3b");
    
    if (confirm("타이틀 화면으로 돌아갑니다. 저장하지 않은 진행 상황은 모두 사라집니다.")) {
        monster = null; 
        changeBgmMode('title'); 
        document.getElementById('game-container').style.display = 'none'; 
        document.getElementById('title-screen').style.display = 'flex'; 
        checkLoadButton();
    }
}

function enterHub() {
    monster = null; 
    document.getElementById('main-screen').style.display = 'flex'; 
    document.getElementById('monster-area').style.display = 'none'; 
    document.getElementById('player-area').style.display = 'flex'; 
    document.getElementById('battle-ui').style.display = 'none'; 
    document.getElementById('quiz-box').style.display = 'none'; 
    document.getElementById('options-ui').style.display = 'none'; 
    document.getElementById('shop-ui').style.display = 'none'; 
    document.getElementById('hub-ui').style.display = 'grid'; 
    
    addLog("------------------------------------", "#7f8c8d"); 
    addLog("[안내] 휴식 공간에 입장했습니다.", "#a5d6a7"); 
    
    updatePlayerAreaUI(); 
    checkAndApplyBGM(); 
    updateUI(); 
}

function updateUI() {
    if(!player) return;
    const uiFloor = document.getElementById('floor-ui'); 
    if (uiFloor) uiFloor.innerText = player.floor + "F"; 
    
    const uiHp = document.getElementById('hp-ui'); 
    if (uiHp) uiHp.innerText = player.hp + "/" + player.maxHp;
    
    const diffBadge = document.getElementById('diff-badge');
    if (diffBadge) {
        const diffInfo = { 
            'easy': { text: "[쉬움]", color: "#4caf50" }, 
            'normal': { text: "[보통]", color: "#f39c12" }, 
            'hard': { text: "[어려움]", color: "#ff5252" }, 
            'tutorial': { text: "[튜토리얼]", color: "#00e676" } 
        };
        const info = diffInfo[currentDifficulty] || diffInfo['normal']; 
        diffBadge.innerText = info.text; 
        diffBadge.style.color = info.color;
    }

    const hpBox = document.getElementById('hp-container');
    if (hpBox) { 
        if (player.hp > 0 && player.hp <= player.maxHp * 0.3) hpBox.classList.add('hp-danger'); 
        else hpBox.classList.remove('hp-danger'); 
    }

    const uiGold = document.getElementById('gold-ui'); 
    if (uiGold) uiGold.innerText = player.gold; 
    
    const uiPotion = document.getElementById('potion-ui'); 
    if (uiPotion) uiPotion.innerText = player.potions;
    
    const uiAtk = document.getElementById('atk-ui'); 
    if (uiAtk) uiAtk.innerText = player.baseAtk; 
    
    const uiEva = document.getElementById('eva-ui'); 
    if (uiEva) uiEva.innerText = player.evasion + "%";
    
    let buffText = [];
    if (activeEffects.shield > 0) buffText.push(`백과사전(${activeEffects.shield}회)`);
    if (activeEffects.powerUp > 0) buffText.push(`형광펜(${activeEffects.powerUp}회)`);
    if (activeEffects.weaken > 0) buffText.push(`귀마개(${activeEffects.weaken}회)`);
    if (activeEffects.armorBreak > 0) buffText.push(`빨간펜(${activeEffects.armorBreak}회)`);
    if (activeEffects.revive > 0) buffText.push(`지우개(${activeEffects.revive}개)`);
    
    const uiBuff = document.getElementById('buff-ui'); 
    if (uiBuff) uiBuff.innerText = buffText.length > 0 ? buffText.join(" / ") : "적용 효과 없음";

    if (!['victory', 'gameover', 'title'].includes(currentBgmMode)) checkAndApplyBGM();
}

function startBattle() {
    if (isTutorialMode) return addLog("[안내] 튜토리얼 중입니다! 안내창을 확인해주세요.", "#ffeb3b");
    
    document.getElementById('hub-ui').style.display = 'none'; 
    document.getElementById('battle-ui').style.display = 'grid'; 
    document.getElementById('player-area').style.display = 'none'; 
    document.getElementById('monster-area').style.display = 'flex';
    
    let isBoss = (player.floor % 10 === 0); 
    let baseHp = Math.floor((30 + (player.floor * 10)) / 4); 
    let mHp = Math.max(10, baseHp); 
    let mAtk = 5 + Math.floor(player.floor / 2); 
    
    if (currentDifficulty === 'easy') {
        mAtk = Math.max(1, Math.floor(mAtk * 0.7)); 
    } else if (currentDifficulty === 'hard') { 
        mAtk = Math.floor(mAtk * 1.5); 
    }
    
    let baseM;
    if (isBoss) { 
        if (!player.bossBag || player.bossBag.length === 0) {
            player.bossBag = Array.from({length: BOSS_MONSTERS.length}, (_, i) => i).sort(() => Math.random() - 0.5);
        }
        let bossIdx = player.bossBag.pop(); 
        baseM = BOSS_MONSTERS[bossIdx]; 
        mHp = Math.floor(mHp * 2.5); 
        mAtk = Math.floor(mAtk * 1.5);
    } else { 
        baseM = NORMAL_MONSTERS[Math.floor(Math.random() * NORMAL_MONSTERS.length)]; 
    }

    monster = { 
        name: isBoss ? baseM.name : `Lv.${player.floor} ${baseM.name}`, 
        icon: baseM.icon, image: baseM.image, hp: mHp, maxHp: mHp, atk: mAtk, 
        isBoss: isBoss, isElite: false 
    };
    
    const mNameEl = document.getElementById('monster-name'); 
    mNameEl.innerText = monster.name; 
    mNameEl.classList.remove('name-normal', 'name-elite', 'name-boss');
    
    if (isBoss) mNameEl.classList.add('name-boss'); 
    else mNameEl.classList.add('name-normal');

    document.getElementById('monster-hp').innerText = `${monster.hp}/${monster.maxHp}`; 
    updateMonsterImageUI(monster); 
    
    addLog("------------------------------------", "#7f8c8d"); 
    addLog(isBoss ? `[경고] 대왕 방해꾼 출현!` : `[도전] 학습 방해꾼이 나타났습니다.`, isBoss ? "#e2ffb0" : "#ff4081"); 
    addLog("[안내] 집중력이 다 떨어지면 공부를 할 수 없으니 조심하자!", "#ffd700"); 
    
    checkAndApplyBGM(); 
    updateUI(); 
}

function startEliteBattle() {
    document.getElementById('hub-ui').style.display = 'none'; 
    document.getElementById('battle-ui').style.display = 'grid'; 
    document.getElementById('player-area').style.display = 'none'; 
    document.getElementById('monster-area').style.display = 'flex';
    
    let baseM = ELITE_MONSTERS[Math.floor(Math.random() * ELITE_MONSTERS.length)];
    let baseHp = Math.floor((30 + (player.floor * 10)) / 4); 
    let mHp = Math.max(10, baseHp); 
    let mAtk = 5 + Math.floor(player.floor / 2);
    
    if (currentDifficulty === 'easy') {
        mAtk = Math.max(1, Math.floor(mAtk * 0.7)); 
    } else if (currentDifficulty === 'hard') { 
        mAtk = Math.floor(mAtk * 1.5); 
    }
    
    // 💡 정예몹의 층수(Lv)를 명시하여 층수 오르는 것을 확실히 인지시킴
    monster = { 
        name: `[정예] Lv.${player.floor} ${baseM.name}`, 
        icon: baseM.icon, image: baseM.image, 
        hp: Math.floor(mHp * 1.5), maxHp: Math.floor(mHp * 1.5), atk: Math.floor(mAtk * 1.2), 
        isBoss: false, isElite: true 
    };
    
    const mNameEl = document.getElementById('monster-name'); 
    mNameEl.innerText = monster.name; 
    mNameEl.classList.remove('name-normal', 'name-elite', 'name-boss'); 
    mNameEl.classList.add('name-elite');
    
    document.getElementById('monster-hp').innerText = `${monster.hp}/${monster.maxHp}`; 
    updateMonsterImageUI(monster); 
    
    addLog("------------------------------------", "#7f8c8d"); 
    addLog(`[위험] 정예 방해꾼이 나타났습니다!`, "#e6b3ff"); 
    addLog("[안내] 집중력이 다 떨어지면 공부를 할 수 없으니 조심하자!", "#b2ebf2"); 
    
    checkAndApplyBGM(); 
    updateUI();
}

function loadQuiz() {
    if (activeQuizBank.length === 0) { 
        addLog("출제 범위에 문제가 없습니다."); 
        enterHub(); 
        return; 
    }
    
    document.getElementById('battle-ui').style.display = 'none'; 
    document.getElementById('quiz-box').style.display = 'block'; 
    document.getElementById('options-ui').style.display = 'grid'; 
    addLog("▶ <b>[나의 턴]</b> 어서 방해꾼을 몰아내자!", "#4dd0e1");

    let rIdx = Math.floor(Math.random() * activeQuizBank.length); 
    let currentQuiz = activeQuizBank[rIdx];
    
    document.getElementById('quiz-box').innerText = `[${currentQuiz.subject}] ${currentQuiz.q}`;
    
    const opt = document.getElementById('options-ui'); 
    opt.innerHTML = "";
    
    let shuffledOptions = currentQuiz.options.map((o, i) => { 
        return { text: o, isCorrect: i === currentQuiz.answer }; 
    });
    
    // 💡 퀴즈 문항 100% 완전 랜덤 배치 (Fisher-Yates Shuffle)
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    shuffledOptions.forEach((obj) => {
        let b = document.createElement('button'); 
        b.className = "option-btn"; 
        b.innerText = obj.text;
        b.onclick = () => checkAnswer(obj.isCorrect, currentQuiz.options[currentQuiz.answer]); 
        opt.appendChild(b);
    });
}

function checkAnswer(isCorrect, ansStr) {
    document.getElementById('quiz-box').style.display = 'none'; 
    document.getElementById('options-ui').style.display = 'none';
    
    if (isCorrect) {
        let dmg = player.baseAtk; 
        if (activeEffects.powerUp > 0) { dmg = Math.floor(dmg * 1.5); activeEffects.powerUp--; } 
        if (activeEffects.armorBreak > 0) { dmg = Math.floor(dmg * 1.5); activeEffects.armorBreak--; }
        
        monster.hp -= dmg; 
        addLog(`[정답] 방해꾼의 에너지를 ${dmg}만큼 깎았습니다!`, "#00e676"); 
        document.getElementById('monster-hp').innerText = `${Math.max(0, monster.hp)}/${monster.maxHp}`; 
        updateUI(); 
        
        if (monster.hp <= 0) return winBattle();
    } else { 
        addLog(`[오답] 정답은 '${ansStr}' 입니다.`, "#ff7043"); 
        player.totalWrongAnswers++; 
        checkHiddenUnlocks(); 
        updateUI(); 
    }

    setTimeout(() => {
        addLog("▶ <b>[방해꾼의 턴]</b>", "#ff6b6b");
        
        setTimeout(() => {
            if (Math.random() * 100 < player.evasion) { 
                addLog(`[집중] 방해꾼의 훼방을 완벽히 차단했습니다!`, "#81c784"); 
                player.totalEvasions++; 
                checkHiddenUnlocks(); 
            } 
            else if (activeEffects.shield > 0) { 
                addLog(`[방어] 훼방을 성공적으로 막아냈습니다!`, "#4dd0e1"); 
                activeEffects.shield--; 
            } 
            else { 
                let dmg = monster.atk; 
                if (activeEffects.weaken > 0) { dmg = Math.floor(dmg / 2); activeEffects.weaken--; } 
                
                player.hp -= dmg; 
                addLog(`[방해받음] 아차! 집중력이 ${dmg} 떨어졌습니다.`, "#ff5252"); 
                
                if (player.hp <= 0) { 
                    updateUI(); 
                    return checkDeath(); 
                } 
            }
            
            document.getElementById('monster-hp').innerText = `${Math.max(0, monster.hp)}/${monster.maxHp}`; 
            updateUI(); 
            document.getElementById('battle-ui').style.display = 'grid'; 
        }, 1000); 
    }, 1000); 
}

function winBattle() {
    document.getElementById('monster-hp').innerText = `0/${monster.maxHp}`; 
    
    if (isTutorialMode) {
        return;
    }

    addLog(`[성공] 방해꾼을 완벽히 물리쳤습니다!`, "#ffd700");
    
    if (monster && monster.isBoss) { 
        player.hp = player.maxHp; 
        addLog(`[보스 처치] 집중력을 모두 회복했습니다!`, "#64b5f6"); 
    }
    
    if (player.inventory['boss_art_1']) { 
        player.hp = Math.min(player.maxHp, player.hp + 15); 
        addLog(`[패시브] 금동대향로의 기운으로 체력 15 회복!`, "#ff4081"); 
    }
    if (player.inventory['boss_art_14']) { 
        player.hp = Math.min(player.maxHp, player.hp + 30); 
        addLog(`[패시브] 동의보감의 비방으로 체력 30 회복!`, "#ff4081"); 
    }
    if (player.inventory['boss_art_8']) { 
        activeEffects.shield++; 
        addLog(`[패시브] 거북선의 가호로 백과사전(방어) 1회 충전!`, "#ff4081"); 
    }
    if (player.inventory['boss_art_9']) { 
        activeEffects.powerUp++; 
        addLog(`[패시브] 앙부일구의 기록으로 형광펜(강화) 1회 충전!`, "#ff4081"); 
    }

    let gold = 10 + Math.floor(Math.random() * 10) + player.floor;
    
    if (player.inventory['boss_art_4']) { 
        gold += 20; 
        addLog(`[패시브] 왕의 어보 효과로 20G 추가 획득!`, "#ff4081"); 
    }
    if (player.inventory['boss_art_11']) { 
        gold += 50; 
        addLog(`[패시브] 신라 금관의 광채로 50G 추가 획득!`, "#ff4081"); 
    }

    player.gold += gold; 
    player.totalGoldEarned += gold; 
    // 💡 정예몹을 잡아도 아래 코드에서 층수가 1층 정상적으로 상승합니다!
    player.floor++; 
    updateUI();
    
    if (player.floor > savedHighScore) { 
        savedHighScore = player.floor; 
        setSafeStorage('historyTowerMaxFloor', savedHighScore); 
        const hsUi = document.getElementById('high-score-ui'); 
        if(hsUi) hsUi.innerText = savedHighScore; 
    }
    
    checkHiddenUnlocks(); 
    setTimeout(showRewardScreen, 1000);
}

function checkDeath() {
    updateUI();
    
    if (activeEffects.revive > 0) { 
        activeEffects.revive--; 
        player.hp = Math.floor(player.maxHp / 2); 
        addLog("[부활] 적용해둔 마법의 지우개로 집중력을 회복했습니다!", "#ffd700"); 
        updateUI(); 
        document.getElementById('battle-ui').style.display = 'grid'; 
    } 
    else if (player.inventory['revive'] > 0) { 
        player.inventory['revive']--; 
        player.hp = Math.floor(player.maxHp / 2); 
        addLog("[부활] 가방 속 마법의 지우개로 집중력을 회복했습니다!", "#ffd700"); 
        updateUI(); 
        document.getElementById('battle-ui').style.display = 'grid'; 
    } 
    else {
        addLog("[휴식] 집중력을 모두 사용했습니다.", "#c62828"); 
        monster = null; 
        changeBgmMode('gameover'); 
        localStorage.removeItem('historyTowerSave'); 
        checkLoadButton();
        
        alert(`도전 종료!\n도달 층수: ${player.floor}층\n수고하셨습니다. 잠시 휴식을 취해보세요!`);
        document.getElementById('game-container').style.display = 'none'; 
        document.getElementById('title-screen').style.display = 'flex';
    }
}

function showRewardScreen() {
    document.getElementById('main-screen').style.display = 'none'; 
    document.getElementById('hub-ui').style.display = 'none'; 
    document.getElementById('battle-ui').style.display = 'none'; 
    document.getElementById('reward-screen').style.display = 'flex'; 
    changeBgmMode('victory'); 
    
    const container = document.getElementById('reward-cards-container'); 
    container.innerHTML = "";
    
    let shuffled = []; 
    let borderCol = '#f39c12';
    
    // 💡 다음 층이 보스전(10, 20, 30층...)일 경우 엘리트 보상 제외 스위치 작동!
    const isNextBoss = (player.floor % 10 === 0);
    
    if (monster.isBoss) { 
        borderCol = '#ff4081'; 
        let chosenCards = []; 
        while (chosenCards.length < 3) { 
            let r = Math.random(); 
            let poolChoices; 
            
            let validBoss = BOSS_REWARD_CARDS.filter(c => !player.inventory[c.id] && !chosenCards.some(x => x.id === c.id)); 
            let validElite = ELITE_REWARD_CARDS.filter(c => !chosenCards.some(x => x.id === c.id)); 
            
            // 보스 직전에는 엘리트 조우 필터링
            if (isNextBoss) validElite = validElite.filter(c => c.id !== 'encounter_elite_md');

            let validNormal = NORMAL_REWARD_CARDS.filter(c => c.id !== 'encounter_elite' && !chosenCards.some(x => x.id === c.id)); 
            
            if (r < 0.30 && validBoss.length > 0) poolChoices = validBoss; 
            else if (r < 0.60 && validElite.length > 0) poolChoices = validElite; 
            else poolChoices = validNormal; 
            
            if (!poolChoices || poolChoices.length === 0) poolChoices = validNormal; 
            
            let card = poolChoices[Math.floor(Math.random() * poolChoices.length)]; 
            if (card && !chosenCards.some(x => x.id === card.id)) chosenCards.push(card); 
        } 
        shuffled = chosenCards; 
    } 
    else if (monster.isElite) { 
        borderCol = '#b388ff'; 
        let validElite = ELITE_REWARD_CARDS.slice();
        
        // 보스 직전에는 엘리트 조우 필터링
        if (isNextBoss) validElite = validElite.filter(c => c.id !== 'encounter_elite_md');
        
        for (let i = validElite.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [validElite[i], validElite[j]] = [validElite[j], validElite[i]];
        }
        shuffled = validElite.slice(0, 3); 
    } 
    else { 
        let pool = NORMAL_REWARD_CARDS.slice();
        
        // 보스 직전에는 엘리트 조우 필터링
        if (isNextBoss) pool = pool.filter(r => r.id !== 'encounter_elite');
        
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        shuffled = pool.slice(0, 3); 
    }
    
    shuffled.forEach(r => { 
        let card = document.createElement('div'); 
        card.className = "reward-card"; 
        card.style.border = `3px solid ${borderCol}`; 
        card.innerHTML = `
            <div class="reward-icon">${r.icon}</div>
            <div class="reward-text-wrap">
                <div class="reward-title" style="color:${borderCol};">${r.title}</div>
                <div class="reward-desc">${r.desc}</div>
            </div>
        `; 
        card.onclick = () => { 
            let res = r.action(); 
            document.getElementById('reward-screen').style.display = 'none'; 
            
            // 메인 화면을 다시 켜주는 스위치 복구! (화면 투명해지는 버그 해결)
            document.getElementById('main-screen').style.display = 'flex'; 
            
            if (res === 'elite_encounter') {
                startEliteBattle();
            } else {
                enterHub(); 
            }
        };
        container.appendChild(card); 
    });
}

function openShop() { 
    if (isTutorialMode && tutorialStep !== 7) return addLog("[안내] 지금은 누를 수 없습니다! 안내창을 확인해주세요.", "#ffeb3b"); 
    
    document.getElementById('hub-ui').style.display = 'none'; 
    document.getElementById('shop-ui').style.display = 'grid'; 
    addLog("[상점] 매점에 입장했습니다.", "#b2ebf2"); 
    
    if(isTutorialMode && tutorialStep === 7) { 
        document.getElementById('hub-btn-shop').style.animation = "none"; 
        tutorialStep++; 
        updateTutorialUI(); 
    } 
}

function closeShop() { 
    if (isTutorialMode) return addLog("[안내] 아이템을 구매해야 상점을 나갈 수 있습니다.", "#ffeb3b"); 
    document.getElementById('shop-ui').style.display = 'none'; 
    document.getElementById('hub-ui').style.display = 'grid'; 
}

function buyItem(type) { 
    const prices = { potion: 30, shield: 50, powerUp: 50, maxhp: 100 }; 
    
    if (isTutorialMode) { 
        if (tutorialStep !== 8 || type !== 'shield') { 
            return addLog("[안내] 튜토리얼 중입니다! [철벽 백과사전]을 클릭해주세요.", "#ffeb3b"); 
        } 
    } 
    
    if (player.gold >= prices[type]) { 
        player.gold -= prices[type]; 
        
        if (type === 'potion') player.potions++; 
        else if (type === 'maxhp') { player.maxHp += 20; player.hp += 20; } 
        else player.inventory[type] = (player.inventory[type] || 0) + 1; 
        
        addLog(`[상점] ${ITEM_DB[type] ? ITEM_DB[type].name : '아이템'} 구매 완료!`, "#a5d6a7"); 
        updateUI(); 
        
        if(isTutorialMode && tutorialStep === 8 && type === 'shield') { 
            document.getElementById('shop-btn-shield').style.animation = "none"; 
            document.getElementById('shop-ui').style.display = 'none'; 
            document.getElementById('hub-ui').style.display = 'grid'; 
            tutorialStep++; 
            updateTutorialUI(); 
        } 
    } else { 
        alert("특별 용돈이 부족합니다."); 
    } 
}

function usePotion() { 
    if (isTutorialMode) return addLog("[안내] 튜토리얼 중에는 초콜릿을 쓸 수 없습니다.", "#ffeb3b"); 
    
    if (player.potions > 0) { 
        if (player.hp >= player.maxHp) return alert("집중력이 이미 가득 차 있습니다."); 
        
        player.potions--; 
        player.hp = Math.min(player.maxHp, player.hp + 40); 
        player.totalPotionsUsed++; 
        checkHiddenUnlocks(); 
        
        addLog("[회복] 달콤한 초콜릿을 먹었습니다.", "#a5d6a7"); 
        updateUI(); 
    } else { 
        alert("초콜릿이 없습니다!"); 
    } 
}

function openInventory() { 
    if (isTutorialMode && tutorialStep !== 11) return addLog("[안내] 지금은 누를 수 없습니다! 안내창을 확인해주세요.", "#ffeb3b"); 
    
    document.getElementById('inventory-modal').style.display = 'flex'; 
    const list = document.getElementById('inventory-list'); 
    list.innerHTML = ""; 
    let hasItem = false; 
    
    for (let k in player.inventory) { 
        if (player.inventory[k] > 0) { 
            hasItem = true; 
            let item = ITEM_DB[k]; 
            if (!item) continue; 
            
            let btnHtml = item.isPassive ? `<button class="action-btn equipped" style="background-color:#7f8c8d; cursor:default;">영구적용</button>` : `<button class="action-btn" onclick="useInventoryItem('${k}')">사용</button>`; 
            let div = document.createElement('div'); 
            div.className = "list-item"; 
            div.innerHTML = `
                <div class="list-item-info">
                    <div class="list-item-text-wrap">
                        <div class="list-item-title">${item.name} x${player.inventory[k]}</div>
                        <div class="list-item-desc">${item.desc}</div>
                    </div>
                </div>
                ${btnHtml}
            `; 
            list.appendChild(div); 
        } 
    } 
    
    if (!hasItem) list.innerHTML = "<p style='color:#bdc3c7;text-align:center;'>가방이 비어있습니다.</p>"; 
    
    if(isTutorialMode && tutorialStep === 11) { 
        document.getElementById('hub-btn-bag').style.animation = "none"; 
        document.getElementById('btn-close-bag').style.animation = "hintPulse 1.5s infinite"; 
        tutorialStep++; 
        updateTutorialUI(); 
    } 
}

function closeInventory() { 
    if (isTutorialMode && tutorialStep < 12) return; 
    document.getElementById('inventory-modal').style.display = 'none'; 
    
    if(isTutorialMode && tutorialStep === 12) { 
        document.getElementById('btn-close-bag').style.animation = "none"; 
        tutorialStep++; 
        updateTutorialUI(); 
    } 
}

function useInventoryItem(key) { 
    if (isTutorialMode) return addLog("[안내] 튜토리얼 중에는 아이템을 눈으로 확인만 해주세요!", "#ffeb3b"); 
    
    if (player.inventory[key] > 0) { 
        player.inventory[key]--; 
        
        if (key === 'shield') activeEffects.shield++; 
        else if (key === 'powerUp') activeEffects.powerUp += 2; 
        else if (key === 'weaken') activeEffects.weaken += 2; 
        else if (key === 'armorBreak') activeEffects.armorBreak += 2; 
        else if (key === 'revive') activeEffects.revive++; 
        
        addLog(`[사용] ${ITEM_DB[key].name} 적용 완료!`, "#e65100"); 
        updateUI(); 
        openInventory(); 
    } 
}

function openCharacterRoom() { 
    if (isTutorialMode && tutorialStep !== 9) return addLog("[안내] 지금은 누를 수 없습니다! 안내창을 확인해주세요.", "#ffeb3b"); 
    
    document.getElementById('character-modal').style.display = 'flex'; 
    const list = document.getElementById('character-list'); 
    list.innerHTML = ""; 
    
    PLAYER_CHARS.forEach(c => { 
        const isOwned = player.ownedChars.includes(c.id); 
        const isEq = player.currentChar === c.id; 
        let btn = ""; 
        
        if (isEq) {
            btn = `<button class="action-btn equipped">장착중</button>`; 
        } else if (isOwned) {
            btn = `<button class="action-btn" onclick="buyOrEquipChar('${c.id}')">장착</button>`; 
        } else { 
            if (c.price === -1) btn = `<div class="hidden-condition">[히든]<br>${c.unlockDesc}</div>`; 
            else btn = `<button class="action-btn" style="background:#0277bd;" onclick="buyOrEquipChar('${c.id}')">${c.price}G 구매</button>`; 
        } 
        
        let displayName = (c.price === -1 && !isOwned) ? "???" : `${TIER_NAMES[c.tier]} ${c.name}`; 
        let displayIcon = (c.price === -1 && !isOwned) ? "[ ?_? ]" : c.icon[0]; 
        let nameStyleColor = isOwned ? (TIER_COLORS[c.tier] || '#bdc3c7') : '#ccc'; 
        
        let div = document.createElement('div'); 
        div.className = "list-item"; 
        div.innerHTML = `
            <div class="list-item-info">
                <div class="list-item-icon" style="color:${nameStyleColor}; font-size: 1.1rem; border: 1px solid ${nameStyleColor}55;">${displayIcon}</div>
                <div style="margin-left:10px; color:${nameStyleColor}; font-weight:bold; font-size: 0.9rem;">${displayName}</div>
            </div>
            ${btn}
        `; 
        list.appendChild(div); 
    }); 
    
    if(isTutorialMode && tutorialStep === 9) { 
        document.getElementById('hub-btn-char').style.animation = "none"; 
        tutorialStep++; 
        updateTutorialUI(); 
        setTimeout(() => { 
            let btns = document.getElementById('character-list').querySelectorAll('.action-btn'); 
            if(btns.length > 1) btns[1].style.animation = "hintPulse 1.5s infinite"; 
        }, 50); 
    } 
}

function buyOrEquipChar(id) { 
    if (isTutorialMode) { 
        if (tutorialStep !== 10 || id !== 'char_02') return addLog("[안내] 튜토리얼 중입니다! [모범생] 스킨의 장착 버튼을 눌러주세요.", "#ffeb3b"); 
    } 
    
    const char = PLAYER_CHARS.find(c => c.id === id); 
    
    if (player.ownedChars.includes(id)) { 
        player.currentChar = id; 
        addLog(`[옷장] ${char.name} 스킨을 장착했습니다!`, "#4dd0e1"); 
    } else { 
        if (char.price !== -1 && player.gold >= char.price) { 
            player.gold -= char.price; 
            player.ownedChars.push(id); 
            player.currentChar = id; 
            addLog(`[구매] ${char.name} 스킨을 획득했습니다!`, "#a5d6a7"); 
            checkHiddenUnlocks(); 
        } else if (char.price !== -1) {
            return alert("특별 용돈이 부족합니다."); 
        }
    } 
    
    updatePlayerAreaUI(); 
    checkAndApplyBGM(); 
    updateUI(); 
    
    if(isTutorialMode && tutorialStep === 10 && id === 'char_02') { 
        let btns = document.getElementById('character-list').querySelectorAll('.action-btn'); 
        if(btns.length > 1) btns[1].style.animation = "none"; 
        document.getElementById('character-modal').style.display = 'none'; 
        tutorialStep++; 
        updateTutorialUI(); 
    } else { 
        openCharacterRoom(); 
    } 
}

function closeCharacterRoom() { 
    if (isTutorialMode) return addLog("[안내] 스킨을 먼저 장착해야 나갈 수 있습니다.", "#ffeb3b"); 
    document.getElementById('character-modal').style.display = 'none'; 
}

function openCheatModal() { 
    if (isTutorialMode) return addLog("[안내] 튜토리얼 중에는 치트를 쓸 수 없습니다.", "#ffeb3b"); 
    if(document.getElementById('title-screen').style.display !== 'none') return alert("게임 시작 후 이용해주세요!"); 
    document.getElementById('cheat-modal').style.display = 'flex'; 
}

function closeCheatModal() { 
    document.getElementById('cheat-modal').style.display = 'none'; 
}

function cheatAction(t) { 
    if (!player || !player.hp) return; 
    if (t === 'gold') { 
        player.gold += 10000; player.totalGoldEarned += 10000; 
        addLog("[치트] 용돈 +10000", "#e040fb"); 
    } else if (t === 'chars') { 
        player.ownedChars = PLAYER_CHARS.map(c => c.id); 
        addLog("[치트] 모든 스킨 해금 완료", "#e040fb"); 
    } else if (t === 'items') { 
        for (let k in ITEM_DB) { 
            if (!ITEM_DB[k].isPassive) { player.inventory[k] = (player.inventory[k] || 0) + 1; } 
        } 
        player.potions += 1; 
        addLog("[치트] 초콜릿 포함 모든 사용 아이템 1개씩 획득!", "#3498db"); 
    } else if (t === 'stats') { 
        player.maxHp += 1000; player.hp = player.maxHp; player.baseAtk += 100; 
        addLog("[치트] 집중력/기억력 대폭 상승", "#e040fb"); 
    } else if (t === 'floor') { 
        let nextBossFloor = Math.floor((player.floor - 1) / 10) * 10 + 10; 
        let inBattle = document.getElementById('monster-area').style.display !== 'none'; 
        if (inBattle) { 
            player.floor = nextBossFloor - 1; 
            addLog(`[치트] ${nextBossFloor}층 보스 앞으로 이동!`, "#e040fb"); 
            monster.hp = 0; 
            document.getElementById('quiz-box').style.display = 'none'; 
            document.getElementById('options-ui').style.display = 'none'; 
            closeCheatModal(); 
            return winBattle(); 
        } else { 
            player.floor = nextBossFloor; 
            addLog(`[치트] ${nextBossFloor}층 보스 앞으로 이동!`, "#e040fb"); 
        } 
    } 
    checkHiddenUnlocks(); updateUI(); updatePlayerAreaUI(); closeCheatModal(); 
}