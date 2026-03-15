const tutorialScripts = [
    /* 0 */ "환영합니다!\n지식 타워 RPG에 오신 것을 환영합니다.\n이 게임은 <span class='hlt'>사회/과학 지식</span>으로 방해꾼을 물리치며 탑을 오르는 게임입니다.",
    /* 1 */ "먼저 화면 상단의 <span class='hlt'>[상태창]</span>을 볼까요?\n\n<span class='hlt-cyan'>[집중력]</span>: 여러분이 버틸 수 있는 체력입니다.\n<span class='hlt-cyan'>[기억력]</span>: 퀴즈를 맞혔을 때 방해꾼을 약화시키는 힘입니다.",
    /* 2 */ "앗! 학습 방해꾼이 나타났습니다! (꒪⌓꒪)\n도전이 어떻게 진행되는지 직접 체험해 볼까요?\n\n(아래 <span class='hlt'>'다음'</span> 버튼을 누르세요.)",
    /* 3 */ "방해꾼의 유혹을 이겨내려면 지식 문제를 맞혀야 합니다.\n\n자, 노랗게 빛나는 정답 <span class='hlt'>[1. 이성계]</span>를 직접 클릭해 보세요!",
    /* 4 */ "훌륭합니다! 방해꾼을 물리치면 <span class='hlt'>학습 보상</span>을 얻을 수 있습니다.",
    /* 5 */ "(실제 게임에서는 <span class='hlt-cyan'>3개의 무작위 보상</span>이 나오며, 그 중 나에게 필요한 <span class='hlt-cyan'>1개를 신중하게 선택</span>해야 합니다!)",
    /* 6 */ "자, 화면에 나타난 <span class='hlt'>[깜짝 장학금]</span> 보상 카드를 직접 클릭해서 획득해 보세요!",
    /* 7 */ "보상을 얻고 나면 <span class='hlt'>[휴식 및 정비 공간]</span>으로 돌아옵니다.\n\n방금 받은 용돈으로 아이템을 사볼까요?\n노랗게 빛나는 <span class='hlt'>[아이템 구매]</span> 버튼을 눌러보세요.",
    /* 8 */ "상점이 열렸습니다!\n<span class='hlt'>[철벽 백과사전]</span>을 직접 클릭해서 구매해 보세요.\n(방해꾼의 훼방을 막아줍니다)",
    /* 9 */ "좋습니다!\n이번에는 <span class='hlt'>[캐릭터 변경 및 구매]</span> 버튼을 눌러 옷장을 열어보세요.",
    /* 10 */ "새로운 캐릭터인 <span class='hlt'>[모범생]</span> 스킨의 <span class='hlt'>[장착]</span> 버튼을 눌러보세요!",
    /* 11 */ "잘하셨습니다!\n마지막으로 <span class='hlt'>[내 가방]</span>을 열어 구매한 아이템과 상태를 확인해 보세요.",
    /* 12 */ "가방에 방금 구매한 백과사전이 들어있군요!\n확인했으면 아래의 <span class='hlt'>[닫기]</span> 버튼을 눌러주세요.",
    /* 13 */ "문제가 너무 어렵다면 어떻게 하냐고요?\n메인 화면의 <span class='hlt'>[공부하기]</span> 메뉴를 활용해 보세요!\n\n화면에 보이는 지식 노트의 <span class='hlt'>[항목]</span>을 직접 클릭해서 내용을 확인해 보세요.",
    /* 14 */ "튜토리얼 완료!\n이제 모든 준비가 끝났습니다.\n\n그럼, 실전에서 만나요! 파이팅!"
];

