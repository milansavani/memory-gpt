// eslint-disable-next-line no-extend-native, func-names
Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

// eslint-disable-next-line no-extend-native, func-names
Date.prototype.getDayOfWeek = function () {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[this.getDay()];
};

const currentDate = new Date();

const eventData = {
  events: [
    {
      activityType: 'challenge',
      activityName: 'Chalk Art Challenge',
      activityImage: 'https://cdn-icons-png.flaticon.com/512/10213/10213092.png',
      description: 'Show us your best shadow art!',
      likePercent: 0.8,
      tags: 'survey day;art;stream;creative',
      attributes: [
        {
          attributeType: 'multiSelect',
          icon: 'https://cdn-icons-png.flaticon.com/512/6098/6098680.png',
          displayName: 'Suggested Age Range:',
          value: 'Toddler;Kid;Child',
        },
        {
          attributeType: 'singleSelect',
          icon: 'https://cdn-icons-png.flaticon.com/512/74/74742.png',
          displayName: 'Cost:',
          value: 'Up to $10',
        },
        {
          attributeType: 'location',
          icon: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
          displayName: 'Home',
          value: {
            lat: 21.170240,
            long: 72.831062,
          },
        },
        {
          attributeType: 'hoursOfOperation',
          icon: 'https://cdn-icons-png.flaticon.com/512/992/992700.png',
          displayName: 'Time of Day:',
          value: [
            {
              startTime: currentDate,
              endTime: new Date(currentDate).addHours(4),
              dayOfWeek: new Date(currentDate).getDayOfWeek(),
            },
          ],
        },
        {
          attributeType: 'singleSelect',
          icon: 'https://cdn-icons-png.flaticon.com/512/65/65061.png',
          displayName: 'Difficulty Level:',
          value: 'Easy',
        },
        {
          attributeType: 'phoneNumber',
          icon: 'https://cdn-icons-png.flaticon.com/512/597/597177.png',
          displayName: 'Home:',
          value: '+1 (456) 897-1234',
        },
      ],
      notes: [
        {
          noteType: 'textBlob', // ,textBlob, orderedList, unorderedList, dictionary
          displayName: 'Materials',
          value: 'Chalk, Paints, Decorations',
        },
        {
          noteType: 'orderedList',
          displayName: 'Instructions',
          value: 'Choose a light blue chalk to draw the ocean background.; Cover a large area of the pavement with smooth, horizontal strokes to represent the surface of the water.; Use a darker blue chalk to draw wavy lines across the top of the light blue background to represent ocean waves.; Make the waves by creating curved lines with peaks and troughs.', // ";" separator value
        },
        {
          noteType: 'unorderedList',
          displayName: 'Notes',
          value: 'Choose a brown chalk to draw the seabed at the bottom of the ocean.;Create a horizontal line near the lower part of the drawing to represent the ocean floor.Use various colors to draw sea creatures like fish, turtles, and starfish.;Draw fish with simple oval shapes, turtles with a combination of circles and ovals, and starfish with multiple arms radiating from a central point.', // ";" separator value
        },
        {
          noteType: 'dictionary',
          displayName: 'Take Care',
          value: 'Notes: Clean your hands with a damp cloth or sponge.;', // ";" separator value and then ":" separator for the Key and value display
        },
      ],
    },
  ],
};

export default eventData;
