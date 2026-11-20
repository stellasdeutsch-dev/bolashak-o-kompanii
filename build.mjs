// Writes index.html and v/NN-*.html: 15 scroll-story prototypes of the «О компании» block.
// Run: node --experimental-strip-types build.mjs   (the illustrations come from the site's own source)
import { writeFileSync, mkdirSync } from 'node:fs'
import { illustration } from '../../site/src/data/illustrations.ts'

const SITE = 'https://stellasdeutsch-dev.github.io/bolashak-site/ru/o-kompanii/'
// texts of the block on bolashak.gov.kz, word for word (src/data/generated/home.json, «about»)
const PS = [
  'Постановлением Правительства Республики Казахстан от 4 апреля 2005 года №301 создано акционерное общество «Центр международных программ» со 100-процентным участием государства в уставном капитале.',
  'Акционером АО «Центр международных программ» является министерство науки и высшего образования.',
  'Определить основным предметом деятельности АО «ЦМП» - осуществление комплекса мероприятий по международным программам подготовки, переподготовки и повышения квалификации кадров за рубежом, в том числе международной стипендии Президента Республики Казахстан «Болашак».',
  'АО «Центр международных программ» администрирует программу «Болашак», научные стажировки, а также межправительственные гранты. Центром проводится прием документов, конкурсный отбор.',
]
const HL = [['4 апреля 2005 года', '№301', '100-процентным участием государства'], ['министерство науки и высшего образования'], ['международной стипендии Президента Республики Казахстан «Болашак»'], ['программу «Болашак», научные стажировки, а также межправительственные гранты', 'прием документов, конкурсный отбор']]
const STATS = [['13 011', 'Подготовлено специалистов', 13011], ['10 585', 'Выпускников исполнили свои договорные обязательства', 10585], ['2 300', 'Находятся на мониторинге трудовой отработки', 2300], ['1 132', 'Стипендиаты на мониторинге', 1132]]
// the first words of each paragraph, used as chapter names
const CH = ['Постановлением Правительства', 'Акционером', 'Определить основным предметом деятельности', 'АО «Центр международных программ» администрирует']
const ADDR = ['Контактный адрес:', '010000, г. Астана, ул. Сыганак, 70, Бизнес-центр «Сыганак», 5-этаж']
const nb = (s) => s.replace(/(\d) (?=(апреля|года))/g, '$1 ')
const hl = (k) => HL[k].reduce((s, ph) => s.replace(nb(ph), `<strong class="hl">${nb(ph)}</strong>`), nb(PS[k]))
const P = (k, cls = 'para') => `<p class="${cls}">${hl(k)}</p>`
const HEAD = '<h2 class="head">О компании</h2>'
const MORE = `<a class="more" href="${SITE}">Подробнее</a>`
const ill = (n, s = 120) => illustration(n, s)
const IMG = (f, alt = '') => `<img src="../assets/img/${f}" alt="${alt}" loading="lazy" decoding="async">`
const TEAM = ['team-a805a02e8c363b.webp', 'team-4e7eb0e4b5b3a5.webp', 'team-f7944a5672af42.webp', 'team-9290214519243f.webp']
const steps = (fn) => [0, 1, 2, 3].map((k) => `<div class="step s${k}">${fn(k)}</div>`).join('')

const V = []

// 01 · a big word or number rolls in letter by letter, the paragraph changes under it
V.push({ slug: 'bolshaya-cifra', title: 'Большая цифра на месте', ref: ['Squarespace Timeline', 'https://www.awwwards.com/sites/squarespace-timeline'], dark: true,
  how: 'Блок закреплён на экране, пока его прокручивают. Крупная цифра или слово из текста выкатывается по буквам снизу, старая уходит вверх, под ней сменяется абзац.',
  html: `${HEAD}<div class="big deco" aria-hidden="true"><div class="track">${['2005', 'Акционером', '«Болашак»', '13 011'].map((w, i) => `<div class="line${i === 1 || i === 2 ? ' long' : ''}">${w}</div>`).join('')}</div></div>${steps((k) => (k === 3 ? `<p class="lab">${STATS[0][1]}</p>` : '') + P(k) + (k === 3 ? MORE : ''))}`,
  css: `.v1,.v1 .stage{background:var(--deep);color:#fff}
.v1.is-anim .head{position:absolute;left:var(--pad);top:11vh}
.v1 .big{position:absolute;left:var(--pad);right:var(--pad);top:19vh;height:min(17vw,236px);overflow:hidden;font-weight:800;font-size:min(16vw,220px);line-height:1;letter-spacing:-.03em}
.v1 .line{height:min(17vw,236px);line-height:min(17vw,236px);white-space:nowrap}.v1 .line.long{font-size:.62em}
.v1 .ch{display:inline-block;will-change:transform}
.v1 .lab{color:var(--soft);font-size:18px;margin-bottom:16px}
.v1.is-anim .step{position:absolute;left:var(--pad);right:calc(var(--pad) + 48px);top:calc(19vh + min(17vw,236px) + 28px);max-width:980px}`,
  js: `const lines=q('.line');lines.forEach(l=>split(l,'c'));
gsap.from(lines[0].querySelectorAll('.ch'),{yPercent:110,stagger:.06,duration:.9,ease:'power3.out',delay:.15});
for(let k=1;k<4;k++){tl.to(one('.track'),{yPercent:-25*k,duration:.6,ease:'power3.inOut'},at(k));tl.from(lines[k].querySelectorAll('.ch'),{yPercent:120,rotate:8,stagger:.03,duration:.45,ease:'back.out(1.6)'},at(k)+.1);swap(k)}` })

