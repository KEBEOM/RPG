// ==========================================
// 💡 5_tutorial.js: 튜토리얼 UI 컨트롤 및 흐름 제어 로직 (가독성 개편 버전)
// ==========================================

function updateSpotlight(target) {
    const spot = document.getElementById('tutorial-spotlight');
    if (!spot) return;
    
    if (!target) { 
        spot.style.display = 'none'; 
        spot.style.left = '-2000px'; 
        return; 
    }
    
    let el = typeof target === 'string' ? document.getElementById(target) : target;
    
    if (!el || el.getBoundingClientRect().width === 0) { 
        spot.style.display = 'none'; 
        spot.style.left = '-2000px';
        return; 
    }

    const rect = el.getBoundingClientRect();
    spot.style.display = 'block';
    spot.style.left = (rect.left - 6) + 'px';
    spot.style.top = (rect.top - 6) + 'px';
    spot.style.width = (rect.width + 12) + 'px';
    spot.style.height = (rect.height + 12) + 'px';
}

function updateTutorialUI() {
    if (typeof tutorialScripts === 'undefined' || tutorialStep >= tutorialScripts.length) return exitTutorial();
    
    const tutText = document.getElementById('tutorial-text'); 
    const nextBtn = document.getElementById('tutorial-next-btn'); 
    const overlay = document.getElementById('tutorial-overlay');

    if (!tutText || !overlay) {
        setTimeout(updateTutorialUI, 100);
        return;
    }

    tutText.innerHTML = tutorialScripts[tutorialStep];
    overlay.className = ''; 
    updateSpotlight(null); 
    
    if (tutorialStep === 3) {
        overlay.classList.add('pos-quiz'); 
        if(nextBtn) nextBtn.style.display = 'none'; 
        
        document.getElementById('battle-ui').style.display = 'none'; 
        document.getElementById('quiz-box').style.display = 'block'; 
        document.getElementById('quiz-box').innerText = "[모의 문제]\n조선을 건국한 왕은?";
        if(typeof addLog === 'function') addLog("▶ <b>[나의 턴]</b> 어서 방해꾼을 몰아내자!", "#4dd0e1"); 
        
        const opt = document.getElementById('options-ui'); 
        if(opt) { 
            opt.style.display = 'grid'; 
            opt.innerHTML = ""; 
            ["이성계 (정답!)", "왕건", "이순신"].forEach((o, i) => { 
                let b = document.createElement("button"); 
                b.className = "option-btn"; 
                b.innerText = o; 
                if (i === 0) {
                    b.id = "tut-answer-btn"; 
                    setTimeout(() => updateSpotlight('tut-answer-btn'), 100);
                }
                b.onclick = () => { 
                    if (i === 0) { 
                        document.getElementById('quiz-box').style.display = 'none'; 
                        document.getElementById('options-ui').style.display = 'none'; 
                        if(monster) monster.hp = 0; 
                        
                        const oldDiff = currentDifficulty; 
                        currentDifficulty = 'tutorial'; 
                        if(typeof updateUI === 'function') updateUI(); 
                        currentDifficulty = oldDiff; 
                        
                        if(typeof addLog === 'function') {
                            addLog(`[정답] 튜토리얼 방해꾼의 에너지를 깎았습니다!`, "#00e676"); 
                            addLog("[성공] 방해꾼을 물리쳤습니다!", "#ffd700"); 
                        }
                        tutorialStep++; updateTutorialUI(); 
                    } else { 
                        alert("정답 '이성계'를 누르세요."); 
                    } 
                }; 
                opt.appendChild(b); 
            }); 
        }
    } else if (tutorialStep >= 4 && tutorialStep <= 6) {
        overlay.classList.add('pos-bottom'); 
        const rewardScreen = document.getElementById('reward-screen'); 
        if(rewardScreen) {
            rewardScreen.style.justifyContent = 'flex-start'; 
            rewardScreen.style.paddingTop = '10%'; 
            rewardScreen.style.display = 'flex';
        }
        document.getElementById('main-screen').style.display = 'none'; 
        
        const container = document.getElementById('reward-cards-container'); 
        if(container) {
            container.innerHTML = `
                <div class="reward-card" id="tut-reward-card" style="z-index:1001; cursor:${tutorialStep === 6 ? 'pointer' : 'default'}; border: 3px solid #f39c12;">
                    <div class="reward-icon">[용돈]</div>
                    <div class="reward-text-wrap">
                        <div class="reward-title" style="color:#f39c12;">깜짝 장학금</div>
                        <div class="reward-desc">특별 용돈 50G 획득 ${tutorialStep === 6 ? '(클릭하세요!)' : ''}</div>
                    </div>
                </div>
            `;
        }
        
        if (tutorialStep === 4 || tutorialStep === 5) { 
            if(nextBtn) nextBtn.style.display = 'block'; 
            let tutCard = document.getElementById('tut-reward-card');
            if(tutCard) tutCard.onclick = null; 
        } else if (tutorialStep === 6) { 
            if(nextBtn) nextBtn.style.display = 'none'; 
            setTimeout(() => updateSpotlight('tut-reward-card'), 100);
            
            let tutCard = document.getElementById('tut-reward-card');
            if(tutCard) {
                tutCard.onclick = () => { 
                    if(typeof addLog === 'function') addLog("[보상] 특별 용돈 50G를 획득했습니다!", "#ffd700"); 
                    if(player) player.gold += 50; 
                    const oldDiff = currentDifficulty; currentDifficulty = 'tutorial'; 
                    if(typeof updateUI === 'function') updateUI(); 
                    currentDifficulty = oldDiff; 
                    tutorialStep++; updateTutorialUI(); 
                }; 
            }
        }
    } else if (tutorialStep === 7) { 
        overlay.classList.add('pos-top'); 
        if(nextBtn) nextBtn.style.display = 'none'; 
        
        const rewardScreen = document.getElementById('reward-screen'); 
        if(rewardScreen) {
            rewardScreen.style.justifyContent = 'center'; 
            rewardScreen.style.paddingTop = ''; 
            rewardScreen.style.display = 'none'; 
        }
        
        document.getElementById('main-screen').style.display = 'flex'; 
        document.getElementById('monster-area').style.display = 'none'; 
        document.getElementById('player-area').style.display = 'flex'; 
        document.getElementById('hub-ui').style.display = 'grid'; 
        
        document.getElementById('battle-ui').style.display = 'none';
        document.getElementById('quiz-box').style.display = 'none';
        document.getElementById('options-ui').style.display = 'none';
        
        setTimeout(() => updateSpotlight('hub-btn-shop'), 100);
    } else if (tutorialStep === 8) { 
        overlay.classList.add('pos-top'); 
        if(nextBtn) nextBtn.style.display = 'none'; 
        setTimeout(() => updateSpotlight('shop-btn-shield'), 100);
    } else if (tutorialStep === 9) { 
        overlay.classList.add('pos-top'); 
        if(nextBtn) nextBtn.style.display = 'none'; 
        if (player && !player.ownedChars.includes('char_02')) player.ownedChars.push('char_02');
        setTimeout(() => updateSpotlight('hub-btn-char'), 100);
    } else if (tutorialStep === 10) { 
        overlay.classList.add('pos-bottom'); 
        if(nextBtn) nextBtn.style.display = 'none'; 
        const charModal = document.getElementById('character-modal'); 
        if(charModal) { charModal.style.top = '5%'; charModal.style.bottom = '40%'; }
        setTimeout(() => { 
            let btns = document.getElementById('character-list').querySelectorAll('.action-btn'); 
            if(btns.length > 1) updateSpotlight(btns[1]); 
        }, 100);
    } else if (tutorialStep === 11) { 
        overlay.classList.add('pos-top'); 
        if(nextBtn) nextBtn.style.display = 'none'; 
        const charModal = document.getElementById('character-modal'); 
        if(charModal) { charModal.style.top = ''; charModal.style.bottom = ''; }
        setTimeout(() => updateSpotlight('hub-btn-bag'), 100);
    } else if (tutorialStep === 12) { 
        overlay.classList.add('pos-bottom'); 
        if(nextBtn) nextBtn.style.display = 'none'; 
        const invModal = document.getElementById('inventory-modal'); 
        if(invModal) { invModal.style.top = '5%'; invModal.style.bottom = '40%'; }
        setTimeout(() => updateSpotlight('btn-close-bag'), 100);
    } else if (tutorialStep === 13) { 
        overlay.classList.add('pos-bottom'); 
        if(nextBtn) nextBtn.style.display = 'none'; 
        
        const invModal = document.getElementById('inventory-modal'); 
        if(invModal) { invModal.style.top = ''; invModal.style.bottom = ''; }
        
        document.getElementById('game-container').style.display = 'none'; 
        document.getElementById('study-screen').style.display = 'flex'; 
        
        const studyBackBtn = document.getElementById('study-back-btn'); 
        if(studyBackBtn) studyBackBtn.style.display = 'none'; 
        
        const filterContainer = document.getElementById('study-filter-container');
        if (filterContainer) filterContainer.style.display = 'none';

        const content = document.getElementById('study-content'); 
        if(content) {
            content.style.paddingBottom = '250px'; 
            content.innerHTML = `
                <div class="category-header">튜토리얼 핵심 요약 ▼</div>
                <div class="category-content" style="display:block;">
                    <div class="study-item">
                        <div class="study-keyword" id="tut-study-item" style="cursor:pointer;">조선의 건국자 <span id="tut-study-span" class="toggle-icon">+</span></div>
                        <div class="study-desc" id="tut-study-desc">조선을 건국한 사람은 이성계(태조)입니다.</div>
                    </div>
                </div>
            `;
            
            setTimeout(() => updateSpotlight('tut-study-item'), 100);

            document.getElementById('tut-study-item').onclick = function() { 
                let desc = document.getElementById('tut-study-desc'); 
                let span = document.getElementById('tut-study-span'); 
                updateSpotlight(null);
                
                if(desc.style.display === 'block') { 
                    desc.style.display = 'none'; 
                    span.innerText = '+'; 
                    if(nextBtn) nextBtn.style.display = 'none'; 
                } else { 
                    desc.style.display = 'block'; 
                    span.innerText = '-'; 
                    if(nextBtn) { 
                        nextBtn.style.display = 'block'; 
                    } 
                } 
            };
        }
    } else if (tutorialStep === 14) { 
        overlay.classList.add('pos-bottom'); 
        document.getElementById('study-screen').style.display = 'none'; 
        let content = document.getElementById('study-content');
        if(content) content.style.paddingBottom = ''; 
        document.getElementById('game-container').style.display = 'flex'; 
        
        if(nextBtn) { 
            nextBtn.style.display = 'block'; 
            nextBtn.innerText = "튜토리얼 종료"; 
        }
    } else { 
        overlay.classList.add('pos-bottom'); 
        if(nextBtn) { 
            nextBtn.style.display = 'block'; 
            nextBtn.innerText = "다음 >"; 
        } 
    }
    
    if(overlay && tutorialStep !== 3 && tutorialStep !== 6 && tutorialStep !== 13) { 
        overlay.style.animation = 'none'; 
        overlay.offsetHeight; 
        overlay.style.animation = 'fadeInPanel 0.2s ease-out'; 
    }
}

