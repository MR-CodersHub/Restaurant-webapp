const blogPosts = [
    {
        id: 1,
        slug: 'perfect-smoked-ribs',
        title: 'The Secret to Perfect Smoked Ribs',
        subtitle: 'Mastering the low and slow art of smoking meat.',
        author: 'Chef Antonio',
        publish_date: 'Oct 12, 2025',
        category: 'Recipes',
        hero_image: 'assets/download.jpg',
        content: `
            <p>Smoking ribs is an art form that requires patience.</p>
            <h3>The Rub</h3>
            <p>Use brown sugar, paprika and cayenne.</p>
        `,
        tags: ['bbq', 'ribs'],
        related_posts: [2]
    },
    {
        id: 2,
        slug: 'pairing-wine-with-spices',
        title: 'Pairing Wine with Spices',
        subtitle: 'Elevate your dining with the perfect wine pairing.',
        author: 'Sommelier Elena',
        publish_date: 'Sep 28, 2025',
        category: "Chef's Corner",
        hero_image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=1920',
        content: `
            <p>Wine and spice should complement each other.</p>
        `,
        tags: ['wine'],
        related_posts: [1]
    },
    {
        id: 3,
        slug: 'art-of-wood-fired-cooking',
        title: 'The Art of Wood-Fired Cooking',
        subtitle: 'Discover deeper flavors and textures that only traditional techniques can unlock.',
        author: 'Chef Antonio',
        publish_date: 'Nov 05, 2025',
        category: "Editor's Pick",
        hero_image: 'assets/bgimg.jpg',
        content: `
            <p>Cooking with wood fire is a profound return to our primal roots. It's not simply about applying heat; it's about infusing a dish with the very essence of the forest.</p>
            <p>Unlike modern gas or electric ranges, a wood-burning hearth provides a dynamic, living heat. The flames lick the ingredients, searing in juices instantly, while the gentle, ambient smoke envelopes each morsel.</p>
            
            <h3>Understanding Heat Zones</h3>
            <p>The secret of a master pitmaster or wood-fire chef is understanding the gradient of heat. The fierce white coals offer blistering temperatures for the perfect crust on a wagyu steak, while the cooler edges slow-roast robust vegetables until they are meltingly tender.</p>
            
            <blockquote>
                "Fire is an ingredient unto itself. You must respect it, understand its moods, and let it lead the flavor profile."
            </blockquote>
        `,
        tags: ['wood-fired', 'techniques', 'traditional'],
        related_posts: [1, 4]
    },
    {
        id: 4,
        slug: 'behind-the-scenes-kitchen',
        title: 'Behind the Scenes: Our Kitchen',
        subtitle: 'Take a tour of where the magic happens and meet the team.',
        author: 'Chef Antonio',
        publish_date: 'Sep 10, 2025',
        category: 'Culture',
        hero_image: 'assets/about.jpg',
        content: `
            <p>Step through the swinging doors and into the beating heart of Woods & Spices.</p>
            <p>To our guests, the dining room presents an oasis of calm, low lighting, and soft music. But behind the scenes, a choreographed tempest of organized chaos reigns supreme. Our kitchen operates with the precision of a high-end symphony, where every chef knows exactly when to play their part.</p>
            
            <h3>The Morning Prep</h3>
            <p>The magic begins long before the first reservation arrives. By 6:00 AM, our prep teams are already breaking down whole sustainable fish, simmering bone broths that require 24 hours of attention, and baking fresh sourdough loaves.</p>

            <h3>The Line during Service</h3>
            <p>When tickets start printing, communication becomes binary and rapid: "Yes, Chef!", "Ordering one ribeye, medium rare!", "Fire course two!". It relies entirely on trust between colleagues who are passionate about delivering an exceptional culinary experience.</p>
        `,
        tags: ['behind-the-scenes', 'team', 'kitchen-life'],
        related_posts: [2, 3]
    }
];

window.blogData = blogPosts;