// 02 · the photo stays, slowly zooms; paragraphs come and go on the right
V.push({ slug: 'foto-zakrepleno', title: 'Фото закреплено, текст сменяется', ref: ['Serein Wealth', 'https://www.awwwards.com/sites/serein-wealth'],
  how: 'Фотография Астаны раскрывается шторкой и стоит на месте, медленно приближаясь. Справа по одному въезжают абзацы, выделенные слова загораются синим.',
  html: `<figure class="pic deco">${IMG('astana.webp')}<figcaption>Фото: Ken and Nyetta, CC BY 2.0, кадрировано</figcaption></figure><div class="col">${HEAD}<div class="steps">${steps((k) => P(k) + (k === 3 ? MORE : ''))}</div></div>`,
  css: `.v2 .stage{background:var(--paper)}
.v2.is-anim .pic{position:absolute;left:0;top:0;width:46%;height:100%;margin:0;overflow:hidden;clip-path:inset(0 100% 0 0)}
.v2 .pic img{width:100%;height:100%;object-fit:cover;transform-origin:50% 60%}
.v2 .pic figcaption{position:absolute;left:16px;bottom:16px;background:rgba(15,21,53,.7);color:#fff;font-size:13px;padding:6px 10px;border-radius:8px}
.v2.is-anim .col{position:absolute;left:calc(46% + 72px);right:calc(var(--pad) + 40px);top:16vh}
.v2.is-anim .steps{position:relative;margin-top:32px}.v2.is-anim .step{position:absolute;left:0;right:0;top:0}
.v2 .hl{transition:color .4s}.v2 .step:not(.lit) .hl{color:var(--ink)}
@media (max-width:760px){.v2.is-anim .pic{width:100%;height:38%}.v2.is-anim .col{left:var(--pad);top:calc(38% + 24px)}}`,
  js: `gsap.to(one('.pic'),{clipPath:'inset(0 0% 0 0)',duration:1.1,ease:'power3.inOut',delay:.1});gsap.from(one('.pic img'),{scale:1.25,duration:1.6,ease:'power3.out',delay:.1});
setTimeout(()=>steps[0].classList.add('lit'),900);
tl.to(one('.pic img'),{scale:1.22,duration:4,ease:'none'},0);
for(let k=1;k<4;k++){swap(k,60);tl.call(()=>{steps.forEach((s,i)=>s.classList.toggle('lit',i<=k))},null,at(k)+.5)}` })

// 03 · cards stack: a new card slides over the last one, read cards stay as strips
V.push({ slug: 'stopka-kartochek', title: 'Стопка карточек', ref: ['Liminal Recruitment', 'https://www.awwwards.com/sites/liminal-2'],
  how: 'Каждый абзац — карточка с иллюстрацией и фото. Новая карточка въезжает снизу и ложится поверх, прочитанные уменьшаются и остаются полосами наверху стопки.',
  html: `${HEAD}<div class="deck">${[0, 1, 2, 3].map((k) => `<article class="step card s${k}"><div class="txt"><span class="ill">${ill(['law', 'book', 'docs', 'cap'][k], 72)}</span>${P(k)}${k === 3 ? MORE : ''}</div><div class="ph deco">${IMG(['campus.webp', 'astana.webp', 'library.webp', TEAM[0]][k])}</div></article>`).join('')}</div>`,
  css: `.v3 .stage{background:var(--paper)}
.v3.is-anim .head{position:absolute;left:var(--pad);top:9vh}
.v3.is-anim .deck{position:absolute;left:var(--pad);right:calc(var(--pad) + 40px);top:18vh;bottom:6vh}
.v3 .card{background:#fff;border:1px solid var(--line);border-radius:24px;box-shadow:0 12px 32px rgba(15,21,53,.08);display:grid;grid-template-columns:1.25fr 1fr;gap:40px;padding:40px;overflow:hidden}
.v3.is-anim .card{position:absolute;inset:0;transform-origin:50% 0}
.v3 .ph{border-radius:16px;overflow:hidden}.v3 .ph img{width:100%;height:100%;object-fit:cover}
.v3 .ill{display:block;margin-bottom:24px}
@media (max-width:760px){.v3 .card{grid-template-columns:1fr;padding:24px}.v3 .ph{height:28vh}}`,
  js: `const cards=steps;gsap.set(cards.slice(1),{autoAlpha:1,yPercent:110});
for(let k=1;k<4;k++){tl.to(cards[k],{yPercent:0,y:k*14,duration:.6,ease:'power3.out'},at(k));for(let j=0;j<k;j++)tl.to(cards[j],{scale:1-(k-j)*.04,y:j*14-(k-j)*10,opacity:1-(k-j)*.18,duration:.6},at(k))}
gsap.from(cards[0],{y:60,opacity:0,duration:.8,ease:'power3.out',delay:.1})` })

// 04 · a vertical line fills, dots light up, the paragraph rides next to the current dot
V.push({ slug: 'liniya-vremeni', title: 'Линия времени с прогрессом', ref: ['Hanwag 100 Years', 'https://www.awwwards.com/sites/hanwag-100-years-timeline'],
  how: 'Вертикальная линия заполняется синим по мере прокрутки. Точки вспыхивают, текущая становится жёлтым кольцом, абзац въезжает напротив неё, прочитанные остаются одной строкой.',
  html: `${HEAD}<div class="rail deco"><i class="fill"></i>${[0, 1, 2, 3].map((k) => `<b class="dot d${k}"></b>`).join('')}<span class="year">2005</span></div>${steps((k) => P(k) + (k === 3 ? MORE : ''))}<div class="done deco">${PS.slice(0, 3).map((p) => `<p>${nb(p)}</p>`).join('')}</div>`,
  css: `.v4.is-anim .head{position:absolute;left:var(--pad);top:9vh}
.v4 .rail{position:absolute;left:calc(var(--pad) + 90px);top:22vh;height:60vh;width:4px;background:var(--line);border-radius:2px}
.v4 .fill{position:absolute;inset:0;background:var(--ind);border-radius:2px;transform-origin:50% 0;transform:scaleY(0)}
.v4 .dot{position:absolute;left:50%;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:var(--soft);box-shadow:0 0 0 4px #fff}
.v4 .d0{top:-9px}.v4 .d1{top:calc(33.3% - 9px)}.v4 .d2{top:calc(66.6% - 9px)}.v4 .d3{top:calc(100% - 9px)}
.v4 .year{position:absolute;right:28px;top:-22px;font-size:clamp(26px,3vw,44px);font-weight:800;color:var(--ind)}
.v4.is-anim .step{position:absolute;left:calc(var(--pad) + 150px);right:calc(var(--pad) + 40px);top:calc(22vh - 10px);max-width:900px}
.v4 .done{position:absolute;left:calc(var(--pad) + 150px);right:calc(var(--pad) + 40px);top:22vh}
.v4 .done p{position:absolute;left:0;right:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--mute);font-size:15px;opacity:0}
.v4 .done p:nth-child(1){top:0}.v4 .done p:nth-child(2){top:20vh}.v4 .done p:nth-child(3){top:40vh}
@media (max-width:760px){.v4 .rail{left:calc(var(--pad) + 6px);top:26vh;height:56vh}.v4 .year{right:auto;left:-6px;top:-48px;font-size:24px}.v4.is-anim .step{left:calc(var(--pad) + 36px);top:calc(26vh - 10px)}.v4 .done{display:none}}`,
  js: `const dots=q('.dot');gsap.set(dots[0],{background:'#fff',boxShadow:'0 0 0 6px var(--sun)',scale:1.3});
gsap.from(one('.rail'),{scaleY:0,transformOrigin:'50% 0',duration:1,ease:'power3.out',delay:.1});
tl.to(one('.fill'),{scaleY:1,duration:3,ease:'none'},.65);
const ys=matchMedia('(max-width:760px)').matches?['0vh','0vh','0vh','0vh']:['0vh','20vh','40vh','60vh'];
for(let k=1;k<4;k++){tl.to(dots[k-1],{background:'var(--ind)',boxShadow:'0 0 0 4px #fff',scale:1,duration:.2},at(k)+.2).to(dots[k],{background:'#fff',boxShadow:'0 0 0 6px var(--sun)',scale:1.3,duration:.3,ease:'back.out(3)'},at(k)+.25);
tl.to(steps[k-1],{autoAlpha:0,duration:.25},at(k)).fromTo(steps[k],{autoAlpha:0,x:40,top:(matchMedia('(max-width:760px)').matches?'calc(26vh - 10px)':'calc(22vh - 10px + '+ys[k]+')')},{autoAlpha:1,x:0,duration:.45},at(k)+.2).to(q('.done p')[k-1],{opacity:1,duration:.3},at(k)+.2)}` })

