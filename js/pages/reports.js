/* ============================================
   Public Financial Reports Page
   ============================================ */

function getReportPeriodLabel(period) {
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  if (period.month === 'all') return `Tahun ${period.year}`;
  return `${months[period.month]} ${period.year}`;
}

function fmtRp(amount) {
  const abs = Math.abs(amount);
  const formatted = 'Rp ' + abs.toLocaleString('id-ID');
  if (amount < 0) return '(' + formatted + ')';
  return formatted;
}

function renderReports() {
  const currentYear = new Date().getFullYear();
  const selMonth = window._reportMonth !== undefined ? window._reportMonth : 'all';
  const selYear = window._reportYear || currentYear;
  const activeTab = window._reportTab || 'laba-rugi';

  return `
    <div class="page-header">
      <div class="container">
        <h1>Laporan Keuangan</h1>
        <p>Transparansi keuangan KOPMAS Asem Kembar</p>
        <div class="breadcrumb">
          <a href="#/">Beranda</a> <span>/</span> <span>Laporan Keuangan</span>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- Period Filter -->
        <div class="report-filter-bar">
          <div class="flex items-center gap-md" style="flex-wrap:wrap;">
            <label class="font-semibold" style="font-size:var(--fs-sm);">Periode:</label>
            <select id="report-month" onchange="changeReportPeriod()" style="width:auto; min-width:140px;">
              <option value="all" ${selMonth === 'all' ? 'selected' : ''}>Semua Bulan</option>
              ${['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map((m, i) =>
                `<option value="${i}" ${selMonth === i ? 'selected' : ''}>${m}</option>`
              ).join('')}
            </select>
            <select id="report-year" onchange="changeReportPeriod()" style="width:auto; min-width:100px;">
              ${[currentYear - 1, currentYear, currentYear + 1].map(y =>
                `<option value="${y}" ${selYear === y ? 'selected' : ''}>${y}</option>`
              ).join('')}
            </select>
          </div>
          <div class="flex gap-sm">
            <button class="btn btn-primary btn-sm" onclick="downloadReportPDF()">📄 Download PDF</button>
            <button class="btn btn-secondary btn-sm" onclick="downloadReportExcel()">📊 Download Excel</button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button class="tab-btn ${activeTab === 'laba-rugi' ? 'active' : ''}" onclick="switchReportTab('laba-rugi', this)">Laba Rugi</button>
          <button class="tab-btn ${activeTab === 'posisi' ? 'active' : ''}" onclick="switchReportTab('posisi', this)">Posisi Keuangan</button>
          <button class="tab-btn ${activeTab === 'ekuitas' ? 'active' : ''}" onclick="switchReportTab('ekuitas', this)">Perubahan Ekuitas</button>
          <button class="tab-btn ${activeTab === 'arus-kas' ? 'active' : ''}" onclick="switchReportTab('arus-kas', this)">Arus Kas</button>
        </div>

        <!-- Report Content -->
        <div id="report-content-area">
          ${renderReportContent(activeTab, { month: selMonth, year: selYear })}
        </div>
      </div>
    </section>
  `;
}

function renderReportContent(tab, period) {
  const data = DataStore.generateReportData(period);
  const periodLabel = getReportPeriodLabel(data.period);

  switch (tab) {
    case 'laba-rugi': return renderLabaRugi(data, periodLabel);
    case 'posisi': return renderPosisiKeuangan(data, periodLabel);
    case 'ekuitas': return renderPerubahanEkuitas(data, periodLabel);
    case 'arus-kas': return renderArusKas(data, periodLabel);
    default: return renderLabaRugi(data, periodLabel);
  }
}

