/* ============================================
   Profile Page
   ============================================ */
function renderProfile() {
  return `
    <div class="page-header">
      <div class="container">
        <h1>Profil KOPMAS</h1>
        <p>Mengenal lebih dekat Kelompok Masyarakat Asem Kembar</p>
        <div class="breadcrumb">
          <a href="#/">Beranda</a> <span>/</span> <span>Profil</span>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <section class="section">
      <div class="container">
        <div class="profile-hero-section">
          <div>
            <span class="badge badge-primary mb-md">Tentang Kami</span>
            <h2 class="mt-sm">Kelompok Masyarakat<br>Asem Kembar</h2>
            <p class="mt-md text-light" style="line-height:1.8">
              KOPMAS (Kelompok Masyarakat) Asem Kembar adalah sebuah kelompok masyarakat yang berdiri atas dasar kepedulian terhadap ketahanan pangan lokal dan pemberdayaan ekonomi masyarakat di kawasan Asem Kembar. 
            </p>
            <p class="mt-md text-light" style="line-height:1.8">
              Didirikan pada tahun 2020, KOPMAS Asem Kembar berawal dari sekelompok warga yang memiliki visi yang sama: memanfaatkan lahan tidur di sekitar lingkungan untuk ditanami sayuran berkualitas, khususnya <strong>Pakcoy (Brassica rapa)</strong> dengan hasil ± 20kg setiap 3 bulan.
            </p>
            <p class="mt-md text-light" style="line-height:1.8">
              Dengan semangat gotong royong dan kecintaan terhadap pertanian organik, kelompok ini terus berkembang dan kini menjadi salah satu pemasok pakcoy segar terpercaya di wilayah sekitar.
            </p>
            <div class="profile-stats">
              <div class="profile-stat">
                <div class="stat-num">2020</div>
                <div class="stat-label">Tahun Berdiri</div>
              </div>
              <div class="profile-stat">
                <div class="stat-num">15+</div>
                <div class="stat-label">Anggota Aktif</div>
              </div>
              <div class="profile-stat">
                <div class="stat-num">20</div>
                <div class="stat-label">KG Pakcoy / 3 Bulan</div>
              </div>
              <div class="profile-stat">
                <div class="stat-num">3</div>
                <div class="stat-label">Lahan Produktif</div>
              </div>
            </div>
          </div>
          <div class="product-image" style="max-height:480px;">
            <img src="assets/images/hero-banner.png" alt="Kebun KOPMAS Asem Kembar" style="height:480px;">
          </div>
        </div>
      </div>
    </section>

    <!-- Vision & Mission -->
    <section class="section" style="background: var(--color-white);">
      <div class="container">
        <div class="section-header">
          <h2>Visi & Misi</h2>
        </div>
        <div class="grid grid-2 gap-2xl">
          <div class="card card-body" style="border-left: 4px solid var(--color-secondary);">
            <h4 class="text-primary mb-md">🎯 Visi</h4>
            <p class="text-light" style="line-height:1.8">
              Menjadi kelompok masyarakat pertanian organik yang mandiri, inovatif, dan berdampak positif bagi ketahanan pangan lokal serta kesejahteraan masyarakat di kawasan Asem Kembar dan sekitarnya.
            </p>
          </div>
          <div class="card card-body" style="border-left: 4px solid var(--color-accent);">
            <h4 class="text-accent mb-md">🚀 Misi</h4>
            <ul style="color: var(--color-text-light); line-height: 2.2; padding-left: var(--space-md);">
              <li>✅ Mengembangkan budidaya pakcoy organik berkualitas tinggi</li>
              <li>✅ Memberdayakan masyarakat melalui kegiatan pertanian produktif</li>
              <li>✅ Memperluas jaringan pemasaran produk lokal</li>
              <li>✅ Mendorong gaya hidup sehat melalui konsumsi sayuran organik</li>
              <li>✅ Mengelola keuangan secara transparan dan akuntabel</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Activities Timeline -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Kegiatan Kami</h2>
          <p>Dari penanaman hingga pemanenan, kami mengerjakan semuanya dengan penuh dedikasi</p>
        </div>
        <div class="grid grid-2 gap-2xl" style="align-items: start;">
          <div>
            <div class="profile-timeline stagger">
              <div class="timeline-item">
                <div class="timeline-date">Tahap 1</div>
                <h4>Persiapan Lahan</h4>
                <p>Mengolah tanah, membuat bedengan, dan menambahkan pupuk organik serta kompos untuk menyiapkan media tanam yang subur dan kaya nutrisi.</p>
              </div>
              <div class="timeline-item">
                <div class="timeline-date">Tahap 2</div>
                <h4>Persemaian Bibit</h4>
                <p>Menyemai benih pakcoy di tray semai dengan media khusus. Bibit dirawat selama 14-21 hari hingga siap dipindahkan ke lahan.</p>
              </div>
              <div class="timeline-item">
                <div class="timeline-date">Tahap 3</div>
                <h4>Penanaman</h4>
                <p>Bibit yang sudah memiliki 3-4 daun dipindahkan ke bedengan dengan jarak tanam yang optimal untuk pertumbuhan maksimal.</p>
              </div>
              <div class="timeline-item">
                <div class="timeline-date">Tahap 4</div>
                <h4>Perawatan</h4>
                <p>Penyiraman rutin 2x sehari, pemupukan susulan dengan pupuk organik cair, pengendalian hama secara alami, dan penyiangan gulma.</p>
              </div>
            </div>
          </div>
          <div>
            <div class="profile-timeline stagger">
              <div class="timeline-item">
                <div class="timeline-date">Tahap 5</div>
                <h4>Pemanenan</h4>
                <p>Pakcoy dipanen setelah kurang lebih 90 hari masa tanam. Pemanenan dilakukan di pagi hari untuk menjaga kesegaran dan kualitas daun.</p>
              </div>
              <div class="timeline-item">
                <div class="timeline-date">Tahap 6</div>
                <h4>Sortasi & Pengemasan</h4>
                <p>Pakcoy yang telah dipanen disortir berdasarkan kualitas, dibersihkan, dan dikemas dengan rapi untuk menjaga kesegaran.</p>
              </div>
              <div class="timeline-item">
                <div class="timeline-date">Tahap 7</div>
                <h4>Distribusi & Penjualan</h4>
                <p>Produk didistribusikan ke pasar tradisional, restoran lokal, dan pelanggan online melalui website dan media sosial.</p>
              </div>
            </div>
            <div class="card card-body mt-xl" style="background: linear-gradient(135deg, rgba(82,183,136,0.08), rgba(45,106,79,0.05));">
              <h4 class="text-primary mb-sm">📊 Siklus Tanam</h4>
              <p class="text-light" style="font-size: var(--fs-sm); line-height: 1.7;">
                Dengan siklus tanam sekitar 3 bulan, KOPMAS Asem Kembar mampu menghasilkan rata-rata <strong>± 100 kg pakcoy setiap kali panen</strong> dari lahan produktif yang dikelola dengan dedikasi tinggi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="section" style="background: var(--color-white);">
      <div class="container">
        <div class="section-header">
          <h2>Struktur Organisasi</h2>
          <p>Tim inti KOPMAS Asem Kembar yang mengelola operasional harian</p>
        </div>
        <div class="grid grid-4 stagger">
          ${[
            { name: 'Pak Suryo', role: 'Ketua', emoji: '👨‍🌾' },
            { name: 'Bu Kartini', role: 'Sekretaris', emoji: '👩‍💼' },
            { name: 'Pak Darmo', role: 'Bendahara', emoji: '👨‍💼' },
            { name: 'Mas Adi', role: 'Koordinator Lapangan', emoji: '👷' }
          ].map(m => `
            <div class="card text-center">
              <div class="card-body">
                <div style="font-size:3rem; margin-bottom: var(--space-md);">${m.emoji}</div>
                <h5>${m.name}</h5>
                <p class="text-light" style="font-size: var(--fs-sm);">${m.role}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
