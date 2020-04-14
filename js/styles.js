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

// pour créer les div qui servent à encadrer l'élément select afin qu'il possède le style Material Design
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