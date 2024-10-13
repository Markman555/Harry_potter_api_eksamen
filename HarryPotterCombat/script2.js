const partyContainer = document.getElementById("party-container");
const defaultImage =
  "../HarryPotterCombat/assets/Harry_Potter__Hogwarts__Castle.webp";
const optionsContainer = document.querySelector(".options-container");
const monstersContainer = document.getElementById("monsters-container");
const upgradesContainer = document.getElementById("upgrades-container");
let currentHeroIndex = 0; // Hvilken helt angriper.
let difficultyLevel = 10;
let minDamage = 0;
let maxDamage = 80;
// Intialiserer og fyller disse array
let xp = 150; // total xp til spiller
let unlockedSpells = []; // legger til funksjonalitet for å unlocke spells
let basicSpells = []; // de som spilleren har
let allSpells = []; // Alle spells fetchet fra api
let gameWon = false;
let heroes = [];
let spells = [];
let monsters = [];
let monsterIdCounter = 1;

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
    // Henter to lærere
    return staff.sort(() => 0.5 - Math.random()).slice(0, 2);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
};

const fetchSpells = async () => {
  try {
    const response = await fetch("https://hp-api.onrender.com/api/spells");
    const fetchedSpells = await response.json();

    // Starter med 3 basic spells
    basicSpells = fetchedSpells.slice(0, 3);
    unlockedSpells = [...basicSpells];

    allSpells = fetchedSpells.map((spell) => ({
      name: spell.name,
      description: spell.description, // Add description from the API
    }));
  } catch (error) {
    console.error("Error fetching spells:", error);
  }
};

const fetchMonsters = async (difficultyLevel) => {
  try {
    const totalPages = 65; // antall sider i api data
    const numberOfPagesToFetch = 5; // antall sider for å få litt variasjon, men ikke for mange sånn at lastetiden er for lang
    let allMonsters = [];

    // array.from metoden for å lage et array ut av objekter som ligner array
    const selectedPages = Array.from(
      { length: numberOfPagesToFetch },
      () => Math.floor(Math.random() * totalPages) + 1
    );

    // Fetcher monstre fra de sider
    for (const page of selectedPages) {
      const response = await fetch(
        `https://api.open5e.com/monsters/?page=${page}`
      );
      const data = await response.json();

      // Filtrere ut fra challenge rating som øker hver gang heltene vinner
      const filteredMonsters = data.results.filter(
        (monster) => parseFloat(monster.challenge_rating) <= difficultyLevel
      );

      allMonsters = allMonsters.concat(filteredMonsters);
    }

    // tilfeldig velger mellom 4 og 8 monstre
    const numberOfMonsters = Math.floor(Math.random() * 5) + 4;
    const selectedMonsters = allMonsters
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfMonsters) // Metoder for å gjøre det random om det er 4 eller 8
      .map((monster) => ({
        ...monster,
        uniqueId: monsterIdCounter++, // Gir en unik id hvis jeg får monstre med samme navn
      }));

    return selectedMonsters;
  } catch (error) {
    console.error("Error fetching monsters:", error);
    return [];
  }
};

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
      healthPoints: staffHealthPoints,
      maxHealthPoints: staffHealthPoints,
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
  gameWon = false; // reset spill
  currentHeroIndex = 0;
  optionsContainer.style.display = "none"; // Gjemme options meny for renere UI
  monsters = await fetchMonsters(difficultyLevel);
  displayMonsters(monsters); // Kall neste funkjon for å vise dem
});

const upgradesButton = document.getElementById("upgrades-btn");

upgradesButton.addEventListener("click", () => {
  showUpgradesMenu();
});

