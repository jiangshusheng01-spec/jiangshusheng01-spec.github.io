import {unitEvidenceReady,nextFoundationRoute,soundGroups,soundGroupFor,groupedLessons,targetWeakness,requiresQuestionAudio,recordingNeedsHelp,foundationStages,skillNames,foundationScope,makeFoundationPlan,taskSkill,evaluateEvidence,alphabet,sounds,lessons,meanings,wordFamilies,knownAt,wordsAt,shuffle,mastery,plan,blendWord,isRealWord,mouthShapes,sosVideos,FOUR_PHASES,lessonForSession} from './data.js';
const $=s=>document.querySelector(s),app=$('#app');
const KEY='little-sprout-v1';
let selectedStage=1,stageFocus='s',expansionLesson=7;
const defaults={autoContinue:true,unitProgress:{},foundationRecords:[],skillStats:{},exposed:[],name:'小芽',lesson:0,completed:[],lessonPhases:{},stats:{},sessions:[],length:12,voice:true,btHelp:0,familyMade:{}};
let selectedFamily='at',familyWord=null;
let state;try{state={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{state={...defaults}}
let paused=null,autoTimer=null,autoLaunch=null;
let page='home',session=null,questionIndex=0,locked=false,hinted=false,failed=false,spell=[],recorder=null,stream=null,recordUrl=null,recordBlob=null,recordTimer=null,recordStarted=0,recordBusy=false,playing=null,playingDone=null,speechDone=null,playVersion=0,audioDB=null,apiStatus={deepseek:false};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',book:'<path d="M12 5v16M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',play:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="m10 8 6 4-6 4Z"/>',plant:'<path d="M12 22V10M12 15C4 16 2 10 3 5c7-1 10 3 9 10Zm0-5c0-6 4-9 9-8 1 6-3 9-9 8Z"/>',settings:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',blocks:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>'};
const svg=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[k]}</svg>`;

// ---------- 嘴型动画 ----------
// 简笔画正面嘴型：按音素参数驱动；真人嘴型用爱荷华大学 Sounds of Speech 的 mp4 直播（需联网）。
function mouthSvg(){return `<svg class="mouth" viewBox="0 0 120 96" width="108" height="86" aria-hidden="true"><ellipse class="m-lip" cx="60" cy="54" rx="31" ry="14" fill="#f6c9c0" stroke="#d98a7a" stroke-width="2"/><ellipse class="m-open" cx="60" cy="54" rx="24" ry="3" fill="#5b2a2a"/><rect class="m-teeth" x="40" y="46" width="40" height="11" rx="3" fill="#fff" stroke="#ddd" opacity="0"/><ellipse class="m-tongue" cx="60" cy="66" rx="14" ry="5" fill="#e78a8a" opacity="0"/><g class="m-air" opacity="0"><circle cx="60" cy="28" r="2.5" fill="#7fb3d5"/><circle cx="48" cy="24" r="2" fill="#7fb3d5"/><circle cx="72" cy="24" r="2" fill="#7fb3d5"/></g></svg>`}
function mouthAnim(box,p,durMs){
 const open=box.querySelector('.m-open'),lip=box.querySelector('.m-lip'),teeth=box.querySelector('.m-teeth'),tongue=box.querySelector('.m-tongue'),air=box.querySelector('.m-air');
 if(!open||!p)return;
 const rxT=14+20*p.width*(1-0.3*p.round),ryT=4+22*p.jaw,rx0=p.closed?10:24,ry0=p.closed?2:3;
 const up=220,hold=durMs||500,down=220,pre=p.closed?180:0,t0=performance.now();
 function frame(now){
  let t=now-t0,rx=rx0,ry=ry0,tOp=0,tgOp=0,tgCy=66,aOp=0;
  if(t>=pre){
   t-=pre;
   if(t<up){const k=t/up;rx=rx0+(rxT-rx0)*k;ry=ry0+(ryT-ry0)*k}
   else if(t<up+hold){rx=rxT;ry=ryT;tOp=p.teeth;tgOp=p.tongue;tgCy=p.tongue?48:66;aOp=p.air}
   else if(t<up+hold+down){const k=1-(t-up-hold)/down;rx=rx0+(rxT-rx0)*k;ry=ry0+(ryT-ry0)*k;tOp=p.teeth*k;tgOp=p.tongue*k;aOp=p.air*k}
   else{open.setAttribute('rx',24);open.setAttribute('ry',3);lip.setAttribute('rx',31);lip.setAttribute('ry',14);teeth.setAttribute('opacity',0);tongue.setAttribute('opacity',0);tongue.setAttribute('cy',66);air.setAttribute('opacity',0);return}
  }
  open.setAttribute('rx',rx.toFixed(1));open.setAttribute('ry',ry.toFixed(1));
  lip.setAttribute('rx',(rx+7).toFixed(1));lip.setAttribute('ry',(ry+11).toFixed(1));
  teeth.setAttribute('opacity',tOp);tongue.setAttribute('opacity',tgOp);tongue.setAttribute('cy',tgCy);
  air.setAttribute('opacity',aOp);
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
}
function mouthBlock(letter){
 const p=mouthShapes[letter];if(!p)return '';
 const vids=sosVideos(letter);
 return `<div class="mouth-box">${mouthSvg()}<div><p class="mouth-note">看哪里：${p.note}</p><button class="secondary small" data-mouth="${letter}">👄 看嘴型</button></div></div>${vids.length?`<details class="sos-videos"><summary>🎥 真人嘴型 · 爱荷华大学 Sounds of Speech（需联网）</summary>${vids.map(v=>`<figure><video class="${v.kind}" src="${v.url}" preload="none" playsinline controls loop></video><figcaption>${v.label}</figcaption></figure>`).join('')}</details>`:`<p class="muted">真人嘴型：这个音在 Sounds of Speech 站里没有视频，先看上面的简笔画。</p>`}`;
}
function bindMouth(root=document){root.querySelectorAll('[data-mouth]').forEach(b=>{if(b.dataset.mouthBound)return;b.dataset.mouthBound='1';b.onclick=()=>{const box=b.closest('.mouth-box');if(!box)return;const p=mouthShapes[b.dataset.mouth];mouthAnim(box,p,900);setTimeout(()=>mouthAnim(box,p,900),1600)}})}
const day=()=>new Date().toLocaleDateString('sv-SE');
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{toast('存储空间不足，请先导出学习记录。')}};
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',4000)}
function speak(text,lang='zh-CN',force=false){
 if((!state.voice&&!force)||!('speechSynthesis'in window))return Promise.resolve(false);
 if(!speechSynthesis.getVoices().length){return new Promise(res=>{let done=false;const to=setTimeout(()=>{if(!done){done=true;speak(text,lang,force).then(res)}},1500);speechSynthesis.addEventListener('voiceschanged',()=>{if(!done){done=true;clearTimeout(to);speak(text,lang,force).then(res)}},{once:true})})}
 if(speechDone)speechDone(false);speechSynthesis.cancel();
 return new Promise(resolve=>{let settled=false;const done=value=>{if(settled)return;settled=true;if(speechDone===done)speechDone=null;resolve(value)};speechDone=done;
 const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=lang==='zh-CN'?.88:.72;const vs=speechSynthesis.getVoices();u.voice=vs.find(v=>v.lang===lang)||vs.find(v=>v.lang.startsWith(lang.slice(0,2)))||null;u.onend=()=>done(true);u.onerror=()=>done(false);speechSynthesis.speak(u)});
}
function stopAudio(){playVersion++;if(playingDone)playingDone(false);if(playing){playing.pause();playing=null}if(speechDone)speechDone(false);if('speechSynthesis'in window)speechSynthesis.cancel()}

async function initDB(){if(audioDB)return audioDB;audioDB=await new Promise((res,rej)=>{let r=indexedDB.open('sprout-audio',1);r.onupgradeneeded=()=>r.result.createObjectStore('sounds');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});return audioDB}
async function audioGet(k){const d=await initDB();return new Promise((res,rej)=>{let r=d.transaction('sounds').objectStore('sounds').get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function audioPut(k,v){const d=await initDB();return new Promise((res,rej)=>{let t=d.transaction('sounds','readwrite');t.objectStore('sounds').put(v,k);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
function safePlay(a){try{const p=a.play();return p&&typeof p.then==='function'?p:Promise.resolve()}catch(e){return Promise.reject(e)}}
async function playSound(k){
 stopAudio();const version=playVersion;let blob;try{blob=await audioGet(k)}catch{}if(version!==playVersion)return false;
 const url=blob?URL.createObjectURL(blob):`/audio/letters/${k}.mp3`;const a=new Audio(url);playing=a;
 return new Promise(resolve=>{let settled=false;const done=ok=>{if(settled)return;settled=true;if(blob)URL.revokeObjectURL(url);if(playingDone===done)playingDone=null;resolve(ok)};playingDone=done;
 a.onended=()=>done(true);a.onerror=()=>{toast('示范音暂未加载。请联网重试，或请家长导入已确认的音频。');done(false)};safePlay(a).catch(()=>{toast('声音未播放，请再点一次听音按钮。');done(false)})});
}
async function playWord(w){markExposure(w);stopAudio();const version=playVersion;const a=new Audio(`/audio/words/${w}.mp3`);playing=a;const ok=await new Promise(resolve=>{let settled=false;const done=v=>{if(settled)return;settled=true;if(playingDone===done)playingDone=null;resolve(v)};playingDone=done;a.onended=()=>done(true);a.onerror=()=>done(false);safePlay(a).catch(()=>done(false))});if(version!==playVersion)return false;if(ok)return true;toast('整词录音暂未加载，先用设备语音读出。');return speak(w,'en-US',true)}
async function playRime(rime){
 // 先试合音录音（at、in 有），没有就逐个字母拼出来
 const blend=new Audio(`/audio/blends/${rime}.mp3`);
 const ok=await new Promise(res=>{let settled=false;const done=v=>{if(settled)return;settled=true;res(v)};blend.onended=()=>done(true);blend.onerror=()=>done(false);safePlay(blend).catch(()=>done(false))});
 if(ok)return true;
 for(const ch of rime){if(!await playSound(ch))return false}
 return true;
}

function nav(p){clearAutoContinue();if(session){paused={session,questionIndex,locked,hinted,failed};clearRecording();session=null}stopAudio();page=p;render();window.scrollTo(0,0)}
const completedCount=()=>state.completed.length;
const dueKeys=()=>Object.entries(state.stats).filter(([k,v])=>!v.due||v.due<=Date.now()).map(([k])=>k);
const todayAnswers=()=>Object.values(state.stats).reduce((n,v)=>n+(v.daily?.[day()]||0),0);
const learned=()=>Object.values(state.stats).filter(mastery).length;
function shell(content){return `<div class="shell"><aside class="sidebar"><div class="brand"><img src="/icon.svg" alt="小芽"><div>小芽拼读<div class="brand-sub">LITTLE SPROUT</div></div></div><nav class="nav" aria-label="主导航">${[['home','home','学习首页'],['blendtable','blocks','拼读台'],['courses','book','成长课程'],['practice','play','练习乐园'],['progress','plant','我的成长'],['parents','settings','家长中心']].map(([p,i,t])=>`<button data-nav="${p}" class="${page===p?'active':''}" ${page===p?'aria-current="page"':''}>${svg(i)}${t}</button>`).join('')}</nav><div class="side-bottom"><div class="companion"><strong>🌱 每一点进步，都算数</strong>不用着急，一次认识一个声音。<br>今天也和孩子一起，慢慢长大。</div><p>为小小的探索者而设计</p></div></aside><main class="main"><header class="topbar"><div><div class="mobile-brand">🌱 小芽拼读</div><div class="eyebrow">A LITTLE EVERY DAY</div><div class="greeting">你好，${esc(state.name)}。今天也来发现新声音吧。</div></div><div class="profile"><button class="small secondary" id="install-help">iPad 使用</button><span class="pill">零基础 · 启蒙阶段</span><div class="avatar">🌱</div><span>${esc(state.name)}</span></div></header>${content}</main></div>`}
function home(){return `<div class="title-row"><div><div class="eyebrow">MY ALPHABET GARDEN</div><h1>点一个字母，听听它的声音</h1><p>26个字母随时查学。忘记哪个，就回来认真听一听。</p></div><span class="pill">全部开放 · 自由复习</span></div>${paused?'<div class="resume-banner"><span>🌿 刚才的练习已暂停，查完发音可以接着做。</span><button class="primary small" id="resume">继续刚才的练习 →</button></div>':''}${soundReference()}${foundationHome()}<div class="home-shortcuts"><button class="primary" data-nav="blendtable">自由拼读台 →</button><button class="secondary" data-nav="courses">选择课程学习 / 复习 →</button><button class="secondary" data-practice="mixed">综合练习</button><button class="secondary" data-practice="review">复习不熟的内容</button></div><p class="footer-note">字母名称与字母音不同。这里先展示常见发音；qu 与 x 的组合音会特别说明。</p>`}

function parents(){return `<div class="title-row"><div><div class="eyebrow">A LITTLE HELP FROM YOU</div><h1>家长中心</h1><p>先陪孩子学会方法，再慢慢让孩子自己试。</p></div><span class="pill">本机记录 · 可导出备份</span></div><div class="settings-grid"><section class="panel"><h3>孩子的学习节奏</h3><label class="field">孩子昵称<input id="child-name" maxlength="20" value="${esc(state.name)}"></label><label class="field">每轮练习题数<select id="length">${[8,12,20,30].map(n=>`<option ${state.length===n?'selected':''} value="${n}">${n} 题${n===12?'（建议起步）':''}</option>`).join('')}</select></label><label class="field">当前学习起点<select id="lesson-index">${lessons.map((l,i)=>`<option value="${i}" ${state.lesson===i?'selected':''}>第 ${i+1} 课 · ${l.title}</option>`).join('')}</select></label><label class="toggle"><input type="checkbox" id="voice" ${state.voice?'checked':''}>开启中文题目自动播报（点听音按钮始终可播放）</label><label class="toggle"><input type="checkbox" id="auto-continue" ${state.autoContinue?'checked':''}>开启连续学习（总结页5秒后继续，可随时暂停）</label><p class="muted">有薄弱项、跳过题或新组证据不足时先停下，不会仅凭做完题就认定掌握。</p><button class="primary" id="save-settings">保存设置</button><p class="muted">每日可以做多轮。孩子疲劳时随时结束，不用为了完成题量坚持。</p></section><section class="panel"><h3>DeepSeek 陪学建议</h3><span class="pill" id="api-pill">${apiStatus.deepseek?'● 已配置':'○ 尚未配置密钥'}</span><p class="muted">根据练习统计，分析下一步练什么。只发送字母、单词和练习结果，不发送姓名或录音。</p><label class="toggle"><input type="checkbox" id="ai-consent">本次同意发送学习统计给 DeepSeek</label><button class="secondary" id="ask-ai">生成陪学建议 ✧</button><div id="ai-output" class="message" style="margin-top:15px">${apiStatus.deepseek?'完成几轮练习后，再来看看建议。':'AI接口已准备，配置服务端 DEEPSEEK_API_KEY 后可用。没有密钥也能使用基础课程。'}</div><div class="notice">DeepSeek 当前不直接评测录音。自动发音评分尚未接入；本版支持录音回放与家长判定，不生成虚假分数。</div></section><section class="panel"><h3>发音示范与音源</h3><p class="muted">字母音使用独立音频，不用字母名称替代。在线示范音需联网，正式教学前请家长试听。可导入自己确认过的录音，优先在本机播放。</p><button id="audio-manager" class="secondary">管理字母音频</button><p class="muted">本版音频已打包在应用内：字母音为美式英语录音（Gugu），整词与合音为美式英语录音（Kokoro af_heart 过渡版）；播过的音频会缓存，离线可播。单词整词优先播本地录音，缺失时才用设备美式英语语音合成。</p></section><section class="panel"><h3>在 iPad 上使用</h3><p class="muted">用 Safari 打开本页 → 分享 → 添加到主屏幕。第一次录音时允许使用麦克风。</p><p class="muted">录音只在当前练习中保留，不上传，离开后释放。已导入的示范音和学习进度保存在本机。更换设备不会自动同步。</p><div class="row"><button class="secondary small" id="export">导出学习记录</button><label class="small secondary" style="cursor:pointer;border-radius:12px;padding:10px">导入记录<input type="file" accept="application/json" id="import-file" hidden></label></div><p class="muted">应用页面与音频可缓存，离线可用；AI建议仍需联网。</p></section></div>`}
function render(){app.innerHTML=shell(session?study():({home,blendtable,courses,practice,progress,parents}[page]||home)());bind();}
function bind(){bindFoundation();bindFamilies();bindMouth();$('#install-help')?.addEventListener('click',installHelp);document.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>showLetter(b.dataset.letter));$('#resume')?.addEventListener('click',resumeLesson);document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>b.dataset.nav==='parents'?parentGate():nav(b.dataset.nav));document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startLesson(+b.dataset.start));document.querySelectorAll('[data-practice]').forEach(b=>{b.onclick=()=>startPractice(b.dataset.practice);b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.click()}}});$('#start-today')?.addEventListener('click',()=>startLesson(state.lesson));$('#export')?.addEventListener('click',exportData);$('#save-settings')?.addEventListener('click',()=>{state.name=$('#child-name').value.trim()||'小芽';state.length=+$('#length').value;state.lesson=+$('#lesson-index').value;expansionLesson=Math.max(7,state.lesson);selectedStage=state.lesson>=7?3:1;stageFocus=state.lesson<7?lessons[state.lesson].newSounds[0]||'all':'all';state.voice=$('#voice').checked;state.autoContinue=$('#auto-continue').checked;save();render();toast('设置已保存')});$('#ask-ai')?.addEventListener('click',askAI);$('#audio-manager')?.addEventListener('click',audioManager);$('#import-file')?.addEventListener('change',importData);if(session){bindStudy();bindFoundationStudy()}if(page==='blendtable')bindBlendTable()}
function modal(html){const m=$('#modal');m.innerHTML=html;if(!m.open)m.showModal();m.querySelector('[data-close]')?.addEventListener('click',()=>m.close());return m}
function parentGate(){if(session){toast('请先结束当前练习，再进入家长中心。');return}const a=2+Math.floor(Math.random()*5),b=2+Math.floor(Math.random()*5);const m=modal(`<h2>请家长帮忙</h2><p>输入 ${a} + ${b} 的答案，进入家长中心。</p><label class="field">答案<input id="gate" inputmode="numeric" autofocus></label><div class="row"><button class="quiet" data-close>返回</button><button class="primary" id="gate-ok">进入</button></div>`);const submit=()=>{if(+$('#gate').value===a+b){m.close();nav('parents')}else toast('再算一算吧')};$('#gate-ok').onclick=submit;$('#gate').onkeydown=e=>{if(e.key==='Enter')submit()}}
function startLesson(i){if(!Number.isInteger(i)||i<0||i>=lessons.length)return;const done=state.lessonPhases[i]||[];const phase=FOUR_PHASES.find(p=>!done.includes(p))||'read';const lesson=lessons[i];if(i<=6){if(lesson.newSounds.length)return startFoundation(1,phase,{focus:lesson.newSounds[0]});return startFoundation(2,phase,{})}return startFoundation(3,phase,{lessonIndex:i})}
function startPractice(mode){if(mode==='review'){startReview();return}if(mode==='library'){showLibrary();return}selectedStage=mode==='spell'?2:1;page='practice';nav('practice')}
function resetQuestion(){locked=false;hinted=false;failed=false;spell=[];clearRecording();stopAudio()}
function q(){return session.questions[questionIndex]}
function prompt(){return ({namekind:'这是字母名称，还是字母音？',oralblend:'只听声音，把它们合起来',firstsound:'听这个词，找开头的音',swap:'换一个音，读出新词',demoWord:'先分音，再合成一个词',teach:'认识一个新声音',sound:'看到字母，自己读一读',listen:'听一听，找到它',blend:'一个一个音，连起来读',spell:'听单词，用字母拼出来',record:'轮到你的声音啦'})[q().type]}
function readPrompt(){speak(prompt())}
function study(){const x=q(),info=sounds[x.target],letter=x.target.length===1;let body='';
 if(x.type==='teach')body=`<div class="huge-letter">${x.target}</div><div class="sound-label">/ ${info.ipa} /</div><button class="sound-button" id="hear" aria-label="听字母音">🔊</button><p class="sound-hint">${info.hint}</p>${mouthBlock(x.target)}<p class="muted">这里学的是字母在单词中的音，不是字母名称。</p><button class="primary" id="teach-next">听过了，开始练习 →</button>`;
 if(x.type==='sound')body=`<div class="huge-letter">${x.target}</div><p class="sound-hint">先让孩子自己试。再听示范，对照发音。</p><button class="sound-button" id="hear" aria-label="听示范">🔊</button>${mouthBlock(x.target)}<div class="assessment"><p>请家长根据孩子的表现选择</p><div class="study-actions"><button data-assess="independent" class="primary">自己读出来了</button><button data-assess="assisted" class="secondary">提示后读出来</button><button data-assess="retry" class="quiet">还需要练习</button></div></div>`;
 if(x.type==='listen')body=`<div style="margin-top:35px"><button class="sound-button" id="hear" aria-label="听题目声音">🔊</button><p class="muted">点小喇叭听声音，再选一个。</p></div><div class="choices">${x.options.map(v=>`<button class="choice" data-answer="${v}">${v}</button>`).join('')}</div><div class="feedback" id="feedback" aria-live="polite"></div><button id="next" class="primary" hidden>下一题 →</button>`;
 if(x.type==='blend')body=`<div class="blend-letters">${[...x.target].map((v,i)=>`<button class="blend-letter" data-sound="${v}" data-index="${i}">${v}</button>`).join('')}</div><p class="muted">点每个字母听音，再从左向右滑动指一指。</p><input class="blend-slider" id="blend-slider" type="range" min="0" max="${x.target.length-1}" step="1" value="0" aria-label="从左向右指读字母"><div class="study-actions"><button id="blend-play" class="secondary">🔊 分音示范</button><button id="hear-word" class="secondary">听完整词</button></div><div id="meaning" class="muted" hidden>${meanings[x.target]||''}</div><div class="assessment"><p>让孩子尝试把声音合成一个词，由家长确认</p><div class="study-actions"><button data-assess="independent" class="primary">独立拼出来了</button><button data-assess="assisted">提示后拼出来</button><button data-assess="retry" class="quiet">还需要练习</button></div></div>`;
 if(x.type==='spell')body=`<button class="sound-button" id="hear" aria-label="听单词">🔊</button><p class="muted">听完整词，再依次点选字母。点格子可以撤回。</p><div class="slots">${[...x.target].map((v,i)=>`<button class="slot" data-slot="${i}" aria-label="第${i+1}个字母位置"></button>`).join('')}</div><div class="choices">${shuffle([...x.target,...shuffle(knownAt(session.lesson).filter(c=>!x.target.includes(c))).slice(0,2)]).map((v,i)=>`<button class="tile" data-tile="${v}" data-tile-id="${i}">${v}</button>`).join('')}</div><div class="study-actions"><button class="secondary" id="spell-reset">重新拼</button><button class="primary" id="check-spell">拼好了</button></div><div class="feedback" id="feedback" aria-live="polite"></div><button id="next" class="primary" hidden>下一题 →</button>`;
 if(x.type==='record')body=`<div class="notice">🎙️ 录音与回放已提供 · 自动发音评分未接入<br>这次由家长回放后判定，不会生成AI分数。</div><div class="huge-letter" style="font-size:${letter?'130':'90'}px">${x.target}</div><p class="muted" id="record-mode">独立读：先不听示范，试着自己读。</p><button class="record-btn" id="record" aria-label="开始录音">🎙️</button><div class="record-status" id="record-status">点一下开始，再点一下结束（最长 8 秒）</div><audio id="playback" controls hidden></audio><div class="study-actions"><button id="hear" class="secondary">🔊 听示范，再跟读</button></div><div class="assessment" id="record-assessment" hidden><p>请先回放录音，再对照示范。以下由家长判定，不是AI发音评分。</p><div class="rubric">${letter?'听清目标音；有没有读成字母名称；有没有加多余元音。':'音是否齐全、顺序是否正确；能不能合成完整词；是否依赖示范。'}</div><label class="field">本次需要练什么（家长观察）<select id="difficulty"><option value="">暂未发现 / 不确定</option><option value="name">读成了字母名称</option><option value="recall">想不起对应发音</option><option value="extra">加了多余的音</option><option value="missing">漏音或换音</option><option value="blend">分音会读，合不起来</option></select></label><div class="study-actions"><button data-assess="independent" class="primary">读出来了</button><button data-assess="assisted">提示后读出来</button><button data-assess="retry" class="quiet">还需要练习</button></div></div><button id="skip-record" class="quiet small">暂时不录，跳过</button>`;
 body=foundationBody(x,body);return `${session.stage!==undefined?flowSteps(session.phase):''}<div class="study"><div class="study-bar"><button class="quiet small" id="exit">← 退出</button><div class="progress"><i style="width:${questionIndex/session.questions.length*100}%"></i></div><span class="muted">${questionIndex+1} / ${session.questions.length}</span></div><section class="panel study-card"><span class="pill">${session.stage!==undefined?foundationStages[session.stage].title:session.mode==='lesson'?`第 ${session.lesson+1} 课`:'专项练习'} · ${x.type==='teach'?'认识声音':'练一练'}</span><h1>${prompt()}</h1>${body}${requiresQuestionAudio(x)?'<button id="skip-audio" class="quiet small">声音无法播放，暂时跳过（不计分）</button>':''}</section><p class="footer-note">先自己试，再听提示。读不出来也没关系，我们一起练。</p></div>`}
function bindStudy(){const x=q();$('#exit').onclick=exitLesson;$('#hear')?.addEventListener('click',async()=>{
 const current=session,ix=questionIndex;let ok;
 if(['namekind','oralblend','firstsound'].includes(x.type))ok=await playFoundationPrompt(x);
 else {if(x.type==='record'){hinted=recordingNeedsHelp({priorHelp:hinted,hasRecording:!!recordBlob});x.modelWasHeard=true;$('#record-mode').textContent=recordBlob?'对照示范：已完成的这次录音仍按录前是否听过提示记录。重录将记为跟读。':'跟读模式：听过示范后再读，单独记录。'}else if(!requiresQuestionAudio(x)&&x.type!=='teach')hinted=true;if(x.target.length===1){const box=document.querySelector('.mouth-box');if(box)mouthAnim(box,mouthShapes[x.target],650);ok=await playSound(x.target)}else ok=await playWord(x.target);}
 if(session===current&&questionIndex===ix&&requiresQuestionAudio(x)){x.audioReady=!!ok;if(!ok)toast('没有完整播放题目声音，本题暂不判定，请重听或跳过。')}
 });$('#teach-next')?.addEventListener('click',next);$('#next')?.addEventListener('click',next);document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(b.dataset.answer,b));document.querySelectorAll('[data-assess]').forEach(b=>b.onclick=()=>assess(b.dataset.assess));document.querySelectorAll('[data-sound]').forEach(b=>b.onclick=()=>{hinted=true;playSound(b.dataset.sound)});$('#blend-slider')?.addEventListener('input',e=>{document.querySelectorAll('.blend-letter').forEach((b,i)=>b.classList.toggle('lit',i<=+e.target.value))});$('#blend-play')?.addEventListener('click',async()=>{hinted=true;const s=session,ix=questionIndex;const blend=new Audio(`/audio/blends/${x.target}.mp3`);playing=blend;const blended=await new Promise(res=>{blend.onended=()=>res(true);blend.onerror=()=>res(false);safePlay(blend).catch(()=>res(false))});if(blended)return;for(let i=0;i<x.target.length;i++){if(s!==session||ix!==questionIndex)break;document.querySelectorAll('.blend-letter').forEach((b,j)=>b.classList.toggle('lit',i===j));if(!await playSound(x.target[i]))break}});$('#hear-word')?.addEventListener('click',()=>{hinted=true;playWord(x.target);$('#meaning').hidden=false});document.querySelectorAll('[data-tile]').forEach(b=>b.onclick=()=>{if(locked||spell.length>=x.target.length||b.disabled)return;spell.push({c:b.dataset.tile,id:b.dataset.tileId});b.disabled=true;updateSlots()});document.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{if(locked)return;const i=+b.dataset.slot;if(!spell[i])return;const removed=spell.splice(i,1)[0];document.querySelector(`[data-tile-id="${removed.id}"]`).disabled=false;updateSlots()});$('#spell-reset')?.addEventListener('click',()=>{if(locked)return;spell=[];document.querySelectorAll('[data-tile]').forEach(b=>b.disabled=false);updateSlots()});$('#check-spell')?.addEventListener('click',()=>{if(locked)return;if(spell.length!==x.target.length){toast('还有空格，先把字母放进去吧');return}answer(spell.map(x=>x.c).join(''))});$('#record')?.addEventListener('click',toggleRecording);$('#skip-record')?.addEventListener('click',()=>{session.results.push({target:x.target,skip:true});next()})}
function updateSlots(){document.querySelectorAll('[data-slot]').forEach((b,i)=>{b.textContent=spell[i]?.c||'';b.classList.toggle('filled',!!spell[i])})}
function answer(value,b){if(locked)return;const x=q();if(requiresQuestionAudio(x)&&!x.audioReady){toast('请先完整听一遍题目声音，再作答。');return}if(session.stage===0&&value!==x.target){locked=true;b?.classList.add('wrong');$('#feedback').textContent='已记录，我们看看下一项。';$('#next').hidden=false;recordResult('retry','exercise');return}if(value===x.target){locked=true;b?.classList.add('correct');$('#feedback').classList.remove('error');$('#feedback').textContent=failed?'这次找到了！稍后再练一次。':'找到了，做得好！';$('#next').hidden=false;recordResult(!failed&&!hinted?'independent':'assisted','exercise');speak('找到了，做得好')}else{failed=true;hinted=true;x.failures=(x.failures||0)+1;b?.classList.add('wrong');$('#feedback').classList.add('error');$('#feedback').textContent=x.failures>=2?'答案是 '+x.target+'。听过示范再试，这次会记录为提示后完成。':'再听一听，试一次。';if(!session.questions.slice(questionIndex+1).some(z=>z.target===x.target)&&session.questions.length<state.length+8)session.questions.push({...x,options:shuffle(x.options||[]),audioReady:false,failures:0,modelWasHeard:false});speak('再听一听，试一次')}}
function recordResult(result,source){const target=q().target,now=Date.now(),good=result!=='retry',independent=result==='independent';let s=state.stats[target]||{attempts:0,correct:0,independent:0,assisted:0,days:[],daily:{},history:[]};s.attempts++;s.correct+=good?1:0;s.independent+=independent?1:0;s.assisted+=result==='assisted'?1:0;if(independent&&!s.days.includes(day()))s.days.push(day());s.daily[day()]=(s.daily[day()]||0)+1;s.history.push({at:now,result,source,type:q().type});s.history=s.history.slice(-100);s.streak=independent?(s.streak||0)+1:0;s.due=now+(independent?([1,2,4,7,14][Math.min(s.streak-1,4)]*86400000):300000);s.last=now;s.lastResult=result;state.stats[target]=s;const skill=taskSkill(q()),difficulty=$('#difficulty')?.value||'';const evidence={target,result,source,skill,phase:session.phase||'practice',stage:session.stage??selectedStage,difficulty,at:now};s.lastIssue=difficulty;s.lastSkill=skill;const sk=target+'|'+skill;const prev=state.skillStats[sk]||{attempts:0,independent:0,days:[]};prev.attempts++;if(independent){prev.independent++;if(!prev.days.includes(day()))prev.days.push(day())}prev.lastResult=result;prev.difficulty=difficulty;prev.last=now;prev.due=s.due;state.skillStats[sk]=prev;session.results.push(evidence);save()}
function next(){markExposure(q().target);resetQuestion();questionIndex++;if(questionIndex>=session.questions.length){finish();return}render();window.scrollTo(0,0);readPrompt()}
function exitLesson(){clearAutoContinue();if(!session)return;const m=modal('<h2>先休息一下吗？</h2><p>已经完成的练习会保存。未完成的课程，下次可以重新开始。</p><div class="study-actions"><button class="secondary" data-close>继续练习</button><button class="primary" id="exit-confirm">保存并退出</button></div>');$('#exit-confirm').onclick=()=>{m.close();clearRecording();stopAudio();session=null;page='home';render()}}
async function toggleRecording(){if(recordBusy)return;if(recorder?.state==='recording'){recorder.stop();return}if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('此浏览器不支持录音，请用新版 Safari 或 Chrome 打开。');return}recordBusy=true;const current=session,ix=questionIndex;try{if(q().modelWasHeard)hinted=recordingNeedsHelp({priorHelp:hinted,modelWasHeard:true,restarting:true});stopAudio();clearRecording();const s=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});if(session!==current||questionIndex!==ix){s.getTracks().forEach(t=>t.stop());return}stream=s;const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));recorder=new MediaRecorder(s,mime?{mimeType:mime}:{});const parts=[];const r=recorder;recorder.ondataavailable=e=>{if(e.data.size)parts.push(e.data)};recorder.onstop=()=>{clearTimeout(recordTimer);s.getTracks().forEach(t=>t.stop());if(session!==current||questionIndex!==ix)return;recordBlob=new Blob(parts,{type:r.mimeType});if(!recordBlob.size){toast('没有录到声音，请重试');return}recordUrl=URL.createObjectURL(recordBlob);const player=$('#playback');if(!player)return;player.src=recordUrl;player.hidden=false;$('#record').classList.remove('recording');$('#record').textContent='🎙️';$('#record-status').textContent=`录音完成（${Math.max(.1,(Date.now()-recordStarted)/1000).toFixed(1)} 秒），请回放确认是否清楚。`;$('#record-assessment').hidden=false};recorder.start();recordStarted=Date.now();$('#playback').hidden=true;$('#record-assessment').hidden=true;$('#record').classList.add('recording');$('#record').textContent='■';$('#record-status').textContent='正在录音……读完后点停止。';recordTimer=setTimeout(()=>{if(r.state==='recording')r.stop()},8000)}catch(e){toast(e.name==='NotAllowedError'?'麦克风未获允许，请在浏览器设置中开启。':'录音失败，请检查麦克风后重试。')}finally{recordBusy=false}}
function clearRecording(){clearTimeout(recordTimer);if(recorder){recorder.onstop=null;if(recorder.state==='recording')recorder.stop();recorder=null}stream?.getTracks().forEach(t=>t.stop());stream=null;if(recordUrl)URL.revokeObjectURL(recordUrl);recordUrl=null;recordBlob=null}
function showLibrary(){const m=modal(`<h2>按类别查发音</h2><p>元音与辅音分区，点字母即可听音。</p>${soundReference(true)}<button class="secondary" data-close>返回</button>`);m.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>showLetter(b.dataset.letter))}

function audioManager(){const m=modal(`<h2>字母音示范管理</h2><p>导入经确认的短音频（MP3、M4A 或 WAV，单个不超过 2MB）。只保存在当前设备；换设备需要重新导入。</p><div style="max-height:40vh;overflow:auto">${Object.keys(sounds).map(k=>`<div class="sound-tile-upload"><strong>${k}</strong><button class="small" data-audio-test="${k}">试听</button><input type="file" accept="audio/*" aria-label="导入${k}的字母音" data-audio-upload="${k}"></div>`).join('')}</div><button class="secondary" data-close>完成</button>`);m.querySelectorAll('[data-audio-test]').forEach(b=>b.onclick=()=>playSound(b.dataset.audioTest));m.querySelectorAll('[data-audio-upload]').forEach(b=>b.onchange=async()=>{const f=b.files[0];if(!f)return;if(f.size>2*1024*1024||!f.type.startsWith('audio/')){toast('请选择 2MB 以内的音频文件');return}try{await audioPut(b.dataset.audioUpload,f);toast('已保存，本机将优先使用此示范音')}catch{toast('音频保存失败，请检查浏览器存储权限')}})}
async function askAI(){if(!/^https?:$/.test(location.protocol)){toast('单文件测试版尚未连接AI服务。当前可以体验学习、录音回放与家长评估。');return}if(!$('#ai-consent').checked){toast('请先确认本次发送学习统计');return}const b=$('#ask-ai'),out=$('#ai-output');b.disabled=true;out.textContent='正在整理建议……';try{const r=await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lesson:state.lesson,stats:Object.entries(state.stats).slice(0,120).map(([target,s])=>({target,attempts:s.attempts,independent:s.independent,assisted:s.assisted,correct:s.correct}))})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'陪学建议服务未配置，当前可以体验学习、录音回放与家长评估。');out.textContent=d.advice||'暂时无法生成建议'}catch(e){out.textContent=e.message}finally{b.disabled=false}}
function exportData(){const blob=new Blob([JSON.stringify({version:1,...state},null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`sprout-progress-${day()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000)}
async function importData(e){const f=e.target.files[0];if(!f)return;if(f.size>2e6){toast('文件太大，请选择导出的学习记录');return}try{const d=JSON.parse(await f.text());if(d.version!==1||!Number.isInteger(d.lesson)||d.lesson<0||d.lesson>=lessons.length||!Array.isArray(d.completed)||!d.stats||typeof d.stats!=='object'||Array.isArray(d.stats)||!Array.isArray(d.sessions)||d.sessions.length>200||typeof d.name!=='string'||d.name.length>20||![8,12,20,30].includes(d.length))throw Error();for(const [k,s]of Object.entries(d.stats)){if(!/^[a-z]{1,5}$/.test(k)||![s.attempts,s.correct,s.independent,s.assisted].every(n=>Number.isFinite(n)&&n>=0)||!Array.isArray(s.days)||!s.daily||typeof s.daily!=='object'||!Array.isArray(s.history))throw Error()}const m=modal('<h2>恢复学习记录？</h2><p>将用备份中的学习记录替换当前记录。示范音频不会改变。请先导出当前记录留作备份。</p><div class="study-actions"><button class="secondary" data-close>取消</button><button id="restore-confirm" class="primary">恢复备份</button></div>');$('#restore-confirm').onclick=()=>{state={autoContinue:d.autoContinue!==false,unitProgress:d.unitProgress&&typeof d.unitProgress==='object'?d.unitProgress:{},foundationRecords:Array.isArray(d.foundationRecords)?d.foundationRecords.slice(-300):[],skillStats:d.skillStats&&typeof d.skillStats==='object'?d.skillStats:{},exposed:Array.isArray(d.exposed)?d.exposed.filter(x=>typeof x==='string'&&/^[a-z]{1,5}$/.test(x)):[],name:d.name,lesson:d.lesson,completed:d.completed.filter(i=>Number.isInteger(i)&&i>=0&&i<lessons.length),lessonPhases:sanitizeLessonPhases(d.lessonPhases),stats:d.stats,sessions:d.sessions,length:d.length,voice:!!d.voice};migrateLessonPhases();save();m.close();render();toast('学习记录已恢复')}}catch{toast('记录格式不正确，请选择本软件导出的 JSON 文件')}}
window.addEventListener('pagehide',()=>{clearAutoContinue();clearRecording();stopAudio()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&autoTimer)pauseAutoContinue('已切到后台，连续学习已暂停。')});
fetch('/api/status').then(r=>r.json()).then(s=>{apiStatus=s;if(page==='parents'&&!session)render()}).catch(()=>{});
if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});


