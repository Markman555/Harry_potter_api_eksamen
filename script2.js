const partyContainer = document.getElementById("party-container");
const defaultImage = "./assets/Harry_Potter__Hogwarts__Castle.webp";
// Health
const studentHealthPoints = 500;
const staffHealthPoints = 800;

const fetchHarryPotterData = async () => {
  try {
    // Fetching students
    const studentsResponse = await fetch(
      "https://hp-api.onrender.com/api/characters/students"
    );
    const students = await studentsResponse.json();
    const randomStudents = students.sort(() => 0.5 - Math.random()).slice(0, 2);

    // Fetching staff
    const staffResponse = await fetch(
      "https://hp-api.onrender.com/api/characters/staff"
    );
    const staff = await staffResponse.json();
    const randomStaff = staff.sort(() => 0.5 - Math.random()).slice(0, 2);

    // Merging students og staff i et array
    const partyCharacters = [...randomStudents, ...randomStaff];

    // Kaller displayfunksjon
    displayCharacters(partyCharacters, partyContainer);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const displayCharacters = (characters, container) => {
  characters.forEach((character) => {
    // Destrukturering
    const { name, image, yearOfBirth } = character;
    const isStaff = character.hasOwnProperty("species"); // Sjekk om det er staff member ved å se etter property species som er unikt.

    // oppretter div element for karakterer
    const characterDiv = document.createElement("div");
    characterDiv.className = "character";

    // Navn og om de er staff eller student
    let details = `<strong>Name:</strong> ${name}<br><strong>Type:</strong> ${
      isStaff ? "Staff" : "Student"
    }<br>`;

    // Setter healthpoints basert på om de er staff eller student
    const healthPoints = isStaff ? staffHealthPoints : studentHealthPoints;

    // Flere detalsjer som avhenger av om de er staff eller student
    if (isStaff) {
      const { species, ancestry, wand, patronus } = character;
      const { wood, core, length } = wand || {
        wood: "N/A",
        core: "N/A",
        length: "N/A",
      };
      //Detaljer for staff
      details += `
                <strong>Year of Birth:</strong> ${yearOfBirth || "N/A"}<br>
                <strong>Species:</strong> ${species || "N/A"}<br>
                <strong>Ancestry:</strong> ${ancestry || "N/A"}<br>
                <strong>Wand:</strong> Wood: ${wood}, Core: ${core}, Length: ${
        length || "N/A"
      }<br>
                <strong>Patronus:</strong> ${patronus || "N/A"}<br>
            `;
    } else {
      const { house, wand } = character;
      const { wood, core, length } = wand || {
        wood: "N/A",
        core: "N/A",
        length: "N/A",
      };
      //Detaljer for students
      details += `
                <strong>House:</strong> ${house || "N/A"}<br>
                <strong>Year of Birth:</strong> ${yearOfBirth || "N/A"}<br>
                <strong>Wand:</strong> Wood: ${wood}, Core: ${core}, Length: ${
        length || "N/A"
      }<br>
            `;
    }

    characterDiv.innerHTML = details;
    // Bilde
    const img = document.createElement("img");
    img.src = image || defaultImage;
    img.alt = `${name}'s Image`;
    img.style.width = "100px";
    img.style.borderRadius = "8px";
    characterDiv.appendChild(img);

    //  Health points
    const healthDisplay = document.createElement("div");
    healthDisplay.className = "health-display";
    healthDisplay.innerText = `${healthPoints}/${
      isStaff ? staffHealthPoints : studentHealthPoints
    }`;
    characterDiv.appendChild(healthDisplay);

    // Health bar
    const healthBarDiv = document.createElement("div");
    healthBarDiv.className = "health-bar";
    healthBarDiv.innerHTML = `
            <div class="health-bar-fill" style="width: ${
              (healthPoints /
                (isStaff ? staffHealthPoints : studentHealthPoints)) *
              100
            }%;"></div>
        `;
    characterDiv.appendChild(healthBarDiv);

    container.appendChild(characterDiv);
  });
};

fetchHarryPotterData();
