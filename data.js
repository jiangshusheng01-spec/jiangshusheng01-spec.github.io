// 全项目统一美式发音（en-US），2026-11-12 用户试听后决定：o=/ɑ/（非英式/ɒ/），e=/ɛ/，r=/ɹ/。
export const alphabet='abcdefghijklmnopqrstuvwxyz'.split('');
export const sounds={
j:{ipa:'dʒ',hint:'舌头靠近上齿龈后部，先阻住气流再放开。发短音，不加元音。',word:'jam',meaning:'果酱',icon:'🍓'},
q:{ipa:'kw',hint:'这里和 u 一起学 qu，通常读 /k/ 接 /w/。q 通常不单独出现。',word:'queen',meaning:'女王',icon:'👑'},
v:{ipa:'v',hint:'上齿轻碰下唇，送气时喉咙振动。',word:'van',meaning:'厢式车',icon:'🚐'},
w:{ipa:'w',hint:'嘴唇先收圆，再自然张开。不要读成字母名称。',word:'web',meaning:'网',icon:'🕸️'},
x:{ipa:'ks',hint:'这里学 box 中的 x，由 /k/ 和 /s/ 两个音组成，不是一个独立音素。',word:'box',meaning:'盒子',icon:'📦'},
y:{ipa:'j',hint:'这里先学 yes 开头的辅音。舌头靠前，顺势滑向后面的元音。',word:'yes',meaning:'是的',icon:'👍'},
z:{ipa:'z',hint:'牙齿靠近，送气同时让喉咙振动，和 /s/ 对照听。',word:'zip',meaning:'拉链',icon:'🤐'},
s:{ipa:'s',hint:'上下牙齿靠近，气流轻轻从中间出来。不要加上额外的元音。',word:'sun',meaning:'太阳',icon:'☀️'},
a:{ipa:'æ',hint:'嘴巴张开，舌头靠前，发短而清楚的音。',word:'apple',meaning:'苹果',icon:'🍎'},
t:{ipa:'t',hint:'舌尖碰上齿龈，然后短促放开。这个音不要拖长。',word:'tap',meaning:'轻拍',icon:'👋'},
p:{ipa:'p',hint:'双唇先闭上，再轻轻放开。短促发音，不要加元音。',word:'pan',meaning:'平底锅',icon:'🍳'},
i:{ipa:'ɪ',hint:'嘴巴稍微张开，发短音。不要读成字母名称。',word:'in',meaning:'在里面',icon:'📦'},
n:{ipa:'n',hint:'舌尖抵住上齿龈，让声音从鼻腔出来。',word:'nap',meaning:'小睡',icon:'😴'},
m:{ipa:'m',hint:'双唇闭上，声音从鼻腔出来，可以轻轻延长。',word:'map',meaning:'地图',icon:'🗺️'},
d:{ipa:'d',hint:'舌尖碰上齿龈，再短促放开，喉咙会振动。',word:'dad',meaning:'爸爸',icon:'👨'},
g:{ipa:'ɡ',hint:'舌头后部抬起，再短促放开。这里先学它在 gap 中的音。',word:'gap',meaning:'缝隙',icon:'↔️'},
o:{ipa:'ɑ',hint:'这里先学美式短元音：嘴巴张开，嘴唇略圆。',word:'on',meaning:'在上面',icon:'🔝'},
c:{ipa:'k',hint:'舌头后部抬起，再短促放开。这里先学 cat 中的音。',word:'cat',meaning:'猫',icon:'🐈'},
k:{ipa:'k',hint:'和本阶段 c 的音相同，短促放开，不加元音。',word:'kit',meaning:'成套用品',icon:'🧰'},
e:{ipa:'ɛ',hint:'嘴巴半开，舌头靠前，短短地发音。',word:'net',meaning:'网',icon:'🥅'},
u:{ipa:'ʌ',hint:'嘴巴自然张开，发短音。这里先学 cup 中的音。',word:'cup',meaning:'杯子',icon:'☕'},
r:{ipa:'ɹ',hint:'舌尖卷起，靠近上齿龈但不碰到，带声音。先模仿例词开头。',word:'rat',meaning:'老鼠',icon:'🐀'},
h:{ipa:'h',hint:'嘴巴自然张开，轻轻呼气。',word:'hat',meaning:'帽子',icon:'🎩'},
b:{ipa:'b',hint:'双唇闭上再放开，喉咙振动，发音短促。',word:'bat',meaning:'球棒',icon:'🏏'},
f:{ipa:'f',hint:'上齿轻碰下唇，轻轻送气，可以延长。',word:'fan',meaning:'风扇',icon:'🪭'},
l:{ipa:'l',hint:'舌尖轻抵上齿龈，模仿单词开头的声音。',word:'lap',meaning:'大腿前部',icon:'🪑'}
};
export const lessons=[
{id:'s',title:'听见小蛇的声音',newSounds:['s'],words:[],tag:'第一个声音'},
{id:'a',title:'张开嘴，认识 a',newSounds:['a'],words:[],tag:'再学一个音'},
{id:'t',title:'短短的 t',newSounds:['t'],words:[],tag:'三个音啦'},
{id:'at',title:'把声音连起来',newSounds:[],words:['at','sat'],tag:'第一次合音'},
{id:'p',title:'加入 p，拼更多词',newSounds:['p'],words:['pat','tap'],tag:'听音与合音'},
{id:'i',title:'认识短音 i',newSounds:['i'],words:['it','sit','tip','pit'],tag:'换一个元音'},
{id:'n',title:'六个音的小世界',newSounds:['n'],words:['in','an','nap','pan','pin','tin','tan','nip'],tag:'第一组复习'},
{id:'m',title:'闭上嘴，轻轻 m',newSounds:['m'],words:['am','mat','map','man'],tag:'继续发现'},
{id:'d',title:'认识 d',newSounds:['d'],words:['dad','sad','mad','dip','did'],tag:'短音练习'},
{id:'g',title:'认识 g',newSounds:['g'],words:['gap','tag','pig','dig'],tag:'小猪来啦'},
{id:'o',title:'圆圆嘴，短音 o',newSounds:['o'],words:['on','not','pot','top','dot','dog'],tag:'第三个短元音'},
{id:'c',title:'认识 c 的一个音',newSounds:['c'],words:['cat','cap','can','cot','cop'],tag:'小猫来啦'},
{id:'k',title:'同一个音，不同字母',newSounds:['k'],words:['kit','kid'],tag:'认识 k'},
{id:'e',title:'认识短音 e',newSounds:['e'],words:['net','ten','pen','pet','get','peg'],tag:'听清元音'},
{id:'u',title:'认识短音 u',newSounds:['u'],words:['up','cup','cut','sun','sum','mud','pup'],tag:'五个短元音'},
{id:'r',title:'认识开头的 r',newSounds:['r'],words:['rat','ram','rip','run','red'],tag:'读出新词'},
{id:'h',title:'轻轻呼气 h',newSounds:['h'],words:['hat','ham','hot','hop','hen','hug'],tag:'轻声练习'},
{id:'b',title:'认识 b',newSounds:['b'],words:['bat','bag','bed','big','bin','bus'],tag:'辨音练习'},
{id:'f',title:'认识 f',newSounds:['f'],words:['fan','fat','fin','fit','fun','fed'],tag:'听清开头'},
{id:'l',title:'认识 l',newSounds:['l'],words:['lap','lip','leg','let','log','lot'],tag:'基础拼读复习'},
{id:'j',title:'认识 j',newSounds:['j'],words:['jam','jet','jug','jog'],tag:'基础辅音'},
{id:'v',title:'认识 v',newSounds:['v'],words:['van','vet','vat'],tag:'基础辅音'},
{id:'w',title:'认识 w',newSounds:['w'],words:['web','wet','win','wig'],tag:'基础辅音'},
{id:'y',title:'认识 y 的开头音',newSounds:['y'],words:['yes','yet','yam'],tag:'先学常见辅音读法'},
{id:'z',title:'认识 z',newSounds:['z'],words:['zip','zap'],tag:'基础辅音'},
{id:'x',title:'认识 x 的常见读法',newSounds:['x'],words:[],tag:'特别说明：/k/ 与 /s/ 两个音'},
{id:'q',title:'认识 q 与 qu',newSounds:['q'],words:[],tag:'特别说明：q 通常与 u 一起出现'}
];
export const meanings={jam:'果酱',jet:'喷气式飞机',jug:'水壶',jog:'慢跑',van:'厢式车',vet:'兽医',vat:'大桶',web:'网',wet:'湿的',win:'获胜',wig:'假发',yes:'是的',yet:'还；尚',yam:'薯蓣',zip:'拉链',zap:'快速击中',at:'在……处',sat:'坐下了',pat:'轻拍',tap:'轻拍',it:'它',sit:'坐',tip:'尖端',pit:'坑',in:'在里面',an:'一个',nap:'小睡',pan:'平底锅',pin:'别针',tin:'金属罐',tan:'棕褐色',nip:'轻咬',am:'是（与 I 连用）',mat:'垫子',map:'地图',man:'男人',dad:'爸爸',sad:'难过的',mad:'生气的',dip:'蘸一下',did:'做了',gap:'缝隙',tag:'标签',pig:'猪',dig:'挖',on:'在上面',not:'不',pot:'锅',top:'顶部',dot:'圆点',dog:'狗',cat:'猫',cap:'帽子',can:'罐子；能够',cot:'小床',cop:'警察（口语）',kit:'成套用品',kid:'小孩',net:'网',ten:'十',pen:'钢笔',pet:'宠物',get:'得到',peg:'夹子',up:'向上',cup:'杯子',cut:'切',sun:'太阳',sum:'总数',mud:'泥',pup:'小狗',rat:'老鼠',ram:'公羊',rip:'撕开',run:'跑',red:'红色',hat:'帽子',ham:'火腿',hot:'热的',hop:'单脚跳',hen:'母鸡',hug:'拥抱',bat:'球棒',bag:'包',bed:'床',big:'大的',bin:'垃圾桶',bus:'公共汽车',fan:'风扇',fat:'胖的',fin:'鱼鳍',fit:'合适',fun:'乐趣',fed:'喂过了',lap:'大腿前部',lip:'嘴唇',leg:'腿',let:'让',log:'木头',lot:'很多（用于词组）',sap:'树液',sip:'抿一小口'};
export const wordFamilies=[
 {rime:'at',words:['cat','bat','hat','mat','sat','rat','fat','pat']},
 {rime:'an',words:['can','fan','man','pan','tan','van']},
 {rime:'ap',words:['cap','gap','map','nap','sap','tap']},
 {rime:'og',words:['dog','log','jog']},
 {rime:'it',words:['sit','pit','fit','kit']},
 {rime:'et',words:['pet','net','jet','wet']},
 {rime:'in',words:['pin','tin','win','fin']},
 {rime:'ip',words:['lip','rip','sip','tip']},
];
export function knownAt(index){return [...new Set(lessons.slice(0,index+1).flatMap(x=>x.newSounds))]}
// 自由拼读台：把格子里的字母拼成一个词；是不是真词只看词库里有没有。
export function blendWord(slots){return slots.filter(Boolean).join('')}
export function isRealWord(w){return w.length>1&&Object.prototype.hasOwnProperty.call(meanings,w)}
export function wordsAt(index){return lessons.slice(0,index+1).flatMap(x=>x.words)}
export function shuffle(a,random=Math.random){let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
export function mastery(stat){return !!stat && stat.independent>=3 && new Set(stat.days||[]).size>=2}
export function plan(index,mode='mixed',count=12,stats={}){
 const known=knownAt(index),words=wordsAt(index),current=lessons[index];let out=[];
 const due=Object.entries(stats).filter(([k,v])=>!v.due||v.due<=Date.now()).map(([k])=>k).filter(k=>k.length===1?known.includes(k):words.includes(k));
 const pool=mode==='review'&&due.length?due:[...current.newSounds,...current.words,...known,...words];
 for(let i=0;i<count;i++){
 const target=pool[i%pool.length];let type;
 if(mode==='record')type='record';
 else if(mode==='spell')type=target.length>1?'spell':'listen';
 else if(mode==='listen')type='listen';
 else type=target.length===1?['listen','sound','record'][i%3]:['listen','blend','spell','record'][i%4];
 if(type==='listen'&&target.length===1&&known.length<2)type='sound';
 const choices=target.length===1?known:words.filter(w=>w.length===target.length);
 if(type==='listen'&&choices.length<2)type=target.length===1?'sound':'spell';
 out.push({target,type,options:shuffle([target,...shuffle(choices.filter(x=>x!==target)).slice(0,3)])});
 }
 return out;
}

// Four foundational stages. All routes remain available for parent-directed review.
export const foundationStages=[
 {id:0,title:'起点检查',icon:'🧭',description:'看看字母名称、字母音、听辨和口头合音，哪些已会，哪些需要补。',range:'不教学、不计闯关分数',index:6},
 {id:1,title:'第一组字母音',icon:'🔤',description:'练熟 s、a、t、p、i、n。听得出，也能看着字母自己发音。',range:'s · a · t · p · i · n',index:6},
 {id:2,title:'初步合音',icon:'🧩',description:'把已学音合成 at、in、sat、pin、tap 等词，再试没有刚刚示范过的组合。',range:'第一组声音的短词',index:6},
 {id:3,title:'扩展基础字母音',icon:'🌳',description:'逐步补充常见辅音和五个短元音，练三音词、听音拼词和换音。',range:'基础字母音与简单短词',index:lessons.length-1}
];
export const skillNames={naming:'名称与字母音',listening:'听音辨认',speaking:'独立发音',blending:'合音',segmenting:'听音拼词',transfer:'新组合拼读',changing:'换音'};
export function foundationScope(stage,lessonIndex=7,focus='all'){
 const index=stage===3?Math.max(7,Math.min(lessons.length-1,lessonIndex)):6;
 const letters=stage===3?knownAt(index):['s','a','t','p','i','n'];
 const targets=stage===3?lessons[index].newSounds:letters;
 return {index,letters,targets:focus!=='all'&&targets.includes(focus)?[focus]:targets,words:wordsAt(index)};
}
// 一节课的四个环节：学、读、评、练。课的完成以四个环节都做完为准，完成不等于掌握。
export const FOUR_PHASES=['learn','read','check','practice'];
// 一次练习属于哪一课：stage 3 的课号就是 scope.index；stage 2 是 at 课（第 4 课，index 3）；
// stage 1/2 的 scope.index 恒为 6，不能当课号，阶段 1 按 focus 字母对应的课算；
// 阶段 0 是起点检查、阶段 1 的综合练习（focus 为 all）不属于某一课，返回 null。
export function lessonForSession(stage,lesson,focus){
 if(stage===3&&Number.isInteger(lesson))return lesson;
 if(stage===2)return 3;
 if(stage===1&&focus&&focus!=='all'){
  const idx=lessons.findIndex(l=>l.newSounds.includes(focus));
  if(idx>=0)return idx;
 }
 return null;
}
export function taskSkill(task){return task.skill||({listen:'listening',record:task.target.length===1?'speaking':'blending',spell:'segmenting',swap:'changing',oralblend:'blending',namekind:'naming',firstsound:'listening'})[task.type]||'speaking'}
export function taskOptions(target,pool){return shuffle([target,...shuffle(pool.filter(x=>x!==target)).slice(0,3)])}
export function makeFoundationPlan(stage,phase,count=12,stats={},config={}){
 const {index,letters,targets,words}=foundationScope(stage,config.lessonIndex,config.focus);
 const seen=new Set(config.seen||[]), soundStages=stage===1||stage===3;
 const make=(target,type,extra={})=>({target,type,skill:taskSkill({target,type}),options:taskOptions(target,target.length===1?letters:words.filter(w=>w.length===target.length)),...extra});
 if(stage===0)return [make('s','namekind',{sample:'name'}),make('a','namekind',{sample:'sound'}),make('t','namekind',{sample:'sound'}),make('n','namekind',{sample:'name'}),...shuffle(['s','a','t','p','i','n']).map(t=>make(t,'listen')),...['s','a'].map(t=>make(t,'record')),make('at','oralblend'),make('in','oralblend'),make('sat','record'),make('pin','record')];
 const taughtWords=stage===1?[]:stage===2?['at','in','sat','pin','tap']:lessons[index].words;
 if(phase==='learn')return soundStages?[...targets.map(t=>make(t,'teach')),...taughtWords.slice(0,2).map(t=>make(t,'demoWord'))]:taughtWords.map(t=>make(t,'demoWord'));
 if(phase==='read')return (soundStages?targets:taughtWords).map(t=>make(t,'record'));
 if(phase==='check'){
  if(soundStages)return [...shuffle(targets).map(t=>make(t,'listen')),...shuffle(targets).map(t=>make(t,'record')),...shuffle(taughtWords).slice(0,3).map(t=>make(t,'record'))];
  const unseen=shuffle(words.filter(w=>!seen.has(w)&&!taughtWords.includes(w)));
  const pool=[...unseen,...shuffle(words.filter(w=>!unseen.includes(w)&&!taughtWords.includes(w)))].slice(0,6);
  return pool.map(t=>make(t,'record',{skill:seen.has(t)?'blending':'transfer',transfer:!seen.has(t)}));
 }
 let base=soundStages?[...targets,...taughtWords]:words;
 if(config.reviewTargets)base=[...new Set(config.reviewTargets)].filter(t=>[...letters,...words].includes(t));
 if(!base.length)return [];
 // 练（practice）混编：只练一个字母时，12 道题目标全是同一个字母，孩子不用听音分辨、总点同一个答案。
 // 把前面学过的字母（按学习顺序在 focus 之前、且孩子已接触过）也放进目标池：focus 仍占一半，
 // 其余由前面学过的字母分摊，孩子必须听音分辨才能选对。第一个字母（无前面可混）保持不变。
 if(soundStages&&!config.reviewTargets){
  const letterTargets=[...new Set(base.filter(t=>t.length===1))];
  if(letterTargets.length===1){
   const focus=letterTargets[0],focusPos=letters.indexOf(focus);
   const known=new Set([...(config.seen||[]),...Object.keys(stats)]);
   const earlier=focusPos>0?letters.slice(0,focusPos).filter(l=>known.has(l)):[];
   if(earlier.length){
    const focusCount=Math.ceil(count/2),rest=count-focusCount;
    const mixed=[];
    for(let k=0;k<focusCount;k++)mixed.push(focus);
    for(let k=0;k<rest;k++)mixed.push(earlier[k%earlier.length]);
    base=[...mixed,...base.filter(t=>t.length>1)];
   }
  }
 }
 const skillStats=config.skillStats||{};
 const weak=base.filter(t=>targetWeakness(t,stats,skillStats)||((stats[t]?.due??Infinity)<=Date.now()));
 const pool=[...weak,...shuffle(base.filter(t=>!config.reviewTargets||weak.includes(t)))];
 if(!pool.length)return [];
 const out=[],occurrences=new Map();
 for(let i=0;i<count;i++){
  const t=pool[i%pool.length],turn=occurrences.get(t)||0;occurrences.set(t,turn+1);
  let type=t.length===1?['listen','record','firstsound'][turn%3]:['spell','record','swap'][turn%3];
  const from=shuffle(words.filter(w=>w.length===t.length&&[...w].filter((c,j)=>c!==t[j]).length===1))[0];
  const initial=shuffle(words.filter(w=>w.startsWith(t)&&t.length===1))[0];
  const issue=targetWeakness(t,stats,skillStats);
  if(issue?.skill==='speaking')type=turn%3===0?'record':turn%3===1?'listen':'record';
  if(['blending','transfer'].includes(issue?.skill)&&t.length>1)type=turn%2===0?'demoWord':'record';
  if(issue?.skill==='segmenting'&&t.length>1)type=turn%2===0?'spell':'record';
  if(issue?.skill==='naming'&&t.length===1)type='namekind';
  if(issue?.skill==='listening')type=turn%2===0?'listen':t.length===1?'firstsound':'spell';
  if(type==='swap'&&!from)type='spell';if(type==='firstsound'&&!initial)type='listen';
  if((issue?.difficulty==='name'||(!issue&&stats[t]?.lastIssue==='name'))&&t.length===1&&turn%2===0)type='namekind';
  if((issue?.difficulty==='blend'||(!issue&&stats[t]?.lastIssue==='blend'))&&t.length>1&&turn%2===0)type='demoWord';
  out.push(make(t,type,{...(type==='swap'?{from}:{}),...(type==='firstsound'?{word:initial}:{}),...(type==='namekind'?{sample:turn%2===0?'name':'sound'}:{}),remedial:weak.includes(t)}));
 }
 return out;
}
// 今日学习计划（只覆盖第一组 s、a、t、p、i、n；第 0–6 课）。
// 新用户：只出第 1 个音 s 的 2 道题（认识 + 听辨）。
// 有记录：混 1 个新音（听辨引入）+ 最多 2 个到期/薄弱复习 + 1 个简单合音 + 补足到 planLength。
// 出题与干扰项只用 knownAt(6)/wordsAt(6)，不越过家长设定的学习起点。
export function buildMainline(stats={}, skillStats={}, completed=[], lessonPhases={}, planLength=7, lesson=0){
 // 主线：复习旧知识 → 学一个新内容（学/读/评/练四环节收紧成 4 道）→ 用新旧知识拼读 → 结束并记录（总结页）。
 // 已学范围：家长设定的当前学习起点（state.lesson）之内的字母与词，再加本轮新音。
 // v5.16 只覆盖第一组：起点超过第 6 课也只算到第 6 课，不越过第一组去推后面的音。
 const scopeLesson=Math.min(lesson,6);
 const learnedLetters=knownAt(scopeLesson), learnedWords=wordsAt(scopeLesson);
 const firstGroupLessons=[0,1,2,4,5,6];
 let nextSound=null;
 for(const i of firstGroupLessons){
  if(!(completed||[]).includes(i)){
   const l=lessons[i];
   if(l.newSounds&&l.newSounds.length){nextSound=l.newSounds[0];break;}
  }
 }
 const planLetters=[...new Set([...learnedLetters,...(nextSound?[nextSound]:[])])];
 const planWords=[...new Set([...learnedWords,...wordsAt(6).filter(w=>[...w].every(c=>planLetters.includes(c)))])];
 const make=(target,type,extra={})=>({target,type,skill:taskSkill({target,type}),options:taskOptions(target,target.length===1?planLetters:planWords.filter(w=>w.length===target.length)),...extra});
 const hasRecords=(completed&&completed.length>0)||Object.keys(stats||{}).length>0;
 if(!hasRecords) return [make('s','teach'),make('s','listen')];
 // 到期或薄弱的复习项（只在已学范围内），到期优先
 const dueOrWeak=Object.entries(stats||{}).filter(([k,v])=>{
  if(!k) return false;
  const inScope=k.length===1?learnedLetters.includes(k):learnedWords.includes(k);
  if(!inScope) return false;
  return targetWeakness(k,stats,skillStats)||((v.due||0)<=Date.now());
 }).map(([k])=>k);
 // 复习要混编：到期/薄弱优先，但同组内按最久没练的先排（轮换，不总盯着同一个）；
 // 名额有剩时，从已学内容里按最久没练的补（不含本轮新音），让前面学过的都轮到。
 const byOldest=(a,b)=>((stats[a]?.last||0)-(stats[b]?.last||0));
 dueOrWeak.sort((a,b)=>(((stats[a].due||0)<=Date.now()?0:1)-((stats[b].due||0)<=Date.now()?0:1))||byOldest(a,b));
 // 拼读词：计划范围内的三字母词，优先挑未掌握的；课内合音与结尾拼读各挑一个不同的词，都尽量含新音
 const blendCandidates=planWords.filter(w=>w.length===3);
 const pickBlend=(exclude)=>blendCandidates.find(w=>w!==exclude&&(!nextSound||w.includes(nextSound))&&(()=>{const s=stats[w];return !s||s.independent<3})())||blendCandidates.find(w=>w!==exclude&&(!nextSound||w.includes(nextSound)))||blendCandidates.find(w=>w!==exclude);
 const lessonBlend=nextSound?pickBlend(null):null;
 const finalBlend=pickBlend(lessonBlend);
 const out=[];
 // 新课四环节（固定 4 道）：认识新音（学）→ 听辨（读）→ 跟读（评）→ 合音（练）
 const newLesson=[];
 if(nextSound){
  newLesson.push(make(nextSound,'teach'),make(nextSound,'listen'),make(nextSound,'record'));
  if(lessonBlend) newLesson.push(make(lessonBlend,'blend'));
 }
 const finalBlendQ=finalBlend?make(finalBlend,'blend'):null;
 // 复习放最前面当热身，但保证新课 4 道 + 结尾拼读 1 道不被挤掉
 const reviewCount=Math.max(0,Math.min(2,planLength-newLesson.length-(finalBlendQ?1:0)));
 const reviewPool=[...dueOrWeak];
 const rest=[...new Set([...learnedLetters,...learnedWords])].filter(k=>k!==nextSound&&!reviewPool.includes(k)).sort(byOldest);
 reviewPool.push(...rest);
 reviewPool.slice(0,reviewCount).forEach((t,i)=>{
  const type=t.length===1?(i%2===0?'listen':'record'):(i%2===0?'record':'listen');
  out.push(make(t,type));
 });
 out.push(...newLesson);
 if(finalBlendQ) out.push(finalBlendQ);
 // 补足到 planLength：已学字母的听辨，薄弱优先，不重复同一道听辨题
 const fillPool=[...learnedLetters].sort(byOldest);
 let fi=0;
 while(out.length<planLength&&fi<fillPool.length*2){
  const t=fillPool[fi%fillPool.length];
  if(!out.some(q=>q.target===t&&q.type==='listen')) out.push(make(t,'listen'));
  fi++;
 }
 return out.slice(0,planLength);
}
export function evaluateEvidence(records){
 const rows=Object.entries(skillNames).map(([skill,label])=>{const group=records.filter(r=>r.skill===skill&&!r.skip),total=group.length,independent=group.filter(r=>r.result==='independent').length,assisted=group.filter(r=>r.result==='assisted').length;return {skill,label,total,independent,assisted,retry:total-independent-assisted,status:!total?'尚未检查':independent===total?'本次独立完成':independent+assisted===total?'提示后能完成':'建议专项练习'}});
 return rows.filter(r=>r.total);
}

export function targetWeakness(target,stats={},skillStats={}){
 const unresolved=Object.entries(skillStats).filter(([key,v])=>key.startsWith(target+'|')&&v.lastResult&&v.lastResult!=='independent');
 const order=['speaking','blending','transfer','segmenting','changing','naming','listening'];
 unresolved.sort((a,b)=>order.indexOf(a[0].split('|')[1])-order.indexOf(b[0].split('|')[1]));
 if(unresolved.length){const [key,value]=unresolved[0];return {skill:key.split('|')[1],difficulty:value.difficulty||''}}
 const s=stats[target];return s?.lastResult&&s.lastResult!=='independent'?{skill:s.lastSkill||'',difficulty:s.lastIssue||''}:null;
}
export function requiresQuestionAudio(task){return ['listen','spell','namekind','oralblend','firstsound'].includes(task.type)}
// 听音题的整词示范播放序列：单词录音太短（in 只有 0.49 秒、it/at/am 同样不到 0.5 秒），只播一遍 4 岁孩子根本听不清是哪个词。
// 题目里播词一律：整词慢速（0.85 倍）播两遍；两字母短词再加分音（慢速字母音）+ 整词一遍，孩子能听清是哪个词、开头是哪个音。
// 序列是纯数据，播放由 app.js 的 playWordPrompt 按顺序执行；中途切题就停，不继续播后面的。
export function wordPromptSequence(word){
 const steps=[{kind:'word',word,rate:0.85},{kind:'word',word,rate:0.85}];
 if(word.length===2){
  for(const ch of word)steps.push({kind:'letter',letter:ch,slow:true});
  steps.push({kind:'word',word,rate:0.85});
 }
 return steps;
}
export function recordingNeedsHelp({priorHelp=false,hasRecording=false,modelWasHeard=false,restarting=false}){return priorHelp||(restarting?modelWasHeard:!hasRecording)}

// Reference organisation is distinct from the sequence used to learn blending.
export const soundGroups=[
 {id:'vowels',title:'元音区',subtitle:'单元音 · 本版先学五个短元音',letters:['a','e','i','o','u'],description:'先看嘴形、听清声音，再比较不同短元音。',future:'组合元音也归在元音区；按本版只打基础的范围，暂不展开组合元音课程。'},
 {id:'consonants',title:'辅音区',subtitle:'辅音的基础读法',letters:alphabet.filter(k=>!'aeiou'.includes(k)),description:'这里先学辅音的常见读法。y 先学 yes 开头的辅音读法；x、q/qu 的组合读法单独说明。'}
];
export function soundGroupFor(letter){return soundGroups.find(group=>group.letters.includes(letter))}
export function groupedLessons(){return soundGroups.map(group=>({...group,items:group.letters.map(letter=>({letter,index:lessons.findIndex(l=>l.newSounds.includes(letter))})).filter(x=>x.index>=0)}))}

// A completed page is not evidence that a learning unit was mastered.
export function unitEvidenceReady(session,skillStats={}){
 if(session.stage===0||session.config?.reviewTargets)return false;
 if(!session.results?.length)return false;
 // 提示后完成/答错/跳过不卡下一课：孩子做过这轮即可往前走，没掌握的内容由到期/薄弱复习带回来；
 // 下一课的门槛是目标内容已有独立的说+听证据（下面按 skillStats 算），不是本轮全对。
 // （旧口径要求本轮零跳过、零答错、零提示，4 岁孩子几乎每轮都会被提示一次，导致学完一课也拿不到“下一个字母音”，只能回自由选课手动挑。）
 const focus=session.config?.focus||'all';
 const scope=foundationScope(session.stage,session.config?.lessonIndex??session.lesson,focus);
 const independent=(target,skill)=>{const s=skillStats[target+'|'+skill];return s?.lastResult==='independent'&&s.independent>=1};
 if(session.stage===1||session.stage===3){
  if(!scope.targets.every(t=>independent(t,'speaking')&&independent(t,'listening')))return false;
  if(session.stage===3){const words=lessons[scope.index].words;const required=Math.min(2,words.length);if(words.filter(w=>independent(w,'blending')||independent(w,'transfer')).length<required)return false}
  return true;
 }
 const taught=['at','in','sat','pin','tap'];
 const transfers=Object.entries(skillStats).filter(([k,v])=>k.endsWith('|transfer')&&scope.words.includes(k.split('|')[0])&&v.lastResult==='independent'&&v.independent>=1);
 const noUnseenLeft=scope.words.every(w=>(session.config?.seen||[]).includes(w));
 const mixedReviews=scope.words.filter(w=>!taught.includes(w)&&(independent(w,'blending')||independent(w,'transfer')));
 const transferEvidence=new Set(transfers.map(([k])=>k.split('|')[0])).size>=2||(noUnseenLeft&&mixedReviews.length>=2);
 return taught.every(w=>independent(w,'blending')||independent(w,'transfer'))&&transferEvidence;
}
export function nextFoundationRoute(session,skillStats={}){
 const stage=session.stage,phase=session.phase,focus=session.config?.focus||'all',lessonIndex=session.config?.lessonIndex??session.lesson;
 if(session.config?.reviewTargets)return {kind:'review',label:'继续到期与薄弱项复习',auto:false};
 if(stage===0)return {kind:'phase',stage:1,phase:'learn',focus:'s',lessonIndex:7,label:'第一组字母音 · 学 s',auto:false};
 const nextPhase={learn:'read',read:'check',check:'practice'}[phase];
 if(nextPhase)return {kind:'phase',stage,phase:nextPhase,focus,lessonIndex,label:'下一步：'+{read:'自己读并录音',check:'分项检查',practice:'针对性练习'}[nextPhase],auto:true};
 if(!unitEvidenceReady(session,skillStats))return {kind:'retry',stage,phase:'practice',focus,lessonIndex,label:'再练不熟的内容',auto:false};
 if(stage===1){
  const sequence=['s','a','t','p','i','n'];const i=sequence.indexOf(focus);
  if(i>=0&&i<sequence.length-1)return {kind:'unit',stage:1,phase:'learn',focus:sequence[i+1],lessonIndex:7,label:'下一个字母音：'+sequence[i+1],auto:true};
  if(focus!=='all')return {kind:'unit',stage:1,phase:'check',focus:'all',lessonIndex:7,label:'第一组六个音 · 综合检查',auto:true};
  return {kind:'unit',stage:2,phase:'learn',focus:'all',lessonIndex:7,label:'初步合音 · 学着连起来读',auto:true};
 }
 if(stage===2)return {kind:'unit',stage:3,phase:'learn',focus:'all',lessonIndex:7,label:'扩展基础字母音 · 学 m',auto:true};
 if(stage===3&&lessonIndex<lessons.length-1){const i=lessonIndex+1;return {kind:'unit',stage:3,phase:'learn',focus:'all',lessonIndex:i,label:'下一基础课：'+lessons[i].title,auto:true}}
 return {kind:'complete',label:'四阶段已走完，转入日常复习',auto:false};
}

// 嘴型简笔画参数（正面嘴型）：jaw 张口 0-1，width 嘴宽 0-1，round 撅嘴 0-1，
// teeth 露上牙，tongue 舌尖上抬，closed 起始闭唇，air 气流，note 看哪里。
export const mouthShapes = {
 a:{jaw:0.95,width:1,round:0,teeth:0,tongue:0,closed:0,air:0,note:'嘴张到最大，舌头放平，短促的啊' },
 b:{jaw:0.5,width:0.8,round:0,teeth:0,tongue:0,closed:1,air:0,note:'双唇先闭紧，再一下打开' },
 c:{jaw:0.6,width:0.8,round:0,teeth:0,tongue:0,closed:0,air:0,note:'嘴张开，舌根抬起来顶住，再放开' },
 d:{jaw:0.4,width:0.85,round:0,teeth:0,tongue:1,closed:0,air:0,note:'舌尖顶住上牙后面，再放开' },
 e:{jaw:0.55,width:0.9,round:0,teeth:0,tongue:0,closed:0,air:0,note:'嘴张一半，舌头放平' },
 f:{jaw:0.25,width:0.8,round:0,teeth:1,tongue:0,closed:0,air:1,note:'上牙轻轻咬住下唇，吹气' },
 g:{jaw:0.6,width:0.8,round:0,teeth:0,tongue:0,closed:0,air:0,note:'嘴张开，舌根抬起来，再放开' },
 h:{jaw:0.5,width:0.8,round:0,teeth:0,tongue:0,closed:0,air:1,note:'嘴张开，轻轻哈一口气' },
 i:{jaw:0.3,width:1,round:0,teeth:0,tongue:0,closed:0,air:0,note:'嘴角往两边咧开，嘴只张一点点' },
 j:{jaw:0.45,width:0.8,round:0.3,teeth:0,tongue:0,closed:0,air:0,note:'嘴唇微微往前，舌头顶住上颚再放开' },
 k:{jaw:0.6,width:0.8,round:0,teeth:0,tongue:0,closed:0,air:0,note:'嘴张开，舌根抬起来顶住，再放开' },
 l:{jaw:0.4,width:0.85,round:0,teeth:0,tongue:1,closed:0,air:0,note:'舌尖顶住上牙后面，气从舌头两边出来' },
 m:{jaw:0.3,width:0.8,round:0,teeth:0,tongue:0,closed:1,air:0,note:'双唇闭紧，声音从鼻子出来' },
 n:{jaw:0.35,width:0.85,round:0,teeth:0,tongue:1,closed:0,air:0,note:'舌尖顶住上牙后面，声音从鼻子出来' },
 o:{jaw:1,width:0.85,round:0.3,teeth:0,tongue:0,closed:0,air:0,note:'嘴张到最大，啊' },
 p:{jaw:0.5,width:0.8,round:0,teeth:0,tongue:0,closed:1,air:1,note:'双唇闭紧，再一下打开，带一股气' },
 q:{jaw:0.6,width:0.8,round:0.8,teeth:0,tongue:0,closed:0,air:0,note:'嘴唇先撅起来，再张开' },
 r:{jaw:0.4,width:0.8,round:0.5,teeth:0,tongue:0,closed:0,air:0,note:'嘴唇微微往前撅，舌头卷起来' },
 s:{jaw:0.2,width:0.85,round:0,teeth:1,tongue:0,closed:0,air:1,note:'上下牙轻轻合上，留一条小缝，吹气' },
 t:{jaw:0.35,width:0.85,round:0,teeth:0,tongue:1,closed:0,air:0,note:'舌尖顶住上牙后面，再放开' },
 u:{jaw:0.5,width:0.85,round:0,teeth:0,tongue:0,closed:0,air:0,note:'嘴张一半，短促的啊' },
 v:{jaw:0.25,width:0.8,round:0,teeth:1,tongue:0,closed:0,air:1,note:'上牙轻轻咬住下唇，带声音吹气' },
 w:{jaw:0.5,width:0.7,round:1,teeth:0,tongue:0,closed:0,air:0,note:'嘴唇撅成小圆，再张开' },
 x:{jaw:0.5,width:0.8,round:0,teeth:1,tongue:0,closed:0,air:0,note:'先像 k 张开嘴，再像 s 合上牙' },
 y:{jaw:0.3,width:1,round:0,teeth:0,tongue:0,closed:0,air:0,note:'嘴角咧开，再张开' },
 z:{jaw:0.2,width:0.85,round:0,teeth:1,tongue:0,closed:0,air:1,note:'上下牙轻轻合上，留一条小缝，带声音吹气' },
};
// 爱荷华大学 Sounds of Speech 真人嘴型视频（2026-11-12 逐个 HEAD 验过）。
// 18 个字母有剖面动画 + 真人嘴型；q 只嵌 k 的部分；x 先 k 再 s；
// e、i、o、j、w、y 站里没有，返回空数组，只留简笔画。
const SOS_BASE = 'https://soundsofspeech.uiowa.edu/assets/phonemes';
const SOS_FOLDER = {a:'ae-sound',b:'b-sound',c:'k-sound',d:'d-sound',f:'f-sound',g:'g-sound',h:'h-sound',k:'k-sound',l:'l-sound',m:'m-sound',n:'n-sound',p:'p-sound',q:'k-sound',r:'r-sound',s:'s-sound',t:'t-sound',u:'long-a-sound',v:'v-sound',z:'z-sound'};
export function sosVideos(letter){
 if(!letter) return [];
 if(letter === 'x') return ['k-sound','s-sound'].flatMap(f => [
  {kind:'profile', label:'k 的部分 · 剖面动画', url:`${SOS_BASE}/${f}/animation/${f}.mp4`},
  {kind:'face', label:'k 的部分 · 真人嘴型', url:`${SOS_BASE}/${f}/examples/sound.mp4`}]);
 const folder = SOS_FOLDER[letter];
 if(!folder) return [];
 return [
  {kind:'profile', label:'剖面动画', url:`${SOS_BASE}/${folder}/animation/${folder}.mp4`},
  {kind:'face', label:'真人嘴型', url:`${SOS_BASE}/${folder}/examples/sound.mp4`}];
}
