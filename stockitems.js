// File: D:/top-tens/frontend/stockitems.js
const STOCK_DATA = {
  categories: [
    { id: "stock_shoes", name: "Shoes" },
    { id: "stock_athletes", name: "Inspiring Athletes" },
    { id: "stock_tech", name: "Tech Devices" },
    { id: "stock_celebrities", name: "Celebrities" },
    { id: "stock_movies", name: "Post 2000 Movies" },
    { id: "stock_rap", name: "90s Rap Songs" },
    { id: "stock_games", name: "Post 2010 Video Games" },
    { id: "stock_novels", name: "Novels" },
    { id: "stock_restaurants", name: "Restaurants" }
  ],
  items: {
    "stock_shoes": [
      { rank: 1, name: "Air Jordan 1 Retro", link: "https://www.amazon.com/s?k=Air+Jordan+1+Retro&tag=toptens-20", media: "" },
      { rank: 2, name: "Nike Air Max 90", link: "https://www.amazon.com/s?k=Nike+Air+Max+90&tag=toptens-20", media: "" },
      { rank: 3, name: "Adidas Ultraboost Light", link: "https://www.amazon.com/s?k=Adidas+Ultraboost&tag=toptens-20", media: "" },
      { rank: 4, name: "Yeezy Boost 350 V2", link: "https://www.amazon.com/s?k=Yeezy+Boost+350&tag=toptens-20", media: "" },
      { rank: 5, name: "New Balance 990v6", link: "https://www.amazon.com/s?k=New+Balance+990v6&tag=toptens-20", media: "" },
      { rank: 6, name: "Converse Chuck Taylor 70", link: "https://www.amazon.com/s?k=Converse+Chuck+Taylor+70&tag=toptens-20", media: "" },
      { rank: 7, name: "Vans Old Skool Classic", link: "https://www.amazon.com/s?k=Vans+Old+Skool&tag=toptens-20", media: "" },
      { rank: 8, name: "Asics Gel-Kayano 30", link: "https://www.amazon.com/s?k=Asics+Gel-Kayano+30&tag=toptens-20", media: "" },
      { rank: 9, name: "Puma Suede Classic", link: "https://www.amazon.com/s?k=Puma+Suede+Classic&tag=toptens-20", media: "" },
      { rank: 10, name: "Balenciaga Triple S", link: "https://www.amazon.com/s?k=Balenciaga+Triple+S&tag=toptens-20", media: "" }
    ],
    "stock_athletes": [
      { rank: 1, name: "LeBron James", link: "https://www.amazon.com/s?k=LeBron+James&tag=toptens-20", media: "" },
      { rank: 2, name: "Serena Williams", link: "https://www.amazon.com/s?k=Serena+Williams&tag=toptens-20", media: "" },
      { rank: 3, name: "Lionel Messi", link: "https://www.amazon.com/s?k=Lionel+Messi&tag=toptens-20", media: "" },
      { rank: 4, name: "Simone Biles", link: "https://www.amazon.com/s?k=Simone+Biles&tag=toptens-20", media: "" },
      { rank: 5, name: "Usain Bolt", link: "https://www.amazon.com/s?k=Usain+Bolt&tag=toptens-20", media: "" },
      { rank: 6, name: "Michael Phelps", link: "https://www.amazon.com/s?k=Michael+Phelps&tag=toptens-20", media: "" },
      { rank: 7, name: "Cristiano Ronaldo", link: "https://www.amazon.com/s?k=Cristiano+Ronaldo&tag=toptens-20", media: "" },
      { rank: 8, name: "Lewis Hamilton", link: "https://www.amazon.com/s?k=Lewis+Hamilton&tag=toptens-20", media: "" },
      { rank: 9, name: "Katie Ledecky", link: "https://www.amazon.com/s?k=Katie+Ledecky&tag=toptens-20", media: "" },
      { rank: 10, name: "Shohei Ohtani", link: "https://www.amazon.com/s?k=Shohei+Ohtani&tag=toptens-20", media: "" }
    ],
    "stock_tech": [
      { rank: 1, name: "iPhone 15 Pro Max", link: "https://www.amazon.com/s?k=iPhone+15+Pro+Max&tag=toptens-20", media: "" },
      { rank: 2, name: "MacBook Pro M3 Max", link: "https://www.amazon.com/s?k=MacBook+Pro+M3&tag=toptens-20", media: "" },
      { rank: 3, name: "Apple Watch Ultra 2", link: "https://www.amazon.com/s?k=Apple+Watch+Ultra+2&tag=toptens-20", media: "" },
      { rank: 4, name: "Sony WH-1000XM5", link: "https://www.amazon.com/s?k=Sony+WH-1000XM5&tag=toptens-20", media: "" },
      { rank: 5, name: "Samsung Galaxy S24 Ultra", link: "https://www.amazon.com/s?k=Samsung+Galaxy+S24+Ultra&tag=toptens-20", media: "" },
      { rank: 6, name: "iPad Pro M4", link: "https://www.amazon.com/s?k=iPad+Pro+M4&tag=toptens-20", media: "" },
      { rank: 7, name: "Dell XPS 15", link: "https://www.amazon.com/s?k=Dell+XPS+15&tag=toptens-20", media: "" },
      { rank: 8, name: "Meta Quest 3", link: "https://www.amazon.com/s?k=Meta+Quest+3&tag=toptens-20", media: "" },
      { rank: 9, name: "Nintendo Switch OLED", link: "https://www.amazon.com/s?k=Nintendo+Switch+OLED&tag=toptens-20", media: "" },
      { rank: 10, name: "GoPro HERO12 Black", link: "https://www.amazon.com/s?k=GoPro+HERO12&tag=toptens-20", media: "" }
    ],
    "stock_celebrities": [
      { rank: 1, name: "Keanu Reeves", link: "https://www.amazon.com/s?k=Keanu+Reeves&tag=toptens-20", media: "" },
      { rank: 2, name: "Tom Cruise", link: "https://www.amazon.com/s?k=Tom+Cruise&tag=toptens-20", media: "" },
      { rank: 3, name: "Dwayne Johnson", link: "https://www.amazon.com/s?k=Dwayne+Johnson&tag=toptens-20", media: "" },
      { rank: 4, name: "Taylor Swift", link: "https://www.amazon.com/s?k=Taylor+Swift&tag=toptens-20", media: "" },
      { rank: 5, name: "Margot Robbie", link: "https://www.amazon.com/s?k=Margot+Robbie&tag=toptens-20", media: "" },
      { rank: 6, name: "Zendaya", link: "https://www.amazon.com/s?k=Zendaya&tag=toptens-20", media: "" },
      { rank: 7, name: "Leonardo DiCaprio", link: "https://www.amazon.com/s?k=Leonardo+DiPario&tag=toptens-20", media: "" },
      { rank: 8, name: "Pedro Pascal", link: "https://www.amazon.com/s?k=Pedro+Pascal&tag=toptens-20", media: "" },
      { rank: 9, name: "Ryan Reynolds", link: "https://www.amazon.com/s?k=Ryan+Reynolds&tag=toptens-20", media: "" },
      { rank: 10, name: "Scarlett Johansson", link: "https://www.amazon.com/s?k=Scarlett+Johansson&tag=toptens-20", media: "" }
    ],
    "stock_movies": [
      { rank: 1, name: "Inception (2010)", link: "https://www.amazon.com/s?k=Inception+BluRay&tag=toptens-20", media: "" },
      { rank: 2, name: "The Dark Knight (2008)", link: "https://www.amazon.com/s?k=The+Dark+Knight+BluRay&tag=toptens-20", media: "" },
      { rank: 3, name: "Interstellar (2014)", link: "https://www.amazon.com/s?k=Interstellar+BluRay&tag=toptens-20", media: "" },
      { rank: 4, name: "Parasite (2019)", link: "https://www.amazon.com/s?k=Parasite+Movie&tag=toptens-20", media: "" },
      { rank: 5, name: "Mad Max: Fury Road (2015)", link: "https://www.amazon.com/s?k=Mad+Max+Fury+Road&tag=toptens-20", media: "" },
      { rank: 6, name: "Everything Everywhere All At Once", link: "https://www.amazon.com/s?k=Everything+Everywhere+All+At+Once&tag=toptens-20", media: "" },
      { rank: 7, name: "Whiplash (2014)", link: "https://www.amazon.com/s?k=Whiplash+Movie&tag=toptens-20", media: "" },
      { rank: 8, name: "Spider-Man: Into the Spider-Verse", link: "https://www.amazon.com/s?k=Into+the+Spider+Verse&tag=toptens-20", media: "" },
      { rank: 9, name: "The Lord of the Rings: Return of the King", link: "https://www.amazon.com/s?k=Return+of+the+King+BluRay&tag=toptens-20", media: "" },
      { rank: 10, name: "Oppenheimer (2023)", link: "https://www.amazon.com/s?k=Oppenheimer+BluRay&tag=toptens-20", media: "" }
    ],
    "stock_rap": [
      { rank: 1, name: "Juicy - Notorious B.I.G.", link: "https://www.amazon.com/s?k=Notorious+BIG+Vinyl&tag=toptens-20", media: "" },
      { rank: 2, name: "C.R.E.A.M. - Wu-Tang Clan", link: "https://www.amazon.com/s?k=Wu+Tang+Clan+Vinyl&tag=toptens-20", media: "" },
      { rank: 3, name: "Nuthin' But A G Thang - Dr. Dre ft. Snoop Dogg", link: "https://www.amazon.com/s?k=Dr+Dre+Chronic&tag=toptens-20", media: "" },
      { rank: 4, name: "California Love - 2Pac ft. Dr. Dre", link: "https://www.amazon.com/s?k=2Pac+All+Eyez+On+Me&tag=toptens-20", media: "" },
      { rank: 5, name: "NY State of Mind - Nas", link: "https://www.amazon.com/s?k=Nas+Illmatic&tag=toptens-20", media: "" },
      { rank: 6, name: "Shook Ones Pt. II - Mobb Deep", link: "https://www.amazon.com/s?k=Mobb+Deep+The+Infamous&tag=toptens-20", media: "" },
      { rank: 7, name: "Changes - 2Pac", link: "https://www.amazon.com/s?k=2Pac+Greatest+Hits&tag=toptens-20", media: "" },
      { rank: 8, name: "Hypnotize - Notorious B.I.G.", link: "https://www.amazon.com/s?k=Life+After+Death+Vinyl&tag=toptens-20", media: "" },
      { rank: 9, name: "Regulate - Warren G ft. Nate Dogg", link: "https://www.amazon.com/s?k=Warren+G+Regulate&tag=toptens-20", media: "" },
      { rank: 10, name: "Rosa Parks - Outkast", link: "https://www.amazon.com/s?k=Outkast+Aquemini&tag=toptens-20", media: "" }
    ],
    "stock_games": [
      { rank: 1, name: "The Legend of Zelda: Breath of the Wild", link: "https://www.amazon.com/s?k=Zelda+Breath+of+the+Wild&tag=toptens-20", media: "" },
      { rank: 2, name: "Elden Ring", link: "https://www.amazon.com/s?k=Elden+Ring&tag=toptens-20", media: "" },
      { rank: 3, name: "The Witcher 3: Wild Hunt", link: "https://www.amazon.com/s?k=Witcher+3+Wild+Hunt&tag=toptens-20", media: "" },
      { rank: 4, name: "Red Dead Redemption 2", link: "https://www.amazon.com/s?k=Red+Dead+Redemption+2&tag=toptens-20", media: "" },
      { rank: 5, name: "Grand Theft Auto V", link: "https://www.amazon.com/s?k=Grand+Theft+Auto+V&tag=toptens-20", media: "" },
      { rank: 6, name: "God of War (2018)", link: "https://www.amazon.com/s?k=God+of+War+PS4&tag=toptens-20", media: "" },
      { rank: 7, name: "The Last of Us Part II", link: "https://www.amazon.com/s?k=The+Last+of+Us+Part+II&tag=toptens-20", media: "" },
      { rank: 8, name: "Hades", link: "https://www.amazon.com/s?k=Hades+Game&tag=toptens-20", media: "" },
      { rank: 9, name: "Cyberpunk 2077 Ultimate Edition", link: "https://www.amazon.com/s?k=Cyberpunk+2077&tag=toptens-20", media: "" },
      { rank: 10, name: "Minecraft", link: "https://www.amazon.com/s?k=Minecraft&tag=toptens-20", media: "" }
    ],
    "stock_novels": [
      { rank: 1, name: "The Road - Cormac McCarthy", link: "https://www.amazon.com/s?k=The+Road+Cormac+McCarthy&tag=toptens-20", media: "" },
      { rank: 2, name: "Gideon the Ninth - Tamsyn Muir", link: "https://www.amazon.com/s?k=Gideon+the+Ninth&tag=toptens-20", media: "" },
      { rank: 3, name: "A Song of Ice and Fire - George R.R. Martin", link: "https://www.amazon.com/s?k=A+Song+of+Ice+and+Fire&tag=toptens-20", media: "" },
      { rank: 4, name: "The Way of Kings - Brandon Sanderson", link: "https://www.amazon.com/s?k=The+Way+of+Kings&tag=toptens-20", media: "" },
      { rank: 5, name: "The Name of the Wind - Patrick Rothfuss", link: "https://www.amazon.com/s?k=The+Name+of+the+Wind&tag=toptens-20", media: "" },
      { rank: 6, name: "Project Hail Mary - Andy Weir", link: "https://www.amazon.com/s?k=Project+Hail+Mary&tag=toptens-20", media: "" },
      { rank: 7, name: "Dune - Frank Herbert", link: "https://www.amazon.com/s?k=Dune+Frank+Herbert&tag=toptens-20", media: "" },
      { rank: 8, name: "The Fifth Season - N.K. Jemisin", link: "https://www.amazon.com/s?k=The+Fifth+Season&tag=toptens-20", media: "" },
      { rank: 9, name: "Neuromancer - William Gibson", link: "https://www.amazon.com/s?k=Neuromancer&tag=toptens-20", media: "" },
      { rank: 10, name: "Cloud Atlas - David Mitchell", link: "https://www.amazon.com/s?k=Cloud+Atlas+David+Mitchell&tag=toptens-20", media: "" }
    ],
    "stock_restaurants": [
      { rank: 1, name: "The French Laundry", link: "https://www.amazon.com/s?k=The+French+Laundry+Cookbook&tag=toptens-20", media: "" },
      { rank: 2, name: "Per Se", link: "https://www.amazon.com/s?k=Thomas+Keller+Books&tag=toptens-20", media: "" },
      { rank: 3, name: "Alinea", link: "https://www.amazon.com/s?k=Alinea+Cookbook&tag=toptens-20", media: "" },
      { rank: 4, name: "Eleven Madison Park", link: "https://www.amazon.com/s?k=Eleven+Madison+Park+Book&tag=toptens-20", media: "" },
      { rank: 5, name: "Le Bernardin", link: "https://www.amazon.com/s?k=Le+Bernardin+Cookbook&tag=toptens-20", media: "" },
      { rank: 6, name: "Osteria Francescana", link: "https://www.amazon.com/s?k=Massimo+Bottura&tag=toptens-20", media: "" },
      { rank: 7, name: "Noma", link: "https://www.amazon.com/s?k=Noma+Guide+to+Fermentation&tag=toptens-20", media: "" },
      { rank: 8, name: "Central (Lima)", link: "https://www.amazon.com/s?k=Central+Virgilio+Martinez&tag=toptens-20", media: "" },
      { rank: 9, name: "Atomix", link: "https://www.amazon.com/s?k=Korean+Fine+Dining&tag=toptens-20", media: "" },
      { rank: 10, name: "Jiro Dreams of Sushi Diner", link: "https://www.amazon.com/s?k=Jiro+Dreams+of+Sushi&tag=toptens-20", media: "" }
    ]
  }
};