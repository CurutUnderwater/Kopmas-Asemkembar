/* ============================================
   Admin — Finance (Laporan Keuangan)
   ============================================ */
function renderFinance() {
  const finance = DataStore.getFinance();
  const summary = DataStore.getFinanceSummary();
  const filterType = window._financeFilter || 'all';
  const filtered = filterType === 'all' ? finance : finance.filter(f => f.type === filterType);
  const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  return `
    <!-- Summary Cards -->
    <div class="finance-summary stagger">
      <div class="finance-card income">
        <div class="finance-label">💰 Total Pemasukan</div>
        <div class="finance-amount">Rp ${summary.income.toLocaleString('id-ID')}</div>
      </div>
      <div class="finance-card expense">
        <div class="finance-label">💸 Total Pengeluaran</div>
        <div class="finance-amount">Rp ${summary.expense.toLocaleString('id-ID')}</div>
      </div>
      <div class="finance-card extra">
        <div class="finance-label">🎁 Dana Tambahan</div>
        <div class="finance-amount">Rp ${summary.extra.toLocaleString('id-ID')}</div>
      </div>
    </div>

    <!-- Balance -->
    <div class="card" style="padding: var(--space-xl); margin-bottom: var(--space-xl); text-align: center; background: linear-gradient(135deg, rgba(82,183,136,0.05), rgba(45,106,79,0.08));">
      <p class="text-light" style="font-size: var(--fs-sm);">Saldo Bersih (Pemasukan + Dana Tambahan - Pengeluaran)</p>
      <h2 style="color: ${summary.balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}; margin-top: var(--space-sm);">
        Rp ${summary.balance.toLocaleString('id-ID')}
      </h2>
    </div>

    <!-- Chart -->
    <div class="chart-card mb-xl">
      <div class="chart-card-header">
        <h4>Grafik Keuangan</h4>
      </div>
      <div class="chart-container">
        <canvas id="finance-detail-chart"></canvas>
      </div>
    </div>

    <!-- Transaction List -->
    <div class="table-controls">
      <div>
        <h4 style="margin-bottom: 4px;">Riwayat Transaksi (${filtered.length})</h4>
      </div>
      <div class="flex gap-sm" style="flex-wrap: wrap;">
        <select onchange="filterFinance(this.value)">
          <option value="all" ${filterType === 'all' ? 'selected' : ''}>Semua Jenis</option>
          <option value="pemasukan" ${filterType === 'pemasukan' ? 'selected' : ''}>Pemasukan</option>
          <option value="pengeluaran" ${filterType === 'pengeluaran' ? 'selected' : ''}>Pengeluaran</option>
          <option value="dana_tambahan" ${filterType === 'dana_tambahan' ? 'selected' : ''}>Dana Tambahan</option>
        </select>
        <button class="btn btn-primary" onclick="openFinanceModal()">+ Tambah Transaksi</button>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Jenis</th>
            <th>Kategori</th>
            <th>Deskripsi</th>
            <th>Jumlah</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.length === 0 ? `
            <tr><td colspan="6" class="text-center text-light" style="padding: var(--space-2xl);">Tidak ada transaksi</td></tr>
          ` : sorted.map(f => {
            const typeLabels = { pemasukan: 'Pemasukan', pengeluaran: 'Pengeluaran', dana_tambahan: 'Dana Tambahan' };
            const typeBadges = { pemasukan: 'badge-success', pengeluaran: 'badge-danger', dana_tambahan: 'badge-info' };
            const typePrefix = { pemasukan: '+', pengeluaran: '-', dana_tambahan: '+' };
            const typeColor = { pemasukan: 'var(--color-success)', pengeluaran: 'var(--color-danger)', dana_tambahan: 'var(--color-info)' };
            return `
              <tr>
                <td style="white-space:nowrap;">${formatDate(f.date)}</td>
                <td><span class="badge ${typeBadges[f.type]}">${typeLabels[f.type]}</span></td>
                <td>${f.category}</td>
                <td>${f.description}</td>
                <td style="font-weight:700; color: ${typeColor[f.type]}; white-space:nowrap;">${typePrefix[f.type]} Rp ${f.amount.toLocaleString('id-ID')}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-secondary btn-sm" onclick="openFinanceModal('${f.id}')">✏️</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFinanceConfirm('${f.id}')">🗑️</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Finance Modal -->
    <div class="modal-backdrop" id="finance-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 id="finance-modal-title">Tambah Transaksi</h3>
          <button class="modal-close" onclick="closeFinanceModal()">✕</button>
        </div>
        <form onsubmit="saveFinance(event)">
          <input type="hidden" id="finance-edit-id">
          <div class="form-group">
            <label for="finance-type">Jenis Transaksi *</label>
            <select id="finance-type" required>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
              <option value="dana_tambahan">Dana Tambahan</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="finance-category">Kategori *</label>
              <input type="text" id="finance-category" required placeholder="Contoh: Penjualan, Benih, dll">
            </div>
            <div class="form-group">
              <label for="finance-amount">Jumlah (Rp) *</label>
              <input type="number" id="finance-amount" required min="0" placeholder="0">
            </div>
          </div>
          <div class="form-group">
            <label for="finance-desc">Deskripsi *</label>
            <textarea id="finance-desc" rows="2" required placeholder="Keterangan transaksi"></textarea>
          </div>
          <div class="form-group">
            <label for="finance-date">Tanggal *</label>
            <input type="date" id="finance-date" required>
          </div>
          <div class="flex gap-md mt-lg">
            <button type="button" class="btn btn-ghost" onclick="closeFinanceModal()" style="flex:1;">Batal</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function filterFinance(type) {
  window._financeFilter = type;
  navigateTo('#/admin/keuangan');
}

function openFinanceModal(id) {
  const modal = document.getElementById('finance-modal');
  const title = document.getElementById('finance-modal-title');
  const editId = document.getElementById('finance-edit-id');

  if (id) {
    const item = DataStore.getFinance().find(f => f.id === id);
    if (!item) return;
    title.textContent = 'Edit Transaksi';
    editId.value = id;
    document.getElementById('finance-type').value = item.type;
    document.getElementById('finance-category').value = item.category;
    document.getElementById('finance-amount').value = item.amount;
    document.getElementById('finance-desc').value = item.description;
    document.getElementById('finance-date').value = item.date;
  } else {
    title.textContent = 'Tambah Transaksi';
    editId.value = '';
    document.getElementById('finance-type').value = 'pemasukan';
    document.getElementById('finance-category').value = '';
    document.getElementById('finance-amount').value = '';
    document.getElementById('finance-desc').value = '';
    document.getElementById('finance-date').value = new Date().toISOString().split('T')[0];
  }

  modal.classList.add('active');
}

function closeFinanceModal() {
  document.getElementById('finance-modal').classList.remove('active');
}

function saveFinance(e) {
  e.preventDefault();
  const id = document.getElementById('finance-edit-id').value;
  const data = {
    type: document.getElementById('finance-type').value,
    category: document.getElementById('finance-category').value,
    amount: parseInt(document.getElementById('finance-amount').value),
    description: document.getElementById('finance-desc').value,
    date: document.getElementById('finance-date').value
  };

  if (id) {
    DataStore.updateFinance(id, data);
    showToast('Transaksi berhasil diperbarui!', 'success');
  } else {
    DataStore.addFinance(data);
    showToast('Transaksi berhasil ditambahkan!', 'success');
  }

  closeFinanceModal();
  navigateTo('#/admin/keuangan');
}

function deleteFinanceConfirm(id) {
  if (confirm('Yakin ingin menghapus transaksi ini?')) {
    DataStore.deleteFinance(id);
    showToast('Transaksi berhasil dihapus', 'info');
    navigateTo('#/admin/keuangan');
  }
}

function initFinanceChart() {
  const ctx = document.getElementById('finance-detail-chart');
  if (!ctx || typeof Chart === 'undefined') return;

  const finance = DataStore.getFinance();
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  
  const incomeByMonth = new Array(12).fill(0);
  const expenseByMonth = new Array(12).fill(0);
  const extraByMonth = new Array(12).fill(0);

  finance.forEach(f => {
    const m = new Date(f.date).getMonth();
    if (f.type === 'pemasukan') incomeByMonth[m] += f.amount;
    else if (f.type === 'pengeluaran') expenseByMonth[m] += f.amount;
    else if (f.type === 'dana_tambahan') extraByMonth[m] += f.amount;
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Pemasukan',
          data: incomeByMonth,
          borderColor: '#52B788',
          backgroundColor: 'rgba(82,183,136,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#52B788'
        },
        {
          label: 'Pengeluaran',
          data: expenseByMonth,
          borderColor: '#E76F51',
          backgroundColor: 'rgba(231,111,81,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#E76F51'
        },
        {
          label: 'Dana Tambahan',
          data: extraByMonth,
          borderColor: '#3A86FF',
          backgroundColor: 'rgba(58,134,255,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3A86FF'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => 'Rp ' + (v / 1000000).toFixed(1) + 'jt'
          }
        }
      }
    }
  });
}
