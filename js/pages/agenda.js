/* ============================================
   Agenda Page
   ============================================ */
function renderAgenda() {
  const agenda = DataStore.getAgenda().sort((a, b) => new Date(b.date) - new Date(a.date));
  const upcoming = agenda.filter(a => a.status === 'akan_datang');
  const completed = agenda.filter(a => a.status === 'selesai');
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  function renderCards(items) {
    if (items.length === 0) return '<div class="empty-state"><div class="empty-icon">📅</div><h3>Belum ada agenda</h3></div>';
    return items.map(a => {
      const d = new Date(a.date);
      const catColors = { penanaman: 'badge-success', panen: 'badge-accent', workshop: 'badge-info' };
      const catLabels = { penanaman: 'Penanaman', panen: 'Panen', workshop: 'Workshop' };
      return `
        <div class="card agenda-card">
          <div class="agenda-date-box">
            <div class="day">${d.getDate()}</div>
            <div class="month">${months[d.getMonth()]}</div>
          </div>
          <div class="agenda-info">
            <div class="flex items-center gap-sm mb-sm">
              <span class="badge ${catColors[a.category] || 'badge-secondary'}">${catLabels[a.category] || a.category}</span>
              ${a.status === 'selesai' ? '<span class="badge badge-primary">✓ Selesai</span>' : ''}
            </div>
            <h4>${a.title}</h4>
            <p>${a.description}</p>
            <div class="agenda-meta">
              <span>📍 ${a.location}</span>
              <span>🕐 ${a.time} WIB</span>
              <span>📅 ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  return `
    <div class="page-header">
      <div class="container">
        <h1>Agenda Kegiatan</h1>
        <p>Jadwal kegiatan KOPMAS Asem Kembar</p>
        <div class="breadcrumb">
          <a href="#/">Beranda</a> <span>/</span> <span>Agenda</span>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="tabs">
          <button class="tab-btn active" onclick="switchAgendaTab('upcoming', this)">📅 Akan Datang (${upcoming.length})</button>
          <button class="tab-btn" onclick="switchAgendaTab('completed', this)">✅ Selesai (${completed.length})</button>
        </div>
        <div id="agenda-upcoming" class="tab-content active">
          <div class="stagger" style="display:flex; flex-direction:column; gap: var(--space-md);">
            ${renderCards(upcoming)}
          </div>
        </div>
        <div id="agenda-completed" class="tab-content">
          <div class="stagger" style="display:flex; flex-direction:column; gap: var(--space-md);">
            ${renderCards(completed)}
          </div>
        </div>
      </div>
    </section>
  `;
}

function switchAgendaTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('agenda-' + tab).classList.add('active');
}
