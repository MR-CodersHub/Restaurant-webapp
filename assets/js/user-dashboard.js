document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        if (auth.currentUser) {
            fetchMyBlogs(auth.currentUser.id);
        }
    }, 1000);

    // Modal Logic
    const modal = document.getElementById('blogModal');
    const addBtn = document.getElementById('addBlogBtn');
    const closeBtn = document.querySelector('.close-modal');

    if (addBtn) {
        addBtn.onclick = () => modal.style.display = 'flex';
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => {
            if (e.target == modal) modal.style.display = 'none';
        };
    }

    // Create Blog
    const createForm = document.getElementById('createBlogForm');
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('blogTitle').value;
            const content = document.getElementById('blogContent').value;
            const imageFile = document.getElementById('blogImage').files[0];

            // Use logic exclusively for local storage
            const newBlog = {
                id: Date.now(),
                title: title,
                content: content,
                excerpt: content.substring(0, 100) + '...',
                image_path: 'assets/bgimg.jpg', // Default image for offline
                author_id: auth.currentUser ? auth.currentUser.id : 0,
                created_at: new Date().toISOString()
            };

            const offlineBlogs = JSON.parse(localStorage.getItem('offlineBlogs') || '[]');
            offlineBlogs.push(newBlog);
            localStorage.setItem('offlineBlogs', JSON.stringify(offlineBlogs));

            alert('Blog published successfully!');
            modal.style.display = 'none';
            createForm.reset();
            if (auth.currentUser) fetchMyBlogs(auth.currentUser.id);
        });
    }
});

async function fetchMyBlogs(userId) {
    let blogs = [];

    // Get offline blogs
    const offlineBlogs = JSON.parse(localStorage.getItem('offlineBlogs') || '[]');
    blogs = offlineBlogs.filter(b => b.author_id == userId);

    const grid = document.getElementById('blogs-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (blogs.length === 0) {
        grid.innerHTML = '<p>No blogs found. Create your first story!</p>';
        return;
    }

    blogs.forEach(blog => {
        const card = document.createElement('div');
        card.style.background = 'white';
        card.style.border = '1px solid #eee';
        card.style.borderRadius = '8px';
        card.style.padding = '15px';

        card.innerHTML = `
            <div style="height: 150px; background: #eee; margin-bottom: 15px; border-radius: 4px; overflow: hidden;">
                <img src="${blog.image_path || 'assets/bgimg.jpg'}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h4 style="color: var(--auburn); margin-bottom: 10px;">${blog.title}</h4>
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">${new Date(blog.created_at).toLocaleDateString()}</p>
            <div style="display: flex; justify-content: space-between;">
                <button onclick="deleteBlog(${blog.id})" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    let offlineBlogs = JSON.parse(localStorage.getItem('offlineBlogs') || '[]');
    const originalLength = offlineBlogs.length;
    offlineBlogs = offlineBlogs.filter(b => b.id !== id);

    if (offlineBlogs.length < originalLength) {
        localStorage.setItem('offlineBlogs', JSON.stringify(offlineBlogs));
        alert('Blog deleted successfully.');
        if (auth.currentUser) fetchMyBlogs(auth.currentUser.id);
    }
}
