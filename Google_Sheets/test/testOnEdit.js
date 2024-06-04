// tirelire récupéré par le bon user

const t = {
  user: Session.getActiveUser().getEmail(),
  source: SpreadsheetApp.getActiveSpreadsheet(),
  range: SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(TIRELIRE_DEF.SHEET_NAME)
    .getRange('E2'),
  value: 'TRUE',
  authMode: 'LIMITED'
}

// tirelire récupéré par le mauvais user

// const t = {
//   user: 'bouakkaz.adel@gmail.com',
//   source: SpreadsheetApp.getActiveSpreadsheet(),
//   range: SpreadsheetApp.getActiveSpreadsheet().getSheetByName('tirelire').getRange('E2'),
//   value: 'TRUE',
//   authMode: "LIMITED"
// }

// reponsable modifie par le bon user

// const t = {
//   user: Session.getActiveUser().getEmail(),
//   source: SpreadsheetApp.getActiveSpreadsheet(),
//   range: SpreadsheetApp.getActiveSpreadsheet().getSheetByName('tirelire').getRange('G2'),
//   value: 'BOUAKKAZ Adel',
//   oldValue: 'BOUAKKAZ Djallel Eddine'
//   authMode: "LIMITED"
// }

function testOnEdit () {
  onEdit(t)
}
