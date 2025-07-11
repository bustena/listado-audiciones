const urls = {
  H1tr1: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=0&single=true&output=csv',
  H1tr2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=355259796&single=true&output=csv',
  H1tr3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=923004067&single=true&output=csv',
  H2tr1: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=991944699&single=true&output=csv',
  H2tr2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=1251501192&single=true&output=csv',
  H2tr3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTb2p1IwuAK7jqnep9w4K5Vnmi-66ugFXv8JYTWRuDEIWDv7hGGlj7qk6SyU7ulW9DklaZ4-vIuehou/pub?gid=1487547326&single=true&output=csv',
};

function loadCSV(sheetName) {
  const url = urls[sheetName];
  Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data.slice(0, 15);
      displayTable(data);
    }
  });
}

function displayTable(data) {
  const container = document.getElementById('output');
  if (!data.length) {
    container.innerHTML = '<p>No hay datos.</p>';
    return;
  }

  let html = `<table><thead><tr>
    <th>Audición</th>
    <th>Audio</th>
    <th>Más info</th>
  </tr></thead><tbody>`;

  data.forEach(row => {
    html += `<tr>
      <td>${row.Autor}: ${row.Obra}</td>
      <td><audio controls src="${row.URL_audio}"></audio></td>
      <td><button onclick="window.open('${row.E_url}', '_blank')">Ver entrada</button></td>
    </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}
