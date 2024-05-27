// function createCalendarEvent(magasin, date, email) {
//   var calendar = CalendarApp.getDefaultCalendar();

//   var magasin = getMagasinDetails(
//     'M1',
//     SpreadsheetApp.getActiveSpreadsheet()
//       .getSheetByName("magasin")
//       .getDataRange()
//       .getValues()
//   );
  
//   var email = "bigdjallel@gmail.com";
//   var date = new Date();

//   var title = "Récupérer la tirelire"; // Titre de l'événement
//   var options = {
//     description: "Merci de récupérer la tirelire chez " + magasin.nom,
//     location:
//       magasin.adresse + ", " + magasin.codePostal + ", " + magasin.ville,
//     guests: email,
//   };

//   var event = calendar.createAllDayEvent(title, date, options);
//   event
//     .addPopupReminder(1440) // Un jour avant
//     .addPopupReminder(4320)// Trois jour avant
//     .addPopupReminder(10080)// Une semaine avant;
// }

function createCalendarEvent(magasin, date, email) {
  console.log("Récupération de l'ID du calendrier de l'utilisateur");
  var calendar = CalendarApp.getDefaultCalendar();
  
  var title = "Récupérer la tirelire"; // Titre de l'événement
  var options = {
    description: "Merci de récupérer la tirelire chez " + magasin.nom,
    location:
    magasin.adresse + ", " + magasin.codePostal + ", " + magasin.ville,
    guests: email,
  };
  
  console.log("Création de l’événement en cours...");
  var event = calendar.createAllDayEvent(title, date, options);

  console.log("Ajout des rappels...");
  event
    .addPopupReminder(1440) // Un jour avant
    .addPopupReminder(2880)// Trois jour avant
    .addPopupReminder(8640)// Une semaine avant;
}