// 05 · the photo grows from a small window to the whole screen
V.push({ slug: 'foto-raskryvaetsya', title: 'Фото раскрывается на весь экран', ref: ['Atlas by Vaonis', 'https://www.awwwards.com/sites/atlas-by-vaonis'], dark: false,
  how: 'Сначала фото — небольшое окно. С прокруткой окно растёт до всего экрана, на фото ложится ровный синий слой, текст становится белым, на последнем шаге цифры набегают от нуля.',
  html: `${HEAD}<div class="win deco"><img src="../assets/img/astana.webp" alt=""><i class="veil"></i></div>${steps((k) => P(k) + (k === 3 ? `<div class="stats">${STATS.map(([n, l, v]) => `<div><b data-v="${v}">${n}</b><span>${l}</span></div>`).join('')}</div>${MORE}` : ''))}`,
  css: `.v5.is-anim .head{position:absolute;left:var(--pad);top:9vh;z-index:3;transition:color .3s}
.v5 .win{position:absolute;left:50%;top:50%;width:38vw;height:22vw;border-radius:24px;overflow:hidden;z-index:1}
.v5 .win img{width:100%;height:100%;object-fit:cover}.v5 .veil{position:absolute;inset:0;background:var(--deep);opacity:0}
.v5.is-anim .step{position:absolute;left:var(--pad);right:calc(var(--pad) + 48px);z-index:3;max-width:960px}
.v5.is-anim .s0{top:calc(50% + 11vw + 32px);left:31vw;right:31vw}.v5.is-anim .s1{top:calc(9vh + 64px);left:var(--pad)}
.v5.is-anim .s2,.v5.is-anim .s3{top:20vh;color:#fff}.v5 .s2 .hl,.v5 .s3 .hl{color:var(--sun)}.v5 .s3 .more{color:var(--sun)}
.v5 .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:40px}.v5 .stats b{display:block;font-size:clamp(28px,3vw,44px);font-weight:800}.v5 .stats span{font-size:14px;color:var(--soft)}
@media (max-width:760px){.v5 .win{width:70vw;height:44vw}.v5.is-anim .s0{left:var(--pad);right:var(--pad);top:calc(50% + 22vw + 20px)}.v5 .stats{grid-template-columns:1fr 1fr}}`,
  js: `const win=one('.win');gsap.set(win,{xPercent:-50,yPercent:-50});gsap.from(win,{scale:.6,opacity:0,duration:1,ease:'power3.out',delay:.1});
tl.to(win,{width:'64vw',height:'44vh',top:'62%',duration:.7},at(1)).to(win,{width:'100vw',height:'100vh',top:'50%',borderRadius:0,duration:.7},at(2)).to(one('.veil'),{opacity:.85,duration:.5},at(2)+.2).to(one('.head'),{color:'#fff',duration:.3},at(2)+.2).to(one('.win img'),{scale:1.15,duration:1.5,ease:'none'},at(2));
for(let k=1;k<4;k++)swap(k);
q('.stats b').forEach((b,i)=>tl.add(count(b,+b.dataset.v,.4),at(3)+.3+i*.06))` })

