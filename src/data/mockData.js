export const INITIAL_TRAVELERS = [
  {
    id: 'alice',
    name: 'Alice Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    role: 'Food & Budget Guardian',
    agentName: 'Alice-Bot (Gourmet & Thrift)',
    agentAvatar: '🍲',
    agentTone: 'Direct, value-conscious, food-obsessed',
    budgetDaily: 150,
    preferredWakeUp: '08:00 AM',
    walkingLimitSteps: 12000,
    dietary: 'Pescatarian / Ramen Lover',
    vibe: 'Budget Foodie',
    privateNotes: "I love authentic hidden gems. I secretly hate paying $200+ for meals where portions are tiny. Also need coffee immediately upon waking.",
    chips: 150,
    seatNumber: 1,
    tableStatus: 'thinking', // 'ready', 'thinking', 'vetoed', 'compromised'
    speechBubble: null,
  },
  {
    id: 'bob',
    name: 'Bob Martinez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    role: 'Thrill & Nightlife Enthusiast',
    agentName: 'Bob-Bot (Adrenaline & Vibes)',
    agentAvatar: '⚡',
    agentTone: 'High-energy, spontaneous, experiences-over-sleep',
    budgetDaily: 350,
    preferredWakeUp: '10:30 AM',
    walkingLimitSteps: 25000,
    dietary: 'No restrictions / Loves Craft Beer',
    vibe: 'Night Owl Adventurer',
    privateNotes: "Do NOT make me wake up before 10 AM on vacation! I want neon lights, Shibuya nightlife, VR gaming arcades, and rooftop bars.",
    chips: 350,
    seatNumber: 2,
    tableStatus: 'ready',
    speechBubble: null,
  },
  {
    id: 'charlie',
    name: 'Charlie Zhang',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    role: 'Art, Photo & Zen Curator',
    agentName: 'Charlie-Bot (Aesthetic & Pace)',
    agentAvatar: '📷',
    agentTone: 'Thoughtful, calm, mindful of group fatigue',
    budgetDaily: 220,
    preferredWakeUp: '09:00 AM',
    walkingLimitSteps: 8000,
    dietary: 'Specialty Cafes & Matcha',
    vibe: 'Mindful Culturalist',
    privateNotes: "I get overwhelmed if we rush through 5 places a day. I need at least 1.5 hours in TeamLab or quiet gardens, and frequent cafe pauses to recharge.",
    chips: 220,
    seatNumber: 3,
    tableStatus: 'ready',
    speechBubble: null,
  }
];