// ---------- 自由拼读台 ----------
// 三个格子：开头音 + 元音 + 结尾音。孩子自己选字母，逐个点亮合音，不走固定题目。
let btSlots=[null,null,null],btPlaying=false,btRec=null,btStream=null,btRecUrl=null,btRecBlob=null,btQuiz=false,btTarget=null,btHelpOpen=false,btComparing=false,btSelfAudio=null,btCompareDone=null,btTried=false,btBlendTimer=null,btHeardModel=false;
function btWord(){return blendWord(btSlots)}
function blendtable(){
 const known=new Set(knownAt(state.lesson));
 const slotHtml=btSlots.map((L,i)=>`<button class="bt-slot" data-bt-slot="${i}" aria-label="第${i+1}个格子">${L||'+'}</button>`).join('');
 const word=btWord(),real=word.length>1&&isRealWord(word);
 const showHelp=btHelpOpen||(state.btHelp||0)<2;
 const board=soundGroups.map(g=>`<div class="bt-group"><strong>${g.title}</strong><div class="bt-board">${g.letters.map(k=>`<button class="bt-letter ${known.has(k)?'learned':''}" data-bt-letter="${k}">${k}<small>/${sounds[k].ipa}/</small></button>`).join('')}</div></div>`).join('');
 const resultHtml=btQuiz?'<span class="muted">自己拼一拼，读出来。读完后由家长判断。</span>':(word.length>1?(real?`🎉 你拼出来了：${word}！<br>🌱 这个词真的存在：${meanings[word]}`:`🎉 你拼出来了：${word}！<br>这是你自创的词，拼读得一样对。`):'<span class="muted">点一个字母放进第一个格子。</span>');
 const controls=btQuiz?`
 <div class="bt-quiz-banner">${btBannerHtml()}</div>
 <div class="study-actions"><button class="primary" id="bt-record">🎙️ 我读一读</button><button class="secondary" id="bt-model">🔊 听听对不对</button></div>
 <p class="muted">由家长判断：软件不自动打分，也没有接入发音评测。请先听孩子自己读（可以录音，也可以现场听），再选一项。</p>
 <div class="study-actions"><button class="primary" id="bt-judge-independent">独立读出来了</button><button class="secondary" id="bt-judge-assisted">提示后读出来了</button><button class="secondary" id="bt-judge-retry">还需要练习</button></div>
 <div class="study-actions"><button class="secondary" id="bt-next">⏭ 再考一个</button><button class="quiet small" id="bt-quiz-exit">退出考一考</button></div>`:`
 <div class="study-actions"><button class="primary" id="bt-blend">🔊 合起来</button><button class="secondary" id="bt-random">🎲 随便拼一个</button><button class="secondary" id="bt-clear">清空格子</button><button class="secondary" id="bt-quiz">📝 考一考</button></div>
 <div class="bt-swap"><span>换个元音试试：</span>${['a','e','i','o','u'].map(v=>`<button class="small ${btSlots[1]===v?'primary':'secondary'}" data-bt-vowel="${v}">${v} /${sounds[v].ipa}/</button>`).join('')}</div>
 <div class="study-actions"><button class="secondary" id="bt-record">🎙️ 我读一读</button><button class="secondary" id="bt-hear">🔊 再听示范</button></div>`;
 return `<div class="title-row"><div><h1>${btQuiz?'考一考':'自由拼读台'}</h1></div></div>
 <section class="panel bt-panel">${btQuiz?'':`<div id="bt-help" style="${showHelp?'':'display:none'}"><div class="bt-steps"><span><b>1</b> 点下面的字母，放进格子</span><span><b>2</b> 点“合起来”，字母一个一个亮</span><span><b>3</b> 听合起来的词，自己读一读</span></div>
 </div>
 <div style="text-align:center"><button class="quiet small" id="bt-help-toggle">${showHelp?'收起玩法说明':'玩法说明'}</button></div>`}
 <div class="bt-sticky"><div class="bt-slots">${slotHtml}</div>
 <div class="bt-word" id="bt-word">${word||''}</div>
 <div class="bt-result" id="bt-result">${resultHtml}</div></div>
 ${btQuiz?'':`<div style="margin-top:14px">${board}</div>`}
 ${controls}
 <div class="record-status" id="bt-record-status"></div>
 <audio id="bt-playback" controls hidden></audio></section>`;
}
async function btBlend(){
 const word=btWord();
 if(word.length<2){toast('先选两个字母，再点“合起来”。');return}
 if(btQuiz||btPlaying||btRec?.state==='recording')return;btStopCompare();btPlaying=true;
 const slots=[...document.querySelectorAll('.bt-slot')];
 const timed=sound=>Promise.race([playSound(sound),new Promise(r=>setTimeout(()=>r(false),900))]);
 try{
  for(let i=0;i<btSlots.length;i++){
   const L=btSlots[i];if(!L)continue;
   slots[i]?.classList.add('lit');
   await timed(L+'_slow');
   await new Promise(r=>setTimeout(r,400));
   slots[i]?.classList.remove('lit');
  }
  await new Promise(r=>setTimeout(r,600));
  const ok=await Promise.race([playWord(word),new Promise(r=>setTimeout(()=>{stopAudio();r(false)},2500))]);
  if(!ok){for(const L of btSlots){if(L)await timed(L+'_slow')}}
  state.btHelp=(state.btHelp||0)+1;save();
  if(state.btHelp>=2&&!btHelpOpen){const h=$('#bt-help');if(h)h.style.display='none';const tg=$('#bt-help-toggle');if(tg)tg.textContent='玩法说明';}
 }finally{btPlaying=false}
}
function btRandom(){
 if(btPlaying||btRec?.state==='recording')return;
 const cons='bcdfghjklmnpqrstvwxz',vow='aeiou';
 const pick=s=>s[Math.floor(Math.random()*s.length)];
 btSlots=[pick(cons),pick(vow),pick(cons)];
 btRender();
 btClearBlendTimer();btBlendTimer=setTimeout(()=>{btBlendTimer=null;if(page==='blendtable')btBlend()},500);
}
function btClearBlendTimer(){if(btBlendTimer){clearTimeout(btBlendTimer);btBlendTimer=null}}
function btQuizPool(){
 const known=new Set(knownAt(state.lesson));
 const all=Object.keys(meanings).filter(w=>w.length===3);
 let best=Infinity;const scored=all.map(w=>{const n=[...w].filter(k=>!known.has(k)).length;if(n<best)best=n;return [w,n];});
 return scored.filter(([,n])=>n===best).map(([w])=>w);
}
function btBannerHtml(){const n=(state.btStars&&state.btStars.day===day())?state.btStars.count:0;return `📝 考一考${n>0?` ⭐ 今天读了 ${n} 次`:``}`;}
function btPickTarget(){
 const pool=btQuizPool();
 let w=pool[Math.floor(Math.random()*pool.length)];
 if(w===btTarget&&pool.length>1)w=pool[(pool.indexOf(w)+1)%pool.length];
 btTarget=w;btSlots=w.split('');btTried=false;btHeardModel=false;btRender();
}
function btEnterQuiz(){
 if(btPlaying)return;
 btClearBlendTimer();
 if(btSlots.some(Boolean)&&!btSlots.every(Boolean)){toast('先把三个格子填满，再进考一考。');return}
 btQuiz=true;btTried=false;btHeardModel=false;
 if(btSlots.every(Boolean)){btTarget=btWord();}
 else{const pool=btQuizPool();btTarget=pool[Math.floor(Math.random()*pool.length)];btSlots=btTarget.split('');}
 render();
}
function btExitQuiz(){btClearBlendTimer();btQuiz=false;btTarget=null;btSlots=[null,null,null];render();}
function btRender(){
 if(page!=='blendtable')return;
 document.querySelectorAll('.bt-slot').forEach((b,i)=>{b.textContent=btSlots[i]||'+'});
 const word=btWord(),real=word.length>1&&isRealWord(word);
 const wEl=$('#bt-word');if(wEl)wEl.textContent=word||'';
 const rEl=$('#bt-result');if(rEl)rEl.innerHTML=btQuiz?'<span class="muted">自己拼一拼，读出来。读完后由家长判断。</span>':(word.length>1?(real?`🎉 你拼出来了：${word}！<br>🌱 这个词真的存在：${meanings[word]}`:`🎉 你拼出来了：${word}！<br>这是你自创的词，拼读得一样对。`):'<span class="muted">点一个字母放进第一个格子。</span>');
 document.querySelectorAll('[data-bt-vowel]').forEach(b=>{const on=btSlots[1]===b.dataset.btVowel;b.classList.toggle('primary',on);b.classList.toggle('secondary',!on)});
}
function bindBlendTable(){
 document.querySelectorAll('[data-bt-letter]').forEach(b=>b.onclick=async()=>{
  if(btQuiz||btPlaying||btRec?.state==='recording')return;
  const k=b.dataset.btLetter;const ix=btSlots.findIndex(s=>!s);
  if(ix<0){const box=document.querySelector('.bt-slots');if(box){box.classList.remove('bt-shake');void box.offsetWidth;box.classList.add('bt-shake')}toast('格子满了，先点一个格子拿掉一个字母。');return}
  btSlots[ix]=k;await playSound(k);btRender();
  if(btSlots.every(Boolean)){btClearBlendTimer();btBlendTimer=setTimeout(()=>{btBlendTimer=null;if(page==='blendtable')btBlend()},600);}
 });
 document.querySelectorAll('[data-bt-slot]').forEach(b=>b.onclick=()=>{
  if(btQuiz||btPlaying||btRec?.state==='recording')return;
  const i=+b.dataset.btSlot;if(!btSlots[i])return;btSlots[i]=null;btClearBlendTimer();btRender();
 });
 document.querySelectorAll('[data-bt-vowel]').forEach(b=>b.onclick=async()=>{
  if(btQuiz||btPlaying||btRec?.state==='recording')return;
  btSlots[1]=b.dataset.btVowel;await playSound(b.dataset.btVowel);btRender();
  if(btWord().length>1){btClearBlendTimer();btBlendTimer=setTimeout(()=>{btBlendTimer=null;if(page==='blendtable')btBlend()},500);}
 });
 $('#bt-blend')?.addEventListener('click',btBlend);
 $('#bt-random')?.addEventListener('click',btRandom);
 $('#bt-quiz')?.addEventListener('click',btEnterQuiz);
 $('#bt-quiz-exit')?.addEventListener('click',btExitQuiz);
 $('#bt-help-toggle')?.addEventListener('click',()=>{btHelpOpen=!btHelpOpen;render();});
 $('#bt-model')?.addEventListener('click',()=>{if(btQuiz&&!btTried){toast('先自己读一次，再听示范。');return}btStopCompare();const w=btTarget||btWord();if(w){btHeardModel=true;playWord(w)}});
 $('#bt-judge-independent')?.addEventListener('click',()=>btJudge('independent'));
 $('#bt-judge-assisted')?.addEventListener('click',()=>btJudge('assisted'));
 $('#bt-judge-retry')?.addEventListener('click',()=>btJudge('retry'));
 $('#bt-next')?.addEventListener('click',()=>{btStopCompare();btPickTarget();});
 $('#bt-clear')?.addEventListener('click',()=>{if(btPlaying||btRec?.state==='recording')return;btClearBlendTimer();btSlots=[null,null,null];btRender()});
 $('#bt-hear')?.addEventListener('click',btBlend);
 $('#bt-record')?.addEventListener('click',btRecord);
}
// ---------- 考一考即时反馈 ----------
// 软件能立刻说的只有两件事：你读出来了（付出），我听到你的声音了（可测）。
// “读对了”这句不由软件说，仍由家长判——4 岁孩子的发音机器判不准，不造假分数。
function hearCheck(buf){
 if(!buf||!buf.duration||!buf.numberOfChannels||typeof buf.getChannelData!=='function')return {ok:false,reason:'decode'};
 let peak=0,sum=0,n=0;
 for(let c=0;c<buf.numberOfChannels;c++){const d=buf.getChannelData(c);for(let i=0;i<d.length;i+=4){const v=Math.abs(d[i]);if(v>peak)peak=v;sum+=v*v;n++}}
 const rms=Math.sqrt(sum/Math.max(1,n));
 if(buf.duration<0.4)return {ok:false,reason:'short',duration:buf.duration,peak,rms};
 if(peak<0.02)return {ok:false,reason:'quiet',duration:buf.duration,peak,rms};
 return {ok:true,reason:'heard',duration:buf.duration,peak,rms};
}
function btStarsToday(){
 const d=day(),st=state.btStars||{day:d,count:0};
 if(st.day!==d){st.day=d;st.count=0}
 state.btStars=st;return st;
}
function btStopCompare(){if(btSelfAudio){btSelfAudio.pause();btSelfAudio=null}btComparing=false;if(btCompareDone){const d=btCompareDone;btCompareDone=null;d()}}
async function btAfterRecord(blob){
 btRecBlob=blob;if(btRecUrl)URL.revokeObjectURL(btRecUrl);btRecUrl=URL.createObjectURL(blob);
 const p=$('#bt-playback');if(p){p.src=btRecUrl;p.hidden=false}
 const b=$('#bt-record');if(b)b.textContent='🎙️ 我读一读';
 const st=btStarsToday();st.count++;if(btQuiz)btTried=true;state.btLastPlay=Date.now();save();
 const bn=document.querySelector('.bt-quiz-banner');if(bn)bn.innerHTML=btBannerHtml();
 const r=$('#bt-result');
 if(r){r.innerHTML=`🎉 你读出来了！<br><span class="muted">⭐ 今天读了 ${st.count} 次</span>`;r.classList?.remove('bt-celebrate');void r.offsetWidth;r.classList?.add('bt-celebrate')}
 const s=$('#bt-record-status');if(s)s.textContent='正在听听你读的……';
 try{
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error('no AudioContext');
  const ac=new AC();const buf=await ac.decodeAudioData(await blob.arrayBuffer());ac.close?.();
  const h=hearCheck(buf);
  if(s)s.textContent=h.ok?'我听到你的声音啦！先听老师读，再听你读。':h.reason==='short'?'这次有点短，再读一次，大声点。':'声音有点小，再大声读一次。';
  const cmpWord=btTarget||btWord();
  if(h.ok&&cmpWord){btComparing=true;let a=null;try{await playWord(cmpWord);await new Promise(res=>setTimeout(res,250));a=new Audio(btRecUrl);btSelfAudio=a;safePlay(a).catch(()=>{});await new Promise(res=>{btCompareDone=res;a.onended=res;setTimeout(res,4000)})}finally{btComparing=false;btCompareDone=null;if(btSelfAudio===a)btSelfAudio=null}}
 }catch(e){if(s)s.textContent='录下来了，点播放听听自己读的。'}
}
// ---------- 考一考的判定由家长做 ----------
// 软件不打分、不假装听懂。录音不是唯一方式，家长现场听也可以判；
// 判定不用录音也能做。听过示范后再读的，记为“提示后”，与独立完成分开记；记录来源写“家长判断”。
function btJudge(result){
 const w=btTarget||btWord();if(!w)return;
 btStopCompare();
 let value=result;
 if(result==='independent'&&btHeardModel)value='assisted';
 const rEl=$('#bt-result');
 const label={independent:'独立读出来了',assisted:'提示后读出来了',retry:'还需要练习'}[value];
 const note=result==='independent'&&btHeardModel?'（已经听过示范，这次记为提示后读出来）':'';
 const mean=isRealWord(w)?` · ${w} 是“${meanings[w]}”的意思`:'';
 if(rEl)rEl.innerHTML=value==='retry'
  ?`家长判断：还需要练习${mean}。<br><span class="muted">没关系，再练一次，慢慢来。想先听一遍，可以点“听听对不对”。</span>`
  :`家长判断：${label}${note}<br><span class="muted">${w}${mean}</span>`;
 btRecordQuizJudgment(w,value);
 btTried=true;state.btLastPlay=Date.now();save();
 const bn=document.querySelector('.bt-quiz-banner');if(bn)bn.innerHTML=btBannerHtml();
}
function btRecordQuizJudgment(word,value){
 if(!state.stats)state.stats={};
 if(!state.skillStats)state.skillStats={};
 const now=Date.now(),independent=value==='independent';
 let s=state.stats[word]||{attempts:0,correct:0,independent:0,assisted:0,days:[],daily:{},history:[]};
 s.attempts++;s.correct+=value!=='retry'?1:0;s.independent+=independent?1:0;s.assisted+=value==='assisted'?1:0;
 if(independent&&!s.days.includes(day()))s.days.push(day());
 s.daily[day()]=(s.daily[day()]||0)+1;
 s.history.push({at:now,result:value,source:'parent',type:'record'});s.history=s.history.slice(-100);
 s.streak=independent?(s.streak||0)+1:0;
 s.due=now+(independent?([1,2,4,7,14][Math.min(s.streak-1,4)]*86400000):300000);
 s.last=now;s.lastResult=value;s.lastSkill='blending';state.stats[word]=s;
 const sk=word+'|blending';const prev=state.skillStats[sk]||{attempts:0,independent:0,days:[]};
 prev.attempts++;if(independent){prev.independent++;if(!prev.days.includes(day()))prev.days.push(day())}
 prev.lastResult=value;prev.last=now;prev.due=s.due;state.skillStats[sk]=prev;
 save();
}
async function btRecord(){
 if(btRec?.state==='recording'){btRec.stop();return}
 if(btPlaying||btComparing){toast('等播完再录音。');return}
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('此浏览器不支持录音，请用新版 Safari 或 Chrome 打开。');return}
 stopAudio();
 try{
  btStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
  const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  const parts=[];btRec=new MediaRecorder(btStream,mime?{mimeType:mime}:{});
  btRec.ondataavailable=e=>{if(e.data.size)parts.push(e.data)};
  btRec.onstop=()=>{btStream?.getTracks().forEach(t=>t.stop());btStream=null;const blob=new Blob(parts,{type:btRec.mimeType});if(!blob.size){toast('没有录到声音，请重试');return}btAfterRecord(blob)};
  btRec.start();const s=$('#bt-record-status');if(s)s.textContent='正在录音……读完后点停止。';const b=$('#bt-record');if(b)b.textContent='■ 停止';
  setTimeout(()=>{if(btRec?.state==='recording')btRec.stop()},8000);
 }catch(e){toast(e.name==='NotAllowedError'?'麦克风未获允许，请在浏览器设置中开启。':'录音失败，请检查麦克风后重试。')}
}

