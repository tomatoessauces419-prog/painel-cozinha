(function(){
var LS='mc_state',CF='mc_cfg',ED=0,PA=0,pi=0,tc=0,pt,last=new Date().getTime();
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function tr(s){return String(s).replace(/^\s+|\s+$/g,'')}
function jget(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function xhr(m,u,h,b,cb){var r=new XMLHttpRequest();r.open(m,u,true);for(var k in h)r.setRequestHeader(k,h[k]);r.timeout=15000;
r.onload=function(){var j=null;try{j=JSON.parse(r.responseText)}catch(e){}cb(r.status,j)};
r.onerror=r.ontimeout=function(){cb(0,null)};r.send(b?JSON.stringify(b):null)}
var DM=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
var MS=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
function seed(){return{ts:0,set:{sec:8,idle:120,bg:'',ytKey:''},w:[
{id:'w1',t:'relogio',s:2,n:'',d:{}},{id:'w2',t:'clima',s:1,n:'Clima',d:{lat:-23.55,lon:-46.63}},
{id:'w3',t:'fotos',s:2,n:'Fotos',d:{u:[]}},
{id:'w4',t:'links',s:1,n:'Atalhos',d:{i:[{t:'YouTube',u:'https://www.youtube.com'},{t:'Google',u:'https://www.google.com'}]}},
{id:'w5',t:'lista',s:1,n:'Compras',d:{i:[]}},{id:'w6',t:'nota',s:1,n:'Notas',d:{x:''}},
{id:'w7',t:'youtube',s:3,n:'Vídeos',d:{}}]}}
var S=jget(LS,null)||seed();if(!S.set)S.set={sec:8,idle:120,bg:'',ytKey:''};
var cfg=jget(CF,{});
var P=[{k:'links',l:'Atalhos para sites',n:'Atalhos',s:1,d:{i:[]}},
{k:'links',l:'Receitas (links)',n:'Receitas',s:1,d:{i:[{t:'Tudo Gostoso',u:'https://www.tudogostoso.com.br'},{t:'Panelinha',u:'https://www.panelinha.com.br'}]}},
{k:'links',l:'Música (atalhos)',n:'Música',s:1,d:{i:[{t:'YouTube Music',u:'https://music.youtube.com'},{t:'Spotify',u:'https://open.spotify.com'}]}},
{k:'lista',l:'Lista de compras',n:'Compras',s:1,d:{i:[]}},{k:'lista',l:'Tarefas',n:'Tarefas',s:1,d:{i:[]}},
{k:'nota',l:'Nota rápida / lembrete',n:'Nota',s:1,d:{x:''}},{k:'fotos',l:'Fotos',n:'Fotos',s:2,d:{u:[]}},
{k:'relogio',l:'Relógio',n:'',s:2,d:{}},{k:'clima',l:'Clima',n:'Clima',s:1,d:{lat:-23.55,lon:-46.63}},
{k:'youtube',l:'Pesquisa de vídeos',n:'Vídeos',s:3,d:{}}];
function find(id){for(var i=0;i<S.w.length;i++)if(S.w[i].id==id)return S.w[i]}
function pos(id){for(var i=0;i<S.w.length;i++)if(S.w[i].id==id)return i}
function lines(v){var a=v.split('\n'),o=[];for(var i=0;i<a.length;i++){var t=tr(a[i]);if(t)o.push(t)}return o}
function pl(v){var a=lines(v),o=[];for(var i=0;i<a.length;i++){var p=a[i].split('|'),u=tr(p[1]||p[0]);
if(!/^https?:/i.test(u))u='https://'+u;o.push({t:p[1]?tr(p[0]):u,u:u})}return o}
function st(m,ok){$('st').textContent=m;$('st').className=ok?'':'er'}
function hm(){var d=new Date();return d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes()}
function save(){S.ts=new Date().getTime();jset(LS,S);clearTimeout(pt);pt=setTimeout(push,1500)}
var W={};
W.relogio={html:function(w){return '<div class="clk" id="k'+w.id+'"></div>'}};
W.clima={html:function(w){return '<div class="wx" id="x'+w.id+'">Carregando…</div>'},
ed:function(w){return '<label>Latitude</label><input data-k="lat" value="'+esc(w.d.lat)+'"><label>Longitude</label><input data-k="lon" value="'+esc(w.d.lon)+'">'}};
W.links={html:function(w){var h='',a=w.d.i;for(var i=0;i<a.length;i++)h+='<a class="lk" target="_blank" href="'+esc(a[i].u)+'">'+esc(a[i].t)+'</a>';return h||'<p class="sm">Sem atalhos.</p>'},
ed:function(w){var a=w.d.i,v=[];for(var i=0;i<a.length;i++)v.push(a[i].t+' | '+a[i].u);
return '<label>Um por linha: Título | endereço</label><textarea rows="5" data-k="i">'+esc(v.join('\n'))+'</textarea>'}};
W.nota={html:function(w){return '<textarea rows="7" data-k="x">'+esc(w.d.x)+'</textarea>'}};
W.lista={html:function(w){var h='',a=w.d.i;for(var i=0;i<a.length;i++)h+='<div class="it'+(a[i].d?' dn':'')+'">'+(ED?'<button class="rm" data-act="rm" data-ix="'+i+'">×</button>':'')+'<span data-act="tg" data-ix="'+i+'">'+(a[i].d?'☑ ':'☐ ')+esc(a[i].t)+'</span></div>';
return h+'<p><input class="ai" placeholder="Novo item"><button data-act="ad">Adicionar</button></p>'}};
W.fotos={html:function(w){if(!w.d.u.length)return '<p class="sm">Sem fotos. Use Editar painel e cole links de imagens.</p>';
return '<div class="ph"><img id="p'+w.id+'" alt=""></div><div class="pc"><button data-act="pv">◀</button><button data-act="pp">Pausar / Retomar</button><button data-act="nx">▶</button></div>'},
ed:function(w){return '<label>Um link de imagem por linha</label><textarea rows="5" data-k="u">'+esc(w.d.u.join('\n'))+'</textarea>'}};
W.youtube={html:function(w){return '<input id="q'+w.id+'" placeholder="Pesquisar vídeo"><button data-act="ys">Buscar</button><div class="yr" id="r'+w.id+'"></div><div id="v'+w.id+'"></div>'}};
function card(w){var h='';
if(ED){var i='data-id="'+w.id+'"';h+='<div class="tb"><button data-act="l">◀</button><button data-act="r">▶</button><button data-act="z" data-z="1">P</button><button data-act="z" data-z="2">M</button><button data-act="z" data-z="3">G</button><button data-act="x">Excluir</button></div><input class="ti" data-k="n" value="'+esc(w.n)+'" placeholder="Título (pode usar emoji)">'}
else if(w.n&&w.t!='relogio')h+='<h2>'+esc(w.n)+'</h2>';
h+=W[w.t].html(w);if(ED&&W[w.t].ed)h+=W[w.t].ed(w);return '<div class="in">'+h+'</div>'}
function cardEl(id){var c=$('board').childNodes;for(var i=0;i<c.length;i++)if(c[i].getAttribute&&c[i].getAttribute('data-id')==id)return c[i]}
function rc(w){var e=cardEl(w.id);if(e){e.className='c s'+w.s;e.innerHTML=card(w)}after()}
function render(){var h='';for(var i=0;i<S.w.length;i++){var w=S.w[i];h+='<div class="c s'+w.s+'" data-id="'+w.id+'">'+card(w)+'</div>'}
$('board').innerHTML=h||'<p class="em">Painel vazio. Toque em Editar painel para adicionar widgets.</p>';
document.body.style.backgroundImage=S.set.bg?'url("'+String(S.set.bg).replace(/"/g,'')+'")':'none';after();for(var j=0;j<S.w.length;j++)if(S.w[j].t=='clima')wxf(S.w[j])}
function after(){clock();showPh()}
function clock(){var d=new Date(),h='<b>'+hm()+'</b><span>'+DM[d.getDay()]+', '+d.getDate()+' de '+MS[d.getMonth()]+'</span>';
for(var i=0;i<S.w.length;i++)if(S.w[i].t=='relogio'){var e=$('k'+S.w[i].id);if(e)e.innerHTML=h}}
function wxt(c){return c==0?'Céu limpo':c<4?'Nublado':c<50?'Neblina':c<70?'Chuva':c<80?'Neve':c<90?'Pancadas de chuva':'Tempestade'}
function wxf(w){xhr('GET','https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(w.d.lat)+'&longitude='+encodeURIComponent(w.d.lon)+'&current_weather=true',{},null,function(s,j){
var e=$('x'+w.id);if(!e)return;e.innerHTML=(s==200&&j&&j.current_weather)?'<b>'+Math.round(j.current_weather.temperature)+'°C</b><br>'+wxt(j.current_weather.weathercode):'Clima indisponível'})}
function allPh(){var o=[];for(var i=0;i<S.w.length;i++)if(S.w[i].t=='fotos')o=o.concat(S.w[i].d.u);return o}
function pick(a){var n=a.length;return a[((pi%n)+n)%n]}
function showPh(){for(var i=0;i<S.w.length;i++){var w=S.w[i];if(w.t=='fotos'&&w.d.u.length){var e=$('p'+w.id);if(e)e.src=pick(w.d.u)}}
var a=allPh();if(a.length&&$('saver').className!='hid')$('sv').src=pick(a)}
function ys(w){var q=$('q'+w.id).value,k=S.set.ytKey;if(!tr(q))return;
if(!k){window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(q));return}
$('r'+w.id).innerHTML='Buscando…';
xhr('GET','https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q='+encodeURIComponent(q)+'&key='+encodeURIComponent(k),{},null,function(s,j){
var h='';if(s==200&&j&&j.items){for(var i=0;i<j.items.length;i++){var it=j.items[i];h+='<div class="yv" data-act="yv" data-v="'+esc(it.id.videoId)+'"><img src="'+esc(it.snippet.thumbnails.medium.url)+'" alt=""><b>'+esc(it.snippet.title)+'</b><br><small>'+esc(it.snippet.channelTitle)+'</small></div>'}}
else h='Pesquisa indisponível ('+s+'). Verifique a chave em Conta e ajustes.';$('r'+w.id).innerHTML=h})}
function yv(w,id){$('v'+w.id).innerHTML='<iframe src="https://www.youtube.com/embed/'+esc(id)+'?playsinline=1" allowfullscreen></iframe><p><a class="lk" target="_blank" href="https://www.youtube.com/watch?v='+esc(id)+'">Abrir no YouTube</a></p>'}
// ---- sincronização (Supabase via REST/XMLHttpRequest)
function api(m,p,b,x,cb,re){var h={apikey:cfg.anon,Authorization:'Bearer '+cfg.at,'Content-Type':'application/json'};for(var k in x)h[k]=x[k];
xhr(m,cfg.url+p,h,b,function(s,j){if(s==401&&cfg.rt&&!re){xhr('POST',cfg.url+'/auth/v1/token?grant_type=refresh_token',{apikey:cfg.anon,'Content-Type':'application/json'},{refresh_token:cfg.rt},function(s2,j2){
if(s2==200&&j2){cfg.at=j2.access_token;cfg.rt=j2.refresh_token;jset(CF,cfg);api(m,p,b,x,cb,1)}else cb(401,j)})}else cb(s,j)})}
function push(){if(!cfg.at)return;api('POST','/rest/v1/panel?on_conflict=user_id',{user_id:cfg.uid,state:S,updated_at:new Date().toISOString()},{Prefer:'resolution=merge-duplicates,return=minimal'},function(s){
st(s<300&&s>0?'Sincronizado '+hm():'Erro ao enviar ('+s+')',s<300&&s>0)})}
function pull(){if(!cfg.at)return;api('GET','/rest/v1/panel?select=state&limit=1',null,{},function(s,j){
if(s!=200){st('Erro de sincronização ('+s+')',0);return}
if(j&&j.length){var r=j[0].state;if(r&&r.ts>S.ts){S=r;if(!S.set)S.set=seed().set;jset(LS,S);render()}else if(r&&r.ts<S.ts)push();st('Sincronizado '+hm(),1)}else push()})}
function auth(su){cfg.url=tr($('c_url').value).replace(/\/+$/,'');cfg.anon=tr($('c_anon').value);
xhr('POST',cfg.url+(su?'/auth/v1/signup':'/auth/v1/token?grant_type=password'),{apikey:cfg.anon,'Content-Type':'application/json'},{email:tr($('c_em').value),password:$('c_pw').value},function(s,j){
if(s==200&&j&&j.access_token){cfg.at=j.access_token;cfg.rt=j.refresh_token;cfg.uid=j.user.id;jset(CF,cfg);st('Conectado',1);pull()}
else if(s==200&&su)st('Conta criada. Confirme o e-mail, se pedido, e toque em Entrar.',1)
else st('Falha ('+s+'): '+((j&&(j.msg||j.error_description||j.message))||'sem resposta'),0)})}
// ---- ações
function cardOf(b){while(b&&b.getAttribute&&!b.getAttribute('data-id'))b=b.parentNode;return b&&b.getAttribute&&b.getAttribute('data-id')?b:null}
function act(b){var a=b.getAttribute('data-act'),c=cardOf(b),w=c?find(c.getAttribute('data-id')):null,i=w?pos(w.id):0,ix=+b.getAttribute('data-ix');
if(a=='edit'){ED=1;$('ad').className='';$('eb').style.display='none';render()}
else if(a=='done'){ED=0;$('ad').className='hid';$('eb').style.display='';render();if(cfg.at)push()}
else if(a=='cfg'){$('pn').className=$('pn').className=='hid'?'':'hid'}
else if(a=='add'){var p=P[$('addt').selectedIndex];S.w.push({id:'w'+new Date().getTime(),t:p.k,s:p.s,n:p.n,d:JSON.parse(JSON.stringify(p.d))});save();render()}
else if((a=='l'&&i>0)||(a=='r'&&i<S.w.length-1)){var j=a=='l'?i-1:i+1,t=S.w[i];S.w[i]=S.w[j];S.w[j]=t;save();render()}
else if(a=='z'){w.s=+b.getAttribute('data-z');save();rc(w)}
else if(a=='x'){if(confirm('Excluir este widget?')){S.w.splice(i,1);save();render()}}
else if(a=='tg'){w.d.i[ix].d=!w.d.i[ix].d;save();rc(w)}
else if(a=='rm'){w.d.i.splice(ix,1);save();rc(w)}
else if(a=='ad'){var v=tr(c.querySelector('.ai').value);if(v){w.d.i.push({t:v,d:0});save();rc(w)}}
else if(a=='pp')PA=!PA;else if(a=='pv'){pi--;showPh()}else if(a=='nx'){pi++;showPh()}
else if(a=='ys')ys(w);else if(a=='yv')yv(w,b.getAttribute('data-v'));
else if(a=='in')auth(0);else if(a=='su')auth(1);else if(a=='sy'){pull()}
else if(a=='out'){cfg={};jset(CF,cfg);st('Modo local',1)}}
document.addEventListener('click',function(e){last=new Date().getTime();
if($('saver').className!='hid'){$('saver').className='hid';return}
var b=e.target;while(b&&b.getAttribute&&!b.getAttribute('data-act'))b=b.parentNode;if(b&&b.getAttribute)act(b)},false);
document.addEventListener('touchstart',function(){last=new Date().getTime()},false);
document.addEventListener('input',function(e){var t=e.target,k=t.getAttribute('data-k');if(k=='x'){var c=cardOf(t);if(c){find(c.getAttribute('data-id')).d.x=t.value;save()}}});
document.addEventListener('change',function(e){var t=e.target,k=t.getAttribute('data-k'),s=t.getAttribute('data-s');
if(s){S.set[s]=(s=='sec'||s=='idle')?(parseInt(t.value,10)||8):tr(t.value);save();if(s=='bg')render();return}
if(!k)return;var c=cardOf(t);if(!c)return;var w=find(c.getAttribute('data-id')),v=t.value;
if(k=='n')w.n=v;else if(k=='x')w.d.x=v;else if(k=='lat'||k=='lon')w.d[k]=parseFloat(v)||0;
else if(k=='u')w.d.u=lines(v);else if(k=='i')w.d.i=pl(v);
save();if(k!='x'){rc(w);if(w.t=='clima')wxf(w)}});
// ---- início
(function(){var o='';for(var i=0;i<P.length;i++)o+='<option>'+P[i].l+'</option>';$('addt').innerHTML=o;
$('c_url').value=cfg.url||'';$('c_anon').value=cfg.anon||'';var f=document.querySelectorAll('[data-s]');for(var j=0;j<f.length;j++)f[j].value=S.set[f[j].getAttribute('data-s')]||''})();
render();st(cfg.at?'Sincronizando…':'Modo local',1);pull();
setInterval(function(){clock();var n=new Date().getTime();tc++;
if(tc>=(S.set.sec||8)){tc=0;if(!PA){pi++;showPh()}}
if(!ED&&$('saver').className=='hid'&&$('pn').className=='hid'&&n-last>(S.set.idle||120)*1000&&allPh().length){$('saver').className='';showPh()}},1000);
setInterval(function(){var a=document.activeElement;if(!ED&&!(a&&(a.tagName=='INPUT'||a.tagName=='TEXTAREA')))pull()},60000);
setInterval(function(){for(var i=0;i<S.w.length;i++)if(S.w[i].t=='clima')wxf(S.w[i])},900000);
})();
