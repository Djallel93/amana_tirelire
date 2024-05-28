# SUIVIE DES TIRELIRES

## présentation

Ce projet a pour but d'automatiser la saisie des information des différentes tirelires.

## Installation en local

```shell
git clone https://github.com/Djallel93/amana_tirelire.git
```

Pour établir le lien avec Google App Script il faut avoir préalablement installé **clasp**

```shell
sudo apt update
sudo apt upgrade
sudo apt install npm
sudo npm install -g @google/clasp
```

Il faut ensuite activer le [Google Apps Script API](https://script.google.com/home/usersettings)

![alt text](<images/Enable Apps Script API.gif>)

Enfin, il faut s'authentifier avec votre compte Google

```shell
clasp login
```

## Utilisation du rapport

1. Installer **Power BI Desktop** depuis le [Microsoft Store](ms-windows-store://?referrer=storeforweb)
![Microsoft Store](images/MS_store_pbi.png)
2. Ouvrir le fichier Track_tirelire.pbip dans le répertoire **/pbip**
3. Rafraîchir le rapport en cliquant sur **Actualiser**
![Actualiser](images/pbi_refresh.png)
4. Si la carte ne s'affiche pas correctement vérifier que le rapport a biens les autorisations nécessaires. pour ce faire :
   * Aller dans File > Option and settings > Options
   * Vérifier que la case est bien cochée
  ![activate map](images/activate_map.png)

## Liens utiles

### Google Sheets

<https://docs.google.com/spreadsheets/d/12vU-UwntsirFpH03dfijqU7SZ2VSaWiqXRCzGl0Fc5E/edit#gid=0>

### Google App Script

<https://script.google.com/u/0/home/projects/1nWWb_OKXsshbDaJ3jsTAoDOj3y7BU_I4QB2XIKu82RzwVxg4AXOCPFQ1>
