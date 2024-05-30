function createCalendarEvent(e, calendar) {
  var sheet = e.source.getActiveSheet();
  var editedRow = e.range.getRow();

  var currMagasin = getMagasinDetails(
    sheet.getRange(editedRow, TIRELIRE_COLUMNS.MAGASIN).getValue(),
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("magasin")
      .getDataRange()
      .getValues()
  );

  var currResponsable = getUserDetailsByName(
    sheet.getRange(editedRow, TIRELIRE_COLUMNS.RESPONSABLE).getValue(),
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("frere")
      .getDataRange()
      .getValues()
  );

  if (!currMagasin) {
    showAlert("Impossible de récupérer les informations du magasin");
    return null;
  }
  if (!currResponsable) {
    showAlert(
      "Impossible de récupérer les informations du responsable de cette tirelire"
    );
    return null;
  }

  var deadline = new Date();
  deadline.setDate(
    deadline.getDate() + parseInt(currMagasin.delaisRecuperation)
  );
  console.log(
    "La deadline pour recupere la tirelire du magasin " +
      currMagasin.nom +
      " est le " +
      deadline
  );

  var title = "Récupérer la tirelire";

  var startTime = new Date(deadline);
  startTime.setHours(8, 0, 0);

  var endTime = new Date(deadline);
  endTime.setHours(19, 0, 0);

  var options = {
    description:
      "السلام عليكم و رحمة الله و بركاته" +
      "\n\nMerci de récupérer la tirelire chez " +
      currMagasin.nom +
      "\n\nTel: " +
      currMagasin.telephone +
      "\n\n بارك الله فيكم",
    location:
      currMagasin.adresse +
      ", " +
      currMagasin.codePostal +
      ", " +
      currMagasin.ville,
    guests: currResponsable.email,
  };

  console.log("Création de l'événement en cours...");
  try {
    var event = calendar.createEvent(title, startTime, endTime, options);
    event
      .addPopupReminder(2880) // Trois jour avant
      .addPopupReminder(8640); // Une semaine avant

    console.log("Event ID: " + event.getId());
  } catch (error) {
    console.log("Error: " + error.toString());
    return null;
  }

  if (!event) {
    showAlert("Impossible de créer l'événement sur le calendrier");
    return null;
  } else {
    noRollbackSetValue(
      sheet.getRange(editedRow, TIRELIRE_COLUMNS.ID_EVENT),
      event.getId()
    );
    return event;
  }
}
