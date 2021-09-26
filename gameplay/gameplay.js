


function letsGame(message) {}

function yesTest () {
  console.log(randomEncounter(Encounters).option1.init)
}

// an object containing all possible encounters and their possible choices assigned to outcomes for those choices
const Encounters = [
  {
    text: 'You trip. Ouch. \n Push through or fix up?', 
    option1 : {init: "push", check: 8, pass: {text: 'You manage to carry on through the pain', effect: player => player }, fail: {text: 'The pain is a lot. \n -2 health', effect : player => player.damage(2)}},
    option2: {init: "fix", check:10, pass: {text: 'You actually feel better than before. \n +3 health', effect: player => player.heal(3)}, fail: {text: 'You\'ve decided you had to amputate, bye bye foot. \n -5 health', effect: player => player.damage(5)}}
  },
  {
    text: 'You drop a pricey bottle. \n Take responsibility or blame someone else?',
    option1: {init: 'responsibility', check: '5', pass: {text:'Oh well, shit happens', effect: player => player}, fail: {text: 'The shame will be with you forever', effect: player => player.damage(3)}}, 
    option2: {init: 'blame', check: '16', pass: {text:'Huzzah, you successfully blamed someone else and now they\'re fired!', effect: player => player}, fail: {text: 'You try and blame your boss. Yeah... \n -1 health', effect: player => player.damage(1)}}
  }
  /*
  {
    text: '', 
    option1: {init: '', check: '', pass: {text:'', effect: heal()}, fail: {text: '', effect: takeDamage()}}, 
    option2: {init: '', check: '', pass: {text:'', effect: heal()}, fail: {text: '', effect: takeDamage()}}
  },
  */
];

function resolvePrompt(option,specificEncounter,currentPlayer) {
  if (roll20() > specificEncounter[option].check) {
    ui.alert(specificEncounter[option].pass.text);
    specificEncounter[option].pass.effect(currentPlayer);
  }
  else {
    ui.alert(specificEncounter[option].fail.text);
    specificEncounter[option].fail.effect(currentPlayer);
  }
  
};

//Handy to have defined globally as they will not change and be used frequently
const storageSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('storage');
const saveSlots = storageSheet.getRange('A1:A20').getValues();
const roll20 = () => Math.floor(Math.random()*21);
const ui = SpreadsheetApp.getUi();
const randomEncounter = encounterList => encounterList[Math.floor(Math.random()*(encounterList.length))];

//The main function runs a loop of encounters until manually quit or Player.health has reached 0
function play() {
    
  //retrieves a name input by the player and loads their save, or creates a new Player
  const name = ui.prompt('What is your name sir?').getResponseText();
  const currentPlayer = load(name);
  
  //If a new save then welcome is slightly different
  if (currentPlayer.streak !== 0) {ui.alert('Welcome back '+name+', may you continue healthily, your current streak is '+currentPlayer.streak)}
  else {ui.alert('Welcome, '+name+', to the encounter simulator where nothing can go wrong!')};
  
  //variabales to control loop conditions, specific condition is set as one random encounter in case non progressive responses are selected
  let doContinue = true;
  let specificEncounter;
  
  //main loop that generates a random encounter also contains another loop that handles responses to the specific encounter. Also handles player health reaching 0 and incrementing the streak
  while (doContinue) {
    specificEncounter = randomEncounter(Encounters);  
    let loopEncounter = true;
    
    //loops the one encounter until it has been resolved, or the player quits with exit
    while(loopEncounter) {
      var response = ui.prompt('Another Encounter!',specificEncounter.text,ui.ButtonSet.OK);
      var responseText = response.getResponseText();
      var responseButton = response.getSelectedButton();
      var rePre =responseText.split(' ')[0];
      var reAft =responseText.slice(rePre.length+1);
      
      // handles different cases of response to the prompt containing the encounter description
      switch (rePre) {
        case 'delete' :
          let delConfirm = ui.alert('Delete '+reAft+'..?','Are you sure you wish to delete this save?',ui.ButtonSet.YES_NO);
          if(delConfirm === ui.Button.YES) delSave(reAft);
          break
        case 'exit' :
          doContinue = false;
          save(currentPlayer);
          loopEncounter = false;
          return
        case 'help' :
          ui.alert('Your options are: \n "exit" - Saves and exits the simulator \n "delete <name>" - Deletes the save of the given name')
          break
        case specificEncounter.option1.init :
          resolvePrompt('option1',specificEncounter,currentPlayer);
          loopEncounter = false;
          break
        case specificEncounter.option2.init :
          resolvePrompt('option2',specificEncounter,currentPlayer);
          loopEncounter = false;
          break
        default :
          ui.alert('Please enter a valid response','Your options are: \n "exit" - Saves and exits the simulator \n "delete <name>" - Deletes the save of the given name',ui.ButtonSet.OK);
          break
      };
    }
    if (currentPlayer.health <= 0) {
      ui.alert('You Died','Darn! What a bummer!',ui.ButtonSet.OK);
      delSave(currentPlayer.name);
      //add code to save the top scores
      return
    }
    currentPlayer.incrementStreak();
  }
}

