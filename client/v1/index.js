// Invoking strict mode
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_DEALERS = [
  {
    'name': 'Dealabs',
    'url': 'https://www.dealabs.com/groupe/lego'
  },
  {
    'name': 'Avenue de la brique',
    'url': 'https://www.avenuedelabrique.com/promotions-et-bons-plans-lego'
  }
];

console.table(MY_FAVORITE_DEALERS);
console.log(MY_FAVORITE_DEALERS[0]);

/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO 1: The highest reduction
// 0. I have 2 favorite lego sets shopping communities stored in MY_FAVORITE_DEALERS variable
// 1. Create a new variable and assign it the link of the lego set with the highest reduction I can find on these 2 websites
// 2. Log the variable


var BestDeal;
let bestdis=deals[0].discount;
for (let i = 1; i<deals.length;i++){

  if (deals[i].discount>bestdis){
    bestdis=deals[i].discount;
    BestDeal=deals[i].link
  }

}
console.log(BestDeal);


/**
 * 🧱
 * Easy 😁?
 * Now we manipulate the variable `deals`
 * `deals` is a list of deals from several shopping communities
 * The variable is loaded by the file `data.js`
 * 🧱
 */

// 🎯 TODO 2: Number of deals
// 1. Create a variable and assign it the number of deals
// 2. Log the variable

let nb_of_deals=deals.length;
console.log(nb_of_deals);


// 🎯 TODO 3: Website name
// 1. Create a variable and assign it the list of shopping community name only
// 2. Log the variable
// 3. Log how many shopping communities we have

let list_community=[];
for (let i =0; i<deals.length; i++){
  list_community.push(deals[i].community);
}
console.log(list_community)

let occurence=[];
for (let i = 0; i < list_community.length; i++) {
  if (!occurence.includes(list_community[i])) {
    occurence.push(list_community[i]);
  }
}

console.log(occurence.length);

// 🎯 TODO 4: Sort by price
// 1. Create a function to sort the deals by price
// 2. Create a variable and assign it the list of sets by price from lowest to highest
// 3. Log the variable

let list_price=[];
let sort_list=[];
function sort_deals_price(){
  for (let i = 0; i < list_community.length; i++){
    list_price.push(deals[i].price);
  }
  return list_price;
}
sort_list=sort_deals_price();
console.log(sort_list.sort((a, b) => a - b));


// 🎯 TODO 5: Sort by date
// 1. Create a function to sort the deals by date
// 2. Create a variable and assign it the list of deals by date from recent to old
// 3. Log the variable

let list_date=[];
let sorted_list_date=[];
function sort_deals_date(){
  for (let i = 0; i < list_community.length; i++){
    list_date.push(new Date(deals[i].published));
  }
  return list_date;
}
sorted_list_date = sort_deals_date().sort((a, b) => a - b);
console.log(sorted_list_date);

// 🎯 TODO 6: Filter a specific percentage discount range
// 1. Filter the list of deals between 50% and 75%
// 2. Log the list

let good_deal=[];
for (let i = 0; i < list_community.length; i++){
  if (deals[i].discount>=50 && deals[i].discount<=75){
    good_deal.push(deals[i].discount);
  }
}
console.log(good_deal);


// 🎯 TODO 7: Average percentage discount
// 1. Determine the average percentage discount of the deals
// 2. Log the average

let all_discount=[];
let sum_discount
for (let i = 0; i < list_community.length; i++){
  all_discount.push(deals[i].discount)
}
let av_discount = all_discount.reduce((sum, num) => sum + num, 0);
let moy_discount = av_discount/nb_of_deals
console.log(moy_discount);