// 06 · split screen, photos rise one over another on the right
V.push({ slug: 'ekran-popolam', title: 'Экран пополам, фото меняется', ref: ['Union Properties', 'https://www.awwwards.com/sites/union-properties'],
  how: 'Левая половина с текстом закреплена. Справа каждое новое фото поднимается снизу шторкой и закрывает прежнее, прежнее чуть отъезжает и темнеет. Слова абзаца появляются волной.',
  html: `<div class="col">${HEAD}<div class="steps">${steps((k) => P(k) + (k === 3 ? MORE : ''))}</div></div><div class="pics deco">${['campus.webp', TEAM[1], 'globe.webp', 'astana.webp'].map((f, k) => `<div class="pp p${k}">${IMG(f)}</div>`).join('')}</div>`,
  css: `.v6 .stage{background:var(--paper)}
.v6.is-anim .col{position:absolute;left:var(--pad);top:18vh;width:calc(50% - var(--pad) - 48px)}
.v6.is-anim .steps{position:relative;margin-top:32px}.v6.is-anim .step{position:absolute;left:0;right:0;top:0}
.v6 .pics{position:absolute;left:50%;right:0;top:0;bottom:0;overflow:hidden}
.v6 .pp{position:absolute;inset:0;clip-path:inset(100% 0 0 0)}.v6 .pp.p0{clip-path:inset(0)}.v6 .pp img{width:100%;height:100%;object-fit:cover}
.v6 .w{display:inline-block}
@media (max-width:760px){.v6 .pics{left:0;bottom:auto;height:36%}.v6.is-anim .col{top:calc(36% + 20px);width:auto;right:calc(var(--pad) + 30px)}}`,
  js: `steps.forEach(s=>split(s.querySelector('.para')));
gsap.from(steps[0].querySelectorAll('.w'),{opacity:0,y:20,stagger:.02,duration:.5,delay:.2});gsap.from(one('.pp.p0 img'),{scale:1.2,duration:1.4,ease:'power3.out'});
const pp=q('.pp');
for(let k=1;k<4;k++){tl.to(pp[k],{clipPath:'inset(0% 0 0 0)',duration:.7,ease:'power3.inOut'},at(k)).from(pp[k].querySelector('img'),{scale:1.3,duration:.8},at(k)).to(pp[k-1].querySelector('img'),{scale:.92,filter:'brightness(.6)',duration:.7},at(k));
tl.to(steps[k-1],{autoAlpha:0,duration:.25},at(k)).set(steps[k],{autoAlpha:1},at(k)+.2).from(steps[k].querySelectorAll('.w'),{opacity:0,y:24,stagger:.012,duration:.3},at(k)+.2)}` })

// 07 · a chapter index on the left, the current chapter marked; click to jump
V.push({ slug: 'oglavlenie', title: 'Оглавление глав слева', ref: ['Plastic Human', 'https://www.awwwards.com/sites/plastic-human'],
  how: 'Слева закреплено оглавление из первых слов каждого абзаца, жёлтая метка переезжает к текущей главе. По клику на главу страница прокручивается к ней. Справа иллюстрация вращается и сменяется, слова абзаца проявляются.',
  html: `${HEAD}<nav class="toc deco" aria-label="Главы">${CH.map((c, k) => `<a href="#" data-go="${k}">${c}</a>`).join('')}<i class="mark"></i></nav><div class="art deco">${['law', 'people', 'docs', 'cap'].map((n, k) => `<span class="ia a${k}">${ill(n, 140)}</span>`).join('')}</div>${steps((k) => P(k) + (k === 3 ? MORE : ''))}`,
  css: `.v7.is-anim .head{position:absolute;left:var(--pad);top:12vh}
.v7 .toc{position:absolute;left:var(--pad);top:22vh;width:min(300px,26vw);display:flex;flex-direction:column;gap:6px;border-right:1px solid var(--line);padding-right:24px}
.v7 .toc a{display:block;padding:10px 12px 10px 28px;border-radius:12px;text-decoration:none;color:var(--mute);font-size:15px;transition:color .3s,background .2s}
.v7 .toc a:hover{background:var(--paper);color:var(--ink)}.v7 .toc a.on{color:var(--ink);font-weight:700}
.v7 .mark{position:absolute;left:10px;top:20px;width:10px;height:10px;border-radius:50%;background:var(--sun);pointer-events:none}
.v7 .art{position:absolute;left:calc(var(--pad) + min(300px,26vw) + 80px);top:22vh;width:140px;height:140px}.v7 .ia{position:absolute;inset:0;opacity:0}.v7 .ia.a0{opacity:1}
.v7.is-anim .step{position:absolute;left:calc(var(--pad) + min(300px,26vw) + 80px);right:calc(var(--pad) + 48px);top:calc(22vh + 172px);max-width:820px}
@media (max-width:760px){.v7 .toc{display:none}.v7 .art{left:var(--pad);top:20vh;width:96px;height:96px}.v7 .art svg{width:96px;height:96px}.v7.is-anim .step{left:var(--pad);top:calc(20vh + 120px)}}`,
  js: `const links=q('.toc a'),mark=one('.mark'),ia=q('.ia');links[0].classList.add('on');
steps.forEach(s=>split(s.querySelector('.para')));gsap.from(ia[0],{rotate:-30,scale:.5,duration:.9,ease:'back.out(2)',delay:.2});
for(let k=1;k<4;k++){tl.to(mark,{y:links[k].offsetTop-links[0].offsetTop,duration:.4,ease:'power3.inOut'},at(k)).call(()=>links.forEach((l,i)=>l.classList.toggle('on',i===k)),null,at(k)+.3).call(()=>links.forEach((l,i)=>l.classList.toggle('on',i===k-1)),null,at(k)+.29);
tl.to(ia[k-1],{opacity:0,rotate:30,scale:.6,duration:.3},at(k)).fromTo(ia[k],{opacity:0,rotate:-30,scale:.6},{opacity:1,rotate:0,scale:1,duration:.4,ease:'back.out(2)'},at(k)+.2);
tl.to(steps[k-1],{autoAlpha:0,duration:.25},at(k)).set(steps[k],{autoAlpha:1},at(k)+.2).from(steps[k].querySelectorAll('.w'),{opacity:0,filter:'blur(6px)',stagger:.01,duration:.3},at(k)+.2)}` })

