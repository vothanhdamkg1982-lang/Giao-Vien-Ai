/* ============================================================
   QUẢN LÝ TRANG THÁI & RENDER
   ============================================================ */

// === BANNER SLIDER ===
let currentSlide = 0;
let slideInterval;

function renderBanner() {
    const wrapper = document.getElementById('bannerSlidesWrapper');
    const dotsContainer = document.getElementById('bannerDots');

    wrapper.innerHTML = SLIDES.map((slide, index) => {
        let avatarHtml = '';
        if (slide.avatar) {
            avatarHtml = `<div class="banner-avatar"><img src="${slide.avatar}" alt="Võ Thanh Đậm" /></div>`;
        }
        return `
            <div class="banner-slide ${index === 0 ? 'active' : ''}" 
                 style="background-image: url('${slide.bg}');" 
                 data-index="${index}">
                <div class="banner-content">
                    ${avatarHtml}
                    <h1>${slide.title}</h1>
                    <p>${slide.desc}</p>
                    <a href="${slide.btnLink}" class="btn-banner" onclick="switchSection('${slide.btnLink.replace('#section-', '')}')">${slide.btnText}</a>
                </div>
            </div>
        `;
    }).join('');

    dotsContainer.innerHTML = SLIDES.map((_, index) => `
        <span class="banner-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
    `).join('');

    document.querySelectorAll('.banner-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            goToSlide(index);
        });
    });

    document.getElementById('bannerPrev').addEventListener('click', () => goToSlide(currentSlide - 1));
    document.getElementById('bannerNext').addEventListener('click', () => goToSlide(currentSlide + 1));

    startAutoSlide();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    const total = slides.length;

    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;

    resetAutoSlide();
}

function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// === CHUYỂN SECTION ===
function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-links button').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.nav-links button[data-section="${sectionId}"]`);
    if (btn) btn.classList.add('active');

    document.getElementById('navLinks').classList.remove('open');

    if (sectionId === 'photos') renderPhotos(getActiveFilter('photoFilterBar'));
    if (sectionId === 'videos') renderVideos(getActiveFilter('videoFilterBar'));
    if (sectionId === 'documents') renderDocuments(getActiveFilter('docFilterBar'));
    if (sectionId === 'chuyenmon') renderChuyenMon(getActiveFilter('chuyenmonFilterBar'));
    if (sectionId === 'ungdung') renderUngDung(getActiveFilter('ungdungFilterBar'));
    if (sectionId === 'links') renderLinks();
}

function getActiveFilter(barId) {
    const bar = document.getElementById(barId);
    if (!bar) return 'all';
    const activeBtn = bar.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}

function updateBadges() {
    document.getElementById('photoCount').textContent = PHOTOS.length;
    document.getElementById('videoCount').textContent = VIDEOS.length;
    document.getElementById('docCount').textContent = DOCUMENTS.length;
    document.getElementById('chuyenmonCount').textContent = CHUYENMON.length;
    document.getElementById('ungdungCount').textContent = UNGDUNG.length;
    document.getElementById('homePhotoCount').textContent = PHOTOS.length;
    document.getElementById('homeVideoCount').textContent = VIDEOS.length;
    document.getElementById('homeDocCount').textContent = DOCUMENTS.length;
}

