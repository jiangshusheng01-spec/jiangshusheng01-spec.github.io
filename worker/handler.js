const counts=new Map();
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export default {async fetch(request,env={},ctx={}){
 const url=new URL(request.url),path=url.pathname;
 if(path==='/api/status')return json({deepseek:!!env.DEEPSEEK_API_KEY,audioScoring:false});
 if(path==='/api/coach'){
  if(request.method!=='POST')return json({error:'请求方式不正确'},405);
  if(!request.headers.get('oai-authenticated-user-id')&&!env.LOCAL_DEV)return json({error:'请先登录后再使用AI建议'},401);
  if(request.headers.get('origin')&&request.headers.get('origin')!==url.origin)return json({error:'来源不允许'},403);
  if(!env.DEEPSEEK_API_KEY)return json({error:'DeepSeek尚未启用：请配置服务端 DEEPSEEK_API_KEY。基础课程与录音回放仍可使用。'},503);
  if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'请使用JSON格式'},415);
  if(+(request.headers.get('content-length')||0)>20000)return json({error:'学习记录过大'},413);
  let body;try{const t=await request.text();if(t.length>20000)return json({error:'学习记录过大'},413);body=JSON.parse(t)}catch{return json({error:'学习记录格式不正确'},400)}
  if(!Number.isInteger(body.lesson)||body.lesson<0||body.lesson>26||!Array.isArray(body.stats)||body.stats.length>120)return json({error:'学习记录格式不正确'},400);
  const stats=[];for(const s of body.stats){if(!s||!/^[a-z]{1,5}$/.test(s.target)||!['attempts','independent','assisted','correct'].every(k=>Number.isInteger(s[k])&&s[k]>=0&&s[k]<=1e6)||s.correct>s.attempts||s.independent+s.assisted>s.attempts)return json({error:'学习记录格式不正确'},400);stats.push({target:s.target,attempts:s.attempts,independent:s.independent,assisted:s.assisted,correct:s.correct})}
  if(!stats.length)return json({error:'请先完成一轮练习，再生成有依据的建议。'},400);
  const user=request.headers.get('oai-authenticated-user-id')||'local',now=Date.now();if(counts.size>500)for(const[k,v]of counts)if(now-v>60000)counts.delete(k);if(now-(counts.get(user)||0)<30000)return json({error:'请稍等半分钟再生成新建议。'},429);counts.set(user,now);
  try{const r=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+env.DEEPSEEK_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:env.DEEPSEEK_MODEL||'deepseek-chat',messages:[{role:'system',content:'你是面向中国家长的幼儿自然拼读陪学老师。孩子英语零基础。根据结构化练习统计，用中文给出不超过200字的三条具体建议，只练已出现的字母和单词，说明下一次怎样练、观察什么。独立正确与提示后正确分开。没有录音，不得诊断发音错误、声学问题、口音，不得编造分数或说听到了录音。题目统计不是发音评分。不要引入未学规则或陌生词，不输出链接，不推销。'},{role:'user',content:JSON.stringify({lesson:body.lesson+1,stats})}],max_tokens:500,stream:false}),signal:AbortSignal.timeout(25000)});if(!r.ok)return json({error:r.status===401?'DeepSeek密钥无效，请由家长检查服务端配置。':r.status===402?'DeepSeek账户余额不足，请由家长检查。':'DeepSeek暂时不可用，请稍后再试。'},502);const d=await r.json();const advice=d.choices?.[0]?.message?.content;if(typeof advice!=='string'||!advice.trim())throw Error();return json({advice:advice.slice(0,1800)})}catch{return json({error:'AI建议请求超时或失败，学习记录仍已保存在本机。'},502)}
 }
 if(path.startsWith('/api/'))return json({error:'接口不存在'},404);
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
 const asset=ASSETS[path==='/'?'/index.html':path];if(!asset)return new Response('Not found',{status:404});
 return new Response(request.method==='HEAD'?null:asset.binary?Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)):asset.body,{headers:{'Content-Type':asset.type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'microphone=(self),camera=()','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"}});
}};
