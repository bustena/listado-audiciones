const urls = {
  H1tr1: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=0&single=true&output=csv',
  H1tr2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=355259796&single=true&output=csv',
  H1tr3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=923004067&single=true&output=csv',
  H2tr1: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=991944699&single=true&output=csv',
  H2tr2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=1251501192&single=true&output=csv',
  H2tr3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=1487547326&single=true&output=csv',
};

function setButtonsDisabled(state) {
  document.querySelectorAll('.buttons button').forEach(btn => {
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
  container.innerHTML = ''; // limpiar

  data.forEach(row => {
    const bloque = document.createElement('div');
    bloque.className = 'audicion';
    bloque.innerHTML = `
      <div class="texto">${row.Autor}: ${row.Obra}</div>
      <audio controls src="${row.URL_audio}"></audio>
      <button onclick="window.open('${row.E_url}', '_blank')">Ver entrada</button>
    `;
    container.appendChild(bloque);

    const audio = bloque.querySelector('audio');
    audio.addEventListener('play', () => {
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) a.pause();
      });
    });
  });
}
