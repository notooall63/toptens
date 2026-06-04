// frontend/stockitems.js

const defaultStockVault = {
  "Shoes": [
    { rank: 1, name: "Air Jordan 1 Retro High OG", media: "AppIconTopTens.png" },
    { rank: 2, name: "Adidas Ultraboost Light Running", media: "AppIconTopTens.png" },
    { rank: 3, name: "Nike Air Max 90 Essentials", media: "AppIconTopTens.png" },
    { rank: 4, name: "New Balance 990v6 Heritage", media: "AppIconTopTens.png" },
    { rank: 5, name: "Asics Gel-Kayano 30 Stability", media: "AppIconTopTens.png" },
    { rank: 6, name: "Puma Suede Classic Street", media: "AppIconTopTens.png" },
    { rank: 7, name: "Reebok Club C 85 Vintage", media: "AppIconTopTens.png" },
    { rank: 8, name: "Vans Old Skool Skate Premium", media: "AppIconTopTens.png" },
    { rank: 9, name: "Converse Chuck 70 High Top", media: "AppIconTopTens.png" },
    { rank: 10, name: "Balenciaga Triple S Luxury Leather", media: "AppIconTopTens.png" }
  ],
  "Inspiring Athletes": [
    { rank: 1, name: "Muhammad Ali Heavyweight Legend", media: "AppIconTopTens.png" },
    { rank: 2, name: "Michael Jordan Basketball Champion", media: "AppIconTopTens.png" },
    { rank: 3, name: "Serena Williams Tennis Icon", media: "AppIconTopTens.png" },
    { rank: 4, name: "LeBron James All-Time Scorer", media: "AppIconTopTens.png" },
    { rank: 5, name: "Simone Biles Gymnastics GOAT", media: "AppIconTopTens.png" },
    { rank: 6, name: "Lionel Messi World Cup Winner", media: "AppIconTopTens.png" },
    { rank: 7, name: "Usain Bolt World Record Sprinter", media: "AppIconTopTens.png" },
    { rank: 8, name: "Kobe Bryant Mamba Mentality", media: "AppIconTopTens.png" },
    { rank: 9, name: "Tom Brady 7x Super Bowl King", media: "AppIconTopTens.png" },
    { rank: 10, name: "Tiger Woods Masters Icon", media: "AppIconTopTens.png" }
  ],
  "Tech Devices": [
    { rank: 1, name: "iPhone 15 Pro Max Titanium", media: "AppIconTopTens.png" },
    { rank: 2, name: "MacBook Pro M3 Max Workstation", media: "AppIconTopTens.png" },
    { rank: 3, name: "Samsung Galaxy S24 Ultra AI", media: "AppIconTopTens.png" },
    { rank: 4, name: "iPad Pro M2 Liquid Retina", media: "AppIconTopTens.png" },
    { rank: 5, name: "Sony WH-1000XM5 ANC Headset", media: "AppIconTopTens.png" },
    { rank: 6, name: "Apple Watch Ultra 2 Outdoor GPS", media: "AppIconTopTens.png" },
    { rank: 7, name: "ASUS ROG Zephyrus G14 Gaming Laptop", media: "AppIconTopTens.png" },
    { rank: 8, name: "Steam Deck OLED Handheld Engine", media: "AppIconTopTens.png" },
    { rank: 9, name: "DJI Mini 4 Pro Cinematic Drone", media: "AppIconTopTens.png" },
    { rank: 10, name: "Meta Quest 3 VR Computing Headset", media: "AppIconTopTens.png" }
  ],
  "Celebrities": [
    { rank: 1, name: "Keanu Reeves Humble Action Star", media: "AppIconTopTens.png" },
    { rank: 2, name: "Tom Cruise Maverick Flight King", media: "AppIconTopTens.png" },
    { rank: 3, name: "Denzel Washington Master Class Actor", media: "AppIconTopTens.png" },
    { rank: 4, name: "Leonardo DiCaprio Cinematic Phenom", media: "AppIconTopTens.png" },
    { rank: 5, name: "The Rock Dwayne Johnson Blockbuster Star", media: "AppIconTopTens.png" },
    { rank: 6, name: "Scarlett Johansson Marvel Starlet", media: "AppIconTopTens.png" },
    { rank: 7, name: "Pedro Pascal Mandalorian Icon", media: "AppIconTopTens.png" },
    { rank: 8, name: "Margot Robbie Cinematic Barbie Queen", media: "AppIconTopTens.png" },
    { rank: 9, name: "Tom Hanks America's Vault Actor", media: "AppIconTopTens.png" },
    { rank: 10, name: "Robert Downey Jr. Cinematic Legend", media: "AppIconTopTens.png" }
  ],
  "Post 2000 Movies": [
    { rank: 1, name: "The Dark Knight Epic Trilogy", media: "AppIconTopTens.png" },
    { rank: 2, name: "Inception Reality Structural Script", media: "AppIconTopTens.png" },
    { rank: 3, name: "Interstellar Deep Space Concept", media: "AppIconTopTens.png" },
    { rank: 4, name: "Avatar The Way of Water Engine", media: "AppIconTopTens.png" },
    { rank: 5, name: "Mad Max Fury Road Action Masterpiece", media: "AppIconTopTens.png" },
    { rank: 6, name: "The Lord of the Rings Return of the King", media: "AppIconTopTens.png" },
    { rank: 7, name: "Spider-Man Into the Spider-Verse", media: "AppIconTopTens.png" },
    { rank: 8, name: "Parasite Historical Masterclass Cinema", media: "AppIconTopTens.png" },
    { rank: 9, name: "Everything Everywhere All At Once", media: "AppIconTopTens.png" },
    { rank: 10, name: "Dune Part Two Arrakis Epic", media: "AppIconTopTens.png" }
  ],
  "90s Rap Songs": [
    { rank: 1, name: "Juicy - Notorious B.I.G.", media: "AppIconTopTens.png" },
    { rank: 2, name: "California Love - 2Pac Death Row", media: "AppIconTopTens.png" },
    { rank: 3, name: "Nuthin but a G Thang - Dr. Dre", media: "AppIconTopTens.png" },
    { rank: 4, name: "C.R.E.A.M. - Wu-Tang Clan NYC Style", media: "AppIconTopTens.png" },
    { rank: 5, name: "Shook Ones Pt II - Mobb Deep Infamous", media: "AppIconTopTens.png" },
    { rank: 6, name: "Mind Playing Tricks on Me - Geto Boys Rap", media: "AppIconTopTens.png" },
    { rank: 7, name: "Mass Appeal - Gang Starr Foundation", media: "AppIconTopTens.png" },
    { rank: 8, name: "Rosa Parks - Outkast Southern Anthem", media: "AppIconTopTens.png" },
    { rank: 9, name: "Regulate - Warren G West Coast Classic", media: "AppIconTopTens.png" },
    { rank: 10, name: "It Was A Good Day - Ice Cube Solo Track", media: "AppIconTopTens.png" }
  ],
  "Post 2010 Video Games": [
    { rank: 1, name: "Elden Ring FromSoftware Masterpiece", media: "AppIconTopTens.png" },
    { rank: 2, name: "The Legend of Zelda Breath of the Wild", media: "AppIconTopTens.png" },
    { rank: 3, name: "The Witcher 3 Wild Hunt RPG Engine", media: "AppIconTopTens.png" },
    { rank: 4, name: "Red Dead Redemption 2 Rockstar Epics", media: "AppIconTopTens.png" },
    { rank: 5, name: "Grand Theft Auto V Open World Core", media: "AppIconTopTens.png" },
    { rank: 6, name: "Baldur's Gate 3 Larian Fantasy Systems", media: "AppIconTopTens.png" },
    { rank: 7, name: "God of War Ragnarok Santa Monica Studio", media: "AppIconTopTens.png" },
    { rank: 8, name: "The Last of Us Part II Naughty Dog", media: "AppIconTopTens.png" },
    { rank: 9, name: "Cyberpunk 2077 Night City Expansion", media: "AppIconTopTens.png" },
    { rank: 10, name: "Minecraft Base Vanilla Sandbox Core", media: "AppIconTopTens.png" }
  ],
  "Novels": [
    { rank: 1, name: "The Great Gatsby Classic Literature", media: "AppIconTopTens.png" },
    { rank: 2, name: "Fahrenheit 451 Ornate Dystopian Tale", media: "AppIconTopTens.png" },
    { rank: 3, name: "To Kill a Mockingbird Harper Lee", media: "AppIconTopTens.png" },
    { rank: 4, name: "The Catcher in the Rye JD Salinger", media: "AppIconTopTens.png" },
    { rank: 5, name: "The Hobbit JRR Tolkien Fantasy Epic", media: "AppIconTopTens.png" },
    { rank: 6, name: "Crime and Punishment Dostoevsky Matrix", media: "AppIconTopTens.png" },
    { rank: 7, name: "The Road Cormac McCarthy Dystopia", media: "AppIconTopTens.png" },
    { rank: 8, name: "Neuromancer William Gibson Cyberpunk Core", media: "AppIconTopTens.png" },
    { rank: 9, name: "Dune Deluxe Sci-Fi Hardcover", media: "AppIconTopTens.png" },
    { rank: 10, name: "Project Hail Mary Andy Weir Science", media: "AppIconTopTens.png" }
  ],
  "Restaurants": [
    { rank: 1, name: "The French Laundry Napa Luxury Dine", media: "AppIconTopTens.png" },
    { rank: 2, name: "Eleven Madison Park Premium Tasting NYC", media: "AppIconTopTens.png" },
    { rank: 3, name: "Osteria Francescana Modena Fine Dining", media: "AppIconTopTens.png" },
    { rank: 4, name: "Central Restaurante Gastronomic Lima", media: "AppIconTopTens.png" },
    { rank: 5, name: "Asador Etxebarri Wood-Fired Spain Epic", media: "AppIconTopTens.png" },
    { rank: 6, name: "Atomix NYC Refined Korean Gastronomy", media: "AppIconTopTens.png" },
    { rank: 7, name: "Le Bernardin French Seafood NYC Elite", media: "AppIconTopTens.png" },
    { rank: 8, name: "Pujol Mexican Gastronomy Mexico City", media: "AppIconTopTens.png" },
    { rank: 9, name: "Gaggan Anand Progressive Indian Tasting", media: "AppIconTopTens.png" },
    { rank: 10, name: "Geranium Copenhagen Scandinavian Elite Stars", media: "AppIconTopTens.png" }
  ]
};