// pages/api/movies.js
import clientPromise from "../../lib/mongodb";

/**
* @swagger
* /api/movies:
*   get:
*     description: Returns movies
*     responses:
*       200:
*         description: |
*           Success Response : Retourne les 10 premiers films de la table movies.
*       500:
*         description: |
*           Error Response : Une erreur a été trouvée lors de la récupération des films
*   post:
*     requestBody:
*       description: Post movies
*       content:
*         application/json:
*           schema:
*             description: Post movies
*           example:
*             plot: "A young boy befriends a giant robot from outer space that a paranoid government agent wants to destroy."
*             genres: ["Animation", "Adventure", "Family"]
*             runtime: 86
*             cast: ["Eli Marienthal", "Harry Connick Jr.", "Jennifer Aniston", "Vin Diesel"]
*             poster: "https://m.media-amazon.com/images/M/MV5BZGU2YWNjZTctMmQ5My00YzEwLTk0OGQtOTc3NGQxNzA5Zjg5XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,674,1000_AL_.jpg"
*             title: "The Iron Giant"
*             fullplot: "A young boy befriends a giant robot from outer space that a paranoid government agent wants to destroy."
*             languages: ["English"]
*             released: "1999-08-06T00:00:00.000Z"
*             directors: ["Brad Bird"]
*             rated: "PG"
*             awards:
*               wins: 9
*               nominations: 14
*               text: "9 wins & 14 nominations."
*             year: 1999
*             imdb:
*               rating: 8
*               votes: 191758
*               id: 120
*             countries: ["USA"]
*             type: "movie"
*             tomatoes:
*               viewer:
*                 rating: 3.9
*                 numReviews: 501780
*                 meter: 89
*               fresh: 152
*               critic:
*                 rating: 6.9
*                 numReviews: 134
*                 meter: 96
*               rotten: 6
*               lastUpdated: "2015-09-12T17:05:05.000Z"
*             num_mflix_comments: 0
*     responses:
*       201:
*         description: |
*           Success Response : Le film a bien été crée ! Retourne aussi l'id du film créé.
*       500:
*         description: |
*           Internal Server Error : Une erreur a été trouvée lors de la création du film.
*/

export default async function handler(req, res) {
const client = await clientPromise;
const db = client.db("sample_mflix");

switch (req.method) {
    case "POST":
        try {
            //Récupère les champs de la requête
            const movieData = req.body;
            // Créer le film
            const result = await db.collection("movies").insertOne(movieData);
            // Réponse de la requête
            res.json({ status: 201, message: "Le film a bien été créé !", data: result });
        } catch (error) {
            console.error("Une erreur a été trouvée lors de la création du film:", error);
            res.json({ status: 500, error: "Internal Server Error" });
        }
        break;
    case "GET":
        try {
            // Cherche les 10 premiers films de la table movies
            const movies = await db.collection("movies").find({}).limit(10).toArray();
            // Envoie les films dans la réponse
            res.json({ status: 200, data: movies });
        } catch (error) {
            console.error("Une erreur a été trouvée lors de la récupération des films:", error);
            res.json({ status: 500, error: "Internal Server Error" });
        }
        break;
    // Cas par défaut si une méthode utilisée n'est pas bonne
    default:
            res.send("Cette méthode n'est pas fonctionnelle. Il faut utiliser GET ou POST");
            break;
    }
}