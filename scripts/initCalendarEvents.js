function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp, SlidesApp or FormApp.
  ui.createMenu("Fonctions Personnalisées")
    .addItem("Initialisation des événement", "initCalendarEvents")
    // .addSeparator()
    // .addSubMenu(ui.createMenu('Sub-menu')
    //     .addItem('Second item', 'menuItem2'))
    .addToUi();
}

function initCalendarEvents() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tirelire");
  var lastRow = sheet.getLastRow();

  console.log("Récupération de l'ID du calendrier de l'utilisateur");
  var calendar = CalendarApp.getDefaultCalendar();

  for (var row = 2; row <= lastRow; row++) {
    var dateRetrait = sheet
      .getRange(row, TIRELIRE_COLUMNS.DATE_RETRAIT)
      .getValue();

    var idEvent = sheet
      .getRange(row, TIRELIRE_COLUMNS.ID_EVENT)
      .getValue();

    if (dateRetrait || idEvent) {
      continue;
    }

    var currMagasin = getMagasinDetails(
      sheet.getRange(row, TIRELIRE_COLUMNS.MAGASIN).getValue(),
      SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName("magasin")
        .getDataRange()
        .getValues()
    );

    var currResponsable = getUserDetailsByName(
      sheet.getRange(row, TIRELIRE_COLUMNS.RESPONSABLE).getValue(),
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
      showAlert(
        "Impossible de récupérer les informations du responsable de cette tirelire"
      );
      return;
    }

    var deadline = sheet.getRange(row, TIRELIRE_COLUMNS.DATE_DEPOT).getValue();
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
      console.log("Event color: " + event.getColor());
    } catch (error) {
      console.log("Error: " + error.toString());
      return;
    }

    if (!event) {
      showAlert("Impossible de créer l'événement sur le calendrier");
      return;
    } else {
      noRollbackSetValue(
        sheet.getRange(row, TIRELIRE_COLUMNS.ID_EVENT),
        event.getId()
      );
    }
  }
  return;
}
