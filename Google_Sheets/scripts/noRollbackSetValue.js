function noRollbackSetValue(range, value) {
  if (!range || typeof value === "undefined") {
    console.error("Paramètres invalides fournis à noRollbackSetValue");
    return;
  }

  // Définir la propriété de rollback
  PropertiesService.getScriptProperties().setProperty(
    "rollbackInProgress",
    "true"
  );

  // Obtenir le type de colonne
  const sheet = range.getSheet();
  const column = range.getColumn();
  const sheetName = sheet.getName().toUpperCase();
  const columnName = sheet.getRange(1, column).getValue().toUpperCase();

  const columnType = getColumnType(sheetName, columnName);

  switch (columnType) {
    case "date":
      if (typeof value === "string" && !isNaN(Date.parse(value))) {
        var dateValue = new Date(value);
        range.setValue(
          Utilities.formatDate(
            dateValue,
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
          )
        );
      } else if (Object.prototype.toString.call(value) === "[object Date]") {
        range.setValue(
          Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd")
        );
      } else if (!isNaN(value) && value > 0) {
        var numericDateValue = new Date((value - 25569) * 86400 * 1000);
        range.setValue(
          Utilities.formatDate(
            numericDateValue,
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
          )
        );
      } else {
        range.setValue(value);
      }
      break;

    case "boolean":
      range.setValue(Boolean(value));
      break;

    case "number":
      range.setValue(Number(value));
      break;

    case "string":
    default:
      range.setValue(value);
      break;
  }
}
