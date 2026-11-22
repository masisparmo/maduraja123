const PRODUCT_PRICE = 75000;
const PRODUCT_VOLUME_ML = 650;
const WHATSAPP_E164 = '6281234567890';

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// 1. SEO Canonical & Dynamic Copyright Year
(function initMetadata() {
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonicalUrl);

  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();

// 2. Dark / Light Theme Sync
(function initThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(mode) {
    const isDark = mode === 'dark';
    document.documentElement.classList.toggle('dark', isDark);

    try {
      localStorage.setItem('maduraja-theme', mode);
    } catch {
      // Ignore restricted storage environments
    }

    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#12100E' : '#FAF8F4');
    }

    themeButtons.forEach((btn) => {
      const value = btn.getAttribute('data-theme-value');
      btn.setAttribute('aria-pressed', value === mode ? 'true' : 'false');
    });
  }

  const initialMode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  applyTheme(initialMode);

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextTheme = btn.getAttribute('data-theme-value') === 'dark' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  });
})();

// 3. Mobile Navigation Drawer
(function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggleBtn || !mobileMenu) return;

  function setMenuOpen(isOpen) {
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggleBtn.setAttribute(
      'aria-label',
      isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'
    );
    mobileMenu.hidden = !isOpen;
  }

  toggleBtn.addEventListener('click', () => {
    const currentlyOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!currentlyOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
})();

// 4. Zero-Broken-Image Fallback Handler
(function initProductImageFallback() {
  const img = document.getElementById('hero-product-img');
  const fallback = document.getElementById('hero-img-fallback');

  if (!img || !fallback) return;

  img.addEventListener('error', () => {
    img.hidden = true;
    fallback.hidden = false;
  });
})();

// 5. Family Dosage & Bottle Calculator
(function initDosageCalculator() {
  let adults = 2;
  let children = 1;

  const adultsValEl = document.getElementById('calc-adults-val');
  const childrenValEl = document.getElementById('calc-children-val');
  const dailyMlEl = document.getElementById('calc-daily-ml');
  const daysPerBottleEl = document.getElementById('calc-days-bottle');
  const bottlesRecEl = document.getElementById('calc-bottles-rec');
  const monthlyCostEl = document.getElementById('calc-monthly-cost');

  const adultsMinus = document.getElementById('calc-adults-minus');
  const adultsPlus = document.getElementById('calc-adults-plus');
  const childrenMinus = document.getElementById('calc-children-minus');
  const childrenPlus = document.getElementById('calc-children-plus');

  function renderCalculator() {
    const dailyMl = adults * 15 + children * 5;
    const daysPerBottle = dailyMl > 0 ? Math.floor(PRODUCT_VOLUME_ML / dailyMl) : 0;
    const recommendedBottles =
      dailyMl > 0 ? Math.max(1, Math.ceil((dailyMl * 30) / PRODUCT_VOLUME_ML)) : 1;
    const monthlyCost = recommendedBottles * PRODUCT_PRICE;

    if (adultsValEl) adultsValEl.textContent = String(adults);
    if (childrenValEl) childrenValEl.textContent = String(children);
    if (dailyMlEl) dailyMlEl.textContent = `${dailyMl} ml / hari`;
    if (daysPerBottleEl) {
      daysPerBottleEl.textContent =
        dailyMl > 0 ? `± ${daysPerBottle} hari` : 'Pilih min. 1 orang';
    }
    if (bottlesRecEl) bottlesRecEl.textContent = `${recommendedBottles} Botol Madu Raja`;
    if (monthlyCostEl) monthlyCostEl.textContent = formatRupiah(monthlyCost);
  }

  adultsMinus?.addEventListener('click', () => {
    adults = Math.max(0, adults - 1);
    renderCalculator();
  });

  adultsPlus?.addEventListener('click', () => {
    adults = Math.min(10, adults + 1);
    renderCalculator();
  });

  childrenMinus?.addEventListener('click', () => {
    children = Math.max(0, children - 1);
    renderCalculator();
  });

  childrenPlus?.addEventListener('click', () => {
    children = Math.min(10, children + 1);
    renderCalculator();
  });

  renderCalculator();
})();

// 6. Accessible FAQ Accordion
(function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('aria-controls');
      const targetPanel = targetId ? document.getElementById(targetId) : null;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      triggers.forEach((otherTrigger) => {
        const otherId = otherTrigger.getAttribute('aria-controls');
        const otherPanel = otherId ? document.getElementById(otherId) : null;
        otherTrigger.setAttribute('aria-expanded', 'false');
        if (otherPanel) otherPanel.hidden = true;
      });

      if (!isExpanded && targetPanel) {
        trigger.setAttribute('aria-expanded', 'true');
        targetPanel.hidden = false;
      }
    });
  });
})();