// 08 · colour curtains: each paragraph on its own brand-colour panel rising from below
V.push({ slug: 'cvetnye-shtorki', title: 'Цветные шторки', ref: ['Bridgement', 'https://www.awwwards.com/sites/bridgement'],
  how: 'Каждый абзац на своей цветной панели во весь экран. Новая панель поднимается снизу со скруглёнными углами, которые выпрямляются у верха; строки текста выезжают из-под маски.',
  html: `${HEAD}${[0, 1, 2, 3].map((k) => `<div class="step panel c${k}"><div class="in"><p class="lead">${hl(k)}</p>${k === 3 ? MORE : ''}</div></div>`).join('')}`,
  css: `.v8.is-anim .head{position:absolute;left:var(--pad);top:9vh;z-index:9;color:#fff;transition:color .3s}
.v8 .panel{padding:64px var(--pad)}.v8.is-anim .panel{position:absolute;inset:0;display:flex;align-items:center;padding:0 calc(var(--pad) + 48px) 0 var(--pad)}
.v8 .c0{background:var(--deep);color:#fff}.v8 .c1{background:var(--sun);color:var(--ink)}.v8 .c2{background:var(--ind);color:#fff}.v8 .c3{background:var(--paper);color:var(--ink)}
.v8 .lead{font-size:clamp(24px,3vw,46px);font-weight:700;line-height:1.2;max-width:1150px}
.v8 .c0 .hl,.v8 .c2 .hl{color:var(--sun)}.v8 .c1 .hl{color:var(--deep);font-weight:800}.v8 .c3 .hl{color:var(--ind)}
.v8 .c1 .more,.v8 .c3 .more{color:var(--ind)}.v8 .w{display:inline-block}`,
  js: `const pn=steps;gsap.set(pn.slice(1),{autoAlpha:1,yPercent:100,borderRadius:'40px 40px 0 0'});pn.forEach(p=>split(p.querySelector('.lead')));
gsap.from(pn[0].querySelectorAll('.w'),{yPercent:100,opacity:0,stagger:.015,duration:.6,ease:'power3.out',delay:.2});
const hc=['#fff','#0F1535','#fff','#0F1535'];
for(let k=1;k<4;k++){tl.to(pn[k],{yPercent:0,borderRadius:'0px 0px 0 0',duration:.7,ease:'power3.inOut'},at(k)).to(pn[k-1],{yPercent:-12,duration:.7},at(k)).to(one('.head'),{color:hc[k],duration:.2},at(k)+.4).from(pn[k].querySelectorAll('.w'),{yPercent:100,opacity:0,stagger:.006,duration:.35},at(k)+.4)}` })

// 09 · an archive: the decree sheet drops onto the table, then cards stack up
V.push({ slug: 'arhiv', title: 'Архив: постановление как документ', ref: ['Archivio Garonzi', 'https://www.awwwards.com/sites/archivio-garonzi'],
  how: 'История подаётся как архив. Лист постановления падает на стол и покачивается, печать-иллюстрация «пришлёпывается». Дальше справа въезжают карточки, прочитанные складываются стопкой слева.',
  html: `${HEAD}<div class="desk">${[0, 1, 2, 3].map((k) => `<article class="step doc d${k}">${k === 0 ? `<span class="seal">${ill('law', 96)}</span>${P(0)}<i class="sign deco"></i>` : `<div class="txt">${P(k)}${k === 3 ? MORE : ''}</div><div class="att deco">${k === 1 ? ill('people', 180) : IMG(k === 2 ? 'globe.webp' : 'campus.webp')}</div>`}</article>`).join('')}</div>`,
  css: `.v9 .stage{background:var(--paper)}.v9.is-anim .head{position:absolute;left:var(--pad);top:9vh}
.v9 .doc{background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:0 14px 36px rgba(15,21,53,.10);padding:40px}
.v9.is-anim .desk{position:absolute;inset:18vh calc(var(--pad) + 48px) 8vh var(--pad)}.v9.is-anim .doc{position:absolute}
.v9.is-anim .d0{left:18%;right:18%;top:0;border-radius:8px}.v9 .seal{display:inline-block;margin-bottom:20px}.v9 .sign{display:block;width:240px;height:2px;background:var(--line);margin-top:36px}
.v9.is-anim .d1,.v9.is-anim .d2,.v9.is-anim .d3{left:24%;right:0;top:6vh;display:grid;grid-template-columns:1.3fr 1fr;gap:32px}
.v9 .att{border-radius:14px;overflow:hidden;display:grid;place-items:center;background:var(--sunL);min-height:200px}.v9 .att img{width:100%;height:100%;object-fit:cover}
@media (max-width:760px){.v9.is-anim .d0{left:0;right:0}.v9.is-anim .d1,.v9.is-anim .d2,.v9.is-anim .d3{left:0;grid-template-columns:1fr;padding:24px}.v9 .att{min-height:120px}}`,
  js: `const d=steps;gsap.set(d[0],{rotate:-1.5});gsap.from(d[0],{y:-500,rotate:-8,duration:1.1,ease:'bounce.out',delay:.1});gsap.from(one('.seal'),{scale:2.4,opacity:0,rotate:-25,duration:.5,ease:'back.out(2)',delay:1.1});
gsap.set(d.slice(1),{autoAlpha:1,xPercent:120,rotate:4});
for(let k=1;k<4;k++){tl.to(d[k],{xPercent:0,rotate:0,duration:.6,ease:'power3.out'},at(k));for(let j=0;j<k;j++)tl.to(d[j],{xPercent:-58-(k-j)*3,yPercent:-(k-j)*4,scale:.62,rotate:-2-(k-j),opacity:.9,duration:.6},at(k))}` })

// 10 · a ring fills a quarter at each step around the step's illustration
V.push({ slug: 'kolco', title: 'Кольцо прогресса', ref: ['Greenchoice 15 jaar', 'https://www.awwwards.com/sites/greenchoice-15-year-timeline'],
  how: 'Кольцо плавно заполняется по мере прокрутки, как в блоке «Болашак» в цифрах» на сайте. Внутри кольца иллюстрация шага переворачивается и сменяется следующей, справа сменяется абзац.',
  html: `${HEAD}<div class="ring deco"><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="88" fill="none" stroke="#DDE0EC" stroke-width="12"/><circle class="arc" cx="100" cy="100" r="88" fill="none" stroke="#FFC629" stroke-width="12" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 100 100)"/></svg>${['law', 'people', 'docs', 'cap'].map((n, k) => `<span class="ri r${k}">${ill(n, 110)}</span>`).join('')}</div>${steps((k) => P(k) + (k === 3 ? MORE : ''))}`,
  css: `.v10 .stage{background:var(--paper)}.v10.is-anim .head{position:absolute;left:var(--pad);top:10vh}
.v10 .ring{position:absolute;left:var(--pad);top:50%;width:min(34vw,420px);aspect-ratio:1;transform:translateY(-44%)}
.v10 .ring>svg{width:100%;height:100%}.v10 .ri{position:absolute;inset:0;display:grid;place-items:center;opacity:0}.v10 .ri.r0{opacity:1}
.v10.is-anim .step{position:absolute;left:calc(var(--pad) + min(34vw,420px) + 72px);right:calc(var(--pad) + 48px);top:30vh;max-width:760px}
@media (max-width:760px){.v10 .ring{width:52vw;top:18vh;transform:none}.v10.is-anim .step{left:var(--pad);top:calc(18vh + 52vw + 24px)}}`,
  js: `const ri=q('.ri');gsap.from(one('.ring'),{scale:.7,opacity:0,duration:.9,ease:'back.out(1.6)',delay:.1});
tl.to(one('.arc'),{strokeDashoffset:0,duration:3.8,ease:'none'},.1);
for(let k=1;k<4;k++){tl.to(ri[k-1],{rotationY:90,opacity:0,duration:.25},at(k)).fromTo(ri[k],{rotationY:-90,opacity:0},{rotationY:0,opacity:1,duration:.35,ease:'back.out(2)'},at(k)+.25);swap(k)}` })

