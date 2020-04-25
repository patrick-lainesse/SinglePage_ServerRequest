/*
strings.js

Ensemble des fonctions javascript qui effectuent des manipulations sur les String pour faciliter
la transformation des textes des tableaux XML en texte affiché à l'écran
*/

// Afficher un message d'erreur
const erreur = () => alert("Dû à des effectifs réduits en cette période de pandémie, l'option sélectionnée n'a pu s'afficher correctement.");

// Pour mettre la première lettre d'un mot en majuscule
const majuscule = mot => mot.charAt(0).toUpperCase() + mot.slice(1);

// fonction pour convertir les dates numériques en dates alphabétiques
const dateMots = (annee, mois, jour) => {

    var lesMois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
        "août", "septembre", "octobre", "novembre", "décembre"];
    return jour + " " + lesMois[mois - 1] + " " + annee;
};


/* ==============================================================================================
                     MISE EN FORME DU TEXTE PROVENANT DU TABLEAU XML
============================================================================================== */

// Fonction carrefour qui redirige l'élément à mettre en format string vers la fonction appropriée
const mefTableau = (tag, cle) => {

    var texte;

    switch (tag) {
        case 'naissance':
        case 'admission':
        case 'sortie':
            texte = mefDate(tag, cle);
            break;
        case 'adresse':
            texte = mefAdresse(cle);
            break;
        case 'téléphone':
            texte = mefTelephone(cle);
            break;
        case 'code_postal':
            texte = mefCodePostal(cle);
            break;
        default: texte = "défaut";
    }
    return texte;
};

// Fonction qui met en forme dans un seul string les différents tags du fichier xml qui composent une date
const mefDate = (tag, cle) => {

    let texte = "";
    let cleDate = "";

    /* sélectionner le fichier xml d'où provient la date et la clé qui permet d'obtenir l'élément désiré du fichier
    dans le tableau des hospitalisations, il n'y a pas de clé primaire, donc on recherche le id attribué au tag
    hospitalisation */
    switch (tag) {
        case 'admission':
        case 'sortie':
            tableauXML = xmlHopitaux.getElementsByTagName('hospitalisation');
            cleDate = 'hospitalisation';
            break;
        case 'naissance':
            tableauXML = xmlHopitaux.getElementsByTagName('patient');
            cleDate = 'dossier';
            break;
        default:
            erreur();
            location.reload();
    }

    // parcourir le tableau XML pour trouver la date à mettre en forme
    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];
        let date;

        switch (tag) {
            case 'admission':
            case 'sortie':
                if (objet.getAttribute('id') === cle) {
                    date = objet.getElementsByTagName(tag)[0];

                    texte = dateMots(date.getElementsByTagName('année')[0].firstChild.nodeValue,
                        date.getElementsByTagName('mois')[0].firstChild.nodeValue,
                        date.getElementsByTagName('jour')[0].firstChild.nodeValue);
                }
                break;
            case 'naissance':
                if (objet.getElementsByTagName(cleDate)[0].firstChild.nodeValue === cle) {
                    date = objet.getElementsByTagName(tag)[0];

                    texte = dateMots(date.getElementsByTagName('année')[0].firstChild.nodeValue,
                        date.getElementsByTagName('mois')[0].firstChild.nodeValue,
                        date.getElementsByTagName('jour')[0].firstChild.nodeValue);
                }
                break;
        }
    }
    return texte;
};

// Fonction qui met en forme dans un seul string les différents tags du fichier xml qui composent une adresse
const mefAdresse = (cle) => {

    let tableauXML = xmlHopitaux.getElementsByTagName('hopital');
    let texte = "";

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];

        if (objet.getElementsByTagName('établissement')[0].firstChild.nodeValue === cle) {
            let adresse = objet.getElementsByTagName('adresse')[0];
            let tags = adresse.getElementsByTagName('*');
            for (let i = 0; i < tags.length - 1; i++) {
                texte += tags[i].firstChild.nodeValue + ", ";
            }
            texte += tags[tags.length - 1].firstChild.nodeValue;
        }
    }
    return texte;
};

// Fonction qui met en forme le numéro de téléphone sous un format (555) 555-5555
const mefTelephone = cle => {

    let tableauXML = xmlHopitaux.getElementsByTagName('hopital');
    let texte = "";

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];

        if (objet.getElementsByTagName('établissement')[0].firstChild.nodeValue === cle) {
            let telephone = objet.getElementsByTagName('téléphone')[0].firstChild.nodeValue;
            texte = "(" + telephone.substring(0,3) + ") " + telephone.substring(3, 6) + "-" + telephone.substring(6);
        }
    }
    return texte;
};

// Fonction qui met en forme le code postal en format H0H 0H0
const mefCodePostal = cle => {

    let tableauXML = xmlHopitaux.getElementsByTagName('hopital');
    let texte = "";

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];

        if (objet.getElementsByTagName('établissement')[0].firstChild.nodeValue === cle) {
            let codeP = objet.getElementsByTagName('code_postal')[0].firstChild.nodeValue;
            texte = codeP.substring(0,3) + " " + codeP.substring(3);
        }
    }
    return texte;
};

/* ==============================================================================================
                                    MENU SELECT
============================================================================================== */

// Fonction qui retourne le texte des options du menu select en format: 4 (Patrick Lainesse)
const texteOptionPatients = dossier => {

    let tableauXML = xmlHopitaux.getElementsByTagName('patient');
    var texte;

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];

        if(objet.getElementsByTagName('dossier')[0].firstChild.nodeValue == dossier) {
            texte = objet.getElementsByTagName('dossier')[0].firstChild.nodeValue + " (" + objet.getElementsByTagName('prénom')[0].firstChild.nodeValue
            + " " + objet.getElementsByTagName('nom')[0].firstChild.nodeValue + ")";
        }
    }

    return texte;
};

// Fonction qui retourne le texte des options du menu select en format: 1234 - Centre hospitalier Sud
const texteOptionHopital = codeEtablissement => {

    let tableauXML = xmlHopitaux.getElementsByTagName('hopital');
    var texte;

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];

        if(objet.getElementsByTagName('établissement')[0].firstChild.nodeValue == codeEtablissement) {
            texte = objet.getElementsByTagName('établissement')[0].firstChild.nodeValue + " - " + objet.getElementsByTagName('nom')[0].firstChild.nodeValue;
        }
    }

    return texte;
};

/* ==============================================================================================
                          ZONE D'AFFICHAGE DU MESSAGE (STATUS)
============================================================================================== */

// Fonction qui nettoie la zone d'affichage de texte et crée les cadre et style appropriés pour l'affichage d'un message
const initFooter = () => {

    let footer = document.getElementsByTagName('footer')[0];
    let div = document.getElementById('message');

    // éliminer le message s'il est déjà présent
    if(div != null) {
        footer.removeChild(div);
    }

    div = document.createElement('div');
    div.setAttribute('id', 'message');
    div.classList.add('container', 'status-txt');

    footer.appendChild(div);
};
