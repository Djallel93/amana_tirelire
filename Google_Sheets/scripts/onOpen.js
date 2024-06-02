function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Fonctions Personnalisées")
    .addItem("Initialisation des événement", "initCalendarEvents")
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu("Actions manuelles")
        .addItem("Reprogrammer une collecte", "manualReScheduleEvent")
        .addItem("Transférer la responsabilité", "manuelTransferResponsable")
    )
    .addToUi();
}

function initCalendarEvents() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    TIRELIRE_DEF.SHEET_NAME
  );
  var lastRow = sheet.getLastRow();

  console.log("Récupération de l'ID du calendrier de l'utilisateur");
  var calendar = CalendarApp.getDefaultCalendar();

  for (var row = 2; row <= lastRow; row++) {
    var dateRetrait = sheet.getRange(row, TIRELIRE_DEF.DATE_RETRAIT).getValue();

    var idEvent = sheet.getRange(row, TIRELIRE_DEF.ID_EVENT).getValue();

    if (dateRetrait || idEvent) {
      continue;
    }

    var event = createCalendarEvent(
      sheet,
      row,
      calendar,
      sheet.getRange(row, TIRELIRE_DEF.DATE_DEPOT).getValue()
    );

    if (!event) {
      showAlert(
        "Impossible de créer l'événement pour le magasin " +
          sheet.getRange(row, TIRELIRE_DEF.MAGASIN).getValue() +
          " a la date de dépôt du " +
          sheet.getRange(row, TIRELIRE_DEF.DATE_DEPOT).getValue() +
          " sur le calendrier."
      );
      return;
    } else {
      noRollbackSetValue(
        sheet.getRange(row, TIRELIRE_DEF.ID_EVENT),
        event.getId()
      );
    }
  }
  return;
}

function manualReScheduleEvent() {
  var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
  var formID = FormApp.openByUrl(formUrl).getId();
  var ui = SpreadsheetApp.getUi();
  var responseID = ui.prompt(
    "Id événement",
    "Veuillez renseigner l'ID de l'événement concerné",
    ui.ButtonSet.OK_CANCEL
  );

  if (responseID.getSelectedButton() == ui.Button.OK) {
    var url =
      "https://docs.google.com/forms/d/" +
      formID +
      "/viewform?usp=pp_url&entry.2052962151=" +
      responseID.getResponseText() +
      "&entry.1995875835=Non&entry.1439777403=Non" +
      "&entry.833798931=Oui";
    showAnchor("Reprogrammer l'événement", url);
  }
}

function manuelTransferResponsable() {
  var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
  var formID = FormApp.openByUrl(formUrl).getId();
  var ui = SpreadsheetApp.getUi();
  var responseID = ui.prompt(
    "Id événement",
    "Veuillez renseigner l'ID de l'événement concerné",
    ui.ButtonSet.OK_CANCEL
  );

  var url =
    "https://docs.google.com/forms/d/" +
    formID +
    "/viewform?usp=pp_url&entry.2052962151=" +
    responseID.getResponseText() +
    "&entry.1995875835=Non&entry.1439777403=Non" +
    "&entry.833798931=Non&entry.1111832661=Oui";
  showAnchor("Transférer le responsable", url);
}

function showAnchor(name, url) {
  var template = HtmlService.createTemplateFromFile("formsLink");
  template.name = name;
  template.url = url;
  var htmlOutput = template.evaluate().setWidth(300).setHeight(200);
  SpreadsheetApp.getUi().showModelessDialog(
    htmlOutput,
    "Lien vers le formulaire"
  );
}