const ITEM_DB = {
    revive: { name: "마법의 지우개", desc: "집중력 바닥날 때 절반 회복 후 부활", isPassive: false },
    shield: { name: "철벽 백과사전", desc: "다음 1회 방해꾼의 훼방 막아냄", isPassive: false },
    powerUp: { name: "마법의 형광펜", desc: "다음 2번 정답의 힘 상승", isPassive: false },
    weaken: { name: "초집중 귀마개", desc: "다음 2번 방해꾼의 방해를 절반으로 줄임", isPassive: false },
    armorBreak: { name: "족집게 빨간펜", desc: "다음 2번 정답의 힘 1.5배 상승", isPassive: false },
    boss_art_1: { name: "전설의 금동대향로", desc: "매 층 클리어 시 체력 15 자동 회복", isPassive: true },
    boss_art_2: { name: "성웅의 난중일기", desc: "기억력 +25 영구 상승", isPassive: true },
    boss_art_3: { name: "수호자의 방패", desc: "훼방 피하기 확률 +15% 영구 상승", isPassive: true },
    boss_art_4: { name: "왕의 어보", desc: "매 층 클리어 시 추가 용돈 20G 획득", isPassive: true },
    boss_art_5: { name: "천상열차분야지도", desc: "최대 집중력 +50, 기억력 +10 상승", isPassive: true },
    boss_art_6: { name: "팔만대장경", desc: "훼방 피하기 확률 +20% 영구 상승", isPassive: true },
    boss_art_7: { name: "훈민정음 해례본", desc: "기억력 +40 영구 상승", isPassive: true },
    boss_art_8: { name: "거북선 모형", desc: "매 층 백과사전(방어) 1회 자동 충전", isPassive: true },
    boss_art_9: { name: "앙부일구", desc: "매 층 형광펜(공격강화) 1회 자동 충전", isPassive: true },
    boss_art_10: { name: "비파형 동검", desc: "기억력 +50 영구 상승", isPassive: true },
    boss_art_11: { name: "신라 금관", desc: "매 층 클리어 시 추가 용돈 50G 획득", isPassive: true },
    boss_art_12: { name: "청자 매병", desc: "초콜릿 10개, 지우개 3개 획득", isPassive: true },
    boss_art_13: { name: "직지심체요절", desc: "최대 집중력 +100 영구 상승", isPassive: true },
    boss_art_14: { name: "동의보감", desc: "매 층 클리어 시 집중력 30 자동 회복", isPassive: true }
};

const TIER_COLORS = { normal: "#bdc3c7", rare: "#4fc3f7", unique: "#ce93d8", hidden: "#ffb74d", legend: "#ff1744" };
const TIER_NAMES = { normal: "[노멀]", rare: "[레어]", unique: "[유니크]", hidden: "[히든]", legend: "[전설]" };

