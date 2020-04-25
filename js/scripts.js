/*
Travail préparé par: Patrick Lainesse
Matricule: 740302
Dans le cadre du cours IFT1142, session H2020

Single Page Application qui se connecte à un serveur PHP pour obtenir des données en format XML et construit des tableaux
pour afficher les patients, établissements et hospitalisations. Les codes Javascript sont divisés en trois fichiers:
- scripts.js pour les manipulations sur le DOM et les réactions aux événements
- strings.js pour les manipulations plus complexes impliquant du texte
- styles.js pour les manipulations sur le style (couleurs, padding, etc.) appliqué sur les éléments du DOM

J'ai réalisé un peu tard malheureusement que je pouvais retourner un div (ou autre élément du DOM) contenant des noeuds enfants
dans une fonction JavaScript. J'aurais pu grandement simplifier mon code, avoir su cela auparavant.

Notions appliquées:
- Quelques éléments de ES6 pour la programmation Javascript (malheureusement, le cours a été présenté trop tard pour
que j'aie le temps de l'appliquer à l'ensemble du code)
- DOM pour accéder et créer des éléments dans la page Web
- AJAX et JQuery pour effectuer les requêtes au serveur
- Serveur simple programmé en PHP
- Utilisation d'une librairie pour implémenter le material design qui a servi à bâtir le squelette de la page Web

Ressources utilisées:
- https://materializecss.com/
- Arrière-plan: Pishier http://pishier.com/
- Logo: LovePaperCrafts https://www.lovepapercrafts.com/free-rainbow-svg/
- Favicon: https://www.stockio.com/free-icon/rainbow-2
*/

let xmlHopitaux = null;

// Fonction qui lance la requête jQuery et ajax à l'ouverture de la page
$(document).ready(function(){
    listePatients();
});

// Fonction qui vide la section contenu, où s'affichent les select et les tableaux
const viderContenu = () => {
    let contenu = document.getElementById('contenu');

    // vider l'emplacement au cas où il y a déjà un tableau ou un select d'afficher
    while(contenu.firstChild) {
        contenu.removeChild(contenu.firstChild);
    }
};

// Fonction qui reçoit un map en argument et affiche le message approprié
const message = (map) => {

    // élimine l'ancien message et crée le div avec la classe css nécessaire pour afficher le message
    initFooter();

    let texte;
    let textNode;
    let div = document.getElementById('message');
    let type = map.get('type');

    switch (type) {
        case 'patient':
        case 'hospitalisation':
            //texte = "Il y a " + map.get('nombre') + " " + type + "(s).";
            texte = `Il y a ${map.get('nombre')} ${type}(s).`;
            break;
        case 'hopital':
            //texte = "Il y a " + map.get('nombre') + " hôpitaux.";
            texte = `Il y a ${map.get('nombre')} hôpitaux.`;
            break;
        case 'patients':
            texte = "Choisir un patient pour afficher toutes ses hospitalisations.";
            break;
        case 'établissements':
            texte = "Choisir un établissement pour afficher les spécialités s'y retrouvant.";
            break;
        case 'spécialités':
            texte = "Choisir une spécialité pour afficher toutes les hospitalisations pour cette spécialité dans cet établissement.";
            break;
    }
    textNode = document.createTextNode(texte);

    div.appendChild(textNode);
};

/* Fonction qui effectue la requête au serveur (ici, la requête se fait plutôt localement, car je n'ai pas suivi
encore le cours de PHP */
function listePatients() {
    $.ajax({
        type: "GET",
        url: "donnees/hospitalisations.xml",
        dataType: "xml",
        success: function(reponse) {
            xmlHopitaux = reponse;
        },
        fail: function() {
            alert("Dû à des effectifs réduits en cette période de pandémie, la page n'a pu s'afficher correctement.");
        }
    })
}

const choixSelect = idSelect => {
    let select = document.getElementById(idSelect).options;
    let selection = select[select.selectedIndex].id;
    return selection;
};

// Fonction qui construit l'en-tête du tableau selon la sélection effectuée dans le menu
const enTete = tableauXML => {

    let head = document.createElement('thead');
    let body = document.createElement('tbody');
    head.classList.add('head-couleur');

    // créer les div pour encadrer le tableau et récupération de l'emplacement où afficher le tableau
    tableau = document.getElementById('tableau');

    // afficher l'en-tête du tableau
    for(let colonne of tableauXML[0].children) {
        let en_tete = document.createElement('th');
        let attribut = majuscule(colonne.nodeName);

        en_tete.classList.add('head-couleur');

        if(colonne.nodeName === "code_postal") {
            attribut = "Code postal";
        }

        en_tete.appendChild(document.createTextNode(attribut));
        head.appendChild(en_tete);
    }
    tableau.appendChild(head);
    return tableau;
};

