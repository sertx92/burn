// Non usiamo connect wallet: solo il flusso video + testi, 
// e nel secondo blocco c'è l'indirizzo su una riga, e il tasto COPY su quella successiva.

let hasTypedFirstText = false;

/**
 * PRIMO BLOCCO DI TESTO
 */
const firstLines = [
  {
    align: 'center',
    segments: [{ text: 'BURN MECHANICS', color: '#fff' }]
  },
  {
    align: 'left',
    segments: [
      { text: 'BURN ', color: '#fff' },
      { text: '3x', color: '#ffc700' },
      { text: ' COMMON KINGDOM ', color: '#ffc700' },
      { text: 'PUPPETS', color: '#ffc700' },
      { text: ' OR', color: '#fff' }
    ]
  },
  {
    align: 'left',
    segments: [
      { text: 'BURN ', color: '#fff' },
      { text: '1x', color: '#ffc700' },
      { text: ' RARE KINGDOM ', color: '#ffc700' },
      { text: 'PUPPETS', color: '#ffc700' },
      { text: ' WITH RED BACKGROUND OR SORCERER', color: '#fff' }
    ]
  },
  {
    align: 'left',
    segments: [
      { text: 'TO GET A ', color: '#fff' },
      { text: 'FREE AIRDROP', color: '#ffc700' },
      { text: ' OF 1X ACT II ALCHEMY ORDINALS', color: '#fff' }
    ]
  }
];

/**
 * SECONDO BLOCCO DI TESTO
 * - Riga per l'indirizzo
 * - Riga successiva (vuota, ma segnalata con "copyBtn: true") per inserire il pulsante COPY
 */
