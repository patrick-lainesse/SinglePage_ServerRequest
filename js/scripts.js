/*
Patrick Lainesse
740302
IFT1142, Hiver 2020
*/

let xmlHopitaux = null;

// Fonction qui applique le style material design aux select
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

/* Fonction qui fait afficher le tableau dans la section contenu selon la sélection faite dans le menu du haut de la
page ou la sélection faite dans un menu select */
function afficherTableau(elem) {

    // sélection effectuée sur le select qui a déclenché ce tableau (si c'est le cas)
    let selection;
    let id;

    let tableauXML;
    let tableau;
    let head;
    let body;

    // récupération des choix provenant des menus select dans le cas des deux dernières options de la page
    if(elem === 'hosPatient') {
        console.log('hosPatient');
        let select = document.getElementById('patients').options;
        selection = select[select.selectedIndex].id;
        console.log(selection);
        elem = 'hospitalisation';
    } else if(elem === 'spécialités') {
        let select = document.getElementById('spécialités').options;
        //let menuHopital = document.getElementById('établissements').options;
        //var choixHopital = menuHopital[menuHopital.selectedIndex].id;
        var infosHopital = document.getElementById('infosHopital');
        selection = select[select.selectedIndex].id;
        id = document.getElementById('divEtablissement').getAttribute('value');
        console.log(selection + " et id: " + id);
    }

    viderContenu();

    // réaffichage des infos de l'établissement sélectionné dans le cas du select "choix des spécialités"
    if(elem === 'spécialités') {
        contenu.insertBefore(infosHopital, contenu.childNodes[0]);
        elem = 'hospitalisation';
    }

    tableauXML = xmlHopitaux.getElementsByTagName(elem);
    head = document.createElement('thead');
    body = document.createElement('tbody');

    // créer les div pour encadrer le tableau et récupération de l'emplacement où afficher le tableau
    styleTableau();
    tableau = document.getElementById('tableau');

    // afficher l'en-tête du tableau
    for(let colonne of tableauXML[0].children) {
        let en_tete = document.createElement('th');
        let attribut = majuscule(colonne.nodeName);

        if(colonne.nodeName === "code_postal") {
            attribut = "Code postal";
        }

        en_tete.appendChild(document.createTextNode(attribut));
        head.appendChild(en_tete);
    }
    tableau.appendChild(head);

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
                td.appendChild(document.createTextNode(valeur));
                tr.appendChild(td);
            }   // fin du parcours des attributs d'un objet du tableau XML (deuxième boucle for)
        }   // fin du if correspond à la sélection du sélect
        body.appendChild(tr);
    }   // fin du parcours des objets du tableau XML (première boucle for)
    tableau.appendChild(body);
}

// Fonction qui fait afficher le menu select selon le choix l'ayant fait apparaître
function charger_select(identifiant) {

    let contenu = document.getElementById('contenu');
    let menu = document.createElement('select');
    let tableauXML;
    let divSelect;

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
    optionChoisir(identifiant);

    /*let option = document.createElement("option");
    let textNode = document.createTextNode("Choisir...");
    option.classList.add('disabled', 'selected');
    option.appendChild(textNode);
    menu.appendChild(option);*/

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

