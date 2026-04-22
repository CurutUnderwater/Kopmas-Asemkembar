/* ============================================
   Home Page
   ============================================ */
function renderHome() {
  return `
    <!-- Hero -->
    <section class="hero" id="hero">
      <div class="hero-bg">
        <img src="assets/images/hero-banner.png" alt="Kebun Pakcoy KOPMAS Asem Kembar">
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-badge">🌱 Kelompok Masyarakat Asem Kembar</div>
        <h1>Pakcoy Segar<br><span class="highlight">Langsung dari Kebun</span></h1>
        <p>Kami menanam, merawat, dan memanen pakcoy organik berkualitas tinggi. Dari kebun kami langsung ke meja makan Anda.</p>
        <div class="hero-actions">
          <a href="#/pesan" class="btn btn-primary btn-lg">🛒 Pesan Sekarang</a>
          <a href="#/profil" class="btn btn-secondary btn-lg">Tentang Kami</a>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section" id="features">
      <div class="container">
        <div class="section-header">
          <h2>Mengapa Memilih Kami?</h2>
          <p>KOPMAS Asem Kembar berkomitmen menyediakan sayuran segar dan berkualitas untuk masyarakat</p>
        </div>
        <div class="features-grid stagger">
          <div class="card feature-card">
            <div class="feature-icon">🌿</div>
            <h4>100% Organik</h4>
            <p>Ditanam tanpa pestisida kimia, menggunakan pupuk organik dan kompos alami untuk menjaga kualitas dan keamanan pangan.</p>
          </div>
          <div class="card feature-card">
            <div class="feature-icon">🌾</div>
            <h4>Segar Setiap Hari</h4>
            <p>Pakcoy dipanen setiap pagi hari untuk memastikan kesegaran maksimal saat sampai di tangan pelanggan.</p>
          </div>
          <div class="card feature-card">
            <div class="feature-icon">🤝</div>
            <h4>Mendukung Petani Lokal</h4>
            <p>Setiap pembelian Anda langsung mendukung kesejahteraan petani lokal di Asem Kembar.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Showcase -->
    <section class="section" style="background: var(--color-white);" id="product-showcase">
      <div class="container">
        <div class="product-showcase">
          <div class="product-image">
            <img src="assets/images/pakcoy-product.png" alt="Pakcoy Segar KOPMAS">
          </div>
          <div class="product-detail">
            <span class="badge badge-secondary">Produk Unggulan</span>
            <h3 class="mt-md">Pakcoy Segar Premium</h3>
            <p>Pakcoy (Brassica rapa subsp. chinensis) adalah sayuran hijau bergizi tinggi yang kaya akan vitamin dan mineral penting. Ditanam dengan penuh kasih di kebun KOPMAS Asem Kembar.</p>
            <div class="product-benefits">
              <div class="benefit-item">
                <div class="benefit-icon">💪</div>
                <div>
                  <h5>Kaya Nutrisi</h5>
                  <p>Mengandung vitamin A, C, K, kalsium, dan zat besi yang penting untuk tubuh</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🛡️</div>
                <div>
                  <h5>Bebas Pestisida</h5>
                  <p>Aman dikonsumsi karena ditanam secara organik tanpa bahan kimia berbahaya</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">⏰</div>
                <div>
                  <h5>Selalu Segar</h5>
                  <p>Dipanen pagi hari dan dikirim langsung, menjamin kesegaran terbaik</p>
                </div>
              </div>
            </div>
            <a href="#/produk" class="btn btn-primary">Lihat Detail Produk →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Agenda Preview -->
    <section class="section" id="agenda-preview">
      <div class="container">
        <div class="section-header">
          <h2>Agenda Kegiatan</h2>
          <p>Jadwal kegiatan KOPMAS Asem Kembar yang akan datang</p>
        </div>
        <div class="grid grid-3 stagger" id="home-agenda-list">
          ${renderHomeAgendaCards()}
        </div>
        <div class="text-center mt-xl">
          <a href="#/agenda" class="btn btn-secondary">Lihat Semua Agenda →</a>
        </div>
      </div>
    </section>

    <!-- CTA + Social -->
    <section class="section">
      <div class="container">
        <div class="cta-section">
          <h2 class="text-white">Tertarik dengan Produk Kami?</h2>
          <p>Pesan pakcoy segar langsung dari kebun kami. Tersedia pembayaran via QRIS dan COD.</p>
          <a href="#/pesan" class="btn btn-accent btn-lg">🛒 Pesan Sekarang</a>
          <div class="social-links">
            <a href="https://instagram.com/kopmas.asemkembar" target="_blank" class="social-link instagram" title="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
            </a>
            <a href="https://tiktok.com/@kopmas.asemkembar" target="_blank" class="social-link tiktok" title="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.29 8.29 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z"/></svg>
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" class="social-link whatsapp" title="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.29-.178-3.065.91.854-3.131-.187-.297A7.96 7.96 0 014 12a8 8 0 118 8z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderHomeAgendaCards() {
  const agenda = DataStore.getAgenda()
    .filter(a => a.status === 'akan_datang')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  if (agenda.length === 0) {
    return '<p class="text-center text-light">Belum ada agenda mendatang.</p>';
  }

  return agenda.map(a => {
    const d = new Date(a.date);
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `
      <div class="card agenda-card">
        <div class="agenda-date-box">
          <div class="day">${d.getDate()}</div>
          <div class="month">${months[d.getMonth()]}</div>
        </div>
        <div class="agenda-info">
          <h4>${a.title}</h4>
          <p>${a.description.substring(0, 80)}...</p>
          <div class="agenda-meta">
            <span>📍 ${a.location}</span>
            <span>🕐 ${a.time}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