const PLAYER_CHARS = [
    { id: "char_01", name: "일반학생", tier: "normal", icon: ["(・_・)", "(・o・)"], price: 0, anim: "eye" },
    { id: "char_02", name: "모범생", tier: "normal", icon: ["(⌐■_■)", "(⌐■-■)"], price: 50, anim: "bounce" },
    { id: "char_03", name: "열공!열공!", tier: "normal", icon: ["(ง •̀_•́)ง", "(ง'̀-'́)ง"], price: 100, anim: "arm" },
    { id: "char_04", name: "감기걸림", tier: "normal", icon: ["(－‸ლ)", "(－.ლ)"], price: 100, anim: "eye" },
    { id: "char_05", name: "신입생", tier: "normal", icon: ["(❁´◡`❁)", "(❁´▽`❁)"], price: 150, anim: "bounce" },
    { id: "char_06", name: "배탈난학생", tier: "normal", icon: ["(ꐦ ಠ皿ಠ )", "(ꐦ ಠoಠ )"], price: 200, anim: "arm" }, 
    { id: "char_07", name: "벼락치기", tier: "rare", icon: ["٩(ˊᗜˋ*)و", "٩(ˊOˋ*)و"], price: 250, anim: "bounce" },
    { id: "char_08", name: "헤이헤이", tier: "rare", icon: ["[ -_ - ]y", "[ -o - ]y"], price: 300, anim: "eye" },
    { id: "char_09", name: "졸려요", tier: "rare", icon: ["(*´﹃｀*)", "(*´O｀*)"], price: 300, anim: "eye" },
    { id: "char_10", name: "급식전문가", tier: "rare", icon: ["ᕙ(⇀‸↼‶)ᕗ", "ᕙ(⇀O↼‶)ᕗ"], price: 400, anim: "arm" },
    { id: "char_11", name: "전교 1등", tier: "rare", icon: ["(๑˃̵ᴗ˂̵)و", "(๑˃̵O˂̵)و"], price: 500, anim: "bounce" },
    { id: "char_12", name: "곰돌이", tier: "unique", icon: ["ʕ•ᴥ•ʔ", "ʕ•O•ʔ"], price: 600, anim: "swing" },
    { id: "char_13", name: "고양이", tier: "unique", icon: ["/ᐠ｡ꞈ｡ᐟ\\", "/ᐠ｡O｡ᐟ\\"], price: 600, anim: "swing" },
    { id: "char_14", name: "외계인", tier: "unique", icon: ["(V)(OᴥO)(V)", "(V)(O0O)(V)"], price: 700, anim: "bounce", bgm: "hub_alien" },
    { id: "char_15", name: "로봇", tier: "unique", icon: ["┌( ಠ_ಠ)┘", "┌( ಠoಠ)┘"], price: 700, anim: "arm" },
    { id: "char_16", name: "마법사", tier: "unique", icon: ["༼ つ ◕_◕ ༽つ", "༼ つ ◕o◕ ༽つ"], price: 800, anim: "bounce", bgm: "hub_magic" },
    { id: "char_17", name: "유도부", tier: "unique", icon: ["(ง'̀-'́)ง", "(ง'̀o'́)ง"], price: 800, anim: "arm" },
    { id: "char_18", name: "올빼미", tier: "unique", icon: ["[ ☾_☽ ]", "[ ☾o☽ ]"], price: 900, anim: "eye", bgm: "hub_ninja" }, 
    { id: "char_19", name: "용사", tier: "unique", icon: ["[ ★_★ ]", "[ ★ o ★ ]"], price: 1000, anim: "bounce", bgm: "hub_legend" },
    { id: "char_20", name: "맑눈광", tier: "unique", icon: ["( ⚆ _ ⚆ )", "( ⚆ o ⚆ )"], price: 1500, anim: "eye", bgm: "hub_zen" },
    { id: "hidden_01", name: "정복자", tier: "hidden", icon: ["▶━[ 炎_炎 ]━◀", "▷━[ 炎O炎 ]━◁"], price: -1, anim: "bounce", bgm: "hub_master", unlockDesc: "최고 기록 20층 도달 시 해금" },
    { id: "hidden_02", name: "갑부", tier: "hidden", icon: ["$$ [ ₩_₩ ] $$", "￦￦ [ $O$ ] ￦￦"], price: -1, anim: "bounce", bgm: "hub_rich", unlockDesc: "누적 특별 용돈 1,000G 획득 시 해금" },
    { id: "hidden_03", name: "초코덕후", tier: "hidden", icon: ["■■ ( ´﹃｀)", "□■ ( º﹃ º)"], price: -1, anim: "bounce", bgm: "hub_sweet", unlockDesc: "초콜릿 누적 10회 냠냠 시 해금" },
    { id: "hidden_04", name: "오답달인", tier: "hidden", icon: ["✘_✘ [ ?_? ] ✘_✘", "✖_✖ [ !O! ] ✖_✖"], price: -1, anim: "bounce", bgm: "hub_study", unlockDesc: "문제 누적 10회 오답 시 해금" },
    { id: "hidden_05", name: "방랑자", tier: "hidden", icon: ["彡 ≈(-_-)≈ 彡", "彡 ~~(0_0)~~ 彡"], price: -1, anim: "swing", bgm: "hub_wind", unlockDesc: "방해꾼의 훼방 누적 10회 피할 시 해금" },
    { id: "hard_01", name: "불굴의 도전자", tier: "hidden", icon: ["炎 ᕙ( Ò﹏Ó)ᕗ 炎", "焱 ᕙ( Ò0Ó)ᕗ 焱"], price: -1, anim: "bounce", bgm: "hub_hard_1", unlockDesc: "하드 모드 10층 도달 시 해금" },
    { id: "hard_02", name: "고독한 현자", tier: "hidden", icon: ["✦ ꧁( ఠ_ఠ )꧂ ✦", "✧ ꧁( ఠoఠ )꧂ ✧"], price: -1, anim: "eye", bgm: "hub_hard_2", unlockDesc: "하드 모드 15층 도달 시 해금" },
    { id: "hard_03", name: "심연의 지배자", tier: "hidden", icon: ["▼ ◤( ◣_◢ )◥ ▼", "▲ ◣( ◣0◢ )◢ ▲"], price: -1, anim: "swing", bgm: "hub_hard_3", unlockDesc: "하드 모드 20층 도달 시 해금" },
    { id: "hard_04", name: "역사 마스터", tier: "hidden", icon: ["[≡] ✧( ⊡_⊡ )✧ [≡]", "(=) ✦( ⊡O⊡ )✦ (=)"], price: -1, anim: "bounce", bgm: "hub_hard_4", unlockDesc: "하드 모드 25층 도달 시 해금" },
    { id: "hard_05", name: "타워의 전설", tier: "hidden", icon: ["[★] ꧁( ✪_✪ )꧂ [★]", "[☆] ꧁( ✪O✪ )꧂ [☆]"], price: -1, anim: "bounce", bgm: "hub_hard_5", unlockDesc: "하드 모드 30층 도달 시 해금" },
    { id: "legend_01", name: "컬렉터 마스터", tier: "legend", icon: ["[★] ✧( ♛_♛ )✧ [★]", "[☆] ✦( ♛O♛ )✦ [☆]"], price: -1, anim: "bounce", bgm: "hub_leg_all", unlockDesc: "모든 일반/히든 스킨 수집 시 해금" },
    { id: "legend_02", name: "타워 정복자", tier: "legend", icon: ["[♖] ꧁( ⏣_⏣ )꧂ [♜]", "[♜] ꧁( ⏣O⏣ )꧂ [♖]"], price: -1, anim: "bounce", bgm: "hub_leg_nm", unlockDesc: "보통 모드 100층 도달 시 해금" },
    { id: "legend_03", name: "불멸의 신", tier: "legend", icon: ["[❂] ◤( 炎O炎 )◥ [❂]", "[♨] ◣( 炎_炎 )◢ [♨]"], price: -1, anim: "swing", bgm: "hub_leg_hd", unlockDesc: "하드 모드 100층 도달 시 해금" }
];

