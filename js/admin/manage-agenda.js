/* ============================================
   Admin — Manage Agenda
   ============================================ */
function renderManageAgenda() {
  const agenda = DataStore.getAgenda().sort((a, b) => new Date(b.date) - new Date(a.date));

  return `
    <div class="table-controls">
      <div>
        <h4 style="margin-bottom: 4px;">Agenda Kegiatan (${agenda.length})</h4>
        <p class="text-light" style="font-size: var(--fs-sm);">Kelola jadwal kegiatan KOPMAS</p>
      </div>
      <button class="btn btn-primary" onclick="openAgendaModal()">+ Tambah Agenda</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Judul</th>
            <th>Kategori</th>
            <th>Lokasi</th>
            <th>Waktu</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${agenda.length === 0 ? `
            <tr><td colspan="7" class="text-center text-light" style="padding: var(--space-2xl);">Belum ada agenda</td></tr>
          ` : agenda.map(a => `
            <tr>
              <td style="white-space:nowrap;">${formatDate(a.date)}</td>
              <td><span class="font-semibold">${a.title}</span></td>
              <td><span class="badge ${a.category === 'penanaman' ? 'badge-success' : a.category === 'panen' ? 'badge-accent' : 'badge-info'}">${a.category}</span></td>
              <td>${a.location}</td>
              <td>${a.time} WIB</td>
              <td>${a.status === 'akan_datang' ? '<span class="badge badge-accent">Akan Datang</span>' : '<span class="badge badge-success">Selesai</span>'}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-secondary btn-sm" onclick="openAgendaModal('${a.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteAgendaConfirm('${a.id}')">🗑️</button>
                  ${a.status === 'akan_datang' ? `<button class="btn btn-primary btn-sm" onclick="markAgendaDone('${a.id}')">✓</button>` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Agenda Modal -->
    <div class="modal-backdrop" id="agenda-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 id="agenda-modal-title">Tambah Agenda</h3>
          <button class="modal-close" onclick="closeAgendaModal()">✕</button>
        </div>
        <form onsubmit="saveAgenda(event)">
          <input type="hidden" id="agenda-edit-id">
          <div class="form-group">
            <label for="agenda-title">Judul *</label>
            <input type="text" id="agenda-title" required placeholder="Judul kegiatan">
          </div>
          <div class="form-group">
            <label for="agenda-desc">Deskripsi *</label>
            <textarea id="agenda-desc" rows="3" required placeholder="Deskripsi kegiatan"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="agenda-date">Tanggal *</label>
              <input type="date" id="agenda-date" required>
            </div>
            <div class="form-group">
              <label for="agenda-time">Waktu *</label>
              <input type="time" id="agenda-time" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="agenda-location">Lokasi *</label>
              <input type="text" id="agenda-location" required placeholder="Lokasi kegiatan">
            </div>
            <div class="form-group">
              <label for="agenda-category">Kategori</label>
              <select id="agenda-category">
                <option value="penanaman">Penanaman</option>
                <option value="panen">Panen</option>
                <option value="workshop">Workshop</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="agenda-status">Status</label>
            <select id="agenda-status">
              <option value="akan_datang">Akan Datang</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div class="flex gap-md mt-lg">
            <button type="button" class="btn btn-ghost" onclick="closeAgendaModal()" style="flex:1;">Batal</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function openAgendaModal(id) {
  const modal = document.getElementById('agenda-modal');
  const title = document.getElementById('agenda-modal-title');
  const editId = document.getElementById('agenda-edit-id');

  if (id) {
    const item = DataStore.getAgenda().find(a => a.id === id);
    if (!item) return;
    title.textContent = 'Edit Agenda';
    editId.value = id;
    document.getElementById('agenda-title').value = item.title;
    document.getElementById('agenda-desc').value = item.description;
    document.getElementById('agenda-date').value = item.date;
    document.getElementById('agenda-time').value = item.time;
    document.getElementById('agenda-location').value = item.location;
    document.getElementById('agenda-category').value = item.category;
    document.getElementById('agenda-status').value = item.status;
  } else {
    title.textContent = 'Tambah Agenda';
    editId.value = '';
    document.getElementById('agenda-title').value = '';
    document.getElementById('agenda-desc').value = '';
    document.getElementById('agenda-date').value = '';
    document.getElementById('agenda-time').value = '';
    document.getElementById('agenda-location').value = '';
    document.getElementById('agenda-category').value = 'penanaman';
    document.getElementById('agenda-status').value = 'akan_datang';
  }

  modal.classList.add('active');
}

function closeAgendaModal() {
  document.getElementById('agenda-modal').classList.remove('active');
}

function saveAgenda(e) {
  e.preventDefault();
  const id = document.getElementById('agenda-edit-id').value;
  const data = {
    title: document.getElementById('agenda-title').value,
    description: document.getElementById('agenda-desc').value,
    date: document.getElementById('agenda-date').value,
    time: document.getElementById('agenda-time').value,
    location: document.getElementById('agenda-location').value,
    category: document.getElementById('agenda-category').value,
    status: document.getElementById('agenda-status').value
  };

  if (id) {
    DataStore.updateAgenda(id, data);
    showToast('Agenda berhasil diperbarui!', 'success');
  } else {
    DataStore.addAgenda(data);
    showToast('Agenda baru berhasil ditambahkan!', 'success');
  }

  closeAgendaModal();
  navigateTo('#/admin/agenda');
}

function deleteAgendaConfirm(id) {
  if (confirm('Yakin ingin menghapus agenda ini?')) {
    DataStore.deleteAgenda(id);
    showToast('Agenda berhasil dihapus', 'info');
    navigateTo('#/admin/agenda');
  }
}

function markAgendaDone(id) {
  DataStore.updateAgenda(id, { status: 'selesai' });
  showToast('Agenda ditandai selesai', 'success');
  navigateTo('#/admin/agenda');
}
