const studentContainer = document.getElementById("student_container");
const hogwartsStudents = "https://hp-api.onrender.com/api/characters/students";

const fetchStudents = async () => {
  try {
    const res = await fetch(hogwartsStudents);
    const data = await res.json();
    displayStudents(data);
  } catch (err) {
    console.log(err);
  }
};

fetchStudents();

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
      const {
        name,
        alternate_names,
        image,
        dateOfBirth,
        yearOfBirth,
        wand,
        house,
      } = student; // All informasjon som er spesifisert i oppgaven.

      // Oppgaven spesifiserer å hente alder til student og ikke dateOfBirth. Ettersom alder ikke eksisterer i api, må noen beregninger utføres.
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();

      // Opretter age variabel
      let age = "Unknown"; // Default verdi for age

      // Jeg kalkulerer alder utfra dateOfBirth som er hentet fra Api-et
      if (dateOfBirth) {
        // Fordi det oppsto problemer med å kalkulere noen elevers alder, selv når dateOfBirth eksisterte, så må det gjøres noen tiltak
        const [day, month, year] = dateOfBirth.split("-");

        // Jeg endrer på rekkefølgen, fordi Date constructor foretrekker YYYY-MM-DD format, der api-et hadde det som DD-MM-YYYY
        const parsedDate = new Date(`${year}-${month}-${day}`);

        const birthDate = parsedDate;
        const birthYear = birthDate.getFullYear();
        const birthMonth = birthDate.getMonth();
        const birthDay = birthDate.getDate();

        // Setter alder
        age = currentYear - birthYear;

        // Justerer alder hvis bursdag ikke har hendt ennå dette året.
        if (
          currentMonth < birthMonth ||
          (currentMonth === birthMonth && currentDay < birthDay)
        ) {
          age--;
        }
      } else if (yearOfBirth) {
        // Hvis dateOfBirth ikke eksisterer, bruker jeg yearOfBirth, fordi enkelte i api fortsatt hadde denne informasjonen.
        age = currentYear - yearOfBirth;
      }

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
      editStudent.textContent = "Delete";
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

const saveStudentCard = () => {};
const deleteStudentCard = () => {};
const editStudentCard = () => {};
