function createCalendarEvent(sheet, editedRow, calendar, deadline) {
  if (!sheet || !calendar || typeof editedRow !== "number") {
    console.error("Paramètres invalides fournis à createCalendarEvent");
    return null;
  }

  const idMagasin = sheet
    .getRange(editedRow, getRealColumnIndex("TIRELIRE", "ID_MAGASIN"))
    .getValue();
  const responsableNom = sheet
    .getRange(editedRow, getRealColumnIndex("TIRELIRE", "RESPONSABLE"))
    .getValue();

  const currMagasin = getMagasinDetails(idMagasin);

  const currTirelireResponsable = getUserDetailsByName(responsableNom);

  if (!currMagasin) {
    console.error("Impossible de récupérer les informations du magasin");
    return null;
  }

  if (!currTirelireResponsable) {
    console.error(
      "Impossible de récupérer les informations du responsable de cette tirelire"
    );
    return null;
  }
  const currMagasinResponsable = getUserDetailsByName(currMagasin.responsable);

  const listDestinataires = [
    currTirelireResponsable.email,
    currMagasinResponsable.email,
  ];

  deadline = deadline || new Date();
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
    guests: listDestinataires.join(","),
  };

  console.log("Création de l'événement en cours...");
  try {
    var event = calendar.createEvent(title, startTime, endTime, options);
    event
      .addPopupReminder(120) // Deux heures avant
      .addPopupReminder(1440) // Un jour avant
      .addPopupReminder(10080); // Une semaine avant

    console.log("Event ID: " + event.getId());
    return event;
  } catch (error) {
    console.error(
      "La création de l'événement sur le calendrier a échoué: " +
        error.toString()
    );
    return null;
  }
}
