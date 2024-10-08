const studentContainer = document.getElementById("student_container");
const hogwartsStudents = "https://hp-api.onrender.com/api/characters/students";
const studentsData = []; // Fylle tomt array med data fra api.

// Første som skal gjøres er å fetche asynkront
const fetchStudents = async () => {
  try {
    const res = await fetch(hogwartsStudents);
    const data = await res.json();
    // Legger til selvlagde studenter sammen med api data for å displaye umiddelbart når man går inn på siden.
    const existingStudents = JSON.parse(localStorage.getItem("students")) || [];
    const allStudents = [...existingStudents, ...data];
    studentsData.push(...allStudents);
    displayStudents(allStudents);
    // For å vise favoritt studenter
    const favoriteStudents =
      JSON.parse(localStorage.getItem("favoriteStudents")) || [];
    displayFavoriteStudents(favoriteStudents);
  } catch (err) {
    console.log(err);
  }
};

// Switch case for bilder. Gjør det om til farger, siden oppgaven spesifiserer det.
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
      return "../assets/Harry_Potter__Hogwarts__Castle.webp"; // Default bilde
  }
};

// 1.1  Visning av alle elever
const displayStudents = (data) => {
  studentContainer.innerHTML = data
    .map((student, index) => {
      const { name, alternate_names, image, wand, house } = student; // All informasjon som er spesifisert i oppgaven
      const age = calculateAge(student); // Passer over student objektet for å kalkulere alder
      const studentImage = image || assignHouseImage(house);

      // Jeg valgte denne måten å lage kort for hver enkelt student. La også til knapper i html strukturen.
      return `
      <div class="student" id="student-${index}">
        <h3>${name}</h3>
        <p>House: ${house || "Unknown"}</p>
        <p>Alternate Names: ${
          alternate_names.length > 0 ? alternate_names.join(", ") : "None"
        }</p>
        <p>Age: ${age}</p>
        <p>Wand: Wood: ${wand.wood || "Unknown"}, Core: ${
        wand.core || "Unknown"
      }, Length: ${wand.length || "Unknown"}</p> 
        <img src="${studentImage}" alt="${name}" width="150" />
        <div>
          <button class="save-student" data-index="${index}">Save</button>
          <button class="delete-student" data-index="${index}">Delete</button>
          <button class="edit-student" data-index="${index}">Edit</button>
        </div>
      </div>`;
    })
    .join("");

  // Save
  document.querySelectorAll(".save-student").forEach((btn) => {
    const studentIndex = btn.getAttribute("data-index");
    btn.addEventListener("click", () => saveStudentCard(data[studentIndex])); // Må finne riktig index
  });

  // Delete
  document.querySelectorAll(".delete-student").forEach((btn) => {
    const studentIndex = btn.getAttribute("data-index");
    btn.addEventListener("click", () => deleteStudentCard(data[studentIndex])); // Må finne riktig index
  });

  // Edit
  document.querySelectorAll(".edit-student").forEach((btn) => {
    const studentIndex = btn.getAttribute("data-index");
    btn.addEventListener("click", () => editStudent(studentIndex, false)); // Må finne riktig index og passere false fordi det er ikke favoritt student. Derfor heller ikke hele objektet.
  });
};

