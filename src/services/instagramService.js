/**
 * Instagram Travel Intelligence Integration Service
 *
 * Supported Open-Source Frameworks & Libraries:
 * 1. subzeroid/instagrapi (Python SDK) - https://github.com/subzeroid/instagrapi
 *    - `pip install instagrapi`
 *    - The #1 most popular Python library for Instagram's private mobile API (>5k stars).
 *    - Supports hashtag media search, location geotag exploration, Reel scraping, and creator metadata.
 *
 * 2. dilame/instagram-private-api (Node.js / TypeScript) - https://github.com/dilame/instagram-private-api
 *    - `npm install instagram-private-api`
 *    - Industry standard Node.js client for Instagram API.
 *    - Supports `ig.feed.tag(hashtag).items()`, `ig.feed.location(locationId).items()`.
 *
 * 3. instaloader/instaloader (Python CLI & Module) - https://github.com/instaloader/instaloader
 *    - `pip install instaloader` (>8k stars)
 *    - Downloads public posts, reels, hashtags, geotags, and metadata.
 *
 * 4. Meta Instagram Graph API (Official Enterprise) - https://developers.facebook.com/docs/instagram-api/
 *    - Official Meta Graph API for Business/Creator accounts with `/ig_hashtag_search`.
 */

// Production Python Backend Example using `instagrapi`
export const INSTAGRAPI_BACKEND_SNIPPET = `
# backend/instagram_gateway.py
# Install: pip install instagrapi fastapi uvicorn
from fastapi import FastAPI, Query
from instagrapi import Client

app = FastAPI(title="EscapePlan Instagram Travel Gateway")
cl = Client()
# cl.login("your_ig_username", "your_ig_password") # Or use session settings

@app.get("/api/instagram/hashtag")
def get_travel_reels(tag: str = Query("tokyotravel"), amount: int = Query(9)):
    """Search trending Instagram reels & photos by hashtag"""
    medias = cl.hashtag_medias_top(tag, amount=amount)
    results = []
    for m in medias:
        results.append({
            "id": m.pk,
            "code": m.code,
            "url": f"https://www.instagram.com/p/{m.code}/",
            "caption": m.caption_text,
            "likes": m.like_count,
            "comments": m.comment_count,
            "media_type": "reel" if m.media_type == 2 else "photo",
            "user": m.user.username,
            "thumbnail_url": m.thumbnail_url or m.video_url
        })
    return {"hashtag": tag, "items": results}

@app.get("/api/instagram/location")
def get_location_spots(location_query: str = Query("Shibuya Crossing")):
    """Find location ID and retrieve top geotagged media"""
    locations = cl.location_search(location_query)
    if not locations:
        return {"error": "Location not found"}
    loc = locations[0]
    medias = cl.location_medias_top(loc.pk, amount=6)
    return {"location": loc.name, "items": [m.dict() for m in medias]}
`;

// Production Node.js Backend Example using `instagram-private-api`
export const NODE_INSTAGRAM_API_SNIPPET = `
// backend/instagramService.ts
// Install: npm install instagram-private-api
import { IgApiClient } from 'instagram-private-api';

const ig = new IgApiClient();
// ig.state.generateDevice(process.env.IG_USERNAME);
// await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

export async function fetchHashtagTravelFeed(tag: string) {
  const tagFeed = ig.feed.tag(tag);
  const items = await tagFeed.items();
  return items.map(item => ({
    id: item.pk,
    code: item.code,
    caption: item.caption?.text || '',
    likes: item.like_count,
    user: item.user.username,
    url: \`https://www.instagram.com/p/\${item.code}/\`
  }));
}
`;

/**
 * Curated High-Engagement Instagram Travel Media for Popular Destinations
 */
