const { google } = require('googleapis');

// Function to get user's calendar events
const getCalendarEvents = async (accessToken) => {
  try {
    // Set up the OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.CLIENT_URL
    );

    // Set the access token for the OAuth2 client
    oauth2Client.setCredentials({ access_token: accessToken });

    // Create a new instance of the Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get the user's calendar events
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  } catch (error) {
    console.error('Error getting calendar events:', error);
    throw error; // Re-throw the error for better error handling
  }
};

// Function to refresh the access token
const refreshAccessToken = async (refreshToken) => {
  try {
    // Set up the OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.CLIENT_URL
    );

    // Set the refresh token for the OAuth2 client
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // Refresh the access token
    const { credentials } = await oauth2Client.getAccessToken();

    return credentials.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error; // Re-throw the error for better error handling
  }
};

module.exports = { getCalendarEvents, refreshAccessToken };