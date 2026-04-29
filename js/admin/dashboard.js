/* ============================================
   Admin Dashboard Overview
   ============================================ */
function renderAdminDashboard() {
  const orders = DataStore.getOrders();
  const products = DataStore.getProducts();
  const finance = DataStore.getFinanceSummary();
  const pendingOrders = orders.filter(o => o.status === 'menunggu').length;
  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const totalStock = products.reduce((s, p) => s + p.stock, 0);

  return `
    <div class="dashboard-stats stagger">
      <div class="stat-card">
        <div class="stat-icon green">📦</div>
        <div class="stat-info">
          <h4>${orders.length}</h4>
          <p>Total Pesanan</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">⏳</div>
        <div class="stat-info">
          <h4>${pendingOrders}</h4>
          <p>Menunggu Diproses</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">💰</div>
        <div class="stat-info">
          <h4>Rp ${(finance.income / 1000000).toFixed(1)}jt</h4>
          <p>Total Pemasukan</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">🌿</div>
        <div class="stat-info">
          <h4>${totalStock}</h4>
          <p>Total Stok</p>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="dashboard-charts">
      <div class="chart-card">
        <div class="chart-card-header">
          <h4>Ringkasan Keuangan</h4>
          <span class="badge badge-secondary">Bulan Ini</span>
        </div>
        <div class="chart-container">
          <canvas id="finance-chart"></canvas>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header">
          <h4>Status Pesanan</h4>
        </div>
        <div class="chart-container">
          <canvas id="orders-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="recent-section">
      <div class="section-top">
        <h4>Pesanan Terbaru</h4>
        <a href="#/admin/pesanan" class="btn btn-ghost btn-sm">Lihat Semua →</a>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pelanggan</th>
              <th>Total</th>
              <th>Pembayaran</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            ${orders.slice(-5).reverse().map(o => `
              <tr>
                <td><span class="font-semibold">${o.id}</span></td>
                <td>${o.customer.name}</td>
                <td>Rp ${o.total.toLocaleString('id-ID')}</td>
                <td><span class="badge ${o.payment === 'qris' ? 'badge-info' : 'badge-accent'}">${o.payment === 'qris' ? 'QRIS' : 'COD'}</span></td>
                <td>${getStatusBadge(o.status)}</td>
                <td>${formatDate(o.createdAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function initDashboardCharts() {
  const financeData = DataStore.getFinance();
  const orders = DataStore.getOrders();

  // Finance chart
  const ctx1 = document.getElementById('finance-chart');
  if (ctx1 && typeof Chart !== 'undefined') {
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun'];
    const incomeByMonth = months.map((m, i) => {
      return financeData.filter(f => f.type === 'pemasukan' && new Date(f.date).getMonth() <= i + 1).reduce((s, f) => s + f.amount, 0) / (i+1);
    });
    const expenseByMonth = months.map((m, i) => {
      return financeData.filter(f => f.type === 'pengeluaran' && new Date(f.date).getMonth() <= i + 1).reduce((s, f) => s + f.amount, 0) / (i+1);
    });

    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Pemasukan',
            data: [1200000, 1800000, 2500000, 3200000, 0, 0],
            backgroundColor: 'rgba(82, 183, 136, 0.7)',
            borderRadius: 6
          },
          {
            label: 'Pengeluaran',
            data: [400000, 550000, 700000, 450000, 0, 0],
            backgroundColor: 'rgba(244, 162, 97, 0.7)',
            borderRadius: 6
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
              callback: v => 'Rp ' + (v / 1000) + 'rb'
            }
          }
        }
      }
    });
  }

  // Orders chart
  const ctx2 = document.getElementById('orders-chart');
  if (ctx2 && typeof Chart !== 'undefined') {
    const statusCounts = {
      menunggu: orders.filter(o => o.status === 'menunggu').length,
      diproses: orders.filter(o => o.status === 'diproses').length,
      selesai: orders.filter(o => o.status === 'selesai').length,
      dibatalkan: orders.filter(o => o.status === 'dibatalkan').length
    };

    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Menunggu', 'Diproses', 'Selesai', 'Dibatalkan'],
        datasets: [{
          data: [statusCounts.menunggu, statusCounts.diproses, statusCounts.selesai, statusCounts.dibatalkan],
          backgroundColor: [
            'rgba(244, 162, 97, 0.8)',
            'rgba(58, 134, 255, 0.8)',
            'rgba(82, 183, 136, 0.8)',
            'rgba(231, 111, 81, 0.8)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        cutout: '65%'
      }
    });
  }
}
