// Seed destinations — IDs are referenced by packages/hotels/flights.
// Note: Mongo ObjectIds are auto-generated on insert; the `id` field here is just for the seed script's reference.

export const destinations = [
  {
    _seedId: 'dest-goa',
    name: 'Goa',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=800&fit=crop',
    description:
      'Sun-soaked beaches, Portuguese-era churches, buzzing nightlife, and seafood shacks. Goa is the quintessential Indian escape — equal parts laid-back and alive.',
    rating: 4.7,
    featured: true,
    tags: ['beach', 'nightlife', 'family', 'weekend'],
  },
  {
    _seedId: 'dest-kerala',
    name: 'Kerala',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=800&fit=crop',
    description:
      'God’s own country — emerald backwaters, misty tea hills, and Ayurvedic retreats. Glide on a houseboat, hike the Western Ghats, taste the spices.',
    rating: 4.8,
    featured: true,
    tags: ['backwaters', 'nature', 'wellness', 'family'],
  },
  {
    _seedId: 'dest-rajasthan',
    name: 'Rajasthan',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1599661046827-dacde32f8d4f?w=1200&h=800&fit=crop',
    description:
      'Land of kings — pink Jaipur, blue Jodhpur, golden Jaisalmer. Camel safaris, marble palaces, and the widest desert in India.',
    rating: 4.6,
    featured: true,
    tags: ['heritage', 'culture', 'desert', 'palace'],
  },
  {
    _seedId: 'dest-kashmir',
    name: 'Kashmir',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&h=800&fit=crop',
    description:
      'Paradise on earth — Dal Lake shikaras, snow-blanketed Gulmarg, and saffron meadows in Pahalgam. Heaven, in any season.',
    rating: 4.9,
    featured: true,
    tags: ['snow', 'romance', 'nature', 'houseboat'],
  },
  {
    _seedId: 'dest-himachal',
    name: 'Himachal Pradesh',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop',
    description:
      'Pine-scented hills, colonial hill stations, and adrenaline-pumping treks. Shimla, Manali, Spiti — pick your pace.',
    rating: 4.5,
    featured: false,
    tags: ['mountains', 'trek', 'hill-station', 'adventure'],
  },
  {
    _seedId: 'dest-ladakh',
    name: 'Ladakh',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1591019479261-1a103585c559?w=1200&h=800&fit=crop',
    description:
      'High-altitude desert of stark mountains, ancient monasteries, and the world’s highest motorable passes. For true adventurers.',
    rating: 4.8,
    featured: true,
    tags: ['adventure', 'high-altitude', 'monastery', 'challenging'],
  },
  {
    _seedId: 'dest-andaman',
    name: 'Andaman & Nicobar',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=800&fit=crop',
    description:
      'Crystal-clear waters, white sand, and untouched coral reefs. India’s best-kept secret for scuba and beach bumming.',
    rating: 4.7,
    featured: false,
    tags: ['island', 'beach', 'scuba', 'honeymoon'],
  },
  {
    _seedId: 'dest-bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&h=800&fit=crop',
    description:
      'Street food, golden temples, sky-high rooftop bars, and some of the best shopping in the world. Bangkok rewards the curious.',
    rating: 4.6,
    featured: true,
    tags: ['city', 'food', 'shopping', 'nightlife'],
  },
  {
    _seedId: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=800&fit=crop',
    description:
      'Rice terraces, Hindu temples, surf breaks, and wellness retreats. Bali is a sensory overload in the best way.',
    rating: 4.8,
    featured: true,
    tags: ['beach', 'wellness', 'romance', 'temple'],
  },
  {
    _seedId: 'dest-dubai',
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop',
    description:
      'Skyscrapers piercing the desert, man-made islands, indoor skiing, and tax-free luxury shopping. Dubai is the future, today.',
    rating: 4.7,
    featured: true,
    tags: ['luxury', 'city', 'shopping', 'desert'],
  },
];
