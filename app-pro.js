/**
 * KAMUS SHORTCODE PROMPT - MASTER APPLICATION LOGIC (PRO V4)
 * Architecture: Clean, modular, zero-dependency, ultra-fast.
 */

(function () {
  'use strict';

  // --- SELECTOR UTILITIES ---
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const norm = str => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // --- STATE MANAGEMENT ---
  const STATE = {
    view: 'feed', // 'feed' | 'motion' | 'explorer' | 'saved' | 'composer'
    theme: 'light',
    searchQuery: '',
    selectedSubject: 'produk atau subjek Anda',
    explorer: {
      media: '',
      family: '',
      codeClass: '',
      page: 1,
      perPage: 24
    },
    savedGroups: new Set(JSON.parse(localStorage.getItem('pv4-saved-groups') || '[]')),
    savedCodes: new Set(JSON.parse(localStorage.getItem('pv4-saved-codes') || '[]')),
    composerCodes: new Set(JSON.parse(localStorage.getItem('pv4-composer-codes') || '[]')),
    activeGroup: null,
    activeShortIndex: 0
  };

  // --- DATASET & INDEXING ---
  const DATA = window.PROMPT_DATA || [];
  const CODE_INDEX = new Map();

  DATA.forEach(entry => {
    [entry.code, entry.source_code, entry.title, entry.display_name, ...(entry.aliases || [])].forEach(val => {
      if (val) CODE_INDEX.set(norm(val), entry);
    });
  });

  const findEntry = code => {
    return CODE_INDEX.get(norm(code)) || 
      DATA.find(x => norm(x.code).includes(norm(code)) || norm(x.title).includes(norm(code)));
  };

  // --- 41 VISUAL GROUPS DEFINITIONS ---
  const BASE_GROUPS = [
    { id: 'reveal', title: 'Reveal & Unveiling', desc: 'Cara kreatif menampilkan produk melalui asap, cairan, partikel, cahaya, dan material.', img: 'assets/groups/reveal.jpg', collection: 'Product Ads · Part 1', codes: ['smoke reveal','liquid reveal','particle reveal','ice break reveal','flower bloom reveal','fabric reveal','sand reveal','shadow reveal','portal reveal','light sweep reveal'] },
    { id: 'cgi-3d', title: 'CGI & 3D Billboard', desc: 'Produk dalam adegan tiga dimensi, billboard anamorphic, hologram, chrome, dan orbit.', img: 'assets/groups/cgi-3d.jpg', collection: 'Product Ads · Part 1', codes: ['3D billboard','floating product','exploded view','parts assembly','360 orbit','hologram product','glass sculpture','chrome world','product cube','neon 3D ad'] },
    { id: 'miniature', title: 'Miniature World', desc: 'Dunia mikroskopis dengan pekerja mini dan produk berskala raksasa sebagai pusat adegan.', img: 'assets/groups/miniature.jpg', collection: 'Product Ads · Part 1', codes: ['miniature factory','tiny workers','miniature kitchen','tiny delivery crew','miniature construction','miniature lab','tiny farmers','miniature city','tiny workers cleaning','miniature garden'] },
    { id: 'ugc-social', title: 'UGC & Creator Social', desc: 'Gaya video autentik kreator smartphone: unboxing, reaksi, ulasan jujur, dan rutinitas.', img: 'assets/groups/ugc-social.jpg', collection: 'Product Ads · Part 1', codes: ['UGC unboxing','UGC reaction','UGC before after','UGC product test','UGC morning routine','UGC get ready','UGC honest review','UGC viral hook','UGC lifestyle','UGC problem solution'] },
    { id: 'pov-hand', title: 'POV & Hand Interaction', desc: 'Interaksi tangan orang pertama (POV) untuk demonstrasi sentuhan dan pemakaian produk.', img: 'assets/groups/pov-hand.jpg', collection: 'Product Ads · Part 1', codes: ['POV unboxing','POV product grab','POV product test','POV package opening','POV beauty routine','POV drink pour','POV first person','hand interaction','hand swipe transition','hand catch product'] },
    { id: 'transformation', title: 'Object Transformation', desc: 'Transformasi mulus bahan mentah, kemasan, cairan, dan sketsa menjadi produk akhir.', img: 'assets/groups/transformation.jpg', collection: 'Product Ads · Part 2', codes: ['product transformation','object product morph','ingredient product morph','package transformation','liquid product morph','flower product morph','fabric product morph','particle product assembly','sketch to product','raw to luxury'] },
    { id: 'giant-product', title: 'Giant Public Product', desc: 'Instalasi produk raksasa di ruang publik, rooftop gedung, pantai, dan jalanan kota.', img: 'assets/groups/giant-product.jpg', collection: 'Product Ads · Part 2', codes: ['giant product city','product city takeover','giant rooftop product','giant street product','giant beach product','giant floating product','product billboard escape','building product transformation','giant vending machine','product landmark takeover'] },
    { id: 'luxury-beauty', title: 'Luxury & High Beauty', desc: 'Visual estetik mewah parfum, kosmetik, perhiasan emas, sutra mengalir, dan panggung runway.', img: 'assets/groups/luxury-beauty.jpg', collection: 'Product Ads · Part 2', codes: ['luxury pedestal reveal','silk product reveal','gold dust reveal','crystal product world','perfume mist reveal','mirror product world','beauty macro cinematic','luxury water reflection','jewelry sparkle reveal','runway product reveal'] },
    { id: 'food-beverage', title: 'Food & Beverage Splash', desc: 'Ledakan bahan segar, cipratan cairan (splash), pusaran vortex, dan macro appetizing.', img: 'assets/groups/food-beverage.jpg', collection: 'Product Ads · Part 2', codes: ['ingredient explosion','floating ingredients','ingredient assembly','splash product reveal','drink vortex','ice cube explosion','coffee bean storm','fruit burst ad','food macro journey','package to ingredients'] },
    { id: 'surreal-viral', title: 'Surreal & Viral Effects', desc: 'Visual surealis viral: portal dimensi, teleportasi, gravitasi nol, dan ilusi visual memukau.', img: 'assets/groups/surreal-viral.jpg', collection: 'Product Ads · Part 2', codes: ['impossible product world','product portal journey','gravity product ad','product teleportation','infinite product tunnel','product world transition','product dimension break','surreal scale shift','product reality glitch','cinematic product loop'] }
  ];

  const GENERATED_SPECS = [
    ['editorial-portrait','Editorial & Portrait','Editorial & Portrait Fashion','Portrait editorial bergaya majalah fashion kelas atas dengan pencahayaan studio terarah.'],
    ['cinematic-scene','Cinematic Style & Scene','Sinematik & Suasana Film','Komposisi adegan film, tata cahaya dramatis, atmosfer mood mendalam, dan lensa sinematik.'],
    ['advertising-ooh','Advertising & OOH','Periklanan OOH & Billboard','Aktivasi kampanye luar ruang, videotron kota, papan reklame LED raksasa, dan media iklan besar.'],
    ['product-anatomy','Product Anatomy & Technical','Anatomi & Cutaway Produk','Lapisan internal, visual exploded view teknis, material presisi, dan perakitan komponen.'],
    ['typography-motion','Typography & Motion Graphics','Tipografi & Motion Graphics','Desain huruf dinamis, monogram gerak, judul sinematik, serta elemen grafis kinetik.'],
    ['looping-continuity','Looping & Temporal Continuity','Gerakan Looping Sempurna','Kontinuitas temporal awal dan akhir yang menyatu mulus untuk video animasi tanpa jeda.'],
    ['chroma-overlay','Chroma Key & Overlay','Chroma Key & Compositing','Subjek latar hijau/biru bersih siap olah compositing, live action layer, dan integrasi VFX.'],
    ['led-videotron','LED / Videotron','Panggung LED & Videotron','Visual dinamis layar panggung konser, backdrop videotron resolusi tinggi, dan visual ambience.'],
    ['reference-editing','Reference Editing','Editing Berbasis Referensi','Teknik modifikasi gambar dengan mempertahankan identitas wajah, geometri produk, dan warna utama.'],
    ['selective-animation','Selective Animation','Animasi Gerak Selektif','Teknik menggerakkan elemen spesifik (asap/air/kain) sementara subjek utama tetap terkunci diam.'],
    ['storyboard-continuity','Storyboard & Scene Continuity','Storyboard & Urutan Adegan','Rangkaian multi-shot cerita sinematik dengan kesinambungan karakter, pencahayaan, dan latar.'],
    ['production-safety','Production Safety & Constraints','Keamanan Produksi & Batasan','Parameter batas kontrol untuk mencegah distorsi wajah, cacat anatomi, dan menjaga stabilitas AI.'],
    ['news-editorial','News & Editorial Content','Berita & Editorial Redaksional','Penyajian visual jurnalisme, studio siaran berita, teks headline, dan siaran live.'],
    ['radio-podcast-social','Radio / Podcast / Social Content','Podcast & Format Sosial','Visual studio podcast berkualitas tinggi, dialog mic broadcast, dan konten sosial interaktif.'],
    ['bumper-opening','Bumper & Opening','Bumper & Opening Logo','Animasi bumper pembuka siaran, reveal logo dramatis, dan transisi stasiun TV/kanal.'],
    ['output-composition','Output & Composition','Komposisi & Rasio Aspek','Panduan framing, safe area media sosial, rasio aspek 16:9/9:16/4:5, dan harmoni komposisi.']
  ];

  const REFERENCE_SPECS = [
    ['ref-product-layers',0,'Product Layer Codes','productlayer','Panduan struktur material, cutaway produk, lapisan internal, formula, dan komponen manufaktur.'],
    ['ref-movie-posters',1,'Movie Poster Codes','movieposter','Grammar visual poster film komersial: genre bioskop, karakter utama, tone warna, dan judul dramatis.'],
    ['ref-physical-actions',2,'Physical Action Codes','physicalaction','Kumpulan instruksi gerak fisik nyata: merakit, membuka, melipat, menuang, dan interaksi kinetik.'],
    ['ref-product-150',3,'150 Product Shortcuts','150product','Kompilasi komprehensif 150 teknik fotografi & promosi produk komersial kelas studio.'],
    ['ref-creative-pov',4,'Creative POV Codes','50creativepov','Sudut pandang orang pertama imersif, interaksi tangan, serta sensasi visual pengguna langsung.'],
    ['ref-master-list',5,'Master List 101–200','masterlist','Daftar induk lanjutan shortcode multimodal lintas gaya visual untuk eksplorasi kreatif mendalam.'],
    ['ref-layered-image',6,'Layered Image Codes','100layered','Teknik double exposure visual, potret komposit transparan, bayangan reflektif, dan perpaduan tekstur.'],
    ['ref-premium-product',7,'Premium Product Codes','100premium','Standar visual komersial produk mewah dengan tata panggung eksklusif dan lighting kristal.'],
    ['ref-surreal-world',8,'Surreal World Codes','100surreal','Transformasi surealis berskala masif: lanskap melayang, anomali gravitasi, dan dunia imajinatif.'],
    ['ref-product-ads-1',9,'Product Ads · Part 1','100aivideopromptcodesforproductads','Bagian 1 formula iklan produk: Reveal, efek 3D CGI, dunia miniatur, UGC kreator, dan POV demo.',0,50],
    ['ref-product-ads-2',10,'Product Ads · Part 2','100aivideopromptcodesforproductads','Bagian 2 formula iklan produk: Morfogenesis transformasi, produk raksasa, kemewahan, dan efek viral.',50,100],
    ['ref-cinematic-frames',11,'Cinematic Movie Frames','cinematicmovieframe','Kaidah sinematografi layar lebar: staging adegan, tata cahaya filmik, pemilihan lensa, dan mood naratif.'],
    ['ref-camera-angles',12,'Creative Camera Angles','cameraangles','Sudut penempatan kamera sinematik: low angle heroik, bird eye view, over-the-shoulder, dan Dutch tilt.'],
    ['ref-camera-movement',13,'120 Camera Movements','120cameramovement','120 manuver gerakan kamera: dolly in/out, pan, tilt, orbital tracking, drone sweep, dan kamera genggam dinamis.'],
    ['ref-extreme-zoom',14,'Extreme Zoom-In Codes','extremezoom','Teknik perjalanan kamera berkelanjutan dari sudut pandang luas (wide) menembus detail mikroskopis produk.']
  ];

  const GROUPS = [...BASE_GROUPS];

  GENERATED_SPECS.forEach(([id, family, title, desc]) => {
    const entries = DATA.filter(e => e.family === family);
    GROUPS.push({
      id,
      title,
      desc,
      img: `assets/groups/${id}.jpg`,
      collection: 'Koleksi AI · ' + family,
      family,
      codes: entries.map(e => e.display_name || e.title || e.code.replace(/^\//, ''))
    });
  });

  REFERENCE_SPECS.forEach(([id, ref, title, key, desc, from, to]) => {
    let entries = DATA.filter(e => norm(e.collection).includes(key));
    if (from !== undefined) entries = entries.slice(from, to);
    GROUPS.push({
      id,
      title,
      desc,
      img: `assets/references/ref-${ref}.jpg`,
      collection: 'Referensi Asli · ' + title,
      kind: 'reference',
      codes: entries.map(e => e.display_name || e.title || e.code.replace(/^\//, '')),
      sourceRef: ref
    });
  });

  // Urutkan grup: karya visual sinematik & studio di urutan depan untuk visual first impression terbaik
  GROUPS.sort((a, b) => Number(a.kind === 'reference') - Number(b.kind === 'reference'));

  // --- HELPER FUNCTIONS ---
  function groupEntries(g) {
    return g.family ? DATA.filter(e => e.family === g.family) : g.codes.map(findEntry).filter(Boolean);
  }

  // Filter cerdas untuk kelompok Video & Motion AI
  const MOTION_SPECIFIC_IDS = new Set([
    'ref-camera-movement',
    'ref-camera-angles',
    'ref-extreme-zoom',
    'ref-physical-actions',
    'ref-product-ads-1',
    'ref-product-ads-2',
    'ref-cinematic-frames',
    'looping-continuity',
    'selective-animation',
    'storyboard-continuity',
    'bumper-opening',
    'reveal',
    'transformation',
    'cgi-3d',
    'ugc-social',
    'pov-hand',
    'food-beverage',
    'surreal-viral'
  ]);

  function isMotionGroup(g) {
    if (MOTION_SPECIFIC_IDS.has(g.id)) return true;
    const es = groupEntries(g);
    if (!es.length) return false;
    const motionCount = es.filter(e => e.media === 'Video' || e.media === 'Hybrid').length;
    return (motionCount / es.length) >= 0.35;
  }

  function getCleanPrompt(code, customSubject) {
    const entry = findEntry(code);
    const sub = customSubject || STATE.selectedSubject || 'produk atau subjek Anda';
    if (entry && entry.expanded_prompt) {
      return entry.expanded_prompt.replace(/\{subject\}/g, sub);
    }
    return `Create a professional commercial visual of ${sub} featuring /${String(code).replaceAll(' ', '')}. High fidelity lighting, sharp focus, clean composition.`;
  }

  function toast(message) {
    let el = $('#toastNotice');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toastNotice';
      el.className = 'toast-notice';
      document.body.appendChild(el);
    }
    el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>${message}</span>`;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast(successMsg || 'Berhasil disalin!'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast(successMsg || 'Berhasil disalin!');
    }
  }

  // --- THEME SWITCHER ---
  function applyTheme(theme) {
    STATE.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pv-theme', theme);
    const themeIcon = $('#themeIcon');
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'dark'
        ? '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>'
        : '<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.03 9.03 0 008.354-5.646z"/>';
    }
  }

  // --- RENDER HIGHLIGHT STORIES ---
  function renderStories() {
    const el = $('#storiesCarousel');
    if (!el) return;
    el.innerHTML = GROUPS.map(g => {
      return `
        <button class="story-item" data-id="${g.id}" aria-label="Buka kelompok ${g.title}">
          <div class="story-ring">
            <img class="story-thumb" src="${g.img}" alt="${g.title}" loading="lazy">
          </div>
          <span class="story-title">${g.title}</span>
        </button>
      `;
    }).join('');

    $$('.story-item').forEach(btn => {
      btn.onclick = () => openModalGroup(btn.dataset.id);
    });
  }

  // --- RENDER VISUAL FEED (POSTINGAN / VIDEO & MOTION / SAVED) ---
  function renderFeed() {
    const feed = $('#feedGrid');
    if (!feed) return;

    let list = GROUPS;

    if (STATE.view === 'saved') {
      list = list.filter(g => STATE.savedGroups.has(g.id));
    } else if (STATE.view === 'motion' || STATE.view === 'reels') {
      list = list.filter(isMotionGroup);
    }

    if (STATE.searchQuery) {
      const q = norm(STATE.searchQuery);
      list = list.filter(g => norm(g.title + ' ' + g.desc + ' ' + g.codes.join(' ')).includes(q));
    }

    // Update stats header
    if ($('#groupCount')) $('#groupCount').textContent = GROUPS.length;
    if ($('#codeCount')) $('#codeCount').textContent = DATA.length.toLocaleString('id-ID');
    if ($('#savedCount')) $('#savedCount').textContent = STATE.savedGroups.size;
    if ($('#savedNavBadge')) $('#savedNavBadge').textContent = STATE.savedGroups.size;

    if (!list.length) {
      feed.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-lg);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 17px; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Tidak ada kelompok ditemukan</h3>
          <p style="font-size: 13px; color: var(--text-muted);">Coba gunakan kata kunci lain atau bersihkan filter pencarian Anda.</p>
        </div>
      `;
      return;
    }

    feed.innerHTML = list.map(g => {
      const entries = groupEntries(g);
      const isMotion = isMotionGroup(g);
      const mediaTypes = [...new Set(entries.map(e => e.media))].slice(0, 3).join(' · ') || (isMotion ? 'Video' : 'Gambar');
      const label = g.kind === 'reference' ? 'Cheat Sheet' : isMotion ? 'Video & Motion' : 'Koleksi Visual';

      // Ambil 3 contoh shortcode unggulan untuk kartu yang informatif & menarik
      const sampleCodes = g.codes.slice(0, 3).map(c => '/' + String(c).replaceAll(' ', ''));

      return `
        <article class="group-post-card" data-id="${g.id}">
          <div class="group-card-media">
            <img class="group-card-img" src="${g.img}" alt="${g.title}" loading="lazy">
          </div>
          <div class="card-body">
            <div class="card-meta-row">
              <span class="card-pill-tag ${isMotion ? 'motion' : g.kind === 'reference' ? 'ref' : ''}">${label}</span>
              <span class="card-pill-count">${g.codes.length} Shortcode</span>
            </div>
            <h3 class="card-title">${g.title}</h3>
            <p class="card-desc">${g.desc}</p>
            
            <!-- Cuplikan Shortcode Informatif -->
            <div class="card-samples-row" title="Contoh shortcode dalam kelompok ini">
              ${sampleCodes.map(code => `<span class="card-code-chip">${code}</span>`).join('')}
              ${g.codes.length > 3 ? `<span class="card-code-chip more">+${g.codes.length - 3}</span>` : ''}
            </div>

            <div class="card-footer">
              <span class="card-media-label">${mediaTypes}</span>
              <span class="card-action-hint">Lihat Prompt &rarr;</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    $$('.group-post-card').forEach(card => {
      card.onclick = () => openModalGroup(card.dataset.id);
    });
  }

  // --- RENDER GRANULAR EXPLORER (1322 ALL SHORTCODES) ---
  function renderExplorer() {
    const grid = $('#explorerGrid');
    const pager = $('#explorerPager');
    if (!grid) return;

    let items = DATA;

    // Filter media
    if (STATE.explorer.media) {
      items = items.filter(e => e.media === STATE.explorer.media);
    }
    // Filter family
    if (STATE.explorer.family) {
      items = items.filter(e => e.family === STATE.explorer.family);
    }
    // Filter code class
    if (STATE.explorer.codeClass) {
      items = items.filter(e => e.code_class === STATE.explorer.codeClass);
    }
    // Filter search text
    if (STATE.searchQuery) {
      const q = norm(STATE.searchQuery);
      items = items.filter(e => norm(e.code + ' ' + e.title + ' ' + e.description + ' ' + e.category).includes(q));
    }

    const totalPages = Math.max(1, Math.ceil(items.length / STATE.explorer.perPage));
    if (STATE.explorer.page > totalPages) STATE.explorer.page = totalPages;

    const start = (STATE.explorer.page - 1) * STATE.explorer.perPage;
    const pageItems = items.slice(start, start + STATE.explorer.perPage);

    $('#explorerTotalBadge').textContent = `${items.length.toLocaleString('id-ID')} Shortcode`;

    if (!pageItems.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📄</div>
          <h3>Tidak ada shortcode yang cocok</h3>
          <p>Sesuaikan filter atau bersihkan kata kunci pencarian Anda.</p>
        </div>
      `;
      pager.innerHTML = '';
      return;
    }

    grid.innerHTML = pageItems.map(item => {
      const isSaved = STATE.savedCodes.has(item.id);
      return `
        <div class="code-card" data-code-id="${item.id}">
          <div class="code-card-header">
            <span class="code-badge">${item.code}</span>
            <span class="media-chip ${item.media.toLowerCase()}">${item.media}</span>
          </div>
          <p class="code-card-desc">${item.description}</p>
          <div class="code-card-footer">
            <span>${item.family}</span>
            <button class="btn-fav" data-fav-id="${item.id}" title="Simpan ke favorit">
              ${isSaved ? '★' : '☆'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    $$('.code-card').forEach(card => {
      card.onclick = e => {
        if (e.target.closest('.btn-fav')) return;
        const id = +card.dataset.codeId;
        const entry = DATA.find(x => x.id === id);
        if (entry) {
          copyToClipboard(getCleanPrompt(entry.code), `Prompt untuk ${entry.code} disalin!`);
        }
      };
    });

    $$('.btn-fav').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const id = +btn.dataset.favId;
        if (STATE.savedCodes.has(id)) {
          STATE.savedCodes.delete(id);
          toast('Dihapus dari favorit');
        } else {
          STATE.savedCodes.add(id);
          toast('Ditambahkan ke favorit');
        }
        localStorage.setItem('pv4-saved-codes', JSON.stringify([...STATE.savedCodes]));
        renderExplorer();
      };
    });

    // Pager rendering
    let pagerHtml = `
      <button class="page-btn" ${STATE.explorer.page <= 1 ? 'disabled' : ''} id="prevPage">‹</button>
      <span style="font-size:13px;font-weight:700;color:var(--text-muted);padding:0 8px;">
        ${STATE.explorer.page} / ${totalPages}
      </span>
      <button class="page-btn" ${STATE.explorer.page >= totalPages ? 'disabled' : ''} id="nextPage">›</button>
    `;
    pager.innerHTML = pagerHtml;

    $('#prevPage')?.addEventListener('click', () => {
      if (STATE.explorer.page > 1) {
        STATE.explorer.page--;
        renderExplorer();
      }
    });

    $('#nextPage')?.addEventListener('click', () => {
      if (STATE.explorer.page < totalPages) {
        STATE.explorer.page++;
        renderExplorer();
      }
    });
  }

  // --- RENDER PROMPT STUDIO (COMPOSER) ---
  const COMPOSER_PRESETS = {
    product: { subject: 'Premium product, commercial advertising visual', mode: 'image', ratio: '4:5', lighting: 'clean commercial studio highlights, high-end reflection control', constraints: 'preserve exact geometry and logo; clean readable frame' },
    wedding: { subject: 'Elegant romantic wedding couple portrait', mode: 'video', ratio: '16:9', lighting: 'golden volumetric warm sunset glow, soft romantic haze', constraints: 'freeze faces and clothing; animate only particles and veil' },
    food: { subject: 'Appetizing gourmet burger with melting cheese', mode: 'video', ratio: '9:16', lighting: 'glossy appetizing commercial lighting, crisp condensation droplets', constraints: 'realistic ingredients texture; no distorted anatomy' },
    fashion: { subject: 'Haute couture editorial model', mode: 'image', ratio: '4:5', lighting: 'dramatic high contrast fashion lighting, studio cyclorama', constraints: 'preserve facial features, clothing fabric fidelity' },
    ugc: { subject: 'Genuine creator unboxing and reviewing product', mode: 'video', ratio: '9:16', lighting: 'natural room window daylight, smartphone POV realism', constraints: 'natural hand movements; readable labels' }
  };

  function renderComposer() {
    const listEl = $('#composerSelectedTags');
    const outEl = $('#composerOutput');
    if (!listEl || !outEl) return;

    const chosenEntries = [...STATE.composerCodes].map(code => findEntry(code)).filter(Boolean);

    if (!chosenEntries.length) {
      listEl.innerHTML = '<span style="color:var(--text-dim);font-size:12px;">Belum ada shortcode. Klik "+ Tambahkan ke Composer" pada detail kelompok atau pilih preset.</span>';
    } else {
      listEl.innerHTML = chosenEntries.map(e => `
        <span class="selected-tag">
          ${e.code}
          <span class="selected-tag-remove" data-remove="${e.code}">×</span>
        </span>
      `).join('');

      $$('.selected-tag-remove').forEach(btn => {
        btn.onclick = () => {
          STATE.composerCodes.delete(btn.dataset.remove);
          localStorage.setItem('pv4-composer-codes', JSON.stringify([...STATE.composerCodes]));
          renderComposer();
        };
      });
    }

    const sub = $('#composerSubject')?.value.trim() || 'produk Anda';
    const mode = $('#composerMode')?.value || 'image';
    const ratio = $('#composerRatio')?.value || '16:9';
    const dur = $('#composerDuration')?.value || '5 seconds';
    const light = $('#composerLighting')?.value.trim();
    const cons = $('#composerConstraints')?.value.trim();

    let lines = [];
    if (mode === 'video') {
      lines.push(`Create a ${dur} cinematic commercial video in ${ratio} ratio of ${sub}.`);
    } else {
      lines.push(`Create a high-resolution ${ratio} commercial still image of ${sub}.`);
    }

    if (chosenEntries.length) {
      lines.push('Visual execution & shortcodes directions:');
      chosenEntries.forEach(e => {
        lines.push(`- ${e.code}: ${e.description}`);
      });
    }

    if (light) lines.push(`Lighting & atmosphere: ${light}.`);
    if (cons) lines.push(`Production constraints: ${cons}.`);

    if (mode === 'video') {
      lines.push('Maintain temporal stability, coherent geometry, and finish on a clean hero shot.');
    }

    lines.push('Shortcode directives: ' + (chosenEntries.map(e => e.code).join(', ') || 'none'));

    outEl.value = lines.join('\n');
  }

  // --- MODAL DIALOG CONTROLLER ---
  function getGalleryImages(group) {
    const idx = GROUPS.indexOf(group);
    const pool = [group, ...GROUPS.slice(idx + 1), ...GROUPS.slice(0, idx)]
      .filter((g, i, arr) => g.img && arr.findIndex(x => x.img === g.img) === i);
    return pool.slice(0, 3);
  }

  function openModalGroup(groupId) {
    const group = GROUPS.find(g => g.id === groupId);
    if (!group) return;

    STATE.activeGroup = group;
    STATE.activeShortIndex = 0;

    const gallery = getGalleryImages(group);
    const galleryEl = $('#modalGalleryGrid');
    if (galleryEl) {
      galleryEl.innerHTML = gallery.map((g, i) => `
        <figure class="gallery-shot" data-img="${g.img}" data-caption="${g.title} · ${g.collection}" title="Klik untuk memperbesar tampilan penuh">
          <img src="${g.img}" alt="${g.title}" loading="lazy">
          <span class="gallery-tag">${i === 0 ? 'Hasil Utama' : 'Inspirasi Terkait'}</span>
          <span class="gallery-zoom-hint">
            <svg style="width:12px;height:12px;" viewBox="0 0 24 24"><use href="#icon-zoom"/></svg>
            Perbesar
          </span>
          <figcaption class="gallery-caption">${i === 0 ? '/' + String(group.codes[0] || group.title).replaceAll(' ', '') : g.title}</figcaption>
        </figure>
      `).join('');

      $$('.gallery-shot').forEach(fig => {
        fig.onclick = () => openLightbox(fig.dataset.img, fig.dataset.caption);
      });
    }

    $('#modalGroupTitle').textContent = group.title;
    $('#modalGroupDesc').textContent = group.desc;
    $('#modalCollectionName').textContent = group.collection;
    $('#modalSubjectInput').value = STATE.selectedSubject;

    renderModalCodesList();

    const saveBtn = $('#modalSaveGroupBtn');
    if (saveBtn) {
      saveBtn.textContent = STATE.savedGroups.has(groupId) ? 'Tersimpan ✓' : 'Simpan Kelompok';
    }

    $('#modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderModalCodesList() {
    const group = STATE.activeGroup;
    if (!group) return;

    const listEl = $('#modalCodesList');
    if (!listEl) return;

    listEl.innerHTML = group.codes.map((code, idx) => {
      const entry = findEntry(code);
      const isSelected = idx === STATE.activeShortIndex;
      return `
        <button class="modal-code-item ${isSelected ? 'active' : ''}" data-idx="${idx}">
          <span class="modal-code-num">${String(idx + 1).padStart(2, '0')}</span>
          <div class="modal-code-main">
            <b>/${String(code).replaceAll(' ', '')}</b>
            <span>${entry?.description || group.desc}</span>
          </div>
          <span class="modal-code-chev">›</span>
        </button>
      `;
    }).join('');

    $$('.modal-code-item').forEach(item => {
      item.onclick = () => {
        STATE.activeShortIndex = +item.dataset.idx;
        showActiveShortDetail();
      };
    });

    showActiveShortDetail();
  }

  function showActiveShortDetail() {
    const group = STATE.activeGroup;
    if (!group) return;

    $$('.modal-code-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === STATE.activeShortIndex);
    });

    const code = group.codes[STATE.activeShortIndex];
    const entry = findEntry(code);
    const detailEl = $('#modalShortDetail');
    if (!detailEl) return;

    const sub = $('#modalSubjectInput')?.value.trim() || STATE.selectedSubject;
    const cleanPrompt = getCleanPrompt(code, sub);

    detailEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <h4 style="font-family:var(--font-mono);font-size:14.5px;color:#818cf8;margin:0;">
          /${String(code).replaceAll(' ', '')}
        </h4>
        <span class="media-chip ${entry?.media ? entry.media.toLowerCase() : 'image'}">${entry?.media || 'Visual'}</span>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin:0 0 6px;">
        ${entry?.example_result || entry?.description || group.desc}
      </p>
      <div class="detail-prompt-box">${cleanPrompt}</div>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="btn-action primary" id="modalCopyPromptBtn" style="height:32px;font-size:12px;">
          Salin Prompt Ini
        </button>
        <button class="btn-action" id="modalAddToComposerBtn" style="height:32px;font-size:12px;">
          + Tambahkan ke Composer
        </button>
      </div>
    `;

    detailEl.classList.add('open');

    $('#modalCopyPromptBtn').onclick = () => {
      copyToClipboard(cleanPrompt, 'Prompt siap pakai berhasil disalin!');
    };

    $('#modalAddToComposerBtn').onclick = () => {
      STATE.composerCodes.add(code);
      localStorage.setItem('pv4-composer-codes', JSON.stringify([...STATE.composerCodes]));
      toast(`/${String(code).replaceAll(' ', '')} ditambahkan ke Composer!`);
    };
  }

  function closeModal() {
    $('#modalOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- DEEP ZOOM & PAN LIGHTBOX CONTROLLER ---
  const LIGHTBOX_STATE = {
    zoom: 1,
    minZoom: 1,
    maxZoom: 4,
    step: 0.5,
    panX: 0,
    panY: 0,
    isPanning: false
  };

  function updateLightboxTransform() {
    const stage = $('#lightboxStage');
    const levelBadge = $('#lbZoomLevel');
    const viewport = $('#lightboxViewport');
    if (!stage) return;

    if (LIGHTBOX_STATE.zoom <= 1) {
      LIGHTBOX_STATE.zoom = 1;
      LIGHTBOX_STATE.panX = 0;
      LIGHTBOX_STATE.panY = 0;
      viewport?.classList.remove('is-zoomed', 'is-panning');
    } else {
      viewport?.classList.add('is-zoomed');
    }

    stage.style.transform = `translate(${LIGHTBOX_STATE.panX}px, ${LIGHTBOX_STATE.panY}px) scale(${LIGHTBOX_STATE.zoom})`;
    if (levelBadge) {
      levelBadge.textContent = `${Math.round(LIGHTBOX_STATE.zoom * 100)}%`;
    }
  }

  function setLightboxZoom(newZoom, centerX, centerY) {
    const prevZoom = LIGHTBOX_STATE.zoom;
    LIGHTBOX_STATE.zoom = Math.min(LIGHTBOX_STATE.maxZoom, Math.max(LIGHTBOX_STATE.minZoom, newZoom));
    
    if (LIGHTBOX_STATE.zoom === 1) {
      LIGHTBOX_STATE.panX = 0;
      LIGHTBOX_STATE.panY = 0;
    } else if (centerX !== undefined && centerY !== undefined) {
      const scaleChange = LIGHTBOX_STATE.zoom / prevZoom;
      LIGHTBOX_STATE.panX = centerX - (centerX - LIGHTBOX_STATE.panX) * scaleChange;
      LIGHTBOX_STATE.panY = centerY - (centerY - LIGHTBOX_STATE.panY) * scaleChange;
    }
    updateLightboxTransform();
  }

  function openLightbox(src, caption) {
    const overlay = $('#lightboxOverlay');
    const img = $('#lightboxImg');
    const cap = $('#lightboxCaption');
    if (!overlay || !img) return;

    // Reset zoom and pan
    LIGHTBOX_STATE.zoom = 1;
    LIGHTBOX_STATE.panX = 0;
    LIGHTBOX_STATE.panY = 0;
    updateLightboxTransform();

    img.src = src;
    if (cap) cap.textContent = caption || '';
    overlay.classList.add('open');
  }

  function closeLightbox() {
    const overlay = $('#lightboxOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    LIGHTBOX_STATE.zoom = 1;
    LIGHTBOX_STATE.panX = 0;
    LIGHTBOX_STATE.panY = 0;
    updateLightboxTransform();
  }

  // --- GLOBAL SWITCH VIEW ---
  function switchView(viewName) {
    STATE.view = viewName;

    $$('.nav-link').forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewName));
    $$('.view-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewName));
    $$('.bottom-nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewName));

    const feedSection = $('#feedSection');
    const explorerSection = $('#explorerSection');
    const composerSection = $('#composerSection');

    if (viewName === 'explorer') {
      feedSection.style.display = 'none';
      explorerSection.style.display = 'block';
      composerSection.style.display = 'none';
      renderExplorer();
    } else if (viewName === 'composer') {
      feedSection.style.display = 'none';
      explorerSection.style.display = 'none';
      composerSection.style.display = 'block';
      renderComposer();
    } else {
      feedSection.style.display = 'block';
      explorerSection.style.display = 'none';
      composerSection.style.display = 'none';
      renderFeed();
    }

    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --- SETUP EVENT LISTENERS ---
  function setupEvents() {
    // Navigasi View
    $$('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Theme Switcher
    $('#themeToggleBtn')?.addEventListener('click', () => {
      applyTheme(STATE.theme === 'dark' ? 'light' : 'dark');
    });

    // Search Input
    const searchInput = $('#globalSearchInput');
    const searchClear = $('#searchClearBtn');

    searchInput?.addEventListener('input', e => {
      STATE.searchQuery = e.target.value.trim();
      searchClear?.classList.toggle('show', STATE.searchQuery.length > 0);
      if (STATE.view === 'explorer') {
        STATE.explorer.page = 1;
        renderExplorer();
      } else {
        renderFeed();
      }
    });

    searchClear?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      STATE.searchQuery = '';
      searchClear.classList.remove('show');
      if (STATE.view === 'explorer') renderExplorer();
      else renderFeed();
      searchInput?.focus();
    });

    // Keyboard shortcut '/' untuk search & 'Escape' untuk tutup modal/lightbox
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        searchInput?.focus();
      } else if (e.key === 'Escape') {
        if ($('#lightboxOverlay')?.classList.contains('open')) {
          closeLightbox();
        } else {
          closeModal();
        }
      }
    });

    // Carousel Drag & Scroll
    const carousel = $('#storiesCarousel');
    if (carousel) {
      let isDown = false, startX = 0, scrollLeft = 0, hasMoved = false;

      carousel.addEventListener('pointerdown', e => {
        isDown = true;
        hasMoved = false;
        startX = e.clientX;
        scrollLeft = carousel.scrollLeft;
        carousel.setPointerCapture(e.pointerId);
        carousel.classList.add('dragging');
      });

      carousel.addEventListener('pointermove', e => {
        if (!isDown) return;
        const dist = e.clientX - startX;
        if (Math.abs(dist) > 5) hasMoved = true;
        carousel.scrollLeft = scrollLeft - dist;
      });

      carousel.addEventListener('pointerup', () => {
        isDown = false;
        carousel.classList.remove('dragging');
      });

      carousel.addEventListener('click', e => {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
          hasMoved = false;
        }
      }, true);

      $('#carouselPrev')?.addEventListener('click', () => carousel.scrollBy({ left: -380, behavior: 'smooth' }));
      $('#carouselNext')?.addEventListener('click', () => carousel.scrollBy({ left: 380, behavior: 'smooth' }));
    }

    // Modal Events
    $('#modalCloseBtn')?.addEventListener('click', closeModal);
    $('#modalOverlay')?.addEventListener('click', e => {
      if (e.target === $('#modalOverlay')) closeModal();
    });

    // Lightbox Deep Zoom & Pan Controls
    $('#lbZoomIn')?.addEventListener('click', e => {
      e.stopPropagation();
      setLightboxZoom(LIGHTBOX_STATE.zoom + LIGHTBOX_STATE.step);
    });

    $('#lbZoomOut')?.addEventListener('click', e => {
      e.stopPropagation();
      setLightboxZoom(LIGHTBOX_STATE.zoom - LIGHTBOX_STATE.step);
    });

    $('#lbZoomReset')?.addEventListener('click', e => {
      e.stopPropagation();
      setLightboxZoom(1);
    });

    $('#lightboxClose')?.addEventListener('click', closeLightbox);

    // Mouse Wheel Zoom di Viewport
    const lbViewport = $('#lightboxViewport');
    const lbStage = $('#lightboxStage');
    if (lbViewport) {
      lbViewport.addEventListener('wheel', e => {
        e.preventDefault();
        const rect = lbViewport.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;
        const delta = e.deltaY < 0 ? 0.35 : -0.35;
        setLightboxZoom(LIGHTBOX_STATE.zoom + delta, offsetX, offsetY);
      }, { passive: false });

      // Double Click to Toggle Zoom
      lbViewport.addEventListener('dblclick', e => {
        e.preventDefault();
        if (LIGHTBOX_STATE.zoom > 1) {
          setLightboxZoom(1);
        } else {
          const rect = lbViewport.getBoundingClientRect();
          const offsetX = e.clientX - rect.left - rect.width / 2;
          const offsetY = e.clientY - rect.top - rect.height / 2;
          setLightboxZoom(2.2, offsetX, offsetY);
        }
      });

      // Pointer Drag & Pan when zoomed
      let isPanning = false, startClientX = 0, startClientY = 0, initialPanX = 0, initialPanY = 0;

      lbViewport.addEventListener('pointerdown', e => {
        if (e.target.closest('.lb-tool-btn') || e.target.closest('.lightbox-close')) return;
        if (LIGHTBOX_STATE.zoom > 1) {
          isPanning = true;
          startClientX = e.clientX;
          startClientY = e.clientY;
          initialPanX = LIGHTBOX_STATE.panX;
          initialPanY = LIGHTBOX_STATE.panY;
          lbViewport.classList.add('is-panning');
          lbStage?.classList.add('dragging');
          lbViewport.setPointerCapture(e.pointerId);
        }
      });

      lbViewport.addEventListener('pointermove', e => {
        if (!isPanning) return;
        const dx = e.clientX - startClientX;
        const dy = e.clientY - startClientY;
        LIGHTBOX_STATE.panX = initialPanX + dx;
        LIGHTBOX_STATE.panY = initialPanY + dy;
        updateLightboxTransform();
      });

      const endPan = () => {
        if (isPanning) {
          isPanning = false;
          lbViewport.classList.remove('is-panning');
          lbStage?.classList.remove('dragging');
        }
      };

      lbViewport.addEventListener('pointerup', endPan);
      lbViewport.addEventListener('pointercancel', endPan);
    }

    // Modal Live Subject Replacer
    $('#modalSubjectInput')?.addEventListener('input', e => {
      STATE.selectedSubject = e.target.value.trim() || 'produk atau subjek Anda';
      showActiveShortDetail();
    });

    // Modal Save Group
    $('#modalSaveGroupBtn')?.addEventListener('click', () => {
      if (!STATE.activeGroup) return;
      const id = STATE.activeGroup.id;
      if (STATE.savedGroups.has(id)) {
        STATE.savedGroups.delete(id);
        toast('Kelompok dihapus dari simpanan');
        $('#modalSaveGroupBtn').textContent = 'Simpan Kelompok';
      } else {
        STATE.savedGroups.add(id);
        toast('Kelompok berhasil disimpan! ✓');
        $('#modalSaveGroupBtn').textContent = 'Tersimpan ✓';
      }
      localStorage.setItem('pv4-saved-groups', JSON.stringify([...STATE.savedGroups]));
      $('#savedCount').textContent = STATE.savedGroups.size;
      if (STATE.view === 'saved') renderFeed();
    });

    // Modal Copy All Codes
    $('#modalCopyAllBtn')?.addEventListener('click', () => {
      if (!STATE.activeGroup) return;
      const codesText = STATE.activeGroup.codes.map(c => '/' + String(c).replaceAll(' ', '')).join('\n');
      copyToClipboard(codesText, `${STATE.activeGroup.codes.length} shortcode berhasil disalin!`);
    });

    // Explorer Filters
    $('#explorerMediaSelect')?.addEventListener('change', e => {
      STATE.explorer.media = e.target.value;
      STATE.explorer.page = 1;
      renderExplorer();
    });

    $('#explorerFamilySelect')?.addEventListener('change', e => {
      STATE.explorer.family = e.target.value;
      STATE.explorer.page = 1;
      renderExplorer();
    });

    // Populate Family Filter Options
    const familySelect = $('#explorerFamilySelect');
    if (familySelect) {
      const families = [...new Set(DATA.map(e => e.family))].sort();
      families.forEach(fam => {
        const opt = document.createElement('option');
        opt.value = fam;
        opt.textContent = fam;
        familySelect.appendChild(opt);
      });
    }

    // Composer Input Handlers
    ['composerSubject', 'composerMode', 'composerRatio', 'composerDuration', 'composerLighting', 'composerConstraints']
      .forEach(id => {
        $('#' + id)?.addEventListener('input', renderComposer);
      });

    $('#composerPresetSelect')?.addEventListener('change', e => {
      const preset = COMPOSER_PRESETS[e.target.value];
      if (!preset) return;
      if ($('#composerSubject')) $('#composerSubject').value = preset.subject;
      if ($('#composerMode')) $('#composerMode').value = preset.mode;
      if ($('#composerRatio')) $('#composerRatio').value = preset.ratio;
      if ($('#composerLighting')) $('#composerLighting').value = preset.lighting;
      if ($('#composerConstraints')) $('#composerConstraints').value = preset.constraints;
      renderComposer();
    });

    $('#composerCopyBtn')?.addEventListener('click', () => {
      const output = $('#composerOutput')?.value;
      if (output) copyToClipboard(output, 'Prompt gabungan berhasil disalin!');
    });

    $('#composerClearBtn')?.addEventListener('click', () => {
      STATE.composerCodes.clear();
      localStorage.setItem('pv4-composer-codes', JSON.stringify([]));
      renderComposer();
      toast('Daftar shortcode dikosongkan');
    });

    // Profile Actions
    $('#btnExploreAll')?.addEventListener('click', () => switchView('explorer'));
    $('#btnComposePrompt')?.addEventListener('click', () => switchView('composer'));
  }

  // --- INITIALIZATION ---
  function init() {
    applyTheme(STATE.theme);
    renderStories();
    renderFeed();
    setupEvents();

    // Check URL params (?open=reveal)
    const openParam = new URLSearchParams(window.location.search).get('open');
    if (openParam) {
      setTimeout(() => openModalGroup(openParam), 100);
    }
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