function resumeLesson(){clearAutoContinue();if(!paused)return;({session,questionIndex,locked,hinted,failed}=paused);paused=null;page='home';spell=[];if(locked){next();return}render();window.scrollTo(0,0);readPrompt()}
function showLetter(k){const info=sounds[k],group=soundGroupFor(k),sequence=group.letters;if(paused&&paused.session.questions[paused.questionIndex].target.includes(k))paused.hinted=true;stopAudio();const m=modal(`<div class="row"><span class="pill">${group.title} · ${group.id==='vowels'?'短元音':'基础读法'}</span><button class="quiet small" data-close>关闭 ×</button></div><div class="huge-letter" style="text-align:center;font-size:100px">${k.toUpperCase()} ${k}</div><div class="sound-label" style="text-align:center">/ ${info.ipa} /</div><p>${info.hint}</p><div class="study-actions"><button class="primary" id="letter-hear">🔊 再听字母音</button><button class="secondary" id="letter-word">听例词 ${info.word}</button></div>${mouthBlock(k)}<p style="text-align:center">${info.icon} ${info.word} · ${info.meaning}</p>${k==='q'||k==='x'?'<p class="notice">此处为两个音的组合分音示范。请同时听例词，感受自然衔接。</p>':''}<div class="row"><button id="letter-prev" class="secondary">← 上一个</button><button id="letter-next" class="secondary">下一个 →</button></div><p class="muted">先听、再模仿，可以反复点。学完关闭卡片，继续选字母或返回刚才的练习。</p>`);$('#letter-hear').onclick=()=>{const box=document.querySelector('.mouth-box');if(box)mouthAnim(box,mouthShapes[k],650);playSound(k)};bindMouth(m);$('#letter-word').onclick=()=>playWord(info.word);$('#letter-prev').onclick=()=>showLetter(sequence[(sequence.indexOf(k)+sequence.length-1)%sequence.length]);$('#letter-next').onclick=()=>showLetter(sequence[(sequence.indexOf(k)+1)%sequence.length]);m.onclose=()=>stopAudio();{const box=m.querySelector('.mouth-box');if(box)mouthAnim(box,mouthShapes[k],650)}playSound(k)}

