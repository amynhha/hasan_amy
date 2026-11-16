// Edit everything here. After replacing this file, paste your Google Apps Script URL into rsvpEndpoint again.
export const config = {
  groom: 'Hasan', bride: 'Amy',
  dateISO: '2027-01-29T17:00:00',
  dateText: 'January 29, 2027', day: 'Friday', timeWords: 'at five o’clock in the evening',
  venue: 'Venue Name',                      // TODO
  city: 'Lincoln, Nebraska',
  address: 'Venue Name, Lincoln, Nebraska', // TODO: used by Get directions
  rsvpBy: 'January 1, 2027',
  story: [
    'It began with a simple meeting in class, when two people crossed paths and gradually got to know each other,',
    'Through shared conversations and cherished moments, our bond continued to grow.',
    'With gratitude to Allah and the blessings of our families, we chose to walk together in marriage.',
    'And now, with love in our hearts, we begin this new chapter together, hand in hand, for a lifetime.'
  ],
  program: [
    { n: 'Ceremony', t: '5:00 PM' }, { n: 'Pictures', t: '6:30 PM' }, { n: 'Reception', t: '7:00 PM' },
    { n: 'Cake & Toast', t: '8:00 PM' }, { n: 'Dancing', t: '8:10 – 9:00 PM' }
  ],
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbwWKhtDzrl-jw1oy_9MkU170qmrcU3hU17FbCQxQguoxgEkVSanFoyxkKYI92eNpxXD5w/exec',
  // Four story photos (arches). Put files in /public/photos and list them, e.g. '/photos/1.jpg'. Empty = gardenia crop.
  photos: ['', '', '', '']
}