export const INITIAL_ITINERARY = [
  {
    day: 1,
    date: 'Nov 12, 2026',
    title: 'Arrival & Neon Awakening: Shinjuku & Omoide Yokocho',
    theme: 'Low-friction arrival & iconic Tokyo neon',
    consensusScore: 94,
    items: [
      {
        id: 'item-1-1',
        time: '14:00 - 15:30',
        title: 'Check-in: Hotel Groove Shinjuku (Kabukicho Tower)',
        type: 'stay',
        category: 'Hotel',
        costPerPerson: 85,
        advocate: 'Charlie-Bot (Central & sleek aesthetics)',
        description: 'Easy base station with direct airport limousine bus stop. No hauling bags across train transfers.',
        status: 'confirmed',
        location: 'Shinjuku'
      },
      {
        id: 'item-1-2',
        time: '16:30 - 18:30',
        title: 'Shinjuku Gyoen National Garden & Matcha Tea',
        type: 'activity',
        category: 'Nature / Culture',
        costPerPerson: 5,
        advocate: 'Charlie-Bot (Gentle walking pace to shake jet lag)',
        description: 'Autumn foliage stroll and traditional teahouse rest.',
        status: 'confirmed',
        location: 'Shinjuku'
      },
      {
        id: 'item-1-3',
        time: '19:30 - 21:30',
        title: 'Omoide Yokocho (Memory Lane) Yakitori Crawl',
        type: 'dining',
        category: 'Food & Drinks',
        costPerPerson: 28,
        advocate: 'Alice-Bot (Unmatched value & smokey vibes)',
        description: 'Small alleyway izakayas with charcoal skewers, cold draft highballs, and lively atmosphere.',
        status: 'confirmed',
        location: 'West Shinjuku'
      },
      {
        id: 'item-1-4',
        time: '22:00 - late',
        title: 'Golden Gai Bar Hopping (Optional for Night Owls)',
        type: 'nightlife',
        category: 'Nightlife',
        costPerPerson: 35,
        advocate: 'Bob-Bot (Bob goes; Alice & Charlie can opt out)',
        description: 'Intimate 6-seat micro bars. Perfect split-itinerary flexibility!',
        status: 'optional',
        location: 'Golden Gai'
      }
    ]
  },
  {
    day: 2,
    date: 'Nov 13, 2026',
    title: 'Future Tech vs Heritage: Akihabara & Asakusa',
    theme: 'Balancing Bob’s gaming thrills with Charlie’s photo spots',
    consensusScore: 89,
    items: [
      {
        id: 'item-2-1',
        time: '10:00 - 11:30',
        title: 'Brunch: Fuglen Asakusa (Specialty Waffles & Pour-Over)',
        type: 'dining',
        category: 'Brunch',
        costPerPerson: 16,
        advocate: 'Charlie-Bot (Respects Bob’s 10am sleep schedule)',
        description: 'Norwegian-Japanese heritage cafe with incredible pastries and zero rush.',
        status: 'confirmed',
        location: 'Asakusa'
      },
      {
        id: 'item-2-2',
        time: '12:00 - 14:00',
        title: 'Senso-ji Temple & Nakamise Craft Alley',
        type: 'activity',
        category: 'Culture & Photo',
        costPerPerson: 0,
        advocate: 'Charlie-Bot & Alice-Bot (Street snacks & fortune slips)',
        description: 'Oldest temple in Tokyo, melonpan snacks, incense ceremony.',
        status: 'confirmed',
        location: 'Asakusa'
      },
      {
        id: 'item-2-3',
        time: '14:30 - 17:30',
        title: 'Akihabara Arcade Odyssey & Retro Game Vaults',
        type: 'activity',
        category: 'Entertainment',
        costPerPerson: 30,
        advocate: 'Bob-Bot (Taiko no Tatsujin, Gachapon, VR)',
        description: 'Multi-floor arcade battles and retro gaming culture.',
        status: 'confirmed',
        location: 'Akihabara'
      },
      {
        id: 'item-2-4',
        time: '18:30 - 20:30',
        title: 'Kikanbo Devil Spicy Ramen & Craft Beer',
        type: 'dining',
        category: 'Dinner',
        costPerPerson: 22,
        advocate: 'Alice-Bot (Custom spice & numbing pepper levels for all)',
        description: 'Famous demon drum ramen. Veggie miso broth option available for dietary needs.',
        status: 'confirmed',
        location: 'Kanda'
      }
    ]
  },
  {
    day: 3,
    date: 'Nov 14, 2026',
    title: 'Sensory Art & Tokyo Bay Harbor Escape',
    theme: 'teamLab Planets & Odaiba Sunset Cruiser',
    consensusScore: 78,
    disruptionRisk: 'HIGH - Coastal Typhoon Warning Active',
    items: [
      {
        id: 'item-3-1',
        time: '10:30 - 13:00',
        title: 'teamLab Planets TOKYO (Immersive Digital Art Museum)',
        type: 'activity',
        category: 'Art & Tech',
        costPerPerson: 38,
        advocate: 'Full Group Unanimous Consensus',
        description: 'Wading through barefoot water exhibitions and crystalline flower universes.',
        status: 'confirmed',
        location: 'Toyosu'
      },
      {
        id: 'item-3-2',
        time: '13:30 - 15:00',
        title: 'Toyosu Fish Market Gourmet Lunch (Tuna & Tamago)',
        type: 'dining',
        category: 'Lunch',
        costPerPerson: 35,
        advocate: 'Alice-Bot (Direct dock-fresh sashimi & grilled eel)',
        description: 'Next generation fish market with pristine seafood dining stalls.',
        status: 'confirmed',
        location: 'Toyosu Market'
      },
      {
        id: 'item-3-3',
        time: '16:00 - 18:30',
        title: 'Tokyo Bay Sunset Water Bus Cruise (Himiko Futuristic Vessel)',
        type: 'activity',
        category: 'Cruising / Sightseeing',
        costPerPerson: 25,
        advocate: 'Bob-Bot (Designed by Leiji Matsumoto anime artist)',
        description: 'Futuristic river boat cruising under Rainbow Bridge.',
        status: 'threatened', // Threatened by weather!
        disruptionReason: 'Coastal gale force winds warning from Tokyo Bay Maritime Authority',
        location: 'Odaiba'
      },
      {
        id: 'item-3-4',
        time: '19:30 - 22:00',
        title: 'Odaiba Seaside Deck & Joypolis Indoor Theme Park',
        type: 'activity',
        category: 'Entertainment',
        costPerPerson: 42,
        advocate: 'Bob-Bot',
        description: 'Sega arcade coasters and illuminated bay views.',
        status: 'confirmed',
        location: 'Odaiba'
      }
    ]
  },
  {
    day: 4,
    date: 'Nov 15, 2026',
    title: 'Hidden Neighborhoods & Grand Finale Feast',
    theme: 'Shimokitazawa Vintage & Shibuya Crossing Skyline',
    consensusScore: 96,
    items: [
      {
        id: 'item-4-1',
        time: '11:00 - 14:00',
        title: 'Shimokitazawa Indie Boutiques & Record Stores',
        type: 'activity',
        category: 'Neighborhood Exploration',
        costPerPerson: 15,
        advocate: 'Charlie-Bot (Zero chain stores, indie coffee & vintage)',
        description: 'Bohemian neighborhood with pedestrian-only alleys and craft curry.',
        status: 'confirmed',
        location: 'Shimokitazawa'
      },
      {
        id: 'item-4-2',
        time: '15:00 - 17:00',
        title: 'Shibuya Sky 360° Open Air Rooftop Observatory',
        type: 'activity',
        category: 'Sightseeing',
        costPerPerson: 22,
        advocate: 'Bob-Bot & Charlie-Bot (Epic skyline photos at twilight)',
        description: 'Standing 229 meters above Shibuya scramble crossing with glass corners.',
        status: 'confirmed',
        location: 'Shibuya'
      },
      {
        id: 'item-4-3',
        time: '18:30 - 21:30',
        title: 'Celebratory Sukiyaki & Wagyu Finale: Imahan Ningyocho',
        type: 'dining',
        category: 'Dinner (Celebration)',
        costPerPerson: 75,
        advocate: 'Main AI Compromise (Splurging on final night within limits)',
        description: 'Traditional tatami room with tableside kimono-dressed cooking. A memorable farewell.',
        status: 'confirmed',
        location: 'Ningyocho'
      }
    ]
  }
];

