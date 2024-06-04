function onOpen () {
  const ui = SpreadsheetApp.getUi()
  ui.createMenu('Fonctions Personnalisées')
    .addItem('Initialisation des événement', 'initCalendarEvents')
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu('Actions manuelles')
        .addItem('Reprogrammer une collecte', 'manualReScheduleEvent')
        .addItem('Transférer la responsabilité', 'manuelTransferResponsable')
    )
    .addToUi()
}

function initCalendarEvents () {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    TIRELIRE_DEF.SHEET_NAME
  )
  const lastRow = sheet.getLastRow()

  console.log('Récupération de l\'ID du calendrier de l\'utilisateur')
  const calendar = CalendarApp.getDefaultCalendar()

  for (let row = 2; row <= lastRow; row++) {
    const dateRetrait = sheet.getRange(row, TIRELIRE_DEF.DATE_RETRAIT).getValue()

    const idEvent = sheet.getRange(row, TIRELIRE_DEF.ID_EVENT).getValue()

    if (dateRetrait || idEvent) {
      continue
    }

    const event = createCalendarEvent(
      sheet,
      row,
      calendar,
      sheet.getRange(row, TIRELIRE_DEF.DATE_DEPOT).getValue()
    )

    if (!event) {
      showAlert(
        'Impossible de créer l\'événement pour le magasin ' +
          sheet.getRange(row, TIRELIRE_DEF.MAGASIN).getValue() +
          ' a la date de dépôt du ' +
          sheet.getRange(row, TIRELIRE_DEF.DATE_DEPOT).getValue() +
          ' sur le calendrier.'
      )
      return
    } else {
      noRollbackSetValue(
        sheet.getRange(row, TIRELIRE_DEF.ID_EVENT),
        event.getId()
      )
    }
  }
}

function manualReScheduleEvent () {
  const formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl()
  const formID = FormApp.openByUrl(formUrl).getId()
  const ui = SpreadsheetApp.getUi()
  const responseID = ui.prompt(
    'Id événement',
    'Veuillez renseigner l\'ID de l\'événement concerné',
    ui.ButtonSet.OK_CANCEL
  )

  if (responseID.getSelectedButton() === ui.Button.OK) {
    const url =
      'https://docs.google.com/forms/d/' +
      formID +
      '/viewform?usp=pp_url&entry.2052962151=' +
      responseID.getResponseText() +
      '&entry.1995875835=Non&entry.1439777403=Non' +
      '&entry.833798931=Oui'
    showAnchor('Reprogrammer l\'événement', url)
  }
}

function manuelTransferResponsable () {
  const formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl()
  const formID = FormApp.openByUrl(formUrl).getId()
  const ui = SpreadsheetApp.getUi()
  const responseID = ui.prompt(
    'Id événement',
    'Veuillez renseigner l\'ID de l\'événement concerné',
    ui.ButtonSet.OK_CANCEL
  )

  const url =
    'https://docs.google.com/forms/d/' +
    formID +
    '/viewform?usp=pp_url&entry.2052962151=' +
    responseID.getResponseText() +
    '&entry.1995875835=Non&entry.1439777403=Non' +
    '&entry.833798931=Non&entry.1111832661=Oui'
  showAnchor('Transférer le responsable', url)
}

function showAnchor (name, url) {
  const template = HtmlService.createTemplateFromFile('formsLink')
  template.name = name
  template.url = url
  const htmlOutput = template.evaluate().setWidth(300).setHeight(200)
  SpreadsheetApp.getUi().showModelessDialog(
    htmlOutput,
    'Lien vers le formulaire'
  )
}
