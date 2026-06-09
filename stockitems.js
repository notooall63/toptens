/**
 * Hardcoded Mock Dataset Architecture
 * Fallback static structure used to safely pre-populate the application state
 */
const GLOBAL_STOCK_CATEGORIES = [
    { id: "s-shoes", title: "Shoes", emoji: "👟" },
    { id: "s-athletes", title: "Inspiring Athletes", emoji: "🏃‍♂️" },
    { id: "s-tech", title: "Tech Devices", emoji: "📱" },
    { id: "s-celebrities", title: "Celebrities", emoji: "🎭" },
    { id: "s-movies", title: "Post 2000 Movies", emoji: "🎬" },
    { id: "s-rap", title: "90s Rap Songs", emoji: "🎤" },
    { id: "s-games", title: "Post 2010 Video Games", emoji: "🎮" },
    { id: "s-novels", title: "Novels", emoji: "📚" },
    { id: "s-restaurants", title: "Restaurants", emoji: "🍔" }
];

const GLOBAL_STOCK_ITEMS = {
    "s-shoes": [
        { name: "Air Jordan 1 Retro High", rank: 1, media: "" },
        { name: "Adidas Ultraboost Light", rank: 2, media: "" },
        { name: "Nike Air Max 90", rank: 3, media: "" },
        { name: "New Balance 990v6", rank: 4, media: "" },
        { name: "Balenciaga Triple S", rank: 5, media: "" },
        { name: "Asics Gel-Kayano 30", rank: 6, media: "" },
        { name: "Puma Suede Classic", rank: 7, media: "" },
        { name: "Converse Chuck Taylor All Star", rank: 8, media: "" },
        { name: "Vans Old Skool", rank: 9, media: "" },
        { name: "Common Projects Achilles Low", rank: 10, media: "" }
    ],
    "s-athletes": [
        { name: "Michael Jordan", rank: 1, media: "" },
        { name: "Muhammad Ali", rank: 2, media: "" },
        { name: "Serena Williams", rank: 3, media: "" },
        { name: "Usain Bolt", rank: 4, media: "" },
        { name: "Lionel Messi", rank: 5, media: "" },
        { name: "Kobe Bryant", rank: 6, media: "" },
        { name: "Simone Biles", rank: 7, media: "" },
        { name: "LeBron James", rank: 8, media: "" },
        { name: "Roger Federer", rank: 9, media: "" },
        { name: "Tiger Woods", rank: 10, media: "" }
    ],
    "s-tech": [
        { name: "iPhone 15 Pro Max", rank: 1, media: "" },
        { name: "MacBook Pro M3 Max", rank: 2, media: "" },
        { name: "ASUS ROG Ally X", rank: 3, media: "" },
        { name: "Sony WH-1000XM5", rank: 4, media: "" },
        { name: "Samsung Galaxy S24 Ultra", rank: 5, media: "" },
        { name: "iPad Pro Tandem OLED", rank: 6, media: "" },
        { name: "Steam Deck OLED", rank: 7, media: "" },
        { name: "DJI Mini 4 Pro", rank: 8, media: "" },
        { name: "Apple Watch Ultra 2", rank: 9, media: "" },
        { name: "Anker Prime Power Bank", rank: 10, media: "" }
    ],
    "s-celebrities": [
        { name: "Keanu Reeves", rank: 1, media: "" },
        { name: "Dwayne Johnson", rank: 2, media: "" },
        { name: "Tom Cruise", rank: 3, media: "" },
        { name: "Rihanna", rank: 4, media: "" },
        { name: "Leonardo DiCaprio", rank: 5, media: "" },
        { name: "Taylor Swift", rank: 6, media: "" },
        { name: "Robert Downey Jr.", rank: 7, media: "" },
        { name: "Scarlett Johansson", rank: 8, media: "" },
        { name: "Denzel Washington", rank: 9, media: "" },
        { name: "Lady Gaga", rank: 10, media: "" }
    ],
    "s-movies": [
        { name: "Inception", rank: 1, media: "" },
        { name: "The Dark Knight", rank: 2, media: "" },
        { name: "Interstellar", rank: 3, media: "" },
        { name: "Avatar", rank: 4, media: "" },
        { name: "The Lord of the Rings: Return of the King", rank: 5, media: "" },
        { name: "Parasite", rank: 6, media: "" },
        { name: "Mad Max: Fury Road", rank: 7, media: "" },
        { name: "Spider-Man: Into the Spider-Verse", rank: 8, media: "" },
        { name: "Whiplash", rank: 9, media: "" },
        { name: "Gladiator", rank: 10, media: "" }
    ],
    "s-rap": [
        { name: "Juicy - Notorious B.I.G.", rank: 1, media: "" },
        { name: "C.R.E.A.M. - Wu-Tang Clan", rank: 2, media: "" },
        { name: "California Love - 2Pac", rank: 3, media: "" },
        { name: "Nuthin' But A G Thang - Dr. Dre", rank: 4, media: "" },
        { name: "N.Y. State of Mind - Nas", rank: 5, media: "" },
        { name: "Shook Ones Pt. II - Mobb Deep", rank: 6, media: "" },
        { name: "Changes - 2Pac", rank: 7, media: "" },
        { name: "Hypnotize - Notorious B.I.G.", rank: 8, media: "" },
        { name: "Regulate - Warren G", rank: 9, media: "" },
        { name: "Mind Playing Tricks on Me - Geto Boys", rank: 10, media: "" }
    ],
    "s-games": [
        { name: "Elden Ring", rank: 1, media: "" },
        { name: "The Legend of Zelda: Breath of the Wild", rank: 2, media: "" },
        { name: "The Witcher 3: Wild Hunt", rank: 3, media: "" },
        { name: "Red Dead Redemption 2", rank: 4, media: "" },
        { name: "Grand Theft Auto V", rank: 5, media: "" },
        { name: "Minecraft", rank: 6, media: "" },
        { name: "God of War (2018)", rank: 7, media: "" },
        { name: "Hades", rank: 8, media: "" },
        { name: "Cyberpunk 2077 Phantom Liberty", rank: 9, media: "" },
        { name: "Baldur's Gate 3", rank: 10, media: "" }
    ],
    "s-novels": [
        { name: "The Road - Cormac McCarthy", rank: 1, media: "" },
        { name: "Gone Girl - Gillian Flynn", rank: 2, media: "" },
        { name: "The Da Vinci Code - Dan Brown", rank: 3, media: "" },
        { name: "A Game of Thrones - George R.R. Martin", rank: 4, media: "" },
        { name: "Normal People - Sally Rooney", rank: 5, media: "" },
        { name: "The Kite Runner - Khaled Hosseini", rank: 6, media: "" },
        { name: "Project Hail Mary - Andy Weir", rank: 7, media: "" },
        { name: "American Psycho - Bret Easton Ellis", rank: 8, media: "" },
        { name: "Where the Crawdads Sing - Delia Owens", rank: 9, media: "" },
        { name: "The Girl with the Dragon Tattoo - Stieg Larsson", rank: 10, media: "" }
    ],
    "s-restaurants": [
        { name: "Central (Lima, Peru)", rank: 1, media: "" },
        { name: "Disfrutar (Barcelona, Spain)", rank: 2, media: "" },
        { name: "Asador Etxebarri (Atxondo, Spain)", rank: 3, media: "" },
        { name: "Alchemist (Copenhagen, Denmark)", rank: 4, media: "" },
        { name: "Maido (Lima, Peru)", rank: 5, media: "" },
        { name: "Atomix (New York, USA)", rank: 6, media: "" },
        { name: "Quintonil (Mexico City, Mexico)", rank: 7, media: "" },
        { name: "The Chairman (Hong Kong, China)", rank: 8, media: "" },
        { name: "Lido 84 (Gardone Riviera, Italy)", rank: 9, media: "" },
        { name: "Table by Bruno Verjus (Paris, France)", rank: 10, media: "" }
    ]
};