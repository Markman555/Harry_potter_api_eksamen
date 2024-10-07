const studentContainer = document.getElementById("student_container");
const hogwartsStudents = "https://hp-api.onrender.com/api/characters/students";
const studentsData = []; // Fylle tomt array med data fra api.

const fetchStudents = async () => {
  try {
    const res = await fetch(hogwartsStudents);
    const data = await res.json();
    studentsData.push(...data);
    displayStudents(data);
  } catch (err) {
    console.log(err);
  }
};

const saveStudentCard = () => {};
const deleteStudentCard = () => {};
const editStudentCard = () => {};

// Switch case for bilder. Ikke spesifisert at det må gjøres, men jeg følte for det. Det er min løsning på manglende bilder.
const assignHouseImage = (house) => {
  switch (house.toLowerCase()) {
    case "gryffindor":
      return "../assets/C0441055-AEE4-4C0D-8F43-A708DDEB6C3B-721x900.jpeg";
    case "hufflepuff":
      return "../assets/Hufflepuff-harry_potter_large.webp";
    case "ravenclaw":
      return "../assets/Ravenclaw-harry_potter_large.avif";
    case "slytherin":
      return "../assets/Slytherin.webp";
    default:
      return "../assets/Harry_Potter__Hogwarts__Castle.webp"; // Default image if no house matches
  }
};

const displayStudents = (data) => {
  studentContainer.innerHTML = data
    .map((student) => {
      const { name, alternate_names, image, wand, house } = student; // All informasjon som er spesifisert i oppgaven.
      const age = calculateAge(student); //Passer over student objektet

      const studentImage = image || assignHouseImage(house);

      // Funksjoner/knapper som elevkort skal inneholde
      //Må bruke outerHTML i return statement for å få med button tags som gjør det til et knapp element
      const saveStudent = document.createElement("button");
      saveStudent.textContent = "Save";
      saveStudent.addEventListener("click", saveStudentCard);

      const deleteStudent = document.createElement("button");
      deleteStudent.textContent = "Delete";
      deleteStudent.addEventListener("click", deleteStudentCard);

      const editStudent = document.createElement("button");
      editStudent.textContent = "Edit";
      deleteStudent.addEventListener("click", deleteStudentCard);

      // Noen studenter i api mangler info om tryllestaven, varierende hva som mangler, så dobbeltsjekke hva som displayes. Heller ikke alle som har alt names.
      return `
      <div class="student">
        <h3>${name}</h3>
        <p>House: ${house || "Unknown"}</p>
        <p>Alternate Names: ${
          alternate_names.length > 0 ? alternate_names.join(", ") : "None"
        }</p>
        <p>Age: ${age}</p>
        <p>Wand: ${
          wand.wood
            ? `Wood: ${wand.wood}, Core: ${wand.core || "Unknown"}, Length: ${
                wand.length || "Unknown"
              }`
            : "No Wand Info"
        }</p>
        <img src="${studentImage}" alt="${name}" width="150" />
         <div>
          ${saveStudent.outerHTML}  
          ${deleteStudent.outerHTML}
          ${editStudent.outerHTML}
        </div>
      </div>
    `;
    })
    .join("");
};

