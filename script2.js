const partyContainer = document.getElementById("party-container");
const defaultImage = "./assets/Harry_Potter__Hogwarts__Castle.webp";
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

const displayMonsters = (monsters) => {
  const monstersContainer = document.getElementById("monsters-container");
  monstersContainer.innerHTML = ""; // Tøm tidligere monstere

  monsters.forEach((monster) => {
    const monsterDiv = document.createElement("div");
    monsterDiv.className = "monster";
    monsterDiv.innerHTML = `
      <strong>Name:</strong> ${monster.name}<br>
      <strong>HP:</strong> ${monster.hit_points}<br>
      <strong>Armor Class:</strong> ${monster.armor_class}<br>
      <strong>Challenge Rating:</strong> ${monster.challenge_rating}<br>
      <strong>Actions:</strong> ${monster.actions
        .map((action) => action.name)
        .join(", ")}
    `;
    monstersContainer.appendChild(monsterDiv);
  });
};

const fightButton = document.getElementById("fight-btn");
fightButton.addEventListener("click", async () => {
  const monsters = await fetchMonsters();
  displayMonsters(monsters);
});

fetchHarryPotterData();
fetchMonsters();
fetchSpells();
