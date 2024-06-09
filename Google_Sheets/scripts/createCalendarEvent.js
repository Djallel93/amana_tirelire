function createCalendarEvent(sheet, editedRow, calendar, deadline) {
  const currMagasin = getMagasinDetails(
    sheet.getRange(editedRow, TIRELIRE_DEF.MAGASIN.INDEX).getValue(),
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName(MAGASIN_DEF.SHEET_NAME)
      .getDataRange()
      .getValues()
  );

  const currResponsable = getUserDetailsByName(
    sheet.getRange(editedRow, TIRELIRE_DEF.RESPONSABLE.INDEX).getValue()
  );

  if (!currMagasin) {
    console.error("Impossible de récupérer les informations du magasin");
    return null;
  }
  if (!currResponsable) {
    console.error(
      "Impossible de récupérer les informations du responsable de cette tirelire"
    );
    return null;
  }

  if (!deadline) {
    var deadline = new Date();
  }

  deadline.setDate(
    deadline.getDate() + parseInt(currMagasin.delaisRecuperation)
  );

  console.log(
    "La deadline pour recupere la tirelire du magasin " +
      currMagasin.nom +
      " est le " +
      deadline
  );

  const title = "Récupérer la tirelire";

  const startTime = new Date(deadline);
  startTime.setHours(8, 0, 0);

  const endTime = new Date(deadline);
  endTime.setHours(19, 0, 0);

  const options = {
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
      .addPopupReminder(120) // Deux heures avant
      .addPopupReminder(1440) // Un jour avant
      .addPopupReminder(10080); // Une semaine avant

    console.log("Event ID: " + event.getId());
  } catch (error) {
    console.error("La création de l'événement sur le calendrier a échouée: " + error.toString());
    return null;
  }

  if (!event) {
    console.error("Impossible de créer l'événement sur le calendrier");
    return null;
  } else {
    return event;
  }
}
