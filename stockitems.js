// D:/top-tens/frontend/stockitems.js

const INITIAL_STOCK_CATEGORIES = [
  {
    id: "stock-shoes",
    name: "Shoes",
    isPublic: true,
    items: [
      { rank: 1, name: "Air Jordan 1 Retro High OG", link: "https://nike.com", media: "" },
      { rank: 2, name: "Adidas Yeezy Boost 350 V2", link: "https://adidas.com", media: "" },
      { rank: 3, name: "Nike Air Max 90", link: "https://nike.com", media: "" },
      { rank: 4, name: "Balenciaga Triple S", link: "https://balenciaga.com", media: "" },
      { rank: 5, name: "New Balance 990v5", link: "https://newbalance.com", media: "" },
      { rank: 6, name: "Converse Chuck Taylor All Star", link: "https://converse.com", media: "" },
      { rank: 7, name: "Vans Old Skool", link: "https://vans.com", media: "" },
      { rank: 8, name: "Puma Suede Classic", link: "https://puma.com", media: "" },
      { rank: 9, name: "Asics Gel-Kayano 14", link: "https://asics.com", media: "" },
      { rank: 10, name: "Common Projects Achilles Low", link: "https://commonprojects.com", media: "" }
    ]
  },
  {
    id: "stock-athletes",
    name: "Inspiring Athletes",
    isPublic: true,
    items: [
      { rank: 1, name: "Muhammad Ali", link: "https://wikipedia.org", media: "" },
      { rank: 2, name: "Michael Jordan", link: "https://nba.com", media: "" },
      { rank: 3, name: "Serena Williams", link: "https://serenawilliams.com", media: "" },
      { rank: 4, name: "Usain Bolt", link: "https://usainbolt.com", media: "" },
      { rank: 5, name: "Simone Biles", link: "https://simonebiles.com", media: "" },
      { rank: 6, name: "Roger Federer", link: "https://rogerfederer.com", media: "" },
      { rank: 7, name: "Lionel Messi", link: "https://messi.com", media: "" },
      { rank: 8, name: "Tiger Woods", link: "https://tigerwoods.com", media: "" },
      { rank: 9, name: "Ayrton Senna", link: "https://ayrtonsenna.com.br", media: "" },
      { rank: 10, name: "Tom Brady", link: "https://tombrady.com", media: "" }
    ]
  },
  {
    id: "stock-tech",
    name: "Tech Devices",
    isPublic: true,
    items: [
      { rank: 1, name: "iPhone 17 Pro Max", link: "https://apple.com", media: "" },
      { rank: 2, name: "MacBook Pro M5", link: "https://apple.com", media: "" },
      { rank: 3, name: "Samsung Galaxy S26 Ultra", link: "https://samsung.com", media: "" },
      { rank: 4, name: "Sony WH-1000XM6", link: "https://sony.com", media: "" },
      { rank: 5, name: "iPad Pro OLED", link: "https://apple.com", media: "" },
      { rank: 6, name: "ASUS ROG Zephyrus G16", link: "https://asus.com", media: "" },
      { rank: 7, name: "Steam Deck OLED", link: "https://valvesoftware.com", media: "" },
      { rank: 8, name: "DJI Avata 2", link: "https://dji.com", media: "" },
      { rank: 9, name: "Apple Vision Pro 2", link: "https://apple.com", media: "" },
      { rank: 10, name: "Raspberry Pi 5", link: "https://raspberrypi.com", media: "" }
    ]
  },
  {
    id: "stock-celebrities",
    name: "Celebrities",
    isPublic: true,
    items: [
      { rank: 1, name: "Keanu Reeves", link: "https://imdb.com", media: "" },
      { rank: 2, name: "Tom Hanks", link: "https://imdb.com", media: "" },
      { rank: 3, name: "Dwayne Johnson", link: "https://imdb.com", media: "" },
      { rank: 4, name: "Taylor Swift", link: "https://taylorswift.com", media: "" },
      { rank: 5, name: "Leonardo DiCaprio", link: "https://imdb.com", media: "" },
      { rank: 6, name: "Margot Robbie", link: "https://imdb.com", media: "" },
      { rank: 7, name: "Denzel Washington", link: "https://imdb.com", media: "" },
      { rank: 8, name: "Scarlett Johansson", link: "https://imdb.com", media: "" },
      { rank: 9, name: "Cillian Murphy", link: "https://imdb.com", media: "" },
      { rank: 10, name: "Pedro Pascal", link: "https://imdb.com", media: "" }
    ]
  },
  {
    id: "stock-movies",
    name: "Post 2000 Movies",
    isPublic: true,
    items: [
      { rank: 1, name: "The Dark Knight", link: "https://warnerbros.com", media: "" },
      { rank: 2, name: "Inception", link: "https://warnerbros.com", media: "" },
      { rank: 3, name: "Interstellar", link: "https://warnerbros.com", media: "" },
      { rank: 4, name: "Mad Max: Fury Road", link: "https://warnerbros.com", media: "" },
      { rank: 5, name: "Parasite", link: "https://imdb.com", media: "" },
      { rank: 6, name: "The Lord of the Rings: The Return of the King", link: "https://newline.com", media: "" },
      { rank: 7, name: "Spirited Away", link: "https://ghibli.jp", media: "" },
      { rank: 8, name: "Whiplash", link: "https://sonyclassics.com", media: "" },
      { rank: 9, name: "No Country for Old Men", link: "https://miramax.com", media: "" },
      { rank: 10, name: "Spider-Man: Into the Spider-Verse", link: "https://sonypictures.com", media: "" }
    ]
  },
  {
    id: "stock-rap",
    name: "90s Rap Songs",
    isPublic: true,
    items: [
      { rank: 1, name: "Juicy - Notorious B.I.G.", link: "https://badboy.com", media: "" },
      { rank: 2, name: "C.R.E.A.M. - Wu-Tang Clan", link: "https://wutangclan.com", media: "" },
      { rank: 3, name: "California Love - 2Pac", link: "https://deathrowrecords.com", media: "" },
      { rank: 4, name: "Nuthin' But A G Thang - Dr. Dre", link: "https://deathrowrecords.com", media: "" },
      { rank: 5, name: "Shook Ones Pt. II - Mobb Deep", link: "https://loud.com", media: "" },
      { rank: 6, name: "The World Is Yours - Nas", link: "https://columbiarecords.com", media: "" },
      { rank: 7, name: "Hypnotize - Notorious B.I.G.", link: "https://badboy.com", media: "" },
      { rank: 8, name: "Dear Mama - 2Pac", link: "https://deathrowrecords.com", media: "" },
      { rank: 9, name: "Mind Playing Tricks on Me - Geto Boys", link: "https://rapalotrecords.com", media: "" },
      { rank: 10, name: "Scenario - A Tribe Called Quest", link: "https://jive.com", media: "" }
    ]
  },
  {
    id: "stock-videogames",
    name: "Post 2010 Video Games",
    isPublic: true,
    items: [
      { rank: 1, name: "GTA VI", link: "https://rockstargames.com", media: "" },
      { rank: 2, name: "Elden Ring", link: "https://bandainamcoent.com", media: "" },
      { rank: 3, name: "The Legend of Zelda: Breath of the Wild", link: "https://nintendo.com", media: "" },
      { rank: 4, name: "The Witcher 3: Wild Hunt", link: "https://cdprojektred.com", media: "" },
      { rank: 5, name: "Red Dead Redemption 2", link: "https://rockstargames.com", media: "" },
      { rank: 6, name: "The Last of Us Part I", link: "https://naughtydog.com", media: "" },
      { rank: 7, name: "God of War (2018)", link: "https://playstation.com", media: "" },
      { rank: 8, name: "Hades", link: "https://supergiantgames.com", media: "" },
      { rank: 9, name: "Minecraft", link: "https://mojang.com", media: "" },
      { rank: 10, name: "Cyberpunk 2077", link: "https://cdprojektred.com", media: "" }
    ]
  },
  {
    id: "stock-novels",
    name: "Novels",
    isPublic: true,
    items: [
      { rank: 1, name: "To Kill a Mockingbird", link: "https://wikipedia.org", media: "" },
      { rank: 2, name: "1984", link: "https://wikipedia.org", media: "" },
      { rank: 3, name: "The Great Gatsby", link: "https://wikipedia.org", media: "" },
      { rank: 4, name: "One Hundred Years of Solitude", link: "https://wikipedia.org", media: "" },
      { rank: 5, name: "Moby-Dick", link: "https://wikipedia.org", media: "" },
      { rank: 6, name: "The Catcher in the Rye", link: "https://wikipedia.org", media: "" },
      { rank: 7, name: "The Lord of the Rings", link: "https://wikipedia.org", media: "" },
      { rank: 8, name: "Crime and Punishment", link: "https://wikipedia.org", media: "" },
      { rank: 9, name: "Brave New World", link: "https://wikipedia.org", media: "" },
      { rank: 10, name: "The Hobbit", link: "https://wikipedia.org", media: "" }
    ]
  },
  {
    id: "stock-restaurants",
    name: "Restaurants",
    isPublic: true,
    items: [
      { rank: 1, name: "Central (Lima)", link: "https://centralrestaurante.com.pe", media: "" },
      { rank: 2, name: "Disfrutar (Barcelona)", link: "https://disfrutarbarcelona.com", media: "" },
      { rank: 3, name: "Diverxo (Madrid)", link: "https://diverxo.com", media: "" },
      { rank: 4, name: "Asador Etxebarri (Achondo)", link: "https://asadoretxebarri.com", media: "" },
      { rank: 5, name: "Alchemist (Copenhagen)", link: "https://alchemist.dk", media: "" },
      { rank: 6, name: "Maido (Lima)", link: "https://maido.pe", media: "" },
      { rank: 7, name: "Lido 84 (Gardone Riviera)", link: "https://kuisinaria.it", media: "" },
      { rank: 8, name: "Atomix (New York)", link: "https://atomixnyc.com", media: "" },
      { rank: 9, name: "Quintonil (Mexico City)", link: "https://quintonil.com", media: "" },
      { rank: 10, name: "The Chairman (Hong Kong)", link: "https://thechairmangroup.com", media: "" }
    ]
  }
];