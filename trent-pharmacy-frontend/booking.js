document.addEventListener('DOMContentLoaded', () => {
  // (A) Booking Steps: Collect step elements and indicators
  const steps = [
    document.querySelector('.step-1'),
    document.querySelector('.step-2'),
    document.querySelector('.step-3'),
    document.querySelector('.step-4')
  ];
  const progressSteps = document.querySelectorAll('.step-indicator');
  let currentStep = 1;

  function showStep(step) {
    // Hide all steps, show only the one we want
    steps.forEach((s, idx) => {
      if (idx === step - 1) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    // Update the step indicator (progress bar)
    progressSteps.forEach((ps, idx) => {
      if (idx < step) {
        ps.classList.add('active-indicator');
      } else {
        ps.classList.remove('active-indicator');
      }
    });

    currentStep = step;
  }

  // (B) Navigation Buttons – using data attributes for next/back step numbers
  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = Number(btn.dataset.next);
      // Show a loading spinner on the button briefly
      btn.classList.add('btn-loading');
      setTimeout(() => {
        btn.classList.remove('btn-loading');
        showStep(next);
      }, 500); // half-second spinner
    });
  });

  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const back = Number(btn.dataset.back);
      showStep(back);
    });
  });

  // (C) Step 1: Enable Next when a service is selected
  const serviceRadios = document.querySelectorAll("input[name='service']");
  const nextStep1Btn = document.querySelector('.step-1 .next-btn');
  serviceRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      nextStep1Btn.disabled = false;
    });
  });

  // (D) Step 2: Calendar & Time Slots
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");
  const calendarBody = document.getElementById("calendarBody");
  const selectedDateLabel = document.getElementById("selectedDateLabel");
  const timeSlotsTable = document.getElementById("timeSlotsTable");
  const nextStep2Btn = document.querySelector('.step-2 .next-btn');

  let selectedDate = null;
  let selectedTime = null;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Build array of months from current month/year to 2030
  let dateLoop = new Date(currentYear, currentMonth, 1);
  let monthsArray = [];
  while (dateLoop.getFullYear() <= 2030) {
    monthsArray.push({
      year: dateLoop.getFullYear(),
      month: dateLoop.getMonth()
    });
    dateLoop.setMonth(dateLoop.getMonth() + 1);
  }

  // Fill yearSelect (unique years)
  let uniqueYears = Array.from(new Set(monthsArray.map(mObj => mObj.year))).sort((a, b) => a - b);
  uniqueYears.forEach(yy => {
    const opt = document.createElement("option");
    opt.value = yy;
    opt.textContent = yy;
    yearSelect.appendChild(opt);
  });

  // Fill monthSelect (0..11)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  for (let m = 0; m < 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = monthNames[m];
    monthSelect.appendChild(opt);
  }

  // Set default in the selects
  yearSelect.value = currentYear;
  monthSelect.value = currentMonth;

  // Build the mini-calendar
  function buildCalendar(year, month) {
    calendarBody.innerHTML = "";
    let firstDay = new Date(year, month, 1).getDay();
    let shift = (firstDay === 0) ? 6 : firstDay - 1;
    let lastDay = new Date(year, month + 1, 0).getDate();

    let cells = [];
    for (let i = 0; i < shift; i++) {
      cells.push({ dayNum: "", inactive: true });
    }
    for (let d = 1; d <= lastDay; d++) {
      let checkDate = new Date(year, month, d);
      let isPast = checkDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      cells.push({ dayNum: d, inactive: isPast });
    }

    let rowCount = Math.ceil(cells.length / 7);
    let idx = 0;
    for (let r = 0; r < rowCount; r++) {
      let tr = document.createElement("tr");
      for (let c = 0; c < 7; c++) {
        let cell = cells[idx] || { dayNum: "", inactive: true };
        idx++;
        let td = document.createElement("td");
        if (cell.dayNum !== "") {
          td.textContent = cell.dayNum;
          if (cell.inactive) {
            td.classList.add("inactive-day");
          } else {
            td.setAttribute("data-day", cell.dayNum);
            td.addEventListener("click", () => {
              calendarBody.querySelectorAll("td").forEach(x => x.classList.remove("selected-date"));
              td.classList.add("selected-date");
              selectedDate = new Date(year, month, cell.dayNum);
              updateDateLabel();
              buildTimeSlots();
            });
          }
        } else {
          td.classList.add("inactive-day");
        }
        tr.appendChild(td);
      }
      calendarBody.appendChild(tr);
    }
  }

  function updateDateLabel() {
    if (selectedDate) {
      selectedDateLabel.textContent = "Selected Date: " + selectedDate.toDateString();
    } else {
      selectedDateLabel.textContent = "Select a date...";
    }
  }

  function buildTimeSlots() {
    timeSlotsTable.innerHTML = "";
    selectedTime = null;
    checkIfStep2Ready();
    if (!selectedDate) return;

    let dayOfWeek = selectedDate.getDay();
    let openHour, openMin, closeHour, closeMin;
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      openHour = 9; openMin = 0; closeHour = 17; closeMin = 0;
    } else if (dayOfWeek === 6) {
      openHour = 9; openMin = 0; closeHour = 12; closeMin = 0;
    } else {
      const closedRow = document.createElement("tr");
      const closedCell = document.createElement("td");
      closedCell.colSpan = 4;
      closedCell.textContent = "Closed on Sundays";
      closedRow.appendChild(closedCell);
      timeSlotsTable.appendChild(closedRow);
      return;
    }

    let slotTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), openHour, openMin);
    let endTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), closeHour, closeMin);

    const timesArray = [];
    while (slotTime < endTime) {
      timesArray.push(formatTime(slotTime));
      slotTime.setMinutes(slotTime.getMinutes() + 15);
    }

    const cols = 4;
    for (let i = 0; i < timesArray.length; i += cols) {
      const row = document.createElement("tr");
      for (let c = 0; c < cols; c++) {
        const idx = i + c;
        const td = document.createElement("td");
        if (idx < timesArray.length) {
          td.textContent = timesArray[idx];
          td.addEventListener("click", () => {
            timeSlotsTable.querySelectorAll("td").forEach(x => x.classList.remove("selected"));
            td.classList.add("selected");
            selectedTime = timesArray[idx];
            checkIfStep2Ready();
          });
        }
        row.appendChild(td);
      }
      timeSlotsTable.appendChild(row);
    }
  }

  function formatTime(dt) {
    let hh = dt.getHours();
    let mm = dt.getMinutes();
    let ampm = (hh >= 12) ? "pm" : "am";
    if (hh > 12) hh -= 12;
    if (hh === 0) hh = 12;
    let mmStr = mm < 10 ? "0" + mm : mm;
    return hh + ":" + mmStr + " " + ampm;
  }

  function checkIfStep2Ready() {
    nextStep2Btn.disabled = !(selectedDate && selectedTime);
  }

  function onMonthYearChange() {
    let yy = parseInt(yearSelect.value);
    let mm = parseInt(monthSelect.value);
    buildCalendar(yy, mm);
    selectedDate = null;
    updateDateLabel();
    buildTimeSlots();
  }
  monthSelect.addEventListener("change", onMonthYearChange);
  yearSelect.addEventListener("change", onMonthYearChange);

  buildCalendar(currentYear, currentMonth);

  // (E) Step 3: Details form – now also check for a consent checkbox
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const nextStep3Btn = document.querySelector('.step-3 .next-btn');
  const consentCheckbox = document.getElementById("consentCheckbox");

  // Advanced Validation: Validate email format
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  
  // Advanced Validation: Validate full name (letters, spaces, hyphens, apostrophes)
  function validateName(name) {
    const re = /^[a-zA-Z\s'-]+$/;
    return re.test(name);
  }

  function checkDetails() {
    const nameValue = fullNameInput.value.trim();
    const nameFilled = nameValue !== "";
    const nameValid = validateName(nameValue);
    const emailValue = emailInput.value.trim();
    const emailFilled = emailValue !== "";
    const emailValid = validateEmail(emailValue);
    const consentGiven = consentCheckbox ? consentCheckbox.checked : true;

    // Optionally, you can display error messages here if the name or email is invalid.
    // e.g., document.getElementById('nameError').textContent = nameValid ? '' : 'Invalid name';
    //       document.getElementById('emailError').textContent = emailValid ? '' : 'Invalid email';

    nextStep3Btn.disabled = !(nameFilled && nameValid && emailFilled && emailValid && consentGiven);
  }

  fullNameInput.addEventListener("input", checkDetails);
  emailInput.addEventListener("input", checkDetails);
  if (consentCheckbox) {
    consentCheckbox.addEventListener("change", checkDetails);
  }

  // (F) Booking Form Submission – send booking email to the backend
  const bookingForm = document.getElementById('booking-form');
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const name = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const notes = document.getElementById('notes').value.trim();
    const serviceRadio = document.querySelector("input[name='service']:checked");
    const service = serviceRadio ? serviceRadio.value : "";
    const date = selectedDate ? selectedDate.toDateString() : "";
    const time = selectedTime ? selectedTime : "";

    const bookingData = { name, email, service, date, time, notes };

    console.log("Booking data being sent:", bookingData); // Debug log

    try {
      const response = await fetch('https://pharmacy-website-backend.vercel.app/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      if (response.ok) {
        // Move to confirmation step on success
        showStep(4);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('Error sending booking:', err);
      alert('Something went wrong while sending your booking. Please try again later.');
    }
  });

  // Show initial step (Step 1)
  showStep(1);
});
