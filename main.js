const url = "https://cdn.animenewsnetwork.com/encyclopedia";

async function getAnimeList() {
  const myHeaders = new Headers();
  myHeaders.append(
    "Cookie",
    "ann5_session_id=NxvNxor7b8w0hkTvNIJv30NQYuJEgjua-1726154526912"
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(url + "/reports.xml?id=172", requestOptions);
    const xmlString = await response.text(); // Await the fetch and conversion to text
    return xmlString; // Return the XML string after the fetch is complete
  } catch (error) {
    console.error("Error fetching anime list:", error);
    return null; // Return null or handle the error appropriately
  }
}

async function getAnimeIds() {
  const animeList = await getAnimeList();

  // Parse the XML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(animeList, "application/xml");

  // Get all <item> elements
  const items = xmlDoc.getElementsByTagName("item");

  // Extract the <id> values
  const ids = [];
  for (let i = 0; i < items.length; i++) {
    ids.push(items[i].id);
  }

  return ids;
}

async function getAnimeById(id) {
  const myHeaders = new Headers();
  myHeaders.append(
    "Cookie",
    "ann5_session_id=NxvNxor7b8w0hkTvNIJv30NQYuJEgjua-1726154526912"
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(url + "/api.xml?anime=" + id, requestOptions);
    const xmlString = await response.text(); // Await the fetch and conversion to text
    return xmlString; // Return the XML string after the fetch is complete
  } catch (error) {
    console.error("Error fetching anime list:", error);
    return null; // Return null or handle the error appropriately
  }
}

async function gatAnimeObject(animeXML) {
  const parser = new DOMParser();
  const xmlDoc = await parser.parseFromString(animeXML, "application/xml");

  const anime = { name: "", img: "", plot: "" };

  const nameXML = xmlDoc.getElementsByTagName("anime");
  anime.name = nameXML[0].getAttribute("name");

  const imgXML = xmlDoc.getElementsByTagName("img");
  anime.img = imgXML[imgXML.length - 1].getAttribute("src");

  const infoXML = xmlDoc.getElementsByTagName("info");
  for (let i = 0; i < infoXML.length; i++) {
    if (infoXML[i].getAttribute("type") === "Plot Summary")
    {
      anime.plot = infoXML[i].innerHTML;
      break;
    }
  }
  
  return anime;
}

async function generateHTML(anime) {
  const cardHTML = document.querySelector(".card")

  const cardSection = document.createElement("section")
  cardSection.classList.add("card__animelist");
  
  const cardRow = document.createElement("div")
  cardRow.classList.add("card__row");

  const cardImg = document.createElement("img")
  cardImg.classList.add("card__image");
  cardImg.src = anime.img;
  cardSection.appendChild(cardImg);

  const cardName = document.createElement("h2")
  cardName.classList.add("card__name");
  cardName.innerText = anime.name;
  cardSection.appendChild(cardName);

  cardHTML.appendChild(cardSection);
}

async function getEachAnime() {
  const idList = await getAnimeIds();
  const animeList = [];

  idList.forEach(async (id) => {
    setTimeout(async () => {
      const anime = await getAnimeById(id);
      animeList.push(await gatAnimeObject(anime));
      generateHTML(await gatAnimeObject(anime));
      
    }, 1000);
  });

  console.log(animeList);
  return animeList;
}

getEachAnime();