/**
 * 🏎
 * We are almost done with the `deals` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO 8: Deals by community
// 1. Create an object called `communities` to manipulate deals by community name 
// The key is the community name
// The value is the array of deals for this specific community
//
// Example:
// const communities = {
//   'community-name-1': [{...}, {...}, ..., {...}],
//   'community-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'community-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of deals by community

const communities = {};

// Parcourir les deals et les regrouper par communauté
deals.forEach(deal => {
  const community = deal.community; // Récupérer le nom de la communauté
  
  // Si la communauté n'existe pas encore dans `communities`, la créer
  if (!communities[community]) {
    communities[community] = [];
  }
  
  // Ajouter le deal à la communauté correspondante
  communities[community].push(deal.title);
});


console.log("Deals regroupés par communauté :", communities);


Object.keys(communities).forEach(community => {
  console.log(`${community}: ${communities[community].length} deals`);
});


// 🎯 TODO 9: Sort by price for each community
// 1. For each community, sort the deals by discount price, from highest to lowest
// 2. Log the sort


const communities_discount = [];
deals.forEach(deal => {
  const community = deal.community;

  if (!communities_discount[community]) {
    communities_discount[community] = [];
  }

  communities_discount[community].push({ title: deal.title, discount: deal.discount });
});

// Trier par réduction décroissante dans chaque communauté
Object.keys(communities_discount).forEach(community => {
  communities_discount[community].sort((a, b) => b.discount - a.discount);
});

// Afficher les réductions et titres triés par communauté
console.log("Réductions triées par communauté :", communities_discount);






// 🎯 TODO 10: Sort by date for each community
// 1. For each set, sort the deals by date, from old to recent
// 2. Log the sort

const communities_date = {};

// Trier les deals par date pour chaque communauté
Object.keys(communities).forEach(community => {
  // Initialiser l'entrée dans communities_date pour chaque communauté
  if (!communities_date[community]) {
    communities_date[community] = [];
  }

  // Parcourir les deals de la communauté
  communities[community].forEach(title => {
    const deal = deals.find(d => d.title === title); // Trouver le deal correspondant au titre
    if (deal) {
      communities_date[community].push({
        title: deal.title,
        published: new Date(deal.published) // Convertir la date en objet Date pour tri correct
      });
    }
  });

  // Trier par date décroissante (plus récent en premier)
  communities_date[community].sort((a, b) => b.published - a.published);
});

console.log("Dates de publication triées par communauté :", communities_date);


/**
 * 🧥
 * Cool for your effort.
 * Now we manipulate the variable `VINTED`
 * `VINTED` is the listing of current items from https://www.vinted.fr/catalog?search_text=43230&time=1727075774&status_ids[]=6&status_ids[]=1&brand_ids[]=89162&page=1
 * The target set is 43230 (Walt Disney Tribute Camera)
 * 🧥
 */