// === RENDER ẢNH ===
function renderPhotos(filter = 'all') {
    const grid = document.getElementById('photoGrid');
    let items = PHOTOS;
    if (filter !== 'all') items = items.filter(p => p.category === filter);

    if (!items.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-images"></i><p>Không có ảnh nào trong danh mục này.</p></div>`;
        return;
    }
    grid.innerHTML = items.map(p => `
        <div class="gallery-item" data-id="${p.id}">
            <img src="${p.url}" alt="${p.title || 'Ảnh'}" loading="lazy" />
            <div class="gallery-body">
                <h4>${p.title || 'Không có tiêu đề'}</h4>
                <p>${p.desc || ''}</p>
                <div class="actions">
                    <a href="${p.url}" target="_blank" rel="noopener"><i class="fas fa-eye"></i> Xem</a>
                    <a href="${p.url}" download="${p.title || 'anh'}.jpg"><i class="fas fa-download"></i> Tải</a>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('#photoGrid .gallery-item img').forEach((img) => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.gallery-item');
            const id = item.dataset.id;
            const photo = PHOTOS.find(p => p.id === id);
            if (photo) openLightbox(photo.url, photo.title || '');
        });
    });
}

// === RENDER VIDEO ===
function renderVideos(filter = 'all') {
    const grid = document.getElementById('videoGrid');
    let items = VIDEOS;
    if (filter !== 'all') items = items.filter(v => v.category === filter);

    if (!items.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-video"></i><p>Không có video nào trong danh mục này.</p></div>`;
        return;
    }
    grid.innerHTML = items.map(v => {
        const embedUrl = getEmbedUrl(v.url);
        return `
            <div class="gallery-item">
                <div class="video-wrapper">
                    <iframe src="${embedUrl}" allowfullscreen loading="lazy"></iframe>
                </div>
                <div class="gallery-body">
                    <h4>${v.title || 'Không có tiêu đề'}</h4>
                    <p>${v.desc || ''}</p>
                    <div class="actions">
                        <a href="${v.url}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Mở gốc</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// === RENDER TÀI LIỆU ===
function renderDocuments(filter = 'all') {
    const list = document.getElementById('docList');
    let items = DOCUMENTS;
    if (filter !== 'all') items = items.filter(d => d.category === filter);

    if (!items.length) {
        list.innerHTML = `<div class="empty-state"><i class="fas fa-folder-open"></i><p>Không có tài liệu nào trong danh mục này.</p></div>`;
        return;
    }
    list.innerHTML = items.map(d => `
        <div class="doc-item">
            <div class="doc-info">
                <i class="fas fa-file-pdf"></i>
                <div>
                    <div class="doc-title">${d.title || 'Tài liệu'}</div>
                    <div class="doc-desc">${d.desc || ''}</div>
                </div>
            </div>
            <div class="doc-actions">
                <a href="${d.url}" target="_blank" rel="noopener"><i class="fas fa-eye"></i> Xem</a>
                <a href="${d.url}" download="${d.title || 'tailieu'}.pdf"><i class="fas fa-download"></i> Tải xuống</a>
            </div>
        </div>
    `).join('');
}

// === RENDER CHUYÊN MÔN ===
function renderChuyenMon(filter = 'all') {
    const list = document.getElementById('chuyenmonList');
    let items = CHUYENMON;
    if (filter !== 'all') items = items.filter(c => c.category === filter);

    if (!items.length) {
        list.innerHTML = `<div class="empty-state"><i class="fas fa-folder"></i><p>Không có tài liệu chuyên môn nào trong danh mục này.</p></div>`;
        return;
    }
    list.innerHTML = items.map(c => {
        let icon = 'fa-file-pdf';
        if (c.type === 'xlsx') icon = 'fa-file-excel';
        else if (c.type === 'docx') icon = 'fa-file-word';
        return `
            <div class="doc-item">
                <div class="doc-info">
                    <i class="fas ${icon}"></i>
                    <div>
                        <div class="doc-title">${c.title || 'Tài liệu chuyên môn'}</div>
                        <div class="doc-desc">${c.desc || ''}</div>
                    </div>
                </div>
                <div class="doc-actions">
                    <a href="${c.url}" target="_blank" rel="noopener"><i class="fas fa-eye"></i> Xem</a>
                    <a href="${c.url}" download="${c.title || 'chuyenmon'}.${c.type}"><i class="fas fa-download"></i> Tải xuống</a>
                </div>
            </div>
        `;
    }).join('');
}

// === RENDER ỨNG DỤNG (EXCEL) ===
function renderUngDung(filter = 'all') {
    const list = document.getElementById('ungdungList');
    let items = UNGDUNG;
    if (filter !== 'all') items = items.filter(u => u.category === filter);

    if (!items.length) {
        list.innerHTML = `<div class="empty-state"><i class="fas fa-file-excel"></i><p>Không có ứng dụng nào.</p></div>`;
        return;
    }

    list.innerHTML = items.map(u => `
        <div class="doc-item">
            <div class="doc-info">
                <i class="fas fa-file-excel" style="color: #217346;"></i>
                <div>
                    <div class="doc-title">${u.title || 'Ứng dụng Excel'}</div>
                    <div class="doc-desc">${u.desc || ''}</div>
                </div>
            </div>
            <div class="doc-actions">
                <a href="${u.preview}" target="_blank" rel="noopener"><i class="fas fa-eye"></i> Xem trước</a>
                <a href="${u.download}" download="${u.title || 'ungdung'}.xlsx"><i class="fas fa-download"></i> Tải xuống</a>
            </div>
        </div>
    `).join('');
}

// === RENDER LIÊN KẾT ===
function renderLinks() {
    const grid = document.getElementById('linksGrid');
    if (!LINKS || !LINKS.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-link"></i><p>Chưa có liên kết nào.</p></div>`;
        return;
    }
    grid.innerHTML = LINKS.map(link => `
        <div class="link-card">
            <div class="link-title">
                <i class="fas fa-external-link-alt"></i>
                ${link.title || 'Liên kết'}
            </div>
            <div class="link-desc">${link.desc || ''}</div>
            <div class="link-url">
                <a href="${link.url}" target="_blank" rel="noopener">${link.url}</a>
            </div>
        </div>
    `).join('');
}

// === HELPER: embed URL ===
function getEmbedUrl(url) {
    if (!url) return 'about:blank';
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    match = url.match(/vimeo\.com\/(\d+)/);
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
    if (url.includes('embed')) return url;
    return url;
}

// === LIGHTBOX ===
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxCaption.textContent = title || 'Ảnh';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
});

// === FILTER BUTTONS ===
document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.addEventListener('click', function(e) {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        this.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const section = this.closest('.section');
        if (!section) return;
        const sectionId = section.id.replace('section-', '');

        switch (sectionId) {
            case 'photos': renderPhotos(filter); break;
            case 'videos': renderVideos(filter); break;
            case 'documents': renderDocuments(filter); break;
            case 'chuyenmon': renderChuyenMon(filter); break;
            case 'ungdung': renderUngDung(filter); break;
        }
    });
});

