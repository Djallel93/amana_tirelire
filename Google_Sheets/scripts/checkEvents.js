function checkEvents() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    TIRELIRE_DEF.SHEET_NAME
  );
  var lastRow = sheet.getLastRow();

  var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
  var formID = FormApp.openByUrl(formUrl).getId();

  console.log("verification de la présence d'événements");

  for (var row = 2; row <= lastRow; row++) {
    var eventId = sheet.getRange(row, TIRELIRE_DEF.ID_EVENT).getValue();
    var dateRetrait = sheet.getRange(row, TIRELIRE_DEF.DATE_RETRAIT).getValue();

    var currMagasin = getMagasinDetails(
      sheet.getRange(row, TIRELIRE_DEF.MAGASIN).getValue(),
      SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(MAGASIN_DEF.SHEET_NAME)
        .getDataRange()
        .getValues()
    );

    var currResponsable = getUserDetailsByName(
      sheet.getRange(row, TIRELIRE_DEF.RESPONSABLE).getValue(),
      SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(FRERE_DEF.SHEET_NAME)
        .getDataRange()
        .getValues()
    );

    console.log("eventId : " + eventId);
    console.log("dateRetrait : " + dateRetrait);

    if (!eventId && !dateRetrait) {
      console.log(
        "Aucun événement n'a  été trouvé pour le magasin " +
          currMagasin.nom +
          " a la date du " +
          dateRetrait
      );
      return;
    }

    if (eventId && !dateRetrait) {
      var dateDepot = sheet.getRange(row, TIRELIRE_DEF.DATE_DEPOT).getValue();

      var dateRetraitTheo = new Date(dateDepot);
      dateRetraitTheo.setDate(
        dateRetraitTheo.getDate() + parseInt(currMagasin.delaisRecuperation)
      );

      var today = new Date();
      today.setHours(0, 0, 0, 0);

      console.log("TODAY : " + today);
      console.log("dateRetraitTheo : " + dateRetraitTheo);

      if (today.getTime() === dateRetraitTheo.getTime()) {
        try {
          var event = CalendarApp.getEventById(eventId);
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
            var formUrl =
              "https://docs.google.com/forms/d/e/" +
              formID +
              "/viewform?usp=pp_url&entry.2052962151=" +
              eventId;
            var subject = "Tirelire du magasin " + currMagasin.nom;
            var body =
              "Merci d'avoir recupere la tirelire. Veuillez remplir ce formulaire : " +
              formUrl;
            var options = {
              name: "AMANA",
              noReply: true,
            };
            try {
              MailApp.sendEmail(currResponsable.email, subject, body, options);
            } catch (error) {
              console.log("Échec de l'envoi du mail: " + error.toString());
            }
          } else {
            console.log("No event found with the given ID.");
          }
        } catch (error) {
          console.log(
            "Échec de la récupération du calendrier: " + error.toString()
          );
        }
      }
    }
  }
  return;
}
