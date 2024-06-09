function checkEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    TIRELIRE_DEF.SHEET_NAME
  );
  const lastRow = sheet.getLastRow();

  var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
  const formID = FormApp.openByUrl(formUrl).getId();

  console.log("Vérification de la présence d'événements");

  for (let row = 2; row <= lastRow; row++) {
    const eventId = sheet.getRange(row, TIRELIRE_DEF.ID_EVENT.INDEX).getValue();
    const dateRetrait = sheet
      .getRange(row, TIRELIRE_DEF.DATE_RETRAIT.INDEX)
      .getValue();

    const currMagasin = getMagasinDetails(
      sheet.getRange(row, TIRELIRE_DEF.MAGASIN.INDEX).getValue(),
      SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(MAGASIN_DEF.SHEET_NAME)
        .getDataRange()
        .getValues()
    );

    const currResponsable = getUserDetailsByName(
      sheet.getRange(row, TIRELIRE_DEF.RESPONSABLE.INDEX).getValue()
    );

    console.log("eventId : " + eventId);
    console.log("dateRetrait : " + dateRetrait);

    if (!eventId && !dateRetrait) {
      console.error(
        "Aucun événement n'a  été trouvé pour le magasin " +
          currMagasin.nom +
          " à la date du " +
          dateRetrait
      );
      return;
    }

    if (eventId && !dateRetrait) {
      const dateDepot = sheet
        .getRange(row, TIRELIRE_DEF.DATE_DEPOT.INDEX)
        .getValue();

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
  }
}
