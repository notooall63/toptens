// File: frontend/stockitems.js
const STOCK_DATA = {
  "shoes": [
    { rank: 1, name: "Air Jordan 1 Retro High OG" },
    { rank: 2, name: "Nike Air Max 90" },
    { rank: 3, name: "Adidas Ultraboost Light" },
    { rank: 4, name: "Yeezy Boost 350 V2" },
    { rank: 5, name: "New Balance 990v6" },
    { rank: 6, name: "Converse Chuck Taylor All Star" },
    { rank: 7, name: "Vans Old Skool" },
    { rank: 8, name: "Puma Suede Classic" },
    { rank: 9, name: "Asics Gel-Kayano 30" },
    { rank: 10, name: "Balenciaga Triple S" }
  ],
  "inspiring athletes": [
    { rank: 1, name: "Muhammad Ali" },
    { rank: 2, name: "Michael Jordan" },
    { rank: 3, name: "Serena Williams" },
    { rank: 4, name: "Pelé" },
    { rank: 5, name: "Usain Bolt" },
    { rank: 6, name: "Simone Biles" },
    { rank: 7, name: "Lionel Messi" },
    { rank: 8, name: "Tiger Woods" },
    { rank: 9, name: "Roger Federer" },
    { rank: 10, name: "Aryton Senna" }
  ],
  "tech devices": [
    { rank: 1, name: "Apple iPhone 15 Pro Max" },
    { rank: 2, name: "Samsung Galaxy S24 Ultra" },
    { rank: 3, name: "Apple MacBook Pro M3 Max" },
    { rank: 4, name: "Sony WH-1000XM5 Headphones" },
    { rank: 5, name: "Apple Watch Ultra 2" },
    { rank: 6, name: "iPad Pro M4" },
    { rank: 7, name: "Steam Deck OLED" },
    { rank: 8, name: "DJI Mini 4 Pro Drone" },
    { rank: 9, name: "Meta Quest 3 VR Headset" },
    { rank: 10, name: "ASUS ROG Zephyrus G14" }
  ],
  "celebrities": [
    { rank: 1, name: "Keanu Reeves" },
    { rank: 2, name: "Tom Hanks" },
    { rank: 3, name: "Dwayne Johnson" },
    { rank: 4, name: "Taylor Swift" },
    { rank: 5, name: "Leonardo DiCaprio" },
    { rank: 6, name: "Denzel Washington" },
    { rank: 7, name: "Margot Robbie" },
    { rank: 8, name: "Ryan Reynolds" },
    { rank: 9, name: "Beyoncé" },
    { rank: 10, name: "Pedro Pascal" }
  ],
  "post 2000 movies": [
    { rank: 1, name: "The Dark Knight (2008)" },
    { rank: 2, name: "Inception (2010)" },
    { rank: 3, name: "Interstellar (2014)" },
    { rank: 4, name: "Parasite (2019)" },
    { rank: 5, name: "Mad Max: Fury Road (2015)" },
    { rank: 6, name: "Everything Everywhere All At Once" },
    { rank: 7, name: "Whiplash (2014)" },
    { rank: 8, name: "Spirited Away (2001)" },
    { rank: 9, name: "The Lord of the Rings: Return of the King" },
    { rank: 10, name: "Spider-Man: Into the Spider-Verse" }
  ],
  "90s rap songs": [
    { rank: 1, name: "Juicy - The Notorious B.I.G." },
    { rank: 2, name: "C.R.E.A.M. - Wu-Tang Clan" },
    { rank: 3, name: "California Love - 2Pac ft. Dr. Dre" },
    { rank: 4, name: "Nuthin' But A 'G' Thang - Dr. Dre" },
    { rank: 5, name: "Shook Ones, Pt. II - Mobb Deep" },
    { rank: 6, name: "N.Y. State of Mind - Nas" },
    { rank: 7, name: "Mind Playing Tricks on Me - Geto Boys" },
    { rank: 8, name: "Dear Mama - 2Pac" },
    { rank: 9, name: "Regulate - Warren G ft. Nate Dogg" },
    { rank: 10, name: "Insane in the Brain - Cypress Hill" }
  ],
  "post 2010 video games": [
    { rank: 1, name: "The Legend of Zelda: Breath of the Wild" },
    { rank: 2, name: "Elden Ring" },
    { rank: 3, name: "The Witcher 3: Wild Hunt" },
    { rank: 4, name: "Red Dead Redemption 2" },
    { rank: 5, name: "Grand Theft Auto V" },
    { rank: 6, name: "The Last of Us Part I" },
    { rank: 7, name: "God of War (2018)" },
    { rank: 8, name: "Minecraft" },
    { rank: 9, name: "Hades" },
    { rank: 10, name: "Cyberpunk 2077 Phantom Liberty" }
  ],
  "novels": [
    { rank: 1, name: "The Great Gatsby" },
    { rank: 2, name: "To Kill a Mockingbird" },
    { rank: 3, name: "1984" },
    { rank: 4, name: "The Catcher in the Rye" },
    { rank: 5, name: "One Hundred Years of Solitude" },
    { rank: 6, name: "The Hobbit" },
    { rank: 7, name: "Brave New World" },
    { rank: 8, name: "Crime and Punishment" },
    { rank: 9, name: "The Road" },
    { rank: 10, name: "Frankenstein" }
  ],
  "restaurants": [
    { rank: 1, name: "Central (Lima, Peru)" },
    { rank: 2, name: "Disfrutar (Barcelona, Spain)" },
    { rank: 3, name: "DiverXO (Madrid, Spain)" },
    { rank: 4, name: "Asador Etxebarri (Achondo, Spain)" },
    { rank: 5, name: "Alchemist (Copenhagen, Denmark)" },
    { rank: 6, name: "Maido (Lima, Peru)" },
    { rank: 7, name: "A Casa do Porco (São Paulo, Brazil)" },
    { rank: 8, name: "Atomix (New York City, USA)" },
    { rank: 9, name: "Quintonil (Mexico City, Mexico)" },
    { rank: 10, name: "Table by Bruno Verjus (Paris, France)" }
  ]
};

// Map display names to clean lookup keys
const STOCK_CATEGORY_KEYS = [
  { display: "Shoes", key: "shoes" },
  { display: "Inspiring Athletes", key: "inspiring athletes" },
  { display: "Tech Devices", key: "tech devices" },
  { display: "Celebrities", key: "celebrities" },
  { display: "Post 2000 Movies", key: "post 2000 movies" },
  { display: "90s Rap Songs", key: "90s rap songs" },
  { display: "Post 2010 Video Games", key: "post 2010 video games" },
  { display: "Novels", key: "novels" },
  { display: "Restaurants", key: "restaurants" }
];