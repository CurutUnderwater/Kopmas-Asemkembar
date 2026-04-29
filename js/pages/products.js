/* ============================================
   Products Page
   ============================================ */
function renderProducts() {
  const products = DataStore.getProducts();

  return `
    <div class="page-header">
      <div class="container">
        <h1>Produk Kami</h1>
        <p>Pakcoy segar berkualitas tinggi langsung dari kebun KOPMAS Asem Kembar</p>
        <div class="breadcrumb">
          <a href="#/">Beranda</a> <span>/</span> <span>Produk</span>
        </div>
      </div>
    </div>

    <!-- Product Benefits Overview -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Keunggulan Pakcoy Kami</h2>
          <p>Ditanam dengan cinta, dipanen dengan hati-hati</p>
        </div>
        <div class="grid grid-4 stagger">
          <div class="card card-body text-center">
            <div style="font-size:2.5rem; margin-bottom: var(--space-md);">🌱</div>
            <h5>Organik</h5>
            <p class="card-text">Tanpa pestisida dan bahan kimia berbahaya</p>
          </div>
          <div class="card card-body text-center">
            <div style="font-size:2.5rem; margin-bottom: var(--space-md);">💧</div>
            <h5>Segar</h5>
            <p class="card-text">Dipanen pagi hari, dikirim hari yang sama</p>
          </div>
          <div class="card card-body text-center">
            <div style="font-size:2.5rem; margin-bottom: var(--space-md);">🏅</div>
            <h5>Berkualitas</h5>
            <p class="card-text">Disortir ketat untuk menjamin kualitas terbaik</p>
          </div>
          <div class="card card-body text-center">
            <div style="font-size:2.5rem; margin-bottom: var(--space-md);">💚</div>
            <h5>Bergizi</h5>
            <p class="card-text">Kaya vitamin A, C, K, kalsium, dan zat besi</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product List -->
    <section class="section" style="background: var(--color-white);">
      <div class="container">
        <div class="section-header">
          <h2>Daftar Produk</h2>
        </div>
        <div class="grid grid-3 stagger">
          ${products.map(p => `
            <div class="card">
              <img src="${p.image}" alt="${p.name}" class="card-img" style="height: 220px;">
              <div class="card-body">
                <span class="badge badge-secondary mb-sm">${p.stock > 0 ? 'Tersedia' : 'Habis'}</span>
                <h4 class="card-title">${p.name}</h4>
                <p class="card-text mb-md">${p.description}</p>
                <div class="mb-md" style="padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-md);">
                  <p style="font-size: var(--fs-sm); margin-bottom: var(--space-xs);"><strong>Manfaat:</strong> ${p.benefits}</p>
                  <p style="font-size: var(--fs-sm);"><strong>Kualitas:</strong> ${p.quality}</p>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span style="font-family: var(--font-heading); font-size: var(--fs-xl); font-weight: 800; color: var(--color-primary);">Rp ${p.price.toLocaleString('id-ID')}</span>
                    <span class="text-light" style="font-size: var(--fs-sm);">/ ${p.unit}</span>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="addToCartFromProduct('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''}>
                    🛒 Pesan
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Nutrition Info -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Kandungan Nutrisi Pakcoy</h2>
          <p>Per 100 gram pakcoy segar</p>
        </div>
        <div class="grid grid-2 gap-2xl" style="align-items: center;">
          <div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr><th>Nutrisi</th><th>Jumlah</th><th>% AKG</th></tr>
                </thead>
                <tbody>
                  <tr><td>Kalori</td><td>13 kkal</td><td>1%</td></tr>
                  <tr><td>Protein</td><td>1.5 g</td><td>3%</td></tr>
                  <tr><td>Serat</td><td>1.0 g</td><td>4%</td></tr>
                  <tr><td>Vitamin A</td><td>4468 IU</td><td>89%</td></tr>
                  <tr><td>Vitamin C</td><td>45 mg</td><td>75%</td></tr>
                  <tr><td>Vitamin K</td><td>45.5 mcg</td><td>57%</td></tr>
                  <tr><td>Kalsium</td><td>105 mg</td><td>11%</td></tr>
                  <tr><td>Zat Besi</td><td>0.8 mg</td><td>4%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 class="mb-md">Manfaat Kesehatan</h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-md);">
              ${[
                { icon: '👀', title: 'Menjaga Kesehatan Mata', desc: 'Kandungan vitamin A yang tinggi membantu menjaga kesehatan mata dan mencegah degenerasi makula.' },
                { icon: '🦴', title: 'Menguatkan Tulang', desc: 'Kalsium dan vitamin K bekerja sama untuk menjaga kepadatan dan kekuatan tulang.' },
                { icon: '🛡️', title: 'Meningkatkan Imunitas', desc: 'Vitamin C sebagai antioksidan kuat membantu meningkatkan sistem kekebalan tubuh.' },
                { icon: '❤️', title: 'Menyehatkan Jantung', desc: 'Serat dan kalium dalam pakcoy membantu menjaga tekanan darah dan kesehatan kardiovaskular.' }
              ].map(b => `
                <div class="benefit-item">
                  <div class="benefit-icon">${b.icon}</div>
                  <div>
                    <h5>${b.title}</h5>
                    <p style="font-size: var(--fs-sm); color: var(--color-text-light);">${b.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function addToCartFromProduct(productId) {
  DataStore.addToCart(productId, 1);
  showToast('Produk ditambahkan ke keranjang!', 'success');
}