// 11 · words light up one by one while scrolling
V.push({ slug: 'slova-zagorayutsya', title: 'Слова загораются при прокрутке', ref: ['Loop Industries', 'https://www.awwwards.com/sites/loop-industries'],
  how: 'Крупный текст абзаца сначала бледный; с прокруткой слова по одному становятся тёмными, ключевые — синими. Прочитанный абзац уезжает вверх и остаётся одной бледной строкой.',
  html: `${HEAD}<p class="done deco"></p>${[0, 1, 2, 3].map((k) => `<div class="step s${k}"><p class="lead">${hl(k)}</p>${k === 3 ? MORE : ''}</div>`).join('')}`,
  css: `.v11.is-anim .head{position:absolute;left:var(--pad);top:9vh}
.v11 .lead{font-size:clamp(24px,3.1vw,46px);font-weight:700;line-height:1.22;max-width:1180px}
.v11.is-anim .step{position:absolute;left:var(--pad);right:calc(var(--pad) + 48px);top:24vh}
.v11.is-anim .w{color:var(--soft)}.v11.is-anim .hl{color:inherit}
.v11 .done{position:absolute;left:var(--pad);right:calc(var(--pad) + 48px);top:16vh;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:15px}`,
  js: `const done=one('.done');steps.forEach(s=>split(s.querySelector('.lead')));
for(let k=0;k<4;k++){const ws=[...steps[k].querySelectorAll('.w')];ws.forEach(w=>{const isHl=!!w.closest('.hl');tl.to(w,{color:isHl?'#384899':'#0F1535',duration:.05},k+.05+.8*ws.indexOf(w)/ws.length)});
if(k){tl.to(steps[k-1],{autoAlpha:0,y:-60,duration:.25},k-.02).set(steps[k],{autoAlpha:1},k).call(()=>{done.textContent=steps[k-1].textContent.trim()},null,k).fromTo(done,{opacity:0},{opacity:1,duration:.2},k)}}` })

// 12 · from a globe to the Centre's address
V.push({ slug: 'ot-globusa-k-adresu', title: 'От глобуса к адресу', ref: ['Route 66 Centennial', 'https://www.awwwards.com/sites/route-66-centennial'], dark: true,
  how: 'Камера приближается: глобус, затем Астана, затем город крупнее. Фото во весь экран под ровным синим слоем 85 %. На последнем шаге на фото падает метка и выезжает карточка с адресом Центра.',
  html: `<div class="bg deco"><img class="g" src="../assets/img/globe.webp" alt=""><img class="a" src="../assets/img/astana.webp" alt=""><i class="veil"></i></div>${HEAD}${steps((k) => P(k) + (k === 3 ? `<div class="addr"><b>${ADDR[0]}</b><span>${ADDR[1]}</span>${MORE}</div>` : ''))}<i class="pin deco"></i>`,
  css: `.v12,.v12 .stage{background:var(--deep);color:#fff}.v12.is-anim .head{position:absolute;left:var(--pad);top:9vh;z-index:3}
.v12 .bg{position:absolute;inset:0}.v12 .bg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.v12 .bg .a{opacity:0}.v12 .veil{position:absolute;inset:0;background:var(--deep);opacity:.85}
.v12.is-anim .step{position:absolute;left:var(--pad);right:calc(var(--pad) + 48px);top:20vh;z-index:3;max-width:900px}
.v12 .addr{margin-top:32px;background:#fff;color:var(--ink);border-radius:20px;padding:24px 28px;max-width:440px;display:flex;flex-direction:column;gap:6px;box-shadow:0 14px 36px rgba(0,0,0,.2)}.v12 .addr .more{color:var(--ind);margin-top:10px}
.v12 .pin{position:absolute;left:66%;top:46%;width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--sun);z-index:2;opacity:0}
.v12 .pin::after{content:"";position:absolute;left:12px;top:12px;width:16px;height:16px;border-radius:50%;background:var(--deep)}`,
  js: `const g=one('.bg .g'),a=one('.bg .a');gsap.from(g,{scale:1.3,duration:1.6,ease:'power3.out'});
tl.to(g,{scale:2.2,duration:1.2,ease:'power2.in'},.2).to(g,{opacity:0,duration:.3},at(1)+.2).fromTo(a,{opacity:0,scale:1.4},{opacity:1,scale:1,duration:.5},at(1)+.2).to(a,{scale:1.35,duration:1},at(2)).to(a,{scale:1.6,duration:1},at(3));
for(let k=1;k<4;k++)swap(k);
tl.fromTo(one('.pin'),{opacity:0,y:-120},{opacity:1,y:0,duration:.4,ease:'bounce.out'},at(3)+.3).from(one('.addr'),{y:40,opacity:0,duration:.4},at(3)+.45)` })

