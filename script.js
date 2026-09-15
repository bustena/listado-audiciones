const urls = {
  H1tr1: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=0&single=true&output=csv',
  H1tr2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=355259796&single=true&output=csv',
  H1tr3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=923004067&single=true&output=csv',
  H2tr1: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=991944699&single=true&output=csv',
  H2tr2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=1251501192&single=true&output=csv',
  H2tr3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=1487547326&single=true&output=csv',
};

/* =========================================
   AJUSTE AUTOMÁTICO DE ALTURA DEL IFRAME
   ========================================= */

let ultimoAlto = 0;

function enviarAltura() {
  requestAnimationFrame(() => {
    const altura = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    ) + 20;

    if (altura !== ultimoAlto) {
      ultimoAlto = altura;

      window.parent.postMessage({
        type: 'hm-app-height',
        height: altura
      }, '*');
    }
  });
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  enviarAltura();
});

function setButtonsDisabled(state) {
  document.querySelectorAll('.botonera button').forEach(btn => {
    btn.disabled = state;
  });
}

function loadCSV(sheetName) {
  // Mostrar mensaje y desactivar botones
  document.getElementById('cargando').style.display = 'block';
  setButtonsDisabled(true);

  const url = urls[sheetName];
  Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data.slice(0, 15);
      displayTable(data);
      // Ocultar mensaje y reactivar botones
      document.getElementById('cargando').style.display = 'none';
      setButtonsDisabled(false);
    },
    error: function(err) {
      alert('Error al cargar los datos');
      document.getElementById('cargando').style.display = 'none';
      setButtonsDisabled(false);
    }
  });
}

function displayTable(data) {
  const container = document.getElementById('audiciones');
  container.innerHTML = '';

  data.forEach(row => {
    const bloque = document.createElement('div');
    bloque.className = 'audicion';

bloque.innerHTML = `
  <div class="cabecera">
    <div class="texto">${row.Autor}: ${row.Obra}</div>
  </div>

  <div class="contenido">
    <audio
      controls
      controlslist="nodownload noplaybackrate"
      src="${row.URL_audio}">
    </audio>

<div class="acciones">
  <button
    type="button"
    class="boton-accion"
    onclick="descargarAudio('${row.URL_audio}', this)">
    ⬇ Descargar audio
  </button>

  <button
    type="button"
    class="boton-accion"
    onclick="window.open('${row.E_url}', '_blank')">
    🔗 Ver entrada
  </button>
</div>
  </div>
`;

    container.appendChild(bloque);

    const audio = bloque.querySelector('audio');

    audio.addEventListener('play', () => {
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) a.pause();
      });
    });
  });

  // Recalcular únicamente después de construir las fichas.
  enviarAltura();
  setTimeout(enviarAltura, 100);
  setTimeout(enviarAltura, 500);
}

async function descargarAudio(url, boton) {
  const textoOriginal = boton.textContent;

  try {
    boton.disabled = true;
    boton.textContent = '⬇ Descargando...';

    const urlSegura = url.replace(/^http:\/\//i, 'https://');
    const response = await fetch(urlSegura);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.href = blobUrl;
    enlace.download = urlSegura.split('/').pop() || 'audicion.mp3';

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);

  } catch (error) {
    console.error('Error al descargar el audio:', error);
    alert('No se ha podido descargar el audio.');
  } finally {
    boton.disabled = false;
    boton.textContent = textoOriginal;
  }
}