const showUpgradesMenu = () => {
  optionsContainer.style.display = "none"; // Gjemmer options menu, legg til en knapp for å gå tilbaek
  upgradesContainer.style.display = "block";
  upgradesContainer.style.width = "30%";

  // Tilbake til options meny
  const returnButton = document.createElement("button");
  returnButton.innerText = "Return to Menu";
  returnButton.onclick = () => {
    upgradesContainer.style.display = "none";
    optionsContainer.style.display = "block";
  };
  upgradesContainer.appendChild(returnButton);

  // Filtrere vekk spells allerede kjøpt
  const upgradeOptions = allSpells.filter(
    (spell) => !unlockedSpells.includes(spell)
  );

  const upgradesDiv = document.createElement("div");
  upgradesDiv.className = "upgrade-menu";
  // Kommer til å justere på dette senere, men for nå er dette bra nok
  upgradeOptions.forEach((spell) => {
    const spellDiv = document.createElement("div");
    spellDiv.innerHTML = `
      <strong>Spell:</strong> ${spell.name}<br>
       <strong>Description:</strong> ${spell.description}<br>
      <strong>Cost:</strong> 100 XP<br>
    `;

    const buyButton = document.createElement("button");
    buyButton.innerText = "Buy";
    buyButton.disabled = xp < 100; // Sørg for de har nok xp
    buyButton.onclick = () => buySpell(spell, spellDiv); // Kalle funksjon for å unlocke spell valgt

    spellDiv.appendChild(buyButton);
    upgradesDiv.appendChild(spellDiv);
  });

  upgradesContainer.appendChild(upgradesDiv);
};

const buySpell = (spell, spellDiv) => {
  if (xp >= 100) {
    xp -= 100; // xp
    unlockedSpells.push(spell); // push inn spell i array
    allSpells = allSpells.filter((s) => s !== spell); //Fjern spell fra all spells etter det er kjøpt
    maxDamage += 5; // Når bruker kjøper spell øker max damage til heltene
    alert(`You unlocked the spell: ${spell.name}! Remaining XP: ${xp}`);
     alert(`You can now do damage up to ${maxDamage}.`);
    spellDiv.remove();
  }
};

