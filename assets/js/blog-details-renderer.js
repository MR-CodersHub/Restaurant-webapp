document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const blogId = parseInt(urlParams.get('id'));
    const blogSlug = urlParams.get('slug');

    const blogBannerSection = document.getElementById('blog-banner-section');
    const blogTitleElem = document.getElementById('blog-title');
    const blogMetaElem = document.getElementById('blog-meta');
    const blogContentElem = document.getElementById('blog-content');
    const relatedPostsList = document.getElementById('related-posts-list');
    const mainContent = document.getElementById('main-blog-content');
    const notFoundSection = document.getElementById('not-found-section');
    const progressBar = document.getElementById('reading-progress');

    const blogPosts = window.blogData || [];

    let post = null;

    if (blogId) {
        post = blogPosts.find(p => p.id === blogId);
    } else if (blogSlug) {
        post = blogPosts.find(p => p.slug === blogSlug);
    }

    if (!post && !blogId && !blogSlug && blogPosts.length > 0) {
        post = blogPosts[0];
    }

    if (post) {

        document.title = `${post.title} | Woods & Spices`;

        if (blogBannerSection) {
            blogBannerSection.style.backgroundImage =
                `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${post.hero_image}')`;
        }

        if (blogTitleElem) {
            blogTitleElem.textContent = post.title;
        }

        if (blogMetaElem) {
            blogMetaElem.innerHTML = `
                <span><i class="fa-solid fa-calendar"></i> ${post.publish_date}</span>
                &nbsp;|&nbsp;
                <span><i class="fa-solid fa-user"></i> ${post.author}</span>
                &nbsp;|&nbsp;
                <span style="color: var(--ceramic-yellow);">
                    <i class="fa-solid fa-tag"></i> ${post.category}
                </span>
            `;
        }

        let contentHtml = `
            <p style="font-size: 1.25rem; font-style: italic; color: #555; margin-bottom: 30px;">
                ${post.subtitle || ''}
            </p>
        `;

        let mainContentStr = (post.content || '').trim();

        if (mainContentStr.startsWith('<p>')) {
            mainContentStr = mainContentStr.replace('<p>', '<p class="drop-cap">');
        }

        contentHtml += mainContentStr;

        if (post.tags && post.tags.length > 0) {
            const tagsHtml = post.tags
                .map(tag => `<span class="tag">#${tag}</span>`)
                .join('');

            contentHtml += `
                <div style="margin-top: 40px;">
                    <strong>Tags:</strong>
                    <div style="display:inline-flex; gap: 10px; flex-wrap: wrap; margin-left: 10px;">
                        ${tagsHtml}
                    </div>
                </div>
            `;
        }

        if (blogContentElem) {
            blogContentElem.innerHTML = contentHtml;
        }

        if (post.related_posts && relatedPostsList) {

            relatedPostsList.innerHTML = '';

            post.related_posts.forEach(relatedId => {

                const rp = blogPosts.find(p => p.id === relatedId);

                if (rp) {
                    relatedPostsList.innerHTML += `
                        <li style="margin-bottom: 20px;">
                            <a href="blog-details.html?id=${rp.id}"
                               class="related-post-link"
                               style="display:flex; gap: 15px; text-decoration: none;">
                                <img src="${rp.hero_image}"
                                     loading="lazy"
                                     alt="${rp.title}"
                                     style="width: 70px; height: 70px; object-fit: cover; border-radius: 5px;">
                                <div>
                                    <strong style="color: var(--bordeaux); display:block; line-height: 1.3;">
                                        ${rp.title}
                                    </strong>
                                    <span style="font-size: 0.8rem; color: #888;">
                                        ${rp.publish_date}
                                    </span>
                                </div>
                            </a>
                        </li>
                    `;
                }

            });
        }

    } else {

        if (mainContent) mainContent.style.display = 'none';
        if (blogBannerSection) blogBannerSection.style.display = 'none';
        if (notFoundSection) notFoundSection.style.display = 'flex';

        document.title = "Post Not Found | Woods & Spices";
    }

    window.addEventListener('scroll', () => {

        const winScroll = document.documentElement.scrollTop;
        const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const scrolled = (winScroll / height) * 100;

        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    });

});