// 13 · numbers to the whole screen, counted up, with the share of 13 011
V.push({ slug: 'cifry', title: 'Цифры на весь экран', ref: ['Energy Trust Timeline', 'https://www.awwwards.com/sites/eto-10-year-timeline-1'], dark: true,
  how: 'Каждый шаг — одна цифра из блока «Болашак» в цифрах» во весь экран. Цифра набегает от нуля, полоса показывает долю от 13 011, фон переливается из синего в белый и обратно; рядом абзац о Центре.',
  html: `${HEAD}${[0, 1, 2, 3].map((k) => `<div class="step s${k}"><div class="num"><b data-v="${STATS[k][2]}">${STATS[k][0]}</b><span>${STATS[k][1]}</span><i class="bar"><i style="--w:${(STATS[k][2] / 13011 * 100).toFixed(1)}%"></i></i></div><div class="side">${P(k)}${k === 3 ? MORE : ''}</div></div>`).join('')}`,
  css: `.v13 .stage{background:var(--deep);color:#fff}.v13.is-anim .head{position:absolute;left:var(--pad);top:9vh;z-index:3}
.v13 .step{display:grid;grid-template-columns:1.1fr 1fr;gap:56px;align-items:center}
.v13.is-anim .step{position:absolute;left:var(--pad);right:calc(var(--pad) + 48px);top:22vh}
.v13 .num b{display:block;font-size:min(14vw,200px);font-weight:800;line-height:1;letter-spacing:-.03em}.v13 .num span{display:block;margin-top:12px;font-size:20px;opacity:.75}
.v13 .bar{display:block;margin-top:28px;height:10px;border-radius:5px;background:currentColor;position:relative;opacity:.9;background:rgba(201,207,234,.35)}.v13 .bar i{position:absolute;left:0;top:0;bottom:0;width:var(--w);background:var(--sun);border-radius:5px;transform-origin:0 50%}
.v13 .side .para{font-size:clamp(17px,1.4vw,22px)}.v13 .light .hl{color:var(--ind)}.v13 .light .more{color:var(--ind)}
@media (max-width:760px){.v13 .step{grid-template-columns:1fr;gap:20px}.v13.is-anim .step{top:18vh}}`,
  js: `const bs=q('.num b');
const run=(k)=>{tl.add(count(bs[k],+bs[k].dataset.v,.45),k?at(k)+.25:0.02).from(steps[k].querySelector('.bar i'),{scaleX:0,duration:.6},k?at(k)+.25:0.02)};
gsap.from(steps[0].querySelector('.bar i'),{scaleX:0,duration:1,ease:'power3.out',delay:.3});
const bg=['#27346F','#FFFFFF','#27346F','#FFFFFF'],fg=['#fff','#0F1535','#fff','#0F1535'];
for(let k=1;k<4;k++){tl.to(stage,{backgroundColor:bg[k],color:fg[k],duration:.4},at(k)).call(()=>{story.classList.toggle('dark',k%2===0);steps[k].classList.toggle('light',k%2===1)},null,at(k)+.2);swap(k);run(k)}` })

// 14 · scattered photos fly in and settle into a collage around the card
V.push({ slug: 'kollazh', title: 'Коллаж собирается из фото', ref: ['Museum of Love', 'https://www.awwwards.com/sites/museum-of-love'],
  how: 'Фотографии сначала разбросаны за краями и повёрнуты. С прокруткой они подлетают и на последнем шаге складываются в ровный коллаж по обе стороны белой карточки, в которой сменяются абзацы.',
  html: `<div class="photos deco">${['campus.webp', 'astana.webp', 'globe.webp', 'library.webp', TEAM[1], TEAM[2]].map((f, j) => `<span class="ph f${j}">${IMG(f)}</span>`).join('')}</div><div class="card">${HEAD}<div class="steps">${steps((k) => P(k) + (k === 3 ? MORE : ''))}</div></div>`,
  css: `.v14 .stage{background:var(--paper)}
.v14 .ph{position:absolute;width:min(20vw,280px);aspect-ratio:9/7;border-radius:16px;overflow:hidden;box-shadow:0 14px 32px rgba(15,21,53,.12)}.v14 .ph img{width:100%;height:100%;object-fit:cover}
.v14 .f0,.v14 .f2,.v14 .f4{left:var(--pad)}.v14 .f1,.v14 .f3,.v14 .f5{right:calc(var(--pad) + 40px)}.v14 .f0,.v14 .f1{top:8vh}.v14 .f2,.v14 .f3{top:calc(50% - min(10vw,140px) * .78)}.v14 .f4,.v14 .f5{bottom:8vh}
.v14 .card{background:#fff;border-radius:24px;box-shadow:0 18px 40px rgba(15,21,53,.12);padding:40px}
.v14.is-anim .card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(44vw,600px);z-index:3}
.v14.is-anim .steps{position:relative;margin-top:24px}.v14.is-anim .step{position:absolute;left:0;right:0;top:0}
.v14 .card .para{font-size:clamp(17px,1.3vw,20px)}
@media (max-width:760px){.v14 .ph{width:34vw}.v14.is-anim .card{width:calc(100% - 2 * var(--pad));padding:24px}}`,
  js: `const ph=q('.ph');const from=[[-60,-40,-14],[60,-50,10],[-80,0,9],[80,10,-12],[-50,60,7],[60,50,-6]];
ph.forEach((p,j)=>{const [x,y,r]=from[j];gsap.set(p,{xPercent:x*2.2,yPercent:y*2,rotate:r*2,scale:.8});tl.to(p,{xPercent:x*(j%2?1:1)*0,yPercent:0,rotate:0,scale:1,duration:2.6,ease:'power2.out'},.2+j*.08)});
gsap.from(one('.card'),{scale:.9,opacity:0,duration:.8,ease:'power3.out',delay:.1});
for(let k=1;k<4;k++)swap(k,30)` })

