/* ============================================
   Admin — Manage Orders
   ============================================ */
function renderManageOrders() {
  const orders = DataStore.getOrders().slice().reverse();
  const filterStatus = window._orderFilter || 'all';

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return `
    <div class="table-controls">
      <div>
        <h4 style="margin-bottom: 4px;">Daftar Pesanan (${orders.length})</h4>
        <p class="text-light" style="font-size: var(--fs-sm);">Kelola pesanan masuk</p>
      </div>
      <div class="table-filters">
        <select onchange="filterOrders(this.value)" id="order-filter-select">
          <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>Semua Status</option>
          <option value="menunggu" ${filterStatus === 'menunggu' ? 'selected' : ''}>Menunggu</option>
          <option value="diproses" ${filterStatus === 'diproses' ? 'selected' : ''}>Diproses</option>
          <option value="selesai" ${filterStatus === 'selesai' ? 'selected' : ''}>Selesai</option>
          <option value="dibatalkan" ${filterStatus === 'dibatalkan' ? 'selected' : ''}>Dibatalkan</option>
        </select>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID Pesanan</th>
            <th>Pelanggan</th>
            <th>Item</th>
            <th>Total</th>
            <th>Pembayaran</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? `
            <tr><td colspan="8" class="text-center text-light" style="padding: var(--space-2xl);">Tidak ada pesanan</td></tr>
          ` : filtered.map(o => `
            <tr>
              <td><span class="font-semibold">${o.id}</span></td>
              <td>
                <div>
                  <span class="font-semibold">${o.customer.name}</span>
                  <br><span class="text-light" style="font-size:var(--fs-xs);">${o.customer.phone}</span>
                </div>
              </td>
              <td>${o.items.length} item</td>
              <td class="font-semibold">Rp ${o.total.toLocaleString('id-ID')}</td>
              <td><span class="badge ${o.payment === 'qris' ? 'badge-info' : 'badge-accent'}">${o.payment === 'qris' ? 'QRIS' : 'COD'}</span></td>
              <td>${getStatusBadge(o.status)}</td>
              <td style="white-space:nowrap;">${formatDate(o.createdAt)}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-secondary btn-sm" onclick="viewOrderDetail('${o.id}')">👁️</button>
                  ${o.status !== 'selesai' && o.status !== 'dibatalkan' ? `
                    <select onchange="updateOrderStatusAdmin('${o.id}', this.value)" style="width:auto; padding: 0.25rem 0.5rem; font-size: var(--fs-xs);">
                      <option value="">Ubah</option>
                      ${o.status === 'menunggu' ? '<option value="diproses">Proses</option>' : ''}
                      ${o.status !== 'selesai' ? '<option value="selesai">Selesai</option>' : ''}
                      <option value="dibatalkan">Batalkan</option>
                    </select>
                  ` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Order Detail Modal -->
    <div class="modal-backdrop" id="order-detail-modal">
      <div class="modal" style="max-width: 600px;">
        <div class="modal-header">
          <h3>Detail Pesanan</h3>
          <button class="modal-close" onclick="closeOrderDetail()">✕</button>
        </div>
        <div id="order-detail-content"></div>
      </div>
    </div>
  `;
}

function filterOrders(status) {
  window._orderFilter = status;
  navigateTo('#/admin/pesanan');
}

function updateOrderStatusAdmin(id, status) {
  if (!status) return;
  
  const order = DataStore.getOrders().find(o => o.id === id);
  const oldStatus = order ? order.status : null;

  DataStore.updateOrderStatus(id, status);

  // If order is completed and it's COD, record the income.
  if (status === 'selesai' && oldStatus !== 'selesai' && order && order.payment === 'cod') {
    DataStore.addFinance({
      orderId: order.id,
      type: 'pemasukan',
      category: 'Penjualan Online (COD)',
      description: `Pesanan ${order.id} — ${order.customer.name}`,
      amount: order.total,
      date: new Date().toISOString().split('T')[0]
    });
  }

  // If order is cancelled, delete associated finance records
  if (status === 'dibatalkan' && oldStatus !== 'dibatalkan' && order) {
    DataStore.deleteFinanceByOrderId(order.id);
  }

  showToast(`Status pesanan ${id} diubah ke "${status}"`, 'success');
  navigateTo('#/admin/pesanan');
}

function viewOrderDetail(id) {
  const order = DataStore.getOrders().find(o => o.id === id);
  if (!order) return;

  const products = DataStore.getProducts();
  const content = document.getElementById('order-detail-content');
  content.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: var(--space-md);">
      <div class="cart-summary-row"><span class="font-semibold">No. Pesanan</span><span class="badge badge-primary">${order.id}</span></div>
      <div class="cart-summary-row"><span class="font-semibold">Tanggal</span><span>${formatDate(order.createdAt)}</span></div>
      <div class="cart-summary-row"><span class="font-semibold">Status</span>${getStatusBadge(order.status)}</div>
      <div class="cart-summary-row"><span class="font-semibold">Pembayaran</span><span class="badge ${order.payment === 'qris' ? 'badge-info' : 'badge-accent'}">${order.payment === 'qris' ? 'QRIS' : 'COD'}</span></div>
      
      <hr style="border: none; border-top: 1px solid var(--color-border-light);">
      
      <h5>Data Pemesan</h5>
      <div class="cart-summary-row"><span>Nama</span><span>${order.customer.name}</span></div>
      <div class="cart-summary-row"><span>Telepon</span><span>${order.customer.phone}</span></div>
      <div class="cart-summary-row"><span>Alamat</span><span style="max-width:250px; text-align:right;">${order.customer.address}</span></div>
      ${order.customer.notes ? `<div class="cart-summary-row"><span>Catatan</span><span>${order.customer.notes}</span></div>` : ''}
      
      <hr style="border: none; border-top: 1px solid var(--color-border-light);">
      
      <h5>Item Pesanan</h5>
      ${order.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `
          <div class="cart-summary-row">
            <span>${product ? product.name : item.productId} × ${item.qty}</span>
            <span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
          </div>
        `;
      }).join('')}
      
      <div class="cart-summary-row total">
        <span>Total</span>
        <span>Rp ${order.total.toLocaleString('id-ID')}</span>
      </div>
      
      ${order.paymentProof ? `
        <hr style="border: none; border-top: 1px solid var(--color-border-light);">
        <h5>Bukti Transfer</h5>
        <div style="text-align:center; margin-top: var(--space-sm);">
          <img src="${order.paymentProof}" alt="Bukti Transfer" style="max-width: 100%; max-height: 400px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById('order-detail-modal').classList.add('active');
}

function closeOrderDetail() {
  document.getElementById('order-detail-modal').classList.remove('active');
}
