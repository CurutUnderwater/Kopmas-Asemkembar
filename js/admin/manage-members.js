/* ============================================
   Admin — Manage Members (Struktur Organisasi)
   ============================================ */
function renderManageMembers() {
  const members = DataStore.getMembers().sort((a, b) => (a.order || 99) - (b.order || 99));

  return `
    <div class="table-controls">
      <div>
        <h4 style="margin-bottom: 4px;">Struktur Organisasi (${members.length})</h4>
        <p class="text-light" style="font-size: var(--fs-sm);">Kelola anggota tim inti KOPMAS</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openMemberModal()">+ Tambah Anggota</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Urutan</th>
            <th>Foto</th>
            <th>Nama</th>
            <th>Jabatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${members.length === 0 ? `
            <tr><td colspan="5" class="text-center text-light" style="padding: 40px;">Belum ada anggota. Klik "Tambah Anggota" untuk memulai.</td></tr>
          ` : members.map(m => `
            <tr>
              <td><span class="badge badge-secondary">${m.order || '-'}</span></td>
              <td>
                ${m.image 
                  ? `<img src="${m.image}" alt="${m.name}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` 
                  : `<div style="width:40px; height:40px; border-radius:50%; background:var(--color-primary-light); display:flex; align-items:center; justify-content:center; font-size:1.2rem;">👤</div>`
                }
              </td>
              <td><span class="font-semibold">${m.name}</span></td>
              <td>${m.role}</td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editMember('${m.id}')" title="Edit">✏️</button>
                  <button class="btn btn-ghost btn-sm" onclick="deleteMemberConfirm('${m.id}')" title="Hapus">🗑️</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Member Modal -->
    <div class="modal-overlay" id="member-modal">
      <div class="modal" style="max-width: 500px;">
        <div class="modal-header">
          <h4 id="member-modal-title">Tambah Anggota</h4>
          <button class="modal-close" onclick="closeMemberModal()">×</button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="member-edit-id">
          <div class="form-group">
            <label>Nama Lengkap *</label>
            <input type="text" id="member-name" class="form-control" placeholder="Contoh: Pak Suryo">
          </div>
          <div class="form-group">
            <label>Jabatan *</label>
            <input type="text" id="member-role" class="form-control" placeholder="Contoh: Ketua">
          </div>
          <div class="form-group">
            <label>Urutan Tampil</label>
            <input type="number" id="member-order" class="form-control" placeholder="1" min="1">
          </div>
          <div class="form-group">
            <label>Foto Anggota</label>
            <input type="file" id="member-image-input" accept="image/*" class="form-control" onchange="previewMemberImage(event)">
            <div id="member-image-preview" style="margin-top: 10px; display: none;">
              <img id="member-image-preview-img" src="" alt="Preview" style="width:80px; height:80px; border-radius:50%; object-fit:cover; border:2px solid var(--color-border);">
            </div>
            <input type="hidden" id="member-image-base64">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" onclick="closeMemberModal()">Batal</button>
          <button class="btn btn-primary btn-sm" onclick="saveMember()">Simpan</button>
        </div>
      </div>
    </div>
  `;
}

function openMemberModal(id) {
  document.getElementById('member-edit-id').value = '';
  document.getElementById('member-name').value = '';
  document.getElementById('member-role').value = '';
  document.getElementById('member-order').value = '';
  document.getElementById('member-image-base64').value = '';
  document.getElementById('member-image-input').value = '';
  document.getElementById('member-image-preview').style.display = 'none';
  document.getElementById('member-modal-title').textContent = 'Tambah Anggota';
  document.getElementById('member-modal').classList.add('active');
}

function closeMemberModal() {
  document.getElementById('member-modal').classList.remove('active');
}

function editMember(id) {
  const member = DataStore.getMembers().find(m => m.id === id);
  if (!member) return;

  document.getElementById('member-edit-id').value = member.id;
  document.getElementById('member-name').value = member.name;
  document.getElementById('member-role').value = member.role;
  document.getElementById('member-order').value = member.order || '';
  document.getElementById('member-image-base64').value = member.image || '';
  document.getElementById('member-modal-title').textContent = 'Edit Anggota';

  if (member.image) {
    document.getElementById('member-image-preview').style.display = 'block';
    document.getElementById('member-image-preview-img').src = member.image;
  } else {
    document.getElementById('member-image-preview').style.display = 'none';
  }

  document.getElementById('member-modal').classList.add('active');
}

function previewMemberImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('member-image-base64').value = e.target.result;
    document.getElementById('member-image-preview').style.display = 'block';
    document.getElementById('member-image-preview-img').src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function saveMember() {
  const id = document.getElementById('member-edit-id').value;
  const name = document.getElementById('member-name').value.trim();
  const role = document.getElementById('member-role').value.trim();
  const order = parseInt(document.getElementById('member-order').value) || 99;
  const image = document.getElementById('member-image-base64').value;

  if (!name || !role) {
    showToast('Nama dan jabatan wajib diisi', 'error');
    return;
  }

  if (id) {
    // Update existing
    DataStore.updateMember(id, { name, role, order, image });
    showToast('Data anggota berhasil diperbarui', 'success');
  } else {
    // Add new
    DataStore.addMember({ name, role, order, image });
    showToast('Anggota baru berhasil ditambahkan', 'success');
  }

  closeMemberModal();
  navigateTo('#/admin/anggota');
}

function deleteMemberConfirm(id) {
  if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
    DataStore.deleteMember(id);
    showToast('Anggota berhasil dihapus', 'success');
    navigateTo('#/admin/anggota');
  }
}
