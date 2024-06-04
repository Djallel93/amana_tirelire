function noRollbackSetValue (range, value) {
  // Définir la propriété de rollback
  PropertiesService.getScriptProperties().setProperty(
    'rollbackInProgress',
    'true'
  )
  range.setValue(value)
}