export const INSTAGRAM_TRAVEL_DATABASE = {
  Tokyo: [
    {
      id: 'ig-tokyo-01',
      code: 'DB_tokyo_01',
      username: 'tokyo.aesthetic',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      mediaType: 'reel',
      duration: '0:28',
      likes: '42.8k',
      comments: '632',
      thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      caption: 'The most photogenic viewpoint in Tokyo that 90% of tourists miss 🌇 Save this spot for your golden hour shots!',
      hashtags: ['#tokyotravel', '#shibuyasky', '#japantrip', '#tokyoaesthetic', '#travelreels'],
      location: 'Shibuya Sky Observatory',
      category: 'Golden Hour & Views'
    },
    {
      id: 'ig-tokyo-02',
      code: 'DB_tokyo_02',
      username: 'japan_food_guide',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      mediaType: 'reel',
      duration: '0:45',
      likes: '89.4k',
      comments: '1,420',
      thumbnail: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
      caption: 'Hidden handmade soba masterclass in Tsukiji! Chef Hiro has been rolling noodles for 48 years 🍜✨',
      hashtags: ['#tokyofood', '#tsukiji', '#sobanoodles', '#japanesefood', '#hiddenjapan'],
      location: 'Tsukiji Soba Workshop',
      category: 'Foodie Gems'
    },
    {
      id: 'ig-tokyo-03',
      code: 'DB_tokyo_03',
      username: 'wanderlust_charlie',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      mediaType: 'photo',
      duration: null,
      likes: '24.1k',
      comments: '318',
      thumbnail: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80',
      caption: 'Asakusa Senso-ji Temple at 7:15 AM before the tour buses arrive. Completely peaceful and breathtaking.',
      hashtags: ['#sensoji', '#asakusa', '#tokyocameraclub', '#quietmornings', '#tokyophotography'],
      location: 'Senso-ji, Asakusa',
      category: 'Aesthetic Photography'
    },
    {
      id: 'ig-tokyo-04',
      code: 'DB_tokyo_04',
      username: 'nightlife.tokyo',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      mediaType: 'reel',
      duration: '0:34',
      likes: '61.5k',
      comments: '895',
      thumbnail: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&q=80',
      caption: 'Cyberpunk rainy night in Shinjuku & Omoide Yokocho with neon reflections ☔🍶 Best yakitori alley!',
      hashtags: ['#shinjuku', '#omoideyokocho', '#tokyonight', '#cyberpunk', '#traveltokyo'],
      location: 'Omoide Yokocho, Shinjuku',
      category: 'Nightlife & Vibes'
    }
  ],
  Kyoto: [
    {
      id: 'ig-kyoto-01',
      code: 'DB_kyoto_01',
      username: 'kyoto.journal',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      mediaType: 'reel',
      duration: '0:31',
      likes: '73.2k',
      comments: '1,120',
      thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      caption: 'The secret upper paths of Fushimi Inari with zero crowds. Keep climbing past the halfway mark! ⛩️',
      hashtags: ['#kyototravel', '#fushimiinari', '#japanhidden', '#kyotophoto'],
      location: 'Fushimi Inari Shrine',
      category: 'Scenic Shrines'
    }
  ]
};

/**
 * Generate Instagram Explore Tag URL
 */
export function generateInstagramTagUrl(tag = 'tokyotravel') {
  const cleanTag = tag.replace(/^#/, '').toLowerCase();
  return `https://www.instagram.com/explore/tags/${encodeURIComponent(cleanTag)}/`;
}

/**
 * Fetch Instagram Travel Posts for Destination
 */
export function getInstagramPostsForDestination(destination = 'Tokyo') {
  return INSTAGRAM_TRAVEL_DATABASE[destination] || INSTAGRAM_TRAVEL_DATABASE['Tokyo'];
}

/**
 * Get Instagram Spot Tips matching activity
 */
export function getInstagramSpotForActivity(activityTitle, destination = 'Tokyo') {
  const posts = getInstagramPostsForDestination(destination);
  const matched = posts.find(p =>
    activityTitle.toLowerCase().includes(p.location.toLowerCase().split(' ')[0]) ||
    p.caption.toLowerCase().includes(activityTitle.toLowerCase().slice(0, 4))
  );
  return matched || posts[0];
}
