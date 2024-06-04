function canEditResponsable (e, currentUser) {
  console.log(
    'Vérification si le frère ' +
      e.user +
      ' possède le droit de modifier le champs responsable...'
  )

  console.log('currentUser : ' + JSON.stringify(currentUser))

  const newResponsable = e.value
  const oldResponsable = e.oldValue
  const expectedResponsable = currentUser.nom + ' ' + currentUser.prenom

  console.log('newResponsable :' + newResponsable)
  console.log('oldResponsable :' + oldResponsable)
  console.log('expectedResponsable :' + expectedResponsable)

  // Un frère peut réattribuer sa tirelire a un autre frère
  if (oldResponsable === expectedResponsable) {
    console.log(
      'Le frère ' +
        e.user +
        ' possède le droit de modifier le champs responsable...'
    )
    return true
  } else if (newResponsable === expectedResponsable) {
    // Un frère ne peut pas s'attribuer la tirelire d'un autre
    noRollbackSetValue(e.range, e.oldValue)
    showAlert('Vous ne pouvez pas vous attribuer cette tirelire.')
    return false
  } else if (oldResponsable != expectedResponsable) {
    // Un frère ne peut pas réattribuer les tirelires des autres
    noRollbackSetValue(e.range, e.oldValue)
    showAlert('Vous ne pouvez pas modifier cette tirelire.')
    return false
  }

  console.log(
    'Le frère ' +
      e.user +
      ' possède le droit de modifier le champs responsable...'
  )
  return true
}