// 7. Interactive Order Form & WhatsApp Handoff
(function initOrderForm() {
  let quantity = 2;

  const form = document.getElementById('order-form');
  const confirmation = document.getElementById('order-confirmation');
  const qtyMinus = document.getElementById('order-qty-minus');
  const qtyPlus = document.getElementById('order-qty-plus');
  const qtyValEl = document.getElementById('order-qty-val');
  const subtotalLabelEl = document.getElementById('order-subtotal-label');
  const subtotalValEl = document.getElementById('order-subtotal-val');
  const quickWaLink = document.getElementById('quick-wa-link');

  const nameInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById('order-name')
  );
  const phoneInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById('order-phone')
  );
  const addressInput = /** @type {HTMLTextAreaElement | null} */ (
    document.getElementById('order-address')
  );
  const notesInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById('order-notes')
  );

  const errorNameEl = document.getElementById('error-name');
  const errorPhoneEl = document.getElementById('error-phone');
  const errorAddressEl = document.getElementById('error-address');

  const confirmTitleEl = document.getElementById('confirm-title');
  const confirmNameEl = document.getElementById('confirm-name');
  const confirmPhoneEl = document.getElementById('confirm-phone');
  const confirmAddressEl = document.getElementById('confirm-address');
  const confirmQtyLineEl = document.getElementById('confirm-qty-line');
  const confirmTotalValEl = document.getElementById('confirm-total-val');
  const confirmWaBtn = document.getElementById('confirm-wa-btn');
  const editBtn = document.getElementById('order-edit-btn');

  function buildWhatsAppUrl(customerName, customerPhone, customerAddress, qty, extraNotes) {
    const totalAmount = formatRupiah(qty * PRODUCT_PRICE);
    const lines = [
      'Halo Admin Madu Raja, saya ingin memesan:',
      `- Produk: Madu Raja (${PRODUCT_VOLUME_ML} ml)`,
      `- Jumlah: ${qty} botol`,
      `- Total Promo: ${totalAmount}`,
      '',
      'Data Pemesan:',
      `- Nama: ${customerName || '-'}`,
      `- No. WhatsApp: ${customerPhone || '-'}`,
      `- Alamat Pengiriman: ${customerAddress || '-'}`,
    ];
    if (extraNotes && extraNotes.trim()) {
      lines.push(`- Catatan: ${extraNotes.trim()}`);
    }
    return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  function updateOrderTotals() {
    const subtotal = quantity * PRODUCT_PRICE;
    if (qtyValEl) qtyValEl.textContent = String(quantity);
    if (subtotalLabelEl) subtotalLabelEl.textContent = `Total Harga Promo (${quantity} botol)`;
    if (subtotalValEl) subtotalValEl.textContent = formatRupiah(subtotal);

    if (quickWaLink) {
      quickWaLink.setAttribute(
        'href',
        buildWhatsAppUrl(
          nameInput?.value.trim() || '',
          phoneInput?.value.trim() || '',
          addressInput?.value.trim() || '',
          quantity,
          notesInput?.value || ''
        )
      );
    }
  }

  function setFieldError(el, message) {
    if (!el) return;
    if (message) {
      el.textContent = message;
      el.hidden = false;
    } else {
      el.textContent = '';
      el.hidden = true;
    }
  }

  qtyMinus?.addEventListener('click', () => {
    quantity = Math.max(1, quantity - 1);
    updateOrderTotals();
  });

  qtyPlus?.addEventListener('click', () => {
    quantity = Math.min(50, quantity + 1);
    updateOrderTotals();
  });

  nameInput?.addEventListener('input', () => {
    setFieldError(errorNameEl, '');
    updateOrderTotals();
  });

  phoneInput?.addEventListener('input', () => {
    setFieldError(errorPhoneEl, '');
    updateOrderTotals();
  });

  addressInput?.addEventListener('input', () => {
    setFieldError(errorAddressEl, '');
    updateOrderTotals();
  });

  notesInput?.addEventListener('input', updateOrderTotals);

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const customerName = nameInput?.value.trim() || '';
    const customerPhone = phoneInput?.value.trim() || '';
    const customerAddress = addressInput?.value.trim() || '';
    const extraNotes = notesInput?.value || '';

    let hasError = false;

    if (customerName.length < 2) {
      setFieldError(errorNameEl, 'Masukkan nama lengkap penerima minimal 2 karakter.');
      hasError = true;
    } else {
      setFieldError(errorNameEl, '');
    }

    const cleanPhone = customerPhone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 9) {
      setFieldError(errorPhoneEl, 'Masukkan nomor WhatsApp yang aktif (minimal 9 digit).');
      hasError = true;
    } else {
      setFieldError(errorPhoneEl, '');
    }

    if (customerAddress.length < 8) {
      setFieldError(errorAddressEl, 'Masukkan kota atau alamat lengkap untuk estimasi pengiriman.');
      hasError = true;
    } else {
      setFieldError(errorAddressEl, '');
    }

    if (hasError) return;

    const orderCode = `MR-${String(Date.now()).slice(-4)}`;
    const subtotal = quantity * PRODUCT_PRICE;
    const waUrl = buildWhatsAppUrl(
      customerName,
      customerPhone,
      customerAddress,
      quantity,
      extraNotes
    );

    if (confirmTitleEl) {
      confirmTitleEl.textContent = `Ringkasan Pesanan Siap Dikirim (${orderCode})`;
    }
    if (confirmNameEl) confirmNameEl.textContent = customerName;
    if (confirmPhoneEl) confirmPhoneEl.textContent = customerPhone;
    if (confirmAddressEl) confirmAddressEl.textContent = customerAddress;
    if (confirmQtyLineEl) {
      confirmQtyLineEl.textContent = `${quantity} × Madu Raja 650 ml (Rp 75.000)`;
    }
    if (confirmTotalValEl) confirmTotalValEl.textContent = formatRupiah(subtotal);
    if (confirmWaBtn) confirmWaBtn.setAttribute('href', waUrl);

    if (form) form.hidden = true;
    if (confirmation) confirmation.hidden = false;
  });

  editBtn?.addEventListener('click', () => {
    if (confirmation) confirmation.hidden = true;
    if (form) form.hidden = false;
  });

  updateOrderTotals();
})();
