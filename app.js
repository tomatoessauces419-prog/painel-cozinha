(function(){
var LS='mc_state',CF='mc_cfg',ED=0,PA=0,pi=0,tc=0,VW=0,VE=0,pt,last=new Date().getTime();
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
var TY={relogio:['🕐','Relógio e clima',''],fotos:['📷','Apresentação de fotos','Suas imagens passando automaticamente'],youtube:['🎬','Vídeos','Pesquisar e assistir'],links:['🔗','Atalhos','Abrir seus sites'],lista:['📋','Lista','Itens e tarefas'],nota:['📝','Notas','Anotações rápidas']};
var REC=[{t:'Tudo Gostoso',u:'https://www.tudogostoso.com.br'},{t:'Panelinha',u:'https://www.panelinha.com.br'}];
var MUS=[{t:'YouTube Music',u:'https://music.youtube.com'},{t:'Spotify',u:'https://open.spotify.com'}];
function seed(){return{ts:0,set:{sec:8,idle:120,bg:'',th:0,ytKey:''},w:[
{id:'w1',t:'fotos',s:3,n:'Apresentação de fotos',i:'📷',sub:'Suas imagens passando automaticamente',d:{u:[]}},
{id:'w2',t:'youtube',s:1,n:'Vídeos',i:'🎬',sub:'Pesquisar e assistir',d:{}},
{id:'w3',t:'links',s:1,n:'Receitas',i:'🍳',sub:'Abrir seus sites favoritos',d:{i:REC}},
{id:'w4',t:'links',s:1,n:'Música',i:'🎵',sub:'Abrir seu serviço musical',d:{i:MUS}},
{id:'w5',t:'relogio',s:1,n:'Relógio e clima',i:'🕐',sub:'',d:{lat:-23.55,lon:-46.63}},
{id:'w6',t:'lista',s:1,n:'Compras',i:'📋',sub:'Itens para comprar',d:{i:[]}},
{id:'w7',t:'nota',s:1,n:'Notas',i:'📝',sub:'Anotações rápidas',d:{x:''}}]}}
var S=jget(LS,null)||seed();
function fix(){if(!S.set)S.set={sec:8,idle:120,bg:'',th:0,ytKey:''};var o=[];
for(var i=0;i<S.w.length;i++){var w=S.w[i];if(w.t=='clima')continue;if(w.t=='relogio'&&w.d.lat==null){w.d.lat=-23.55;w.d.lon=-46.63}o.push(w)}S.w=o}
fix();
var cfg=jget(CF,{});
var P=[{k:'links',l:'Atalhos para sites',n:'Atalhos',i:'🔗',sub:'Abrir seus sites',s:1,d:{i:[]}},
{k:'links',l:'Receitas (links)',n:'Receitas',i:'🍳',sub:'Abrir seus sites favoritos',s:1,d:{i:REC}},
{k:'links',l:'Música (atalhos)',n:'Música',i:'🎵',sub:'Abrir seu serviço musical',s:1,d:{i:MUS}},
{k:'lista',l:'Lista de compras',n:'Compras',i:'📋',sub:'Itens para comprar',s:1,d:{i:[]}},
{k:'lista',l:'Tarefas',n:'Tarefas',i:'✅',sub:'O que fazer',s:1,d:{i:[]}},
{k:'nota',l:'Nota / lembrete',n:'Nota',i:'📝',sub:'Anotações rápidas',s:1,d:{x:''}},
{k:'fotos',l:'Apresentação de fotos',n:'Apresentação de fotos',i:'📷',sub:'Suas imagens passando automaticamente',s:3,d:{u:[]}},
{k:'relogio',l:'Relógio e clima',n:'Relógio e clima',i:'🕐',sub:'',s:1,d:{lat:-23.55,lon:-46.63}},
{k:'youtube',l:'Pesquisa de vídeos',n:'Vídeos',i:'🎬',sub:'Pesquisar e assistir',s:1,d:{}}];
function find(id){for(var i=0;i<S.w.length;i++)if(S.w[i].id==id)return S.w[i]}
function pos(id){for(var i=0;i<S.w.length;i++)if(S.w[i].id==id)return i}
function lines(v){var a=v.split('\n'),o=[];for(var i=0;i<a.length;i++){var t=tr(a[i]);if(t)o.push(t)}return o}
function pl(v){var a=lines(v),o=[];for(var i=0;i<a.length;i++){var p=a[i].split('|'),u=tr(p[1]||p[0]);
if(!/^https?:/i.test(u))u='https://'+u;o.push({t:p[1]?tr(p[0]):u,u:u})}return o}
function st(m,ok){$('st').textContent=m;$('st').className=ok?'':'er'}
function hm(){var d=new Date();return d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes()}
function save(){S.ts=new Date().getTime();jset(LS,S);clearTimeout(pt);pt=setTimeout(push,1500)}
var W={};
W.relogio={html:function(w){return '<div class="clk" id="k'+w.id+'"></div><div class="wx" id="x'+w.id+'">Carregando clima…</div>'},
ed:function(w){return '<label>Latitude do clima</label><input data-k="lat" value="'+esc(w.d.lat)+'"><label>Longitude do clima</label><input data-k="lon" value="'+esc(w.d.lon)+'">'}};
var CH=[['Spotify','https://open.spotify.com'],['YouTube','https://www.youtube.com'],['YouTube Music','https://music.youtube.com'],['Google','https://www.google.com']];
function nu(u){u=tr(u);return /^https?:/i.test(u)?u:'https://'+u}
W.links={html:function(w,E){var h='',a=w.d.i;
for(var i=0;i<a.length;i++)h+=E?'<div class="it"><button class="rm" data-act="lr" data-ix="'+i+'">×</button>'+esc(a[i].t)+'</div>':'<a class="lk" target="_blank" href="'+esc(a[i].u)+'">'+esc(a[i].t)+'</a>';
if(E){h+='<label>Adicionar com um toque</label><p>';for(var j=0;j<CH.length;j++)h+='<button data-act="lq" data-t="'+CH[j][0]+'" data-u="'+CH[j][1]+'">+ '+CH[j][0]+'</button>';
h+='</p><label>Ou digite o nome e o endereço do site</label><input class="ln" placeholder="Nome (ex.: Receitas da vovó)"><input class="lu" placeholder="Endereço (ex.: panelinha.com.br)" style="margin-top:6px"><button data-act="la">Adicionar atalho</button>'}
return h||'<p class="sm">Nenhum atalho ainda. Toque em ✎ Editar.</p>'}};
W.nota={html:function(w){return '<textarea rows="9" data-k="x">'+esc(w.d.x)+'</textarea>'}};
W.lista={html:function(w){var h='',a=w.d.i;for(var i=0;i<a.length;i++)h+='<div class="it'+(a[i].d?' dn':'')+'"><button class="rm" data-act="rm" data-ix="'+i+'">×</button><span data-act="tg" data-ix="'+i+'">'+(a[i].d?'☑ ':'☐ ')+esc(a[i].t)+'</span></div>';
return h+'<p><input class="ai" placeholder="Novo item"><button data-act="ad">Adicionar</button></p>'}};
W.fotos={html:function(w,E){var u=w.d.u,h='';
if(u.length&&!E)h+='<div class="ph"><img id="p'+w.id+'" alt=""></div><div class="pc"><button data-act="pv">◀</button><button data-act="pp">Pausar / Retomar</button><button data-act="nx">▶</button></div>';
if(E){for(var i=0;i<u.length;i++)h+='<div class="it"><button class="rm" data-act="pr" data-ix="'+i+'">×</button>Foto '+(i+1)+'</div>';
h+='<label>Enviar fotos do computador (precisa de conta em Ajustes)</label><input type="file" accept="image/*" multiple data-up="1"><label>Ou colar o link de uma imagem</label><input class="pu" placeholder="https://..."><button data-act="pa">Adicionar foto</button>'}
return h||'<p class="sm">Nenhuma foto ainda. Toque em ✎ Editar.</p>'}};
W.youtube={html:function(w){return '<input id="q'+w.id+'" placeholder="Pesquisar vídeo"><button data-act="ys">Buscar</button><div class="yr" id="r'+w.id+'"></div><div id="v'+w.id+'"></div>'}};
function rs(f,cb){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var k=Math.min(1,1024/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
var b=atob(c.toDataURL('image/jpeg',0.8).split(',')[1]),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);cb(new Blob([u],{type:'image/jpeg'}))};im.onerror=function(){cb(null)};im.src=r.result};r.onerror=function(){cb(null)};r.readAsDataURL(f)}
function up(w,fl,i){if(i>=fl.length){save();rc(w);return}
st('Enviando foto '+(i+1)+' de '+fl.length+'…',1);
rs(fl[i],function(bl){if(!bl){up(w,fl,i+1);return}
var nm=cfg.uid+'/'+new Date().getTime()+'-'+i+'.jpg',r=new XMLHttpRequest();r.open('POST',cfg.url+'/storage/v1/object/fotos/'+nm,true);
r.setRequestHeader('apikey',cfg.anon);r.setRequestHeader('Authorization','Bearer '+cfg.at);r.setRequestHeader('Content-Type','image/jpeg');
r.onload=function(){if(r.status==200){w.d.u.push(cfg.url+'/storage/v1/object/public/fotos/'+nm);st('Foto enviada',1)}else st('Erro no envio ('+r.status+'). Entre de novo em Ajustes e confira o SQL.',0);up(w,fl,i+1)};
r.onerror=function(){st('Falha no envio',0);up(w,fl,i+1)};r.send(bl)})}
var SW='';for(var q=0;q<6;q++)SW+='<button class="sw k'+q+'" data-act="co" data-co="'+q+'"></button>';
function tile(w){var d=TY[w.t],h='';
if(ED){h+='<div class="tb"><button data-act="l">◀</button><button data-act="r">▶</button><button data-act="z" data-z="1">Metade</button><button data-act="z" data-z="3">Inteiro</button><button data-act="x">Excluir</button><br>'+SW+'<button data-act="fs" data-d="-1">A-</button><button data-act="fs" data-d="1">A+</button></div>'+
'<input class="ti" data-k="n" value="'+esc(w.n)+'" placeholder="Título">'+(w.t=='relogio'?'':'<input class="ti" data-k="sub" value="'+esc(w.sub)+'" placeholder="Descrição">')+'<input class="ti" data-k="ic" value="'+esc(w.i)+'" placeholder="Ícone (emoji)" style="width:150px">'}
h+='<div class="tl" data-act="open"><div class="ic">'+esc(w.i||d[0])+'</div><div class="tt">'+esc(w.n||d[1])+'</div><div class="ts" id="s'+w.id+'">'+(w.t=='relogio'?'':esc(w.sub==null?d[2]:w.sub))+'</div></div>';
return '<div class="in k'+(w.c||0)+' f'+(w.f||0)+'">'+h+'</div>'}
function cardEl(id){var c=$('board').childNodes;for(var i=0;i<c.length;i++)if(c[i].getAttribute&&c[i].getAttribute('data-id')==id)return c[i]}
function rv(w){var d=TY[w.t],E=ED||VE,eb=(w.t=='links'||w.t=='fotos'||w.t=='relogio')?'<button data-act="ve" style="float:right">'+(E?'Concluir':'✎ Editar')+'</button>':'';$('vw').innerHTML='<div class="vh"><button data-act="back">‹ Voltar</button>'+eb+'<span class="vt">'+esc(w.i||d[0])+' '+esc(w.n||d[1])+'</span></div><div class="in vb k'+(w.c||0)+' f'+(w.f||0)+'">'+W[w.t].html(w,E)+(E&&W[w.t].ed?W[w.t].ed(w):'')+'</div>';after();if(w.t=='relogio')wxf(w)}
function rc(w){if(VW==w.id){rv(w);return}var e=cardEl(w.id);if(e){e.className='c s'+w.s;e.innerHTML=tile(w)}after()}
function shw(){$('board').className=VW?'hid':'';$('vw').className=VW?'':'hid';if(VW)$('vw').setAttribute('data-id',VW);else $('vw').removeAttribute('data-id')}
function render(){if(VW&&!find(VW))VW=0;var h='';for(var i=0;i<S.w.length;i++){var w=S.w[i];h+='<div class="c s'+w.s+'" data-id="'+w.id+'">'+tile(w)+'</div>'}
$('board').innerHTML=h||'<p class="sm">Painel vazio. Toque no ícone do canto e depois em Editar painel.</p>';
document.body.className='b'+(S.set.th||0);document.body.style.backgroundImage=S.set.bg?'url("'+String(S.set.bg).replace(/"/g,'')+'")':'none';
shw();if(VW)rv(find(VW));else after()}
function after(){clock();showPh()}
function clock(){var d=new Date(),dt=DM[d.getDay()]+', '+d.getDate()+' de '+MS[d.getMonth()];
for(var i=0;i<S.w.length;i++)if(S.w[i].t=='relogio'){var id=S.w[i].id,e=$('k'+id);if(e)e.innerHTML='<b>'+hm()+'</b><span>'+dt+'</span>';e=$('s'+id);if(e)e.textContent=hm()+' · '+dt}}
function wxt(c){return c==0?'Céu limpo':c<4?'Nublado':c<50?'Neblina':c<70?'Chuva':c<80?'Neve':c<90?'Pancadas de chuva':'Tempestade'}
function wxf(w){xhr('GET','https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(w.d.lat)+'&longitude='+encodeURIComponent(w.d.lon)+'&current_weather=true',{},null,function(s,j){
var e=$('x'+w.id);if(!e)return;e.innerHTML=(s==200&&j&&j.current_weather)?'<b>'+Math.round(j.current_weather.temperature)+'°C</b> '+wxt(j.current_weather.weathercode):'Clima indisponível'})}
function allPh(){var o=[];for(var i=0;i<S.w.length;i++)if(S.w[i].t=='fotos')o=o.concat(S.w[i].d.u);return o}
function pick(a){var n=a.length;return a[((pi%n)+n)%n]}
function showPh(){for(var i=0;i<S.w.length;i++){var w=S.w[i];if(w.t=='fotos'&&w.d.u.length){var e=$('p'+w.id);if(e)e.src=pick(w.d.u)}}
var a=allPh();if(a.length&&$('saver').className!='hid')$('sv').src=pick(a)}
function ys(w){var q=$('q'+w.id).value,k=S.set.ytKey;if(!tr(q))return;
if(!k){window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(q));return}
$('r'+w.id).innerHTML='Buscando…';
xhr('GET','https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q='+encodeURIComponent(q)+'&key='+encodeURIComponent(k),{},null,function(s,j){
var h='';if(s==200&&j&&j.items){for(var i=0;i<j.items.length;i++){var it=j.items[i];h+='<div class="yv" data-act="yv" data-v="'+esc(it.id.videoId)+'"><img src="'+esc(it.snippet.thumbnails.medium.url)+'" alt=""><b>'+esc(it.snippet.title)+'</b><br><small>'+esc(it.snippet.channelTitle)+'</small></div>'}}
else h='Pesquisa indisponível ('+s+'). Verifique a chave em Ajustes.';$('r'+w.id).innerHTML=h})}
function yv(w,id){$('v'+w.id).innerHTML='<iframe src="https://www.youtube.com/embed/'+esc(id)+'?playsinline=1" allowfullscreen></iframe><p><a class="lk" target="_blank" href="https://www.youtube.com/watch?v='+esc(id)+'">Abrir no YouTube</a></p>'}
// ---- sincronização (Supabase via REST/XMLHttpRequest)
function api(m,p,b,x,cb,re){var h={apikey:cfg.anon,Authorization:'Bearer '+cfg.at,'Content-Type':'application/json'};for(var k in x)h[k]=x[k];
xhr(m,cfg.url+p,h,b,function(s,j){if(s==401&&cfg.rt&&!re){xhr('POST',cfg.url+'/auth/v1/token?grant_type=refresh_token',{apikey:cfg.anon,'Content-Type':'application/json'},{refresh_token:cfg.rt},function(s2,j2){
if(s2==200&&j2){cfg.at=j2.access_token;cfg.rt=j2.refresh_token;jset(CF,cfg);api(m,p,b,x,cb,1)}else cb(401,j)})}else cb(s,j)})}
function push(){if(!cfg.at)return;api('POST','/rest/v1/panel?on_conflict=user_id',{user_id:cfg.uid,state:S,updated_at:new Date().toISOString()},{Prefer:'resolution=merge-duplicates,return=minimal'},function(s){
st(s<300&&s>0?'Sincronizado '+hm():'Erro ao enviar ('+s+')',s<300&&s>0)})}
function pull(){if(!cfg.at)return;api('GET','/rest/v1/panel?select=state&limit=1',null,{},function(s,j){
if(s!=200){st('Erro de sincronização ('+s+')',0);return}
if(j&&j.length){var r=j[0].state;if(r&&r.ts>S.ts){S=r;fix();jset(LS,S);render()}else if(r&&r.ts<S.ts)push();st('Sincronizado '+hm(),1)}else push()})}
function auth(su){cfg.url=tr($('c_url').value).replace(/\/+$/,'');cfg.anon=tr($('c_anon').value);
xhr('POST',cfg.url+(su?'/auth/v1/signup':'/auth/v1/token?grant_type=password'),{apikey:cfg.anon,'Content-Type':'application/json'},{email:tr($('c_em').value),password:$('c_pw').value},function(s,j){
if(s==200&&j&&j.access_token){cfg.at=j.access_token;cfg.rt=j.refresh_token;cfg.uid=j.user.id;jset(CF,cfg);st('Conectado',1);pull()}
else if(s==200&&su)st('Conta criada. Confirme o e-mail, se pedido, e toque em Entrar.',1)
else st('Falha ('+s+'): '+((j&&(j.msg||j.error_description||j.message))||'sem resposta'),0)})}
// ---- ações
function cardOf(b){while(b&&b.getAttribute&&!b.getAttribute('data-id'))b=b.parentNode;return b&&b.getAttribute&&b.getAttribute('data-id')?b:null}
function act(b){var a=b.getAttribute('data-act'),c=cardOf(b),w=c?find(c.getAttribute('data-id')):null,i=w?pos(w.id):0,ix=+b.getAttribute('data-ix');
if(a=='edit'){ED=1;$('pn').className='hid';$('ad').className='';render()}
else if(a=='done'){ED=0;$('ad').className='hid';render();if(cfg.at)push()}
else if(a=='cfg'){$('pn').className=$('pn').className=='hid'?'':'hid'}
else if(a=='open'&&w){VW=w.id;VE=0;shw();rv(w);window.scrollTo(0,0)}
else if(a=='ve'){VE=!VE;rv(w)}
else if(a=='lq'){w.d.i.push({t:b.getAttribute('data-t'),u:b.getAttribute('data-u')});save();rc(w)}
else if(a=='la'){var u=tr(c.querySelector('.lu').value);if(!u){alert('Digite o endereço do site.');return}w.d.i.push({t:tr(c.querySelector('.ln').value)||u,u:nu(u)});save();rc(w)}
else if(a=='lr'){w.d.i.splice(ix,1);save();rc(w)}
else if(a=='pa'){var pu=tr(c.querySelector('.pu').value);if(pu){w.d.u.push(nu(pu));save();rc(w)}}
else if(a=='pr'){w.d.u.splice(ix,1);save();rc(w)}
else if(a=='back'){VW=0;VE=0;shw();render()}
else if(a=='add'){var p=P[$('addt').selectedIndex];S.w.push({id:'w'+new Date().getTime(),t:p.k,s:p.s,n:p.n,i:p.i,sub:p.sub,d:JSON.parse(JSON.stringify(p.d))});save();render()}
else if((a=='l'&&i>0)||(a=='r'&&i<S.w.length-1)){var j=a=='l'?i-1:i+1,t=S.w[i];S.w[i]=S.w[j];S.w[j]=t;save();render()}
else if(a=='z'){w.s=+b.getAttribute('data-z');save();rc(w)}
else if(a=='co'){w.c=+b.getAttribute('data-co');save();rc(w)}
else if(a=='fs'){w.f=Math.max(0,Math.min(2,(w.f||0)+(+b.getAttribute('data-d'))));save();rc(w)}
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
if(s){S.set[s]=(s=='sec'||s=='idle'||s=='th')?(parseInt(t.value,10)||(s=='th'?0:8)):tr(t.value);save();if(s=='bg'||s=='th')render();return}
if(t.getAttribute('data-up')){var cc=cardOf(t),ww=cc&&find(cc.getAttribute('data-id'));if(!cfg.at){alert('Para enviar fotos, entre na conta em Ajustes (ícone do canto).');return}if(ww&&t.files&&t.files.length)up(ww,t.files,0);return}
if(!k)return;var c=cardOf(t);if(!c)return;var w=find(c.getAttribute('data-id')),v=t.value;
if(k=='n')w.n=v;else if(k=='sub')w.sub=v;else if(k=='ic')w.i=v;else if(k=='x')w.d.x=v;else if(k=='lat'||k=='lon')w.d[k]=parseFloat(v)||0;
else if(k=='u')w.d.u=lines(v);else if(k=='i')w.d.i=pl(v);
save();if(k!='x')rc(w)});
// ---- início
(function(){var o='';for(var i=0;i<P.length;i++)o+='<option>'+P[i].l+'</option>';$('addt').innerHTML=o;
$('c_url').value=cfg.url||'';$('c_anon').value=cfg.anon||'';var f=document.querySelectorAll('[data-s]');for(var j=0;j<f.length;j++)f[j].value=S.set[f[j].getAttribute('data-s')]||''})();
render();st(cfg.at?'Sincronizando…':'Modo local',1);pull();
setInterval(function(){clock();var n=new Date().getTime();tc++;
if(tc>=(S.set.sec||8)){tc=0;if(!PA){pi++;showPh()}}
if(!ED&&$('saver').className=='hid'&&$('pn').className=='hid'&&n-last>(S.set.idle||120)*1000&&allPh().length){$('saver').className='';showPh()}},1000);
setInterval(function(){var a=document.activeElement;if(!ED&&!(a&&(a.tagName=='INPUT'||a.tagName=='TEXTAREA')))pull()},60000);
setInterval(function(){for(var i=0;i<S.w.length;i++)if(S.w[i].t=='relogio')wxf(S.w[i])},900000);
})();
