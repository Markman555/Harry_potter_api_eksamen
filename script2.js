const partyContainer = document.getElementById("party-container");
const defaultImage = "./assets/Harry_Potter__Hogwarts__Castle.webp";
const optionsContainer = document.querySelector(".options-container");
const monstersContainer = document.getElementById("monsters-container");

let spells = [];
// Health
const studentHealthPoints = 500;
const staffHealthPoints = 800;

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

    // Generate a random number between 4 and 8
    const numberOfMonsters = Math.floor(Math.random() * (8 - 4 + 1)) + 4;

    // Slice the number of monsters based on the random number
    return data.results
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfMonsters);
  } catch (error) {
    console.error("Error fetching monsters:", error);
    return [];
  }
};

const displayStudents = (students, container) => {
  const studentContainer = document.createElement("div");
  studentContainer.className = "character-container";

  students.forEach((student) => {
    // Destrukturer
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

    // Bilde til karakterer
    const img = document.createElement("img");
    img.src = image || defaultImage;
    img.alt = `${name}'s Image`;
    img.style.width = "100px";
    img.style.borderRadius = "8px";
    studentDiv.appendChild(img);

    //Helse poeng
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

    // Angrep knapp
    const attackButton = document.createElement("button");
    attackButton.innerText = "Attack";
    attackButton.onclick = () => performAttack(name, "student");
    studentDiv.appendChild(attackButton);

    studentContainer.appendChild(studentDiv);

    studentContainer.appendChild(studentDiv);
  });
  container.appendChild(studentContainer);
};

const displayStaff = (staff, container) => {
  const staffContainer = document.createElement("div");
  staffContainer.className = "character-container";

  staff.forEach((member) => {
    //Destrukturer
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
    // Helse bar
    const healthBarDiv = document.createElement("div");
    healthBarDiv.className = "health-bar";
    healthBarDiv.innerHTML = `
      <div class="health-bar-fill" style="width: ${
        (staffHealthPoints / staffHealthPoints) * 100
      }%;"></div>
    `;
    staffDiv.appendChild(healthBarDiv);

    // Angrep knapp
    const attackButton = document.createElement("button");
    attackButton.innerText = "Attack";
    attackButton.onclick = () => performAttack(name, "staff");
    staffDiv.appendChild(attackButton);

    staffContainer.appendChild(staffDiv);
  });
  container.appendChild(staffContainer);
};

const fightButton = document.getElementById("fight-btn");
fightButton.addEventListener("click", async () => {
  // Gjemmer options meny for å kun vise monstere. Spilleren må bekjempe dem for å komme tilbake til menyen.
  optionsContainer.style.display = "none";

  // fetcher monstere når de trykker
  const monsters = await fetchMonsters();
  displayMonsters(monsters);
});

const displayMonsters = (monsters) => {
  monstersContainer.innerHTML = ""; // Tøm tidligere monstere
  monstersContainer.style.display = "block"; //Gjør monster container synlig nå

  monsters.forEach((monster) => {
    console.log(`Rendering monster ${monster.name}, HP: ${monster.hit_points}`); // Log each monster's HP before rendering

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
    monstersContainer.appendChild(monsterDiv);
  });
};

const performAttack = (attackerName, attackerType) => {
  // Velger en random spell for hver gang.
  const randomSpell = spells[Math.floor(Math.random() * spells.length)];

  // Spells gjør en random damage, men setter bunn og topp grense
  let randomDamage = Math.floor(Math.random() * (180 - 30 + 1)) + 30;

  // Hvis karakter er staff legger vi til 10% på damage
  if (attackerType === "staff") {
    randomDamage = Math.floor(randomDamage * 1.1);
  }
  // Varsel om angrepet utført
  alert(`${attackerName} used ${randomSpell.name}`);

  // Hent fra monster arrayet
  const monsters = Array.from(monstersContainer.children).map(
    (monsterDiv, index) => {
      const monsterName = monsterDiv.querySelector(".monster-name").innerText;
      const monsterHPElement = monsterDiv.querySelector(".monster-hp");

      let monsterHP = 0;

      monsterHP = Number(monsterHPElement.innerText);

      return {
        name: monsterName,
        hit_points: monsterHP,
      };
    }
  );

  // Deal damage to a random monster
  damageToMonster(monsters, randomDamage);
};

const damageToMonster = (monsters, damage) => {
  // Velger random mosnter
  const randomMonsterIndex = Math.floor(Math.random() * monsters.length);
  const monster = monsters[randomMonsterIndex];

  // damage
  monster.hit_points -= damage;

  // Oppdater monster display
  const monsterDiv = document.querySelector(
    `.monster:nth-child(${randomMonsterIndex + 1})`
  );
  const monsterHPElement = monsterDiv.querySelector(".monster-hp");
   monsterHPElement.innerText = monster.hit_points; 

  // Alert om damage dealt. Fiks at det ikke står - health, når de går under 0
  alert(
    `${monster.name} was dealt ${damage} damage! Remaining HP: ${monster.hit_points}`
  );

  // Sjekk om monster er død
  if (monster.hit_points <= 0) {
    alert(`${monster.name} is defeated!`);
    monsterDiv.remove(); // Hvis død, fjern fra display
  }
};

// Jobber med disse funksjonene etterhvert.
/*
const fightMonsters = async (monsters) => {
  while (monsters.length > 0) {
 

    // Check if all monsters are defeated
    if (monsters.length === 0) {
      alert("All monsters defeated! Victory!");
      endCombat();
    }
  }
};
*/
/*
const endCombat = () => {
  monstersContainer.style.display = "none"; // Hide monsters container
  optionsContainer.querySelector(".box").style.display = "block"; // Show options menu again
};

*/

fetchHarryPotterData();
fetchSpells();
