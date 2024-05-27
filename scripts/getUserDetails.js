function getUserDetailsByMail(email, frereData) {
    for (var i = 1; i < frereData.length; i++) {
        if (frereData[i][2] == email) {
            console.log(
                "Le frère " + email + " existe dans la liste des utilisateurs"
            );
            return {
                nom: frereData[i][0],
                prenom: frereData[i][1],
                role: frereData[i][4]
            };
        }
    }
    console.log(
        "Le frère " + email + " n'existe pas dans la liste des utilisateurs"
    );
    return null;
}

function getUserDetailsByName(fullName, frereData) {
    for (var i = 1; i < frereData.length; i++) {
        frereDataFullName = frereData[i][0] + ' ' + frereData[i][1]
        if (frereDataFullName == fullName) {
            console.log(
                "Le frère " + fullName + " existe dans la liste des utilisateurs"
            );
            return {
                nom: frereData[i][0],
                prenom: frereData[i][1],
                email: frereData[i][2],
                role: frereData[i][4]
            };
        }
    }
    console.log(
        "Le frère " + fullName + " n'existe pas dans la liste des utilisateurs"
    );
    return null;
}