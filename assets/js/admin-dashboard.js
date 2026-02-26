document.addEventListener('DOMContentLoaded', () => {
    // Check if admin is logged in (using auth.js instance if available, or session check)
    // auth.js runs checkSession on load, but we might race. 
    // We can rely on the fact that if checkSession fails, auth.js redirects or updates UI.
    // Ideally we wait for auth.

    setTimeout(() => {
        fetchUsers();
        fetchBlogs();
    }, 500); // Small delay to allow auth to settle

    // Modal Logic
    const modal = document.getElementById('blogModal');
    const addBtn = document.getElementById('addBlogBtn');
    const closeBtn = document.querySelector('.close-modal');

    addBtn.onclick = () => modal.style.display = 'flex';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = 'none';
    };

    // Create Blog
    document.getElementById('createBlogForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('blogTitle').value;
        const content = document.getElementById('blogContent').value;
        const imageFile = document.getElementById('blogImage').files[0];

        // Reader for image if needed, but for now we just use a placeholder or handle it simply in local storage strings
        // Since we can't easily upload files to a serverless backend without an external service, we'll use a placeholder or base64 if really needed.
        // For this refactor, we stick to the existing offline logic which used a path string.

        const newBlog = {
            id: Date.now(),
            title: title,
            content: content,
            excerpt: content.substring(0, 100) + '...',
            image_path: 'assets/bgimg.jpg', // Default or placeholder
            author_id: auth.currentUser ? auth.currentUser.id : 1,
            author_name: auth.currentUser ? auth.currentUser.name : 'Admin',
            created_at: new Date().toISOString()
        };

        const offlineBlogs = JSON.parse(localStorage.getItem('offlineBlogs') || '[]');
        offlineBlogs.push(newBlog);
        localStorage.setItem('offlineBlogs', JSON.stringify(offlineBlogs));

        alert('Blog published successfully!');
        modal.style.display = 'none';
        document.getElementById('createBlogForm').reset();
        fetchBlogs();
    });

    // Logout handled by auth.js
});

async function fetchUsers() {
    let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    // Add default admin if not present
    if (!users.find(u => u.email === 'admin@gmail.com')) {
        users.unshift({ id: 1, name: 'Admin', email: 'admin@gmail.com', role: 'admin', created_at: new Date().toISOString() });
    }

    const tbody = document.getElementById('users-table-body');
    if (tbody) {
        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 12px; border-bottom: 1px solid #eee;">#${user.id}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${user.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${user.email}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <span style="background: ${user.role === 'admin' ? 'var(--dark-garnet)' : '#eee'}; color: ${user.role === 'admin' ? 'white' : '#333'}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                        ${user.role}
                    </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

async function fetchBlogs() {
    const blogs = JSON.parse(localStorage.getItem('offlineBlogs') || '[]');

    const grid = document.getElementById('blogs-grid');
    if (grid) {
        grid.innerHTML = '';
        if (blogs.length === 0) {
            grid.innerHTML = '<p>No blogs found.</p>';
        } else {
            blogs.forEach(blog => {
                const card = document.createElement('div');
                card.className = 'dashboard-card';
                card.style.background = 'white';
                card.style.border = '1px solid #eee';
                card.style.borderRadius = '8px';
                card.style.padding = '15px';

                card.innerHTML = `
                   <div style="height: 150px; background: #eee; margin-bottom: 15px; border-radius: 4px; overflow: hidden;">
                        <img src="${blog.image_path || 'assets/bgimg.jpg'}" style="width: 100%; height: 100%; object-fit: cover;">
                   </div>
                   <h4 style="color: var(--auburn); margin-bottom: 10px;">${blog.title}</h4>
                   <p style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">By ${blog.author_name || 'User'}</p>
                   <div style="display: flex; justify-content: space-between;">
                       <button onclick="deleteBlog(${blog.id})" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
                   </div>
                `;
                grid.appendChild(card);
            });
        }
    }
}

async function deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    let offlineBlogs = JSON.parse(localStorage.getItem('offlineBlogs') || '[]');
    const updatedBlogs = offlineBlogs.filter(b => b.id !== id);

    localStorage.setItem('offlineBlogs', JSON.stringify(updatedBlogs));
    alert('Blog deleted successfully.');
    fetchBlogs();
}
