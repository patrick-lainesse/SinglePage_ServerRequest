/*
styles.js

Ensemble des fonctions qui effectuent des manipulations sur les styles pour désengorger
les codes des scripts principaux
*/


/* ==============================================================================================
                                    MENU SELECT
============================================================================================== */

// appliquer un style material design au select
const styleSelect = () => {
    $('select').formSelect();
    $(".dropdown-content>li>span").css("color", "#d32f2f");
};

// Fonction pour créer les div qui servent à encadrer l'élément select afin qu'il possède le style Material Design
const styleCreerDivSelect = () => {

    let contenu = document.getElementById('contenu');
    let row = document.createElement('div');
    let inputF = document.createElement('div');

    // vider l'emplacement au cas où il y a déjà un tableau affiché ???? il faut préalablement récupérer le select s'il y en a un, donc ID pour ce select ????
    while(contenu.firstChild) {
        contenu.removeChild(contenu.firstChild);
    }

    // application de styles
    row.classList.add('row');
    inputF.classList.add('input-field', 'col', 's3');
    inputF.setAttribute('id', 'divSelect');

    row.appendChild(inputF);
    contenu.appendChild(row);
};

/* Fonction pour créer les div qui servent à afficher les informations de l'établissement sélectionné
dans l'option "Hospitalisations par établissement et par spécialité */
const styleAfficherHopital = () => {

    // créations de div pour encadrer l'affichage dans un style material design
    let contenu = document.getElementById('contenu');
    let centre = document.createElement('div');
    let row = document.createElement('div');

    // création d'un div différent pour ajouter une couleur différente à chaque case d'information de l'établissement
    let etabDiv = document.createElement('div');
    let nomDiv = document.createElement('div');
    let adresseDiv = document.createElement('div');
    let cPostalDiv = document.createElement('div');
    let telephoneDiv = document.createElement('div');

    // ajout des id pour pouvoir les récupérer dans d'autres fonctions
    etabDiv.setAttribute('id', 'établissement');
    nomDiv.setAttribute('id', 'nom');
    adresseDiv.setAttribute('id', 'adresse');
    cPostalDiv.setAttribute('id', 'téléphone');
    telephoneDiv.setAttribute('id', 'code_postal');

    // ajout des styles css
    centre.classList.add('center-text');
    row.classList.add('row', 'padding-top10', 'center-text');
    etabDiv.classList.add('col', 's2', 'offset-s1', 'red');
    nomDiv.classList.add('col', 's2', 'orange');
    adresseDiv.classList.add('col', 's2', 'yellow');
    cPostalDiv.classList.add('col', 's2', 'green');
    telephoneDiv.classList.add('col', 's2', 'blue');

    // ajouter les div au DOM
    row.appendChild(etabDiv);
    row.appendChild(nomDiv);
    row.appendChild(adresseDiv);
    row.appendChild(cPostalDiv);
    row.appendChild(telephoneDiv);
    centre.appendChild(row);
    contenu.appendChild(centre);
};