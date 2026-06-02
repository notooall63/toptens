// stockItems.js

const STOCK_CATEGORIES = [
  {
    id: "shoes",
    name: "Shoes",
    description: "Iconic sneakers and footwear.",
    items: [
      {
        rank: 1,
        title: "Nike Air Max 1",
        url: "https://www.nike.com/air-max-1",
        thumbnail: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg"
      },
      {
        rank: 2,
        title: "adidas Ultraboost",
        url: "https://www.adidas.com/ultraboost",
        thumbnail: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg"
      },
      {
        rank: 3,
        title: "New Balance 990v6",
        url: "https://www.newbalance.com/990v6",
        thumbnail: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg"
      },
      {
        rank: 4,
        title: "Converse Chuck Taylor All Star",
        url: "https://www.converse.com/chuck-taylor-all-star",
        thumbnail: "https://images.pexels.com/photos/2529149/pexels-photo-2529149.jpeg"
      },
      {
        rank: 5,
        title: "Nike Air Force 1",
        url: "https://www.nike.com/air-force-1",
        thumbnail: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg"
      },
      {
        rank: 6,
        title: "Vans Old Skool",
        url: "https://www.vans.com/old-skool",
        thumbnail: "https://images.pexels.com/photos/2529150/pexels-photo-2529150.jpeg"
      },
      {
        rank: 7,
        title: "adidas Superstar",
        url: "https://www.adidas.com/superstar",
        thumbnail: "https://images.pexels.com/photos/2529151/pexels-photo-2529151.jpeg"
      },
      {
        rank: 8,
        title: "Jordan 1 Retro High",
        url: "https://www.nike.com/jordan-1",
        thumbnail: "https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg"
      },
      {
        rank: 9,
        title: "Asics Gel-Kayano",
        url: "https://www.asics.com/gel-kayano",
        thumbnail: "https://images.pexels.com/photos/2529152/pexels-photo-2529152.jpeg"
      },
      {
        rank: 10,
        title: "Reebok Club C 85",
        url: "https://www.reebok.com/club-c-85",
        thumbnail: "https://images.pexels.com/photos/2529153/pexels-photo-2529153.jpeg"
      }
    ]
  },
  {
    id: "inspiring-athletes",
    name: "Inspiring Athletes",
    description: "Athletes whose stories and performances inspire.",
    items: [
      {
        rank: 1,
        title: "Michael Jordan",
        url: "https://en.wikipedia.org/wiki/Michael_Jordan",
        thumbnail: "https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg"
      },
      {
        rank: 2,
        title: "Serena Williams",
        url: "https://en.wikipedia.org/wiki/Serena_Williams",
        thumbnail: "https://images.pexels.com/photos/1103829/pexels-photo-1103829.jpeg"
      },
      {
        rank: 3,
        title: "Lionel Messi",
        url: "https://en.wikipedia.org/wiki/Lionel_Messi",
        thumbnail: "https://images.pexels.com/photos/3991871/pexels-photo-3991871.jpeg"
      },
      {
        rank: 4,
        title: "Simone Biles",
        url: "https://en.wikipedia.org/wiki/Simone_Biles",
        thumbnail: "https://images.pexels.com/photos/799156/pexels-photo-799156.jpeg"
      },
      {
        rank: 5,
        title: "Kobe Bryant",
        url: "https://en.wikipedia.org/wiki/Kobe_Bryant",
        thumbnail: "https://images.pexels.com/photos/1618201/pexels-photo-1618201.jpeg"
      },
      {
        rank: 6,
        title: "Usain Bolt",
        url: "https://en.wikipedia.org/wiki/Usain_Bolt",
        thumbnail: "https://images.pexels.com/photos/163403/sprint-athletes-runner-male-163403.jpeg"
      },
      {
        rank: 7,
        title: "Naomi Osaka",
        url: "https://en.wikipedia.org/wiki/Naomi_Osaka",
        thumbnail: "https://images.pexels.com/photos/1103830/pexels-photo-1103830.jpeg"
      },
      {
        rank: 8,
        title: "LeBron James",
        url: "https://en.wikipedia.org/wiki/LeBron_James",
        thumbnail: "https://images.pexels.com/photos/1618210/pexels-photo-1618210.jpeg"
      },
      {
        rank: 9,
        title: "Megan Rapinoe",
        url: "https://en.wikipedia.org/wiki/Megan_Rapinoe",
        thumbnail: "https://images.pexels.com/photos/3991870/pexels-photo-3991870.jpeg"
      },
      {
        rank: 10,
        title: "Roger Federer",
        url: "https://en.wikipedia.org/wiki/Roger_Federer",
        thumbnail: "https://images.pexels.com/photos/1103831/pexels-photo-1103831.jpeg"
      }
    ]
  },
  {
    id: "tech-devices",
    name: "Tech Devices",
    description: "Everyday tech that shapes modern life.",
    items: [
      {
        rank: 1,
        title: "iPhone 15 Pro",
        url: "https://www.apple.com/iphone-15-pro/",
        thumbnail: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg"
      },
      {
        rank: 2,
        title: "MacBook Air M3",
        url: "https://www.apple.com/macbook-air/",
        thumbnail: "https://images.pexels.com/photos/18105/pexels-photo.jpg"
      },
      {
        rank: 3,
        title: "Samsung Galaxy S24",
        url: "https://www.samsung.com/galaxy-s24/",
        thumbnail: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg"
      },
      {
        rank: 4,
        title: "iPad Pro",
        url: "https://www.apple.com/ipad-pro/",
        thumbnail: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg"
      },
      {
        rank: 5,
        title: "PlayStation 5",
        url: "https://www.playstation.com/ps5/",
        thumbnail: "https://images.pexels.com/photos/8454348/pexels-photo-8454348.jpeg"
      },
      {
        rank: 6,
        title: "Xbox Series X",
        url: "https://www.xbox.com/series-x",
        thumbnail: "https://images.pexels.com/photos/8454349/pexels-photo-8454349.jpeg"
      },
      {
        rank: 7,
        title: "Nintendo Switch OLED",
        url: "https://www.nintendo.com/switch/oled-model/",
        thumbnail: "https://images.pexels.com/photos/8454350/pexels-photo-8454350.jpeg"
      },
      {
        rank: 8,
        title: "Kindle Paperwhite",
        url: "https://www.amazon.com/kindle-paperwhite/",
        thumbnail: "https://images.pexels.com/photos/267586/pexels-photo-267586.jpeg"
      },
      {
        rank: 9,
        title: "Apple Watch",
        url: "https://www.apple.com/apple-watch/",
        thumbnail: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg"
      },
      {
        rank: 10,
        title: "Bose Noise Cancelling Headphones",
        url: "https://www.bose.com/",
        thumbnail: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg"
      }
    ]
  },
  {
    id: "celebrities",
    name: "Celebrities",
    description: "Famous personalities across entertainment.",
    items: [
      {
        rank: 1,
        title: "Dwayne Johnson",
        url: "https://en.wikipedia.org/wiki/Dwayne_Johnson",
        thumbnail: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg"
      },
      {
        rank: 2,
        title: "Zendaya",
        url: "https://en.wikipedia.org/wiki/Zendaya",
        thumbnail: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
      },
      {
        rank: 3,
        title: "Keanu Reeves",
        url: "https://en.wikipedia.org/wiki/Keanu_Reeves",
        thumbnail: "https://images.pexels.com/photos/428339/pexels-photo-428339.jpeg"
      },
      {
        rank: 4,
        title: "Taylor Swift",
        url: "https://en.wikipedia.org/wiki/Taylor_Swift",
        thumbnail: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg"
      },
      {
        rank: 5,
        title: "Rihanna",
        url: "https://en.wikipedia.org/wiki/Rihanna",
        thumbnail: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg"
      },
      {
        rank: 6,
        title: "Ryan Reynolds",
        url: "https://en.wikipedia.org/wiki/Ryan_Reynolds",
        thumbnail: "https://images.pexels.com/photos/428341/pexels-photo-428341.jpeg"
      },
      {
        rank: 7,
        title: "Emma Stone",
        url: "https://en.wikipedia.org/wiki/Emma_Stone",
        thumbnail: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
      },
      {
        rank: 8,
        title: "Chris Hemsworth",
        url: "https://en.wikipedia.org/wiki/Chris_Hemsworth",
        thumbnail: "https://images.pexels.com/photos/428342/pexels-photo-428342.jpeg"
      },
      {
        rank: 9,
        title: "Lady Gaga",
        url: "https://en.wikipedia.org/wiki/Lady_Gaga",
        thumbnail: "https://images.pexels.com/photos/428343/pexels-photo-428343.jpeg"
      },
      {
        rank: 10,
        title: "Tom Holland",
        url: "https://en.wikipedia.org/wiki/Tom_Holland",
        thumbnail: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
      }
    ]
  },
  {
    id: "post-2000-movies",
    name: "Post 2000 Movies",
    description: "Standout films released after 2000.",
    items: [
      {
        rank: 1,
        title: "The Dark Knight (2008)",
        url: "https://www.imdb.com/title/tt0468569/",
        thumbnail: "https://images.pexels.com/photos/799137/pexels-photo-799137.jpeg"
      },
      {
        rank: 2,
        title: "Inception (2010)",
        url: "https://www.imdb.com/title/tt1375666/",
        thumbnail: "https://images.pexels.com/photos/799158/pexels-photo-799158.jpeg"
      },
      {
        rank: 3,
        title: "The Social Network (2010)",
        url: "https://www.imdb.com/title/tt1285016/",
        thumbnail: "https://images.pexels.com/photos/799136/pexels-photo-799136.jpeg"
      },
      {
        rank: 4,
        title: "Mad Max: Fury Road (2015)",
        url: "https://www.imdb.com/title/tt1392190/",
        thumbnail: "https://images.pexels.com/photos/799155/pexels-photo-799155.jpeg"
      },
      {
        rank: 5,
        title: "Parasite (2019)",
        url: "https://www.imdb.com/title/tt6751668/",
        thumbnail: "https://images.pexels.com/photos/799159/pexels-photo-799159.jpeg"
      },
      {
        rank: 6,
        title: "Gladiator (2000)",
        url: "https://www.imdb.com/title/tt0172495/",
        thumbnail: "https://images.pexels.com/photos/799160/pexels-photo-799160.jpeg"
      },
      {
        rank: 7,
        title: "The Lord of the Rings: The Return of the King (2003)",
        url: "https://www.imdb.com/title/tt0167260/",
        thumbnail: "https://images.pexels.com/photos/799161/pexels-photo-799161.jpeg"
      },
      {
        rank: 8,
        title: "Whiplash (2014)",
        url: "https://www.imdb.com/title/tt2582802/",
        thumbnail: "https://images.pexels.com/photos/799162/pexels-photo-799162.jpeg"
      },
      {
        rank: 9,
        title: "Interstellar (2014)",
        url: "https://www.imdb.com/title/tt0816692/",
        thumbnail: "https://images.pexels.com/photos/799163/pexels-photo-799163.jpeg"
      },
      {
        rank: 10,
        title: "Spider-Man: Into the Spider-Verse (2018)",
        url: "https://www.imdb.com/title/tt4633694/",
        thumbnail: "https://images.pexels.com/photos/799164/pexels-photo-799164.jpeg"
      }
    ]
  },
  {
    id: "90s-rap-songs",
    name: "90s Rap Songs",
    description: "Classic hip-hop tracks from the 1990s.",
    items: [
      {
        rank: 1,
        title: "Juicy – The Notorious B.I.G.",
        url: "https://en.wikipedia.org/wiki/Juicy_(The_Notorious_B.I.G._song)",
        thumbnail: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg"
      },
      {
        rank: 2,
        title: "Nuthin' but a 'G' Thang – Dr. Dre ft. Snoop Dogg",
        url: "https://en.wikipedia.org/wiki/Nuthin%27_but_a_%27G_Thang",
        thumbnail: "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg"
      },
      {
        rank: 3,
        title: "California Love – 2Pac ft. Dr. Dre",
        url: "https://en.wikipedia.org/wiki/California_Love",
        thumbnail: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg"
      },
      {
        rank: 4,
        title: "C.R.E.A.M. – Wu-Tang Clan",
        url: "https://en.wikipedia.org/wiki/C.R.E.A.M.",
        thumbnail: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg"
      },
      {
        rank: 5,
        title: "Hypnotize – The Notorious B.I.G.",
        url: "https://en.wikipedia.org/wiki/Hypnotize_(song)",
        thumbnail: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg"
      },
      {
        rank: 6,
        title: "Gin and Juice – Snoop Dogg",
        url: "https://en.wikipedia.org/wiki/Gin_and_Juice",
        thumbnail: "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg"
      },
      {
        rank: 7,
        title: "It Was a Good Day – Ice Cube",
        url: "https://en.wikipedia.org/wiki/It_Was_a_Good_Day",
        thumbnail: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg"
      },
      {
        rank: 8,
        title: "Rosa Parks – Outkast",
        url: "https://en.wikipedia.org/wiki/Rosa_Parks_(song)",
        thumbnail: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg"
      },
      {
        rank: 9,
        title: "Shook Ones (Part II) – Mobb Deep",
        url: "https://en.wikipedia.org/wiki/Shook_Ones_(Part_II)",
        thumbnail: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg"
      },
      {
        rank: 10,
        title: "Ms. Jackson – Outkast",
        url: "https://en.wikipedia.org/wiki/Ms._Jackson",
        thumbnail: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg"
      }
    ]
  },
  {
    id: "post-2010-video-games",
    name: "Post 2010 Video Games",
    description: "Influential games released after 2010.",
    items: [
      {
        rank: 1,
        title: "The Last of Us (2013)",
        url: "https://en.wikipedia.org/wiki/The_Last_of_Us",
        thumbnail: "https://images.pexels.com/photos/8454348/pexels-photo-8454348.jpeg"
      },
      {
        rank: 2,
        title: "The Witcher 3: Wild Hunt (2015)",
        url: "https://en.wikipedia.org/wiki/The_Witcher_3:_Wild_Hunt",
        thumbnail: "https://images.pexels.com/photos/8454350/pexels-photo-8454350.jpeg"
      },
      {
        rank: 3,
        title: "Red Dead Redemption 2 (2018)",
        url: "https://en.wikipedia.org/wiki/Red_Dead_Redemption_2",
        thumbnail: "https://images.pexels.com/photos/8454349/pexels-photo-8454349.jpeg"
      },
      {
        rank: 4,
        title: "Elden Ring (2022)",
        url: "https://en.wikipedia.org/wiki/Elden_Ring",
        thumbnail: "https://images.pexels.com/photos/8454351/pexels-photo-8454351.jpeg"
      },
      {
        rank: 5,
        title: "Hades (2020)",
        url: "https://en.wikipedia.org/wiki/Hades_(video_game)",
        thumbnail: "https://images.pexels.com/photos/8454352/pexels-photo-8454352.jpeg"
      },
      {
        rank: 6,
        title: "God of War (2018)",
        url: "https://en.wikipedia.org/wiki/God_of_War_(2018_video_game)",
        thumbnail: "https://images.pexels.com/photos/8454353/pexels-photo-8454353.jpeg"
      },
      {
        rank: 7,
        title: "Breath of the Wild (2017)",
        url: "https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild",
        thumbnail: "https://images.pexels.com/photos/8454354/pexels-photo-8454354.jpeg"
      },
      {
        rank: 8,
        title: "Fortnite (2017)",
        url: "https://en.wikipedia.org/wiki/Fortnite",
        thumbnail: "https://images.pexels.com/photos/8454355/pexels-photo-8454355.jpeg"
      },
      {
        rank: 9,
        title: "Overwatch (2016)",
        url: "https://en.wikipedia.org/wiki/Overwatch_(video_game)",
        thumbnail: "https://images.pexels.com/photos/8454356/pexels-photo-8454356.jpeg"
      },
      {
        rank: 10,
        title: "Stardew Valley (2016)",
        url: "https://en.wikipedia.org/wiki/Stardew_Valley",
        thumbnail: "https://images.pexels.com/photos/8454357/pexels-photo-8454357.jpeg"
      }
    ]
  },
  {
    id: "novels",
    name: "Novels",
    description: "Beloved and influential works of fiction.",
    items: [
      {
        rank: 1,
        title: "1984 – George Orwell",
        url: "https://en.wikipedia.org/wiki/Nineteen_Eighty-Four",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      },
      {
        rank: 2,
        title: "To Kill a Mockingbird – Harper Lee",
        url: "https://en.wikipedia.org/wiki/To_Kill_a_Mockingbird",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      },
      {
        rank: 3,
        title: "The Great Gatsby – F. Scott Fitzgerald",
        url: "https://en.wikipedia.org/wiki/The_Great_Gatsby",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      },
      {
        rank: 4,
        title: "Beloved – Toni Morrison",
        url: "https://en.wikipedia.org/wiki/Beloved_(novel)",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      },
      {
        rank: 5,
        title: "The Catcher in the Rye – J.D. Salinger",
        url: "https://en.wikipedia.org/wiki/The_Catcher_in_the_Rye",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      },
      {
        rank: 6,
        title: "One Hundred Years of Solitude – Gabriel García Márquez",
        url: "https://en.wikipedia.org/wiki/One_Hundred_Years_of_Solitude",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      },
      {
        rank: 7,
        title: "The Road – Cormac McCarthy",
        url: "https://en.wikipedia.org/wiki/The_Road",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      },
      {
        rank: 8,
        title: "The Name of the Wind – Patrick Rothfuss",
        url: "https://en.wikipedia.org/wiki/The_Name_of_the_Wind",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      },
      {
        rank: 9,
        title: "Americanah – Chimamanda Ngozi Adichie",
        url: "https://en.wikipedia.org/wiki/Americanah",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      },
      {
        rank: 10,
        title: "The Kite Runner – Khaled Hosseini",
        url: "https://en.wikipedia.org/wiki/The_Kite_Runner",
        thumbnail: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg"
      }
    ]
  },
  {
    id: "restaurants",
    name: "Restaurants",
    description: "Notable spots for memorable meals.",
    items: [
      {
        rank: 1,
        title: "Eleven Madison Park – New York",
        url: "https://www.elevenmadisonpark.com/",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      },
      {
        rank: 2,
        title: "Noma – Copenhagen",
        url: "https://noma.dk/",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      },
      {
        rank: 3,
        title: "Osteria Francescana – Modena",
        url: "https://www.osteriafrancescana.it/",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      },
      {
        rank: 4,
        title: "Pujol – Mexico City",
        url: "https://pujol.com.mx/",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      },
      {
        rank: 5,
        title: "Central – Lima",
        url: "https://centralrestaurante.com.pe/",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      },
      {
        rank: 6,
        title: "Gaggan – Bangkok",
        url: "https://www.gaggananand.com/",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      },
      {
        rank: 7,
        title: "The French Laundry – Yountville",
        url: "https://www.thomaskeller.com/tfl",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      },
      {
        rank: 8,
        title: "Dishoom – London",
        url: "https://www.dishoom.com/",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      },
      {
        rank: 9,
        title: "Din Tai Fung – Taipei",
        url: "https://dintaifung.com.tw/",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      },
      {
        rank: 10,
        title: "Joe’s Pizza – New York",
        url: "https://www.joespizzanyc.com/",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      }
    ]
  }
];

function getFreshStockCategories() {
  return JSON.parse(JSON.stringify(STOCK_CATEGORIES));
}