const displayMonsters = (monsters) => {
  monstersContainer.innerHTML = ""; // Tøm tidligere innhold, kan være nødvendig, men kan også muligvis fjernes
  monstersContainer.style.display = "block"; // Endre display for å vise container med monstre

  monsters.forEach((monster) => {
    // Struktur på mosnter kort
    const monsterDiv = document.createElement("div");
    monsterDiv.className = "monster";
    monsterDiv.id = `monster-${monster.uniqueId}`; // Unik ID for Dom element. Dette er for å kunne ha flere monster med samme navn uten å skape problemer
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

  if (gameWon || currentHeroIndex >= heroes.length) {
    return;
  }

  // Helt som gjør angrep
  let currentHero = heroes[currentHeroIndex];
  alert(`${monster.name} selected! ${currentHero.name} will attack!`);

  // Kaller funksjon for å deale damage til valgt monster
  castSpellToDamage(currentHero, currentMonster);

  // Sjekk om runden er ferdig, hvis ja er det monsterene sin tur til å angripe, kall den funksjonen og implementer logikken.
  if (!gameWon && currentHeroIndex === 0) {
    alert("Round complete! All heroes have attacked.");
    monsterRetaliate();
  }
};

const castSpellToDamage = (currentHero, currentMonster) => {
  console.log(
    `Selected monster: ${currentMonster.name} with ID: ${currentMonster.uniqueId}`
  );
  // tilfeldig spell
  const randomSpell =
    unlockedSpells[Math.floor(Math.random() * unlockedSpells.length)];

  // TIlfeldig damage mellom 20 og 150
   let randomDamage =
     Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;

  // Hvis helten er staff, legg til 10%
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

  // Indiker hvilken helt har neste tur, lag en sjekk om runden er ferdig, så denne alerten ikke kjører i det tilfellet
  if (!gameWon && currentHeroIndex !== 0) {
    alert(`It's now ${heroes[currentHeroIndex].name}'s turn!`);
  }
};
const damageToMonster = (currentMonster, damage) => {
  console.log(`Dealing ${damage} damage to ${currentMonster.name}`);

  // Damage calculation
  currentMonster.hit_points -= damage;

  // Finner riktig DOM element for å oppdatere HP
  const monsterDiv = document.getElementById(
    `monster-${currentMonster.uniqueId}`
  ); // Access the specific monster using its unique ID
  const monsterHPElement = monsterDiv.querySelector(".monster-hp");
  monsterHPElement.innerText = currentMonster.hit_points; // Oppdaterer display av HP

  // SJekk om monster er død
  if (currentMonster.hit_points <= 0) {
    alert(
      `${currentMonster.name} is defeated! You earned 50 XP! Total XP: ${xp}`
    );
    monsterDiv.remove(); // Fjerner monster from the DOM
    monsters = monsters.filter(
      (monster) => monster.uniqueId !== currentMonster.uniqueId
    ); // Fjern monster fra array
    xp += 50; // xp reward

    // SJekk om alle monstere er døde
    checkForWin();
  }
};

const monsterRetaliate = () => {
  alert("Monsters are retaliating!");

  monsters.forEach((monster) => {
    if (heroes.length === 0) {
      alert("All heroes have been defeated! Game over.");
      resetGame(); // Legge til funksjonalitet for game over state
      return;
    }
    // må parse challenge rating for å ikke få NaN
    const challengeRating = parseFloat(monster.challenge_rating);
    // Hver monster angriper en helt
    const randomHeroIndex = Math.floor(Math.random() * heroes.length);
    const randomHero = heroes[randomHeroIndex];

    // Damage scaling, men fortsatt også et tilfeldig nummer
    const baseDamage = 50;
    const randomDamage =
      Math.floor(Math.random() * baseDamage) + challengeRating * 10;

    // Damage til helt, Heltens hp skal ikke gå under 0
    randomHero.healthPoints -= randomDamage;
    randomHero.healthPoints = Math.max(0, randomHero.healthPoints);

    // Oppdater helts helse status basert på om de er staff eller student
    if (randomHero.type === "student") {
      updateStudentHealthDisplay(randomHero);
    } else if (randomHero.type === "staff") {
      updateStaffHealthDisplay(randomHero);
    }

    // Alert om damage dealet
    alert(
      `${monster.name} attacks ${randomHero.name} for ${randomDamage} damage! Remaining HP: ${randomHero.healthPoints}`
    );

    // Hvis helt dør, fjern fra array. DOM manipulasjon fungerer ikke
    if (randomHero.healthPoints <= 0) {
      alert(`${randomHero.name} has been defeated!`);
      const randomHeroElement = document.getElementById(randomHero.name);
      if (randomHeroElement) randomHeroElement.remove();

      heroes.splice(randomHeroIndex, 1);
    }
  });

  // Signaliser at det nå er heltenes tur
  if (heroes.length !== 0) {
    alert("All enemies have attacked, it is now the heroes' turn.");
  }

  // Reset
  currentHeroIndex = 0;
};

const updateStudentHealthDisplay = (student) => {
  // Helse poeng
  student.healthDisplay.innerText = `${student.healthPoints}/${studentHealthPoints}`;

  // Bredden på baren
  const healthPercentage = (student.healthPoints / studentHealthPoints) * 100;
  student.healthBarFill.style.width = `${healthPercentage}%`;
};

const updateStaffHealthDisplay = (staff) => {
  // Helse poeng oppdateres
  staff.healthDisplay.innerText = `${staff.healthPoints}/${staffHealthPoints}`;

  // Bredde på baren oppdateres
  const healthPercentage = (staff.healthPoints / staffHealthPoints) * 100;
  staff.healthBarFill.style.width = `${healthPercentage}%`;
};

const checkForWin = () => {
  if (monsters.length === 0) {
    alert("The heroes have defeated all the monsters! They win!");
    monstersContainer.style.display = "none"; // Gjem monster container når spiller vinner
    optionsContainer.style.display = "block"; // Vis options meny
    // Øk vanskelig for neste runde
    difficultyLevel += 1;
    alert(`Difficulty increased to CR ${difficultyLevel}.`);

    heroes.forEach((hero) => {
      hero.healthPoints = hero.maxHealthPoints; // Reset helse poeng

      // Oppdater
      hero.healthDisplay.innerText = `${hero.maxHealthPoints}/${hero.maxHealthPoints}`;

      // Reset bar til 100%
      hero.healthBarFill.style.width = "100%";
    });

    gameWon = true; // Spillet er vunnet nå
  }
};

fetchHarryPotterData();
fetchSpells();
