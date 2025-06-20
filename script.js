// Get DOM elements
const capital = document.getElementById('capital');
const population = document.getElementById('population');
const Languages = document.getElementById('languages');
const region = document.getElementById('region');
const flag = document.getElementById('flag');
const borderingList = document.getElementById('bordering-list');
const loadingIndicator = document.getElementById('loading');
const errorContainer = document.getElementById('error');
const UNSPLASH_ACCESS_KEY = 'n8u3vOd_da4FxFFdsc6aHQpksbrWOtlH4geqBBMThq0';

document.getElementById('submit-btn').addEventListener('click', async function() {
    const countryname = document.getElementById('country-name').value.trim();
    clearDisplay();
    
    if (!countryname) {
        displayError('Please enter a country name.');
        return;
    }

    showLoading('Loading...');

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryname}`);
        if (!response.ok) {
            throw new Error('Country not found. Check the spelling and try again.');
        }

        const json = await response.json();
        const countryInfo = json[0];

        renderCountryInfo(countryInfo);
    } catch (error) {
        displayError(error.message);
    } finally {
        hideLoading();
    }
});

function clearDisplay() {
    capital.textContent = '';
    population.textContent = '';
    region.textContent = '';
    flag.innerHTML = '';
    errorContainer.textContent = '';
}

function showLoading(message) {
    loadingIndicator.textContent = message;
}

function hideLoading() {
    loadingIndicator.textContent = '';
}

function displayError(message) {
    errorContainer.textContent = message;
}



async function renderCountryInfo(countryInfo) {
    capital.textContent = countryInfo.capital ? countryInfo.capital.join(', ') : 'N/A';
    Languages.textContent =countryInfo.languages ? Object.values(countryInfo.languages).join(', ') : 'N/A';
    population.textContent = countryInfo.population ? countryInfo.population.toLocaleString() : 'N/A';
    region.textContent = countryInfo.region || 'N/A';
    flag.innerHTML = `<img src="${countryInfo.flags.svg}" alt="Flag of ${countryInfo.name.common}" />`;

    const map = L.map('map').setView(countryInfo.latlng, 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker(countryInfo.latlng).addTo(map)
    .bindPopup(`${countryInfo.name.common}`)
    .openPopup();


    try {
        const imageResponse = await fetch(`https://api.unsplash.com/search/photos?query=${countryInfo.name.common}&client_id=${UNSPLASH_ACCESS_KEY}`);
        const imageData = await imageResponse.json();
        const imageUrl = imageData.results[0]?.urls?.regular;
        const imageUrl2 = imageData.results[1]?.urls?.small;
        const imageUrl3 = imageData.results[2]?.urls?.small;

        if (imageUrl) {
            document.getElementById('country-photo').src = imageUrl;
            document.getElementById('country-photo2').src = imageUrl2;
            document.getElementById('country-photo3').src = imageUrl3;
        } else {
            document.getElementById('country-photo').alt = 'No image found';
            document.getElementById('country-photo2').alt = 'No image found';
            document.getElementById('country-photo3').alt = 'No image found';
        }
    } catch (imgError) {
        console.error('Error fetching image:', imgError);
        document.getElementById('country-photo').alt = 'Image unavailable';
        document.getElementById('country-photo2').alt = 'Image unavailable';
        document.getElementById('country-photo3').alt = 'Image unavailable';
    }
}

/*async function fetchTouristAttractions(country) {
  let url = `https://en.wikipedia.org/api/rest_v1/page/summary/List_of_tourist_attractions_in_${country}`;
  let response = await fetch(url);

  if (!response.ok) {
    // fallback to general tourism page if the specific list page doesn't exist
    url = `https://en.wikipedia.org/api/rest_v1/page/summary/Tourism_in_${country}`;
    response = await fetch(url);
  }

  if (response.ok) {
    const data = await response.json();
    return data.extract;
  } else {
    return 'No tourist attraction information found.';
  }
}*/



