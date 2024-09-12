async function getAnimeList() {
  try {
    const response = await axios.get(
      "https://www.animenewsnetwork.com/encyclopedia/reports.xml?id=155"
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

async function getAnimeById(id) {
  try {
    const response = await axios.get(
      "https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=" + id
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

getAnimeList();
//getAnimeById(33506);
