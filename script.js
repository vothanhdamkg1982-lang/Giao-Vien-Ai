/* ============================================================
   QUẢN LÝ TRANG THÁI & RENDER
   ============================================================ */

// Lấy dữ liệu từ biến toàn cục đã khai báo trong HTML
// (PHOTOS, VIDEOS, DOCUMENTS, LINKS)

// ===== Chuyển đổi section =====
function switchSection(sectionId) {
    // Ẩn tất cả section
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    // Hiển thị section được chọn
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');

    // Cập nhật trạng thái nút
    document.querySelectorAll('.nav-links button').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.nav-links button[data-section="${sectionId}"]`);
    if (btn) btn.classList.add('active');

    // Đóng menu mobile
    document.getElementById('navLinks').classList.remove('open');

    // Render lại nội dung nếu cần
    if (sectionId === 'photos') renderPhotos();
    if (sectionId === 'videos') renderVideos();
    if (sectionId === 'documents') renderDocuments();
    if (sectionId === 'links') renderLinks();
}

// ===== Cập nhật số lượng badge =====
function updateBadges() {
    document.getElementById('photoCount').textContent = PHOTOS.length;
    document.getElementById('videoCount').textContent = VIDEOS.length;
    document.getElementById('docCount').textContent = DOCUMENTS.length;
    document.getElementById('homePhotoCount').textContent = PHOTOS.length;
    document.getElementById('homeVideoCount').textContent = VIDEOS.length;
    document.getElementById('homeDocCount').textContent = DOCUMENTS.length;
}

// ===== Render ẢNH =====
function renderPhotos() {
    const grid = document.getElementById('photoGrid');
    if (!PHOTOS.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-images"></i><p>Chưa có ảnh nào.</p></div>`;
        return;
    }
    grid.innerHTML = PHOTOS.map(p => `
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

    // Gắn sự kiện click vào ảnh để mở lightbox
    document.querySelectorAll('#photoGrid .gallery-item img').forEach((img, index) => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.gallery-item');
            const id = item.dataset.id;
            const photo = PHOTOS.find(p => p.id === id);
            if (photo) openLightbox(photo.url, photo.title || '');
        });
    });
}

// ===== Render VIDEO =====
function renderVideos() {
    const grid = document.getElementById('videoGrid');
    if (!VIDEOS.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-video"></i><p>Chưa có video nào.</p></div>`;
        return;
    }
    grid.innerHTML = VIDEOS.map(v => {
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

// ===== Render TÀI LIỆU =====
function renderDocuments() {
    const list = document.getElementById('docList');
    if (!DOCUMENTS.length) {
        list.innerHTML = `<div class="empty-state"><i class="fas fa-folder-open"></i><p>Chưa có tài liệu nào.</p></div>`;
        return;
    }
    list.innerHTML = DOCUMENTS.map(d => `
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
    // YouTube
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    // Vimeo
    match = url.match(/vimeo\.com\/(\d+)/);
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
    // Nếu đã là embed
    if (url.includes('embed')) return url;
    // Mặc định
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

// Sự kiện đóng lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
});

// ============================================================
// KHỞI TẠO
// ============================================================
// Navigation events
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

// Render ban đầu
renderPhotos();
renderVideos();
renderDocuments();
renderLinks();
updateBadges();

// Mặc định hiện trang chủ
switchSection('home');

console.log('✅ Website đã sẵn sàng!');
console.log('📦 Dữ liệu được khai báo trong file HTML (mảng PHOTOS, VIDEOS, DOCUMENTS, LINKS).');
console.log('💡 Bạn có thể thêm/sửa/xóa trực tiếp trong các mảng đó.');