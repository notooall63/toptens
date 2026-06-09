const defaultStockCategories = [
  {
    id: "stock-shoes",
    name: "Shoes",
    emoji: "👟",
    isPublic: true,
    items: [
      { rank: 1, name: "Air Jordan 1 Retro", media: "", link: "https://nike.com" },
      { rank: 2, name: "Adidas Yeezy Boost 350", media: "", link: "https://adidas.com" },
      { rank: 3, name: "Nike Air Max 90", media: "", link: "https://nike.com" },
      { rank: 4, name: "New Balance 990v5", media: "", link: "https://newbalance.com" },
      { rank: 5, name: "Balenciaga Triple S", media: "", link: "https://balenciaga.com" },
      { rank: 6, name: "Puma Suede Classic", media: "", link: "https://puma.com" },
      { rank: 7, name: "Asics Gel-Kayano 14", media: "", link: "https://asics.com" },
      { rank: 8, name: "Converse Chuck Taylor", media: "", link: "https://converse.com" },
      { rank: 9, name: "Vans Old Skool", media: "", link: "https://vans.com" },
      { rank: 10, name: "Brooks Ghost 16", media: "", link: "https://brooksrunning.com" }
    ]
  },
  {
    id: "stock-athletes",
    name: "Inspiring Athletes",
    emoji: "🏃‍♂️",
    isPublic: true,
    items: [
      { rank: 1, name: "Michael Jordan", media: "", link: "https://nba.com" },
      { rank: 2, name: "Muhammad Ali", media: "", link: "https://boxing.com" },
      { rank: 3, name: "Serena Williams", media: "", link: "https://wta.com" },
      { rank: 4, name: "Usain Bolt", media: "", link: "https://olympics.com" },
      { rank: 5, name: "Lionel Messi", media: "", link: "https://fifa.com" },
      { rank: 6, name: "Simone Biles", media: "", link: "https://gymnastics.sport" },
      { rank: 7, name: "Kobe Bryant", media: "", link: "https://nba.com" },
      { rank: 8, name: "Tiger Woods", media: "", link: "https://pgatour.com" },
      { rank: 9, name: "Roger Federer", media: "", link: "https://atptour.com" },
      { rank: 10, name: "Tom Brady", media: "", link: "https://nfl.com" }
    ]
  },
  {
    id: "stock-devices",
    name: "Tech Devices",
    emoji: "💻",
    isPublic: true,
    items: [
      { rank: 1, name: "iPhone 15 Pro Max", media: "", link: "https://apple.com" },
      { rank: 2, name: "MacBook Pro M3 Max", media: "", link: "https://apple.com" },
      { rank: 3, name: "ASUS ROG Ally X", media: "", link: "https://asus.com" },
      { rank: 4, name: "Sony WH-1000XM5", media: "", link: "https://sony.com" },
      { rank: 5, name: "Samsung Galaxy S24 Ultra", media: "", link: "https://samsung.com" },
      { rank: 6, name: "iPad Pro Tandem OLED", media: "", link: "https://apple.com" },
      { rank: 7, name: "Steam Deck OLED", media: "", link: "https://steampowered.com" },
      { rank: 8, name: "DJI Mini 4 Pro", media: "", link: "https://dji.com" },
      { rank: 9, name: "Apple Watch Ultra 2", media: "", link: "https://apple.com" },
      { rank: 10, name: "Keychron Q1 Pro", media: "", link: "https://keychron.com" }
    ]
  },
  {
    id: "stock-celebrities",
    name: "Celebrities",
    emoji: "🎭",
    isPublic: true,
    items: [
      { rank: 1, name: "Keanu Reeves", media: "", link: "https://imdb.com" },
      { rank: 2, name: "Tom Cruise", media: "", link: "https://imdb.com" },
      { rank: 3, name: "Dwayne Johnson", media: "", link: "https://imdb.com" },
      { rank: 4, name: "Robert Downey Jr.", media: "", link: "https://imdb.com" },
      { rank: 5, name: "Leonardo DiCaprio", media: "", link: "https://imdb.com" },
      { rank: 6, name: "Scarlett Johansson", media: "", link: "https://imdb.com" },
      { rank: 7, name: "Pedro Pascal", media: "", link: "https://imdb.com" },
      { rank: 8, name: "Margot Robbie", media: "", link: "https://imdb.com" },
      { rank: 9, name: "Cillian Murphy", media: "", link: "https://imdb.com" },
      { rank: 10, name: "Denzel Washington", media: "", link: "https://imdb.com" }
    ]
  },
  {
    id: "stock-movies",
    name: "Post 2000 Movies",
    emoji: "🎬",
    isPublic: true,
    items: [
      { rank: 1, name: "Inception", media: "", link: "https://warnerbros.com" },
      { rank: 2, name: "The Dark Knight", media: "", link: "https://warnerbros.com" },
      { rank: 3, name: "Interstellar", media: "", link: "https://paramount.com" },
      { rank: 4, name: "The Lord of the Rings", media: "", link: "https://newline.com" },
      { rank: 5, name: "Mad Max: Fury Road", media: "", link: "https://warnerbros.com" },
      { rank: 6, name: "Avatar", media: "", link: "https://20thcenturystudios.com" },
      { rank: 7, name: "Gladiator", media: "", link: "https://universalpictures.com" },
      { rank: 8, name: "Whiplash", media: "", link: "https://sonypictures.com" },
      { rank: 9, name: "Parasite", media: "", link: "https://neonrated.com" },
      { rank: 10, name: "No Country for Old Men", media: "", link: "https://miramax.com" }
    ]
  },
  {
    id: "stock-rap",
    name: "90s Rap Songs",
    emoji: "🎤",
    isPublic: true,
    items: [
      { rank: 1, name: "Juicy - Notorious B.I.G.", media: "", link: "https://badboy.com" },
      { rank: 2, name: "California Love - 2Pac", media: "", link: "https://deathrowrecords.com" },
      { rank: 3, name: "Nuthin' But A G Thang", media: "", link: "https://deathrowrecords.com" },
      { rank: 4, name: "C.R.E.A.M. - Wu-Tang Clan", media: "", link: "https://wutangclan.com" },
      { rank: 5, name: "Shook Ones Pt. II", media: "", link: "https://loudrecords.com" },
      { rank: 6, name: "Mind Playing Tricks on Me", media: "", link: "https://rapalotrecords.com" },
      { rank: 7, name: "Dear Mama - 2Pac", media: "", link: "https://interscope.com" },
      { rank: 8, name: "Hypnotize - Notorious B.I.G.", media: "", link: "https://badboy.com" },
      { rank: 9, name: "Regulate - Warren G", media: "", link: "https://defjam.com" },
      { rank: 10, name: "The Choice Is Yours", media: "", link: "https://mercuryrecords.com" }
    ]
  },
  {
    id: "stock-videogames",
    name: "Post 2010 Video Games",
    emoji: "🎮",
    isPublic: true,
    items: [
      { rank: 1, name: "Elden Ring", media: "", link: "https://bandainamcoent.com" },
      { rank: 2, name: "The Witcher 3: Wild Hunt", media: "", link: "https://cdprojektred.com" },
      { rank: 3, name: "Red Dead Redemption 2", media: "", link: "https://rockstargames.com" },
      { rank: 4, name: "The Last of Us Part II", media: "", link: "https://playstation.com" },
      { rank: 5, name: "Zelda: Breath of the Wild", media: "", link: "https://nintendo.com" },
      { rank: 6, name: "God of War Ragnarok", media: "", link: "https://playstation.com" },
      { rank: 7, name: "Grand Theft Auto V", media: "", link: "https://rockstargames.com" },
      { rank: 8, name: "Cyberpunk 2077", media: "", link: "https://cdprojektred.com" },
      { rank: 9, name: "Hades", media: "", link: "https://supergiantgames.com" },
      { rank: 10, name: "Baldur's Gate 3", media: "", link: "https://larian.com" }
    ]
  },
  {
    id: "stock-novels",
    name: "Novels",
    emoji: "📚",
    isPublic: true,
    items: [
      { rank: 1, name: "The Great Gatsby", media: "", link: "https://scribner.com" },
      { rank: 2, name: "To Kill a Mockingbird", media: "", link: "https://harpercollins.com" },
      { rank: 3, name: "1984", media: "", link: "https://seckerandwarburg.com" },
      { rank: 4, name: "The Catcher in the Rye", media: "", link: "https://littlebrown.com" },
      { rank: 5, name: "The Hobbit", media: "", link: "https://allenandunwin.com" },
      { rank: 6, name: "Fahrenheit 451", media: "", link: "https://ballantinebooks.com" },
      { rank: 7, name: "Moby Dick", media: "", link: "https://harperbrothers.com" },
      { rank: 8, name: "Crime and Punishment", media: "", link: "https://therussianmessenger.com" },
      { rank: 9, name: "Brave New World", media: "", link: "https://chattoandwindus.com" },
      { rank: 10, name: "The Road", media: "", link: "https://knopf.com" }
    ]
  },
  {
    id: "stock-restaurants",
    name: "Restaurants",
    emoji: "🍔",
    isPublic: true,
    items: [
      { rank: 1, name: "The French Laundry", media: "", link: "https://thomaskeller.com" },
      { rank: 2, name: "Osteria Francescana", media: "", link: "https://osteriafrancescana.it" },
      { rank: 3, name: "Eleven Madison Park", media: "", link: "https://elevenmadisonpark.com" },
      { rank: 4, name: "Central", media: "", link: "https://centralrestaurante.com.pe" },
      { rank: 5, name: "Asador Etxebarri", media: "", link: "https://asadoretxebarri.com" },
      { rank: 6, name: "Atomix", media: "", link: "https://atomixnyc.com" },
      { rank: 7, name: "Le Bernardin", media: "", link: "https://le-bernardin.com" },
      { rank: 8, name: "Noma", media: "", link: "https://noma.dk" },
      { rank: 9, name: "DiverXO", media: "", link: "https://diverxo.com" },
      { rank: 10, name: "Pujol", media: "", link: "https://pujol.com.mx" }
    ]
  }
];