console.log("index is connected now");

//////////////////////////////////////////////////////////

document.getElementById('loginButton').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === '' || password !== '123456') {
    alert('Please enter a valid name and password.');
    return;
  }

  alert('Login successful!');

  // Hide banner section
  document.querySelector('section').style.display = 'none';

  // Show navbar
  document.querySelector('header nav').classList.remove('hidden');

  // Show vocabulary and FAQ section (it's inside the 2nd <div class="hidden">)
  document.querySelectorAll('div.hidden').forEach((div) => {
    div.classList.remove('hidden');
  });
});

/////////////////////////////////////////////////////////////

// Handle Logout
document.getElementById("logoutBtn").addEventListener("click", function () {
  document.getElementById("navbar").classList.add("hidden");
  document.getElementById("vocabulary-section").classList.add("hidden");
  document.getElementById("faq-section").classList.add("hidden");

  // Show banner and footer
  document.getElementById("banner").classList.remove("hidden");
  document.getElementById("footer").classList.remove("hidden");
});

// Smooth scroll to FAQ
document.getElementById("faqBtn").addEventListener("click", function () {
  document.getElementById("faq-section").classList.remove("hidden");
  document.getElementById("faq-section").scrollIntoView({ behavior: "smooth" });
});

// Smooth scroll to Learn (vocabulary)
document.getElementById("learnBtn").addEventListener("click", function () {
  document.getElementById("vocabulary-section").classList.remove("hidden");
  document.getElementById("vocabulary-section").scrollIntoView({ behavior: "smooth" });
});

/////////////////////////////////////////////////////////////////////////////


const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("video-container").classList.add("hidden");
};
const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("video-container").classList.remove("hidden");
};

////////////////////////////////////////////////////////////////////////////////

function loadData() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayData(data));
}

///////////////////////////////////////////////////////////////////////

const loadVocabulary = (id) => {
  showLoader()

  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // Hide default message if any
      const defaultMsg = document.getElementById("default-message");
      if (defaultMsg) {
        defaultMsg.style.display = "none";
      }

      // Remove all active buttons first
      const allButtons = document.querySelectorAll("button[id^='btn-']");
      allButtons.forEach((btn) => btn.classList.remove("active"));

      // Activate clicked button
      const clickedButton = document.getElementById(`btn-${id}`);
      clickedButton.classList.add("active");

      // Now pass actual data to display
      displayVideos(data.data);
    });
};

const displayVideos = (data) => {
  const dataArrays = data;
  const videoContainer = document.getElementById("video-container");

  videoContainer.innerHTML = "";

  if (!dataArrays || dataArrays.length === 0) {
    videoContainer.innerHTML = `
      <div class="col-span-full flex justify-center items-center flex-col bg-slate-100 py-16 w-11/12 mx-auto">
        <img src="./assets/alert-error.png" alt="">
        <h5 class="text-[14px] text-gray-500 mb-2">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি!</h5>
        <h1 class="font-semibold text-[30px] text-gray-700 ">নেক্সট Lesson এ যান</h1>
      </div>
    `;
    hideLoader();
    return;
  }
  ///////////////////////////////////////////////////////

  // modal section
  dataArrays.forEach((datas) => {
    const word = datas.word || "অনুসন্ধান পাওয়া যায়নি";
    const meaning = datas.meaning || "অনুসন্ধান পাওয়া যায়নি";
    const pronunciation = datas.pronunciation || "অনুসন্ধান পাওয়া যায়নি";

    const videoItem = document.createElement("div");
    videoItem.innerHTML = `
      <div class="card bg-white text-black shadow-md">
        <div class="card-body items-center text-center py-6">
          <h2 class="card-word font-bold text-2xl">${word}</h2>
          <p class="card-meaning mt-2">Meaning / Pronunciation</p>
          <h1 class="card-pronunciation font-semibold text-[18px] my-2">${meaning} / ${pronunciation}</h1>
          <div class="card-actions flex justify-between w-full px-2 mt-4">
            <button onclick=loadVocabularyDetails('${datas.id}') class="btn btn-outline btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" 
                stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </button>
            <button class="btn btn-outline btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
               fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 9v6h4l5 5V4l-5 5H5z"/>
                <path d="M15.54 8.46a5 5 0 010 7.07M18.36 5.64a9 9 0 010 12.72"
                 stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    videoContainer.append(videoItem);
  });
  hideLoader();
};

///////////////////////////////////////////////////////////////
// card section

const loadVocabularyDetails = (vocabularyId) => {
  const url = `https://openapi.programming-hero.com/api/word/${vocabularyId}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const vocab = data.data;

      const word = vocab.word || "অনুসন্ধান পাওয়া যায়নি";
      const pronunciation = vocab.pronunciation || "অনুসন্ধান পাওয়া যায়নি";
      const sentence = vocab.sentence || "অনুসন্ধান পাওয়া যায়নি";

      document.getElementById("modal-word").textContent = word;
      document.getElementById(
        "modal-pronunciation"
      ).textContent = `উচ্চারণ: ${pronunciation}`;
      document.getElementById(
        "modal-example"
      ).textContent = `উদাহরণ: ${sentence}`;

      const synonymContainer = document.getElementById("modal-synonyms");
      synonymContainer.innerHTML = "";

      if (Array.isArray(vocab.synonyms) && vocab.synonyms.length > 0) {
        vocab.synonyms.forEach((syn) => {
          const btn = document.createElement("button");
          btn.className =
            "btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200 mr-2 mb-2";
          btn.textContent = syn;
          synonymContainer.appendChild(btn);
        });
      } else {
        synonymContainer.textContent = "অনুসন্ধান পাওয়া যায়নি ..";
      }

      document.getElementById("vocabulary_details").showModal();
    })
    .catch((error) => {
      console.error("Error loading details:", error);
      document.getElementById("modal-word").textContent =
        "অনুসন্ধান পাওয়া যায়নি";
      document.getElementById("modal-pronunciation").textContent =
        "উচ্চারণ: অনুসন্ধান পাওয়া যায়নি";
      document.getElementById("modal-example").textContent =
        "উদাহরণ: অনুসন্ধান পাওয়া যায়নি";
      document.getElementById("modal-synonyms").textContent =
        "অনুসন্ধান পাওয়া যায়নি";
      document.getElementById("vocabulary_details").showModal();
    });
};

//////////////////////////////////////////////////////////////////////////
function displayData(data) {
  console.log(data);

  const dataArray = data.data; // adjust based on actual structure
  const dataContainer = document.getElementById("data-container");

  for (let dat of dataArray) {
    console.log(dat);

    const dataDiv = document.createElement("div");

    dataDiv.innerHTML = `
  <button 
    id="btn-${dat.level_no}" 
    onclick="loadVocabulary(${dat.level_no})" 
    class="btn btn-sm border-blue-600
      text-blue-60 flex items-center gap-2 text-xs 
      rounded-sm font-semibold border-2 my-7 text-blue-600
      hover:text-white hover:bg-blue-400 hover:border-none
      transition-colors duration-600">

    <span>
      <img class="hover:text-white transition-colors duration-600"
        src="./assets/fa-book-open.png" alt="" />
    </span>
    Lesson-${dat.level_no}
  </button>
`;

    dataContainer.append(dataDiv);
  }
}

loadData();

// {
//   "id": 106,
//   "level_no": 6,
//   "lessonName": "Mastering Vocabulary"
// }

// {
//   "id": 115,
//   "level": 5,
//   "word": "Eloquent",
//   "meaning": "প্রभावশালী",
//   "pronunciation": "এলোকুয়েন্ট"