const phaseLabels={learn:'学',read:'读',check:'评',practice:'练'};
function flowSteps(phase){return `<div class="flow-steps" aria-label="学读评练流程">${Object.entries(phaseLabels).map(([k,v])=>`<span class="${phase===k?'current':''}"><b>${v}</b>${{learn:'听懂示范',read:'自己开口',check:'看清薄弱项',practice:'针对性巩固'}[k]}</span>`).join('')}</div>`}
// ---------- 成长可见 ----------
// 只把已有的练习记录翻出来显示，不改任何掌握标准与教学逻辑。
// 旧记录迁移：v5.8 之前“学完”只按“学”环节记，而且阶段 1/2 的课号恒为 6，记到的课是错的。
// 新格式下 completed 与 lessonPhases 必然一致；不一致说明是旧记录或损坏记录，重建。
// 能核实的才留：阶段 2/3 的学/读/评按课号留，阶段 3 的“练”分不清是单课练习还是多课复习，不留；
// 旧 completed 里 7–26 号是阶段 3 的“学”，只算“学”；0–6 号无法对应到具体哪一课，丢弃。
// 迁移后 completed 只保留四环节齐全的课；其余环节要重新练一遍才算。
function migrateLessonPhases(){
 const lp=state.lessonPhases&&typeof state.lessonPhases==='object'?state.lessonPhases:null;
 if(lp&&state.completed.every(l=>(lp[l]||[]).length===4))return false;
 const rebuilt={};
 const mark=(lesson,phase)=>{
  if(!Number.isInteger(lesson)||lesson<0||lesson>=lessons.length)return;
  if(!['learn','read','check'].includes(phase))return;
  const a=rebuilt[lesson]||(rebuilt[lesson]=[]);
  if(!a.includes(phase))a.push(phase);
 };
 if(lp)for(const [k,a]of Object.entries(lp)){const idx=+k;if(Number.isInteger(idx)&&idx>=0&&idx<lessons.length&&Array.isArray(a))for(const p of a)mark(idx,p)}
 for(const s of state.sessions||[]){
  if(!s)continue;
  if(s.stage===2)mark(3,s.phase);
  else if(s.stage===3)mark(s.lesson,s.phase);
 }
 for(const l of state.completed||[]){if(Number.isInteger(l)&&l>=7&&l<lessons.length)mark(l,'learn')}
 state.lessonPhases=rebuilt;
 state.completed=Object.keys(rebuilt).map(Number).filter(l=>FOUR_PHASES.every(p=>rebuilt[l].includes(p)));
 return true;
}
function sanitizeLessonPhases(v){
 if(!v||typeof v!=='object'||Array.isArray(v))return undefined;
 const out={};
 for(const [k,a]of Object.entries(v)){
  const idx=+k;
  if(!Number.isInteger(idx)||idx<0||idx>=lessons.length||!Array.isArray(a))continue;
  const phases=[...new Set(a.filter(p=>FOUR_PHASES.includes(p)))];
  if(phases.length)out[idx]=phases;
 }
 return out;
}
function reviewTargets(){
 const candidates=[...knownAt(lessons.length-1),...wordsAt(lessons.length-1)];
 return candidates.filter(t=>state.stats[t]&&(targetWeakness(t,state.stats,state.skillStats)||(state.stats[t].due||0)<=Date.now()));
}
function growthCounts(){
 const letters=Object.keys(sounds);
 const done=letters.filter(k=>{const s=state.stats[k];return s&&mastery(s)}).length;
 const due=reviewTargets().length;
 const last=Math.max(state.foundationRecords.length?state.foundationRecords[state.foundationRecords.length-1].at:0,state.btLastPlay||0)||null;
 return {done,total:letters.length,due,completed:completedCount(),lessons:lessons.length,last};
}
function letterGrowth(letter){
 const s=state.stats[letter];
 const idx=lessons.findIndex(l=>l.newSounds.includes(letter));
 if(s&&mastery(s))return {k:'done',label:'✓ 已掌握'};
 if(s&&s.due&&s.due<=Date.now())return {k:'due',label:'⏰ 待复习'};
 if(s&&targetWeakness(letter,state.stats,state.skillStats))return {k:'weak',label:'需巩固'};
 if(idx>=0&&state.completed.includes(idx))return {k:'learned',label:'✓ 已完成'};
 if(idx>=0){const n=(state.lessonPhases[idx]||[]).length;if(n>0)return {k:'partial',label:`已完成 ${n}/4 环节`}}
 if(s&&s.attempts>0)return {k:'tried',label:'练过'};
 return {k:'todo',label:'未开始'};
}
function stageGrowth(id){
 if(id===0){const n=state.foundationRecords.filter(r=>r.stage===0).length;return n?`已检查 ${n} 轮`:'还没检查'}
 if(id===1){const n=state.completed.filter(i=>i>=0&&i<=6).length;return `已学完 ${n}/7 课`}
 if(id===2){const n=state.foundationRecords.filter(r=>r.stage===2).length;const ev=Object.keys(state.unitProgress).some(k=>k.startsWith('2:'));return (n?`已练 ${n} 轮`:'还没练')+(ev?' · 可进下一阶段':'')}
 const n=state.completed.filter(i=>i>=7).length;return `已学完 ${n}/20 课`;
}
function todayNext(){
 const g=growthCounts(),nx=growthNext();
 const pct=Math.round(g.completed/g.lessons*100);
 return `<div class="section-head"><h2>今天练什么</h2><span>已学完 ${g.completed}/${g.lessons} 课</span></div><div class="growth-next"><div><strong>下一步</strong><p class="muted">${nx.label}</p></div><button class="primary" id="growth-next">开始 →</button></div><div class="progress"><i style="width:${pct}%"></i></div>`;
}
function growthStatsHTML(){
 const g=growthCounts();
 return `<section class="growth-strip"><div class="growth-stat"><strong>${g.completed}/${g.lessons} 课</strong><span>已学完的课</span></div><div class="growth-stat"><strong>${g.done}/${g.total} 个音</strong><span>已掌握（跨日证据）</span></div><div class="growth-stat"><strong>${g.due} 个</strong><span>待复习</span></div><div class="growth-stat"><strong>${g.last?new Date(g.last).toLocaleDateString('zh-CN'):'—'}</strong><span>最近一次练习</span></div></section>`;
}
function growthNext(){
 const c=growthCounts();
 if(c.due>0)return {label:`复习到期内容（${c.due} 个）`,run:()=>startReview()};
 const next=lessons.findIndex((l,i)=>!state.completed.includes(i));
 if(next<0)return {label:'全部课程已学完 · 去看能力档案',run:()=>nav('progress')};
 const lesson=lessons[next];
 const done=state.lessonPhases[next]||[];
 const phase=FOUR_PHASES.find(p=>!done.includes(p))||'learn';
 const label=`继续第 ${next+1} 课：${lesson.title} · ${phaseLabels[phase]}环节`;
 if(next<=6){
  if(lesson.newSounds.length)return {label,run:()=>startFoundation(1,phase,{focus:lesson.newSounds[0]})};
  return {label,run:()=>startFoundation(2,phase,{})};
 }
 return {label,run:()=>startFoundation(3,phase,{lessonIndex:next})};
}
function foundationHome(){return `<section class="foundation-home"><div class="section-head"><h2>把基础，一步步练扎实</h2><span>四个阶段 · 全部开放</span></div><div class="stage-mini-grid">${foundationStages.map(st=>`<button class="stage-mini" data-open-stage="${st.id}"><span>${st.icon}</span><strong>${st.id}. ${st.title}</strong><small>${st.id===0?'先看看哪里需要补':'学 → 读 → 评 → 练'}</small><small class="stage-progress">${stageGrowth(st.id)}</small></button>`).join('')}</div></section>`}
function courses(){return `<div class="title-row"><div><div class="eyebrow">BUILD STRONG FOUNDATIONS</div><h1>成长课程</h1><p>今天练什么，一目了然；26 个字母的小路，一步一步走过去。</p></div><span class="pill">学 · 读 · 评 · 练</span></div>${todayNext()}${growthPath()}`}
function stageConfig(){if(selectedStage===1)return `<div class="scope-picker"><span>本次重点 · 分区选择</span>${soundGroups.map(group=>`<div class="focus-group"><strong>${group.title}</strong><div class="scope-buttons">${group.letters.filter(k=>['s','a','t','p','i','n'].includes(k)).map(k=>`<button class="small ${stageFocus===k?'primary':'secondary'}" data-focus="${k}">${k} /${sounds[k].ipa}/</button>`).join('')}</div></div>`).join('')}<div class="scope-buttons"><button class="small ${stageFocus==='all'?'primary':'secondary'}" data-focus="all">已学六个音综合练习</button></div></div><div class="lesson-phase-row"><span>第一组各课进度</span>${['s','a','t','p','i','n'].map(k=>{const st=letterGrowth(k);return `<span class="pill">${k} · ${st.label}</span>`}).join('')}</div>`;
 if(selectedStage===3)return `<label class="field">本次扩展基础课（按元音 / 辅音查找）<select id="expansion-lesson">${groupedLessons().map(group=>`<optgroup label="${group.title}${group.id==='vowels'?' · 短元音':''}">${group.items.filter(item=>item.index>=7).map(item=>`<option value="${item.index}" ${expansionLesson===item.index?'selected':''}>${item.letter} /${sounds[item.letter].ipa}/ · ${lessons[item.index].title}</option>`).join('')}</optgroup>`).join('')}</select></label><p class="muted">查学按类别分区；合音、拼词会组合此前已学的元音和辅音。第一组的 a、i 等可从下方分类课程进入。</p>`;return ''}