function startTutorial() {
    isTutorialMode = true;
    tutorialStep = 0;
    
    player = { 
        currentChar: "char_01", ownedChars: ["char_01"], hp: 100, maxHp: 100, 
        gold: 0, floor: 1, inventory: {}, baseAtk: 15, evasion: 0, potions: 3, 
        totalGoldEarned: 0, totalPotionsUsed: 0, totalWrongAnswers: 0, totalEvasions: 0, bossBag: [] 
    };
    activeEffects = { shield: 0, powerUp: 0, weaken: 0, armorBreak: 0, revive: 0 };
    monster = { name: "튜토리얼 방해꾼", icon: ["(꒪⌓꒪)", "(꒪0꒪)"], hp: 15, maxHp: 15, atk: 5, isBoss: false };
    
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    document.getElementById('main-screen').style.display = 'flex';
    document.getElementById('monster-area').style.display = 'flex';
    document.getElementById('player-area').style.display = 'none';
    document.getElementById('hub-ui').style.display = 'none';
    document.getElementById('battle-ui').style.display = 'grid';
    
    if(typeof updatePlayerAreaUI === 'function') updatePlayerAreaUI();
    if(typeof updateMonsterImageUI === 'function') updateMonsterImageUI(monster);
    if(typeof updateUI === 'function') updateUI();
    
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.style.display = 'flex';
    
    updateTutorialUI();
}

