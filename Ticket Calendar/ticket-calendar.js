  const sheetId = '1btDcmPOswtbXcTeiBZ04mHCWB9D2NNrtRgHYkzZ8pbk';
  const apiKey = 'AIzaSyCm-iW4MMDvaG22ylU6aaetfi8OaIQwy_Q';
  const sheetName = 'Sheet1';
  const baseURL = 'https://www.telecharge.com/Drag-The-Musical-tickets';
  const aid = 'OBW001441000'; // Tracking ID from the template
  let currentMonth = 9; // Start with October (0-indexed, so 9 means October)
  let currentYear = new Date().getFullYear();
  let dateEventMap = {}; // Store events globally to check for next/previous months

  function fetchCalendarData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const days = data.values.slice(1); // Skip the header row
        dateEventMap = {};

        days.forEach(day => {
          const date = day[0]; // Date column in MM/DD/YYYY format
          const [month, dayPart, year] = date.split('/');
          const formattedDate = `${year}-${month.padStart(2, '0')}-${dayPart.padStart(2, '0')}`;
          const time = day[1]; // Time column
          const bestAvailable = day[2] === 'TRUE'; // Best Available checkbox

          if (!dateEventMap[formattedDate]) {
            dateEventMap[formattedDate] = [];
          }
          dateEventMap[formattedDate].push({ time, bestAvailable });
        });

        renderCalendar();
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  function hasEventsForMonth(year, month) {
    const monthStr = String(month + 1).padStart(2, '0');
    const yearMonthPrefix = `${year}-${monthStr}`;
    return Object.keys(dateEventMap).some(date => date.startsWith(yearMonthPrefix));
  }

  function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const currentMonthDisplay = document.getElementById('currentMonth');

    // Set the header for September/October, October, or any other month
    if (currentMonth === 9) { // October
      currentMonthDisplay.innerText = `SEP/OCT ${currentYear}`;
    } else {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthName = monthNames[currentMonth];
      currentMonthDisplay.innerText = `${monthName} ${currentYear}`;
    }

    calendar.innerHTML = `
      <div class="day week">Sun</div>
      <div class="day week">Mon</div>
      <div class="day week">Tue</div>
      <div class="day week">Wed</div>
      <div class="day week">Thu</div>
      <div class="day week">Fri</div>
      <div class="day week">Sat</div>
    `;

    // Handle September 30th if we are in October
    if (currentMonth === 9) { // If October, also include September 30th
      const sept30Date = new Date(currentYear, 8, 30); // September 30th
      const sept30Day = sept30Date.getDay(); // Get the day of the week for September 30th (Monday is 1)

      // Fill empty days before September 30th
      for (let i = 0; i < sept30Day; i++) {
        calendar.innerHTML += '<div class="day"></div>';
      }

      // Add September 30th
      const dateStr = `${currentYear}-09-30`;
      const events = dateEventMap[dateStr] || [];
      let eventsHTML = '';

      events.forEach(event => {
        const eventClass = event.bestAvailable ? 'bestavail' : '';
        const timeFormatted = event.time.replace(' ', '');
        const formattedPerformanceDate = `09/30/${currentYear}%20${timeFormatted}`;
        const eventURL = `${baseURL}?PerformanceDateTime=${formattedPerformanceDate}&AID=${aid}&utm_source=show_site&utm_campaign=dragthemusicalSS&utm_medium=web&utm_id=${aid}`;
        eventsHTML += `<div class="event ${eventClass}"><a href="${eventURL}" target="_blank">${event.time}</a></div>`;
      });

      calendar.innerHTML += `
        <div class="day">
          <h4>30</h4>
          ${eventsHTML}
        </div>
      `;
    }

    // Adjust only for October
    let startDay = new Date(currentYear, currentMonth, 1).getDay();
    if (currentMonth === 9) {
      startDay -= 2; // Start two days earlier (October 1st on Tuesday)
      if (startDay < 0) startDay += 7;
    }

    // Fill empty days before the start of the month
    for (let i = 0; i < startDay; i++) {
      calendar.innerHTML += '<div class="day"></div>';
    }

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const events = dateEventMap[dateStr] || [];
      let eventsHTML = '';

      events.forEach(event => {
        const eventClass = event.bestAvailable ? 'bestavail' : '';
        const timeFormatted = event.time.replace(' ', '');
        const formattedPerformanceDate = `${String(currentMonth + 1).padStart(2, '0')}/${String(i).padStart(2, '0')}/${currentYear}%20${timeFormatted}`;
        const eventURL = `${baseURL}?PerformanceDateTime=${formattedPerformanceDate}&AID=${aid}&utm_source=show_site&utm_campaign=dragthemusicalSS&utm_medium=web&utm_id=${aid}`;
        eventsHTML += `<div class="event ${eventClass}"><a href="${eventURL}" target="_blank">${event.time}</a></div>`;
      });

      calendar.innerHTML += `
        <div class="day">
          <h4>${i}</h4>
          ${eventsHTML}
        </div>
      `;
    }

    // Check for events in the previous and next months
    const showPrev = hasEventsForMonth(currentYear, currentMonth - 1) || (currentMonth === 0 && hasEventsForMonth(currentYear - 1, 11));
    const showNext = hasEventsForMonth(currentYear, currentMonth + 1) || (currentMonth === 11 && hasEventsForMonth(currentYear + 1, 0));

    // Update button states and functionality
    document.getElementById('prevMonth').classList.toggle('disabled', !showPrev);
    document.getElementById('nextMonth').classList.toggle('disabled', !showNext);

    document.getElementById('prevMonth').onclick = function() {
      if (showPrev) {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        fetchCalendarData();
      }
    };

    document.getElementById('nextMonth').onclick = function() {
      if (showNext) {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        fetchCalendarData();
      }
    };
  }

  fetchCalendarData();