const NORMAL_MONSTERS = [
    { name: "망각의 구름", icon: ["(꒪⌓꒪)", "(꒪0꒪)"] }, { name: "게으름 요정", icon: ["[ `皿´ ]", "[ `O´ ]"] },
    { name: "졸음 양", icon: ["(=_=)zZ", "(-_-)zZ"] }, { name: "딴짓 슬라임", icon: ["< 0_0 >", "< 0-0 >"] },
    { name: "혼란의 바람", icon: ["^/_\\^", "^\\_/^"] }, { name: "핑계쟁이 앵무새", icon: ["(▼皿▼)", "(▼O▼)"] },
    { name: "잡념 먼지", icon: ["/\\(O_O)/\\", "\\/(O_O)\\/"] }, { name: "오답 유도꾼", icon: ["( ಠ_ಠ)", "( ಠoಠ)"] },
    { name: "기억 도둑", icon: ["(￢_￢)", "(￢o￢)"] }, { name: "무기력 그림자", icon: ["[ × _ × ]", "[ × o × ]"] }
];

const BOSS_MONSTERS = [
    { name: "[보스] 나태의 장벽", icon: ["[ ■ _ ■ ]", "[ ■ o ■ ]"] }, { name: "[보스] 스마트폰 유혹", icon: ["[=□_□=]", "[=□o□=]"] },
    { name: "[보스] 혼돈의 폭풍", icon: ["( ╬ Ò ‸ Ó)", "( ╬ Ò 0 Ó)"] }, { name: "[보스] 왜곡의 거울", icon: ["|˚–˚|", "|˚O˚|"] },
    { name: "[보스] 무지의 안개", icon: ["( ╰ _ ╯ )", "( ╰ o ╯ )"] }, { name: "[보스] 개념 지우개", icon: ["( 炎 _ 炎 )", "( 炎 o 炎 )"] },
    { name: "[보스] 시간 낭비꾼", icon: ["( ﾟДﾟ;)", "( ﾟOﾟ;)"] }, { name: "[보스] 망각의 늪", icon: ["[  ∞  ]", "[  8  ]"] },
    { name: "[보스] 피노키오", icon: ["( 눈 _ 눈 )", "( 눈 o 눈 )"] }, { name: "[보스] 백지화 현상", icon: ["( ꒪o꒪ )", "( ꒪0꒪ )"] }
];