const VINTED = [
  {
    link: "https://www.vinted.fr/items/5623924966-lego-walt-disney-tribute-camera-43230",
    price: "48.99",
    title: "Lego Walt Disney Tribute Camera (43230",
    published: "Thu, 09 Jan 2025 07:52:33 GMT",
    uuid: "d90a9062-259e-5499-909c-99a5eb488c86"
  },
  {
    link: "https://www.vinted.fr/items/5567527057-lego-43230-cinepresa-omaggio-a-walt-disney",
    price: "121.45",
    title: "Lego 43230 Cinepresa omaggio a Walt Disney",
    published: "Sat, 28 Dec 2024 09:00:02 GMT",
    uuid: "e96bfdec-45ad-5391-83f7-6e9f3cd7fecb"
  },
  {
    link: "https://www.vinted.fr/items/5471926226-lego-disney-43230",
    price: "86.8",
    title: "Lego Disney 43230",
    published: "Mon, 02 Dec 2024 08:48:11 GMT",
    uuid: "624846ce-ea0c-5f35-9b93-6f4bc51c5e0c"
  },
  {
    link: "https://www.vinted.fr/items/5563396347-lego-43230-omaggio-a-walter-disney-misb",
    price: "131.95",
    title: "LEGO 43230 omaggio a Walter Disney misb",
    published: "Thu, 26 Dec 2024 21:18:04 GMT",
    uuid: "18751705-536e-5c1f-9a9d-383a3a629df5"
  },
  {
    link: "https://www.vinted.fr/items/4167039593-lego-disney-la-camera-hommage-a-walt-disney",
    price: "104.65",
    title: "LEGO - Disney - La caméra Hommage à Walt Disney",
    published: "Fri, 01 Mar 2024 13:58:12 GMT",
    uuid: "22f38d93-d41b-57ec-b418-626b8dc98859"
  },
  {
    link: "https://www.vinted.fr/items/5375154050-lego-43230-disney-100",
    price: "84.7",
    title: "LEGO 43230 Disney 100",
    published: "Wed, 13 Nov 2024 09:50:06 GMT",
    uuid: "e1f5924c-ca81-5778-b0ad-96a0edded346"
  },
  {
    link: "https://www.vinted.fr/items/5475660652-lego-disney-minifigure-dumbo",
    price: "8.05",
    title: "Lego Disney Minifigure Dumbo",
    published: "Mon, 02 Dec 2024 20:41:46 GMT",
    uuid: "55a44c9d-4c7f-5a16-bbea-49ad4ee8c79b"
  },
  {
    link: "https://www.vinted.fr/items/5440958439-walt-disney-tribute-camera-100-years",
    price: "89.95",
    title: "Walt disney tribute camera 100 years",
    published: "Mon, 25 Nov 2024 14:11:59 GMT",
    uuid: "96a3be93-58b2-5ec1-b2bb-fbf2a62546f3"
  },
  {
    link: "https://www.vinted.fr/items/5624190277-lego-disney-kamera-43230",
    price: "105.7",
    title: "Lego Disney Kamera 43230",
    published: "Thu, 09 Jan 2025 09:28:36 GMT",
    uuid: "9d472914-bb59-515f-b6e4-0ef4d4fc639f"
  },
  {
    link: "https://www.vinted.fr/items/5635223988-lego-disney-43230-camara-en-homenaje-a-walt-disney",
    price: "85.74",
    title: "Lego  Disney 43230 Cámara en Homenaje a Walt Disney",
    published: "Sat, 11 Jan 2025 14:16:24 GMT",
    uuid: "3500f71a-cb5c-5628-8231-89aa67c7aecf"
  },
  {
    link: "https://www.vinted.fr/items/5564553918-nuevo-43230-lego-camara-homenaje-disney",
    price: "95.2",
    title: "NUEVO |  43230 LEGO Cámara Homenaje Disney",
    published: "Fri, 27 Dec 2024 11:55:12 GMT",
    uuid: "fc70a57a-06f5-5428-bbd0-5baeca37e552"
  },
  {
    link: "https://www.vinted.fr/items/5559166527-lego-disney-walt-disney-eerbetoon-camera-100ste-verjaardag-set-voor-volwassenen-nr-43230",
    price: "86.8",
    title: "LEGO Disney Walt Disney eerbetoon – camera 100ste Verjaardag Set voor Volwassenen -nr 43230 -",
    published: "Wed, 25 Dec 2024 11:20:30 GMT",
    uuid: "6ca42020-9c65-561e-b742-da2a21355644"
  },
  {
    link: "https://www.vinted.fr/items/5644097295-lego-43230-disney-100-ans",
    price: "95.2",
    title: "lego 43230 disney 100 ans",
    published: "Sun, 12 Jan 2025 18:43:30 GMT",
    uuid: "380c843c-5c6a-56fb-b200-097b92bc7aca"
  },
  {
    link: "https://www.vinted.fr/items/5554845161-lego-43230-walt-disney-bambi-and-dumbo",
    price: "45.85",
    title: "LEGO 43230 Walt Disney, Bambi and Dumbo",
    published: "Sun, 22 Dec 2024 23:42:01 GMT",
    uuid: "13eae2d6-bd1c-5f51-b627-5d44a1602a59"
  },
  {
    link: "https://www.vinted.fr/items/5630073060-lego-43230-walt-disney-tribute-camera",
    price: "84.6",
    title: "LEGO 43230 Walt Disney Tribute Camera 🎥",
    published: "Fri, 10 Jan 2025 13:47:28 GMT",
    uuid: "e6425ff6-c149-5b68-9c30-35c29cf8f1c0"
  },
  {
    link: "https://www.vinted.fr/items/5472556376-lego-100-ans-43230",
    price: "100.45",
    title: "Lego 100 ans 43230",
    published: "Mon, 02 Dec 2024 11:05:24 GMT",
    uuid: "7259f7d5-1912-57a7-b07c-717d4083a78a"
  },
  {
    link: "https://www.vinted.fr/items/4385404925-lego-43230-disney-100-years",
    price: "84.7",
    title: "Lego 43230 - Disney 100 Years",
    published: "Fri, 19 Apr 2024 10:19:38 GMT",
    uuid: "f2c5377c-84f9-571d-8712-98902dcbb913"
  },
  {
    link: "https://www.vinted.fr/items/5602138449-nieuw-lego-100year-disneycamera-43230",
    price: "89.95",
    title: "NIEUW lego 100year disneycamera 43230",
    published: "Sat, 04 Jan 2025 22:17:28 GMT",
    uuid: "7cbbc1e0-d93d-5fe9-a034-a2c3ec210195"
  },
  {
    link: "https://www.vinted.fr/items/5588512868-lego-camera-disney-100-43230",
    price: "74.2",
    title: "Lego Camera Disney 100 (43230)",
    published: "Thu, 02 Jan 2025 13:41:32 GMT",
    uuid: "b0aecebe-264d-5eef-877a-607be25f63e1"
  },
  {
    link: "https://www.vinted.fr/items/3588915159-lego-43230",
    price: "88.9",
    title: "Lego 43230",
    published: "Tue, 10 Oct 2023 10:04:49 GMT",
    uuid: "ffc42f22-259c-5c06-b190-784577a2f282"
  },
  {
    link: "https://www.vinted.fr/items/4576548365-istruzioni-lego-43230",
    price: "10.14",
    title: "Istruzioni Lego 43230",
    published: "Thu, 30 May 2024 16:56:42 GMT",
    uuid: "e90b87b4-abba-5554-ba03-47981dc1041c"
  },
  {
    link: "https://www.vinted.fr/items/4804901822-lego-disney-cinepresa-omaggio-a-walt-disney",
    price: "105.7",
    title: "LEGO Disney Cinepresa Omaggio a Walt Disney",
    published: "Wed, 24 Jul 2024 17:04:53 GMT",
    uuid: "6819f6aa-5f4d-5acf-a663-caa52d8a8c90"
  },
  {
    link: "https://www.vinted.fr/items/5591496257-lego-disney-43230",
    price: "95.2",
    title: "Lego Disney 43230",
    published: "Thu, 02 Jan 2025 22:14:31 GMT",
    uuid: "fbea275d-d5b9-580e-9401-e4c0337e92d1"
  },
  {
    link: "https://www.vinted.fr/items/5553562377-lego-disney-la-camera-43230",
    price: "104.65",
    title: "Lego Disney la camera 43230",
    published: "Sun, 22 Dec 2024 16:00:55 GMT",
    uuid: "222ec893-b0e5-55e0-a935-a116d45023fd"
  },
  {
    link: "https://www.vinted.fr/items/4023316953-lego-cinepresa-omaggio-a-walt-disney-43230",
    price: "100.45",
    title: "Lego cinepresa omaggio a walt disney 43230",
    published: "Thu, 25 Jan 2024 20:39:32 GMT",
    uuid: "b03ce63e-e69e-5335-847a-0032f18ac9d2"
  },
  {
    link: "https://www.vinted.fr/items/5344670428-lego-43230-walt-disney-tribute-camera",
    price: "116.2",
    title: "LEGO 43230 Walt Disney Tribute Camera",
    published: "Thu, 07 Nov 2024 17:44:45 GMT",
    uuid: "8d12dc0d-9390-5a9a-9ccf-e7cb35c9b458"
  },
  {
    link: "https://www.vinted.fr/items/5287915650-lego-camara-homenaje-walt-disney-43230",
    price: "89.95",
    title: "Lego Camara homenaje Walt Disney 43230",
    published: "Sun, 27 Oct 2024 16:21:19 GMT",
    uuid: "74aefaa0-f762-5729-a652-4e4ff0e134d8"
  },
  {
    link: "https://www.vinted.fr/items/5620486038-lego-camara-en-homenaje-a-walt-disney",
    price: "105.7",
    title: "Lego Cámara en homenaje a Walt Disney",
    published: "Wed, 08 Jan 2025 12:36:42 GMT",
    uuid: "dfe21e8f-036d-5a62-a9f2-cd083ef440be"
  },
  {
    link: "https://www.vinted.fr/items/5504898807-lego-43212-le-train-en-fete-disney-mickey-minnie-vaiana-peter-pan-fee-clochette-woody",
    price: "42.6",
    title: "Lego 43212 - Le train en fête Disney Mickey Minnie Vaiana Peter Pan Fée Clochette Woody",
    published: "Mon, 09 Dec 2024 12:09:27 GMT",
    uuid: "af8db740-80fb-5ac4-9550-e63a17ed9ac1"
  },
  {
    link: "https://www.vinted.fr/items/5175463479-lego-43230-disney-camera-100-years-walt-disney-nuovo-a",
    price: "100.45",
    title: "LEGO 43230 disney camera 100 years walt disney Nuovo *A",
    published: "Mon, 07 Oct 2024 11:16:14 GMT",
    uuid: "2984d3ae-7c55-526e-8ec4-2540b8db88a7"
  },
  {
    link: "https://www.vinted.fr/items/5483270340-lego-43230",
    price: "95.2",
    title: "Lego 43230",
    published: "Wed, 04 Dec 2024 15:59:31 GMT",
    uuid: "c108cdba-227c-596f-b56f-1571c55a1580"
  },
  {
    link: "https://www.vinted.fr/items/3605077693-notice-lego-camera-disney",
    price: "5.95",
    title: "Notice Lego « Caméra Disney »",
    published: "Sat, 14 Oct 2023 08:01:48 GMT",
    uuid: "aee175f6-bce6-5f7d-9b99-f6ec96671c4a"
  },
  {
    link: "https://www.vinted.fr/items/5607305651-lego-disney-43230-camera-de-tributo-da-walt-disney",
    price: "95.2",
    title: "LEGO Disney 43230 Câmera de Tributo da Walt Disney",
    published: "Sun, 05 Jan 2025 17:18:29 GMT",
    uuid: "78f9be9a-e51f-5fff-ba37-771f7631dc63"
  },
  {
    link: "https://www.vinted.fr/items/5530905715-lego-disney-43230-walt-disney-eerbetoon",
    price: "95.2",
    title: "Lego Disney 43230 walt Disney eerbetoon",
    published: "Sun, 15 Dec 2024 16:33:15 GMT",
    uuid: "ad01132b-22ee-51be-bc18-818ef46bbbe5"
  },
  {
    link: "https://www.vinted.fr/items/4872522741-la-camera-hommage-a-walt-disney-lego-set-43230",
    price: "100.45",
    title: "La caméra Hommage à Walt Disney lego set 43230",
    published: "Sat, 10 Aug 2024 21:41:03 GMT",
    uuid: "5357bbf5-7232-5a6a-b48c-1e4f9a26ac68"
  },
  {
    link: "https://www.vinted.fr/items/5356851392-lego-disney-camera-100-jr-43230",
    price: "95.2",
    title: "Lego Disney camera 100 jr 43230",
    published: "Sun, 10 Nov 2024 10:31:10 GMT",
    uuid: "d5aefd4a-c881-5aed-9527-0c73df0fa941"
  },
  {
    link: "https://www.vinted.fr/items/4126171841-lego-camera-disney-100ans-43230",
    price: "95.2",
    title: "Légo Caméra Disney 100ans 43230",
    published: "Tue, 20 Feb 2024 17:47:11 GMT",
    uuid: "a4ca82af-3e8b-518a-8f55-59e0cbc1d81d"
  },
  {
    link: "https://www.vinted.fr/items/3872250639-lego-43230-disney-new",
    price: "89.95",
    title: "Lego 43230 Disney new",
    published: "Mon, 11 Dec 2023 16:27:33 GMT",
    uuid: "5eb7f1d4-f871-526f-93e0-7b65057f68fd"
  }
];

