// ==========================================================================
// D:/top-tens/frontend/stockitems.js
// 9 DEFAULT STOCK CATEGORIES COMPLYING WITH SEAN D WOODSON'S CORE LAYOUTS
// ==========================================================================

const INITIAL_STOCK_CATEGORIES = [
    { id: "cat-1", title: "Shoes", emoji: "👟" },
    { id: "cat-2", title: "Inspiring Athletes", emoji: "🏆" },
    { id: "cat-3", title: "Tech Devices", emoji: "💻" },
    { id: "cat-4", title: "Celebrities", emoji: "✨" },
    { id: "cat-5", title: "Post 2000 Movies", emoji: "🎬" },
    { id: "cat-6", title: "90s Rap Songs", emoji: "🎤" },
    { id: "cat-7", title: "Post 2010 Video Games", emoji: "🎮" },
    { id: "cat-8", title: "Novels", emoji: "📚" },
    { id: "cat-9", title: "Restaurants", emoji: "🍔" }
];

const INITIAL_STOCK_ITEMS = {
    "cat-1": [
        { id: "shoes-1", name: "Air Jordan 1 Retro High", rank: 1, customUrl: "", media: "" },
        { id: "shoes-2", name: "Adidas Ultraboost Light", rank: 2, customUrl: "", media: "" },
        { id: "shoes-3", name: "Nike Air Max 90", rank: 3, customUrl: "", media: "" },
        { id: "shoes-4", name: "New Balance 990v6", rank: 4, customUrl: "", media: "" },
        { id: "shoes-5", name: "Balenciaga Triple S", rank: 5, customUrl: "", media: "" },
        { id: "shoes-6", name: "Asics Gel-Kayano 30", rank: 6, customUrl: "", media: "" },
        { id: "shoes-7", name: "Puma Suede Classic", rank: 7, customUrl: "", media: "" },
        { id: "shoes-8", name: "Vans Old Skool", rank: 8, customUrl: "", media: "" },
        { id: "shoes-9", name: "Converse Chuck Taylor All Star", rank: 9, customUrl: "", media: "" },
        { id: "shoes-10", name: "Salomon XT-6 Black", rank: 10, customUrl: "", media: "" }
    ],
    "cat-2": [
        { id: "ath-1", name: "Michael Jordan", rank: 1, customUrl: "", media: "" },
        { id: "ath-2", name: "Kobe Bryant", rank: 2, customUrl: "", media: "" },
        { id: "ath-3", name: "LeBron James", rank: 3, customUrl: "", media: "" },
        { id: "ath-4", name: "Muhammad Ali", rank: 4, customUrl: "", media: "" },
        { id: "ath-5", name: "Usain Bolt", rank: 5, customUrl: "", media: "" },
        { id: "ath-6", name: "Serena Williams", rank: 6, customUrl: "", media: "" },
        { id: "ath-7", name: "Lionel Messi", rank: 7, customUrl: "", media: "" },
        { id: "ath-8", name: "Cristiano Ronaldo", rank: 8, customUrl: "", media: "" },
        { id: "ath-9", name: "Tom Brady", rank: 9, customUrl: "", media: "" },
        { id: "ath-10", name: "Tiger Woods", rank: 10, customUrl: "", media: "" }
    ],
    "cat-3": [
        { id: "tech-1", name: "iPhone 15 Pro Max", rank: 1, customUrl: "", media: "" },
        { id: "tech-2", name: "MacBook Pro M3 Max", rank: 2, customUrl: "", media: "" },
        { id: "tech-3", name: "ASUS ROG Ally X", rank: 3, customUrl: "", media: "" },
        { id: "tech-4", name: "Sony WH-1000XM5", rank: 4, customUrl: "", media: "" },
        { id: "tech-5", name: "Samsung Galaxy S24 Ultra", rank: 5, customUrl: "", media: "" },
        { id: "tech-6", name: "iPad Pro Tandem OLED", rank: 6, customUrl: "", media: "" },
        { id: "tech-7", name: "Steam Deck OLED", rank: 7, customUrl: "", media: "" },
        { id: "tech-8", name: "DJI Mini 4 Pro", rank: 8, customUrl: "", media: "" },
        { id: "tech-9", name: "Apple Watch Ultra 2", rank: 9, customUrl: "", media: "" },
        { id: "tech-10", name: "Apple Vision Pro", rank: 10, customUrl: "", media: "" }
    ],
    "cat-4": [
        { id: "cel-1", name: "Keanu Reeves", rank: 1, customUrl: "", media: "" },
        { id: "cel-2", name: "Tom Cruise", rank: 2, customUrl: "", media: "" },
        { id: "cel-3", name: "Dwayne Johnson", rank: 3, customUrl: "", media: "" },
        { id: "cel-4", name: "Leonardo DiCaprio", rank: 4, customUrl: "", media: "" },
        { id: "cel-5", name: "Scarlett Johansson", rank: 5, customUrl: "", media: "" },
        { id: "cel-6", name: "Margot Robbie", rank: 6, customUrl: "", media: "" },
        { id: "cel-7", name: "Ryan Reynolds", rank: 7, customUrl: "", media: "" },
        { id: "cel-8", name: "Brad Pitt", rank: 8, customUrl: "", media: "" },
        { id: "cel-9", name: "Johnny Depp", rank: 9, customUrl: "", media: "" },
        { id: "cel-10", name: "Robert Downey Jr.", rank: 10, customUrl: "", media: "" }
    ],
    "cat-5": [
        { id: "mov-1", name: "Inception", rank: 1, customUrl: "", media: "" },
        { id: "mov-2", name: "The Dark Knight", rank: 2, customUrl: "", media: "" },
        { id: "mov-3", name: "Interstellar", rank: 3, customUrl: "", media: "" },
        { id: "mov-4", name: "Avatar", rank: 4, customUrl: "", media: "" },
        { id: "mov-5", name: "Gladiator", rank: 5, customUrl: "", media: "" },
        { id: "mov-6", name: "The Lord of the Rings", rank: 6, customUrl: "", media: "" },
        { id: "mov-7", name: "The Matrix Reloaded", rank: 7, customUrl: "", media: "" },
        { id: "mov-8", name: "Spider-Man: Into the Spider-Verse", rank: 8, customUrl: "", media: "" },
        { id: "mov-9", name: "Everything Everywhere All at Once", rank: 9, customUrl: "", media: "" },
        { id: "mov-10", name: "Whiplash", rank: 10, customUrl: "", media: "" }
    ],
    "cat-6": [
        { id: "rap-1", name: "Juicy - Notorious BIG", rank: 1, customUrl: "", media: "" },
        { id: "rap-2", name: "California Love - Tupac", rank: 2, customUrl: "", media: "" },
        { id: "rap-3", name: "Nuthin But A G Thang - Dr Dre", rank: 3, customUrl: "", media: "" },
        { id: "rap-4", name: "NY State of Mind - Nas", rank: 4, customUrl: "", media: "" },
        { id: "rap-5", name: "C.R.E.A.M. - Wu-Tang Clan", rank: 5, customUrl: "", media: "" },
        { id: "rap-6", name: "Shook Ones Pt II - Mobb Deep", rank: 6, customUrl: "", media: "" },
        { id: "rap-7", name: "Rosa Parks - Outkast", rank: 7, customUrl: "", media: "" },
        { id: "rap-8", name: "Hypnotize - Notorious BIG", rank: 8, customUrl: "", media: "" },
        { id: "rap-9", name: "Dear Mama - Tupac", rank: 9, customUrl: "", media: "" },
        { id: "rap-10", name: "Regulate - Warren G", rank: 10, customUrl: "", media: "" }
    ],
    "cat-7": [
        { id: "gam-1", name: "Grand Theft Auto V", rank: 1, customUrl: "", media: "" },
        { id: "gam-2", name: "The Witcher 3: Wild Hunt", rank: 2, customUrl: "", media: "" },
        { id: "gam-3", name: "Elden Ring", rank: 3, customUrl: "", media: "" },
        { id: "gam-4", name: "Red Dead Redemption 2", rank: 4, customUrl: "", media: "" },
        { id: "gam-5", name: "The Last of Us Part II", rank: 5, customUrl: "", media: "" },
        { id: "gam-6", name: "God of War Ragnarok", rank: 6, customUrl: "", media: "" },
        { id: "gam-7", name: "Minecraft", rank: 7, customUrl: "", media: "" },
        { id: "gam-8", name: "Skyrim", rank: 8, customUrl: "", media: "" },
        { id: "gam-9", name: "Cyberpunk 2077", rank: 9, customUrl: "", media: "" },
        { id: "gam-10", name: "Zelda: Tears of the Kingdom", rank: 10, customUrl: "", media: "" }
    ],
    "cat-8": [
        { id: "nov-1", name: "The Da Vinci Code", rank: 1, customUrl: "", media: "" },
        { id: "nov-2", name: "The Road", rank: 2, customUrl: "", media: "" },
        { id: "nov-3", name: "Gone Girl", rank: 3, customUrl: "", media: "" },
        { id: "nov-4", name: "The Kite Runner", rank: 4, customUrl: "", media: "" },
        { id: "nov-5", name: "A Game of Thrones", rank: 5, customUrl: "", media: "" },
        { id: "nov-6", name: "Harry Potter and the Deathly Hallows", rank: 6, customUrl: "", media: "" },
        { id: "nov-7", name: "Life of Pi", rank: 7, customUrl: "", media: "" },
        { id: "nov-8", name: "The Hunger Games", rank: 8, customUrl: "", media: "" },
        { id: "nov-9", name: "The Girl with the Dragon Tattoo", rank: 9, customUrl: "", media: "" },
        { id: "nov-10", name: "Normal People", rank: 10, customUrl: "", media: "" }
    ],
    "cat-9": [
        { id: "res-1", name: "The French Laundry", rank: 1, customUrl: "", media: "" },
        { id: "res-2", name: "Le Bernardin", rank: 2, customUrl: "", media: "" },
        { id: "res-3", name: "Alinea", rank: 3, customUrl: "", media: "" },
        { id: "res-4", name: "Eleven Madison Park", rank: 4, customUrl: "", media: "" },
        { id: "res-5", name: "Per Se", rank: 5, customUrl: "", media: "" },
        { id: "res-6", name: "Osteria Francescana", rank: 6, customUrl: "", media: "" },
        { id: "res-7", name: "Central", rank: 7, customUrl: "", media: "" },
        { id: "res-8", name: "Noma", rank: 8, customUrl: "", media: "" },
        { id: "res-9", name: "Asador Etxebarri", rank: 9, customUrl: "", media: "" },
        { id: "res-10", name: "Atomix", rank: 10, customUrl: "", media: "" }
    ]
};