// Funksjon for å lage egen stsudent
const createOwnStudent = () => {
  let studentName = prompt("Please enter the student's name:", "");
  if (!studentName) {
    alert("Name is required to create a student!");
    return;
  }

  let house = prompt(
    "Please select the student's house: Gryffindor, Hufflepuff, Ravenclaw, Slytherin",
    ""
  ).toLowerCase();

  const validHouses = ["gryffindor", "hufflepuff", "ravenclaw", "slytherin"];
  if (!validHouses.includes(house)) {
    alert("Please enter a valid house.");
    return;
  }

  let studentAge = prompt("Please enter the student's age:", "");

  // Fordi det opprinnelige arrayet inneholder studentobjekter som har yearOfBirth og dateOfBirth, må denne informasjonen puttes inn først.
  const currentYear = new Date().getFullYear();
  const yearOfBirth = currentYear - parseInt(studentAge);

  // Wand prompts
  let wandWood = prompt("Please enter the wand's wood type:", "");
  let wandCore = prompt("Please enter the wand's core material:", "");
  let wandLength = prompt("Please enter the wand's length (in inches):", "");

  // Bilde ut fra hus valgt, kaller funksjon for det for å unngå repetisjon.
  const houseImage = assignHouseImage(house);

  // Create new student object
  const newStudent = {
    name: studentName,
<<<<<<< HEAD
    house: house.charAt(0).toUpperCase() + house.slice(1),
    alternate_names: [], // Tomt array, ikke viktig.
    yearOfBirth: yearOfBirth, // Lagrer yearOfBirth for at alder ikke skal ende opp som ukjent, lar calculateAge funksjonen og displayStudent håndtere det.
    dateOfBirth: null,
    wand: {
      wood: wandWood,
      core: wandCore,
      length: wandLength,
=======
    house: house.charAt(0).toUpperCase() + house.slice(1), 
    alternate_names: [], // Tomt array, ikke viktig.
    yearOfBirth: yearOfBirth, // Lagrer yearOfBirth for at alder ikke skal ende opp som ukjent, lar calculateAge funksjonen og displayStudent håndtere det.
    dateOfBirth: null, 
    wand: {
      wood: wandWood,
      core: wandCore,
      length: wandLength 
>>>>>>> 7d5e895e3638c20a473df6f2030db2d06d41d8c2
    },
    image: houseImage,
  };

  // Add the new student to the array and update the display
  studentsData.unshift(newStudent);
  console.log(studentsData);
  displayStudents(studentsData);

  alert(`${studentName} has been added to Hogwarts!`);
};

const createStudentButton = document.getElementById("createStudentButton");
createStudentButton.addEventListener("click", createOwnStudent);

// Funksjon for å filtrere ut fra hus og sjekker også alder
const filterByHouseAndAge = (data, selectedHouse, sortOrder = null) => {
  // Filter students by house
  const filteredStudents = data.filter((student) => {
    return selectedHouse === "All" || student.house === selectedHouse;
  });

  // Sjekk om sortering ut fra alder er valgt
  if (sortOrder) {
    const sortedStudents = sortStudentsByAge(filteredStudents, sortOrder);
    displayStudents(sortedStudents); // Vis ut fra alder og hus valgt
  } else {
    //Vis kun ut fra hus valgt
    displayStudents(filteredStudents);
  }
};

//DRY dont repeat yourself. Lager en egen funksjon for å bestemme alder, siden jeg må bruke den informasjonen igjen i sortStudentsByAge
const calculateAge = ({ dateOfBirth, yearOfBirth }) => {
  // Oppgaven spesifiserer å hente alder til student og ikke dateOfBirth.
  const currentDate = new Date();
  //Default for age
  let age = null;

  // Jeg kalkulerer alder utfra dateOfBirth som er hentet fra Api-et
  if (dateOfBirth) {
    const [day, month, year] = dateOfBirth.split("-"); // Fordi det oppsto problemer med å kalkulere noen elevers alder, selv når dateOfBirth eksisterte, så må det gjøres noen tiltak
    const birthDate = new Date(`${year}-${month}-${day}`); // Jeg endrer på rekkefølgen, fordi Date constructor foretrekker YYYY-MM-DD format, der api-et hadde det som DD-MM-YYYY
    age = currentDate.getFullYear() - birthDate.getFullYear();

    // Justerer alder hvis bursdag ikke har hendt ennå dette året.
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    if (
      currentMonth < birthDate.getMonth() ||
      (currentMonth === birthDate.getMonth() &&
        currentDay < birthDate.getDate())
    ) {
      age--;
    }
  } else if (yearOfBirth) {
    // Hvis dateOfBirth ikke eksisterer, bruker jeg yearOfBirth, fordi enkelte i api fortsatt hadde denne informasjonen.
    age = currentDate.getFullYear() - yearOfBirth;
  }
  return age || "unknown";
};

// Funksjon for å sortere ut fra alder valgt.
const sortStudentsByAge = (students, sortOrder) => {
  return students.sort((a, b) => {
    const ageA = calculateAge(a);
    const ageB = calculateAge(b);

    // Sammenligner to studenter for å sortere dem.
    if (ageA === null && ageB === null) return 0;
    if (ageA === null) return 1;
    if (ageB === null) return -1;

    return sortOrder === "youngest" ? ageA - ageB : ageB - ageA;
  });
};

const ageFilter = document.getElementById("ageFilter");
const sortButton = document.getElementById("sortButton");

// Hus knappene
document.querySelectorAll(".house-button").forEach((button) => {
  button.addEventListener("click", (img) => {
    // Sørge for at hus valg er lagret, fjerner classen på alle utenom den valgte huset, sånn at når brukeren trykker på alder sortering, den ikke hopper vekk.
    document
      .querySelectorAll(".house-button")
      .forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    const selectedHouse = img.target.id;
    const selectedSortOrder = ageFilter.value;
    filterByHouseAndAge(studentsData, selectedHouse, selectedSortOrder);
  });
});

// Alder knappen
sortButton.addEventListener("click", () => {
  const selectedHouse =
    document.querySelector(".house-button.selected")?.id || "All"; // Må sjekke valgt hus for at filtrering skal fungere sammen
  const selectedSortOrder = ageFilter.value; // Hente verdien
  filterByHouseAndAge(studentsData, selectedHouse, selectedSortOrder);
});

fetchStudents();
