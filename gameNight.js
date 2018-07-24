
var violet = require('violet').script();
var violetStoreSF = require('violet/lib/violetStoreSF')(violet);

violetStoreSF.store.propOfInterest = {
  'Game_night': ['userid', 'day', 'time', 'duration', 'game', 'food']
}

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

var app = {
  getPastGameNights: (response)=>{
    return response.load({objName: 'Game_night', filter: 'day < TODAY'}).then((results)=>{
      if (results.length == 0) {
        response.say(`Sorry, I did not have anything scheduled`);
      } else {
        response.say(`I had a game night scheduled on ${results[0].day} at ${results[0].time} where you played ${results[0].game}`);
      }
    });
  },
  getUpcomingGameNights: (response)=>{
    return response.load({objName: 'Game_night', filter: 'day > TODAY'}).then((results)=>{
      if (results.length == 0) {
        response.say(`Sorry, I do not have anything scheduled`);
      } else {
        response.say(`I have a game night scheduled on ${results[0].day} at ${results[0].time} to play ${results[0].game}`);
      }
    });
  },
  createGameNight: (response)=>{
    return response.store('Game_night', {
      userid: response.get('userId'),
      time: response.get('time'),
      duration: response.get('duration'),
      game: response.get('game'),
      food: response.get('food')
    });
  }
}
violet.addFlowScript(`
<app>
  <choice id="launch">
    <expecting>What can you do</expecting>
    <say>I can help you with planning Game Nights</say>
  </choice>

  <choice id="list">
    <expecting>What game nights have already been planned</expecting>
    <say>Sure</say>
    <decision>
      <prompt>Would you like to hear of game nights that are upcoming or in the past</prompt>
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

  <dialog id="create" elicit="[[dialog.nextReqdParam()]]">
    <expecting>I'm looking to organize a game night {this [[day]]|}</expecting>
    <item name="day">
      <prompt>What day would you like it to be on?</prompt>
      <expecting>{I'd like it to be]} this [[day]]</expecting>
    </item>
    <item name="time">
      <prompt>When would you like to start it?</prompt>
      <expecting>[[time]] pm</expecting>
    </item>
    <item name="duration">
      <prompt>How long would you like it to be?</prompt>
      <expecting>[[duration]] hours</expecting>
    </item>
    <item name="game">
      <prompt>What would you like the main game to be</prompt>
      <expecting>[[game]]</expecting>
    </item>
    <item name="food">
      <prompt>Do you want snacks, lunch or dinner?</prompt>
      <expecting>{everyone wants|} [[snacks]]</expecting>
    </item>
    <if value="[[response.dialog.hasReqdParams()]]">
      <resolve value="[[app.createGameNight(response)]]">
        <say>Great, you are all set</say>
      </resolve>
    </if>
  </dialog>

  <choice id="update">
    <expecting>Update</expecting>
    <expecting>Delete</expecting>
    <say>...</say>
  </choice>
  
</app>`, {app});
