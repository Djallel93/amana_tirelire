function getMagasinDetails(nom, magasinData) {
  for (let i = 1; i < magasinData.length; i++) {
    if (magasinData[i][MAGASIN_DEF.NOM.INDEX - 1] == nom) {
      console.log("Le magasin " + nom + " existe dans la feuille magasin");
      return {
        nom: magasinData[i][MAGASIN_DEF.NOM.INDEX - 1],
        adresse: magasinData[i][MAGASIN_DEF.ADRESSE.INDEX - 1],
        codePostal: magasinData[i][MAGASIN_DEF.CODE_POSTAL.INDEX - 1],
        ville: magasinData[i][MAGASIN_DEF.VILLE.INDEX - 1],
        delaisRecuperation:
          magasinData[i][MAGASIN_DEF.DELAISRECUPERATION.INDEX - 1],
        telephone: formatNumeroTelephone(
          magasinData[i][MAGASIN_DEF.TELEPHONE.INDEX - 1]
        ),
      };
    }
  }
  console.error("Le magasin " + nom + " n'existe pas dans la feuille magasin");
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