/* Fonction qui fait afficher le tableau dans la section contenu selon la sélection faite dans le menu du haut de la
page ou la sélection faite dans un menu select */
function afficherTableau(elem) {

    // sélection effectuée sur le select qui a déclenché ce tableau (si c'est le cas)
    let selection;
    let id;

    let tableauXML;
    let tableau;
    let body;
    let nombreMessages = 0;

    // récupération des choix provenant des menus select dans le cas des deux dernières options de la page
    if(elem === 'hosPatient') {
        selection = choixSelect('patients');
        elem = 'hospitalisation';
    } else if(elem === 'spécialités') {
        var infosHopital = document.getElementById('infosHopital');
        selection = choixSelect('spécialités');
        id = document.getElementById('divEtablissement').getAttribute('value');
    }

    viderContenu();

    // réaffichage des infos de l'établissement sélectionné dans le cas du select "choix des spécialités"
    if(elem === 'spécialités') {
        contenu.insertBefore(infosHopital, contenu.childNodes[0]);
        elem = 'hospitalisation';
    }

    // sélection du tableau XML dans lequel on puise les données pour remplir le tableau
    tableauXML = xmlHopitaux.getElementsByTagName(elem);
    styleTableau();
    tableau = enTete(tableauXML);

    body = document.createElement('tbody'); //???

    // affichage des rangées du tableau
    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];
        let tr = document.createElement('tr');
        let test = false;

        if(selection == null) {
            test = true;
        } else if(selection === objet.getElementsByTagName('dossier')[0].firstChild.nodeValue) {
            test = true;
        } else if(objet.getElementsByTagName('établissement')[0].firstChild.nodeValue === id && selection === objet.getElementsByTagName('spécialité')[0].firstChild.nodeValue) {
            test = true;
        }

        /* si la requête provient d'une sélection sur une liste select et que la sélection correspond à l'objet du tableau XML,
        on affiche cette ligne du tableau XML */
        if(test) {
            nombreMessages++;
            for(let info of objet.children) {

                // ici, la clé permettra de faire la mise en forme du texte xml
                let cle = "";
                let attribut = info.nodeName;   // correspond au tag du tableau XML
                let valeur;                     // correspond à la valeur associée au tag
                let td;

                // obtient une clé primaire pour identifier l'objet du tableau XML à faire afficher dans la rangée courante
                switch (elem) {
                    case 'patient':
                        cle = objet.getElementsByTagName('dossier')[0].firstChild.nodeValue;
                        break;
                    case 'hopital':
                        cle = objet.getElementsByTagName('établissement')[0].firstChild.nodeValue;
                        break;
                    case 'hospitalisation':
                        cle = objet.getAttribute('id');
                        break;
                }

                // mise en forme du texte de la valeur dans le cas où c'est un numéro de téléphone, un code postal ou une date
                valeur = mefTableau(attribut, cle);
                if (valeur === "défaut") {
                    valeur = info.firstChild.nodeValue;
                }

                td = document.createElement('td');
                td.classList.add('bordure');
                td.appendChild(document.createTextNode(valeur));
                tr.appendChild(td);
            }   // fin du parcours des attributs d'un objet du tableau XML (deuxième boucle for)
        }   // fin du if correspond à la sélection du sélect
        body.appendChild(tr);
    }   // fin du parcours des objets du tableau XML (première boucle for)
    tableau.appendChild(body);
    let mapMessage = new Map();
    mapMessage.set('type', elem);
    mapMessage.set('nombre', nombreMessages);

    message(mapMessage);
}

