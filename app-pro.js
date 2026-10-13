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

  // --- SHORTCUT PROMPT LOGO (BRAND IDENTITY & LOGO STUDIO) ---
  const LOGO_SHORTCODES = [
    {
      id: 2001,
      code: '/logo',
      title: 'logo',
      display_name: 'logo',
      media: 'Image',
      category: 'Brand Identity',
      use_case: 'Logo concept & mark',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Buat konsep logo',
      example_prompt: '/logo /sport /bold /3d — YBS FUTSAL CLUB',
      example_result: 'Konsep logo profesional berbasis vektor tajam, siluet ikonik, dan identitas visual yang mudah diingat.',
      expanded_prompt: 'Create a distinct, high-impact professional logo design concept for {subject}. Clean vector aesthetic, balanced geometry, memorable iconic silhouette, versatile corporate brand identity on crisp white isolated background.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/logo', 'logo']
    },
    {
      id: 2002,
      code: '/brand',
      title: 'brand',
      display_name: 'brand',
      media: 'Image',
      category: 'Brand Identity',
      use_case: 'Corporate identity',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Buat logo berdasarkan identitas brand',
      example_prompt: '/logo /brand /minimal /modern — Tech Innovate',
      example_result: 'Logo yang mencerminkan nilai inti dan filosofi identitas merek dengan pedoman visual korporat.',
      expanded_prompt: 'Design a cohesive brand identity logo for {subject}. Deeply reflects brand values, core personality, modern corporate identity guidelines, scalable vector format, timeless brand signature.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/brand', 'brand']
    },
    {
      id: 2003,
      code: '/minimal',
      title: 'minimal',
      display_name: 'minimal',
      media: 'Image',
      category: 'Logo Style',
      use_case: 'Minimalist logo',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo minimalis',
      example_prompt: '/logo /premium /minimal /monogram — MDS STEEL',
      example_result: 'Logo minimalis dengan garis esensial murni, komposisi ruang negatif seimbang, dan bentuk sederhana abadi.',
      expanded_prompt: 'Minimalist clean logo design for {subject}. Refined geometric simplicity, essential lines, clever negative space balance, uncluttered, pure timeless modern minimalism on clean background.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/minimal', 'minimal']
    },
    {
      id: 2004,
      code: '/modern',
      title: 'modern',
      display_name: 'modern',
      media: 'Image',
      category: 'Logo Style',
      use_case: 'Modern contemporary logo',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo modern',
      example_prompt: '/logo /modern /icon — FinTech Next',
      example_result: 'Gaya logo kontemporer modern dengan harmoni geometris mutakhir dan karakter visual masa kini.',
      expanded_prompt: 'Ultra-modern contemporary logo mark for {subject}. Cutting-edge design language, sleek geometric harmony, forward-looking tech-forward aesthetic, crisp vector precision, sophisticated simplicity.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/modern', 'modern']
    },
    {
      id: 2005,
      code: '/premium',
      title: 'premium',
      display_name: 'premium',
      media: 'Image',
      category: 'Logo Style',
      use_case: 'Premium luxury branding',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo mewah/premium',
      example_prompt: '/logo /premium /minimal /monogram — MDS STEEL',
      example_result: 'Logo dengan sentuhan mewah kelas atas, aksen eksklusif, keanggunan presisi, dan prestise brand tinggi.',
      expanded_prompt: 'High-end prestigious premium logo design for {subject}. Bespoke refined craftsmanship, subtle metallic gold or silver sheen, upscale visual identity, elite brand aura, immaculate presentation.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/premium', 'premium']
    },
    {
      id: 2006,
      code: '/3d',
      title: '3d',
      display_name: '3d',
      media: 'Image',
      category: 'Visual Depth',
      use_case: '3D dimensional logo',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo dengan efek 3D',
      example_prompt: '/logo /sport /bold /3d — YBS FUTSAL CLUB',
      example_result: 'Logo berdimensi 3D dengan tata cahaya realistis, bayangan kedalaman halus, bevel elegan, dan tekstur taktil.',
      expanded_prompt: 'Dimensional 3D rendered logo for {subject}. Polished surface bevel, realistic ambient occlusion shadows, tactile material finish, subtle specular highlights, clean isometric depth on neutral studio background.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/3d', '3d']
    },
    {
      id: 2007,
      code: '/badge',
      title: 'badge',
      display_name: 'badge',
      media: 'Image',
      category: 'Logo Format',
      use_case: 'Badge & emblem seal',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo emblem/badge',
      example_prompt: '/logo /badge /vintage — Artisan Roasters',
      example_result: 'Logo bergaya lencana/emblem terbungkus bingkai melingkar atau perisai dengan pita tipografi seimbang.',
      expanded_prompt: 'Enclosed emblem badge logo for {subject}. Circular or shield frame enclosure, integrated typographic banner ribbon, authentic insignia crest, balanced vintage or modern stamp seal aesthetics.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/badge', 'badge']
    },
    {
      id: 2008,
      code: '/mascot',
      title: 'mascot',
      display_name: 'mascot',
      media: 'Image',
      category: 'Logo Format',
      use_case: 'Mascot character logo',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo maskot',
      example_prompt: '/logo /mascot /bold — Cyber Panther',
      example_result: 'Logo karakter maskot dinamis dengan pose energik, ekspresi berkarakter kuat, dan garis luar tebal bersih.',
      expanded_prompt: 'Dynamic illustrated character mascot logo for {subject}. Expressive charismatic facial feature, energetic action stance, sharp clean vector contours, bold cell-shaded detailing, iconic franchise mascot.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/mascot', 'mascot']
    },
    {
      id: 2009,
      code: '/sport',
      title: 'sport',
      display_name: 'sport',
      media: 'Image',
      category: 'Domain & Theme',
      use_case: 'Athletic & sports branding',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo olahraga',
      example_prompt: '/logo /sport /bold /3d — YBS FUTSAL CLUB',
      example_result: 'Logo olahraga berkecepatan tinggi dengan garis aerodinamis dinamis, sudut tajam berani, dan energi atletik kuat.',
      expanded_prompt: 'High-energy athletic sports team logo for {subject}. Dynamic aerodynamic speed angles, bold angular typography, aggressive competitive spirit, varsity league insignia, high-contrast energetic palette.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/sport', 'sport']
    },
    {
      id: 2010,
      code: '/esport',
      title: 'esport',
      display_name: 'esport',
      media: 'Image',
      category: 'Domain & Theme',
      use_case: 'Gaming team & esport crest',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo gaming/esport',
      example_prompt: '/logo /esport /3d — Phoenix Vanguard',
      example_result: 'Logo tim gaming & esport dengan perisai agresif, sudut faceted futuristik, dan aksen neon tajam.',
      expanded_prompt: 'Competitive esport gaming logo crest for {subject}. Sharp geometric faceted shield, cyber neon chromatic accents, menacing or futuristic silhouette, modern professional tournament clan mark.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/esport', 'esport']
    },
    {
      id: 2011,
      code: '/luxury',
      title: 'luxury',
      display_name: 'luxury',
      media: 'Image',
      category: 'Logo Style',
      use_case: 'Luxury & high fashion',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo elegan/luxury',
      example_prompt: '/logo /luxury /minimal — Maison Royale',
      example_result: 'Logo elegan kelas dunia dengan estetika kemewahan halus, sentuhan serif mewah, dan harmoni agung.',
      expanded_prompt: 'Ultra-luxurious haute couture logo design for {subject}. Delicate high-contrast serif letterforms, refined regal insignia, minimalist royal crest, timeless understated luxury brand prestige.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/luxury', 'luxury']
    },
    {
      id: 2012,
      code: '/bold',
      title: 'bold',
      display_name: 'bold',
      media: 'Image',
      category: 'Visual Tone',
      use_case: 'Heavy & powerful presence',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo tegas dan kuat',
      example_prompt: '/logo /sport /bold /3d — YBS FUTSAL CLUB',
      example_result: 'Logo berbobot tegas dan kokoh dengan garis tebal berbobot, struktur kokoh, dan daya tarik visual dominan.',
      expanded_prompt: 'Heavyweight bold authoritative logo design for {subject}. Thick confident solid shapes, powerful structural geometry, high visual weight, uncompromising commanding presence, punchy silhouette.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/bold', 'bold']
    },
    {
      id: 2013,
      code: '/icon',
      title: 'icon',
      display_name: 'icon',
      media: 'Image',
      category: 'Logo Format',
      use_case: 'Pictorial mark & app icon',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo berbasis ikon',
      example_prompt: '/logo /icon /modern — CloudSync',
      example_result: 'Logo simbol piktorial mandiri yang ringkas, simetris, dan siap digunakan sebagai favicon atau app icon.',
      expanded_prompt: 'Standalone pictorial glyph and app icon logo for {subject}. Grid-aligned geometric symmetry, clean silhouette recognizable at 16x16 pixels up to billboard scale, modern app store icon aesthetic.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/icon', 'icon']
    },
    {
      id: 2014,
      code: '/wordmark',
      title: 'wordmark',
      display_name: 'wordmark',
      media: 'Image',
      category: 'Typography',
      use_case: 'Logotype & wordmark',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo berbasis tulisan',
      example_prompt: '/logo /wordmark /modern — VORTEX LABS',
      example_result: 'Logotype berbasis huruf kustom murni dengan penyesuaian kerning presisi, ligatur unik, dan tipografi eksklusif.',
      expanded_prompt: 'Custom typographic wordmark logotype for {subject}. Tailored bespoke letterforms, optically balanced kerning, unique custom font ligatures, pristine text-only branding on clean background.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/wordmark', 'wordmark']
    },
    {
      id: 2015,
      code: '/monogram',
      title: 'monogram',
      display_name: 'monogram',
      media: 'Image',
      category: 'Typography',
      use_case: 'Initial monogram mark',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Logo inisial',
      example_prompt: '/logo /premium /minimal /monogram — MDS STEEL',
      example_result: 'Logo monogram inisial huruf yang saling bertaut cerdas, proporsional geometris, dan elegan.',
      expanded_prompt: 'Interlocking initial letters monogram logo for {subject}. Clever typographic ligature fusion, balanced geometric letter structure, prestigious signet crest, distinctive luxury monogram glyph.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/monogram', 'monogram']
    },
    {
      id: 2016,
      code: '/color',
      title: 'color',
      display_name: 'color',
      media: 'Image',
      category: 'Brand Specs',
      use_case: 'Color palette system',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Tentukan kombinasi warna',
      example_prompt: '/logo /color /minimal — Nordic Coffee',
      example_result: 'Sistem palet warna merek yang harmonis, terukur, kontras tinggi, dan berstandar warna korporat.',
      expanded_prompt: 'Curated brand color palette harmonization for {subject} logo. Balanced primary and secondary chromatic scheme, precise color contrast ratio, commercial branding guidelines color harmony.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/color', 'color']
    },
    {
      id: 2017,
      code: '/font',
      title: 'font',
      display_name: 'font',
      media: 'Image',
      category: 'Typography',
      use_case: 'Typography pair & hierarchy',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Rekomendasi gaya tipografi',
      example_prompt: '/logo /font /brand — Horizon Studio',
      example_result: 'Pasangan tipografi profesional dengan font heading dan subteks yang serasi serta keterbacaan prima.',
      expanded_prompt: 'Professional brand typography pairing and font style direction for {subject}. Cohesive primary header font, readable secondary typeface, refined optical hierarchy and letter spacing.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/font', 'font']
    },
    {
      id: 2018,
      code: '/mockup',
      title: 'mockup',
      display_name: 'mockup',
      media: 'Image',
      category: 'Presentation',
      use_case: 'Photorealistic brand mockup',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Tampilkan pada mockup',
      example_prompt: '/logo /mockup /premium — Zenith Watch',
      example_result: 'Presentasi mockup komersial realistis: diemboss pada kartu nama mewah, papan nama kantor, atau kemasan.',
      expanded_prompt: 'Photorealistic commercial mockup showcase of {subject} logo. Embossed foil on textured heavy cardstock, debossed leather stationery, or sleek architectural matte office signage with realistic lighting.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/mockup', 'mockup']
    },
    {
      id: 2019,
      code: '/print',
      title: 'print',
      display_name: 'print',
      media: 'Image',
      category: 'Production',
      use_case: 'Print-ready vector spec',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Siapkan konsep untuk produksi/cetak',
      example_prompt: '/logo /print /vector — Alpha Corp',
      example_result: 'Konsep logo yang dioptimalkan untuk cetak fisik: kompatibel CMYK, sablon, bordir, dan grafir tanpa distorsi.',
      expanded_prompt: 'Print-ready production grade vector logo design for {subject}. High-contrast CMYK color compatibility, flawless monochrome single-color reproduction, silkscreen, embroidery and engraving ready.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/print', 'print']
    },
    {
      id: 2020,
      code: '/vector',
      title: 'vector',
      display_name: 'vector',
      media: 'Image',
      category: 'Visual Format',
      use_case: 'Clean scalable vector art',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Konsep logo bergaya vector',
      example_prompt: '/logo /vector /icon — Nova App',
      example_result: 'Seni grafis vektor 2D murni dengan kurva bezier mulus, warna solid tajam, dan skalabilitas tanpa batas.',
      expanded_prompt: 'Flat clean 2D vector art logo for {subject}. Crisp smooth bezier curves, zero raster artifacts, solid fills, sharp defined edges, SVG and EPS infinite scalability aesthetics on white background.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/vector', 'vector']
    },
    {
      id: 2021,
      code: '/negative',
      title: 'negative',
      display_name: 'negative',
      media: 'Image',
      category: 'Prompt Engineering',
      use_case: 'Negative constraints lock',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Buat negative prompt',
      example_prompt: '/logo /negative — Clean Brand Lock',
      example_result: 'Kumpulan batasan negatif untuk mencegah distorsi, teks sampah acak, latar belakang kotor, dan artefak raster.',
      expanded_prompt: 'Negative prompt parameters for clean logo generation: [negative: photorealistic complex background, photographic noise, blurred edges, distorted typography, messy gradients, artifact, watermark, signature].',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/negative', 'negative']
    },
    {
      id: 2022,
      code: '/5opsi',
      title: '5opsi',
      display_name: '5opsi',
      media: 'Image',
      category: 'Ideation',
      use_case: 'Multi-concept exploration sheet',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Buat 5 konsep berbeda',
      example_prompt: '/logo /5opsi — Zenith Automotive',
      example_result: 'Lembar eksplorasi 5 arah konsep desain logo yang berbeda (minimalis, 3D, emblem, maskot, monogram) dalam satu kisi presentasi.',
      expanded_prompt: 'Generate a comprehensive 5-concept exploration design sheet for {subject} logo. 5 distinctly unique creative directions (minimalist, monogram, emblem badge, mascot, 3D icon), neatly arranged in a clean presentation grid.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/5opsi', '5opsi', '/5 opsi', '5 opsi']
    },
    {
      id: 2023,
      code: '/revisi',
      title: 'revisi',
      display_name: 'revisi',
      media: 'Image',
      category: 'Iteration',
      use_case: 'Concept refinement & polish',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Revisi konsep sebelumnya',
      example_prompt: '/logo /revisi — Apex Robotics',
      example_result: 'Iterasi penyempurnaan desain: memoles ketebalan garis, menyempurnakan keselarasan geometris, dan memperjelas ikon.',
      expanded_prompt: 'Refine and polish previous logo iteration of {subject}. Optimize stroke weight balance, sharpen geometric alignment, harmonize color saturation, and enhance icon legibility while preserving core identity.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/revisi', 'revisi']
    },
    {
      id: 2024,
      code: '/style',
      title: 'style',
      display_name: 'style',
      media: 'Image',
      category: 'Logo Style',
      use_case: 'Visual style direction',
      collection: 'Shortcut Prompt Logo',
      family: 'Logo & Brand Identity',
      description: 'Pilih gaya visual logo (minimal / modern / luxury / 3D / bold)',
      example_prompt: '/logo /brand /style /icon /color /font /mockup /negative',
      example_result: 'Menentukan arahan gaya visual spesifik logo untuk workflow desain yang terarah dan konsisten.',
      expanded_prompt: 'Apply cohesive signature visual styling for {subject} logo. Harmonious design language, distinct artistic identity, balanced stylistic tone aligned with the brand aesthetic.',
      code_class: 'Universal',
      origin: 'Studio',
      aliases: ['/style', 'style']
    }
  ];

  // --- DATASET & INDEXING ---
  const DATA = window.PROMPT_DATA || [];
  
  // Gabungkan 24 shortcode logo ke DATA master
  LOGO_SHORTCODES.forEach(item => {
    if (!DATA.some(x => norm(x.code) === norm(item.code))) {
      DATA.push(item);
    }
  });

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

  // --- VISUAL GROUPS DEFINITIONS (TERMASUK SHORTCUT PROMPT LOGO) ---
  const BASE_GROUPS = [
    {
      id: 'logo-design',
      title: 'Shortcut Prompt Logo',
      desc: 'Sistem pembuatan konsep logo & identitas brand: minimalis, modern, 3D, emblem, maskot, sport, esport, wordmark, monogram, dan mockup cetak.',
      img: 'assets/groups/logo-design.jpg',
      collection: 'Brand Identity · Logo Studio',
      codes: [
        'logo', 'brand', 'minimal', 'modern', 'premium', '3d', 'badge',
        'mascot', 'sport', 'esport', 'luxury', 'bold', 'icon', 'wordmark',
        'monogram', 'color', 'font', 'mockup', 'print', 'vector', 'negative',
        '5opsi', 'revisi'
      ],
      examples: [
        {
          formula: '/logo /sport /bold /3d — YBS FUTSAL CLUB',
          desc: 'Artinya: buat konsep logo YBS Futsal Club dengan karakter sporty, tegas, dan 3D.'
        },
        {
          formula: '/logo /premium /minimal /monogram — MDS STEEL',
          desc: '→ Konsep logo MDS STEEL dengan gaya premium, minimalis, dan monogram.'
        }
      ],
      workflow: '/logo /brand /style /icon /color /font /mockup /negative'
    },
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

  async function copyToClipboard(text, successMsg) {
    if (!text) return false;
    let copied = false;

    // 1. Coba Clipboard API modern jika tersedia
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (err) {
        console.warn('Clipboard API gagal, beralih ke fallback execCommand:', err);
      }
    }

    // 2. Fallback textarea execCommand (berfungsi di HTTP, WebView, dan iframe)
    if (!copied) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.left = '-9999px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        copied = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (err) {
        console.error('Fallback execCommand gagal:', err);
      }
    }

    // 3. Fallback terakhir: prompt manual jika sistem keamanan OS memblokir
    if (!copied) {
      window.prompt('Salin teks shortcut berikut secara manual (Ctrl+C):', text);
      return false;
    }

    toast(successMsg || 'Berhasil disalin ke clipboard!');
    return true;
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
            
            <!-- Cuplikan Shortcode Informatif & Siap Salin -->
            <div class="card-samples-row" title="Klik pada shortcut untuk langsung menyalin ke clipboard">
              ${sampleCodes.map(code => `<span class="card-code-chip" data-copy="${code}" title="Klik untuk salin ${code}">${code}</span>`).join('')}
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

    // Pasang handler salin cepat untuk chip shortcode di kartu feed
    $$('.card-code-chip[data-copy]').forEach(chip => {
      chip.onclick = e => {
        e.stopPropagation();
        const code = chip.dataset.copy;
        copyToClipboard(code, `Shortcut ${code} berhasil disalin!`);
        const orig = chip.textContent;
        chip.textContent = 'Tersalin ✓';
        chip.classList.add('copied');
        setTimeout(() => {
          chip.textContent = orig;
          chip.classList.remove('copied');
        }, 1200);
      };
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
            <span class="code-badge" data-copy-shortcut="${item.code}" title="Klik untuk salin shortcut ${item.code}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              ${item.code}
            </span>
            <span class="media-chip ${item.media.toLowerCase()}">${item.media}</span>
          </div>
          <p class="code-card-desc">${item.description}</p>
          <div class="code-card-footer">
            <span>${item.family}</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <button class="btn-copy-code" data-copy-shortcut="${item.code}" title="Salin shortcut ${item.code}" style="padding:2px 7px;font-size:10.5px;">
                Salin
              </button>
              <button class="btn-fav" data-fav-id="${item.id}" title="Simpan ke favorit">
                ${isSaved ? '★' : '☆'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Handler klik kartu: salin prompt lengkap
    $$('.code-card').forEach(card => {
      card.onclick = e => {
        if (e.target.closest('.btn-fav') || e.target.closest('[data-copy-shortcut]')) return;
        const id = +card.dataset.codeId;
        const entry = DATA.find(x => x.id === id);
        if (entry) {
          copyToClipboard(getCleanPrompt(entry.code), `Prompt lengkap untuk ${entry.code} disalin!`);
        }
      };
    });

    // Handler klik salin shortcut langsung pada badge dan tombol salin
    $$('[data-copy-shortcut]').forEach(el => {
      el.onclick = e => {
        e.stopPropagation();
        const code = el.dataset.copyShortcut;
        copyToClipboard(code, `Shortcut ${code} berhasil disalin!`);
        const orig = el.innerHTML;
        el.innerHTML = '<span style="color:#10b981;font-weight:800;">Tersalin ✓</span>';
        setTimeout(() => {
          el.innerHTML = orig;
        }, 1200);
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
    logo: {
      subject: 'YBS FUTSAL CLUB / MDS STEEL',
      mode: 'image',
      ratio: '1:1',
      lighting: 'clean vector studio lighting, high contrast white isolated background',
      constraints: 'crisp vector bezier lines, balanced typography, no photographic clutter, scalable svg aesthetic'
    },
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

    // Render formula & workflow jika tersedia pada kelompok (misal Shortcut Prompt Logo)
    const formulaContainer = $('#modalFormulaContainer');
    if (formulaContainer) {
      if (group.examples || group.workflow) {
        let formulaHtml = `
          <div class="formula-header">
            <span class="formula-fire-badge">🔥 Contoh Penggunaan Cepat</span>
            <span style="font-size:11px;color:var(--text-dim);">Klik tombol Salin untuk langsung menyalin</span>
          </div>
          <div class="formula-items-list">
        `;

        if (group.examples && group.examples.length) {
          group.examples.forEach(ex => {
            formulaHtml += `
              <div class="formula-item-card">
                <div class="formula-code-row">
                  <span class="formula-code-text">${ex.formula}</span>
                  <button class="btn-formula-copy" data-copy-formula="${ex.formula}" title="Salin formula ${ex.formula}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Salin
                  </button>
                </div>
                <div class="formula-desc-text">${ex.desc}</div>
              </div>
            `;
          });
        }

        formulaHtml += `</div>`;

        if (group.workflow) {
          formulaHtml += `
            <div class="workflow-section-box">
              <div class="workflow-title-text">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Shortcut Lengkap Workflow Desain Logo:
              </div>
              <div class="formula-code-row">
                <span class="formula-code-text" style="color:#0f172a;">${group.workflow}</span>
                <button class="btn-formula-copy" data-copy-formula="${group.workflow}" style="background:#ffffff;border-color:#4f46e5;color:#4f46e5;font-weight:700;" title="Salin seluruh workflow logo">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Salin Workflow
                </button>
              </div>
            </div>
          `;
        }

        formulaContainer.innerHTML = formulaHtml;
        formulaContainer.style.display = 'flex';

        // Handler klik tombol salin formula & workflow
        formulaContainer.querySelectorAll('[data-copy-formula]').forEach(btn => {
          btn.onclick = e => {
            e.stopPropagation();
            const formula = btn.dataset.copyFormula;
            copyToClipboard(formula, 'Berhasil disalin ke clipboard!');
            const orig = btn.innerHTML;
            btn.innerHTML = '<span style="color:#059669;font-weight:800;">Tersalin ✓</span>';
            btn.classList.add('copied');
            setTimeout(() => {
              btn.innerHTML = orig;
              btn.classList.remove('copied');
            }, 1200);
          };
        });
      } else {
        formulaContainer.innerHTML = '';
        formulaContainer.style.display = 'none';
      }
    }

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
      const shortCode = '/' + String(code).replaceAll(' ', '');
      return `
        <div class="modal-code-item ${isSelected ? 'active' : ''}" data-idx="${idx}" data-code="${shortCode}">
          <span class="modal-code-num">${String(idx + 1).padStart(2, '0')}</span>
          <div class="modal-code-main">
            <b class="modal-code-name" data-copy="${shortCode}" title="Klik untuk salin ${shortCode}">${shortCode}</b>
            <span>${entry?.description || group.desc}</span>
          </div>
          <div class="modal-code-actions">
            <button class="btn-copy-code" data-copy="${shortCode}" title="Salin shortcut ${shortCode}" aria-label="Salin shortcut">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span class="copy-lbl">Salin</span>
            </button>
            <span class="modal-code-chev">›</span>
          </div>
        </div>
      `;
    }).join('');

    $$('.modal-code-item').forEach(item => {
      item.onclick = e => {
        if (e.target.closest('.btn-copy-code') || e.target.closest('.modal-code-name')) return;
        STATE.activeShortIndex = +item.dataset.idx;
        showActiveShortDetail();
      };
    });

    // Pasang handler salin cepat untuk tombol salin di baris kode
    $$('.btn-copy-code').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const code = btn.dataset.copy;
        copyToClipboard(code, `Shortcut ${code} berhasil disalin!`);
        const lbl = btn.querySelector('.copy-lbl');
        if (lbl) {
          lbl.textContent = 'Tersalin ✓';
          btn.classList.add('copied');
          setTimeout(() => {
            lbl.textContent = 'Salin';
            btn.classList.remove('copied');
          }, 1200);
        }
      };
    });

    // Pasang handler salin saat nama shortcut di-klik langsung
    $$('.modal-code-name').forEach(nameEl => {
      nameEl.onclick = e => {
        e.stopPropagation();
        const code = nameEl.dataset.copy;
        copyToClipboard(code, `Shortcut ${code} berhasil disalin!`);
        const orig = nameEl.textContent;
        nameEl.textContent = 'Tersalin ✓';
        nameEl.style.color = '#10b981';
        setTimeout(() => {
          nameEl.textContent = orig;
          nameEl.style.color = '';
        }, 1200);
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
    const shortCode = '/' + String(code).replaceAll(' ', '');
    const entry = findEntry(code);
    const detailEl = $('#modalShortDetail');
    if (!detailEl) return;

    const sub = $('#modalSubjectInput')?.value.trim() || STATE.selectedSubject;
    const cleanPrompt = getCleanPrompt(code, sub);

    detailEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <h4 style="font-family:var(--font-mono);font-size:14.5px;color:var(--primary);margin:0;cursor:pointer;" id="detailShortcodeTitle" title="Klik untuk salin ${shortCode}">
          ${shortCode} <span style="font-size:11px;font-weight:600;color:var(--text-dim);font-family:var(--font-sans);">(klik untuk salin)</span>
        </h4>
        <span class="media-chip ${entry?.media ? entry.media.toLowerCase() : 'image'}">${entry?.media || 'Visual'}</span>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin:0 0 6px;">
        ${entry?.example_result || entry?.description || group.desc}
      </p>
      <div class="detail-prompt-box">${cleanPrompt}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
        <button class="btn-action primary" id="modalCopyShortcutBtn" style="height:34px;font-size:12.5px;font-weight:750;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Salin Shortcut (${shortCode})
        </button>
        <button class="btn-action" id="modalCopyPromptBtn" style="height:34px;font-size:12px;">
          Salin Prompt Lengkap
        </button>
        <button class="btn-action" id="modalAddToComposerBtn" style="height:34px;font-size:12px;">
          + Ke Composer
        </button>
      </div>
    `;

    detailEl.classList.add('open');

    $('#detailShortcodeTitle').onclick = () => {
      copyToClipboard(shortCode, `Shortcut ${shortCode} berhasil disalin!`);
    };

    $('#modalCopyShortcutBtn').onclick = () => {
      copyToClipboard(shortCode, `Shortcut ${shortCode} berhasil disalin!`);
      const btn = $('#modalCopyShortcutBtn');
      if (btn) {
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<span>Tersalin ✓</span>';
        setTimeout(() => btn.innerHTML = origHtml, 1200);
      }
    };

    $('#modalCopyPromptBtn').onclick = () => {
      copyToClipboard(cleanPrompt, 'Prompt lengkap berhasil disalin!');
    };

    $('#modalAddToComposerBtn').onclick = () => {
      STATE.composerCodes.add(code);
      localStorage.setItem('pv4-composer-codes', JSON.stringify([...STATE.composerCodes]));
      toast(`${shortCode} ditambahkan ke Composer!`);
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
      const val = e.target.value;
      const preset = COMPOSER_PRESETS[val];
      if (!preset) return;
      if ($('#composerSubject')) $('#composerSubject').value = preset.subject;
      if ($('#composerMode')) $('#composerMode').value = preset.mode;
      if ($('#composerRatio')) $('#composerRatio').value = preset.ratio;
      if ($('#composerLighting')) $('#composerLighting').value = preset.lighting;
      if ($('#composerConstraints')) $('#composerConstraints').value = preset.constraints;

      if (val === 'logo') {
        const logoWorkflow = ['/logo', '/brand', '/minimal', '/icon', '/color', '/font', '/mockup', '/negative'];
        logoWorkflow.forEach(code => STATE.composerCodes.add(code));
        localStorage.setItem('pv4-composer-codes', JSON.stringify([...STATE.composerCodes]));
      }

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