function nextTutorialStep() { 
    tutorialStep++; 
    updateTutorialUI(); 
}

function exitTutorial() {
    isTutorialMode = false; 
    monster = null; 
    if(typeof changeBgmMode === 'function') changeBgmMode('title');
    
    updateSpotlight(null); 
    
    const overlay = document.getElementById('tutorial-overlay'); 
    if(overlay) { overlay.style.display = 'none'; overlay.className = 'pos-bottom'; }
    
    const nextBtn = document.getElementById('tutorial-next-btn'); 
    if(nextBtn) { nextBtn.innerText = "다음 >"; }
    
    const rewardScreen = document.getElementById('reward-screen');
    if(rewardScreen) { rewardScreen.style.justifyContent = 'center'; rewardScreen.style.paddingTop = ''; }
    
    const charModal = document.getElementById('character-modal');
    if(charModal) { charModal.style.top = ''; charModal.style.bottom = ''; }
    
    const invModal = document.getElementById('inventory-modal');
    if(invModal) { invModal.style.top = ''; invModal.style.bottom = ''; }
    
    const studyContent = document.getElementById('study-content');
    if(studyContent) studyContent.style.paddingBottom = '';
    
    const filterContainer = document.getElementById('study-filter-container');
    if (filterContainer) filterContainer.style.display = 'flex';

    const studyBackBtn = document.getElementById('study-back-btn'); 
    if(studyBackBtn) studyBackBtn.style.display = 'block';
    
    const diffBadge = document.getElementById('diff-badge');
    if(diffBadge) diffBadge.innerText = ""; 
    
    document.getElementById('game-container').style.display = 'none'; 
    document.getElementById('reward-screen').style.display = 'none'; 
    document.getElementById('study-screen').style.display = 'none'; 
    
    const opts = document.getElementById('options-ui');
    if(opts) opts.innerHTML = ""; 
    
    document.getElementById('title-screen').style.display = 'flex'; 
    
    if(typeof checkLoadButton === 'function') checkLoadButton();
}