export const WORLD_NEWS_ALERTS = [
  {
    id: 'news-1',
    severity: 'high',
    icon: '🌪️',
    headline: 'Tropical Storm Neoguri Approaching Tokyo Coast',
    timestamp: '14 mins ago',
    source: 'Japan Meteorological Agency & NHK World',
    impact: 'High waves and 65km/h wind gusts predicted for Tokyo Bay waterfront on Day 3 afternoon (Nov 14). Marine cruises and outdoor observatories may be closed.',
    affectedItems: ['item-3-3'],
    aiRecommendation: 'Swap outdoor Tokyo Bay Himiko Cruise with indoor Mori Building Digital Art Museum or Roppongi Hills Sky Deck covered gallery.'
  },
  {
    id: 'news-2',
    severity: 'medium',
    icon: '🚆',
    headline: 'JR Yamanote Line Signal Upgrade Window',
    timestamp: '1 hour ago',
    source: 'JR East Service Advisory',
    impact: 'Day 2 between 13:30 - 15:30: expect 15-20 min service intervals between Shinjuku and Akihabara.',
    affectedItems: ['item-2-3'],
    aiRecommendation: 'Main AI recommends taking Tokyo Metro Ginza Line via Asakusa instead (5 mins faster, unaffected by JR delays).'
  },
  {
    id: 'news-3',
    severity: 'low',
    icon: '🏮',
    headline: 'Autumn Lantern Festival Extended in Yanaka',
    timestamp: '3 hours ago',
    source: 'Tokyo Metropolitan Tourism Board',
    impact: 'Free seasonal illumination and craft stalls added in Old Town Yanaka Ginza.',
    affectedItems: [],
    aiRecommendation: 'Opportunity for Charlie to take quiet sunset photos if Day 4 schedule has downtime.'
  }
];

