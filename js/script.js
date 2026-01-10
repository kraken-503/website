// ----------------------
// Menu Navigation
// ----------------------
function setupMenu() {
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('data-section');

      // Hide all sections
      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
      });

      // Show the selected section
      document.getElementById(target).classList.remove('hidden');

      // Update active link
      document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// ----------------------
// Terminal Typewriter
// ----------------------
const terminalText = "kraken-503";  // Replace with your name
const typedNameEl = document.getElementById("typed-name");
let idx = 0;
let deleting = false;

function typeWriterLoop() {
  if (!typedNameEl) return;

  if (!deleting && idx < terminalText.length) {
    typedNameEl.textContent += terminalText.charAt(idx);
    idx++;
    setTimeout(typeWriterLoop, 120);
  } else if (deleting && idx > 0) {
    typedNameEl.textContent = terminalText.substring(0, idx - 1);
    idx--;
    setTimeout(typeWriterLoop, 80);
  } else {
    if (!deleting) {
      deleting = true;
      setTimeout(typeWriterLoop, 3000); // pause before erasing
    } else {
      deleting = false;
      setTimeout(typeWriterLoop, 2000); // pause before typing again
    }
  }
}

// ----------------------
// Writeups functionality
// ----------------------
const writeups = [
  {
    title: "neovim",
    date: "Jan 2026",
    link: "./writeups/neovim.html"
  },
  {
    title: "iusearchbtw",
    date: "Dec 2025",
    link: "./writeups/archlinux.html"
  }
];

function loadWriteups() {
  const container = document.getElementById("writeups-container");
  if (!container) return;
  writeups.forEach(w => {
    const heading = document.createElement("a");
    heading.className = "writeup-heading";
    heading.href = w.link;
    heading.innerHTML = `<h3>$ cat ${w.title.replace(/\s+/g, "_")}.txt</h3><small>${w.date}</small>`;
    container.appendChild(heading);
  });
}

// ----------------------
// Init
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  // Start typewriter
  if (typedNameEl) {
    typedNameEl.textContent = "";
    typeWriterLoop();
  }
  // Setup menu
  setupMenu();
  // Load writeups
  loadWriteups();
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('data-section');

    // Update hash in URL
    window.location.hash = target;

    // Hide all sections
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    // Show selected section
    document.getElementById(target).classList.remove('hidden');

    // Update active link
    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const section = window.location.hash.replace('#','') || 'home';
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
  const target = document.getElementById(section);
  if (target) target.classList.remove('hidden');

  // Update nav active state
  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('data-section') === section) {
      a.classList.add('active');
    }
  });
});

// ----------------------
// WaveSurfer Visualizer
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#00ff9f',
    progressColor: '#ffffff',
    height: 115,
    responsive: true
  });

  wavesurfer.load('audio/gotye.mp3');

  // ensure starting volume
  wavesurfer.setVolume(1);

  // simple easeInOut function
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function rampVolume(target, duration = 200) {
    return new Promise(resolve => {
      const startTime = performance.now();
      const startVol = wavesurfer.getVolume();
      const delta = target - startVol;

      function step(now) {
        const p = Math.min(1, (now - startTime) / duration);
        const eased = easeInOut(p);
        wavesurfer.setVolume(startVol + delta * eased);
        if (p < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  async function fadePause() {
    // fade out then pause
    await rampVolume(0, 200); // 200ms fade
    wavesurfer.pause();
    // restore volume to 1 so next play fades in from full volume
    wavesurfer.setVolume(1);
  }

  async function fadePlay() {
    // start from 0 so fade-in is audible
    wavesurfer.setVolume(0);
    wavesurfer.play();
    await rampVolume(1, 200); // 200ms fade
  }

  const playBtn = document.getElementById('playPause');
  if (playBtn) {
    playBtn.addEventListener('click', async () => {
      // if currently playing, fade out then pause; otherwise fade in then play
      if (wavesurfer.isPlaying()) {
        await fadePause();
        playBtn.textContent = '$ play';
      } else {
        await fadePlay();
        playBtn.textContent = '$ pause';
      }
    });
  }
});


//dark/light switcher
   
const toggleBtn = document.getElementById('theme-toggle');
const iconMoon = document.getElementById('icon-moon');
const iconSun = document.getElementById('icon-sun');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  if (document.body.classList.contains('light-mode')) {
    iconMoon.style.display = 'none';
    iconSun.style.display = 'inline';
    localStorage.setItem('theme', 'light');
  } else {
    iconMoon.style.display = 'inline';
    iconSun.style.display = 'none';
    localStorage.setItem('theme', 'dark');
  }
});

// Load saved preference
window.onload = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    iconMoon.style.display = 'none';
    iconSun.style.display = 'inline';
  }
};

