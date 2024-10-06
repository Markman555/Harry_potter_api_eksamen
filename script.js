const studentContainer = document.getElementById("student_container");
const hogwartsStudents = "https://hp-api.onrender.com/api/characters/students";
const studentsData = [];

const fetchStudents = async () => {
  try {
    const res = await fetch(hogwartsStudents);
    const data = await res.json();
    studentsData.push(...data); 
    displayStudents(data);
    // Legg til knapp funksjonalitet for Hus bildene for å kunne filtrere elever ut fra det.
    document.querySelectorAll(".house-button").forEach((button) => {
      button.addEventListener("click", (img) => {
        const selectedHouse = img.target.id;
        filterStudentsByHouse(data, selectedHouse);
      });
    });
  } catch (err) {
    console.log(err);
  }
};



const saveStudentCard = () => {};
const deleteStudentCard = () => {};
const editStudentCard = () => {};

const displayStudents = (data) => {
  // Url for hus bilder som erstatning hvis bilde til student mangler.
  const gryffindorImg =
    "../assets/C0441055-AEE4-4C0D-8F43-A708DDEB6C3B-721x900.jpeg";
  const hufflepuffImg = "../assets/Hufflepuff-harry_potter_large.webp";
  const ravenclawImg = "../assets/Ravenclaw-harry_potter_large.avif";
  const slytherinImg = "../assets/Slytherin.webp";
  const defaultImg = "../assets/Harry_Potter__Hogwarts__Castle.webp";

  studentContainer.innerHTML = data
    .map((student) => {
      const { name, alternate_names, image, wand, house } =
        student; // All informasjon som er spesifisert i oppgaven.
      const age = calculateAge(student); //Passer over student objektet

      // Switch case for bilder. Ikke spesifisert at det må gjøres, men jeg følte for det.
      let studentImage = image || "";

      if (!studentImage) {
        switch (house) {
          case "Gryffindor":
            studentImage = gryffindorImg;
            break;
          case "Hufflepuff":
            studentImage = hufflepuffImg;
            break;
          case "Ravenclaw":
            studentImage = ravenclawImg;
            break;
          case "Slytherin":
            studentImage = slytherinImg;
            break;
          default:
            studentImage = defaultImg; // Hvis ikke noe hus er kjent.
            break;
        }
      }
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

// Funksjon for å filtrere ut fra hus
const filterStudentsByHouse = (data, selectedHouse) => {
  // Filtrere ut fra et valgt hus, eller display alle. Funker ikke alternativet for selectedHouse === "All"
  const filteredStudents = data.filter((student) => {
    return selectedHouse === "All" || student.house === selectedHouse;
  });
  

  displayStudents(filteredStudents);
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

const sortStudentsByAge = (students, sortOrder) => {
  return students.sort((a, b) => {
    const ageA = calculateAge(a);
    const ageB = calculateAge(b);

    // If both ages are null, treat them as equal
    if (ageA === null && ageB === null) return 0;

    // If ageA is null, place it last
    if (ageA === null) return 1;

    // If ageB is null, place it last
    if (ageB === null) return -1;

    // Compare ages based on the selected order
    return sortOrder === "youngest" ? ageA - ageB : ageB - ageA;
  });
};



const ageFilter = document.getElementById("ageFilter");
const sortButton = document.getElementById("sortButton");

sortButton.addEventListener("click", () => {
  const selectedValue = ageFilter.value;
  if (selectedValue) {
    const sortedStudents = sortStudentsByAge([...studentsData], selectedValue);
    displayStudents(sortedStudents);
  }
});


fetchStudents();