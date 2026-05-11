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

/* --- Excel Download (Styled HTML) --- */
function downloadReportExcel() {
  const period = { month: window._reportMonth !== undefined ? window._reportMonth : 'all', year: window._reportYear || new Date().getFullYear() };
  const data = DataStore.generateReportData(period);
  const periodLabel = getReportPeriodLabel(data.period);
  const tab = window._reportTab || 'laba-rugi';
  const tabNames = { 'laba-rugi': 'Laba_Rugi', 'posisi': 'Neraca_Saldo', 'ekuitas': 'Perubahan_Ekuitas', 'arus-kas': 'Arus_Kas' };

  const lr = data.labaRugi, pk = data.posisiKeuangan, pe = data.perubahanEkuitas, ak = data.arusKas;
  const rpFmt = (v) => v === 0 || !v ? '-' : 'Rp ' + Math.abs(v).toLocaleString('id-ID');

  const H1 = 'background:#4a7c59;color:#fff;font-weight:bold;text-align:center;font-size:13pt;border:1px solid #2d5a3a;padding:6px;';
  const H2 = 'background:#5d9a6e;color:#fff;font-weight:bold;text-align:center;font-size:11pt;border:1px solid #2d5a3a;padding:5px;';
  const H3 = 'background:#7ab88a;color:#1a3d2a;font-weight:bold;text-align:center;font-size:10pt;border:1px solid #2d5a3a;padding:4px;';
  const ST = 'background:#e8f0e3;font-weight:bold;border:1px solid #b5c9a8;padding:4px;font-size:10pt;';
  const RW = 'border:1px solid #c5d4bc;padding:4px;font-size:10pt;';
  const SB = 'background:#fff3cd;font-weight:bold;border:1px solid #c9b458;padding:4px;font-size:10pt;';
  const GT = 'background:#f5c842;font-weight:bold;border:1px solid #c9a020;padding:4px;font-size:10pt;';
  const CH = 'background:#f0e68c;font-weight:bold;text-align:center;border:1px solid #c9b458;padding:4px;font-size:10pt;';
  const AR = 'text-align:right;';
  const AC = 'text-align:center;';

  let tbl = '';

  if (tab === 'laba-rugi') {
    tbl = `
      <tr><td style="${H1}" colspan="4">KOPMAS ASEM KEMBAR</td></tr>
      <tr><td style="${H2}" colspan="4">LAPORAN LABA/RUGI</td></tr>
      <tr><td style="${H3}" colspan="4">PERIODE ${periodLabel.toUpperCase()}</td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${ST}" colspan="2">Pendapatan</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Penjualan</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Retur dan Potongan Penjualan</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Diskon Penjualan</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}"></td><td style="${SB}${AC}">Rp</td><td style="${SB}${AR}">${rpFmt(lr.totalPendapatan)}</td></tr>
      <tr><td style="${SB}"></td><td style="${SB}">Penjualan bersih</td><td style="${SB}${AC}">Rp</td><td style="${SB}${AR}">${rpFmt(lr.totalPendapatan)}</td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Harga Pokok Penjualan</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${SB}"></td><td style="${SB}">Laba kotor</td><td style="${SB}${AC}">Rp</td><td style="${SB}${AR}">${rpFmt(lr.labaKotor)}</td></tr>
      <tr><td style="${ST}" colspan="2">BEBAN-BEBAN</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Beban Gaji Pegawai</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Beban Penjualan Lain-lain</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Beban Sewa</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Biaya Administrasi Lain-lain</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Beban Perlengkapan</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}"></td><td style="${RW}">Beban Penyusutan Peralatan</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${SB}"></td><td style="${SB}">Total Beban</td><td style="${SB}${AC}">Rp</td><td style="${SB}${AR}">${rpFmt(lr.bebanOperasional + lr.hpp)}</td></tr>
      <tr><td style="${GT}"></td><td style="${GT}">LABA BERSIH</td><td style="${GT}${AC}">Rp</td><td style="${GT}${AR}">${rpFmt(lr.labaBersih)}</td></tr>`;

  } else if (tab === 'posisi') {
    const akun = [
      ['Kas', rpFmt(pk.kasBank), ''], ['Piutang', rpFmt(pk.piutang), ''],
      ['Perlengkapan', '', ''], ['Peralatan', rpFmt(pk.asetTetap), ''],
      ['Hutang', '', rpFmt(pk.kewajibanLancar)], ['Pendapatan Diterima Dimuka', '', ''],
      ['Ekuitas', '', rpFmt(pk.ekuitas)], ['Pendapatan', '', rpFmt(lr.totalPendapatan)],
      ['Beban Gaji', '', ''], ['Beban Asuransi', '', ''],
      ['Beban Asuransi Properti Dan Kecelakaan', '', ''], ['Beban Sewa', '', ''],
    ];
    let aRows = akun.map(a =>
      `<tr><td style="${RW}"></td><td style="${RW}" colspan="2">${a[0]}</td><td style="${RW}${AR}">${a[1]}</td><td style="${RW}${AR}">${a[2]}</td></tr>`
    ).join('');
    tbl = `
      <tr><td style="${H1}" colspan="5">KOPMAS ASEM KEMBAR</td></tr>
      <tr><td style="${H2}" colspan="5">NERACA SALDO</td></tr>
      <tr><td style="${H3}" colspan="5">PERIODE ${periodLabel.toUpperCase()}</td></tr>
      <tr><td style="${RW}" colspan="5"></td></tr>
      <tr><td style="${CH}">No.</td><td style="${CH}" colspan="2">Nama Akun</td><td style="${CH}">Debit</td><td style="${CH}">Kredit</td></tr>
      ${aRows}
      <tr><td style="${GT}"></td><td style="${GT}" colspan="2">JUMLAH</td><td style="${GT}${AC}">Rp    -</td><td style="${GT}${AC}">Rp    -</td></tr>`;

  } else if (tab === 'ekuitas') {
    tbl = `
      <tr><td style="${H1}" colspan="4">KOPMAS ASEM KEMBAR</td></tr>
      <tr><td style="${H2}" colspan="4">LAPORAN PERUBAHAN EKUITAS</td></tr>
      <tr><td style="${H3}" colspan="4">PERIODE ${periodLabel.toUpperCase()}</td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${ST}" colspan="2">Ekuitas Awal</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Laba bersih</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${SB}"></td><td style="${SB}"></td><td style="${SB}${AC}">Rp</td><td style="${SB}${AR}">${rpFmt(pe.labaBersih)}</td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${RW}" colspan="2">Prive</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${GT}" colspan="2">Ekuitas Akhir</td><td style="${GT}${AC}">Rp</td><td style="${GT}${AR}">${rpFmt(pe.modalAkhir)}</td></tr>`;

  } else {
    tbl = `
      <tr><td style="${H1}" colspan="4">KOPMAS ASEM KEMBAR</td></tr>
      <tr><td style="${H2}" colspan="4">LAPORAN ARUS KAS</td></tr>
      <tr><td style="${H3}" colspan="4">PERIODE ${periodLabel.toUpperCase()}</td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${ST}" colspan="2">ARUS KAS DARI AKTIVITAS OPERASI</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas diterima dari pelanggan</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Dikurangi:</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Pembayaran kas untuk supplier (Barang)</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Pembayaran Kas untuk beban operasi</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Pembayaran kas untuk Pajak Penghasilan</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${SB}" colspan="2">Jumlah arus kas dari aktivitas operasi</td><td style="${SB}${AC}">Rp</td><td style="${SB}${AR}">${rpFmt(ak.arusOperasi)}</td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${ST}" colspan="2">ARUS KAS DARI AKTIVITAS INVESTASI</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas dari penjualan aktiva tetap</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Dikurangi :</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas dibayar untuk pembelian aktiva tetap</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${SB}" colspan="2">Jumlah arus kas untuk aktivitas investasi</td><td style="${SB}${AC}">Rp</td><td style="${SB}${AR}">${rpFmt(ak.arusInvestasi)}</td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${ST}" colspan="2">ARUS KAS DARI AKTIVITAS PENDANAAN</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas diterima dari penjualan saham</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas diterima dari penjualan investasi</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Dikurangi:</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas dibayar untuk dividen</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas dibayar untuk bunga</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas dibayar untuk pelunasan hutang jangka panjang</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${SB}" colspan="2">Jumlah arus kas dari aktivitas pendanaan</td><td style="${SB}${AC}">Rp</td><td style="${SB}${AR}">${rpFmt(ak.arusPendanaan)}</td></tr>
      <tr><td style="${RW}" colspan="4"></td></tr>
      <tr><td style="${GT}" colspan="2">Kenaikan (Penurunan) kas</td><td style="${GT}"></td><td style="${GT}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas pada awal periode</td><td style="${RW}"></td><td style="${RW}"></td></tr>
      <tr><td style="${RW}" colspan="2">Kas pada akhir periode</td><td style="${RW}"></td><td style="${RW}"></td></tr>`;
  }

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>${tabNames[tab]}</x:Name>
<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
</head><body>
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Calibri,Arial,sans-serif;">
${tbl}
</table></body></html>`;

  // Synchronous Blob download — must be in same call stack as user click
  var blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Laporan_' + tabNames[tab] + '_KOPMAS_Asem_Kembar.xls';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Excel berhasil diunduh!', 'success');
}