const ELITE_MONSTERS = [
    { name: "벼락치기 함정", icon: ["( ✧ _ ✧ )", "( ✧ o ✧ )"] }, { name: "수면 마법사", icon: ["( ˘ω˘ )zZ", "( -ω- )zZ"] },
    { name: "도파민 함정", icon: ["( O _ O )", "( O 0 O )"] }, { name: "숏폼 요정", icon: ["( > ▽ < )", "( > O < )"] },
    { name: "집중력 브레이커", icon: ["( ╯°□°)╯", "( ╯°O°)╯"] }
];

const MELODIES = {
    title: { notes: [261.6, 293.7, 329.6, 261.6, 261.6, 293.7, 329.6, 261.6, 349.2, 392.0, 440.0, 349.2, 349.2, 392.0, 440.0, 349.2, 0, 0, 0, 0], tempo: 360, vol: 0.04 },
    hub: { notes: [220.0, 261.6, 329.6, 261.6, 220.0, 261.6, 329.6, 261.6, 196.0, 246.9, 293.7, 261.6, 196.0, 246.9, 293.7, 261.6, 0, 0, 0, 0], tempo: 400, vol: 0.04 },
    hub_alien: { notes: [349.2, 466.2, 349.2, 233.1, 0, 466.2, 233.1, 0, 0, 0], tempo: 250, vol: 0.04 }, 
    hub_magic: { notes: [329.6, 440.0, 523.3, 659.3, 0, 523.3, 440.0, 0, 0, 0], tempo: 400, vol: 0.04 }, 
    hub_ninja: { notes: [440.0, 0, 415.3, 0, 440.0, 0, 329.6, 0, 0, 0], tempo: 300, vol: 0.04 }, 
    hub_legend: { notes: [523.3, 0, 392.0, 0, 523.3, 0, 659.3, 0, 0, 0], tempo: 350, vol: 0.04 }, 
    hub_zen: { notes: [261.6, 293.7, 329.6, 392.0, 440.0, 0, 0, 0, 0, 0], tempo: 600, vol: 0.04 }, 
    hub_master: { notes: [523.3, 0, 659.3, 0, 784.0, 0, 1046.5, 0, 0, 0, 0], tempo: 500, vol: 0.04 },
    hub_rich: { notes: [392.0, 0, 493.9, 0, 587.3, 0, 784.0, 0, 0, 0, 0], tempo: 450, vol: 0.04 },
    hub_sweet: { notes: [523.3, 0, 587.3, 0, 659.3, 0, 0, 0, 0, 0], tempo: 500, vol: 0.04 },
    hub_study: { notes: [329.6, 0, 0, 0, 440.0, 0, 0, 0, 0, 0], tempo: 600, vol: 0.04 },
    hub_wind: { notes: [659.3, 0, 0, 0, 587.3, 0, 0, 0, 0, 0], tempo: 550, vol: 0.04 },
    hub_hard_1: { notes: [293.7, 329.6, 349.2, 0, 392.0, 0, 349.2, 0, 0, 0, 0], tempo: 300, vol: 0.04 },
    hub_hard_2: { notes: [220.0, 0, 261.6, 0, 329.6, 0, 440.0, 0, 0, 0, 0], tempo: 400, vol: 0.04 },
    hub_hard_3: { notes: [196.0, 220.0, 246.9, 0, 261.6, 0, 246.9, 0, 0, 0, 0], tempo: 250, vol: 0.04 },
    hub_hard_4: { notes: [523.3, 392.0, 440.0, 349.2, 0, 0, 0, 0, 0, 0], tempo: 350, vol: 0.04 },
    hub_hard_5: { notes: [659.3, 0, 523.3, 0, 784.0, 0, 1046.5, 0, 0, 0, 0], tempo: 450, vol: 0.04 },
    hub_leg_all: { notes: [523.3, 659.3, 784.0, 1046.5, 784.0, 659.3, 523.3, 0, 0, 0, 0], tempo: 250, vol: 0.05 },
    hub_leg_nm: { notes: [440.0, 523.3, 659.3, 880.0, 0, 0, 0, 0, 0], tempo: 300, vol: 0.05 },
    hub_leg_hd: { notes: [349.2, 466.2, 523.3, 698.4, 0, 0, 0, 0, 0], tempo: 350, vol: 0.05 },
    normal: { notes: [261.6, 0, 329.6, 0, 392.0, 0, 329.6, 0, 349.2, 0, 293.7, 0, 440.0, 0, 349.2, 0, 0, 0, 0, 0], tempo: 320, vol: 0.04 },
    elite: { notes: [293.7, 349.2, 440.0, 349.2, 293.7, 349.2, 440.0, 349.2, 329.6, 392.0, 493.9, 392.0, 329.6, 392.0, 493.9, 392.0, 0, 0, 0, 0], tempo: 300, vol: 0.04 },
    boss: { notes: [130.8, 0, 130.8, 0, 155.6, 0, 155.6, 0, 196.0, 0, 196.0, 0, 155.6, 0, 155.6, 0, 0, 0, 0], tempo: 400, vol: 0.05 },
    danger: { notes: [329.6, 0, 0, 0, 311.1, 0, 0, 0, 329.6, 0, 0, 0, 311.1, 0, 0, 0, 0, 0, 0], tempo: 280, vol: 0.04 },
    victory: { notes: [261.6, 329.6, 392.0, 523.3, 0, 0, 0, 0], tempo: 300, vol: 0.05 },
    gameover: { notes: [392.0, 329.6, 261.6, 196.0, 0, 0, 0, 0], tempo: 600, vol: 0.05 }
};

