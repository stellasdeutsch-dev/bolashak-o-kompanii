// Shared scroll-story engine. Each variant page calls Story.run(build) where build(api) returns a GSAP timeline.
// Under «reduce motion» (or without the script) nothing is pinned or animated: the steps stay one under another.
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')
  // wrap every word (or letter) of an element in a span, keeping <strong> and other tags
  const split = (el, mode = 'w') => {
    const walk = (node) => {
      for (const n of [...node.childNodes]) {
        if (n.nodeType === 3) {
          const parts = mode === 'c' ? [...n.data] : n.data.split(/(\s+)/)
          const frag = document.createDocumentFragment()
          for (const p of parts) {
            if (!p) continue
            if (/^\s+$/.test(p)) { frag.append(p); continue }
            const s = document.createElement('span'); s.className = mode === 'c' ? 'ch' : 'w'; s.textContent = p; frag.append(s)
          }
          n.replaceWith(frag)
        } else if (n.nodeType === 1) walk(n)
      }
    }
    walk(el)
    return el.querySelectorAll(mode === 'c' ? '.ch' : '.w')
  }
  // a number counts up to its value, written with a space between thousands as on the site
  const count = (el, to, d = 1) => { const o = { v: 0 }; return gsap.to(o, { v: to, duration: d, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('ru-RU').replace(/ /g, ' ') } }) }
  const run = (build) => {
    const story = document.querySelector('.story')
    if (!story || reduce.matches || !window.gsap || !window.ScrollTrigger) return
    gsap.registerPlugin(ScrollTrigger)
    story.classList.add('is-anim')
    const stage = story.querySelector('.stage')
    const bars = story.querySelectorAll('.prog i')
    const steps = 4
    let cur = -1
    const setStep = (k) => { if (k === cur) return; cur = k; story.dataset.step = k; bars.forEach((b, i) => b.classList.toggle('on', i === k)) }
    setStep(0)
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: stage, start: 'top top', end: () => '+=' + Math.round(innerHeight * steps * 0.9), pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: (st) => setStep(Math.min(steps - 1, Math.floor(st.progress * steps * 0.999))) } })
    // a box of stacked steps is as tall as its tallest step
    story.querySelectorAll('.steps').forEach((box) => { box.style.minHeight = Math.max(...[...box.children].map((c) => c.offsetHeight)) + 'px' })
    const stepEls = [...story.querySelectorAll('.step')]
    gsap.set(stepEls, { autoAlpha: 0 }); gsap.set(stepEls[0], { autoAlpha: 1 })
    // the change to step k is centred on the moment the progress reaches k
    const at = (k) => k - 0.35
    const swap = (k, dy = 40) => { tl.to(stepEls[k - 1], { autoAlpha: 0, y: -dy, duration: 0.35 }, at(k)).fromTo(stepEls[k], { autoAlpha: 0, y: dy }, { autoAlpha: 1, y: 0, duration: 0.45 }, at(k) + 0.2) }
    build({ tl, story, stage, split, count, at, swap, steps: stepEls, q: (s) => [...story.querySelectorAll(s)], one: (s) => story.querySelector(s) })
    tl.to({}, { duration: 0.001 }, steps)
    // a click on a chapter link scrolls to its step
    story.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const st = tl.scrollTrigger; const k = +a.dataset.go; window.scrollTo({ top: st.start + (st.end - st.start) * (k + 0.5) / steps, behavior: 'smooth' }) }))
    // switching «reduce motion» on while the page is open shows the still version
    reduce.addEventListener('change', () => location.reload())
  }
  window.Story = { run, split, count }
})()
