// File: D:/top-tens/frontend/stockitems.js
const STOCK_VAULT_DEFAULTS = [
  {
    name: "Shoes",
    items: [
      { rank: 1, name: "Air Jordan 1 Retro High" },
      { rank: 2, name: "Nike Air Force 1" },
      { rank: 3, name: "Adidas Samba Classic" },
      { rank: 4, name: "New Balance 990v5" },
      { rank: 5, name: "Converse Chuck Taylor All Star" },
      { rank: 6, name: "Vans Old Skool" },
      { rank: 7, name: "Yeezy Boost 350 V2" },
      { rank: 8, name: "Asics Gel-Kayano 14" },
      { rank: 9, name: "Brooks Ghost 15" },
      { rank: 10, name: "Puma Suede Classic" }
    ]
  },
  {
    name: "Inspiring Athletes",
    items: [
      { rank: 1, name: "Muhammad Ali" },
      { rank: 2, name: "Michael Jordan" },
      { rank: 3, name: "Serena Williams" },
      { rank: 4, name: "LeBron James" },
      { rank: 5, name: "Lionel Messi" },
      { rank: 6, name: "Simone Biles" },
      { rank: 7, name: "Kobe Bryant" },
      { rank: 8, name: "Usain Bolt" },
      { rank: 9, name: "Tom Brady" },
      { rank: 10, name: "Tiger Woods" }
    ]
  },
  {
    name: "Tech Devices",
    items: [
      { rank: 1, name: "Apple iPhone 15 Pro" },
      { rank: 2, name: "MacBook Pro M3" },
      { rank: 3, name: "Sony WH-1000XM5 Headphones" },
      { rank: 4, name: "iPad Pro OLED" },
      { rank: 5, name: "Samsung Galaxy S24 Ultra" },
      { rank: 6, name: "Nintendo Switch OLED" },
      { rank: 7, name: "ASUS ROG Zephyrus G14" },
      { rank: 8, name: "Apple Watch Ultra 2" },
      { rank: 9, name: "Steam Deck OLED" },
      { rank: 10, name: "Anker Prime Power Bank" }
    ]
  },
  {
    name: "Celebrities",
    items: [
      { rank: 1, name: "Keanu Reeves" },
      { rank: 2, name: "Tom Hanks" },
      { rank: 3, name: "Denzel Washington" },
      { rank: 4, name: "Pedro Pascal" },
      { rank: 5, name: "Margot Robbie" },
      { rank: 6, name: "Cillian Murphy" },
      { rank: 7, name: "Zendaya" },
      { rank: 8, name: "Ryan Reynolds" },
      { rank: 9, name: "Robert Downey Jr." },
      { rank: 10, name: "Scarlett Johansson" }
    ]
  },
  {
    name: "Post 2000 Movies",
    items: [
      { rank: 1, name: "The Dark Knight" },
      { rank: 2, name: "Inception" },
      { rank: 3, name: "Interstellar" },
      { rank: 4, name: "Parasite" },
      { rank: 5, name: "Everything Everywhere All at Once" },
      { rank: 6, name: "Mad Max: Fury Road" },
      { rank: 7, name: "Gladiator" },
      { rank: 8, name: "Spirited Away" },
      { rank: 9, name: "Whiplash" },
      { rank: 10, name: "No Country for Old Men" }
    ]
  },
  {
    name: "90s Rap Songs",
    items: [
      { rank: 1, name: "Juicy - Notorious B.I.G." },
      { rank: 2, name: "C.R.E.A.M. - Wu-Tang Clan" },
      { rank: 3, name: "Nuthin' But A G Thang - Dr. Dre ft. Snoop Dogg" },
      { rank: 4, name: "California Love - 2Pac ft. Dr. Dre" },
      { rank: 5, name: "Shook Ones Pt. II - Mobb Deep" },
      { rank: 6, name: "NY State of Mind - Nas" },
      { rank: 7, name: "Mind Playing Tricks on Me - Geto Boys" },
      { rank: 8, name: "Hypnotize - Notorious B.I.G." },
      { rank: 9, name: "Dear Mama - 2Pac" },
      { rank: 10, name: "Regulate - Warren G ft. Nate Dogg" }
    ]
  },
  {
    name: "Post 2010 Video Games",
    items: [
      { rank: 1, name: "The Legend of Zelda: Breath of the Wild" },
      { rank: 2, name: "Elden Ring" },
      { rank: 3, name: "The Witcher 3: Wild Hunt" },
      { rank: 4, name: "Red Dead Redemption 2" },
      { rank: 5, name: "Grand Theft Auto V" },
      { rank: 6, name: "The Last of Us Part I" },
      { rank: 7, name: "God of War (2018)" },
      { rank: 8, name: "Minecraft" },
      { rank: 9, name: "Baldur's Gate 3" },
      { rank: 10, name: "Hades" }
    ]
  },
  {
    name: "Novels",
    items: [
      { rank: 1, name: "The Great Gatsby" },
      { rank: 2, name: "To Kill a Mockingbird" },
      { rank: 3, name: "1884" },
      { rank: 4, name: "The Lord of the Rings" },
      { rank: 5, name: "The Catcher in the Rye" },
      { rank: 6, name: "One Hundred Years of Solitude" },
      { rank: 7, name: "Crime and Punishment" },
      { rank: 8, name: "The Hobbit" },
      { rank: 9, name: "Brave New World" },
      { rank: 10, name: "Frankenstein" }
    ]
  },
  {
    name: "Restaurants",
    items: [
      { rank: 1, name: "The French Laundry" },
      { rank: 2, name: "Osteria Francescana" },
      { rank: 3, name: "Eleven Madison Park" },
      { rank: 4, name: "Central" },
      { rank: 5, name: "Noma" },
      { rank: 6, name: "Atomix" },
      { rank: 7, name: "Pujol" },
      { rank: 8, name: "Le Bernardin" },
      { rank: 9, name: "Asador Etxebarri" },
      { rank: 10, name: "Gaggan Anand" }
    ]
  }
];