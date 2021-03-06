
var violet = require('violet').script({invocationName:'game night'});
var utils = require('./dateUtils.js');


// An Extremely Simple Model
var model = {
    pastGameNights: [],
    futureGameNights: []
}

// The Controller
var app = {
  getPastGameNights: (response)=>{
    var results = model.pastGameNights;
    if (results.length == 0) {
      response.say(`Sorry, I did not have anything scheduled`);
    } else {
      var dt = results[0].startTime;
      response.say(`I had a game night scheduled on ${utils.getDayAndMonth(dt)} at ${utils.getTime(dt)} where ${results[0].game}  was played`);
    }
  },
  getUpcomingGameNights: (response)=>{
    var results = model.futureGameNights;
    if (results.length == 0) {
      response.say(`Sorry, I do not have anything scheduled`);
    } else {
      var dt = results[0].startTime;
      response.say(`I have a game night scheduled on ${utils.getDayAndMonth(dt)} at ${utils.getTime(dt)} to play ${results[0].game}`);
    }
  },
  createGameNight: (response)=>{
    model.futureGameNights.push({
      startTime: utils.calcDateInFuture(response.get('day'), response.get('time')),
      duration: parseInt(response.get('duration')),
      game: response.get('game'),
      food: response.get('food')
    });
  }
}

///////////////////////////////////
// The Voice Script
///////////////////////////////////

violet.addInputTypes({
  "day": {
    type: "dayType",
    values: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  "time": "number",
  "duration": "number",
  "game": "phrase",
  "food": "phrase",
});

violet.addFlowScript(`
<app>
  <choice id="launch">
    <expecting>What can you do?</expecting>
    <say>I can help you with planning Game Nights</say>
  </choice>

  <choice id="list">
    <expecting>What {game nights have|has} already been planned?</expecting>
    <expecting>Any plans?</expecting>
    <say>Let me see</say>
    <decision>
      <ask>Would you like to hear of game nights that are upcoming or in the past</ask>
      <choice>
        <expecting>{In the|} past</expecting>
        <resolve value="app.getPastGameNights(response)"/>
      </choice>
      <choice>
        <expecting>Upcoming</expecting>
        <resolve value="app.getUpcomingGameNights(response)"/>
      </choice>
    </decision>
  </choice>

  <dialog id="create" elicit="dialog.nextReqdParam()">
    <expecting>{I'm looking to|} organize a game night {this [[day]]|}?</expecting>
    <item name="day" required>
      <ask>What day would you like it to be on?</ask>
      <expecting>{I'd like it to be|} this [[day]]</expecting>
    </item>
    <item name="time" required>
      <ask>When would you like to start it?</ask>
      <expecting>[[time]] pm</expecting>
    </item>
    <item name="duration" required>
      <ask>How long would you like it to be?</ask>
      <expecting>[[duration]] hours</expecting>
    </item>
    <item name="game" required>
      <ask>What would you like the main game to be</ask>
      <expecting>{would like to play|how about} [[game]]</expecting>
    </item>
    <item name="food" required>
      <ask>Do you want snacks, lunch or dinner?</ask>
      <expecting>{everyone wants|I would like} [[food]]</expecting>
    </item>
    <resolve value="app.createGameNight(response)">
      <say>Great, you are all set</say>
    </resolve>
  </dialog>

  <choice id="update">
    <expecting>Update</expecting>
    <expecting>Delete</expecting>
    <say>...</say>
  </choice>

</app>`, {app});
