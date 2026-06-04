// frontend/stockitems.js

const defaultStockVault = {
  "Shoes": [
    { rank: 1, name: "Air Jordan 1 Retro", media: "AppIconTopTens.png" },
    { rank: 2, name: "Adidas Ultraboost Light", media: "AppIconTopTens.png" },
    { rank: 3, name: "Nike Air Max 90", media: "AppIconTopTens.png" },
    { rank: 4, name: "New Balance 990v6", media: "AppIconTopTens.png" },
    { rank: 5, name: "Asics Gel-Kayano 30", media: "AppIconTopTens.png" },
    { rank: 6, name: "Puma Suede Classic", media: "AppIconTopTens.png" },
    { rank: 7, name: "Reebok Club C 85", media: "AppIconTopTens.png" },
    { rank: 8, name: "Vans Old Skool", media: "AppIconTopTens.png" },
    { rank: 9, name: "Converse Chuck Taylor Chuck 70", media: "AppIconTopTens.png" },
    { rank: 10, name: "Balenciaga Triple S", media: "AppIconTopTens.png" }
  ],
  "Inspiring Athletes": [
    { rank: 1, name: "Muhammad Ali", media: "AppIconTopTens.png" },
    { rank: 2, name: "Michael Jordan", media: "AppIconTopTens.png" },
    { rank: 3, name: "Serena Williams", media: "AppIconTopTens.png" },
    { rank: 4, name: "LeBron James", media: "AppIconTopTens.png" },
    { rank: 5, name: "Simone Biles", media: "AppIconTopTens.png" },
    { rank: 6, name: "Lionel Messi", media: "AppIconTopTens.png" },
    { rank: 7, name: "Usain Bolt", media: "AppIconTopTens.png" },
    { rank: 8, name: "Kobe Bryant", media: "AppIconTopTens.png" },
    { rank: 9, name: "Tom Brady", media: "AppIconTopTens.png" },
    { rank: 10, name: "Tiger Woods", media: "AppIconTopTens.png" }
  ],
  "Tech Devices": [
    { rank: 1, name: "iPhone 15 Pro Max", media: "AppIconTopTens.png" },
    { rank: 2, name: "MacBook Pro M3 Max", media: "AppIconTopTens.png" },
    { rank: 3, name: "Samsung Galaxy S24 Ultra", media: "AppIconTopTens.png" },
    { rank: 4, name: "iPad Pro M2", media: "AppIconTopTens.png" },
    { rank: 5, name: "Sony WH-1000XM5 Headphones", media: "AppIconTopTens.png" },
    { rank: 6, name: "Apple Watch Ultra 2", media: "AppIconTopTens.png" },
    { rank: 7, name: "ASUS ROG Zephyrus G14", media: "AppIconTopTens.png" },
    { rank: 8, name: "Steam Deck OLED", media: "AppIconTopTens.png" },
    { rank: 9, name: "DJI Mini 4 Pro Drone", media: "AppIconTopTens.png" },
    { rank: 10, name: "Meta Quest 3 VR Headset", media: "AppIconTopTens.png" }
  ],
  "Celebrities": [
    { rank: 1, name: "Keanu Reeves", media: "AppIconTopTens.png" },
    { rank: 2, name: "Tom Cruise", media: "AppIconTopTens.png" },
    { rank: 3, name: "Denzel Washington", media: "AppIconTopTens.png" },
    { rank: 4, name: "Leonardo DiCaprio", media: "AppIconTopTens.png" },
    { rank: 5, name: "The Rock Dwayne Johnson", media: "AppIconTopTens.png" },
    { rank: 6, name: "Scarlett Johansson", media: "AppIconTopTens.png" },
    { rank: 7, name: "Pedro Pascal", media: "AppIconTopTens.png" },
    { rank: 8, name: "Margot Robbie", media: "AppIconTopTens.png" },
    { rank: 9, name: "Tom Hanks", media: "AppIconTopTens.png" },
    { rank: 10, name: "Robert Downey Jr.", media: "AppIconTopTens.png" }
  ],
  "Post 2000 Movies": [
    { rank: 1, name: "The Dark Knight", media: "AppIconTopTens.png" },
    { rank: 2, name: "Inception", media: "AppIconTopTens.png" },
    { rank: 3, name: "Interstellar", media: "AppIconTopTens.png" },
    { rank: 4, name: "Avatar The Way of Water", media: "AppIconTopTens.png" },
    { rank: 5, name: "Mad Max Fury Road", media: "AppIconTopTens.png" },
    { rank: 6, name: "The Lord of the Rings Return of the King", media: "AppIconTopTens.png" },
    { rank: 7, name: "Spider-Man Into the Spider-Verse", media: "AppIconTopTens.png" },
    { rank: 8, name: "Parasite", media: "AppIconTopTens.png" },
    { rank: 9, name: "Everything Everywhere All At Once", media: "AppIconTopTens.png" },
    { rank: 10, name: "Dune Part Two", media: "AppIconTopTens.png" }
  ],
  "90s Rap Songs": [
    { rank: 1, name: "Juicy - Notorious B.I.G.", media: "AppIconTopTens.png" },
    { rank: 2, name: "California Love - 2Pac", media: "AppIconTopTens.png" },
    { rank: 3, name: "Nuthin but a G Thang - Dr. Dre", media: "AppIconTopTens.png" },
    { rank: 4, name: "C.R.E.A.M. - Wu-Tang Clan", media: "AppIconTopTens.png" },
    { rank: 5, name: "Shook Ones Pt II - Mobb Deep", media: "AppIconTopTens.png" },
    { rank: 6, name: "Mind Playing Tricks on Me - Geto Boys", media: "AppIconTopTens.png" },
    { rank: 7, name: "Mass Appeal - Gang Starr", media: "AppIconTopTens.png" },
    { rank: 8, name: "Rosa Parks - Outkast", media: "AppIconTopTens.png" },
    { rank: 9, name: "Regulate - Warren G", media: "AppIconTopTens.png" },
    { rank: 10, name: "It Was A Good Day - Ice Cube", media: "AppIconTopTens.png" }
  ],
  "Post 2010 Video Games": [
    { rank: 1, name: "Elden Ring", media: "AppIconTopTens.png" },
    { rank: 2, name: "The Legend of Zelda Breath of the Wild", media: "AppIconTopTens.png" },
    { rank: 3, name: "The Witcher 3 Wild Hunt", media: "AppIconTopTens.png" },
    { rank: 4, name: "Red Dead Redemption 2", media: "AppIconTopTens.png" },
    { rank: 5, name: "Grand Theft Auto V", media: "AppIconTopTens.png" },
    { rank: 6, name: "Baldur's Gate 3", media: "AppIconTopTens.png" },
    { rank: 7, name: "God of War Ragnarok", media: "AppIconTopTens.png" },
    { rank: 8, name: "The Last of Us Part II", media: "AppIconTopTens.png" },
    { rank: 9, name: "Cyberpunk 2077 Phantom Liberty", media: "AppIconTopTens.png" },
    { rank: 10, name: "Minecraft Vanilla Classic", media: "AppIconTopTens.png" }
  ],
  "Novels": [
    { rank: 1, name: "The Great Gatsby", media: "AppIconTopTens.png" },
    { rank: 2, name: "180°C Fahrenheit 451", media: "AppIconTopTens.png" },
    { rank: 3, name: "To Kill a Mockingbird", media: "AppIconTopTens.png" },
    { rank: 4, name: "The Catcher in the Rye", media: "AppIconTopTens.png" },
    { rank: 5, name: "The Hobbit", media: "AppIconTopTens.png" },
    { rank: 6, name: "Crime and Punishment", media: "AppIconTopTens.png" },
    { rank: 7, name: "The Road", media: "AppIconTopTens.png" },
    { rank: 8, name: "Neuromancer", media: "AppIconTopTens.png" },
    { rank: 9, name: "Dune Deluxe Edition", media: "AppIconTopTens.png" },
    { rank: 10, name: "Project Hail Mary", media: "AppIconTopTens.png" }
  ],
  "Restaurants": [
    { rank: 1, name: "The French Laundry", media: "AppIconTopTens.png" },
    { rank: 2, name: "Eleven Madison Park", media: "AppIconTopTens.png" },
    { rank: 3, name: "Osteria Francescana", media: "AppIconTopTens.png" },
    { rank: 4, name: "Central Restaurante", media: "AppIconTopTens.png" },
    { rank: 5, name: "Asador Etxebarri", media: "AppIconTopTens.png" },
    { rank: 6, name: "Atomix NYC", media: "AppIconTopTens.png" },
    { rank: 7, name: "Le Bernardin", media: "AppIconTopTens.png" },
    { rank: 8, name: " Pujol Mexican Gastronomy", media: "AppIconTopTens.png" },
    { rank: 9, name: "Gaggan Anand", media: "AppIconTopTens.png" },
    { rank: 10, name: "Geranium Copenhagen", media: "AppIconTopTens.png" }
  ]
};