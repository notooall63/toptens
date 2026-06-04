// frontend/stockitems.js

/**
 * Top Tens - Production Grade Stock Asset Matrix
 * Implements 9 core categories with 10 robust entries per tier.
 */

function getFreshStockCategories() {
    return [
        {
            id: "cat_shoes",
            name: "Shoes",
            icon: "👟",
            description: "Iconic sneakers and defining footwear iterations.",
            items: [
                { rank: 1, title: "Nike Air Max 1", url: "https://www.amazon.com/s?k=Nike+Air+Max+1", thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150" },
                { rank: 2, title: "adidas Ultraboost", url: "https://www.amazon.com/s?k=adidas+Ultraboost", thumbnail: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=150" },
                { rank: 3, title: "New Balance 990v6", url: "https://www.amazon.com/s?k=New+Balance+990v6", thumbnail: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=150" },
                { rank: 4, title: "Converse Chuck Taylor", url: "https://www.amazon.com/s?k=Converse+Chuck+Taylor", thumbnail: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150" },
                { rank: 5, title: "Air Jordan 1 Retro", url: "https://www.amazon.com/s?k=Air+Jordan+1+Retro", thumbnail: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=150" },
                { rank: 6, title: "Puma Suede Classic", url: "https://www.amazon.com/s?k=Puma+Suede+Classic", thumbnail: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=150" },
                { rank: 7, title: "Vans Old Skool Core", url: "https://www.amazon.com/s?k=Vans+Old+Skool", thumbnail: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=150" },
                { rank: 8, title: "Asics Gel-Kayano 30", url: "https://www.amazon.com/s?k=Asics+Gel-Kayano+30", thumbnail: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=150" },
                { rank: 9, title: "Reebok Club C 85", url: "https://www.amazon.com/s?k=Reebok+Club+C+85", thumbnail: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=150" },
                { rank: 10, title: "Salomon XT-6 Advanced", url: "https://www.amazon.com/s?k=Salomon+XT-6", thumbnail: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150" }
            ]
        },
        {
            id: "cat_athletes",
            name: "Inspiring Athletes",
            icon: "🏆",
            description: "Pinnacle athletic titans changing world metrics.",
            items: [
                { rank: 1, title: "Muhammad Ali", url: "https://www.amazon.com/s?k=Muhammad+Ali+Biography", thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=150" },
                { rank: 2, title: "Michael Jordan", url: "https://www.amazon.com/s?k=Michael+Jordan+Gear", thumbnail: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=150" },
                { rank: 3, title: "Serena Williams", url: "https://www.amazon.com/s?k=Serena+Williams+Racket", thumbnail: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150" },
                { rank: 4, title: "LeBron James", url: "https://www.amazon.com/s?k=LeBron+James+Shoes", thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150" },
                { rank: 5, title: "Lionel Messi", url: "https://www.amazon.com/s?k=Lionel+Messi+Jersey", thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150" },
                { rank: 6, title: "Usain Bolt", url: "https://www.amazon.com/s?k=Usain+Bolt+Puma", thumbnail: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=150" },
                { rank: 7, title: "Simone Biles", url: "https://www.amazon.com/s?k=Simone+Biles+Leotard", thumbnail: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=150" },
                { rank: 8, title: "Tom Brady", url: "https://www.amazon.com/s?k=Tom+Brady+Memorabilia", thumbnail: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=150" },
                { rank: 9, title: "Kobe Bryant", url: "https://www.amazon.com/s?k=Kobe+Bryant+Mamba", thumbnail: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=150" },
                { rank: 10, title: "Tiger Woods", url: "https://www.amazon.com/s?k=Tiger+Woods+Golf", thumbnail: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=150" }
            ]
        },
        {
            id: "cat_tech",
            name: "Tech Devices",
            icon: "💻",
            description: "Cutting edge standard computing instruments.",
            items: [
                { rank: 1, title: "iPhone 15 Pro", url: "https://www.amazon.com/s?k=iPhone+15+Pro", thumbnail: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=150" },
                { rank: 2, title: "MacBook Pro M3", url: "https://www.amazon.com/s?k=MacBook+Pro+M3", thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150" },
                { rank: 3, title: "iPad Pro OLED", url: "https://www.amazon.com/s?k=iPad+Pro+OLED", thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150" },
                { rank: 4, title: "Apple Watch Ultra 2", url: "https://www.amazon.com/s?k=Apple+Watch+Ultra+2", thumbnail: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=150" },
                { rank: 5, title: "Sony WH-1000XM5", url: "https://www.amazon.com/s?k=Sony+WH-1000XM5", thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150" },
                { rank: 6, title: "Nintendo Switch OLED", url: "https://www.amazon.com/s?k=Nintendo+Switch+OLED", thumbnail: "https://images.unsplash.com/photo-1561542320-9a18cd340469?w=150" },
                { rank: 7, title: "ASUS ROG Ally X", url: "https://www.amazon.com/s?k=ASUS+ROG+Ally+X", thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150" },
                { rank: 8, title: "Samsung Galaxy S24 Ultra", url: "https://www.amazon.com/s?k=Samsung+Galaxy+S24+Ultra", thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150" },
                { rank: 9, title: "Meta Quest 3", url: "https://www.amazon.com/s?k=Meta+Quest+3", thumbnail: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=150" },
                { rank: 10, title: "DJI Mini 4 Pro", url: "https://www.amazon.com/s?k=DJI+Mini+4+Pro", thumbnail: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=150" }
            ]
        },
        {
            id: "cat_celebrities",
            name: "Celebrities",
            icon: "🎬",
            description: "High impact cultural icons and personalities.",
            items: [
                { rank: 1, title: "Keanu Reeves", url: "https://www.amazon.com/s?k=Keanu+Reeves+Movies", thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
                { rank: 2, title: "Tom Cruise", url: "https://www.amazon.com/s?k=Tom+Cruise+Movies", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
                { rank: 3, title: "Denzel Washington", url: "https://www.amazon.com/s?k=Denzel+Washington+Movies", thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
                { rank: 4, title: "Leonardo DiCaprio", url: "https://www.amazon.com/s?k=Leonardo+DiCaprio+Movies", thumbnail: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" },
                { rank: 5, title: "Scarlett Johansson", url: "https://www.amazon.com/s?k=Scarlett+Johansson+Movies", thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
                { rank: 6, title: "Pedro Pascal", url: "https://www.amazon.com/s?k=Pedro+Pascal", thumbnail: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150" },
                { rank: 7, title: "Margot Robbie", url: "https://www.amazon.com/s?k=Margot+Robbie+Movies", thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150" },
                { rank: 8, title: "Cillian Murphy", url: "https://www.amazon.com/s?k=Cillian+Murphy", thumbnail: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150" },
                { rank: 9, title: "Robert Downey Jr.", url: "https://www.amazon.com/s?k=Robert+Downey+Jr", thumbnail: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150" },
                { rank: 10, title: "Brad Pitt", url: "https://www.amazon.com/s?k=Brad+Pitt+Movies", thumbnail: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150" }
            ]
        },
        {
            id: "cat_movies",
            name: "Post 2000 Movies",
            icon: "🎥",
            description: "Modern cinematic masterpieces.",
            items: [
                { rank: 1, title: "Inception", url: "https://www.amazon.com/s?k=Inception+BluRay", thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=150" },
                { rank: 2, title: "The Dark Knight", url: "https://www.amazon.com/s?k=The+Dark+Knight", thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=150" },
                { rank: 3, title: "Interstellar", url: "https://www.amazon.com/s?k=Interstellar", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150" },
                { rank: 4, title: "Mad Max: Fury Road", url: "https://www.amazon.com/s?k=Mad+Max+Fury+Road", thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150" },
                { rank: 5, title: "Parasite", url: "https://www.amazon.com/s?k=Parasite+Movie", thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=150" },
                { rank: 6, title: "Whiplash", url: "https://www.amazon.com/s?k=Whiplash", thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150" },
                { rank: 7, title: "Everything Everywhere All At Once", url: "https://www.amazon.com/s?k=Everything+Everywhere+All+At+Once", thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150" },
                { rank: 8, title: "No Country for Old Men", url: "https://www.amazon.com/s?k=No+Country+for+Old+Men", thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=150" },
                { rank: 9, title: "Gladiator", url: "https://www.amazon.com/s?k=Gladiator+Movie", thumbnail: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=150" },
                { rank: 10, title: "The Lord of the Rings", url: "https://www.amazon.com/s?k=Lord+of+the+Rings", thumbnail: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=150" }
            ]
        },
        {
            id: "cat_rap",
            name: "90s Rap Songs",
            icon: "📻",
            description: "Golden Era definitive musical standards.",
            items: [
                { rank: 1, title: "Juicy - Notorious B.I.G.", url: "https://www.amazon.com/s?k=Notorious+BIG+Juicy", thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150" },
                { rank: 2, title: "C.R.E.A.M. - Wu-Tang Clan", url: "https://www.amazon.com/s?k=Wu-Tang+Clan+Cream", thumbnail: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150" },
                { rank: 3, title: "California Love - 2Pac", url: "https://www.amazon.com/s?k=2Pac+California+Love", thumbnail: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=150" },
                { rank: 4, title: "Nuthin' But A G Thang - Dr. Dre", url: "https://www.amazon.com/s?k=Dr+Dre+Nuthin+But+A+G+Thang", thumbnail: "https://images.unsplash.com/photo-1484755560695-a4c747751e11?w=150" },
                { rank: 5, title: "Shook Ones Pt. II - Mobb Deep", url: "https://www.amazon.com/s?k=Mobb+Deep+Shook+Ones", thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150" },
                { rank: 6, title: "N.Y. State of Mind - Nas", url: "https://www.amazon.com/s?k=Nas+Illmatic", thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150" },
                { rank: 7, title: "Mind Playing Tricks on Me - Geto Boys", url: "https://www.amazon.com/s?k=Geto+Boys", thumbnail: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150" },
                { rank: 8, title: "Regulate - Warren G", url: "https://www.amazon.com/s?k=Warren+G+Regulate", thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150" },
                { rank: 9, title: "Rosa Parks - OutKast", url: "https://www.amazon.com/s?k=OutKast+Rosa+Parks", thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=150" },
                { rank: 10, title: "Scenario - A Tribe Called Quest", url: "https://www.amazon.com/s?k=Tribe+Called+Quest", thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150" }
            ]
        },
        {
            id: "cat_games",
            name: "Post 2010 Video Games",
            icon: "🎮",
            description: "Pinnacle interactive digital software titles.",
            items: [
                { rank: 1, title: "The Witcher 3: Wild Hunt", url: "https://www.amazon.com/s?k=Witcher+3+Wild+Hunt", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150" },
                { rank: 2, title: "Elden Ring", url: "https://www.amazon.com/s?k=Elden+Ring", thumbnail: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150" },
                { rank: 3, title: "The Legend of Zelda: Breath of the Wild", url: "https://www.amazon.com/s?k=Zelda+Breath+of+the+Wild", thumbnail: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=150" },
                { rank: 4, title: "Red Dead Redemption 2", url: "https://www.amazon.com/s?k=Red+Dead+Redemption+2", thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=150" },
                { rank: 5, title: "GTA V (Next Gen)", url: "https://www.amazon.com/s?k=GTA+V", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150" },
                { rank: 6, title: "The Last of Us Part II", url: "https://www.amazon.com/s?k=The+Last+of+Us+Part+II", thumbnail: "https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=150" },
                { rank: 7, title: "God of War Ragnarok", url: "https://www.amazon.com/s?k=God+of+War+Ragnarok", thumbnail: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=150" },
                { rank: 8, title: "Cyberpunk 2077 Ultimate", url: "https://www.amazon.com/s?k=Cyberpunk+2077", thumbnail: "https://images.unsplash.com/photo-1542751172-e1796a090173?w=150" },
                { rank: 9, title: "Minecraft OLED Update", url: "https://www.amazon.com/s?k=Minecraft", thumbnail: "https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?w=150" },
                { rank: 10, title: "Baldur's Gate 3", url: "https://www.amazon.com/s?k=Baldurs+Gate+3", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150" }
            ]
        },
        {
            id: "cat_novels",
            name: "Novels",
            icon: "📚",
            description: "Master literary written manuscripts.",
            items: [
                { rank: 1, title: "The Great Gatsby", url: "https://www.amazon.com/s?k=The+Great+Gatsby", thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150" },
                { rank: 2, title: "1884 (Orwell Standard)", url: "https://www.amazon.com/s?k=1984+George+Orwell", thumbnail: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150" },
                { rank: 3, title: "To Kill a Mockingbird", url: "https://www.amazon.com/s?k=To+Kill+a+Mockingbird", thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150" },
                { rank: 4, title: "One Hundred Years of Solitude", url: "https://www.amazon.com/s?k=One+Hundred+Years+of+Solitude", thumbnail: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=150" },
                { rank: 5, title: "Ulysses (James Joyce)", url: "https://www.amazon.com/s?k=Ulysses+James+Joyce", thumbnail: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=150" },
                { rank: 6, title: "The Catcher in the Rye", url: "https://www.amazon.com/s?k=Catcher+in+the+Rye", thumbnail: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=150" },
                { rank: 7, title: "Dune Chronicle Matrix", url: "https://www.amazon.com/s?k=Dune+Frank+Herbert", thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=150" },
                { rank: 8, title: "Brave New World", url: "https://www.amazon.com/s?k=Brave+New+World", thumbnail: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=150" },
                { rank: 9, title: "The Road (McCarthy)", url: "https://www.amazon.com/s?k=The+Road+Cormac+McCarthy", thumbnail: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=150" },
                { rank: 10, title: "Crime and Punishment", url: "https://www.amazon.com/s?k=Crime+and+Punishment", thumbnail: "https://images.unsplash.com/photo-1576872381149-78ef78736768?w=150" }
            ]
        },
        {
            id: "cat_restaurants",
            name: "Restaurants",
            icon: "🍽️",
            description: "Elite culinary spaces of global destination.",
            items: [
                { rank: 1, title: "Central (Lima)", url: "https://www.amazon.com/s?k=Central+Lima+Culinary", thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150" },
                { rank: 2, title: "Disfrutar (Barcelona)", url: "https://www.amazon.com/s?k=Disfrutar+Barcelona", thumbnail: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=150" },
                { rank: 3, title: "Asador Etxebarri", url: "https://www.amazon.com/s?k=Asador+Etxebarri", thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150" },
                { rank: 4, title: "Alchemist (Copenhagen)", url: "https://www.amazon.com/s?k=Alchemist+Copenhagen", thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?w=150" },
                { rank: 5, title: "Maido (Lima Culinary)", url: "https://www.amazon.com/s?k=Maido+Lima", thumbnail: "https://images.unsplash.com/photo-1592861956120-e524c7404709?w=150" },
                { rank: 6, title: "Atomix (New York City)", url: "https://www.amazon.com/s?k=Atomix+New+York", thumbnail: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=150" },
                { rank: 7, title: "Quintonil (Mexico City)", url: "https://www.amazon.com/s?k=Quintonil", thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=150" },
                { rank: 8, title: "Table by Bruno Verjus", url: "https://www.amazon.com/s?k=Bruno+Verjus+Paris", thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150" },
                { rank: 9, title: "Gaggan Anand (Bangkok)", url: "https://www.amazon.com/s?k=Gaggan+Anand", thumbnail: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=150" },
                { rank: 10, title: "Le Calandre (Rubano)", url: "https://www.amazon.com/s?k=Le+Calandre", thumbnail: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=150" }
            ]
        }
    ];
}