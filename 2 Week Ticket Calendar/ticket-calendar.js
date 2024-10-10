    const sheetId = '1btDcmPOswtbXcTeiBZ04mHCWB9D2NNrtRgHYkzZ8pbk'; // Google Sheet ID
    const apiKey = 'AIzaSyCm-iW4MMDvaG22ylU6aaetfi8OaIQwy_Q'; // Google Sheet API KEY
    const sheetName = 'Sheet1';
    const daysToShow = 14; // Show two weeks
    const today = new Date(); // Get today's date
    let dateEventMap = {}; // Store events globally to check for next two weeks

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

          renderTwoWeekCalendar();
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function renderTwoWeekCalendar() {
      const calendar = document.getElementById('calendar');
      calendar.innerHTML = ''; // Clear previous content

      // Get the day of the week for today (0 for Sunday, 1 for Monday, etc.)
      let currentDay = today.getDay();
      let currentDate = new Date(today); // Clone today's date

      // Create header row for the days of the week
      const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 0; i < 7; i++) {
        calendar.innerHTML += `<div class="day week">${weekDays[(currentDay + i) % 7]}</div>`;
      }

      // Add the next 14 days starting from today
      for (let i = 0; i < daysToShow; i++) {
        const dateStr = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const events = dateEventMap[dateStr] || [];
        let eventsHTML = '';

        events.forEach(event => {
          const eventClass = event.bestAvailable ? 'bestavail' : '';
          eventsHTML += `<div class="event ${eventClass}">${event.time}</div>`;
        });

        calendar.innerHTML += `
          <div class="day">
            <h4>${currentDate.getDate()}</h4>
            ${eventsHTML}
          </div>
        `;

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    fetchCalendarData();