// Fonction qui fait afficher le menu select selon le choix l'ayant fait apparaître
function charger_select(identifiant) {

    let contenu = document.getElementById('contenu');
    let menu = document.createElement('select');
    let tableauXML;
    let divSelect;
    let mapMessage = new Map();

    // afficher le message dans la zone d'affichage au bas de la page
    mapMessage.set('type', identifiant);
    message(mapMessage);

    // créer un select selon l'option de la page qui a été sélectionnée
    switch (identifiant) {
        case 'patients':
            menu.setAttribute('onChange', 'afficherTableau("hosPatient")');
            tableauXML = xmlHopitaux.getElementsByTagName('patient');
            break;
        case 'établissements':
            menu.setAttribute('onChange', 'afficherHopital()');
            tableauXML = xmlHopitaux.getElementsByTagName('hopital');
            break;
        case 'spécialités':
            let menuHopital = document.getElementById('établissements').options;
            // récupération de la rangée où se sont affichées les informations de l'établissement sélectionné
            var choixHopital = menuHopital[menuHopital.selectedIndex].id;
            var infosHopital = document.getElementById('infosHopital');
            menu.setAttribute('onChange', 'afficherTableau("spécialités")');
            tableauXML = xmlHopitaux.getElementsByTagName('hospitalisation');
            break;
        default:
            erreur();
            location.reload();
    }
    menu.setAttribute('id', identifiant);

    let option = document.createElement("option");
    let textNode = document.createTextNode("Choisir...");
    option.classList.add('disabled', 'selected');
    option.appendChild(textNode);
    menu.appendChild(option);

    /* création des différents div pour encadrer l'affichage du select et élimination des éléments de la page (tableau précédent,
    autres menus dans un select) */
    styleCreerDivSelect();

    // réaffichage des infos de l'établissement sélectionné dans le cas du select "choix des spécialités"
    if(identifiant === 'spécialités') {
        contenu.insertBefore(infosHopital, contenu.childNodes[0]);
    }

    // on récupère l'emplacement où faire afficher le select à créer
    divSelect = document.getElementById('divSelect');

    /* ajouter les options selon le menu select que l'on cherche à créer, le id sera une clé primaire (ou une partie de la clé,
     dans le cas de 'spécialité') qui servira à afficher le tableau correspondant */
    for(let i=0; i<tableauXML.length; i++) {
        // un objet est une entrée dans le tableau xml, soit un patient, un établissement ou une hospitalisation
        let objet = tableauXML[i];
        let option = document.createElement('option');

        switch (identifiant) {
            case 'patients':
                let dossier = objet.getElementsByTagName('dossier')[0].firstChild.nodeValue;
                option.setAttribute('id', dossier);
                option.appendChild(document.createTextNode(texteOptionPatients(dossier)));
                menu.appendChild(option);
                break;
            case 'établissements':
                let etablissement = objet.getElementsByTagName('établissement')[0].firstChild.nodeValue;
                option.setAttribute('id', etablissement);
                option.appendChild(document.createTextNode(texteOptionHopital(etablissement)));
                menu.appendChild(option);
                break;
            case 'spécialités':
                let codeEtab = objet.getElementsByTagName('établissement')[0].firstChild.nodeValue;
                let specialite = objet.getElementsByTagName('spécialité')[0].firstChild.nodeValue;

                if(codeEtab === choixHopital && !option_existe(specialite, menu)) {
                    option.setAttribute('id', specialite);
                    option.appendChild(document.createTextNode(majuscule(specialite)));
                    menu.appendChild(option);
                }
                break;
            default:
                erreur();
                location.reload();
        } // fin du switch
    }
    // ajouter les éléments au DOM de la page
    divSelect.appendChild(menu);
    styleSelect();
}

// vérifie si l'option fournie en paramètre existe déjà dans le menu fourni en paramètre
function option_existe (cherche, menu) {
    let optionExiste = false,
        optionsLength = menu.length;

    while (optionsLength--) {
        if (menu.options[optionsLength].value.toUpperCase() === cherche.toUpperCase()) {
            optionExiste = true;
            break;
        }
    }
    return optionExiste;
}

/* Fonction qui affiche les informations de l'élément sélectionné de la liste des établissements, pour lesquel une liste
de spécialités s'affichera ensuite */
function afficherHopital() {

    let select = document.getElementById('établissements').options;
    let choixHopital = select[select.selectedIndex].id;
    let tableauXML = xmlHopitaux.getElementsByTagName('hopital');

    styleAfficherHopital();

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];

        if(objet.getElementsByTagName('établissement')[0].firstChild.nodeValue == choixHopital) {

            for(let info of objet.children) {
                let div;
                let attribut = info.nodeName;
                let valeur = mefTableau(attribut, choixHopital);
                if (valeur === "défaut") {
                    valeur = info.firstChild.nodeValue;
                }

                if (attribut === "code_postal") {
                    texte = "Code postal" + " : <br>" + valeur;
                } else if (attribut === "adresse") {
                    texte = majuscule(attribut) + " : " + valeur;
                } else {
                    texte = majuscule(attribut) + " : <br>" + valeur;
                }

                div = document.getElementById(info.nodeName);
                div.innerHTML = texte;

                // attribution d'une valeur et d'un id au div de l'établissement, car il s'agira d'une clé pour l'affichage du tableau
                if (attribut === 'établissement') {
                    div.setAttribute('id', 'divEtablissement');
                    div.setAttribute('value', valeur);
                }
            }
        }
    }
    charger_select("spécialités");
}

