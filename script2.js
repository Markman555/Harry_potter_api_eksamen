const partyContainer = document.getElementById("party-container");
const defaultImage = "./assets/Harry_Potter__Hogwarts__Castle.webp";
const optionsContainer = document.querySelector(".options-container");
const monstersContainer = document.getElementById("monsters-container");
let currentHeroIndex = 0; // Hvilken helt angriper.
// Intialiserer og fyller disse array
let heroes = [];
let spells = [];
let monsters = [];

// Helse poeng 
const studentHealthPoints = 500;
const staffHealthPoints = 800;

// Overordnet fetching av Harry Potter data
const fetchHarryPotterData = async () => {
  const students = await fetchStudents();
  const staff = await fetchStaff();

  displayStudents(students, partyContainer);
  displayStaff(staff, partyContainer);
};

const fetchStudents = async () => {
  try {
    const studentsResponse = await fetch(
      "https://hp-api.onrender.com/api/characters/students"
    );
    const students = await studentsResponse.json();
    // Henter to studenter
    return students.sort(() => 0.5 - Math.random()).slice(0, 2);
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};


const fetchStaff = async () => {
  try {
    const staffResponse = await fetch(
      "https://hp-api.onrender.com/api/characters/staff"
    );
    const staff = await staffResponse.json();
    // Henter to
    return staff.sort(() => 0.5 - Math.random()).slice(0, 2);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
};

const fetchSpells = async () => {
  try {
    const response = await fetch("https://hp-api.onrender.com/api/spells");
    spells = await response.json();
  } catch (error) {
    console.error("Error fetching spells:", error);
  }
};


const fetchMonsters = async () => {
  try {
    const response = await fetch("https://api.open5e.com/monsters/");
    const data = await response.json();

    // Henter mellom 4 og 8 monstere, tilfeldig for å gjøre det spicy
    const numberOfMonsters = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
    return data.results
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfMonsters);
  } catch (error) {
    console.error("Error fetching monsters:", error);
    return [];
  }
};

// Display students
const displayStudents = (students, container) => {
  const studentContainer = document.createElement("div");
  studentContainer.className = "character-container";

  students.forEach((student) => {
    const { name, image, yearOfBirth, house, wand } = student;
    const { wood, core, length } = wand || {
      wood: "N/A",
      core: "N/A",
      length: "N/A",
    };
    // Struktur på kort
    const studentDiv = document.createElement("div");
    studentDiv.className = "character";
    studentDiv.innerHTML = `
      <strong>Name:</strong> ${name}<br>
      <strong>Type:</strong> Student<br>
      <strong>House:</strong> ${house || "N/A"}<br>
      <strong>Year of Birth:</strong> ${yearOfBirth || "N/A"}<br>
      <strong>Wand:</strong> Wood: ${wood}, Core: ${core}, Length: ${
      length || "N/A"
    }<br>
    `;
    // Bilde til karakter
    const img = document.createElement("img");
    img.src = image || defaultImage;
    img.alt = `${name}'s Image`;
    img.style.width = "100px";
    img.style.borderRadius = "8px";
    studentDiv.appendChild(img);

    // Helse poeng
    const healthDisplay = document.createElement("div");
    healthDisplay.className = "health-display";
    healthDisplay.innerText = `${studentHealthPoints}/${studentHealthPoints}`;
    studentDiv.appendChild(healthDisplay);

    // Helse bar
    const healthBarDiv = document.createElement("div");
    healthBarDiv.className = "health-bar";
    healthBarDiv.innerHTML = `
      <div class="health-bar-fill" style="width: ${
        (studentHealthPoints / studentHealthPoints) * 100
      }%;"></div>
    `;
    studentDiv.appendChild(healthBarDiv);
    // Push inn karakter i helte array.
    heroes.push({
      name: name,
      type: "student",
      healthPoints: studentHealthPoints,
      maxHealthPoints: studentHealthPoints,
      healthBarFill: healthBarDiv.querySelector(".health-bar-fill"),
      healthDisplay: healthDisplay,
    });

    studentContainer.appendChild(studentDiv);
  });
  container.appendChild(studentContainer);
};

const displayStaff = (staff, container) => {
  const staffContainer = document.createElement("div");
  staffContainer.className = "character-container";

  staff.forEach((member) => {
    const { name, image, yearOfBirth, species, ancestry, wand, patronus } =
      member;
    const { wood, core, length } = wand || {
      wood: "N/A",
      core: "N/A",
      length: "N/A",
    };
    // Struktur på kort
    const staffDiv = document.createElement("div");
    staffDiv.className = "character";
    staffDiv.innerHTML = `
      <strong>Name:</strong> ${name}<br>
      <strong>Type:</strong> Staff<br>
      <strong>Year of Birth:</strong> ${yearOfBirth || "N/A"}<br>
      <strong>Species:</strong> ${species || "N/A"}<br>
      <strong>Ancestry:</strong> ${ancestry || "N/A"}<br>
      <strong>Wand:</strong> Wood: ${wood}, Core: ${core}, Length: ${
      length || "N/A"
    }<br>
      <strong>Patronus:</strong> ${patronus || "N/A"}<br>
    `;

    // Bilde til karakter
    const img = document.createElement("img");
    img.src = image || defaultImage;
    img.alt = `${name}'s Image`;
    img.style.width = "100px";
    img.style.borderRadius = "8px";
    staffDiv.appendChild(img);

    // Helse poeng
    const healthDisplay = document.createElement("div");
    healthDisplay.className = "health-display";
    healthDisplay.innerText = `${staffHealthPoints}/${staffHealthPoints}`;
    staffDiv.appendChild(healthDisplay);

    const healthBarDiv = document.createElement("div");
    healthBarDiv.className = "health-bar";
    healthBarDiv.innerHTML = `
      <div class="health-bar-fill" style="width: ${
        (staffHealthPoints / staffHealthPoints) * 100
      }%;"></div>
    `;
    staffDiv.appendChild(healthBarDiv);

    // Push inn i helte array
    heroes.push({
      name: member.name,
      type: "staff",
      healthPoints: studentHealthPoints,
      maxHealthPoints: studentHealthPoints,
      healthBarFill: healthBarDiv.querySelector(".health-bar-fill"),
      healthDisplay: healthDisplay,
    });

    staffContainer.appendChild(staffDiv);
  });
  container.appendChild(staffContainer);
};

// Fight knapp fetcher monstre for å sloss mot.
const fightButton = document.getElementById("fight-btn");
fightButton.addEventListener("click", async () => {
  optionsContainer.style.display = "none"; // Gjemme options meny for renere UI
  monsters = await fetchMonsters();
  displayMonsters(monsters); // Kall neste funkjon for å vise dem
});

const displayMonsters = (monsters) => {
  monstersContainer.innerHTML = ""; // Tøm tidligere innhold, kan være nødvendig, men kan også muligvis fjernes
  monstersContainer.style.display = "block"; // Endre display for å vise container med monstre

  monsters.forEach((monster) => {
    // Struktur på mosnter kort
    const monsterDiv = document.createElement("div");
    monsterDiv.className = "monster";
    monsterDiv.innerHTML = `
      <strong>Name:</strong> <span class="monster-name">${
        monster.name
      }</span><br>
      <strong class="hp">HP:</strong>
      <strong class="monster-hp">${monster.hit_points}</strong><br>
      <strong>Actions:</strong> ${monster.actions
        .map((action) => action.name)
        .join(", ")}
    `;

    // Velge monster å angripe, oppretter knapp som kjører funksjon.
    const selectButton = document.createElement("button");
    selectButton.innerText = "Select";
    selectButton.onclick = () => selectMonsterToAttack(monster);
    monsterDiv.appendChild(selectButton);

    monstersContainer.appendChild(monsterDiv);
  });
};

const selectMonsterToAttack = (monster) => {
  let currentMonster = monster; // monster som blir angrepet nå

  // Helt som gjør angrep
  let currentHero = heroes[currentHeroIndex];
  alert(`${monster.name} selected! ${currentHero.name} will attack!`);

  // Kaller funksjon for å deale damage til valgt monster
  castSpellToDamage(currentHero, currentMonster);

  // Sjekk om runden er ferdig, hvis ja er det monsterene sin tur til å angripe, kall den funksjonen og implementer logikken.
  if (currentHeroIndex === 0) {
    alert("Round complete! All heroes have attacked.");
  }
};

const castSpellToDamage = (currentHero, currentMonster) => {
  // tilfeldig spell
  const randomSpell = spells[Math.floor(Math.random() * spells.length)];

  // TIlfeldig damage mellom 20 og 150
  let randomDamage = Math.floor(Math.random() * (150 - 20 + 1)) + 20;

  // Hvis helten er stagg, legg til 10%
  if (currentHero.type === "staff") {
    randomDamage = Math.floor(randomDamage * 1.1);
  }

  // Alert om angrepet
  alert(
    `${currentHero.name} attacks ${currentMonster.name} with ${randomSpell.name} for ${randomDamage} damage!`
  );

  // Kaller funksjon for å oppdatere damage til monster
  damageToMonster(currentMonster, randomDamage);

  // Roter til neste helt etter angrep
  currentHeroIndex = (currentHeroIndex + 1) % heroes.length;

  // Indiker hvilken helt har neste tur
  alert(`It's now ${heroes[currentHeroIndex].name}'s turn!`);
};

const damageToMonster = (currentMonster, damage) => {
  // damge
  currentMonster.hit_points -= damage;

  // Finner riktig DOM element for å oppdatere HP
  const monsterDivs = document.querySelectorAll(".monster");
  monsterDivs.forEach((monsterDiv) => {
    const monsterNameElement = monsterDiv.querySelector(".monster-name"); // Henter Monster navn fra DOM for å oppdatere HP og eventuelt fjerne hvis død
    if (monsterNameElement.innerText === currentMonster.name) {
      const monsterHPElement = monsterDiv.querySelector(".monster-hp");
      monsterHPElement.innerText = currentMonster.hit_points; // Oppdaterer display av HP

      // SJekk om monster er død
      if (currentMonster.hit_points <= 0) {
        alert(`${currentMonster.name} is defeated!`);
        monsterDiv.remove(); // Fjerner monster
      }
    }
  });
};

// Monsterenes tur
const monsterRetaliate = () => {
  // Legger til loggikk
  alert(`${currentMonster.name} retaliates!`);
};


fetchHarryPotterData();
fetchSpells();
