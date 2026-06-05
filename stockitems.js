// File: D:/top-tens/frontend/stockitems.js

const stockCategories = [
    { id: "cat-1", name: "Shoes", emoji: "👟" },
    { id: "cat-2", name: "Inspiring Athletes", emoji: "🏆" },
    { id: "cat-3", name: "Tech Devices", emoji: "💻" },
    { id: "cat-4", name: "Celebrities", emoji: "🌟" },
    { id: "cat-5", name: "Post 2000 Movies", emoji: "🎬" },
    { id: "cat-6", name: "90s Rap Songs", emoji: "🎤" },
    { id: "cat-7", name: "Post 2010 Video Games", emoji: "🎮" },
    { id: "cat-8", name: "Novels", emoji: "📚" },
    { id: "cat-9", name: "Restaurants", emoji: "🍔" }
];

const stockItems = [
    // Shoes (cat-1)
    { id: "item-1-1", categoryId: "cat-1", rank: 1, name: "Air Jordan 1 Retro High", media: "", url: "https://amazon.com/s?k=Air+Jordan+1+Retro+High" },
    { id: "item-1-2", categoryId: "cat-1", rank: 2, name: "Adidas Ultraboost Light", media: "", url: "https://amazon.com/s?k=Adidas+Ultraboost+Light" },
    { id: "item-1-3", categoryId: "cat-1", rank: 3, name: "Nike Air Max 90", media: "", url: "https://amazon.com/s?k=Nike+Air+Max+90" },
    { id: "item-1-4", categoryId: "cat-1", rank: 4, name: "New Balance 990v6", media: "", url: "https://amazon.com/s?k=New+Balance+990v6" },
    { id: "item-1-5", categoryId: "cat-1", rank: 5, name: "Asics Gel-Kayano 30", media: "", url: "https://amazon.com/s?k=Asics+Gel+Kayano+30" },
    { id: "item-1-6", categoryId: "cat-1", rank: 6, name: "Puma Suede Classic", media: "", url: "https://amazon.com/s?k=Puma+Suede+Classic" },
    { id: "item-1-7", categoryId: "cat-1", rank: 7, name: "Vans Old Skool Core", media: "", url: "https://amazon.com/s?k=Vans+Old+Skool+Core" },
    { id: "item-1-8", categoryId: "cat-1", rank: 8, name: "Converse Chuck Taylor 70", media: "", url: "https://amazon.com/s?k=Converse+Chuck+Taylor+70" },
    { id: "item-1-9", categoryId: "cat-1", rank: 9, name: "Salomon XT-6 Advanced", media: "", url: "https://amazon.com/s?k=Salomon+XT6+Advanced" },
    { id: "item-1-10", categoryId: "cat-1", rank: 10, name: "Balenciaga Triple S", media: "", url: "https://amazon.com/s?k=Balenciaga+Triple+S" },

    // Inspiring Athletes (cat-2)
    { id: "item-2-1", categoryId: "cat-2", rank: 1, name: "Muhammad Ali", media: "", url: "https://amazon.com/s?k=Muhammad+Ali+Biography" },
    { id: "item-2-2", categoryId: "cat-2", rank: 2, name: "Michael Jordan", media: "", url: "https://amazon.com/s?k=Michael+Jordan" },
    { id: "item-2-3", categoryId: "cat-2", rank: 3, name: "Serena Williams", media: "", url: "https://amazon.com/s?k=Serena+Williams" },
    { id: "item-2-4", categoryId: "cat-2", rank: 4, name: "Kobe Bryant", media: "", url: "https://amazon.com/s?k=Kobe+Bryant+Mamba+Mentality" },
    { id: "item-2-5", categoryId: "cat-2", rank: 5, name: "Usain Bolt", media: "", url: "https://amazon.com/s?k=Usain+Bolt" },
    { id: "item-2-6", categoryId: "cat-2", rank: 6, name: "Simone Biles", media: "", url: "https://amazon.com/s?k=Simone+Biles" },
    { id: "item-2-7", categoryId: "cat-2", rank: 7, name: "Lionel Messi", media: "", url: "https://amazon.com/s?k=Lionel+Messi" },
    { id: "item-2-8", categoryId: "cat-2", rank: 8, name: "Tiger Woods", media: "", url: "https://amazon.com/s?k=Tiger+Woods" },
    { id: "item-2-9", categoryId: "cat-2", rank: 9, name: "Tom Brady", media: "", url: "https://amazon.com/s?k=Tom+Brady" },
    { id: "item-2-10", categoryId: "cat-2", rank: 10, name: "Ayrton Senna", media: "", url: "https://amazon.com/s?k=Ayrton+Senna" },

    // Tech Devices (cat-3)
    { id: "item-3-1", categoryId: "cat-3", rank: 1, name: "Apple MacBook Pro M3", media: "", url: "https://amazon.com/s?k=MacBook+Pro+M3" },
    { id: "item-3-2", categoryId: "cat-3", rank: 2, name: "iPhone 15 Pro Max", media: "", url: "https://amazon.com/s?k=iPhone+15+Pro+Max" },
    { id: "item-3-3", categoryId: "cat-3", rank: 3, name: "iPad Pro OLED", media: "", url: "https://amazon.com/s?k=iPad+Pro+OLED" },
    { id: "item-3-4", categoryId: "cat-3", rank: 4, name: "Samsung Galaxy S24 Ultra", media: "", url: "https://amazon.com/s?k=Samsung+Galaxy+S24+Ultra" },
    { id: "item-3-5", categoryId: "cat-3", rank: 5, name: "Sony WH-1000XM5", media: "", url: "https://amazon.com/s?k=Sony+WH1000XM5" },
    { id: "item-3-6", categoryId: "cat-3", rank: 6, name: "ASUS ROG Ally X", media: "", url: "https://amazon.com/s?k=ASUS+ROG+Ally+X" },
    { id: "item-3-7", categoryId: "cat-3", rank: 7, name: "Nvidia RTX 4090 GPU", media: "", url: "https://amazon.com/s?k=Nvidia+RTX+4090" },
    { id: "item-3-8", categoryId: "cat-3", rank: 8, name: "Keychron Q1 Pro Keyboard", media: "", url: "https://amazon.com/s?k=Keychron+Q1+Pro" },
    { id: "item-3-9", categoryId: "cat-3", rank: 9, name: "Dell XPS 15", media: "", url: "https://amazon.com/s?k=Dell+XPS+15" },
    { id: "item-3-10", categoryId: "cat-3", rank: 10, name: "Apple Watch Ultra 2", media: "", url: "https://amazon.com/s?k=Apple+Watch+Ultra+2" },

    // Celebrities (cat-4)
    { id: "item-4-1", categoryId: "cat-4", rank: 1, name: "Keanu Reeves", media: "", url: "https://amazon.com/s?k=Keanu+Reeves" },
    { id: "item-4-2", categoryId: "cat-4", rank: 2, name: "Denzel Washington", media: "", url: "https://amazon.com/s?k=Denzel+Washington" },
    { id: "item-4-3", categoryId: "cat-4", rank: 3, name: "Tom Cruise", media: "", url: "https://amazon.com/s?k=Tom+Cruise" },
    { id: "item-4-4", categoryId: "cat-4", rank: 4, name: "Pedro Pascal", media: "", url: "https://amazon.com/s?k=Pedro+Pascal" },
    { id: "item-4-5", categoryId: "cat-4", rank: 5, name: "Margot Robbie", media: "", url: "https://amazon.com/s?k=Margot+Robbie" },
    { id: "item-4-6", categoryId: "cat-4", rank: 6, name: "Cillian Murphy", media: "", url: "https://amazon.com/s?k=Cillian+Murphy" },
    { id: "item-4-7", categoryId: "cat-4", rank: 7, name: "Ryan Gosling", media: "", url: "https://amazon.com/s?k=Ryan+Gosling" },
    { id: "item-4-8", categoryId: "cat-4", rank: 8, name: "Scarlett Johansson", media: "", url: "https://amazon.com/s?k=Scarlett+Johansson" },
    { id: "item-4-9", categoryId: "cat-4", rank: 9, name: "Robert Downey Jr.", media: "", url: "https://amazon.com/s?k=Robert+Downey+Jr" },
    { id: "item-4-10", categoryId: "cat-4", rank: 10, name: "Zendaya", media: "", url: "https://amazon.com/s?k=Zendaya" },

    // Post 2000 Movies (cat-5)
    { id: "item-5-1", categoryId: "cat-5", rank: 1, name: "Inception (2010)", media: "", url: "https://amazon.com/s?k=Inception+BluRay" },
    { id: "item-5-2", categoryId: "cat-5", rank: 2, name: "The Dark Knight (2008)", media: "", url: "https://amazon.com/s?k=The+Dark+Knight+BluRay" },
    { id: "item-5-3", categoryId: "cat-5", rank: 3, name: "Interstellar (2014)", media: "", url: "https://amazon.com/s?k=Interstellar+BluRay" },
    { id: "item-5-4", categoryId: "cat-5", rank: 4, name: "The Lord of the Rings: Return of the King", media: "", url: "https://amazon.com/s?k=The+Lord+of+the+Rings+Return+of+the+King" },
    { id: "item-5-5", categoryId: "cat-5", rank: 5, name: "Mad Max: Fury Road (2015)", media: "", url: "https://amazon.com/s?k=Mad+Max+Fury+Road" },
    { id: "item-5-6", categoryId: "cat-5", rank: 6, name: "Whiplash (2014)", media: "", url: "https://amazon.com/s?k=Whiplash" },
    { id: "item-5-7", category "categoryId": "cat-5", rank: 7, name: "No Country for Old Men (2007)", media: "", url: "https://amazon.com/s?k=No+Country+for+Old+Men" },
    { id: "item-5-8", categoryId: "cat-5", rank: 8, name: "Parasite (2019)", media: "", url: "https://amazon.com/s?k=Parasite+Movie" },
    { id: "item-5-9", categoryId: "cat-5", rank: 9, name: "Everything Everywhere All At Once", media: "", url: "https://amazon.com/s?k=Everything+Everywhere+All+At+Once" },
    { id: "item-5-10", categoryId: "cat-5", rank: 10, name: "Spider-Man: Into the Spider-Verse", media: "", url: "https://amazon.com/s?k=Spider-Man+Into+the+Spider-Verse" },

    // 90s Rap Songs (cat-6)
    { id: "item-6-1", categoryId: "cat-6", rank: 1, name: "Juicy - Notorious B.I.G.", media: "", url: "https://amazon.com/s?k=Notorious+BIG+Juicy" },
    { id: "item-6-2", categoryId: "cat-6", rank: 2, name: "California Love - 2Pac", media: "", url: "https://amazon.com/s?k=2Pac+California+Love" },
    { id: "item-6-3", categoryId: "cat-6", rank: 3, name: "Nuthin' But A G Thang - Dr. Dre", media: "", url: "https://amazon.com/s?k=Dr+Dre+Nuthin+But+A+G+Thang" },
    { id: "item-6-4", categoryId: "cat-6", rank: 4, name: "C.R.E.A.M. - Wu-Tang Clan", media: "", url: "https://amazon.com/s?k=Wu+Tang+Clan+CREAM" },
    { id: "item-6-5", categoryId: "cat-6", rank: 5, name: "Shook Ones Pt. II - Mobb Deep", media: "", url: "https://amazon.com/s?k=Mobb+Deep+Shook+Ones" },
    { id: "item-6-6", categoryId: "cat-6", rank: 6, name: "Mind Playing Tricks on Me - Geto Boys", media: "", url: "https://amazon.com/s?k=Geto+Boys+Mind+Playing+Tricks+on+Me" },
    { id: "item-6-7", categoryId: "cat-6", rank: 7, name: "The Choice Is Yours - Black Sheep", media: "", url: "https://amazon.com/s?k=Black+Sheep+The+Choice+Is+Yours" },
    { id: "item-6-8", categoryId: "cat-6", rank: 8, name: "Regulate - Warren G", media: "", url: "https://amazon.com/s?k=Warren+G+Regulate" },
    { id: "item-6-9", categoryId: "cat-6", rank: 9, name: "Nas - NY State of Mind", media: "", url: "https://amazon.com/s?k=Nas+Illmatic" },
    { id: "item-6-10", categoryId: "cat-6", rank: 10, name: "Rosa Parks - Outkast", media: "", url: "https://amazon.com/s?k=Outkast+Rosa+Parks" },

    // Post 2010 Video Games (cat-7)
    { id: "item-7-1", categoryId: "cat-7", rank: 1, name: "Elden Ring", media: "", url: "https://amazon.com/s?k=Elden+Ring" },
    { id: "item-7-2", categoryId: "cat-7", rank: 2, name: "The Legend of Zelda: Breath of the Wild", media: "", url: "https://amazon.com/s?k=Zelda+Breath+of+the+Wild" },
    { id: "item-7-3", categoryId: "cat-7", rank: 3, name: "Red Dead Redemption 2", media: "", url: "https://amazon.com/s?k=Red+Dead+Redemption+2" },
    { id: "item-7-4", categoryId: "cat-7", rank: 4, name: "The Witcher 3: Wild Hunt", media: "", url: "https://amazon.com/s?k=The+Witcher+3+Wild+Hunt" },
    { id: "item-7-5", categoryId: "cat-7", rank: 5, name: "God of War (2018)", media: "", url: "https://amazon.com/s?k=God+of+War+2018" },
    { id: "item-7-6", categoryId: "cat-7", rank: 6, name: "GTA V", media: "", url: "https://amazon.com/s?k=GTA+V" },
    { id: "item-7-7", categoryId: "cat-7", rank: 7, name: "Hades", media: "", url: "https://amazon.com/s?k=Hades+Game" },
    { id: "item-7-8", categoryId: "cat-7", rank: 8, name: "The Last of Us Part II", media: "", url: "https://amazon.com/s?k=The+Last+of+Us+Part+II" },
    { id: "item-7-9", categoryId: "cat-7", rank: 9, name: "Cyberpunk 2077 Ultimate Edition", media: "", url: "https://amazon.com/s?k=Cyberpunk+2077" },
    { id: "item-7-10", categoryId: "cat-7", rank: 10, name: "Baldur's Gate 3", media: "", url: "https://amazon.com/s?k=Baldurs+Gate+3" },

    // Novels (cat-8)
    { id: "item-8-1", categoryId: "cat-8", rank: 1, name: "The Road - Cormac McCarthy", media: "", url: "https://amazon.com/s?k=The+Road+Cormac+McCarthy" },
    { id: "item-8-2", categoryId: "cat-8", rank: 2, name: "Kafka on the Shore - Haruki Murakami", media: "", url: "https://amazon.com/s?k=Kafka+on+the+Shore" },
    { id: "item-8-3", categoryId: "cat-8", rank: 3, name: "Gone Girl - Gillian Flynn", media: "", url: "https://amazon.com/s?k=Gone+Girl+Novel" },
    { id: "item-8-4", categoryId: "cat-8", rank: 4, name: "Project Hail Mary - Andy Weir", media: "", url: "https://amazon.com/s?k=Project+Hail+Mary" },
    { id: "item-8-5", categoryId: "cat-8", rank: 5, name: "The Goldfinch - Donna Tartt", media: "", url: "https://amazon.com/s?k=The+Goldfinch" },
    { id: "item-8-6", categoryId: "cat-8", rank: 6, name: "A Song of Ice and Fire - George RR Martin", media: "", url: "https://amazon.com/s?k=A+Song+of+Ice+and+Fire" },
    { id: "item-8-7", categoryId: "cat-8", rank: 7, name: "Cloud Atlas - David Mitchell", media: "", url: "https://amazon.com/s?k=Cloud+Atlas" },
    { id: "item-8-8", categoryId: "cat-8", rank: 8, name: "Normal People - Sally Rooney", media: "", url: "https://amazon.com/s?k=Normal+People+Novel" },
    { id: "item-8-9", categoryId: "cat-8", rank: 9, name: "The Ocean at the End of the Lane", media: "", url: "https://amazon.com/s?k=The+Ocean+at+the+End+of+the+Lane" },
    { id: "item-8-10", categoryId: "cat-8", rank: 10, name: "Station Eleven - Emily St. John Mandel", media: "", url: "https://amazon.com/s?k=Station+Eleven" },

    // Restaurants (cat-9)
    { id: "item-9-1", categoryId: "cat-9", rank: 1, name: "Central (Lima, Peru)", media: "", url: "https://google.com/search?q=Central+Lima+Peru+Restaurant" },
    { id: "item-9-2", categoryId: "cat-9", rank: 2, name: "Disfrutar (Barcelona, Spain)", media: "", url: "https://google.com/search?q=Disfrutar+Barcelona+Spain" },
    { id: "item-9-3", categoryId: "cat-9", rank: 3, name: "Asador Etxebarri (Atxondo, Spain)", media: "", url: "https://google.com/search?q=Asador+Etxebarri+Spain" },
    { id: "item-9-4", categoryId: "cat-9", rank: 4, name: "Alchemist (Copenhagen, Denmark)", media: "", url: "https://google.com/search?q=Alchemist+Copenhagen" },
    { id: "item-9-5", categoryId: "cat-9", rank: 5, name: "Maido (Lima, Peru)", media: "", url: "https://google.com/search?q=Maido+Lima" },
    { id: "item-9-6", categoryId: "cat-9", rank: 6, name: "Atomix (New York, USA)", media: "", url: "https://google.com/search?q=Atomix+New+York" },
    { id: "item-9-7", categoryId: "cat-9", rank: 7, name: "Quintonil (Mexico City, Mexico)", media: "", url: "https://google.com/search?q=Quintonil+Mexico+City" },
    { id: "item-9-8", categoryId: "cat-9", rank: 8, name: "The Chairman (Hong Kong)", media: "", url: "https://google.com/search?q=The+Chairman+Hong+Kong" },
    { id: "item-9-9", categoryId: "cat-9", rank: 9, name: "Lido 84 (Gardone Riviera, Italy)", media: "", url: "https://google.com/search?q=Lido+84+Italy" },
    { id: "item-9-10", categoryId: "cat-9", rank: 10, name: "Table by Bruno Verjus (Paris, France)", media: "", url: "https://google.com/search?q=Table+by+Bruno+Verjus" }
];

// Mock database storage for public sandbox friends
const defaultMockFriends = [
    { username: "crypto_whale_99", matchingCategories: 5, matchingItems: 34, avatar: "" },
    { username: "nj_litigator_pro", matchingCategories: 3, matchingItems: 18, avatar: "" },
    { username: "quant_trader_alpha", matchingCategories: 8, matchingItems: 62, avatar: "" }
];