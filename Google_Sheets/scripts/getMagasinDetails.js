function getMagasinDetails(id) {
  if (typeof id !== "number") {
    console.error("Paramètres invalides fournis à getMagasinDetails");
    return null;
  }

  const magasinData = getSheetDataByName(SHEET_DEF.MAGASIN.SHEET_NAME);
  const magasinIndex = getColumnIndex("MAGASIN", "ID");
  const magasin = magasinData.find((row) => row[magasinIndex] === id);

  if (magasin) {
    console.log(`Le magasin ${nom} existe dans la feuille magasin`);
    return {
      nom: magasin[getColumnIndex("MAGASIN", "NOM")],
      adresse: magasin[getColumnIndex("MAGASIN", "ADRESSE")],
      codePostal: magasin[getColumnIndex("MAGASIN", "CODE_POSTAL")],
      ville: magasin[getColumnIndex("MAGASIN", "VILLE")],
      delaisRecuperation:
        magasin[getColumnIndex("MAGASIN", "DELAIS_RECUPERATION")],
      telephone: formatNumeroTelephone(
        magasin[getColumnIndex("MAGASIN", "TELEPHONE")]
      ),
    };
  }

  console.error(`Le magasin ${nom} n'existe pas dans la feuille magasin`);
  return null;
}

function formatNumeroTelephone(numero) {
  // Convertir le nombre en chaîne de caractères
  var numeroString = numero.toString();

  // Vérifier si la longueur du numéro est correcte
  if (numeroString.length !== 9) {
    throw new Error("Le numéro doit comporter 9 chiffres.");
  }

  // Formater le numéro de téléphone
  var numeroFormate =
    "+33 (0) " +
    numeroString.substr(0, 1) +
    " " +
    numeroString.substr(1, 2) +
    " " +
    numeroString.substr(3, 2) +
    " " +
    numeroString.substr(5, 2) +
    " " +
    numeroString.substr(7, 2);

  return numeroFormate;
}