function familiesSection(){
 const fam=wordFamilies.find(f=>f.rime===selectedFamily)||wordFamilies[0];
 const made=(state.familyMade&&state.familyMade[fam.rime])||[];
 const onsets=fam.words.map(w=>w[0]);
 const word=familyWord&&fam.words.includes(familyWord)?familyWord:null;
 const onset=word?word[0]:'';
 return `<section class="panel families-panel" style="margin-top:20px">
  <div class="section-head"><h2>词族 · 换首字母变新词</h2><span>扩展的新玩法</span></div>
  <p class="muted">先选一个词尾，再换开头的字母，变出新词。每个新词都能听一听、看意思。</p>
  <div class="family-picker">${wordFamilies.map(f=>{
   const n=((state.familyMade&&state.familyMade[f.rime])||[]).length;
   return `<button class="family-chip ${f.rime===fam.rime?'primary':'secondary'}" data-family="${f.rime}">-${f.rime}<small>已拼 ${n}/${f.words.length}</small></button>`;
  }).join('')}</div>
  <div class="family-board">
   <div class="family-rime"><span class="family-rime-text">-${fam.rime}</span><button class="small secondary" data-play-rime="1">🔊 听词尾</button></div>
   <div class="family-onsets">${onsets.map(o=>`<button class="family-onset ${onset===o?'primary':''}" data-onset="${o}">${o}</button>`).join('')}</div>
   ${word?`<div class="family-word"><div class="family-word-big"><button class="family-part onset" data-play-letter="${onset}" aria-label="听开头字母 ${onset} 的音">${onset}</button><button class="family-part rime" data-play-rime="1" aria-label="听词尾 -${fam.rime}">${fam.rime}</button></div><p class="family-word-meaning">${meanings[word]||''}</p><div class="study-actions"><button class="secondary" data-play-family-word="1">🔊 听整词</button><button class="secondary" data-play-family-letters="1">🔊 分音</button></div></div>`:`<p class="muted">点一个开头字母，变出新词。</p>`}
   <div class="family-made"><span class="muted">已拼出 ${made.length}/${fam.words.length} 个词：</span>${made.length?made.map(w=>`<button class="small ${w===word?'primary':'secondary'}" data-family-word="${w}">${w}</button>`).join(''):'<span class="muted">还没有，快拼第一个吧。</span>'}</div>
  </div>
 </section>`;
}
function bindFamilies(){
 document.querySelectorAll('[data-family]').forEach(b=>b.onclick=()=>{selectedFamily=b.dataset.family;familyWord=null;render()});
 document.querySelectorAll('[data-onset]').forEach(b=>b.onclick=async()=>{
  const w=b.dataset.onset+selectedFamily;familyWord=w;
  const fam=wordFamilies.find(f=>f.rime===selectedFamily);
  if(fam&&fam.words.includes(w)){
   const made=state.familyMade||(state.familyMade={});
   const list=made[selectedFamily]||(made[selectedFamily]=[]);
   if(!list.includes(w)){list.push(w);save()}
  }
  render();await playWord(w);
 });
 document.querySelectorAll('[data-family-word]').forEach(b=>b.onclick=()=>{familyWord=b.dataset.familyWord;render();playWord(familyWord)});
 document.querySelectorAll('[data-play-rime]').forEach(b=>b.onclick=()=>playRime(selectedFamily));
 document.querySelectorAll('[data-play-letter]').forEach(b=>b.onclick=()=>playSound(b.dataset.playLetter));
 document.querySelectorAll('[data-play-family-word]').forEach(b=>b.onclick=()=>{if(familyWord)playWord(familyWord)});
 document.querySelectorAll('[data-play-family-letters]').forEach(b=>b.onclick=async()=>{if(!familyWord)return;for(const ch of familyWord){if(!await playSound(ch))break}});
}
function practice(){return `<div class="title-row"><div><div class="eyebrow">PRACTICE WITH A PURPOSE</div><h1>针对性练习</h1><p>选择范围后再练，不把后面的规则提前混进来。</p></div><span class="pill">每轮 ${state.length} 题</span></div><div class="stage-mini-grid">${foundationStages.slice(1).map(t=>`<button class="stage-mini ${t.id===selectedStage?'selected':''}" data-stage="${t.id}"><span>${t.icon}</span><strong>${t.title}</strong><small>${t.range}</small><small class="stage-progress">${stageGrowth(t.id)}</small></button>`).join('')}</div><section class="panel stage-detail">${stageConfig()}<h3>${foundationStages[selectedStage===0?1:selectedStage].title} · 巩固练习</h3><p class="muted">优先练习最近需要提示、尚未完成或到期的内容。听辨、录音、听音拼词和换音交替出现。</p><button class="primary" data-phase="practice">开始 ${state.length} 题专项练习 →</button></section>${selectedStage===3?familiesSection():''}<section style="margin-top:20px"><h3>随时查一个字母音</h3>${soundReference(true)}</section>`}
function bindFoundation(){document.querySelectorAll('[data-open-stage]').forEach(b=>b.onclick=()=>{const id=+b.dataset.openStage;if(id===0){startFoundation(0,'check');return}selectedStage=id;stageFocus=id===1?'s':'all';nav('practice')});document.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{selectedStage=+b.dataset.stage;stageFocus=selectedStage===1?'s':'all';render()});document.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>{stageFocus=b.dataset.focus;if(b.dataset.focus!=='all')playSound(b.dataset.focus);render()});document.querySelectorAll('[data-expansion]').forEach(b=>b.onclick=()=>{selectedStage=3;expansionLesson=+b.dataset.expansion;render();window.scrollTo(0,0)});$('#expansion-lesson')?.addEventListener('change',e=>{expansionLesson=+e.target.value;render()});document.querySelectorAll('[data-phase]').forEach(b=>b.onclick=()=>startFoundation(selectedStage===0&&page==='practice'?1:selectedStage,b.dataset.phase));$('#growth-next')?.addEventListener('click',()=>{const a=growthNext();a.run()});}
function startFoundation(stage,phase,options={}){clearAutoContinue();selectedStage=stage;if(options.focus!==undefined)stageFocus=options.focus;if(options.lessonIndex!==undefined)expansionLesson=options.lessonIndex;if(paused){const m=modal('<h2>开始新一轮练习？</h2><p>之前已答题的记录会保留，暂停的那一轮将结束。</p><div class="study-actions"><button class="secondary" data-close>返回</button><button class="primary" id="new-flow">开始新一轮</button></div>');$('#new-flow').onclick=()=>{paused=null;m.close();startFoundation(stage,phase,options)};return}stopAudio();const scope=foundationScope(stage,options.reviewTargets?lessons.length-1:expansionLesson,stageFocus);const config={lessonIndex:scope.index,focus:stageFocus,seen:state.exposed,skillStats:state.skillStats,...options};const questions=makeFoundationPlan(stage,phase,state.length,state.stats,config);if(!questions.length){toast('当前范围暂无可练内容，请选择其他课程。');return}// 学习起点只由“学”环节向前推进；进练习/复习不改变它。阶段 1 按字母对应的课算（scope.index 恒为 6，不可用）。
if(phase==='learn'){const li=lessonForSession(stage,scope.index,stageFocus);if(li!=null&&li>state.lesson)state.lesson=li}
save();session={stage,phase,config,lesson:scope.index,mode:'foundation',questions,results:[]};questionIndex=0;resetQuestion();render();window.scrollTo(0,0);readPrompt()}
function markExposure(target){if(target.length>1&&!state.exposed.includes(target)){state.exposed.push(target);save()}}
function foundationBody(x,body){
 if(x.type==='namekind')return `<div class="huge-letter">${x.target.toUpperCase()} ${x.target}</div><button id="hear" class="sound-button" aria-label="听题目声音">🔊</button><p class="muted">听一听：这是字母的名称，还是在单词中的音？</p><div class="choices"><button class="secondary" data-kind="name">字母名称</button><button class="secondary" data-kind="sound">字母音</button></div><div class="feedback" id="feedback" aria-live="polite"></div><button id="next" class="primary" hidden>下一项 →</button>`;
 if(x.type==='oralblend')return `<div class="oral-ears">👂</div><p class="sound-hint">先不看文字，听几个分开的音，试着把它们合成一个词。</p><button id="hear" class="primary">🔊 听分开的音</button><button class="secondary" id="oral-answer">家长查看答案 / 示范</button><div id="oral-reveal" class="message" hidden>${x.target} · ${meanings[x.target]}<button id="oral-whole" class="small">听完整词</button></div><div class="assessment"><p>由家长观察是否能合起来；不要求孩子认识这个词的文字。</p><div class="study-actions"><button data-assess="independent" class="primary">自己合出来了</button><button data-assess="assisted">提示后合出来</button><button data-assess="retry" class="quiet">暂时还不会</button></div></div>`;
 if(x.type==='firstsound')return `<div class="oral-ears">👂</div><button id="hear" class="primary">🔊 听单词</button><p class="sound-hint">${meanings[x.word]||''} · 听一听这个词最开头的音，选出对应字母。</p><div class="choices">${x.options.map(v=>`<button class="choice" data-answer="${v}">${v}</button>`).join('')}</div><div id="feedback" class="feedback" aria-live="polite"></div><button id="next" class="primary" hidden>下一题 →</button>`;
 if(x.type==='demoWord')return `<div class="blend-letters">${[...x.target].map(v=>`<button class="blend-letter" data-sound="${v}">${v}</button>`).join('')}</div><p class="sound-hint">先听每个音，再听完整词。短促的辅音不要拖长，不在后面加多余的元音。</p><input class="blend-slider" id="blend-slider" type="range" min="0" max="${x.target.length-1}" step="1" value="0" aria-label="从左向右指读"><div class="study-actions"><button id="blend-play" class="secondary">逐音听一遍</button><button id="hear-word" class="primary">听合起来的词</button></div><div id="meaning" class="muted" hidden>${meanings[x.target]||''}</div><p class="muted">分音与整词分别示范；下一步再自己读。</p><button class="primary" id="demo-next">学过了，下一步 →</button>`;
 if(x.type==='swap')return `<p class="muted">先读 ${x.from}，再看新词。只有一个字母发生了变化。</p><div class="swap-pair"><span>${x.from}</span><span>→</span><strong>${[...x.target].map((c,i)=>c===x.from[i]?c:`<mark>${c}</mark>`).join('')}</strong></div><p class="sound-hint">试着读出右边的新词。家长可以先听，再决定是否需要示范。</p><div class="study-actions"><button class="secondary" id="swap-from">听原词 ${x.from}</button><button class="secondary" id="swap-to">听新词示范</button></div><div class="assessment"><div class="study-actions"><button data-assess="independent" class="primary">独立读出来了</button><button data-assess="assisted">提示后读出来</button><button data-assess="retry" class="quiet">还需要练习</button></div></div>`;
 if(x.type==='record'&&x.transfer)body='<p class="transfer-note">新组合检查：本机学习记录中还没有练过这个词，先自己拼一拼。</p>'+body;
 return body;
}
async function playFoundationPrompt(x){if(x.type==='namekind')return x.sample==='name'?speak(x.target.toUpperCase(),'en-US',true):playSound(x.target);if(x.type==='firstsound')return playWord(x.word);if(x.type==='oralblend'){const current=session,ix=questionIndex;for(const c of x.target){if(session!==current||questionIndex!==ix)return false;if(!await playSound(c))return false}return true}return false}