// 1.2 Funksjon for å filtrere ut fra hus og sjekker også alder
const filterByHouseAndAge = (data, selectedHouse, sortOrder = null) => {
  // Først sjekke hus
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

// 1.3 Funksjon for prompts og funksjon for å lage egen student. Dette er for å kunne gjenbruke studentInfoPrompts i editStudent senere.
const studentInfoPrompts = () => {
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

  return (newStudent = {
    name: studentName,
    house: house.charAt(0).toUpperCase() + house.slice(1),
    alternate_names: [], // Tomt array, ikke viktig.
    yearOfBirth: yearOfBirth, // Lagrer yearOfBirth for at alder ikke skal ende opp som ukjent, lar calculateAge funksjonen og displayStudent håndtere det.
    dateOfBirth: null,
    wand: {
      wood: wandWood,
      core: wandCore,
      length: wandLength,
    },
    image: houseImage,
  });
};

const createOwnStudent = () => {
  const newStudent = studentInfoPrompts();
  // Bruker unshift metoden for å legge til student først i arrayet.
  studentsData.unshift(newStudent);
  displayStudents(studentsData);

  saveStudentToLocalStorage(newStudent);

  alert(`${studentName} has been added to Hogwarts!`);
};

//Funksjon for å lagre nye studenter i localStorage
const saveStudentToLocalStorage = (student) => {
  const existingStudents = JSON.parse(localStorage.getItem("students")) || []; // Sørg for å håndtere en liste som er oppdatert med tidligere lagt til studenter
  existingStudents.unshift(student);
  localStorage.setItem("students", JSON.stringify(existingStudents));
};

const createStudentButton = document.getElementById("createStudentButton");
createStudentButton.addEventListener("click", createOwnStudent);

// Lagre studenter 1.4
const saveStudentCard = (student) => {
  const favoriteStudents =
    JSON.parse(localStorage.getItem("favoriteStudents")) || [];

  // Sjekk at de ikke allerede er i favoritt med some metoden
  if (favoriteStudents.some((favStudent) => favStudent.name === student.name)) {
    alert(`${student.name} is already in your favorites!`);
    return;
  }

  // Sjekk grensen på favoritt studenter. Ikke mer enn 3.
  if (favoriteStudents.length >= 3) {
    alert("You can only save up to 3 favorite students!");
    return;
  }

  //Legger de til i listen og localstorage
  favoriteStudents.push(student);
  localStorage.setItem("favoriteStudents", JSON.stringify(favoriteStudents));

  // Oppdaterer display
  displayFavoriteStudents(favoriteStudents);
};

//Egen funskjon for å vise favoritt studenter
const displayFavoriteStudents = (favoriteStudents) => {
  const favoriteContainer = document.getElementById("favorite_students");
  favoriteContainer.innerHTML = "<h2>Your favorite students at Hogwarts</h2>"; //Må kjøre denne biten for å unngå rot i displayet når det oppdateres.

  if (favoriteStudents.length === 0) {
    favoriteContainer.innerHTML += "<p>No favorite students added yet.</p>";
    return;
  }

  favoriteContainer.innerHTML += favoriteStudents
    .map((student, index) => {
      const age = calculateAge(student);
      return `
      <div class="student" id="favorite-student-${index}">
        <h3>${student.name}</h3>
        <p>House: ${student.house || "Unknown"}</p>
        <p>Alternate Names: ${
          student.alternate_names && student.alternate_names.length > 0
            ? student.alternate_names.join(", ")
            : "None"
        }</p>
        <p>Age: ${age}</p>
        <p>Wand: Wood: ${student.wand.wood}, Core: ${
        student.wand.core || "Unknown"
      }, Length: ${student.wand.length || "Unknown"}</p>
        <img src="${student.image}" alt="${student.name}" width="150" />
        <div>
          <button class="delete-favorite-student" data-index="${index}">Delete</button>
          <button class="edit-favorite-student" data-index="${index}">Edit</button>
        </div>
      </div>`;
    })
    .join("");

  // Egne eventlistener for favoritt studenter
  document.querySelectorAll(".delete-favorite-student").forEach((btn) => {
    const studentIndex = btn.getAttribute("data-index");
    const studentElementId = `favorite-student-${studentIndex}`;
    btn.addEventListener("click", () =>
      deleteFavoriteStudent(studentIndex, studentElementId)
    );
  });

  document.querySelectorAll(".edit-favorite-student").forEach((btn) => {
    const studentIndex = btn.getAttribute("data-index");
    btn.addEventListener("click", () => editStudent(studentIndex, true)); // Pass true for favorite
  });
};

// 1.5 Slette elever. Egen for favoritt
const deleteFavoriteStudent = (studentIndex, studentElementId) => {
  let favoriteStudents =
    JSON.parse(localStorage.getItem("favoriteStudents")) || [];

  // FJern studenten fra LocalStorage
  favoriteStudents.splice(studentIndex, 1);
  localStorage.setItem("favoriteStudents", JSON.stringify(favoriteStudents));

  // FJern studenten fra DOM
  document.getElementById(studentElementId).remove();
};

//Egen funksjon for å slette vanlge elever, Bedre å holde dem skilt i dette tilfellet
const deleteStudentCard = (student) => {
  const studentIndex = studentsData.findIndex(
    (index) => index.name === student.name
  );

  studentsData.splice(studentIndex, 1);

  displayStudents(studentsData);
};

// 1.6 redigere studenter. Kombinerte funksjonen for å redigere vanlige studenter og favoritt studenter for å unngå for mye repetering av kode.
const editStudent = (studentIndex, isFavorite) => {
  //Sjekke om det er favoritt og da hente fra storage, hvis ikke henter fra studentsData array
  let studentsList = isFavorite
    ? JSON.parse(localStorage.getItem("favoriteStudents")) || []
    : studentsData;
  const student = studentsList[studentIndex]; //Finner riktig student

  const updatedStudentInfo = studentInfoPrompts(student); // Kaller egen prompts funksjon og passerer student

  // Oppdaterer target objekt, student, med source objekt hentet fra prompt funksjonen.
  Object.assign(student, updatedStudentInfo);

  // Oppdater studenten i localStorage, hvis det er favoritt
  if (isFavorite) {
    localStorage.setItem("favoriteStudents", JSON.stringify(studentsList));
  }

  // Oppdater display
  if (isFavorite) {
    displayFavoriteStudents(studentsList); //Hvis favoritt, kall funksjon med listen som har oversikt over favoritt studenter fra localStorage
  } else {
    displayStudents(studentsData); //Hvis ikke kall funskjon med listen over alle studenter fra det opprinnelige array.
  }
};

fetchStudents();