// === NAVIGATION EVENTS ===
document.querySelectorAll('.nav-links button').forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.dataset.section;
        if (section) switchSection(section);
    });
});

document.getElementById('menuToggle').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('open');
});

// ============================================================
// TÍNH LƯƠNG – NHÚNG TRONG SECTION UNGDUNG (ĐÃ CẬP NHẬT TÙY CHỈNH TỶ LỆ)
// ============================================================
function calculateSalary() {
    // Lấy các input
    const hsLuong = document.getElementById('hsLuong');
    const hsPCCV = document.getElementById('hsPCCV');
    const hsPCKV = document.getElementById('hsPCKV');
    const hsPCTN = document.getElementById('hsPCTN');
    const pctn = document.getElementById('pctn');
    const hsYTe = document.getElementById('hsYTe');
    const hsUuDaiPct = document.getElementById('hsUuDaiPct');
    const hsDacBietPct = document.getElementById('hsDacBietPct');
    const luongCoSo = document.getElementById('luongCoSo');

    // Nếu không có các phần tử này (ví dụ không nằm trong trang) thì thoát
    if (!hsLuong) return;

    // Đọc giá trị
    const D = parseFloat(hsLuong.value) || 0;
    const E = parseFloat(hsPCCV.value) || 0;
    const F = parseFloat(hsPCKV.value) || 0;
    const H = parseFloat(hsPCTN.value) || 0;
    const N = parseFloat(pctn.value) || 0;
    const J = parseFloat(hsYTe.value) || 0;
    const uuDaiPct = parseFloat(hsUuDaiPct.value) || 0;
    const dacBietPct = parseFloat(hsDacBietPct.value) || 0;
    const LCS = parseFloat(luongCoSo.value) || 0;

    // Hàm làm tròn
    const round4 = (v) => Math.round(v * 10000) / 10000;
    const round0 = (v) => Math.round(v);

    // Tính các hệ số phụ cấp theo tỷ lệ tùy chỉnh
    const uuDai = round4((D + E) * (uuDaiPct / 100));
    const thamNien = round4((D + H) * N / 100);
    const dacBiet = round4((D + E) * (dacBietPct / 100));
    const tongHeSo = round4(D + E + F + uuDai + H + thamNien + J + dacBiet);
    const luongThang = round0(tongHeSo * LCS);
    const baseBH = D + E + thamNien; // I = thamNien
    const bhxh = round0(baseBH * LCS * 0.08);
    const bhyt = round0(baseBH * LCS * 0.015);
    const bhtn = round0(baseBH * LCS * 0.01);
    const tongTru = bhxh + bhyt + bhtn;
    const thucLanh = luongThang - tongTru;

    // Cập nhật kết quả
    const formatNum = (v, d = 4) => Number(v).toFixed(d);
    const formatCurrency = (v) => Math.round(v).toLocaleString('vi-VN');

    document.getElementById('kqUuDai').textContent = formatNum(uuDai);
    document.getElementById('kqThamNien').textContent = formatNum(thamNien);
    document.getElementById('kqDacBiet').textContent = formatNum(dacBiet);
    document.getElementById('kqTongHeSo').textContent = formatNum(tongHeSo, 4);
    document.getElementById('kqLuongThang').textContent = formatCurrency(luongThang) + ' ₫';
    document.getElementById('kqBHXH').textContent = formatCurrency(bhxh) + ' ₫';
    document.getElementById('kqBHYT').textContent = formatCurrency(bhyt) + ' ₫';
    document.getElementById('kqBHTN').textContent = formatCurrency(bhtn) + ' ₫';
    document.getElementById('kqTongTru').textContent = formatCurrency(tongTru) + ' ₫';
    document.getElementById('kqThucLanh').textContent = formatCurrency(thucLanh) + ' ₫';

    // Summary
    document.getElementById('sumHeSo').textContent = formatNum(tongHeSo, 4);
    document.getElementById('sumLuong').textContent = formatCurrency(luongThang) + ' ₫';
    document.getElementById('sumThucLanh').textContent = formatCurrency(thucLanh) + ' ₫';
}

// Gắn sự kiện cho các input trong form tính lương
function initSalaryCalculator() {
    const inputs = ['hsLuong', 'hsPCCV', 'hsPCKV', 'hsPCTN', 'pctn', 'hsYTe', 'hsUuDaiPct', 'hsDacBietPct', 'luongCoSo'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', calculateSalary);
            el.addEventListener('change', calculateSalary);
        }
    });
    // Tính lần đầu
    calculateSalary();
}

// === KHỞI TẠO ===
document.addEventListener('DOMContentLoaded', function() {
    renderBanner();
    renderPhotos('all');
    renderVideos('all');
    renderDocuments('all');
    renderChuyenMon('all');
    renderUngDung('all');
    renderLinks();
    updateBadges();
    switchSection('home');
    // Khởi tạo form tính lương
    initSalaryCalculator();
    console.log('✅ Website đã sẵn sàng với kho ứng dụng Excel và form tính lương tùy chỉnh!');
});