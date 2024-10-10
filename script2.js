const partyContainer = document.getElementById("party-container");
const defaultImage = "./assets/Harry_Potter__Hogwarts__Castle.webp";
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

    const img = document.createElement("img");
    img.src = image || defaultImage;
    img.alt = `${name}'s Image`;
    img.style.width = "100px";
    img.style.borderRadius = "8px";
    studentDiv.appendChild(img);

    const healthDisplay = document.createElement("div");
    healthDisplay.className = "health-display";
    healthDisplay.innerText = `${studentHealthPoints}/${studentHealthPoints}`;
    studentDiv.appendChild(healthDisplay);

    const healthBarDiv = document.createElement("div");
    healthBarDiv.className = "health-bar";
    healthBarDiv.innerHTML = `
      <div class="health-bar-fill" style="width: ${
        (studentHealthPoints / studentHealthPoints) * 100
      }%;"></div>
    `;
    studentDiv.appendChild(healthBarDiv);

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

    const img = document.createElement("img");
    img.src = image || defaultImage;
    img.alt = `${name}'s Image`;
    img.style.width = "100px";
    img.style.borderRadius = "8px";
    staffDiv.appendChild(img);

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

    staffContainer.appendChild(staffDiv);
  });
  container.appendChild(staffContainer);
};

fetchHarryPotterData();