/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO 11: Compute the average, the p5 and the p25 price value
// 1. Compute the average price value of the listing
// 2. Compute the p5 price value of the listing
// 3. Compute the p25 price value of the listing
// The p25 value (25th percentile) is the lower value expected to be exceeded in 25% of the vinted items

const prices = VINTED.map(item => parseFloat(item.price));
const total = prices.reduce((sum, price) => sum + price, 0);
const average = total / prices.length;
const sortedPrices = [...prices].sort((a, b) => a - b);

// Calculer les indices pour p5 et p25
const p5Index = Math.ceil(0.05 * sortedPrices.length) - 1; // 5ᵉ centile
const p25Index = Math.ceil(0.25 * sortedPrices.length) - 1; // 25ᵉ centile

// Obtenir les valeurs p5 et p25
const p5 = sortedPrices[p5Index];
const p25 = sortedPrices[p25Index];

console.log("Statistiques des prix :", average, p5, p25);

// 🎯 TODO 12: Very old listed items
// // 1. Log if we have very old items (true or false)
// // A very old item is an item `published` more than 3 weeks ago

function hasVeryOldItems(vintedItems) {
  const threeWeeksAgo = new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000); // Date de seuil

  // Vérifier si un article est publié il y a plus de 3 semaines
  return vintedItems.some(item => new Date(item.published) < threeWeeksAgo);
}

