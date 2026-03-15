function setStudyGrade(g) {
    curStudyGrade = g;
    ['3', '4', '5', '6'].forEach(gr => {
        let el = document.getElementById('s-grade-' + gr);
        if(el) el.style.backgroundColor = (g === gr+'학년') ? '#e65100' : '#616161';
    });
    renderStudyData();
}

function setStudySemester(sem) {
    curStudySemester = sem;
    document.getElementById('s-sem-1').style.backgroundColor = (sem === '1학기') ? '#8e44ad' : '#616161';
    document.getElementById('s-sem-2').style.backgroundColor = (sem === '2학기') ? '#8e44ad' : '#616161';
    document.getElementById('s-sem-all').style.backgroundColor = (sem === 'all') ? '#8e44ad' : '#616161';
    renderStudyData();
}

function setStudySubject(s) {
    curStudySubject = s;
    document.getElementById('s-subj-soc').style.backgroundColor = (s === '사회') ? '#0277bd' : '#616161';
    document.getElementById('s-subj-sci').style.backgroundColor = (s === '과학') ? '#0277bd' : '#616161';
    document.getElementById('s-subj-all').style.backgroundColor = (s === 'all') ? '#0277bd' : '#616161';
    renderStudyData();
}

function openStudyScreen() { 
    document.getElementById('title-screen').style.display = 'none'; 
    document.getElementById('study-screen').style.display = 'flex'; 
    setStudyGrade('3학년'); 
    setStudySubject('all');
    setStudySemester('all'); 
}

function closeStudyScreen() { 
    if (isTutorialMode) return addLog("[안내] 튜토리얼 중입니다! 지시를 따라주세요.", "#ffeb3b"); 
    document.getElementById('study-screen').style.display = 'none'; 
    document.getElementById('title-screen').style.display = 'flex'; 
}

function renderStudyData() {
    const content = document.getElementById('study-content');
    if (!content) return;
    content.innerHTML = "";
    
    let filteredStudy = studyBank.filter(item => {
        let matchG = (curStudyGrade === 'all' || item.grade === curStudyGrade);
        let matchS = (curStudySubject === 'all' || item.subject === curStudySubject);
        let matchSem = true;
        
        if (curStudySemester === '1학기') matchSem = item.chapter.includes('1학기') || item.chapter.includes('보완');
        else if (curStudySemester === '2학기') matchSem = item.chapter.includes('2학기');
        
        return matchG && matchS && matchSem;
    });
    
    if (filteredStudy.length === 0) {
        content.innerHTML = "<p style='text-align:center; margin-top: 20px; color:#bdc3c7;'>해당 조건의 데이터가 없습니다.</p>"; 
        return;
    }

    let chapters = [...new Set(filteredStudy.map(item => item.chapter))];

    chapters.forEach(c => {
        let chapItems = filteredStudy.filter(item => item.chapter === c);
        let units = [...new Set(chapItems.map(item => item.unit))];

        let cleanChapter = c.replace(/^(?:\[[0-9]학기\]\s*|(?:[0-9]학기|보완)\s*)[0-9]+\.\s*/, '').replace(/^보완\.\s*/, ''); 
        
        let header = document.createElement('div'); 
        header.className = 'category-header'; 
        header.innerHTML = `<span style="flex:1;">[대단원] ${cleanChapter}</span> <span class="toggle-icon">▼</span>`;
        
        let list = document.createElement('div'); 
        list.className = 'category-content';
        list.style.display = "none";
        list.style.padding = "15px 10px";
        list.style.backgroundColor = "#1e2b38";
        list.style.border = "2px solid #e65100";
        list.style.borderTop = "none";
        list.style.borderRadius = "0 0 8px 8px";
        list.style.marginTop = "0";
        
        units.forEach(u => {
            let targetContainer = list;
            let isScienceOrNoSub = (u === '기본');

            if (!isScienceOrNoSub) {
                let unitHeader = document.createElement('div');
                unitHeader.className = 'category-header';
                unitHeader.style.backgroundColor = "#e67e22"; 
                unitHeader.style.marginTop = "0";
                unitHeader.style.marginBottom = "5px";
                unitHeader.style.padding = "12px";
                unitHeader.innerHTML = `<span style="flex:1;">[소단원] ${u}</span> <span class="toggle-icon">▼</span>`;

                let unitContent = document.createElement('div');
                unitContent.className = 'category-content';
                unitContent.style.borderColor = "#e67e22";
                unitContent.style.display = "none";

                unitHeader.onclick = function(e) {
                    e.stopPropagation();
                    if(unitContent.style.display === 'block') {
                        unitContent.style.display = 'none';
                        this.querySelector('.toggle-icon').innerText = "▼";
                    } else {
                        unitContent.style.display = 'block';
                        this.querySelector('.toggle-icon').innerText = "▲";
                    }
                };

                targetContainer.appendChild(unitHeader);
                targetContainer.appendChild(unitContent);
                targetContainer = unitContent;
            }

            chapItems.filter(item => item.unit === u).forEach(item => {
                let studyItem = document.createElement('div'); 
                studyItem.className = 'study-item';
                
                let keywordDiv = document.createElement('div');
                keywordDiv.className = 'study-keyword';
                keywordDiv.innerHTML = `<span>[핵심개념] ${item.keyword}</span> <span class="toggle-icon">+</span>`;

                let descDiv = document.createElement('div');
                descDiv.className = 'study-desc';
                let formattedDesc = item.desc.replace(/\(차시: (.*?)\)$/, '<br><br><span style="color:#ffb74d; font-size:0.85rem;">※ 출처: $1</span>');
                descDiv.innerHTML = formattedDesc;

                keywordDiv.onclick = function(e) {
                    e.stopPropagation();
                    if(descDiv.style.display === 'block') {
                        descDiv.style.display = 'none';
                        this.querySelector('.toggle-icon').innerText = "+";
                        this.style.color = "#4dd0e1";
                    } else {
                        descDiv.style.display = 'block';
                        this.querySelector('.toggle-icon').innerText = "-";
                        this.style.color = "#ffd700";
                    }
                };

                studyItem.appendChild(keywordDiv);
                studyItem.appendChild(descDiv);
                targetContainer.appendChild(studyItem);
            });
        });
        
        header.onclick = function() {
            if(list.style.display === 'block') { 
                list.style.display = 'none'; 
                this.querySelector('.toggle-icon').innerText = "▼";
            } 
            else { 
                list.style.display = 'block'; 
                this.querySelector('.toggle-icon').innerText = "▲";
            }
        };
        content.appendChild(header); 
        content.appendChild(list);
    });
}