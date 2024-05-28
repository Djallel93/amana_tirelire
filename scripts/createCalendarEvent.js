function createCalendarEvent(e) {
  var sheet = e.source.getActiveSheet();
  var editedRow = e.range.getRow();

  console.log("Récupération de l'ID du calendrier de l'utilisateur");
  var calendar = CalendarApp.getDefaultCalendar();

  var currMagasin = getMagasinDetails(
    sheet.getRange(editedRow, tirelireColumns.magasin).getValue(),
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("magasin")
      .getDataRange()
      .getValues()
  );

  var currResponsable = getUserDetailsByName(
    sheet.getRange(editedRow, tirelireColumns.responsable).getValue(),
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("frere")
      .getDataRange()
      .getValues()
  );

  if (!currMagasin) {
    showAlert("Impossible de récupérer les informations du magasin");
    return;
  }
  if (!currResponsable) {
    showAlert("Impossible de récupérer les informations du responsable de cette tirelire");
    return;
  }

  var deadline = new Date();
  deadline.setDate(deadline.getDate() + parseInt(currMagasin.delaisRecuperation));
  console.log("La deadline pour recupere la tirelire est le " + deadline);

  var title = "Récupérer la tirelire"; // Titre de l'événement
  var options = {
    description: "Merci de récupérer la tirelire chez " + currMagasin.nom,
    location:
      currMagasin.adresse + ", " + currMagasin.codePostal + ", " + currMagasin.ville,
    guests: currResponsable.email,
  };

  console.log("Création de l'événement en cours...");
  try {
    var event = calendar.createAllDayEvent(title, deadline, options);
    event
      .addPopupReminder(1440) // Un jour avant
      .addPopupReminder(2880) // Trois jour avant
      .addPopupReminder(8640) // Une semaine avant;
      .setColor(CalendarApp.EventColor.RED);

    Logger.log("Event ID: " + event.getId());
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return;
  }

  if (!event) {
    showAlert("Impossible de créer l'événement sur le calendrier");
  } else {
    noRollbackSetValue(
      sheet.getRange(editedRow, tirelireColumns.id_event),
      event.getId()
    );
  }
}
