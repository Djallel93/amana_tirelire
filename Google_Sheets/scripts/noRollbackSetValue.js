function noRollbackSetValue(range, value, columnType) {
  // Définir la propriété de rollback
  PropertiesService.getScriptProperties().setProperty(
    "rollbackInProgress",
    "true"
  );

  Logger.log("Object type: " + Object.prototype.toString.call(value));
  Logger.log("Column type: " + columnType);

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

function getColumnType(sheetName, column) {
  console.log("sheetName : " + sheetName);
  console.log("column : " + column);

  let sheetDefs = [FRERE_DEF, MAGASIN_DEF, TIRELIRE_DEF];
  let columnType;

  for (let sheetDef of sheetDefs) {
    if (sheetDef.SHEET_NAME === sheetName) {
      for (let key in sheetDef) {
        if (sheetDef[key].INDEX === column) {
          columnType = sheetDef[key].TYPE;
          console.log("columnType : " + columnType);
          break;
        }
      }
      if (columnType) break;
    }
  }

  return columnType;
}
