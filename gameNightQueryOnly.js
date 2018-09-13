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
}
violet.addFlowScript(`
<app>
  <choice id="launch">
    <expecting>What can you do</expecting>
    <say>I can help you with planning Game Nights</say>
  </choice>
  <choice id="list">
    <expecting>What {game nights have|has} already been planned</expecting>
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
  <choice id="update">
    <expecting>Update</expecting>
    <expecting>Delete</expecting>
    <say>...</say>
  </choice>

</app>`, {app});
