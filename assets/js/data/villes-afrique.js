/*
 * Bibliothèque locale des villes africaines.
 * Les villes sont des suggestions : la saisie manuelle reste autorisée.
 */

const africanCities = {
  dz: ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Sétif", "Tlemcen", "Béjaïa", "Biskra"],
  ao: ["Luanda", "Huambo", "Lobito", "Benguela", "Lubango", "Malanje", "Namibe", "Soyo", "Cabinda", "Uíge"],
  bj: ["Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi", "Djougou", "Bohicon", "Natitingou", "Ouidah", "Lokossa", "Kandi"],
  bw: ["Gaborone", "Francistown", "Maun", "Molepolole", "Serowe", "Selebi-Phikwe", "Kanye", "Mahalapye", "Mochudi", "Palapye"],
  bf: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora", "Ouahigouya", "Kaya", "Tenkodogo", "Fada N'Gourma", "Dédougou", "Dori"],
  bi: ["Bujumbura", "Gitega", "Ngozi", "Rumonge", "Muyinga", "Ruyigi", "Kayanza", "Bururi", "Makamba", "Muramvya"],
  cm: ["Douala", "Yaoundé", "Garoua", "Bamenda", "Maroua", "Bafoussam", "Ngaoundéré", "Bertoua", "Limbé", "Kribi"],
  cv: ["Praia", "Mindelo", "Santa Maria", "Assomada", "Porto Novo", "São Filipe", "Tarrafal", "Pedra Badejo", "Sal Rei", "Ribeira Grande"],
  cf: ["Bangui", "Bimbo", "Berbérati", "Carnot", "Bambari", "Bouar", "Bossangoa", "Bria", "Bangassou", "Nola"],
  km: ["Moroni", "Mutsamudu", "Fomboni", "Domoni", "Tsidjé", "Ouani", "Mitsamiouli", "Sima", "Adda-Douéni", "Foumbouni"],
  cg: ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi", "Ouesso", "Madingou", "Owando", "Impfondo", "Sibiti", "Mossendjo"],
  cd: ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kisangani", "Goma", "Bukavu", "Kananga", "Kolwezi", "Likasi", "Matadi"],
  ci: ["Abidjan", "Yamoussoukro", "Bouaké", "Daloa", "Korhogo", "San-Pédro", "Man", "Gagnoa", "Abengourou", "Grand-Bassam"],
  dj: ["Djibouti", "Ali Sabieh", "Tadjourah", "Obock", "Dikhil", "Arta", "Holhol", "Yoboki", "Loyada", "Randa"],
  eg: ["Le Caire", "Alexandrie", "Gizeh", "Louxor", "Assouan", "Port-Saïd", "Suez", "Mansourah", "Tanta", "Ismaïlia"],
  gq: ["Malabo", "Bata", "Ebebiyín", "Mongomo", "Evinayong", "Mikomeseng", "Luba", "Añisoc", "Nsok", "Rebola"],
  er: ["Asmara", "Keren", "Massawa", "Assab", "Mendefera", "Barentu", "Adi Keyh", "Dekemhare", "Teseney", "Akordat"],
  sz: ["Mbabane", "Manzini", "Lobamba", "Siteki", "Nhlangano", "Piggs Peak", "Malkerns", "Matsapha", "Big Bend", "Lavumisa"],
  et: ["Addis-Abeba", "Dire Dawa", "Mekelle", "Gondar", "Hawassa", "Bahir Dar", "Jimma", "Dessie", "Adama", "Harar"],
  ga: ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", "Lambaréné", "Mouila", "Tchibanga", "Koulamoutou", "Makokou"],
  gm: ["Banjul", "Serekunda", "Brikama", "Bakau", "Farafenni", "Lamin", "Sukuta", "Basse Santa Su", "Gunjur", "Kerewan"],
  gh: ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Cape Coast", "Tema", "Sunyani", "Koforidua", "Ho", "Wa"],
  gn: ["Conakry", "Nzérékoré", "Kindia", "Kankan", "Labé", "Boké", "Mamou", "Siguiri", "Faranah", "Kissidougou"],
  gw: ["Bissau", "Bafatá", "Gabú", "Cacheu", "Bissorã", "Bolama", "Catió", "Mansôa", "Farim", "Quinhámel"],
  ke: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale", "Garissa", "Nyeri"],
  ls: ["Maseru", "Teyateyaneng", "Mafeteng", "Hlotse", "Mohale's Hoek", "Maputsoe", "Qacha's Nek", "Quthing", "Butha-Buthe", "Mokhotlong"],
  lr: ["Monrovia", "Gbarnga", "Buchanan", "Ganta", "Kakata", "Zwedru", "Harper", "Voinjama", "Robertsport", "Greenville"],
  ly: ["Tripoli", "Benghazi", "Misrata", "Bayda", "Zawiya", "Tobrouk", "Sabha", "Derna", "Sirte", "Khoms"],
  mg: ["Antananarivo", "Toamasina", "Antsirabe", "Fianarantsoa", "Mahajanga", "Toliara", "Antsiranana", "Morondava", "Sambava", "Ambositra"],
  mw: ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu", "Mangochi", "Karonga", "Salima", "Liwonde", "Balaka"],
  ml: ["Bamako", "Sikasso", "Mopti", "Ségou", "Kayes", "Gao", "Tombouctou", "Koutiala", "Kati", "San"],
  ma: ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Tétouan", "Safi"],
  mu: ["Port-Louis", "Beau-Bassin", "Vacoas", "Curepipe", "Quatre Bornes", "Triolet", "Goodlands", "Mahébourg", "Rose-Hill", "Centre de Flacq"],
  mr: ["Nouakchott", "Nouadhibou", "Kiffa", "Rosso", "Zouérate", "Atar", "Kaédi", "Sélibaby", "Néma", "Aioun"],
  mz: ["Maputo", "Matola", "Beira", "Nampula", "Chimoio", "Nacala", "Quelimane", "Tete", "Pemba", "Xai-Xai"],
  na: ["Windhoek", "Walvis Bay", "Swakopmund", "Oshakati", "Rundu", "Otjiwarongo", "Gobabis", "Katima Mulilo", "Rehoboth", "Keetmanshoop"],
  ne: ["Niamey", "Zinder", "Maradi", "Agadez", "Tahoua", "Dosso", "Diffa", "Arlit", "Tillabéri", "Gaya"],
  ng: ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Kaduna", "Enugu", "Jos", "Ilorin"],
  rw: ["Kigali", "Huye", "Musanze", "Rubavu", "Muhanga", "Rusizi", "Nyagatare", "Rwamagana", "Kayonza", "Karongi"],
  st: ["São Tomé", "Santo António", "Neves", "Santana", "Trindade", "Guadalupe", "Bombom", "Ribeira Afonso", "Angolares", "Santa Catarina"],
  sn: ["Dakar", "Thiès", "Saint-Louis", "Touba", "Kaolack", "Ziguinchor", "Mbour", "Diourbel", "Louga", "Tambacounda"],
  sc: ["Victoria", "Anse Boileau", "Beau Vallon", "Cascade", "Takamaka", "Anse Royale", "Baie Lazare", "Bel Ombre", "Port Glaud", "Grand Anse"],
  sl: ["Freetown", "Bo", "Kenema", "Makeni", "Koidu", "Port Loko", "Lunsar", "Waterloo", "Kabala", "Bonthe"],
  so: ["Mogadiscio", "Hargeisa", "Kismayo", "Bosaso", "Garowe", "Berbera", "Baidoa", "Galkayo", "Burao", "Jowhar"],
  za: ["Johannesburg", "Le Cap", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Polokwane", "Nelspruit", "Kimberley"],
  ss: ["Djouba", "Wau", "Malakal", "Yei", "Bor", "Aweil", "Rumbek", "Torit", "Bentiu", "Yambio"],
  sd: ["Khartoum", "Omdurman", "Port-Soudan", "Kassala", "El Obeid", "Nyala", "Wad Madani", "Atbara", "Dongola", "El Fasher"],
  tz: ["Dodoma", "Dar es Salaam", "Mwanza", "Arusha", "Mbeya", "Morogoro", "Tanga", "Zanzibar", "Kigoma", "Moshi"],
  tg: ["Lomé", "Kara", "Sokodé", "Kpalimé", "Atakpamé", "Tsévié", "Dapaong", "Bassar", "Aného", "Mango"],
  tn: ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Monastir", "Nabeul"],
  ug: ["Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu", "Mbale", "Fort Portal", "Arua", "Lira", "Masaka"],
  zm: ["Lusaka", "Kitwe", "Ndola", "Livingstone", "Kabwe", "Chingola", "Mufulira", "Kasama", "Solwezi", "Chipata"],
  zw: ["Harare", "Bulawayo", "Mutare", "Gweru", "Kwekwe", "Masvingo", "Chinhoyi", "Marondera", "Victoria Falls", "Kadoma"],
  eh: ["Laâyoune", "Dakhla", "Smara", "Boujdour", "Aousserd", "Bir Gandouz", "Tichla", "Guerguerat", "Guelta Zemmur", "Farsia"]
};

function updateCityOptions() {
  const countrySelect = document.getElementById("pays");
  const cityInput = document.getElementById("ville");
  const cityOptions = document.getElementById("villeOptions");

  if (!countrySelect || !cityInput || !cityOptions) return;

  cityOptions.replaceChildren();

  const cities = africanCities[countrySelect.value] || [];

  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    cityOptions.appendChild(option);
  });
}
