# Projet Next.js

Ce projet est développé avec Next.js, un framework JavaScript basé sur React, qui est utilisé pour le développement de pages web modernes côté client et côté serveur.

## Installation

Pour exécuter ce projet localement, suivez ces étapes :

1. Cloner le dépôt depuis GitHub :

    ```bash
    git clone <URL_DU_REPO>
    ```

2. Accéder au répertoire du projet :

    ```bash
    cd nom_du_projet
    ```

3. Installer les dépendances du projet avec npm :

    ```bash
    npm install
    ```

4. Démarrer le serveur de développement :

    ```bash
    npm run dev
    ```

   Le serveur de développement sera accessible à l'adresse [http://localhost:3000](http://localhost:3000). Vous pouvez accéder à cette URL depuis votre navigateur pour voir le projet en action.

## Stack

Ce projet utilise les technologies suivantes :

- **Next.js** : Framework React pour le développement d'applications web côté client et côté serveur.
- **Swagger UI** : Outil de génération et de documentation d'APIs. Il est utilisé pour créer une interface utilisateur interactive pour visualiser et tester les API REST.

## Conception

Le projet suit une architecture basée sur les composants React. Les pages sont organisées dans le répertoire `pages`.

### Conception des Routes

Dans ce projet Next.js, les pages sont organisées de la manière suivante :

- **movies.js** : Gère les requêtes liées aux films en tant que collection, comme obtenir une liste de films ou ajouter un nouveau film.

- **[idMovie].js** : Une route dynamique pour afficher les détails d'un film spécifique. Par exemple, `/api/movie/{idMovie}` afficherait les détails du film avec l'identifiant idMovie. On peut aussi supprimer et mettre à jour le film.

- **comments.js** : Gère les requêtes liées aux commentaires associés à un film spécifique, comme obtenir la liste des commentaires ou ajouter un nouveau commentaire.

- **[idComments].js** : Une route dynamique pour afficher les détails d'un commentaire spécifique. Par exemple, `/api/movie/{idMovie}/comments/{idComment}` afficherait les détails du commentaire avec l'identifiant idComment pour le film avec l'identifiant idMovie. On peut aussi supprimer et mettre à jour le commentaire.

