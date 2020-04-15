/*
Patrick Lainesse
740302
IFT1142, Hiver 2020
*/

let xmlHopitaux = null;

// pour initialiser les select??? renommer et déplacer dans le code
$(document).ready(function(){
    $('select').formSelect();
    $(".dropdown-content>li>span").css("color", "#660066");

    listePatients();
});

const viderContenu = () => {
    let contenu = document.getElementById('contenu');

    // vider l'emplacement au cas où il y a déjà un tableau ou un select d'afficher
    while(contenu.firstChild) {
        contenu.removeChild(contenu.firstChild);
    }
};

// mettre un argument à cette fonction????
function listePatients() {
    $.ajax({
        type: "GET",
        //url: "http://localhost:80/hopitaux/donnees/hospitalisations.xml",
        //url: "http://192.168.0.197/hopitaux/donnees/hospitalisations.xml",
        url: "donnees/hospitalisations.xml",
        dataType: "xml",
        success: function(reponse) {
            xmlHopitaux = reponse;
            //???afficherTableau("patient");
        },
        fail: function() {
            alert("Dû à des effectifs réduits en cette période de pandémie, la page n'a pu s'afficher correctement.");
        }
    })
}

/* ??? changer cette description Fonction qui s'exécute quand on sélectionne une des quatre premières options (afficher patients, établissements,...).
Elle reçoit comme paramètre l'élément qui a été sélectionné, pour permettre de sélectionner
les bonnes informations à afficher. Le deuxième paramètre est le no de dossier du patient à afficher pour l'option
hospitalisations par patient. Le no de dossier est à 0 pour les trois premières options (afficher les tableaux JSON). */
//function afficherTableau(elem, dossier, codeEtab, spec) {
function afficherTableau(elem) {

    // sélection effectuée sur le select qui a déclenché ce tableau (si c'est le cas)
    let selection;
    let id;

    if(elem === 'hosPatient') {
        console.log('hosPatient');
        let select = document.getElementById('patients').options;
        selection = select[select.selectedIndex].id;
        console.log(selection);
        elem = 'patient';
    } else if(elem === 'spécialités') {
        let select = document.getElementById('spécialités').options;
        selection = select[select.selectedIndex].id;
        id = document.getElementById('divEtablissement').getAttribute('value');
        console.log(selection + " et id: " + id);
        elem = 'hospitalisation';
    }

    let tableauXML = xmlHopitaux.getElementsByTagName(elem);


    //let container = document.createElement('div');
    //let tableau = document.createElement('table');
    let head = document.createElement('thead');
    let body = document.createElement('tbody');

    viderContenu(); // attention au cas spécialité! Peut-être mettre plus à la fin????

    styleTableau();
    //let container = document.getElementById('container');
    let tableau = document.getElementById('tableau');

    // afficher l'en-tête du tableau
    //for(let colonne of tableauXML[0].getElementsByTagName('*')) {     ???
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


/*    for(let info of objet.children) {
        let attribut = info.nodeName;
        let valeur = mefTableau(attribut, choixHopital);
        if(valeur === "défaut") {
            valeur = info.firstChild.nodeValue;
        }

        if(attribut === "code_postal") {
            texte = "Code postal" + " : <br>" + valeur;
        } else if(attribut === "adresse") {
            texte = majuscule(attribut) + " : " + valeur;
        } else {
            texte = majuscule(attribut) + " : <br>" + valeur;
        }*/

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];
        let tr = document.createElement('tr');

        //var tags = objet.getElementsByTagName('*');

        /*for(let j=0; j<tags.length; j++) {
            let attribut = tags[j].firstChild.nodeValue;*/
        for(let info of objet.children) {

            // si la requête provient d'une sélection sur une liste select et que la sélection correspond à l'objet du tableau XML
            if ((selection != null && selection === objet.getElementsByTagName('dossier')[0].firstChild.nodeValue) || (objet.getElementsByTagName('établissement')[0].firstChild.nodeValue === id && selection != null && selection === objet.getElementsByTagName('spécialité')[0].firstChild.nodeValue) || selection == null) {
                // ici, la clé permettra de faire la mise en forme du texte xml
                let cle = "";
                let attribut = info.nodeName;

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
                    // manque les deux derniers cas ????
                }

                //let resultNode = doc.querySelector("[id=" + id + "]");

                let valeur = mefTableau(attribut, cle);
                if (valeur === "défaut") {
                    valeur = info.firstChild.nodeValue;
                }

                let td = document.createElement('td');
                //td.appendChild(document.createTextNode(attribut));
                td.appendChild(document.createTextNode(valeur));
                tr.appendChild(td);
            }   // fin du if correspond à la sélection du sélect
        }   // fin du parcours des attributs d'un objet du tableau XML (deuxième boucle for)
        body.appendChild(tr);
    }   // fin du parcours des objets du tableau XML (première boucle for)
    tableau.appendChild(body);

    //document.getElementById('contenu').appendChild(container);
    //container.appendChild(tableau);       ???
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