// 15 · a row of stage illustrations; the current one grows on its tile
V.push({ slug: 'illyustracii-etapov', title: 'Своя иллюстрация на каждый этап', ref: ['Corporate Evolution Timeline', 'https://www.awwwards.com/sites/corporate-evolution-timeline'],
  how: 'Сверху ряд из четырёх иллюстраций — этапы истории. Текущая плашка вырастает и окрашивается, иллюстрация подпрыгивает, остальные сжимаются и бледнеют. Снизу сменяется абзац.',
  html: `${HEAD}<div class="row deco">${['law', 'people', 'docs', 'cap'].map((n, k) => `<span class="tile t${k}">${ill(n, 160)}</span>`).join('')}</div>${steps((k) => P(k) + (k === 3 ? MORE : ''))}`,
  css: `.v15.is-anim .head{position:absolute;left:var(--pad);top:9vh}
.v15 .row{position:absolute;left:var(--pad);right:calc(var(--pad) + 48px);top:18vh;height:min(30vh,300px);display:flex;gap:20px}
.v15 .tile{flex:1;border-radius:24px;background:var(--paper);display:grid;place-items:center;overflow:hidden}.v15 .tile svg{width:42%;height:auto;opacity:.35}
.v15.is-anim .step{position:absolute;left:var(--pad);right:calc(var(--pad) + 48px);top:calc(18vh + min(30vh,300px) + 48px);max-width:1040px}`,
  js: `const tiles=q('.tile'),tint=['#E7EAF7','#FFF5D1','#E7EAF7','#FFF5D1'];
const on=(k,t)=>{tiles.forEach((el,i)=>{tl.to(el,{flexGrow:i===k?3.2:1,backgroundColor:i===k?tint[i]:'#F4F5FB',duration:.5},t);tl.to(el.querySelector('svg'),{opacity:i===k?1:.35,scale:i===k?1.15:1,duration:.4},t)});tl.fromTo(tiles[k].querySelector('svg'),{y:0},{y:-18,duration:.18,yoyo:true,repeat:1,ease:'power1.out'},t+.3)};
gsap.set(tiles[0],{flexGrow:3.2,backgroundColor:tint[0]});gsap.set(tiles[0].querySelector('svg'),{opacity:1,scale:1.15});gsap.from(tiles,{y:40,opacity:0,stagger:.08,duration:.6,ease:'power3.out',delay:.1});
for(let k=1;k<4;k++){on(k,at(k));swap(k)}` })

// ---------- pages ----------
const pad = (n) => String(n).padStart(2, '0')
const file = (i) => `${pad(i + 1)}-${V[i].slug}.html`
const page = (i) => {
  const v = V[i], n = i + 1, prev = (i + V.length - 1) % V.length, next = (i + 1) % V.length
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${pad(n)} · ${v.title} · О компании</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="../assets/base.css">
<style>
${v.css}
</style>
</head>
<body>
<header class="lab-top"><div class="wrap"><a href="../" aria-label="Все варианты"><img src="../assets/img/logo.svg" alt="Bolashak" width="92" height="30"></a><nav><a href="../">Все 15 вариантов</a><a href="${file(prev)}">← ${pad(prev + 1)}</a><a href="${file(next)}">${pad(next + 1)} →</a></nav></div></header>
<main>
<section class="intro"><div class="wrap"><h1>${pad(n)} · ${v.title}</h1><p class="how">${v.how}</p><a class="ref" href="${v.ref[1]}" target="_blank" rel="noopener">Пример на Awwwards: ${v.ref[0]} ↗</a><p class="hint"><i aria-hidden="true"></i>Прокрутите вниз: блок закрепится и покажет историю в четыре шага</p></div></section>
<section class="story v${n}${v.dark ? ' dark' : ''}" aria-label="О компании"><div class="stage">
${v.html}
<div class="prog" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
</div></section>
<section class="after"><div class="wrap"><nav class="pager" aria-label="Другие варианты"><a href="${file(prev)}"><small>Предыдущий</small><strong>${pad(prev + 1)} · ${V[prev].title}</strong></a><a href="${file(next)}"><small>Следующий</small><strong>${pad(next + 1)} · ${V[next].title}</strong></a></nav>
<p class="credits">Тексты блока — с bolashak.gov.kz, слово в слово. Фото Астаны: <a href="https://commons.wikimedia.org/wiki/File:Central_Downtown_Astana_pamorama.jpg">Ken and Nyetta</a>, CC BY 2.0, кадрировано; фото кампуса, глобуса, библиотеки — CC0; остальные фото — с сайта Центра. Анимации выключаются при настройке «уменьшить движение».</p></div></section>
</main>
<script src="../assets/gsap.min.js"></script>
<script src="../assets/ScrollTrigger.min.js"></script>
<script src="../assets/story.js"></script>
<script>
Story.run(({tl,story,stage,split,count,at,swap,steps,q,one})=>{
${v.js}
})
</script>
</body>
</html>
`
}
mkdirSync('v', { recursive: true })
V.forEach((_, i) => writeFileSync('v/' + file(i), page(i)))

const index = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>О компании · 15 вариантов</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="assets/base.css">
<style>
.hero{background:var(--deep);color:#fff;padding:64px 0 56px}.hero h1{font-size:clamp(30px,4vw,56px);font-weight:800}.hero p{margin-top:16px;max-width:760px;color:var(--soft);font-size:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:20px;padding:48px 0 96px}
.card{display:flex;flex-direction:column;gap:10px;padding:24px;border:1px solid var(--line);border-radius:20px;text-decoration:none;color:var(--ink);background:#fff;transition:border-color .2s,box-shadow .2s,transform .2s}
.card:hover{border-color:var(--ind);box-shadow:0 12px 32px rgba(15,21,53,.10);transform:translateY(-3px)}
.card b{font-size:40px;font-weight:800;color:var(--ind);line-height:1;text-align:left}.card strong{font-size:19px}.card span{color:var(--mute);font-size:14px}.card em{font-style:normal;font-size:13px;color:var(--ind);font-weight:600;margin-top:auto}
@media (prefers-reduced-motion:reduce){.card:hover{transform:none}}
</style>
</head>
<body>
<header class="lab-top"><div class="wrap"><img src="assets/img/logo.svg" alt="Bolashak" width="92" height="30"><nav><a href="${SITE}">Страница «О компании» на тестовой копии</a></nav></div></header>
<main>
<section class="hero"><div class="wrap"><h1>Блок «О компании» как история: 15 вариантов</h1><p>Один и тот же текст с bolashak.gov.kz, рассказанный прокруткой вниз в четыре шага. Каждый вариант опирается на сайт с Awwwards. Работает на телефоне, планшете и компьютере; при «уменьшить движение» шаги стоят друг под другом без анимации.</p></div></section>
<div class="wrap"><div class="grid">${V.map((v, i) => `<a class="card" href="v/${file(i)}"><b>${pad(i + 1)}</b><strong>${v.title}</strong><span>${v.how}</span><em>По мотивам: ${v.ref[0]}</em></a>`).join('')}</div></div>
</main>
</body>
</html>
`
writeFileSync('index.html', index)
writeFileSync('.nojekyll', '')
console.log('pages', V.length + 1)
