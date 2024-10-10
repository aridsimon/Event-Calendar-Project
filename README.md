# HTML-Showcase
Event Calendar with Full Month View and Two-Week Outlook

This project provides two custom calendars:

	•	Full Calendar: Displays a full month’s events pulled from a Google Sheet.
	•	Two-Week Outlook Calendar: Displays a two-week rolling outlook starting from the current day.

Both calendars fetch event data from a Google Sheet, including the date, time, and an indicator for “Best Availability.” The data is rendered dynamically using JavaScript.

Table of Contents

	•	Features
	•	Technologies
	•	Setup
	•	Usage
	•	Event Data
	•	Customizations
	•	License

Features

	•	Full Calendar: Displays events for the entire current month.
	•	Two-Week Outlook Calendar: Shows the next two weeks of events, starting from the current day.
	•	Google Sheets Integration: Event data is fetched from a Google Sheet for easy updating.
	•	Responsive Design: The calendars adapt to various screen sizes, including mobile and tablet.
	•	Best Availability: Days with “Best Availability” are highlighted based on the data from the Google Sheet.

Technologies

	•	HTML5
	•	CSS3
	•	JavaScript (ES6)
	•	Google Sheets API

Setup

Prerequisites

	•	A Google Sheet set up with event data (dates, times, and best availability).
	•	Google Sheets API enabled with a valid API key.

Steps

	1.	Modify Google Sheet ID and API Key
            const sheetId = 'YOUR_GOOGLE_SHEET_ID';
            const apiKey = 'YOUR_GOOGLE_SHEETS_API_KEY';

	3.	Add Event Data in Google Sheets
    The Google Sheet should have the following columns:
        •	Date (MM/DD/YYYY)
        •	Time (HH:MM AM/PM)
        •	Best Available (TRUE/FALSE)

	4.	Launch the Project
    Open the index.html file in a browser to view the full calendar and the two-week outlook calendar.

Usage

Full Calendar

    The Full Calendar shows events for the entire month. Each day with an event is highlighted, and clicking on an event shows additional details such as time and “Best Availability.”

Two-Week Outlook Calendar

    The Two-Week Calendar shows the next 14 days starting from the current day. It automatically updates to show the correct days, and any event data is displayed dynamically.

Event Data

    Events are fetched from a Google Sheet that you can manage for easy updates. Ensure that the data is structured as follows:

	•	Date: Format as MM/DD/YYYY.
	•	Time: Event time in HH:MM AM/PM format.
	•	Best Available: Use TRUE for marking the best availability.

Customizations

	•	Changing Styles: Modify the CSS styles in the <style> section of the HTML to customize the look and feel of the calendars.
	•	Google Sheet ID and API Key: Change the Google Sheet ID and API key in the JavaScript code to switch to a different Google Sheet.

License
    
    This project is licensed under the MIT License. See the LICENSE file for details.    