const secondLines = [
  {
    align: 'center',
    segments: [
      { text: 'BURN YOUR PUPPETS BY SENDING THEM TO THIS ADDRESS:', color: '#fff' }
    ]
  },
  {
    align: 'center',
    segments: [
      { text: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', color: '#ffc700' }
    ]
  },
  {
    align: 'center',
    copyBtn: true,
    segments: [
      // Niente testo digitato, è solo un "placeholder"
      { text: '', color: '#fff' }
    ]
  },
  {
    align: 'center',
    segments: [
      { text: '', color: '#fff' }
    ]
  },
  {
    align: 'center',
    segments: [
      { text: "YOU'LL RECEIVE THE AIRDROP TO THE SENDING WALLET", color: '#fff' }
    ]
  },
  // riga vuota
  {
    align: 'center',
    segments: [
      { text: '', color: '#fff' }
    ]
  },
  {
    align: 'center',
    segments: [
      { text: 'REMEMBER', color: '#ffc700' }
    ]
  },
  {
    align: 'center',
    segments: [
      { text: "DON'T BURN ANY 1/1 OR DRAKO TRAITS", color: '#fff' }
    ]
  }
];

// Selettori dal DOM
const startBtn = document.getElementById('startBtn');
const startBackground = document.getElementById('startBackground');
const burnVideoEl = document.getElementById('burnVideo');
const burnImageEl = document.getElementById('burnImage');
const instructionsEl = document.getElementById('instructions');

// Al click sul pulsante, parte il flusso del video
startBtn.addEventListener('click', startVideoFlow);

function startVideoFlow() {
  // Nascondo il bottone e l'immagine di sfondo
  startBtn.classList.add('hidden');
  startBackground.classList.add('hidden');
  // Mostro il video
  burnVideoEl.classList.remove('hidden');

  // Quando il video finisce, chiamo onVideoEnded (solo la prima volta)
  burnVideoEl.addEventListener('ended', onVideoEnded, { once: true });
}

function onVideoEnded() {
  // Nascondo il video e mostro l’immagine di burn (sullo sfondo)
  burnVideoEl.classList.add('hidden');
  burnImageEl.classList.remove('hidden');

  // Mostro il primo blocco di testo con effetto typewriter
  if (!hasTypedFirstText) {
    showInstructionsTypewriter(firstLines, () => {
      createBurnButton();
    });
    hasTypedFirstText = true;
  }
}

/**
 * Esegue l'effetto “typewriter” su un array di righe (lines).
 * Ogni riga può avere più segmenti di testo con colore diverso.
 * Al termine di tutte le righe, chiama onComplete().
 */
function showInstructionsTypewriter(lines, onComplete) {
  // Reset del contenitore
  instructionsEl.innerHTML = '';
  instructionsEl.style.transform = 'translate(-50%, 0)';
  instructionsEl.classList.remove('hidden');

  let currentLineIndex = 0;
  const lineHeight = 60; // distanza verticale tra righe

  function nextLine() {
    if (currentLineIndex >= lines.length) {
      // Fine di tutte le righe
      if (onComplete) onComplete();
      return;
    }

    const line = lines[currentLineIndex];
    const { segments, align, copyBtn } = line;

    // Crea un <div> per questa riga
    const lineEl = document.createElement('div');
    lineEl.className = 'instructions-line';
    lineEl.style.textAlign = align;
    lineEl.style.top = (currentLineIndex * lineHeight) + 'px';

    instructionsEl.appendChild(lineEl);

    let currentSegmentIndex = 0;

    function nextSegment() {
      if (currentSegmentIndex >= segments.length) {
        // Fine di questa riga
        currentLineIndex++;
        // Se la riga prevede un pulsante COPY
        if (copyBtn) {
          createCopyButton(lineEl);
        }
        setTimeout(nextLine, 300);
        return;
      }

      const seg = segments[currentSegmentIndex];
      let charIndex = 0;
      let currentText = '';

      // Crea uno <span> per digitare il testo
      const spanEl = document.createElement('span');
      spanEl.style.color = seg.color || '#fff';
      lineEl.appendChild(spanEl);

      function typeChar() {
        currentText += seg.text.charAt(charIndex);
        // Aggiunge un cursore fittizio '|'
        spanEl.textContent = currentText + '|';

        charIndex++;
        if (charIndex < seg.text.length) {
          setTimeout(typeChar, 60);
        } else {
          // Rimosso cursore
          spanEl.textContent = currentText;
          currentSegmentIndex++;
          setTimeout(nextSegment, 100);
        }
      }

      typeChar();
    }

    nextSegment();
  }

  nextLine();
}

/**
 * Crea il pulsante "BURN" al termine del primo blocco di testo
 */
function createBurnButton() {
  const burnBtn = document.createElement('button');
  burnBtn.className = 'burn-btn';
  burnBtn.textContent = 'BURN';

  const lineHeight = 60;
  // Calcoliamo la posizione sotto l’ultima riga del primo blocco
  const topPos = (firstLines.length + 1) * lineHeight + 120;
  burnBtn.style.top = topPos + 'px';
  burnBtn.style.left = '50%';
  burnBtn.style.transform = 'translateX(-50%)';

  instructionsEl.appendChild(burnBtn);

  // Quando clicchiamo BURN, scompare il 1° blocco e appare il 2° blocco
  burnBtn.addEventListener('click', () => {
    instructionsEl.style.transform = 'translate(-50%, -200%)';

    setTimeout(() => {
      instructionsEl.innerHTML = '';
      instructionsEl.style.transform = 'translate(-50%, 0)';
      // Avviamo il secondo blocco
      showInstructionsTypewriter(secondLines);
    }, 800);
  });
}

/**
 * Crea il pulsante COPY (in una riga a parte, sotto l'indirizzo)
 */
function createCopyButton(lineEl) {
  // Creiamo un pulsante e una label
  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = 'COPY';

  const copyLbl = document.createElement('span');
  copyLbl.className = 'copy-label';
  copyLbl.textContent = 'COPY ADDRESS';

  // Appendiamoli sulla stessa riga
  lineEl.appendChild(copyBtn);
  lineEl.appendChild(copyLbl);

  // Funzionalità di copia
  copyBtn.addEventListener('click', () => {
    navigator.clipboard
      .writeText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
      .then(() => {
        alert('Address copied to clipboard!');
      })
      .catch((err) => {
        alert('Error copying address: ' + err);
      });
  });
}