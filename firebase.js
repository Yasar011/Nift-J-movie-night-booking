// Import the required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, set, onValue, update, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpew8ODVHmmGndhZxQ3VK_CEurW0_EQyU",
  authDomain: "nift-movie-nigt-apc.firebaseapp.com",
  databaseURL: "https://nift-movie-nigt-apc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nift-movie-nigt-apc",
  storageBucket: "nift-movie-nigt-apc.appspot.com",
  messagingSenderId: "736122244542",
  appId: "1:736122244542:web:69d88050a26fc8391dbdef",
  measurementId: "G-GL1MBM6DW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const seatingChart = document.getElementById("seatingChart");
  const bookingForm = document.getElementById("bookingForm");
  const lockDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
  let selectedSeat = null;

  // Load seat data from Firebase
  const seatStatusRef = ref(database, "seats/");
  onValue(seatStatusRef, (snapshot) => {
    const seatData = snapshot.val() || {};

    seatingChart.innerHTML = "";
    const rows = 10;
    const seatsPerRow = 20;

    for (let i = 0; i < rows; i++) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");

      for (let j = 0; j < seatsPerRow; j++) {
        const seatId = `${String.fromCharCode(65 + i)}${j + 1}`;
        const seatElement = document.createElement("div");
        seatElement.classList.add("seat");

        // Handle seat status
        const seat = seatData[seatId];
        if (seat) {
          const isLocked = seat.status === "locked";
          const isOccupied = seat.status === "occupied";
          const lockExpired = seat.lockTime && Date.now() - seat.lockTime > lockDuration;

          if (isOccupied) {
            seatElement.classList.add("occupied");
          } else if (isLocked && !lockExpired) {
            seatElement.classList.add("locked");
          } else if (lockExpired) {
            update(ref(database, `seats/${seatId}`), { status: "available", lockTime: null });
          }
        }

        seatElement.textContent = seatId;
        seatElement.addEventListener("click", () => {
          if (seatElement.classList.contains("occupied") || seatElement.classList.contains("locked")) {
            return;
          }

          // Lock the seat temporarily
          if (selectedSeat) {
            selectedSeat.classList.remove("selected");
            update(ref(database, `seats/${selectedSeat.textContent}`), { status: "available", lockTime: null });
          }

          seatElement.classList.add("selected");
          selectedSeat = seatElement;

          update(ref(database, `seats/${seatId}`), {
            status: "locked",
            lockTime: Date.now()
          });

          bookingForm.style.display = "block";
          document.getElementById("seatNumber").value = seatId;
        });

        rowElement.appendChild(seatElement);
      }
      seatingChart.appendChild(rowElement);
    }
  });

  // Handle form submission
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const department = document.getElementById("department").value;
    const semester = document.getElementById("semester").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const seatNumber = document.getElementById("seatNumber").value;

    // Update seat to occupied
    set(ref(database, `seats/${seatNumber}`), {
      status: "occupied",
      name,
      department,
      semester,
      email,
      phone
    });

    if (selectedSeat) {
      selectedSeat.classList.remove("selected");
      selectedSeat.classList.add("occupied");
    }

    bookingForm.style.display = "none";
    bookingForm.reset();
    selectedSeat = null;

    alert(`Seat ${seatNumber} booked successfully!`);
  });
});
