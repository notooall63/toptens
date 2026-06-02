/**
 * Top Tens - Production Grade Stock Asset Matrix
 * Core categories: Shoes, Inspiring Athletes, Tech Devices, Celebrities, 
 * Post 2000 Movies, 90s Rap Songs, Post 2010 Video Games, Novels, Restaurants.
 */

function getFreshStockCategories() {
    return [
        {
            id: "cat_shoes",
            name: "Shoes",
            icon: "👟",
            description: "Iconic sneakers and defining footwear iterations.",
            items: [
                { rank: 1, title: "Nike Air Max 1", url: "https://www.nike.com", thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150" },
                { rank: 2, title: "adidas Ultraboost", url: "https://www.adidas.com", thumbnail: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=150" },
                { rank: 3, title: "New Balance 990v6", url: "https://www.newbalance.com", thumbnail: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=150" },
                { rank: 4, title: "Converse Chuck Taylor", url: "https://www.converse.com", thumbnail: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=150" },
                { rank: 5, title: "Nike Air Force 1", url: "https://www.nike.com", thumbnail: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=150" },
                { rank: 6, title: "Vans Old Skool", url: "https://www.vans.com", thumbnail: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=150" },
                { rank: 7, title: "adidas Superstar", url: "https://www.adidas.com", thumbnail: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=150" },
                { rank: 8, title: "Air Jordan 1 Retro", url: "https://www.nike.com", thumbnail: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=150" },
                { rank: 9, title: "Asics Gel-Kayano", url: "https://www.asics.com", thumbnail: "https://images.unsplash.com/photo-1626448011293-fd427917651a?w=150" },
                { rank: 10, title: "Reebok Club C 85", url: "https://www.reebok.com", thumbnail: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=150" }
            ]
        },
        {
            id: "cat_athletes",
            name: "Inspiring Athletes",
            icon: "🏃‍♂️",
            description: "Athletes whose stories and historic performances inspire.",
            items: [
                { rank: 1, title: "Michael Jordan", url: "https://www.nba.com", thumbnail: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=150" },
                { rank: 2, title: "Muhammad Ali", url: "https://www.boxing.com", thumbnail: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=150" },
                { rank: 3, title: "Serena Williams", url: "https://www.wtatennis.com", thumbnail: "https://images.unsplash.com/photo-1622279457486-62dce4a44526?w=150" },
                { rank: 4, title: "Usain Bolt", url: "https://www.olympics.com", thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150" },
                { rank: 5, title: "Lionel Messi", url: "https://www.fifa.com", thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150" },
                { rank: 6, title: "Kobe Bryant", url: "https://www.nba.com", thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150" },
                { rank: 7, title: "Simone Biles", url: "https://www.usagym.org", thumbnail: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=150" },
                { rank: 8, title: "Roger Federer", url: "https://www.atptour.com", thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=150" },
                { rank: 9, title: "Tiger Woods", url: "https://www.pgatour.com", thumbnail: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=150" },
                { rank: 10, title: "Tom Brady", url: "https://www.nfl.com", thumbnail: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=150" }
            ]
        },
        {
            id: "cat_tech",
            name: "Tech Devices",
            icon: "💻",
            description: "Hardware gear shaping consumer productivity systems.",
            items: [
                { rank: 1, title: "iPhone 15 Pro Max", url: "https://www.apple.com", thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150" },
                { rank: 2, title: "MacBook Pro M3", url: "https://www.apple.com", thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150" },
                { rank: 3, title: "iPad Pro OLED", url: "https://www.apple.com", thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150" },
                { rank: 4, title: "Sony WH-1000XM5", url: "https://www.sony.com", thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150" },
                { rank: 5, title: "Samsung Galaxy S24 Ultra", url: "https://www.samsung.com", thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150" },
                { rank: 6, title: "ASUS ROG Ally X", url: "https://www.asus.com", thumbnail: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=150" },
                { rank: 7, title: "Dell XPS 13", url: "https://www.dell.com", thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=150" },
                { rank: 8, title: "Meta Quest 3", url: "https://www.meta.com", thumbnail: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=150" },
                { rank: 9, title: "Keychron Q1 Max", url: "https://www.keychron.com", thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150" },
                { rank: 10, title: "Anker Prime PowerBank", url: "https://www.anker.com", thumbnail: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=150" }
            ]
        },
        {
            id: "cat_celebrities",
            name: "Celebrities",
            icon: "🎬",
            description: "High-impact cultural and global personalities.",
            items: [
                { rank: 1, title: "Keanu Reeves", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
                { rank: 2, title: "Dwayne Johnson", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
                { rank: 3, title: "Tom Cruise", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150" },
                { rank: 4, title: "Taylor Swift", url: "https://www.taylorswift.com", thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" },
                { rank: 5, title: "Leonardo DiCaprio", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150" },
                { rank: 6, title: "Scarlett Johansson", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
                { rank: 7, title: "Robert Downey Jr.", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150" },
                { rank: 8, title: "Rihanna", url: "https://www.rihanna.com", thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
                { rank: 9, title: "Brad Pitt", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150" },
                { rank: 10, title: "Zendaya", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150" }
            ]
        },
        {
            id: "cat_movies",
            name: "Post 2000 Movies",
            icon: "🎥",
            description: "Modern cinematic masterpieces released after Y2K.",
            items: [
                { rank: 1, title: "Inception (2010)", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=150" },
                { rank: 2, title: "The Dark Knight (2008)", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=150" },
                { rank: 3, title: "Interstellar (2014)", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150" },
                { rank: 4, title: "Mad Max: Fury Road", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150" },
                { rank: 5, title: "Gladiator (2000)", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=150" },
                { rank: 6, title: "Parasite (2019)", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=150" },
                { rank: 7, title: "Whiplash (2014)", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150" },
                { rank: 8, title: "The Lord of the Rings", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=150" },
                { rank: 9, title: "No Country for Old Men", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=150" },
                { rank: 10, title: "Everything Everywhere All at Once", url: "https://www.imdb.com", thumbnail: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=150" }
            ]
        },
        {
            id: "cat_rap",
            name: "90s Rap Songs",
            icon: "📻",
            description: "Defining historical tracks from the golden era of hip-hop.",
            items: [
                { rank: 1, title: "Juicy - Notorious B.I.G.", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1484755560693-a4074577af3a?w=150" },
                { rank: 2, title: "California Love - 2Pac", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150" },
                { rank: 3, title: "C.R.E.A.M. - Wu-Tang Clan", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150" },
                { rank: 4, title: "Nuthin' But A G Thang - Dr. Dre", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150" },
                { rank: 5, title: "Shook Ones Pt. II - Mobb Deep", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150" },
                { rank: 6, title: "The World Is Yours - Nas", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150" },
                { rank: 7, title: "Hypnotize - Notorious B.I.G.", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150" },
                { rank: 8, title: "Dear Mama - 2Pac", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=150" },
                { rank: 9, title: "Regulate - Warren G", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=150" },
                { rank: 10, title: "Mind Playing Tricks on Me", url: "https://www.spotify.com", thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150" }
            ]
        },
        {
            id: "cat_videogames",
            name: "Post 2010 Video Games",
            icon: "🎮",
            description: "High-tier experiential software environments.",
            items: [
                { rank: 1, title: "Elden Ring (2022)", url: "https://www.bandainamcoent.com", thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150" },
                { rank: 2, title: "The Witcher 3 (2015)", url: "https://www.cdprojektred.com", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150" },
                { rank: 3, title: "Red Dead Redemption 2", url: "https://www.rockstargames.com", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150" },
                { rank: 4, title: "Zelda: Breath of the Wild", url: "https://www.nintendo.com", thumbnail: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=150" },
                { rank: 5, title: "GTA V (2013)", url: "https://www.rockstargames.com", thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=150" },
                { rank: 6, title: "The Last of Us Part II", url: "https://www.naughtydog.com", thumbnail: "https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=150" },
                { rank: 7, title: "God of War Ragnarok", url: "https://www.playstation.com", thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150" },
                { rank: 8, title: "Cyberpunk 2077 (2020)", url: "https://www.cyberpunk.net", thumbnail: "https://images.unsplash.com/photo-1542751130-121f10c533c8?w=150" },
                { rank: 9, title: "Minecraft (Modern Era)", url: "https://www.minecraft.net", thumbnail: "https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?w=150" },
                { rank: 10, title: "Baldur's Gate 3 (2023)", url: "https://www.larian.com", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150" }
            ]
        },
        {
            id: "cat_novels",
            name: "Novels",
            icon: "📚",
            description: "Immersive literary works and defining fiction writing.",
            items: [
                { rank: 1, title: "The Great Gatsby", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150" },
                { rank: 2, title: "1804", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150" },
                { rank: 3, title: "To Kill a Mockingbird", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150" },
                { rank: 4, title: "Crime and Punishment", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=150" },
                { rank: 5, title: "One Hundred Years of Solitude", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150" },
                { rank: 6, title: "The Catcher in the Rye", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=150" },
                { rank: 7, title: "Brave New World", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=150" },
                { rank: 8, title: "The Hobbit", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=150" },
                { rank: 9, title: "Ulysses", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=150" },
                { rank: 10, title: "The Odyssey", url: "https://www.goodreads.com", thumbnail: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=150" }
            ]
        },
        {
            id: "cat_restaurants",
            name: "Restaurants",
            icon: "🍔",
            description: "World-class dining highlights and culinary institutions.",
            items: [
                { rank: 1, title: "Central (Lima)", url: "https://centralrestaurante.com.pe", thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150" },
                { rank: 2, title: "Disfrutar (Barcelona)", url: "https://www.disfrutarbarcelona.com", thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=150" },
                { rank: 3, title: "Asador Etxebarri (Achondo)", url: "https://asadoretxebarri.com", thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150" },
                { rank: 4, title: "Alchemist (Copenhagen)", url: "https://alchemist.dk", thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?w=150" },
                { rank: 5, title: "Maido (Lima)", url: "https://www.maido.pe", thumbnail: "https://images.unsplash.com/photo-1592861956120-e524c7404709?w=150" },
                { rank: 6, title: "Atomix (New York)", url: "https://www.atomixnyc.com", thumbnail: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=150" },
                { rank: 7, title: "Quintonil (Mexico City)", url: "https://quintonil.com", thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150" },
                { rank: 8, title: "Lido 84 (Gardone Riviera)", url: "https://www.ristorantelido84.com", thumbnail: "https://images.unsplash.com/photo-1424847651672-bf2c98a30026?w=150" },
                { rank: 9, title: "Gaggan Anand (Bangkok)", url: "https://gaggananand.com", thumbnail: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=150" },
                { rank: 10, title: "Le Bernardin (New York)", url: "https://www.le-bernardin.com", thumbnail: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=150" }
            ]
        }
    ];
}