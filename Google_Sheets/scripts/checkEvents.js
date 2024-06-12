function checkEvents() {
  const sheet = getSheetByName(SHEET_DEF.TIRELIRE.SHEET_NAME);

  var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();

  if (!formUrl) {
    console.error("Aucune URL de formulaire associée à la feuille de calcul");
    return;
  }

  const formID = FormApp.openByUrl(formUrl).getId();

  console.log("Vérification de la présence d'événements");

  const rows = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
    .getValues();

  rows.forEach((row) => {
    const eventId = row[getColumnIndex("TIRELIRE", "ID_EVENT")];
    const dateRetrait = row[getColumnIndex("TIRELIRE", "DATE_RETRAIT")];
    const magasinNom = row[getColumnIndex("TIRELIRE", "MAGASIN")];
    const responsableNom = row[getColumnIndex("TIRELIRE", "RESPONSABLE")];

    const currMagasin = getMagasinDetails(magasinNom);
    if (!currMagasin) {
      console.error(
        "Impossible de récupérer les informations du magasin : " + magasinNom
      );
      return;
    }

    const currResponsable = getUserDetailsByName(responsableNom);
    if (!currResponsable) {
      console.error(
        "Impossible de récupérer les informations du responsable : " +
          responsableNom
      );
      return;
    }

    console.log("eventId : " + eventId);
    console.log("dateRetrait : " + dateRetrait);

    if (!eventId && !dateRetrait) {
      console.error(
        "Aucun événement n'a été trouvé pour le magasin " +
          currMagasin.nom +
          " à la date du " +
          dateRetrait
      );
      return;
    }

    if (eventId && !dateRetrait) {
      const dateDepot = row[getColumnIndex("TIRELIRE", "DATE_DEPOT")];
      const dateRetraitTheo = new Date(dateDepot);
      dateRetraitTheo.setDate(
        dateRetraitTheo.getDate() + parseInt(currMagasin.delaisRecuperation)
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      console.log("TODAY : " + today);
      console.log("dateRetraitTheo : " + dateRetraitTheo);

      if (today.getTime() === dateRetraitTheo.getTime()) {
        try {
          const event = CalendarApp.getEventById(eventId);
          if (event) {
            console.log(
              "La tirelire du magasin " +
                currMagasin.nom +
                " a dû être récupérée aujourd'hui."
            );
            console.log(
              "Envoi du formulaire au frère " +
                currResponsable.nom +
                " " +
                currResponsable.prenom
            );

            const formUrl =
              "https://docs.google.com/forms/d/" +
              formID +
              "/viewform?usp=pp_url&entry.2052962151=" +
              eventId;
            const subject = "Tirelire du magasin " + currMagasin.nom;
            const body =
              "Merci d'avoir récupéré la tirelire. Veuillez remplir ce formulaire : \n\n" +
              formUrl;
            const options = {
              name: "AMANA",
              noReply: true,
            };

            try {
              MailApp.sendEmail(currResponsable.email, subject, body, options);
            } catch (error) {
              console.error("Échec de l'envoi du mail: " + error.toString());
            }
          } else {
            console.error("Aucun événement n'a été trouvé pour cet ID");
          }
        } catch (error) {
          console.error(
            "Échec de la récupération du calendrier: " + error.toString()
          );
        }
      }
    }
  });
}