function bindFoundationStudy(){const x=q();$('#skip-audio')?.addEventListener('click',()=>{if(locked)return;session.results.push({target:x.target,skill:taskSkill(x),skip:true,reason:'audio-unavailable'});next()});$('#demo-next')?.addEventListener('click',next);document.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{if(locked)return;if(!x.audioReady){toast('请先完整听一遍题目声音。');return}locked=true;const right=b.dataset.kind===x.sample;recordResult(right?'independent':'retry','exercise');$('#feedback').textContent=right?'分清楚啦，已记录。':'已记录，后面会帮你区分名称和字母音。';$('#next').hidden=false});$('#oral-answer')?.addEventListener('click',()=>{hinted=true;$('#oral-reveal').hidden=false});$('#oral-whole')?.addEventListener('click',()=>{hinted=true;playWord(x.target)});$('#swap-from')?.addEventListener('click',()=>playWord(x.from));$('#swap-to')?.addEventListener('click',()=>{hinted=true;playWord(x.target)})}
const difficultyLabels={name:'名称与字母音混淆',recall:'需要练习想起对应音',extra:'家长观察到额外加音',missing:'家长观察到漏音或换音',blend:'分音到整词的衔接'};
function assess(result){if(locked)return;if(requiresQuestionAudio(q())&&!q().audioReady){toast('请先完整播放题目声音；加载失败不能判为不会或已会。');return}if(q().type==='record'&&!recordBlob){toast('请先录音，或选择跳过。');return}locked=true;const value=result==='independent'&&hinted?'assisted':result;recordResult(value,'parent');const item=session.results.at(-1);const box=$('#record-assessment')||document.querySelector('.assessment');if(!box){next();return}box.innerHTML=`<div class="evaluation-card"><span class="pill">评 · 家长判定</span><h3>${{independent:'这次自己读出来了',assisted:'提示能帮你完成',retry:'这项加入重点练习'}[value]}</h3><p>${item.difficulty?difficultyLabels[item.difficulty]+'。':''}${value==='independent'?'之后换一种题型，再隔天检查。':'稍后会安排同一内容的听辨、示范和再次开口。'}</p><p class="muted">依据：家长回放观察；未进行自动发音评分。</p><button class="primary" id="evaluation-next">记录好了，继续 →</button></div>`;$('#evaluation-next').onclick=next}
function finish(){
 const s=session;clearAutoContinue();clearRecording();stopAudio();
 const valid=s.results.filter(r=>!r.skip),rows=evaluateEvidence(valid);
 state.sessions.push({at:Date.now(),stage:s.stage,phase:s.phase,lesson:s.lesson,mode:s.mode,count:valid.length,independent:valid.filter(r=>r.result==='independent').length});state.sessions=state.sessions.slice(-200);
 // 本课的环节完成情况：起点检查（阶段 0）与多课复习不属于某一课，不记；四环节齐了才算本课完成。
 const li=s.config?.reviewTargets||s.stage===0?null:lessonForSession(s.stage,s.lesson,s.config?.focus);
 state.foundationRecords.push({stage:s.stage,phase:s.phase,lesson:li,at:Date.now(),rows,results:s.results});state.foundationRecords=state.foundationRecords.slice(-100);
 if(li!=null&&FOUR_PHASES.includes(s.phase)){
  if(!state.lessonPhases||typeof state.lessonPhases!=='object')state.lessonPhases={};
  const list=state.lessonPhases[li]||(state.lessonPhases[li]=[]);
  if(!list.includes(s.phase))list.push(s.phase);
  if(list.length===4&&!state.completed.includes(li))state.completed.push(li);
 }
 const route=nextFoundationRoute(s,state.skillStats),ready=unitEvidenceReady(s,state.skillStats);
 if(s.phase==='practice'&&ready){const key=s.stage+':'+(s.stage===3?s.config.lessonIndex:s.config.focus||'all');state.unitProgress[key]={at:Date.now(),status:'本轮具备进入下一项的证据'};}
 save();session=null;page='courses';selectedStage=s.stage;
 const weak=[...new Set(valid.filter(r=>r.result!=='independent').map(r=>r.target))];
 const advice=s.phase==='learn'?'听过示范不代表已经掌握。接下来先自己开口，再作评估。':route.kind==='retry'?'当前仍有薄弱项、跳过项或独立完成记录不足，建议先补练。':route.kind==='unit'?'本轮具备进入下一项的记录，之后仍会安排跨日复习。':route.kind==='complete'?'基础四阶段的流程已走完，可以继续复习；长期掌握仍需要跨日检查。':'按学、读、评、练继续，不把完成题量当作掌握。';
 const ph=li!=null?(state.lessonPhases[li]||[]):[];
 const phaseLine=li!=null?`<p class="muted">本课进度：${FOUR_PHASES.map(p=>`${phaseLabels[p]}${ph.includes(p)?'✓':'○'}`).join(' ')}（${ph.length}/4 环节）${ph.length===4?' · 本课已完成。完成不等于掌握，字母要独立读 3 次以上、跨 2 天才算掌握。':''}</p>`:'';
 app.innerHTML=shell(`<section class="panel summary"><div class="plant">${ready?'🌳':'🌱'}</div><span class="pill">${foundationStages[s.stage].title} · ${s.stage===0?'起点检查':phaseLabels[s.phase]}</span><h1>${s.phase==='learn'?'学过了，轮到自己读':route.kind==='unit'?'这一小步完成，接着往前走':'先看看这一步的表现'}</h1><p class="muted">${advice}</p><p class="muted">本轮记录 ${valid.length} 项，跳过 ${s.results.length-valid.length} 项。口头结果来自家长判定，自动发音评分尚未接入。</p>${phaseLine}${rows.length?evidenceTable(rows):''}${weak.length?`<div class="message" style="text-align:left;margin:20px 0">建议重点练：${weak.join('、')}。<br>下一轮会优先选这些内容，并变换题型。</div>`:''}<section class="continuation-box"><strong>接下来：${route.label}</strong><p id="auto-status" class="muted">${route.auto&&state.autoContinue?'5秒后继续，可先暂停查看结果。':route.auto?'连续学习已关闭，点按钮继续。':'本页暂停自动继续，由家长决定节奏。'}</p>${route.auto&&state.autoContinue?'<button class="secondary small" id="pause-auto">暂停自动继续</button>':''}</section><div class="study-actions"><button class="primary" id="flow-next">${route.label} →</button><button class="secondary" id="flow-again">再来一轮${phaseLabels[s.phase]||'检查'}</button><button class="quiet" id="flow-back">返回自由选课</button></div><p class="footer-note">连续学习不锁课。你仍可随时从课程页选择其他内容复习。</p></section>`);
 bind();
 const launch=()=>{clearAutoContinue();if(route.kind==='complete'||route.kind==='review'){startReview();return}startFoundation(route.stage,route.phase,{lessonIndex:route.lessonIndex,focus:route.focus})};
 $('#flow-next').onclick=launch;$('#flow-again').onclick=()=>{clearAutoContinue();startFoundation(s.stage,s.phase,{lessonIndex:s.config.lessonIndex,focus:s.config.focus,...(s.config.reviewTargets?{reviewTargets:s.config.reviewTargets}:{})})};$('#flow-back').onclick=()=>nav('courses');
 $('#pause-auto')?.addEventListener('click',()=>pauseAutoContinue());
 window.scrollTo(0,0);if(route.auto&&state.autoContinue)beginAutoContinue(launch);
}

