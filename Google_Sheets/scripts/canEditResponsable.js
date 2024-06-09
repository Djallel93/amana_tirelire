function canEditResponsable(e, currentUser) {
  console.log(
    "Vérification si le frère " +
      e.user +
      " possède le droit de modifier le champs responsable..."
  );

  console.log("currentUser : " + JSON.stringify(currentUser));

  if (currentUser.role.toLowerCase() === "administrateur") {
    return true;
  }

  const newResponsable = e.value;
  const oldResponsable = e.oldValue;
  const expectedResponsable = currentUser.nom + " " + currentUser.prenom;

  console.log("newResponsable :" + newResponsable);
  console.log("oldResponsable :" + oldResponsable);
  console.log("expectedResponsable :" + expectedResponsable);

  // Un frère peut réattribuer sa tirelire a un autre frère
  if (oldResponsable === expectedResponsable) {
    return true;
  } else if (newResponsable === expectedResponsable) {
    // Un frère ne peut pas s'attribuer la tirelire d'un autre
    showAlert("Vous ne pouvez pas vous attribuer cette tirelire.");
    return false;
  } else if (oldResponsable !== expectedResponsable) {
    // Un frère ne peut pas réattribuer les tirelires des autres
    showAlert("Vous ne pouvez pas modifier cette tirelire.");
    return false;
  }

  return true;
}
