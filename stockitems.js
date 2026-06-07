// File: D:/top-tens/frontend/stockitems.js

const STOCK_DATA_STORE = {
    "shoes": {
        emoji: "👟",
        title: "Shoes",
        items: [
            { rank: 1, name: "Air Jordan 1 Retro High OG", link: "https://nike.com", media: "" },
            { rank: 2, name: "Adidas UltraBoost Light", link: "https://adidas.com", media: "" },
            { rank: 3, name: "New Balance 990v6", link: "https://newbalance.com", media: "" },
            { rank: 4, name: "Asics Gel-Kayano 30", link: "https://asics.com", media: "" },
            { rank: 5, name: "Nike Air Max 90", link: "https://nike.com", media: "" },
            { rank: 6, name: "Puma Suede Classic", link: "https://puma.com", media: "" },
            { rank: 7, name: "Vans Old Skool", link: "https://vans.com", media: "" },
            { rank: 8, name: "Converse Chuck Taylor All Star", link: "https://converse.com", media: "" },
            { rank: 9, name: "Brooks Ghost 15", link: "https://brooksrunning.com", media: "" },
            { rank: 10, name: "Salomon XT-6 V2", link: "https://salomon.com", media: "" }
        ]
    },
    "inspiring-athletes": {
        emoji: "🏆",
        title: "Inspiring Athletes",
        items: [
            { rank: 1, name: "Muhammad Ali", link: "https://wikipedia.org", media: "" },
            { rank: 2, name: "Michael Jordan", link: "https://nba.com", media: "" },
            { rank: 3, name: "Serena Williams", link: "https://serenawilliams.com", media: "" },
            { rank: 4, name: "Simone Biles", link: "https://simonebiles.com", media: "" },
            { rank: 5, name: "Usain Bolt", link: "https://usainbolt.com", media: "" },
            { rank: 6, name: "Lionel Messi", link: "https://messi.com", media: "" },
            { rank: 7, name: "Tiger Woods", link: "https://tigerwoods.com", media: "" },
            { rank: 8, name: "Katie Ledecky", link: "https://swimswam.com", media: "" },
            { rank: 9, name: "LeBron James", link: "https://lebronjames.com", media: "" },
            { rank: 10, name: "Shohei Ohtani", link: "https://mlb.com", media: "" }
        ]
    },
    "tech-devices": {
        emoji: "💻",
        title: "Tech Devices",
        items: [
            { rank: 1, name: "Apple MacBook Pro M3 Max", link: "https://apple.com", media: "" },
            { rank: 2, name: "iPhone 15 Pro Max", link: "https://apple.com", media: "" },
            { rank: 3, name: "Samsung Galaxy S24 Ultra", link: "https://samsung.com", media: "" },
            { rank: 4, name: "Sony WH-1000XM5 Headphones", link: "https://sony.com", media: "" },
            { rank: 5, name: "iPad Pro 12.9 Liquid Retina", link: "https://apple.com", media: "" },
            { rank: 6, name: "ASUS ROG Zephyrus G14", link: "https://asus.com", media: "" },
            { rank: 7, name: "Steam Deck OLED", link: "https://steampowered.com", media: "" },
            { rank: 8, name: "Sony PlayStation 5 Pro", link: "https://playstation.com", media: "" },
            { rank: 9, name: "DJI Mini 4 Pro Drone", link: "https://dji.com", media: "" },
            { rank: 10, name: "Apple Watch Ultra 2", link: "https://apple.com", media: "" }
        ]
    },
    "celebrities": {
        emoji: "🎬",
        title: "Celebrities",
        items: [
            { rank: 1, name: "Keanu Reeves", link: "https://imdb.com", media: "" },
            { rank: 2, name: "Tom Hanks", link: "https://imdb.com", media: "" },
            { rank: 3, name: "Denzel Washington", link: "https://imdb.com", media: "" },
            { rank: 4, name: "Pedro Pascal", link: "https://imdb.com", media: "" },
            { rank: 5, name: "Zendaya", link: "https://imdb.com", media: "" },
            { rank: 6, name: "Margot Robbie", link: "https://imdb.com", media: "" },
            { rank: 7, name: "Cillian Murphy", link: "https://imdb.com", media: "" },
            { rank: 8, name: "Robert Downey Jr.", link: "https://imdb.com", media: "" },
            { rank: 9, name: "Viola Davis", link: "https://imdb.com", media: "" },
            { rank: 10, name: "Hugh Jackman", link: "https://imdb.com", media: "" }
        ]
    },
    "post-2000-movies": {
        emoji: "🎥",
        title: "Post 2000 Movies",
        items: [
            { rank: 1, name: "The Dark Knight (2008)", link: "https://warnerbros.com", media: "" },
            { rank: 2, name: "Inception (2010)", link: "https://warnerbros.com", media: "" },
            { rank: 3, name: "Interstellar (2014)", link: "https://paramount.com", media: "" },
            { rank: 4, name: "Mad Max: Fury Road (2015)", link: "https://warnerbros.com", media: "" },
            { rank: 5, name: "Parasite (2019)", link: "https://neonrated.com", media: "" },
            { rank: 6, name: "Whiplash (2014)", link: "https://sonyclassics.com", media: "" },
            { rank: 7, name: "Everything Everywhere All At Once", link: "https://a24films.com", media: "" },
            { rank: 8, name: "Dune: Part Two (2024)", link: "https://legendary.com", media: "" },
            { rank: 9, name: "Spider-Man: Into the Spider-Verse", link: "https://sonypictures.com", media: "" },
            { rank: 10, name: "The Lord of the Rings: Return of the King", link: "https://newline.com", media: "" }
        ]
    },
    "90s-rap-songs": {
        emoji: "🎤",
        title: "90s Rap Songs",
        items: [
            { rank: 1, name: "Juicy - Notorious B.I.G.", link: "https://badboy.com", media: "" },
            { rank: 2, name: "C.R.E.A.M. - Wu-Tang Clan", link: "https://wutangclan.com", media: "" },
            { rank: 3, name: "California Love - 2Pac", link: "https://deathrowrecords.com", media: "" },
            { rank: 4, name: "Nuthin' But A 'G' Thang - Dr. Dre", link: "https://deathrowrecords.com", media: "" },
            { rank: 5, name: "Shook Ones, Pt. II - Mobb Deep", link: "https://loud.com", media: "" },
            { rank: 6, name: "The World Is Yours - Nas", link: "https://columbiarecords.com", media: "" },
            { rank: 7, name: "Mind Playing Tricks on Me - Geto Boys", link: "https://rapalotrecords.com", media: "" },
            { rank: 8, name: "Hypnotize - Notorious B.I.G.", link: "https://badboy.com", media: "" },
            { rank: 9, name: "Dear Mama - 2Pac", link: "https://interscope.com", media: "" },
            { rank: 10, name: "Rosa Parks - Outkast", link: "https://laface.com", media: "" }
        ]
    },
    "post-2010-video-games": {
        emoji: "🎮",
        title: "Post 2010 Video Games",
        items: [
            { rank: 1, name: "Elden Ring", link: "https://bandainamcoent.com", media: "" },
            { rank: 2, name: "The Legend of Zelda: Breath of the Wild", link: "https://nintendo.com", media: "" },
            { rank: 3, name: "The Witcher 3: Wild Hunt", link: "https://cdprojektred.com", media: "" },
            { rank: 4, name: "Red Dead Redemption 2", link: "https://rockstargames.com", media: "" },
            { rank: 5, name: "The Last of Us Part I", link: "https://playstation.com", media: "" },
            { rank: 6, name: "God of War (2018)", link: "https://playstation.com", media: "" },
            { rank: 7, name: "Hades", link: "https://supergiantgames.com", media: "" },
            { rank: 8, name: "GTA V", link: "https://rockstargames.com", media: "" },
            { rank: 9, name: "Cyberpunk 2077 Phantom Liberty", link: "https://cdprojektred.com", media: "" },
            { rank: 10, name: "Baldur's Gate 3", link: "https://larian.com", media: "" }
        ]
    },
    "novels": {
        emoji: "📚",
        title: "Novels",
        items: [
            { rank: 1, name: "To Kill a Mockingbird", link: "https://harpercollins.com", media: "" },
            { rank: 2, name: "1984 - George Orwell", link: "https://penguin.com", media: "" },
            { rank: 3, name: "The Great Gatsby", link: "https://simonandschuster.com", media: "" },
            { rank: 4, name: "One Hundred Years of Solitude", link: "https://harpercollins.com", media: "" },
            { rank: 5, name: "The Catcher in the Rye", link: "https://littlebrown.com", media: "" },
            { rank: 6, name: "The Hobbit", link: "https://harpercollins.com", media: "" },
            { rank: 7, name: "Fahrenheit 451", link: "https://simonandschuster.com", media: "" },
            { rank: 8, name: "Crime and Punishment", link: "https://penguin.com", media: "" },
            { rank: 9, name: "Brave New World", link: "https://harpercollins.com", media: "" },
            { rank: 10, name: "The Road - Cormac McCarthy", link: "https://knopf.com", media: "" }
        ]
    },
    "restaurants": {
        emoji: "🍔",
        title: "Restaurants",
        items: [
            { rank: 1, name: "Osteria Francescana - Modena", link: "https://osteriafrancescana.it", media: "" },
            { rank: 2, name: "Central - Lima", link: "https://centralrestaurante.com.pe", media: "" },
            { rank: 3, name: "Eleven Madison Park - NYC", link: "https://elevenmadisonpark.com", media: "" },
            { rank: 4, name: "The Ledbury - London", link: "https://theledbury.com", media: "" },
            { rank: 5, name: "Gaggan Anand - Bangkok", link: "https://gaggananand.com", media: "" },
            { rank: 6, name: "Asador Etxebarri - Achondo", link: "https://asadoretxebarri.com", media: "" },
            { rank: 7, name: "Den - Tokyo", link: "https://jimbochoden.com", media: "" },
            { rank: 8, name: "Mugaritz - San Sebastian", link: "https://mugaritz.com", media: "" },
            { rank: 9, name: "Pujol - Mexico City", link: "https://pujol.com.mx", media: "" },
            { rank: 10, name: "Alchemist - Copenhagen", link: "https://alchemist.dk", media: "" }
        ]
    }
};
// File: D:/top-tens/frontend/stockitems.js
// Precise Location: The absolute bottom of the file after the data object closes.

window.INITIAL_STOCK_VAULT = STOCK_DATA_STORE;