/* ============================================================
   QUẢN LÝ TRANG THÁI & RENDER
   ============================================================ */

// Lấy dữ liệu từ biến toàn cục đã khai báo trong HTML
// (PHOTOS, VIDEOS, DOCUMENTS, CHUYENMON, LINKS)

// ---- Slide cho banner động ----
const SLIDES = [
    {
        title: 'Võ Thanh Đậm',
        desc: 'Giáo viên Tin học 🎓 Trường Tiểu học Trần Quốc Toản, Đặc khu Kiên Hải, An Giang',
        btnText: 'Tìm hiểu thêm',
        btnLink: '#section-teacher',
        bg: 'https://dicresco.vn/wp-content/uploads/2023/04/background-banner-dep.jpg'
    },
    {
        title: '24 năm cống hiến',
        desc: 'Tận tâm với sự nghiệp trồng người, không ngừng đổi mới sáng tạo',
        btnText: 'Xem thành tích',
        btnLink: '#section-documents',
        bg: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=1200&q=80'
    },
    {
        title: 'Ứng dụng công nghệ',
        desc: 'Đưa CNTT vào giảng dạy, tạo hứng thú cho học sinh',
        btnText: 'Khám phá',
        btnLink: '#section-ungdung',
        bg: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80'
    }
];

// ===== Chuyển đổi section =====
function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-links button').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.nav-links button[data-section="${sectionId}"]`);
    if (btn) btn.classList.add('active');

    document.getElementById('navLinks').classList.remove('open');

    // Render dữ liệu khi vào section
    if (sectionId === 'photos') renderPhotos(getActiveFilter('photoFilterBar'));
    if (sectionId === 'videos') renderVideos(getActiveFilter('videoFilterBar'));
    if (sectionId === 'documents') renderDocuments(getActiveFilter('docFilterBar'));
    if (sectionId === 'chuyenmon') renderChuyenMon(getActiveFilter('chuyenmonFilterBar'));
    if (sectionId === 'links') renderLinks();
}

// ===== Lấy filter đang active =====
function getActiveFilter(barId) {
    const bar = document.getElementById(barId);
    if (!bar) return 'all';
    const activeBtn = bar.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}

// ===== Cập nhật số lượng badge =====
function updateBadges() {
    document.getElementById('photoCount').textContent = PHOTOS.length;
    document.getElementById('videoCount').textContent = VIDEOS.length;
    document.getElementById('docCount').textContent = DOCUMENTS.length;
    document.getElementById('chuyenmonCount').textContent = CHUYENMON.length;
    document.getElementById('homePhotoCount').textContent = PHOTOS.length;
    document.getElementById('homeVideoCount').textContent = VIDEOS.length;
    document.getElementById('homeDocCount').textContent = DOCUMENTS.length;
}

// ============================================================
// BANNER SLIDER
// ============================================================
let currentSlide = 0;
let slideInterval;

function renderBanner() {
    const wrapper = document.getElementById('bannerSlidesWrapper');
    const dotsContainer = document.getElementById('bannerDots');

    // Tạo các slide
    wrapper.innerHTML = SLIDES.map((slide, index) => `
        <div class="banner-slide ${index === 0 ? 'active' : ''}" 
             style="background-image: url('${slide.bg}');" 
             data-index="${index}">
            <div class="banner-content">
                <h1>${slide.title}</h1>
                <p>${slide.desc}</p>
                <a href="${slide.btnLink}" class="btn-banner" onclick="switchSection('${slide.btnLink.replace('#section-', '')}')">${slide.btnText}</a>
            </div>
        </div>
    `).join('');

    // Tạo dots
    dotsContainer.innerHTML = SLIDES.map((_, index) => `
        <span class="banner-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
    `).join('');

    // Gắn sự kiện cho dots
    document.querySelectorAll('.banner-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            goToSlide(index);
        });
    });

    // Nút điều hướng
    document.getElementById('bannerPrev').addEventListener('click', () => goToSlide(currentSlide - 1));
    document.getElementById('bannerNext').addEventListener('click', () => goToSlide(currentSlide + 1));

    // Tự động chạy
    startAutoSlide();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    const total = slides.length;

    // Xử lý vòng lặp
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    // Ẩn tất cả
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // Hiển thị slide mới
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;

    // Reset timer tự động
    resetAutoSlide();
}

function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000); // 5 giây
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Khởi tạo banner khi trang load
document.addEventListener('DOMContentLoaded', function() {
    renderBanner();
});
// ===== Render ẢNH (có lọc) =====
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

    // Lightbox cho ảnh
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

// ===== Render VIDEO (có lọc) =====
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

// ===== Render TÀI LIỆU (có lọc) =====
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

// ===== Render CHUYÊN MÔN (có lọc) =====
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
        if (c.type === 'video') icon = 'fa-video';
        else if (c.type === 'image') icon = 'fa-image';
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
                    <a href="${c.url}" download="${c.title || 'chuyenmon'}.pdf"><i class="fas fa-download"></i> Tải xuống</a>
                </div>
            </div>
        `;
    }).join('');
}

// ===== Render LIÊN KẾT =====
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

// ===== Helper: lấy embed URL cho video =====
function getEmbedUrl(url) {
    if (!url) return 'about:blank';
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    match = url.match(/vimeo\.com\/(\d+)/);
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
    if (url.includes('embed')) return url;
    return url;
}

// ============================================================
// LIGHTBOX (toàn màn hình)
// ============================================================
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

// ============================================================
// FILTER BUTTONS
// ============================================================
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
        }
    });
});

// ============================================================
// NAVIGATION EVENTS
// ============================================================
document.querySelectorAll('.nav-links button').forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.dataset.section;
        if (section) switchSection(section);
    });
});

// Menu mobile
document.getElementById('menuToggle').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('open');
});

// ============================================================
// KHỞI TẠO
// ============================================================
renderPhotos('all');
renderVideos('all');
renderDocuments('all');
renderChuyenMon('all');
renderLinks();
updateBadges();
switchSection('home');

console.log('✅ Website đã sẵn sàng với giao diện mới!');