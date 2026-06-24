const API_KEY = "c3a14dfb3818f3207f9261e432da2a42";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const voiceBtn = document.getElementById("voiceBtn");

const city = document.getElementById("city");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const icon = document.getElementById("icon");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const pressure = document.getElementById("pressure");
const forecastContainer = document.getElementById("forecast");
const flag = document.getElementById("flag");

const loader = document.getElementById("loader");
const themeBtn = document.getElementById("themeBtn");


async function getWeather(cityName) {

    loader.classList.remove("hidden");

    try {

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;

        const response = await fetch(weatherURL);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error("City not found");
        }

        displayWeather(data);
        getForecast(cityName);

        localStorage.setItem("lastCity", cityName);

    } catch (error) {

        alert("City not found!");

    }

    loader.classList.add("hidden");
}


function displayWeather(data) {

    city.textContent =
        `${data.name}, ${data.sys.country}`;

    flag.src =
        `https://flagsapi.com/${data.sys.country}/flat/64.png`;

    temp.textContent =
        `${Math.round(data.main.temp)}°C`;

    condition.textContent =
        data.weather[0].description;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
`   ${Math.round(data.wind.speed * 3.6)} km/h`;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

    icon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    sunrise.textContent =
        new Date(data.sys.sunrise * 1000)
        .toLocaleTimeString();

    sunset.textContent =
        new Date(data.sys.sunset * 1000)
        .toLocaleTimeString();

    changeBackground(
        data.weather[0].main
    );
}


function changeBackground(weather) {

    if (weather === "Clear") {

        document.body.style.background =
            "linear-gradient(135deg,#f6d365,#fda085)";

    }

    else if (weather === "Rain") {

        document.body.style.background =
            "linear-gradient(135deg,#0f2027,#203a43,#2c5364)";

    }

    else if (weather === "Clouds") {

        document.body.style.background =
            "linear-gradient(135deg,#bdc3c7,#2c3e50)";

    }

    else if (weather === "Thunderstorm") {

        document.body.style.background =
            "linear-gradient(135deg,#141e30,#243b55)";

    }

    else if (weather === "Snow") {

        document.body.style.background =
            "linear-gradient(135deg,#e6dada,#274046)";

    }

    else {

        document.body.style.background =
            "linear-gradient(135deg,#4facfe,#00f2fe)";
    }
}



async function getForecast(cityName) {

    const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    forecastContainer.innerHTML = "";

    const daily =
        data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

    daily.forEach(day => {

        const card =
            document.createElement("div");

        card.classList.add("forecast-card");

        card.innerHTML = `
            <h3>
            ${new Date(day.dt_txt).toLocaleDateString(
                "en-US",
                { weekday: "short" }
            )}
            </h3>

            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

            <p>${Math.round(day.main.temp)}°C</p>

            <p>${day.weather[0].main}</p>
        `;

        forecastContainer.appendChild(card);
    });
}


searchBtn.addEventListener("click", () => {

    if (cityInput.value.trim() !== "") {

        getWeather(cityInput.value);

    }
});

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        getWeather(cityInput.value);

    }
});


locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(
        async position => {

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;

            const url =
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

            const response =
                await fetch(url);

            const data =
                await response.json();

            displayWeather(data);

            getForecast(data.name);
        }
    );
});


if ('webkitSpeechRecognition' in window) {

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {

        try {

            voiceBtn.innerHTML =
                '<i class="fa-solid fa-microphone-lines"></i>';

            recognition.start();

        } catch (error) {

            console.log(error);

        }

    });

    recognition.onresult = (event) => {

        const cityName =
            event.results[0][0].transcript;

        console.log("Heard:", cityName);

        cityInput.value = cityName;

        getWeather(cityName);

    };

    recognition.onend = () => {

        voiceBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i>';

    };

    recognition.onerror = (event) => {

        console.log("Speech Error:", event.error);

        voiceBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i>';

        if (event.error === "no-speech") {

            alert("No speech detected. Click the microphone and speak immediately.");

        }

    };

} else {

    voiceBtn.style.display = "none";

}


function updateClock() {

    const now = new Date();

    document.getElementById("clock")
        .textContent =
        now.toLocaleString();
}

setInterval(updateClock, 1000);

updateClock();

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    }

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );
});

if (localStorage.getItem("theme") === "true") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';
}


const savedCity =
    localStorage.getItem("lastCity");

if (savedCity) {

    getWeather(savedCity);

} else {

    getWeather("Mumbai");
}