function evidenceTable(rows){return `<div class="table-wrap"><table><thead><tr><th>能力</th><th>检查项</th><th>独立完成</th><th>提示完成</th><th>还需练习</th><th>本次表现</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.label)}</td><td>${r.total}</td><td>${r.independent}</td><td>${r.assisted}</td><td>${r.retry}</td><td>${esc(r.status)}</td></tr>`).join('')}</tbody></table></div>`}
function progress(){const recent=state.foundationRecords.slice(-8).reverse();const rows=evaluateEvidence(state.foundationRecords.flatMap(x=>x.results||[]));return `<div class="title-row"><div><div class="eyebrow">EVIDENCE BEFORE SCORES</div><h1>基础能力档案</h1><p>听得出、自己会读、能够合音、能拼出来，分别记录。</p></div><button class="secondary small" id="export">导出学习记录 ↓</button></div><div class="section-head"><h2>成长总览</h2><span>只看进度，不当作分数</span></div>${growthStatsHTML()}<section class="panel"><h3>按能力看练习结果</h3>${rows.length?evidenceTable(rows):'<p class="muted">先做一次起点检查，了解孩子目前的基础。</p><button class="primary" data-open-stage="0">开始起点检查 →</button>'}<p class="muted">上表累计记录练习表现，不是发音分数，也不把单次正确当作掌握。</p></section><div class="section-head"><h2>最近的学—读—评—练</h2><span>最多显示最近8轮</span></div>${recent.map(r=>`<section class="panel history-entry"><div class="row"><strong>${foundationStages[r.stage]?.title||'基础练习'} · ${phaseLabels[r.phase]||'检查'}</strong><span class="muted">${new Date(r.at).toLocaleString('zh-CN')}</span></div>${r.rows.length?evidenceTable(r.rows):'<p class="muted">已听过示范，下一步自己读。</p>'}</section>`).join('')}<section class="panel" style="margin-top:20px"><h3>哪些内容值得隔天再检查？</h3><p class="muted">独立发音或合音至少有3次独立完成，且分布在2个不同日期，才显示“已有跨日证据”。这仍然不等同于专业发音评测。</p><div class="evidence-chips">${Object.entries(state.skillStats).filter(([k,v])=>k.endsWith('|speaking')||k.endsWith('|blending')||k.endsWith('|transfer')).map(([k,v])=>`<span class="pill">${esc(k.split('|')[0])} · ${v.independent>=3&&new Set(v.days).size>=2?'已有跨日证据':'继续巩固'}</span>`).join('')||'<span class="muted">等待独立读的记录</span>'}</div></section>`}

if(migrateLessonPhases())save();
render();

function installHelp(){const local=!/^https?:$/.test(location.protocol);modal(`<h2>在 iPad 上使用</h2><p>${local?'当前是单文件测试版，可以体验界面和基础练习。添加主屏幕、稳定录音和离线使用需要在线应用地址。':'请用 Safari 打开当前应用，点“分享”，再选择“添加到主屏幕”。以后点主屏幕上的小芽图标即可进入。'}</p><p>第一次录音时允许麦克风访问。请在安静环境中使用，录音只留在当前练习中，不上传。</p><p>学习进度保存在当前设备。需要更换设备前，请在家长中心导出记录。</p><button class="primary" data-close>知道了</button>`)}

function startReview(){const targets=reviewTargets();if(!targets.length){toast('当前没有到期或需要补练的内容，可以自由选择课程复习。');nav('courses');return}startFoundation(3,'practice',{reviewTargets:targets})}

function soundReference(compact=false){return soundGroups.map(group=>`<section class="sound-section ${group.id}"><div class="sound-section-heading"><div><span class="eyebrow">${group.id==='vowels'?'VOWELS':'CONSONANTS'}</span><h2>${group.title}</h2><p>${group.subtitle}</p></div><span class="pill">${group.letters.length} 个字母入口</span></div><div class="${compact?'voice-grid':'alphabet-board'}" aria-label="${group.title}">${group.letters.map(k=>compact?`<button class="voice-tile" data-letter="${k}">${k}<small>/${sounds[k].ipa}/</small></button>`:`<button class="alphabet-tile ${group.id==='vowels'?'vowel-tile':'consonant-tile'}" data-letter="${k}" aria-label="${group.title}：${k}的基础读法"><span class="alphabet-pair">${k.toUpperCase()}<b>${k}</b></span><span class="alphabet-picture" aria-hidden="true">${sounds[k].icon}</span><span class="alphabet-word">${sounds[k].word}</span><span class="alphabet-listen">🔊 /${sounds[k].ipa}/</span></button>`).join('')}</div><p class="group-note">${group.description}</p>${group.future?`<div class="future-vowels"><strong>组合元音</strong><span>${group.future}</span></div>`:''}</section>`).join('')}
function growthPath(){
 const order=alphabet.map(k=>({letter:k,index:lessons.findIndex(l=>l.newSounds.includes(k))})).filter(x=>x.index>=0).sort((a,b)=>a.index-b.index);
 const currentIdx=order.findIndex(({index})=>!state.completed.includes(index));
 const allDone=currentIdx<0;
 const ROW=7,rows=[];
 for(let i=0;i<order.length;i+=ROW)rows.push(order.slice(i,i+ROW));
 return `<div class="section-head"><h2>成长小路</h2><span>26 个字母，一步一步走过去</span></div>
 <p class="muted">亮起来的字母是已经会读的。点一个字母，就去练那一课。</p>
 <div class="growth-path">
 <div class="path-start">🚩 起点</div>
 ${rows.map((row,ri)=>`<div class="path-row${ri%2===1?' reverse':''}">${row.map(({letter,index})=>{
  const i=order.findIndex(x=>x.index===index);
  const s=state.stats[letter];
  const mastered=s&&mastery(s);
  const phList=state.lessonPhases[index]||[];
  const done=phList.length===4||state.completed.includes(index);
  const due=!!s&&(targetWeakness(letter,state.stats,state.skillStats)||(s.due||0)<=Date.now());
  const isCurrent=i===currentIdx;
  const cls=mastered?'mastered':done?'done':phList.length>0?'partial':'todo';
  const dots=FOUR_PHASES.map(p=>`<i class="${phList.includes(p)?'on':''}"></i>`).join('');
  return `<div class="path-stop ${cls}${isCurrent?' current':''}">
   <button class="path-node" data-start="${index}" aria-label="第 ${index+1} 课 ${lessons[index].title}">
    <span class="path-letter">${letter}</span>
    ${mastered?'<span class="path-star">⭐</span>':''}
    ${due?'<span class="path-due" title="待复习"></span>':''}
   </button>
   ${isCurrent?'<span class="path-here">📍 你在这里</span>':''}
   <span class="path-dots" title="学 · 读 · 评 · 练">${dots}</span>
  </div>`}).join('')}</div>`).join('')}
 <div class="path-end">${allDone?'🎉 小路走完啦！26 个字母都会读了。':'🌳 走到路的尽头，26 个字母就都认识了。'}</div>
 </div>`;
}

function clearAutoContinue(){if(autoTimer)clearInterval(autoTimer);autoTimer=null;autoLaunch=null}
function pauseAutoContinue(message='自动继续已暂停，查看完结果后可点按钮继续。'){clearAutoContinue();if($('#auto-status'))$('#auto-status').textContent=message;if($('#pause-auto'))$('#pause-auto').hidden=true}
function beginAutoContinue(launch){if(document.hidden)return;let remaining=5;autoLaunch=launch;autoTimer=setInterval(()=>{remaining--;const status=$('#auto-status');if(!status||document.hidden){pauseAutoContinue('连续学习已暂停。');return}if(remaining<=0){const callback=autoLaunch;clearAutoContinue();callback?.();return}status.textContent=remaining+'秒后继续，可先暂停查看结果。'},1000)}