const NORMAL_REWARD_CARDS = [
    { id: "gold_sm", icon: "[용돈]", title: "소소한 용돈", desc: "특별 용돈 15G 획득", action: () => { player.gold += 15; addLog("[보상] 15G를 얻었습니다.", "#ffd700"); updateUI(); return 'normal'; } },
    { id: "heal_sm", icon: "[휴식]", title: "잠깐의 휴식", desc: "집중력 20 회복", action: () => { player.hp = Math.min(player.maxHp, player.hp + 20); addLog("[보상] 집중력을 20 회복했습니다.", "#a5d6a7"); updateUI(); return 'normal'; } },
    { id: "item_pot", icon: "[간식]", title: "당충전 초콜릿", desc: "초콜릿 1개 획득", action: () => { player.potions++; addLog("[보상] 초콜릿을 1개 얻었습니다.", "#ffb74d"); updateUI(); return 'normal'; } },
    { id: "encounter_elite", icon: "[위험]", title: "수상한 기운", desc: "정예 방해꾼과 바로 마주칩니다.", action: () => { addLog("[위험] 수상한 기운에 이끌려 정예 방해꾼과 전투를 시작합니다!", "#ff5252"); return 'elite_encounter'; } },
    { id: "evasion_up", icon: "[회피]", title: "날렵한 몸놀림", desc: "훼방 피하기 확률 2% 영구 증가", action: () => { player.evasion += 2; addLog("[보상] 훼방 피하기 확률이 2% 올랐습니다.", "#81c784"); updateUI(); return 'normal'; } },
    { id: "random_item_1", icon: "[선물]", title: "의문의 보따리", desc: "무작위 소모품 1개 획득", action: () => { 
        const items = Object.keys(ITEM_DB).filter(k => !ITEM_DB[k].isPassive); 
        const rndItem = items[Math.floor(Math.random() * items.length)]; 
        player.inventory[rndItem] = (player.inventory[rndItem] || 0) + 1; 
        addLog(`[보상] 무작위 아이템 '${ITEM_DB[rndItem].name}' 획득!`, "#4dd0e1"); 
        updateUI(); return 'normal'; 
    } },
    { id: "maxhp_up", icon: "[성장]", title: "작은 깨달음", desc: "최대 집중력 5 증가", action: () => { player.maxHp += 5; player.hp += 5; addLog("[보상] 최대 집중력이 5 올랐습니다.", "#a5d6a7"); updateUI(); return 'normal'; } },
    { id: "atk_up", icon: "[기억]", title: "연필 깎기", desc: "기억력 1 영구 증가", action: () => { player.baseAtk += 1; addLog("[보상] 기억력이 1 올랐습니다.", "#ffd700"); updateUI(); return 'normal'; } },
    { id: "risk_gold", icon: "[도전]", title: "과감한 도전", desc: "집중력 15 감소, 대신 35G 획득", action: () => { player.hp = Math.max(1, player.hp - 15); player.gold += 35; addLog("[보상] 집중력을 잃었지만 35G를 얻었습니다.", "#f39c12"); updateUI(); return 'normal'; } }
];

