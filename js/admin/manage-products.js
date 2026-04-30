/* ============================================
   Admin — Manage Products
   ============================================ */
function renderManageProducts() {
  const products = DataStore.getProducts();

  return `
    <div class="table-controls">
      <div>
        <h4 style="margin-bottom: 4px;">Daftar Produk (${products.length})</h4>
        <p class="text-light" style="font-size: var(--fs-sm);">Kelola semua produk pakcoy</p>
      </div>
      <button class="btn btn-primary" onclick="openProductModal()">+ Tambah Produk</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama Produk</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Unit</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${products.length === 0 ? `
            <tr><td colspan="6" class="text-center text-light" style="padding: var(--space-2xl);">Belum ada produk</td></tr>
          ` : products.map(p => `
            <tr>
              <td><img src="${p.image}" alt="${p.name}" style="width:50px; height:50px; border-radius: var(--radius-sm); object-fit:cover;"></td>
              <td><span class="font-semibold">${p.name}</span></td>
              <td>Rp ${p.price.toLocaleString('id-ID')}</td>
              <td><span class="badge ${p.stock > 20 ? 'badge-success' : p.stock > 0 ? 'badge-accent' : 'badge-danger'}">${p.stock}</span></td>
              <td>${p.unit}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-secondary btn-sm" onclick="openProductModal('${p.id}')">✏️ Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteProductConfirm('${p.id}')">🗑️</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Product Modal -->
    <div class="modal-backdrop" id="product-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 id="product-modal-title">Tambah Produk</h3>
          <button class="modal-close" onclick="closeProductModal()">✕</button>
        </div>
        <form onsubmit="saveProduct(event)">
          <input type="hidden" id="product-edit-id">
          <input type="hidden" id="product-image-base64">
          <div class="form-group" style="text-align:center;">
            <img id="product-image-preview" src="assets/images/pakcoy-product.png" alt="Preview" style="width:100px; height:100px; object-fit:cover; border-radius:var(--radius-sm); margin-bottom:var(--space-sm); border: 1px solid var(--color-border);">
            <br>
            <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
              📷 Upload Gambar
              <input type="file" id="product-image-upload" accept="image/*" style="display:none;" onchange="handleProductImageUpload(event)">
            </label>
          </div>
          <div class="form-group">
            <label for="product-name">Nama Produk *</label>
            <input type="text" id="product-name" required placeholder="Nama produk">
          </div>
          <div class="form-group">
            <label for="product-desc">Deskripsi *</label>
            <textarea id="product-desc" rows="3" required placeholder="Deskripsi produk"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="product-price">Harga (Rp) *</label>
              <input type="number" id="product-price" required min="0" placeholder="0">
            </div>
            <div class="form-group">
              <label for="product-stock">Stok *</label>
              <input type="number" id="product-stock" required min="0" placeholder="0">
            </div>
          </div>
          <div class="form-group">
            <label for="product-unit">Unit</label>
            <select id="product-unit">
              <option value="ikat">Ikat</option>
              <option value="kg">Kilogram</option>
              <option value="paket">Paket</option>
              <option value="pcs">Pcs</option>
            </select>
          </div>
          <div class="form-group">
            <label for="product-benefits">Manfaat</label>
            <input type="text" id="product-benefits" placeholder="Manfaat produk">
          </div>
          <div class="form-group">
            <label for="product-quality">Kualitas</label>
            <input type="text" id="product-quality" placeholder="Keterangan kualitas">
          </div>
          <div class="flex gap-md mt-lg">
            <button type="button" class="btn btn-ghost" onclick="closeProductModal()" style="flex:1;">Batal</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function openProductModal(id) {
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('product-modal-title');
  const editId = document.getElementById('product-edit-id');
  const imagePreview = document.getElementById('product-image-preview');
  const imageBase64 = document.getElementById('product-image-base64');

  if (id) {
    const product = DataStore.getProductById(id);
    if (!product) return;
    title.textContent = 'Edit Produk';
    editId.value = id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-desc').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-unit').value = product.unit;
    document.getElementById('product-benefits').value = product.benefits || '';
    document.getElementById('product-quality').value = product.quality || '';
    
    // Set image
    const imgUrl = product.image || 'assets/images/pakcoy-product.png';
    imagePreview.src = imgUrl;
    imageBase64.value = imgUrl;
  } else {
    title.textContent = 'Tambah Produk';
    editId.value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-desc').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';
    document.getElementById('product-unit').value = 'ikat';
    document.getElementById('product-benefits').value = '';
    document.getElementById('product-quality').value = '';
    
    // Reset image
    imagePreview.src = 'assets/images/pakcoy-product.png';
    imageBase64.value = 'assets/images/pakcoy-product.png';
  }

  // Reset file input
  document.getElementById('product-image-upload').value = '';

  modal.classList.add('active');
}

function handleProductImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    document.getElementById('product-image-preview').src = base64;
    document.getElementById('product-image-base64').value = base64;
  };
  reader.readAsDataURL(file);
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('product-edit-id').value;
  const data = {
    name: document.getElementById('product-name').value,
    description: document.getElementById('product-desc').value,
    price: parseInt(document.getElementById('product-price').value),
    stock: parseInt(document.getElementById('product-stock').value),
    unit: document.getElementById('product-unit').value,
    benefits: document.getElementById('product-benefits').value,
    quality: document.getElementById('product-quality').value,
    image: document.getElementById('product-image-base64').value || 'assets/images/pakcoy-product.png'
  };

  if (id) {
    DataStore.updateProduct(id, data);
    showToast('Produk berhasil diperbarui!', 'success');
  } else {
    DataStore.addProduct(data);
    showToast('Produk baru berhasil ditambahkan!', 'success');
  }

  closeProductModal();
  navigateTo('#/admin/produk');
}

function deleteProductConfirm(id) {
  if (confirm('Yakin ingin menghapus produk ini?')) {
    DataStore.deleteProduct(id);
    showToast('Produk berhasil dihapus', 'info');
    navigateTo('#/admin/produk');
  }
}
