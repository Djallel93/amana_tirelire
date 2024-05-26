# SUIVIE DES TIRELIRES

## presentation

Ce projet a pour but d'automatiser la saisie des information des differentes tirelires.

## Installation en local

```shell
git clone https://github.com/Djallel93/amana_tirelire.git
```

Pour établir le lien avec Google App Script il faut avoir prealablement installé clasp


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

## Liens utiles

### Google Sheet

https://docs.google.com/spreadsheets/d/12vU-UwntsirFpH03dfijqU7SZ2VSaWiqXRCzGl0Fc5E/edit#gid=0

### Google App Script

https://script.google.com/u/0/home/projects/1nWWb_OKXsshbDaJ3jsTAoDOj3y7BU_I4QB2XIKu82RzwVxg4AXOCPFQ1