const ELITE_REWARD_CARDS = [
    { id: "gold_md", icon: "[장학금]", title: "우수 장학금", desc: "특별 용돈 40G 획득", action: () => { player.gold += 40; addLog("[보상] 40G를 얻었습니다.", "#ffd700"); updateUI(); return 'elite'; } },
    { id: "heal_md", icon: "[대휴식]", title: "꿀맛 같은 휴식", desc: "집중력 50 회복", action: () => { player.hp = Math.min(player.maxHp, player.hp + 50); addLog("[보상] 집중력을 50 회복했습니다.", "#a5d6a7"); updateUI(); return 'elite'; } },
    { id: "atk_up_md", icon: "[큰기억]", title: "새로운 필기구", desc: "기억력 3 영구 증가", action: () => { player.baseAtk += 3; addLog("[보상] 기억력이 3 올랐습니다.", "#ffd700"); updateUI(); return 'elite'; } },
    { id: "random_items_3", icon: "[보물]", title: "호화로운 보따리", desc: "무작위 소모품 3개 획득", action: () => { 
        const items = Object.keys(ITEM_DB).filter(k => !ITEM_DB[k].isPassive); 
        let getLog = []; 
        for(let i=0; i<3; i++) { 
            const rndItem = items[Math.floor(Math.random() * items.length)]; 
            player.inventory[rndItem] = (player.inventory[rndItem] || 0) + 1; 
            getLog.push(ITEM_DB[rndItem].name); 
        } 
        addLog(`[보상] 무작위 아이템 3개 획득! (${getLog.join(', ')})`, "#b388ff"); 
        updateUI(); return 'elite'; 
    } },
    { id: "evasion_up_md", icon: "[대회피]", title: "환상적인 몸놀림", desc: "훼방 피하기 확률 3% 영구 증가", action: () => { 
        player.evasion += 3; 
        addLog("[보상] 훼방 피하기 확률이 3% 올랐습니다.", "#81c784"); 
        updateUI(); return 'elite'; 
    } },
    { id: "encounter_elite_md", icon: "[대위험]", title: "끝나지 않은 위협", desc: "정예 방해꾼과 한 번 더 마주칩니다.", action: () => { 
        addLog("[위험] 숨돌릴 틈 없이 정예 방해꾼이 나타났습니다!", "#ff5252"); 
        return 'elite_encounter'; 
    } }
];

const BOSS_REWARD_CARDS = Object.keys(ITEM_DB).filter(k => ITEM_DB[k].isPassive).map(k => {
    return {
        id: k,
        icon: "[유물]",
        title: ITEM_DB[k].name,
        desc: ITEM_DB[k].desc,
        action: () => {
            player.inventory[k] = (player.inventory[k] || 0) + 1;
            addLog(`[보스 보상] 전설의 유물 '${ITEM_DB[k].name}' 획득!`, "#ff4081");
            updateUI();
            return 'boss';
        }
    };
});

BOSS_REWARD_CARDS.push({ id: "boss_gold", icon: "[대상]", title: "도전 골든벨", desc: "특별 용돈 150G 획득", action: () => { player.gold += 150; addLog("[보스 보상] 엄청난 용돈 150G 획득!", "#ffd700"); updateUI(); return 'boss'; } });
BOSS_REWARD_CARDS.push({ id: "boss_hp", icon: "[성장]", title: "만점 비법서", desc: "최대 집중력 50 증가", action: () => { player.maxHp += 50; player.hp += 50; addLog("[보스 보상] 최대 집중력이 50 증가했습니다!", "#a5d6a7"); updateUI(); return 'boss'; } });