// Appeler la fonction avec vos données
const veryOldItemsExist = hasVeryOldItems(VINTED);
console.log("A-t-on des articles très anciens :", veryOldItemsExist);


// 🎯 TODO 13: Find a specific item
// 1. Find the item with the uuid `f2c5377c-84f9-571d-8712-98902dcbb913`
// 2. Log the item

function findItemByUuid(vintedItems, targetUuid) {
  // Trouver l'article avec le UUID donné
  return vintedItems.find(item => item.uuid === targetUuid);
}
// UUID cible
const targetUuid = "f2c5377c-84f9-571d-8712-98902dcbb913";

// Trouver l'article
const specificItem = findItemByUuid(VINTED, targetUuid);

// Afficher l'article trouvé ou un message s'il n'existe pas
if (specificItem) {
  console.log("Article trouvé :", specificItem);
} else {
  console.log("Aucun article trouvé avec l'UUID :", targetUuid);
}


// 🎯 TODO 14: Delete a specific item
// 1. Delete the item with the uuid `f2c5377c-84f9-571d-8712-98902dcbb913`
// 2. Log the new list of items

function deleteItemByUuid(vintedItems, targetUuid) {
  // Créer une nouvelle liste sans l'article avec l'UUID spécifié
  return vintedItems.filter(item => item.uuid !== targetUuid);
}

