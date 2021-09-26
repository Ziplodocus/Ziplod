
function delSave(delName) {
    let row=0
    let playerObj;
    while (row < saveSlots.length) {
        let saveSlot = saveSlots[row][0];
        if (saveSlot !== '') {
        playerObj = JSON.parse(saveSlots[row][0]);
        if(delName.toLowerCase() === playerObj.name) {
            storageSheet.getRange('A'+(row+1)).clear();
            return
        }
        }
        row++
    }
    ui.alert('No save exists with that name!',ui.ButtonSet.OK)
}
  
function save(curPlayer) {
let emptyRow = [];
let saveData = '{"name": "'+ curPlayer.name +'", "health": '+ curPlayer.health + ', "streak": ' + curPlayer.streak + '}';
for (let row=0; row < saveSlots.length; row++) {
    if(saveSlots[row][0] !== '') {
    if(curPlayer.name.toLowerCase() == JSON.parse(saveSlots[row]).name.toLowerCase()) {
        storageSheet.getRange('A'+(row+1)).setValue(saveData); 
        return
    };
    }
    else {emptyRow.push(row)};
}
storageSheet.getRange('A'+(emptyRow[0]+1)).setValue(saveData);
}
  
function load(name) {
    let row=0;
    let full = true;
    while (row < saveSlots.length) {
        if (saveSlots[row] == '') full = false;
        else if (saveSlots[row] !== '') {
            let playerObj = JSON.parse(saveSlots[row][0]);
            if(name.toLowerCase() === playerObj.name.toLowerCase()) {
                return new Player(name,playerObj.health,playerObj.streak)
            };
        };
        row++
    };
    if (full) {
        let response = ui.prompt('Save slots full','Please type a name of a save slot to delete or press cancel to leave the simulator',ui.ButtonSet.OK_CANCEL);
        if(response === ui.Button.CANCEL) {throw 'The simulator has been cancelled'}
        else if (response === ui.Button.OK) {delSave(response); row =0}
        else {throw 'You did not choose a valid action'}
    }
    else return new Player(name,10,0);
}