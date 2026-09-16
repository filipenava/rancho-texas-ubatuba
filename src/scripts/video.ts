type Connection = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (event: string, listener: () => void) => void;
};
const connection = (navigator as Navigator & { connection?: Connection })
  .connection;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const desktop = matchMedia('(min-width: 901px)');
let interacted = false;
const players = [...document.querySelectorAll<HTMLElement>('[data-film]')].map(
  (root) => {
    const video = root.querySelector<HTMLVideoElement>('video')!;
    const button = root.querySelector<HTMLButtonElement>('.film-toggle')!;
    const label = root.querySelector<HTMLElement>('[data-film-label]')!;
    const icon = root.querySelector<HTMLElement>('.film-toggle-icon')!;
    const status = root.querySelector<HTMLElement>('.film-status')!;
    const player = {
      root,
      video,
      button,
      visible: false,
      stopped: false,
      pending: false,
      manual: false,
    };
    button.hidden = false;
    video.muted = true;

    function failed() {
      player.pending = false;
      player.stopped = true;
      root.dataset.error = 'true';
      root.dataset.playing = 'false';
      root.dataset.loading = 'false';
      root.dataset.started = 'false';
      label.textContent = 'Tentar novamente';
      status.textContent = 'O vídeo não carregou. Você pode tentar novamente.';
      status.hidden = false;
      button.setAttribute(
        'aria-label',
        `Tentar reproduzir vídeo: ${root.dataset.title}`,
      );
    }
    async function start(manual: boolean) {
      if (player.pending) return;
      player.manual = manual;
      player.pending = true;
      root.dataset.error = 'false';
      root.dataset.loading = 'true';
      status.hidden = true;
      if (!video.src || video.error) {
        video.src =
          desktop.matches &&
          !connection?.saveData &&
          !/2g|3g/.test(connection?.effectiveType || '')
            ? video.dataset.large!
            : video.dataset.small!;
        video.load();
      }
      try {
        await video.play();
        if (
          document.hidden ||
          (!player.visible && !manual) ||
          (!manual && reduced.matches)
        )
          video.pause();
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') failed();
      } finally {
        player.pending = false;
        root.dataset.loading = 'false';
      }
    }
    button.addEventListener('click', () => {
      if (!video.paused || player.pending) {
        player.stopped = true;
        video.pause();
        player.pending = false;
        root.dataset.loading = 'false';
      } else {
        player.stopped = false;
        void start(true);
      }
    });
    video.addEventListener('playing', () => {
      root.dataset.started = 'true';
      root.dataset.playing = 'true';
      root.dataset.loading = 'false';
      label.textContent = 'Pausar';
      icon.textContent = 'Ⅱ';
      button.setAttribute('aria-label', `Pausar vídeo: ${root.dataset.title}`);
      document
        .querySelectorAll<HTMLVideoElement>('[data-film] video')
        .forEach((other) => {
          if (other !== video && !other.paused) other.pause();
        });
    });
    video.addEventListener('pause', () => {
      root.dataset.playing = 'false';
      if (root.dataset.error === 'true') return;
      label.textContent = 'Reproduzir';
      icon.textContent = '▶';
      button.setAttribute(
        'aria-label',
        `Reproduzir vídeo: ${root.dataset.title}`,
      );
    });
    video.addEventListener('error', failed);
    return { ...player, start, state: player };
  },
);
function allowAuto() {
  return (
    interacted &&
    desktop.matches &&
    !reduced.matches &&
    !connection?.saveData &&
    !/2g|3g/.test(connection?.effectiveType || '') &&
    !document.hidden
  );
}
function refresh() {
  for (const p of players) {
    if (document.hidden || !p.state.visible) {
      p.video.pause();
      continue;
    }
    if (!allowAuto() && !p.state.manual) {
      p.video.pause();
      continue;
    }
    if (
      allowAuto() &&
      p.root.dataset.auto === 'true' &&
      !p.state.stopped &&
      p.video.paused &&
      !p.state.pending
    )
      void p.start(false);
  }
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const p = players.find((p) => p.root === entry.target);
        if (p)
          p.state.visible =
            entry.isIntersecting && entry.intersectionRatio >= 0.35;
      }
      refresh();
    },
    { threshold: [0, 0.35] },
  );
  players.forEach((p) => observer.observe(p.root));
}
for (const event of ['wheel', 'touchstart', 'keydown', 'pointerdown'])
  window.addEventListener(
    event,
    (e) => {
      interacted = true;
      if (!(e.target instanceof Element) || !e.target.closest('.film-toggle'))
        refresh();
    },
    { once: true, passive: true },
  );
document.addEventListener('visibilitychange', refresh);
reduced.addEventListener('change', () => {
  if (reduced.matches) players.forEach((p) => p.video.pause());
  else refresh();
});
desktop.addEventListener('change', refresh);
connection?.addEventListener?.('change', refresh);

// Animate media only as it enters view. Text and links are never hidden.
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!reduced.matches)
          entry.target.animate(
            [{ transform: 'translateY(18px)' }, { transform: 'translateY(0)' }],
            { duration: 700, easing: 'cubic-bezier(.2,.65,.3,1)' },
          );
        reveal.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  document
    .querySelectorAll('[data-motion-reveal]')
    .forEach((el) => reveal.observe(el));
  reduced.addEventListener('change', () => {
    if (reduced.matches)
      document
        .querySelectorAll('[data-motion-reveal]')
        .forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
  });
}