// UUID cible
const targetUuid_del = "f2c5377c-84f9-571d-8712-98902dcbb913";

// Supprimer l'article
const updatedList = deleteItemByUuid(VINTED, targetUuid_del);

// Afficher la nouvelle liste
console.log("Nouvelle liste après suppression :", updatedList);



// 🎯 TODO 5: Save a favorite item
// We declare and assign a variable called `sealedCamera`
let sealedCamera = {
  link: "https://www.vinted.fr/items/5563396347-lego-43230-omaggio-a-walter-disney-misb",
  price: "131.95",
  title: "LEGO 43230 omaggio a Walter Disney misb",
  published: "Thu, 26 Dec 2024 21:18:04 GMT",
  uuid: "18751705-536e-5c1f-9a9d-383a3a629df5"
};

// we make a copy of `sealedCamera` to `camera` variable
// and set a new property `favorite` to true
let camera = sealedCamera;

camera.favorite = true;

// 1. Log `sealedCamera` and `camera` variables
// 2. What do you notice?

// we make (again) a new assignment again
sealedCamera = {
  link: "https://www.vinted.fr/items/5563396347-lego-43230-omaggio-a-walter-disney-misb",
  price: "131.95",
  title: "LEGO 43230 omaggio a Walter Disney misb",
  published: "Thu, 26 Dec 2024 21:18:04 GMT",
  uuid: "18751705-536e-5c1f-9a9d-383a3a629df5"
};
console.log("After reassigning sealedCamera:");
console.log("sealedCamera:", sealedCamera);
console.log("camera:", camera);
// 3. Update `camera` property with `favorite` to true WITHOUT changing sealedCamera properties
camera = Object.assign({}, sealedCamera);
camera.favorite = true;

console.log("sealedCamera:", sealedCamera);
console.log("camera:", camera);

// 🎯 TODO 11: Compute the profitability
// From a specific deal called `deal`
const deal = {
  'title':  'La caméra Hommage à Walt Disney',
  'retail': 75.98,
  'price': 56.98,
  'legoId': '43230'
}

// 1. Compute the potential highest profitability based on the VINTED items
// 2. Log the value
function computeHighestProfitability(deal, vintedItems) {
  // Filtrer les articles pertinents pour le legoId
  const relevantItems = vintedItems.filter(item => item.title.includes(deal.legoId));

  // Si aucun article pertinent n'est trouvé, retourner 0
  if (relevantItems.length === 0) {
    return 0;
  }

  // Calculer la profitabilité pour chaque article et trouver la valeur maximale
  const maxProfitability = relevantItems.reduce((maxProfit, item) => {
    const profit = deal.retail - parseFloat(item.price); // Calcul de la profitabilité
    return Math.max(maxProfit, profit); // Retourner la valeur maximale
  }, 0);

  return maxProfitability;
}

// Exemple d'utilisation avec le deal et VINTED
const profitability = computeHighestProfitability(deal, VINTED);

// Afficher la profitabilité maximale
console.log("Profitabilité maximale :", profitability);



/**
 * 🎬
 * The End: last thing to do
 * 🎬
 */

// 🎯 LAST TODO: Save in localStorage
// 1. Save MY_FAVORITE_DEALERS in the localStorage
// 2. log the localStorage

let localStorage;
localStorage.push(MY_FAVORITE_DEALERS);
console.log(localStorage);
