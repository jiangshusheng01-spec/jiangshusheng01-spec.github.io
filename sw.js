const CACHE='sprout-foundation-v9-us';const SHELL=['/','/app.js','/data.js','/style.css','/icon.svg','/manifest.webmanifest','/icon-180.png','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// 音频按需缓存：浏览器播 <audio> 几乎总是发 Range 请求；cache.put 拒存 206，
// 所以 Range 请求改走"取整份、按需切片回 206"：有缓存就切片，没有就先整份拉回来存好再切片。
async function rangeResponse(request,cached){
 const buf=await cached.arrayBuffer(),total=buf.byteLength;
 const m=/^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range')||'');
 if(!m)return cached;
 let start,end;
 if(m[1]===''){start=total-(parseInt(m[2],10)||0);end=total-1}else{start=parseInt(m[1],10);end=m[2]===''?total-1:parseInt(m[2],10)}
 if(isNaN(start))start=0;if(isNaN(end)||end>=total)end=total-1;
 if(start>end||start>=total||total===0)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${total}`}});
 return new Response(buf.slice(start,end+1),{status:206,headers:{'Content-Range':`bytes ${start}-${end}/${total}`,'Accept-Ranges':'bytes','Content-Length':String(end-start+1),'Content-Type':cached.headers.get('content-type')||'audio/mpeg'}});
}
async function handleAudio(request){
 const c=await caches.open(CACHE);
 if(!request.headers.has('range')){
  try{const r=await fetch(request);if(r.ok&&r.status===200&&r.headers.get('content-type')?.startsWith('audio/'))await c.put(request,r.clone());return r}catch{const cached=await c.match(request);return cached||new Response('Offline',{status:503})}
 }
 const cached=await c.match(request);
 if(cached)return rangeResponse(request,cached);
 try{
  const full=await fetch(request.url);
  if(full.ok&&full.status===200&&full.headers.get('content-type')?.startsWith('audio/')){await c.put(request.url,full.clone());return rangeResponse(request,full)}
  return full;
 }catch{return new Response('Offline',{status:503})}
}
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=='GET'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/signin')||u.pathname.startsWith('/callback'))return;const isAudio=u.pathname.startsWith('/audio/');if(!isAudio&&!SHELL.includes(u.pathname))return;if(isAudio){e.respondWith(handleAudio(e.request));return}e.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await fetch(e.request);const valid=r.ok&&!r.redirected&&r.status===200&&(u.pathname==='/'?r.headers.get('content-type')?.includes('text/html'):true);if(valid)await c.put(e.request,r.clone());return r}catch{const cached=await c.match(e.request);return cached||new Response('Offline',{status:503})}})())});