/* --- Laba Rugi --- */
function renderLabaRugi(data, periodLabel) {
  const lr = data.labaRugi;
  return `
    <div class="report-sheet" id="report-printable">
      <div class="report-header-print">
        <h3>KOPMAS ASEM KEMBAR</h3>
        <h2>LAPORAN LABA RUGI</h2>
        <p>Periode: ${periodLabel}</p>
      </div>
      <table class="report-table">
        <tbody>
          <tr class="report-section-title"><td colspan="2">PENDAPATAN</td></tr>
          ${Object.entries(lr.pendapatanByCategory).map(([cat, val]) => `
            <tr><td class="indent-1">${cat}</td><td class="amount">${fmtRp(val)}</td></tr>
          `).join('') || '<tr><td class="indent-1 text-light">Belum ada data</td><td class="amount">-</td></tr>'}
          <tr class="report-subtotal"><td>Total Pendapatan</td><td class="amount">${fmtRp(lr.totalPendapatan)}</td></tr>

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-section-title"><td colspan="2">HARGA POKOK PENJUALAN</td></tr>
          ${Object.entries(lr.bebanByCategory).filter(([cat]) => ['Benih','Pupuk','Bibit','Media Tanam'].some(c => cat.includes(c))).map(([cat, val]) => `
            <tr><td class="indent-1">${cat}</td><td class="amount">${fmtRp(val)}</td></tr>
          `).join('') || '<tr><td class="indent-1 text-light">-</td><td class="amount">-</td></tr>'}
          <tr class="report-subtotal"><td>Total HPP</td><td class="amount">(${fmtRp(lr.hpp)})</td></tr>

          <tr class="report-total"><td>LABA KOTOR</td><td class="amount">${fmtRp(lr.labaKotor)}</td></tr>

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-section-title"><td colspan="2">BEBAN OPERASIONAL</td></tr>
          ${Object.entries(lr.bebanByCategory).filter(([cat]) => !['Benih','Pupuk','Bibit','Media Tanam'].some(c => cat.includes(c))).map(([cat, val]) => `
            <tr><td class="indent-1">${cat}</td><td class="amount">${fmtRp(val)}</td></tr>
          `).join('') || '<tr><td class="indent-1 text-light">-</td><td class="amount">-</td></tr>'}
          <tr class="report-subtotal"><td>Total Beban Operasional</td><td class="amount">(${fmtRp(lr.bebanOperasional)})</td></tr>

          <tr class="report-grand-total"><td>LABA (RUGI) BERSIH</td><td class="amount ${lr.labaBersih >= 0 ? 'positive' : 'negative'}">${fmtRp(lr.labaBersih)}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

/* --- Posisi Keuangan --- */
function renderPosisiKeuangan(data, periodLabel) {
  const pk = data.posisiKeuangan;
  return `
    <div class="report-sheet" id="report-printable">
      <div class="report-header-print">
        <h3>KOPMAS ASEM KEMBAR</h3>
        <h2>LAPORAN POSISI KEUANGAN</h2>
        <p>Per ${periodLabel}</p>
      </div>
      <table class="report-table">
        <tbody>
          <tr class="report-section-title"><td colspan="2">ASET</td></tr>
          <tr class="report-section-title"><td colspan="2" class="indent-1" style="font-size:var(--fs-sm);">Aset Lancar</td></tr>
          <tr><td class="indent-2">Kas & Setara Kas</td><td class="amount">${fmtRp(pk.kasBank)}</td></tr>
          <tr><td class="indent-2">Piutang Usaha</td><td class="amount">${fmtRp(pk.piutang)}</td></tr>
          <tr><td class="indent-2">Persediaan</td><td class="amount">${fmtRp(pk.persediaan)}</td></tr>
          <tr class="report-subtotal"><td class="indent-1">Total Aset Lancar</td><td class="amount">${fmtRp(pk.totalAsetLancar)}</td></tr>

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-section-title"><td colspan="2" class="indent-1" style="font-size:var(--fs-sm);">Aset Tetap</td></tr>
          <tr><td class="indent-2">Peralatan & Perlengkapan</td><td class="amount">${fmtRp(pk.asetTetap)}</td></tr>
          <tr class="report-subtotal"><td class="indent-1">Total Aset Tetap</td><td class="amount">${fmtRp(pk.asetTetap)}</td></tr>

          <tr class="report-total"><td>TOTAL ASET</td><td class="amount">${fmtRp(pk.totalAset)}</td></tr>

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-section-title"><td colspan="2">KEWAJIBAN</td></tr>
          <tr><td class="indent-1">Kewajiban Lancar</td><td class="amount">${fmtRp(pk.kewajibanLancar)}</td></tr>
          <tr class="report-subtotal"><td>Total Kewajiban</td><td class="amount">${fmtRp(pk.totalKewajiban)}</td></tr>

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-section-title"><td colspan="2">EKUITAS</td></tr>
          <tr><td class="indent-1">Modal / Ekuitas</td><td class="amount">${fmtRp(pk.ekuitas)}</td></tr>

          <tr class="report-grand-total"><td>TOTAL KEWAJIBAN & EKUITAS</td><td class="amount">${fmtRp(pk.totalKewajiban + pk.ekuitas)}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

/* --- Perubahan Ekuitas --- */
function renderPerubahanEkuitas(data, periodLabel) {
  const pe = data.perubahanEkuitas;
  return `
    <div class="report-sheet" id="report-printable">
      <div class="report-header-print">
        <h3>KOPMAS ASEM KEMBAR</h3>
        <h2>LAPORAN PERUBAHAN EKUITAS</h2>
        <p>Periode: ${periodLabel}</p>
      </div>
      <table class="report-table">
        <tbody>
          <tr class="report-section-title"><td colspan="2">MODAL AWAL PERIODE</td></tr>
          <tr><td class="indent-1">Saldo Modal Awal</td><td class="amount">${fmtRp(pe.modalAwal)}</td></tr>

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-section-title"><td colspan="2">PENAMBAHAN</td></tr>
          <tr><td class="indent-1">Laba (Rugi) Bersih Periode Ini</td><td class="amount ${pe.labaBersih >= 0 ? 'positive' : 'negative'}">${fmtRp(pe.labaBersih)}</td></tr>
          ${Object.entries(pe.danaTambahanByCategory).map(([cat, val]) => `
            <tr><td class="indent-1">${cat}</td><td class="amount">${fmtRp(val)}</td></tr>
          `).join('')}
          ${pe.totalDanaTambahan > 0 ? `
            <tr class="report-subtotal"><td>Total Dana Tambahan</td><td class="amount">${fmtRp(pe.totalDanaTambahan)}</td></tr>
          ` : ''}

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-grand-total"><td>MODAL AKHIR PERIODE</td><td class="amount">${fmtRp(pe.modalAkhir)}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

/* --- Arus Kas --- */
function renderArusKas(data, periodLabel) {
  const ak = data.arusKas;
  return `
    <div class="report-sheet" id="report-printable">
      <div class="report-header-print">
        <h3>KOPMAS ASEM KEMBAR</h3>
        <h2>LAPORAN ARUS KAS</h2>
        <p>Periode: ${periodLabel}</p>
      </div>
      <table class="report-table">
        <tbody>
          <tr class="report-section-title"><td colspan="2">ARUS KAS DARI AKTIVITAS OPERASI</td></tr>
          <tr><td class="indent-1">Penerimaan dari Penjualan</td><td class="amount">${fmtRp(ak.kasMasukOperasi)}</td></tr>
          <tr><td class="indent-1">Pembayaran Beban Operasional</td><td class="amount">(${fmtRp(ak.kasKeluarOperasi)})</td></tr>
          <tr class="report-subtotal"><td>Arus Kas Bersih dari Operasi</td><td class="amount ${ak.arusOperasi >= 0 ? 'positive' : 'negative'}">${fmtRp(ak.arusOperasi)}</td></tr>

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-section-title"><td colspan="2">ARUS KAS DARI AKTIVITAS INVESTASI</td></tr>
          <tr><td class="indent-1">Pembelian Peralatan</td><td class="amount">(${fmtRp(ak.kasKeluarInvestasi)})</td></tr>
          <tr class="report-subtotal"><td>Arus Kas Bersih dari Investasi</td><td class="amount ${ak.arusInvestasi >= 0 ? 'positive' : 'negative'}">${fmtRp(ak.arusInvestasi)}</td></tr>

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-section-title"><td colspan="2">ARUS KAS DARI AKTIVITAS PENDANAAN</td></tr>
          <tr><td class="indent-1">Penerimaan Hibah & Donasi</td><td class="amount">${fmtRp(ak.kasMasukPendanaan)}</td></tr>
          <tr class="report-subtotal"><td>Arus Kas Bersih dari Pendanaan</td><td class="amount ${ak.arusPendanaan >= 0 ? 'positive' : 'negative'}">${fmtRp(ak.arusPendanaan)}</td></tr>

          <tr class="report-spacer"><td colspan="2"></td></tr>
          <tr class="report-total"><td>KENAIKAN (PENURUNAN) BERSIH KAS</td><td class="amount ${ak.kenaikanKas >= 0 ? 'positive' : 'negative'}">${fmtRp(ak.kenaikanKas)}</td></tr>
          <tr><td class="indent-1">Kas & Setara Kas Awal Periode</td><td class="amount">${fmtRp(ak.kasAwal)}</td></tr>
          <tr class="report-grand-total"><td>KAS & SETARA KAS AKHIR PERIODE</td><td class="amount">${fmtRp(ak.kasAkhir)}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

/* --- Tab & Period Switching --- */
function switchReportTab(tab, btn) {
  window._reportTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const period = { month: window._reportMonth !== undefined ? window._reportMonth : 'all', year: window._reportYear || new Date().getFullYear() };
  document.getElementById('report-content-area').innerHTML = renderReportContent(tab, period);
}

function changeReportPeriod() {
  const m = document.getElementById('report-month').value;
  const y = parseInt(document.getElementById('report-year').value);
  window._reportMonth = m === 'all' ? 'all' : parseInt(m);
  window._reportYear = y;
  const tab = window._reportTab || 'laba-rugi';
  const period = { month: window._reportMonth, year: y };
  document.getElementById('report-content-area').innerHTML = renderReportContent(tab, period);
}

/* --- PDF Download --- */
function downloadReportPDF() {
  const element = document.getElementById('report-printable');
  if (!element) { showToast('Tidak ada laporan untuk diunduh', 'error'); return; }

  const tab = window._reportTab || 'laba-rugi';
  const tabNames = { 'laba-rugi': 'Laba_Rugi', 'posisi': 'Posisi_Keuangan', 'ekuitas': 'Perubahan_Ekuitas', 'arus-kas': 'Arus_Kas' };
  const filename = `Laporan_${tabNames[tab]}_KOPMAS_Asem_Kembar.pdf`;

  if (typeof html2pdf === 'undefined') {
    showToast('Library PDF belum dimuat. Coba refresh halaman.', 'error');
    return;
  }

  showToast('Menyiapkan PDF...', 'info');

  const opt = {
    margin: [10, 15, 10, 15],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    showToast('PDF berhasil diunduh!', 'success');
  });
}

/* --- Excel Download (Formatted) --- */
function downloadReportExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Library Excel belum dimuat. Coba refresh halaman.', 'error');
    return;
  }

  const period = { month: window._reportMonth !== undefined ? window._reportMonth : 'all', year: window._reportYear || new Date().getFullYear() };
  const data = DataStore.generateReportData(period);
  const periodLabel = getReportPeriodLabel(data.period);
  const tab = window._reportTab || 'laba-rugi';
  const tabNames = { 'laba-rugi': 'Laba_Rugi', 'posisi': 'Neraca_Saldo', 'ekuitas': 'Perubahan_Ekuitas', 'arus-kas': 'Arus_Kas' };

  const wb = XLSX.utils.book_new();
  let ws, rows;

  const lr = data.labaRugi, pk = data.posisiKeuangan, pe = data.perubahanEkuitas, ak = data.arusKas;

  const rpFmt = (v) => v === 0 ? '-' : v;

  if (tab === 'laba-rugi') {
    rows = [
      ['', 'KOPMAS ASEM KEMBAR', '', ''],
      ['', 'LAPORAN LABA/RUGI', '', ''],
      ['', 'PERIODE ' + periodLabel.toUpperCase(), '', ''],
      ['', '', '', ''],
      ['', 'Pendapatan', '', ''],
      ['', 'Penjualan', '', ''],
      ['', 'Retur dan Potongan Penjualan', '', ''],
      ['', 'Diskon Penjualan', '', ''],
      ['', '', 'Rp', rpFmt(lr.totalPendapatan)],
      ['', 'Penjualan bersih', 'Rp', rpFmt(lr.totalPendapatan)],
      ['', '', '', ''],
      ['', 'Harga Pokok Penjualan', '', ''],
      ['', 'Laba kotor', 'Rp', rpFmt(lr.labaKotor)],
      ['', 'BEBAN-BEBAN', '', ''],
      ['', 'Beban Gaji Pegawai', '', ''],
      ['', 'Beban Penjualan Lain-lain', '', ''],
      ['', 'Beban Sewa', '', ''],
      ['', 'Biaya Administrasi Lain-lain', '', ''],
      ['', 'Beban Perlengkapan', '', ''],
      ['', 'Beban Penyusutan Peralatan', '', ''],
    ];
    // Add actual expense categories
    Object.entries(lr.bebanByCategory).forEach(([cat, val]) => {
      rows.push(['', cat, '', rpFmt(val)]);
    });
    rows.push(['', 'Total Beban', 'Rp', rpFmt(lr.bebanOperasional + lr.hpp)]);
    rows.push(['', 'LABA BERSIH', 'Rp', rpFmt(lr.labaBersih)]);

    ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 3 }, { wch: 38 }, { wch: 5 }, { wch: 15 }];
    // Merge header cells
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
      { s: { r: 2, c: 1 }, e: { r: 2, c: 3 } },
    ];

  } else if (tab === 'posisi') {
    rows = [
      ['', 'KOPMAS ASEM KEMBAR', '', '', ''],
      ['', 'NERACA SALDO', '', '', ''],
      ['', 'PERIODE ' + periodLabel.toUpperCase(), '', '', ''],
      ['', '', '', '', ''],
      ['No.', 'Nama Akun', '', 'Debit', 'Kredit'],
      ['', 'Kas', '', rpFmt(pk.kasBank), ''],
      ['', 'Piutang', '', rpFmt(pk.piutang), ''],
      ['', 'Perlengkapan', '', '', ''],
      ['', 'Peralatan', '', rpFmt(pk.asetTetap), ''],
      ['', 'Hutang', '', '', rpFmt(pk.kewajibanLancar)],
      ['', 'Pendapatan Diterima Dimuka', '', '', ''],
      ['', 'Ekuitas', '', '', rpFmt(pk.ekuitas)],
      ['', 'Pendapatan', '', '', rpFmt(lr.totalPendapatan)],
      ['', 'Beban Gaji', '', '', ''],
      ['', 'Beban Asuransi', '', '', ''],
      ['', 'Beban Asuransi Properti Dan Kecelakaan', '', '', ''],
      ['', 'Beban Sewa', '', '', ''],
      ['', 'JUMLAH', '', 'Rp    -', 'Rp    -'],
    ];

    ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 5 }, { wch: 40 }, { wch: 3 }, { wch: 12 }, { wch: 12 }];
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 4 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } },
      { s: { r: 2, c: 1 }, e: { r: 2, c: 4 } },
      { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } },
    ];

  } else if (tab === 'ekuitas') {
    rows = [
      ['', 'KOMPAS ASEM KEMBAR', '', ''],
      ['', 'LAPORAN PERUBAHAN EKUITAS', '', ''],
      ['', 'PERIODE ' + periodLabel.toUpperCase(), '', ''],
      ['', '', '', ''],
      ['Ekuitas Awal', '', '', ''],
      ['Laba bersih', '', '', ''],
      ['', '', 'Rp', rpFmt(pe.labaBersih)],
      ['', '', '', ''],
      ['Prive', '', '', ''],
      ['', '', '', ''],
      ['Ekuitas Akhir', '', 'Rp', rpFmt(pe.modalAkhir)],
    ];

    ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 18 }, { wch: 12 }, { wch: 5 }, { wch: 15 }];
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
      { s: { r: 2, c: 1 }, e: { r: 2, c: 3 } },
    ];

  } else {
    // Arus Kas
    rows = [
      ['', 'KOPMAS ASEM KEMBAR', '', ''],
      ['', 'LAPORAN ARUS KAS', '', ''],
      ['', 'PERIODE ' + periodLabel.toUpperCase(), '', ''],
      ['', '', '', ''],
      ['ARUS KAS DARI AKTIVITAS OPERASI', '', '', ''],
      ['Kas diterima dari pelanggan', '', '', ''],
      ['Dikurangi:', '', '', ''],
      ['Pembayaran kas untuk supplier (Barang)', '', '', ''],
      ['Pembayaran Kas untuk beban operasi', '', '', ''],
      ['Pembayaran kas untuk Pajak Penghasilan', '', '', ''],
      ['Jumlah arus kas dari aktivitas operasi', '', 'Rp', rpFmt(ak.arusOperasi)],
      ['', '', '', ''],
      ['', '', '', ''],
      ['ARUS KAS DARI AKTIVITAS INVESTASI', '', '', ''],
      ['Kas dari penjualan aktiva tetap', '', '', ''],
      ['Dikurangi :', '', '', ''],
      ['Kas dibayar untuk pembelian aktiva tetap', '', '', ''],
      ['Jumlah arus kas untuk aktivitas investasi', '', 'Rp', rpFmt(ak.arusInvestasi)],
      ['', '', '', ''],
      ['', '', '', ''],
      ['ARUS KAS DARI AKTIVITAS PENDANAAN', '', '', ''],
      ['Kas diterima dari penjualan saham', '', '', ''],
      ['Kas diterima dari penjualan investasi', '', '', ''],
      ['Dikurangi:', '', '', ''],
      ['Kas dibayar untuk dividen', '', '', ''],
      ['Kas dibayar untuk bunga', '', '', ''],
      ['Kas dibayar untuk pelunasan hutang jangka panjang', '', '', ''],
      ['Jumlah arus kas dari aktivitas pendanaan', '', 'Rp', rpFmt(ak.arusPendanaan)],
      ['', '', '', ''],
      ['Kenaikan (Penurunan) kas', '', '', ''],
      ['Kas pada awal periode', '', '', ''],
      ['Kas pada akhir periode', '', '', ''],
    ];

    ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 48 }, { wch: 5 }, { wch: 5 }, { wch: 15 }];
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
      { s: { r: 2, c: 1 }, e: { r: 2, c: 3 } },
    ];
  }

  XLSX.utils.book_append_sheet(wb, ws, tabNames[tab]);

  const filename = `Laporan_${tabNames[tab]}_KOPMAS_Asem_Kembar.xlsx`;
  XLSX.writeFile(wb, filename);
  showToast('Excel berhasil diunduh!', 'success');
}