export const INITIAL_POKER_AGENDA = {
  roundTitle: "Round 2: Day 3 Disruption Dilemma & Budget Reallocation",
  potTotal: "$540 Saved Pool",
  currentTopic: "Day 3 Tokyo Bay Himiko Cruise cancelled due to gale winds. How should the team reallocate the 16:00 - 18:30 slot?",
  consensusThreshold: "3/3 Votes Required",
  dilemmaOptions: [
    {
      id: 'opt-a',
      title: 'Option A: Mori Art Museum & Roppongi Hills Indoor Observation Gallery',
      cost: '$24 / person',
      vibe: 'Cultural & Weather-proof',
      charlieRating: 5,
      aliceRating: 4,
      bobRating: 3,
      aiSummary: 'Zero rain exposure, magnificent sheltered views of Tokyo Tower, leaves budget for evening arcade.'
    },
    {
      id: 'opt-b',
      title: 'Option B: Akihabara VR Zone & Indoor Cyber Karting',
      cost: '$60 / person',
      vibe: 'Adrenaline & High Energy',
      charlieRating: 2,
      aliceRating: 2,
      bobRating: 5,
      aiSummary: 'Bob loves it, but exceeds Alice’s remaining daily cap by $32 and requires high physical stamina.'
    },
    {
      id: 'opt-c',
      title: 'Option C: Tsukiji Soba Masterclass & Traditional Sake Tasting',
      cost: '$35 / person',
      vibe: 'Interactive Food Experience',
      charlieRating: 4,
      aliceRating: 5,
      bobRating: 4,
      aiSummary: 'Hands-on noodle making indoors. Alice gets authentic food; Bob enjoys sake flight; Charlie takes artisan photos.'
    }
  ],
  discussionLogs: [
    {
      sender: 'Main AI (Aegis)',
      type: 'orchestrator',
      avatar: '🤖',
      text: 'Attention table: Weather Radar confirms 70km/h maritime wind warning for Day 3. The Tokyo Bay cruise is flagged unsafe. I have pulled 3 viable indoor contingencies considering everyone’s offline deliberation parameters.',
      time: 'Just now'
    },
    {
      sender: 'Alice-Bot',
      type: 'sub-ai',
      avatar: '🍲',
      text: 'Option B is an absolute non-starter. Alice explicitly told me in private she wants to preserve dinner cash for Toyosu. Option C (Soba Masterclass) fits her $150 budget like a glove!',
      time: '1m ago'
    },
    {
      sender: 'Bob-Bot',
      type: 'sub-ai',
      avatar: '⚡',
      text: 'Come on, Bob needs some action! But looking at Option C... there is a 5-variety craft sake tasting included, which Bob would definitely be hyped for.',
      time: '30s ago'
    },
    {
      sender: 'Charlie-Bot',
      type: 'sub-ai',
      avatar: '📷',
      text: 'Option C is sheltered, only 1,200 steps of walking, and the traditional wood craft studio is incredibly photogenic. Charlie approves!',
      time: '10s ago'
    }
  ]
};

export const INITIAL_CHAT_MESSAGES = {
  alice: [
    { id: 1, sender: 'bot', text: 'Hey Alice! I’m your personal Sub-AI concierge. What’s on your mind regarding the Tokyo trip that you wouldn’t necessarily want to say out loud to the group chat?' },
    { id: 2, sender: 'user', text: 'Honestly? Bob always pushes for crazy expensive restaurants and I really can’t spend more than $150 a day total. Plus, I want authentic ramen street stalls, not fancy hotel lobbies.' },
    { id: 3, sender: 'bot', text: 'Got your back 100%. I will privately set your budget ceiling to $150/day and prioritize top-rated Michelin Bib Gourmand ramen & izakayas during the master synthesis. When Bob suggests high-roller spots, I will step in during the poker meeting and propose high-value alternatives so you don’t have to play the bad cop!' },
    { id: 4, sender: 'user', text: 'Thank you! Also my knees hurt after 12,000 steps, so please don’t let them pack 6 sightseeing spots in one afternoon.' },
    { id: 5, sender: 'bot', text: 'Recorded: "Fatigue threshold: 12,000 steps max". I will ensure our daily itineraries feature localized cluster activities with direct transit links.' }
  ],
  bob: [
    { id: 1, sender: 'bot', text: 'Yo Bob! Bob-Bot here. Give me the real scoop — what’s your dream escape vibe?' },
    { id: 2, sender: 'user', text: 'Whatever you do, DO NOT let them schedule things at 8 AM. I’m on vacation! 10:30 AM minimum. And I want wild arcades, neon rooftops, and craft beer.' },
    { id: 3, sender: 'bot', text: 'Hell yeah. I’ve configured your wake-up lock to 10:30 AM. For mornings where Alice and Charlie want early morning garden walks, I’ll suggest modular schedules where you join them at brunch!' }
  ],
  charlie: [
    { id: 1, sender: 'bot', text: 'Hello Charlie. I’m your Aesthetic & Pacing Agent. How can we make this Tokyo trip restorative for you?' },
    { id: 2, sender: 'user', text: 'I really need dedicated time at teamLab Planets and slow coffee in Shimokitazawa. I hate feeling rushed like a tour bus group.' },
    { id: 3, sender: 'bot', text: 'Understood, Charlie. I will advocate for minimum 2-hour unhurried immersion blocks and identify third-wave kissaten coffee sanctuaries nearby.' }
  ]
};
