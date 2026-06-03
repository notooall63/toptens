// Complete core stock data module containing 9 distinct categories with 10 detailed media items each
const stockItems = {
    "Shoes": [
        { rank: 1, name: "Nike Air Jordan 1 Retro High", link: "https://amazon.com/s?k=Nike+Air+Jordan+1", thumb: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=150" },
        { rank: 2, name: "Adidas Ultraboost Light", link: "https://amazon.com/s?k=Adidas+Ultraboost", thumb: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=150" },
        { rank: 3, name: "New Balance 990v6", link: "https://amazon.com/s?k=New+Balance+990", thumb: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=150" },
        { rank: 4, name: "Balenciaga Triple S", link: "https://amazon.com/s?k=Balenciaga+Triple+S", thumb: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=150" },
        { rank: 5, name: "Converse Chuck Taylor All Star", link: "https://amazon.com/s?k=Converse+Chuck+Taylor", thumb: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=150" },
        { rank: 6, name: "Puma Suede Classic", link: "https://amazon.com/s?k=Puma+Suede", thumb: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=150" },
        { rank: 7, name: "Asics Gel-Kayano 30", link: "https://amazon.com/s?k=Asics+Gel+Kayano", thumb: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=150" },
        { rank: 8, name: "Vans Old Skool Core", link: "https://amazon.com/s?k=Vans+Old+Skool", thumb: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=150" },
        { rank: 9, name: "Salomon XT-6 Advanced", link: "https://amazon.com/s?k=Salomon+XT6", thumb: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=150" },
        { rank: 10, name: "Crocs Classic Clog", link: "https://amazon.com/s?k=Crocs+Classic+Clog", thumb: "https://images.unsplash.com/photo-1620794341491-7fb528a856f7?w=150" }
    ],
    "Inspiring Athletes": [
        { rank: 1, name: "Muhammad Ali", link: "https://wikipedia.org/wiki/Muhammad_Ali", thumb: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=150" },
        { rank: 2, name: "Michael Jordan", link: "https://wikipedia.org/wiki/Michael_Jordan", thumb: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150" },
        { rank: 3, name: "Serena Williams", link: "https://wikipedia.org/wiki/Serena_Williams", thumb: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=150" },
        { rank: 4, name: "Usain Bolt", link: "https://wikipedia.org/wiki/Usain_Bolt", thumb: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150" },
        { rank: 5, name: "Lionel Messi", link: "https://wikipedia.org/wiki/Lionel_Messi", thumb: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150" },
        { rank: 6, name: "Kobe Bryant", link: "https://wikipedia.org/wiki/Kobe_Bryant", thumb: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=150" },
        { rank: 7, name: "Simone Biles", link: "https://wikipedia.org/wiki/Simone_Biles", thumb: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=150" },
        { rank: 8, name: "Tiger Woods", link: "https://wikipedia.org/wiki/Tiger_Woods", thumb: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=150" },
        { rank: 9, name: "Tom Brady", link: "https://wikipedia.org/wiki/Tom_Brady", thumb: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=150" },
        { rank: 10, name: "Ayrton Senna", link: "https://wikipedia.org/wiki/Ayrton_Senna", thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=150" }
    ],
    "Tech Devices": [
        { rank: 1, name: "Apple iPhone 15 Pro", link: "https://amazon.com/s?k=iPhone+15+Pro", thumb: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=150" },
        { rank: 2, name: "Apple MacBook Pro M3", link: "https://amazon.com/s?k=MacBook+Pro+M3", thumb: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150" },
        { rank: 3, name: "Sony WH-1000XM5", link: "https://amazon.com/s?k=Sony+WH1000XM5", thumb: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150" },
        { rank: 4, name: "Samsung Galaxy S24 Ultra", link: "https://amazon.com/s?k=Galaxy+S24+Ultra", thumb: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150" },
        { rank: 5, name: "Apple iPad Pro M2", link: "https://amazon.com/s?k=iPad+Pro+M2", thumb: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150" },
        { rank: 6, name: "DJI Mini 4 Pro", link: "https://amazon.com/s?k=DJI+Mini+4+Pro", thumb: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=150" },
        { rank: 7, name: "Nintendo Switch OLED", link: "https://amazon.com/s?k=Nintendo+Switch+OLED", thumb: "https://images.unsplash.com/photo-1562184552-997c461abbe6?w=150" },
        { rank: 8, name: "Sony PlayStation 5 Slim", link: "https://amazon.com/s?k=PlayStation+5", thumb: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=150" },
        { rank: 9, name: "Meta Quest 3", link: "https://amazon.com/s?k=Meta+Quest+3", thumb: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=150" },
        { rank: 10, name: "Apple Watch Ultra 2", link: "https://amazon.com/s?k=Apple+Watch+Ultra+2", thumb: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=150" }
    ],
    "Celebrities": [
        { rank: 1, name: "Keanu Reeves", link: "https://imdb.com/name/nm0000206", thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
        { rank: 2, name: "Tom Hanks", link: "https://imdb.com/name/nm0000158", thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
        { rank: 3, name: "Denzel Washington", link: "https://imdb.com/name/nm0000243", thumb: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
        { rank: 4, name: "Leonardo DiCaprio", link: "https://imdb.com/name/nm0000138", thumb: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" },
        { rank: 5, name: "Scarlett Johansson", link: "https://imdb.com/name/nm0424060", thumb: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
        { rank: 6, name: "Robert Downey Jr.", link: "https://imdb.com/name/nm0000375", thumb: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150" },
        { rank: 7, name: "Pedro Pascal", link: "https://imdb.com/name/nm0050961", thumb: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150" },
        { rank: 8, name: "Margot Robbie", link: "https://imdb.com/name/nm3053338", thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150" },
        { rank: 9, name: "Cillian Murphy", link: "https://imdb.com/name/nm0614165", thumb: "https://images.unsplash.com/photo-1504257406765-1a1117946c4d?w=150" },
        { rank: 10, name: "Zendaya", link: "https://imdb.com/name/nm3915859", thumb: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }
    ],
    "Post 2000 Movies": [
        { rank: 1, name: "The Dark Knight (2008)", link: "https://imdb.com/title/tt0468569", thumb: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=150" },
        { rank: 2, name: "Inception (2010)", link: "https://imdb.com/title/tt1375666", thumb: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=150" },
        { rank: 3, name: "Interstellar (2014)", link: "https://imdb.com/title/tt0816692", thumb: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150" },
        { rank: 4, name: "Mad Max: Fury Road (2015)", link: "https://imdb.com/title/tt1392190", thumb: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150" },
        { rank: 5, name: "Spirited Away (2001)", link: "https://imdb.com/title/tt0245429", thumb: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150" },
        { rank: 6, name: "Parasite (2019)", link: "https://imdb.com/title/tt6751668", thumb: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=150" },
        { rank: 7, name: "Everything Everywhere All at Once", link: "https://imdb.com/title/tt6710474", thumb: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=150" },
        { rank: 8, name: "Whiplash (2014)", link: "https://imdb.com/title/tt2582802", thumb: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150" },
        { rank: 9, name: "No Country for Old Men (2007)", link: "https://imdb.com/title/tt0386659", thumb: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=150" },
        { rank: 10, name: "Spider-Man: Into the Spider-Verse", link: "https://imdb.com/title/tt4633694", thumb: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=150" }
    ],
    "90s Rap Songs": [
        { rank: 1, name: "Juicy - Notorious B.I.G.", link: "https://youtube.com/results?search_query=Juicy+Notorious+BIG", thumb: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=150" },
        { rank: 2, name: "California Love - 2Pac", link: "https://youtube.com/results?search_query=California+Love+2Pac", thumb: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150" },
        { rank: 3, name: "N.Y. State of Mind - Nas", link: "https://youtube.com/results?search_query=NY+State+of+Mind+Nas", thumb: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=150" },
        { rank: 4, name: "C.R.E.A.M. - Wu-Tang Clan", link: "https://youtube.com/results?search_query=CREAM+Wu+Tang+Clan", thumb: "https://images.unsplash.com/photo-1553775282-20af80779df7?w=150" },
        { rank: 5, name: "Nutthin' But A G Thang - Dr. Dre", link: "https://youtube.com/results?search_query=Nutthin+But+A+G+Thang", thumb: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=150" },
        { rank: 6, name: "Shook Ones Pt. II - Mobb Deep", link: "https://youtube.com/results?search_query=Shook+Ones+Pt+II", thumb: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150" },
        { rank: 7, name: "Mind Playing Tricks on Me - Geto Boys", link: "https://youtube.com/results?search_query=Mind+Playing+Tricks+on+Me", thumb: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150" },
        { rank: 8, name: "Rosa Parks - Outkast", link: "https://youtube.com/results?search_query=Rosa+Parks+Outkast", thumb: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150" },
        { rank: 9, name: "Regulate - Warren G", link: "https://youtube.com/results?search_query=Regulate+Warren+G", thumb: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150" },
        { rank: 10, name: "Scenario - A Tribe Called Quest", link: "https://youtube.com/results?search_query=Scenario+A+Tribe+Called+Quest", thumb: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150" }
    ],
    "Post 2010 Video Games": [
        { rank: 1, name: "Elden Ring", link: "https://amazon.com/s?k=Elden+Ring", thumb: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150" },
        { rank: 2, name: "The Legend of Zelda: Breath of the Wild", link: "https://amazon.com/s?k=Breath+of+the+Wild", thumb: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=150" },
        { rank: 3, name: "The Witcher 3: Wild Hunt", link: "https://amazon.com/s?k=Witcher+3", thumb: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150" },
        { rank: 4, name: "Red Dead Redemption 2", link: "https://amazon.com/s?k=Red+Dead+Redemption+2", thumb: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150" },
        { rank: 5, name: "Grand Theft Auto V", link: "https://amazon.com/s?k=Grand+Theft+Auto+V", thumb: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=150" },
        { rank: 6, name: "God of War (2018)", link: "https://amazon.com/s?k=God+of+War", thumb: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150" },
        { rank: 7, name: "The Last of Us Part II", link: "https://amazon.com/s?k=The+Last+of+Us+Part+2", thumb: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=150" },
        { rank: 8, name: "Cyberpunk 2077", link: "https://amazon.com/s?k=Cyberpunk+2077", thumb: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=150" },
        { rank: 9, name: "Minecraft (Global Release)", link: "https://amazon.com/s?k=Minecraft", thumb: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=150" },
        { rank: 10, name: "Baldur's Gate 3", link: "https://amazon.com/s?k=Baldurs+Gate+3", thumb: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=150" }
    ],
    "Novels": [
        { rank: 1, name: "The Great Gatsby", link: "https://amazon.com/s?k=The+Great+Gatsby", thumb: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150" },
        { rank: 2, name: "184", link: "https://amazon.com/s?k=1984+Novel", thumb: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=150" },
        { rank: 3, name: "To Kill a Mockingbird", link: "https://amazon.com/s?k=To+Kill+a+Mockingbird", thumb: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=150" },
        { rank: 4, name: "The Lord of the Rings", link: "https://amazon.com/s?k=The+Lord+of+the+Rings", thumb: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=150" },
        { rank: 5, name: "One Hundred Years of Solitude", link: "https://amazon.com/s?k=One+Hundred+Years+of+Solitude", thumb: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150" },
        { rank: 6, name: "The Catcher in the Rye", link: "https://amazon.com/s?k=The+Catcher+in+the+Rye", thumb: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150" },
        { rank: 7, name: "Brave New World", link: "https://amazon.com/s?k=Brave+New+World", thumb: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=150" },
        { rank: 8, name: "Crime and Punishment", link: "https://amazon.com/s?k=Crime+and+Punishment", thumb: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150" },
        { rank: 9, name: "Dune", link: "https://amazon.com/s?k=Dune+Novel", thumb: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=150" },
        { rank: 10, name: "Frankenstein", link: "https://amazon.com/s?k=Frankenstein+Book", thumb: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=150" }
    ],
    "Restaurants": [
        { rank: 1, name: "Central (Lima, Peru)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150" },
        { rank: 2, name: "Disfrutar (Barcelona, Spain)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150" },
        { rank: 3, name: "DiverXO (Madrid, Spain)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=150" },
        { rank: 4, name: "Asador Etxebarri (Atxondo, Spain)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1544025162-d76694265947?w=150" },
        { rank: 5, name: "Alchemist (Copenhagen, Denmark)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=150" },
        { rank: 6, name: "Maido (Lima, Peru)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=150" },
        { rank: 7, name: "Lido 84 (Gardone Riviera, Italy)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=150" },
        { rank: 8, name: "Atomix (New York, USA)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=150" },
        { rank: 9, name: "Quintonil (Mexico City, Mexico)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1502301103665-0b95cc738daf?w=150" },
        { rank: 10, name: "Table by Bruno Verjus (Paris, France)", link: "https://theworlds50best.com", thumb: "https://images.unsplash.com/photo-1424847651672-bf2c9e938cf2?w=150" }
    ]
};