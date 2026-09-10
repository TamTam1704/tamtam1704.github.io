const dialog = document.querySelector('#detail');
const content = document.querySelector('#modal-content');

const projects = [
  {
    title: 'Mythic Heroes',
    type: 'Cinematic trailer',
    image: 'myth',
    text: 'An imagined adventure through floating kingdoms. A space for cinematic storytelling, scene transitions, and sound design.',
    tags: ['Trailer', 'Storytelling', 'Sound design']
  },
  {
    title: 'Puzzle Bloom',
    type: 'User acquisition creative',
    image: 'bloom',
    text: 'A bright, playful concept for a mobile puzzle game. A space to showcase hooks, gameplay edits, and creative variations.',
    tags: ['Game ads', 'Gameplay', 'Creative variants']
  },
  {
    title: 'Play Together',
    type: 'Short-form stories',
    image: 'play',
    text: 'A little character. A lot of personality. A space for playful short-form edits and character-led game content.',
    tags: ['Social content', 'Character animation', 'Short form']
  }
];


function openModal(html) {
  content.innerHTML = html;
  dialog.showModal();
}


// Project cards
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const p = projects[Number(button.dataset.project)];

    openModal(`
      <img
        class="modal-image"
        src="assets/${p.image}.webp"
        alt="${p.title} concept artwork"
      >

      <span class="modal-kicker">
        ${p.type} · Concept preview
      </span>

      <h2>${p.title}</h2>

      <p>${p.text}</p>

      <div class="tags">
        ${p.tags.map(t => `<span>${t}</span>`).join('')}
      </div>

      <div class="notice">
        <strong>Demo project</strong><br>
        This artwork comes from the portfolio visual reference.
        An original project video and production details have not been added yet.
      </div>
    `);
  });
});


// About / Contact modal
document.querySelectorAll('[data-modal]').forEach(button => {
  button.addEventListener('click', () => {

    if (button.dataset.modal === 'about') {
      openModal(`
        <div class="modal-icon">🎮</div>

        <span class="modal-kicker">
          The person behind the timeline
        </span>

        <h2>Hi, I’m Tam.</h2>

        <p>
          A video editor and game creative, bringing gameplay and ideas
          to life through trailers, ads, and short-form stories.
        </p>

        <p>
          I enjoy playful worlds, expressive characters,
          and the little details that make an edit feel right.
        </p>

        <div class="tags">
          <span>Video editing</span>
          <span>Game creative</span>
          <span>Visual storytelling</span>
        </div>
      `);

    } else {
      openModal(`
        <div class="modal-icon">✉️</div>

        <span class="modal-kicker">
          Let’s create together
        </span>

        <h2>
          A great story starts<br>
          with a hello.
        </h2>

        <p>
          Interested in a trailer, game ad, or a playful new idea?
        </p>

        <div class="notice">
          Contact details are coming soon.
          This portfolio demo does not yet include Tam’s email or social links.
        </div>
      `);
    }

  });
});


// Close modal
document.querySelector('.close').addEventListener('click', () => {
  dialog.close();
});


// Close modal when clicking outside
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();

    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    ) {
      dialog.close();
    }
  }
});


// Project filters
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {

    document.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.toggle('selected', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });

    document.querySelectorAll('[data-project]').forEach(card => {
      card.hidden =
        button.dataset.filter !== 'all' &&
        card.dataset.category !== button.dataset.filter;
    });

  });
});


// Current year
document.querySelector('#year').textContent = new Date().getFullYear();
