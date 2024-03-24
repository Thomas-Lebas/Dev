// pages/api/movie/{idMovie}/comments.js
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { parse } from "url";

export default async function handler(req, res) {
const client = await clientPromise;
const db = client.db("sample_mflix");

/**
* @swagger
* /api/movie/{idMovie}/comments:
*   get:
*     description: Return one movie
*     parameters:
*       - in: path
*         name: idMovie
*         required: true
*         schema:
*           type: string
*         description: ID movie
*     responses:
*       200:
*         description: |
*           Success Response : Retourne le ou les commentaires de la table comments lié à l'idMovie.
*       404:
*         description: |
*           Error Response : ID du film invalide (Mauvais format) ou Ce film n'existe pas ! (Pas de film existant pour cet ID).
*       500:
*         description: |
*           Error Response : Une erreur a été trouvée lors de la récupération des commentaires.
*   post:
*     requestBody:
*       description: Post movies
*       content:
*         application/json:
*           schema:
*             description: Post movies
*           example:
*             name: "Thomas LEBAS"
*             email: "test@test.com"
*             text: "Beau film, aller le voir il en vaut le coup !!!"
*             date: "2020-11-25T08:42:15.000Z"
*     responses:
*       200:
*         description: |
*           Success Response : Créer le commentaire lié à l'Id Movie. Retourne l'id du commentaire.
*       404:
*         description: |
*           Error Response : ID du film invalide (Mauvais format) ou Ce film n'existe pas ! (Pas de film existant pour cet ID).
*       500:
*         description: |
*           Error Response : Une erreur a été trouvée lors de la récupération des commentaires.
*/

switch (req.method) {
    case "POST":
                try {
                    const { pathname, query } = parse(req.url, true); // Utiliser la fonction parse
                    const segments = pathname.split("/");
                    const movieId = segments[segments.length - 2];
                    const commentData = {
                        ...req.body, // Copier les données du corps de la requête
                        movie_id: new ObjectId(movieId) // Ajouter l'ID du film au corps de la requête
                    };
                    // Vérifie le format de l'idMovie
                    if (!ObjectId.isValid(movieId)) {
                        return res.status(400).json({ status: 400, error: "ID du film invalide" });
                    }
                    // Vérifie s'il existe un film avec cet id
                    const commentsCount = await db.collection("movies").countDocuments({ _id : new ObjectId(movieId) })
                    if (commentsCount === 0) {
                        return res.status(400).json({ status: 400, error: "Ce film n'existe pas !" });
                    }
                    // Créer le commentaire
                    const result = await db.collection("comments").insertOne(commentData);
                    res.status(200).json({ status: 200, data: result });
                } catch (error) {
                    console.error("Une erreur a été trouvée lors de la création du commentaire:", error);
                    res.status(500).json({ status: 500, error: "Internal Server Error" });
                }
                break;
    case "GET":
                try {
                    const { pathname, query } = parse(req.url, true); // Utiliser la fonction parse
                    const segments = pathname.split("/");
                    const movieId = segments[segments.length - 2]; // Récupérer l'ID du film depuis l'avant-dernier segment de l'URL
                    // Vérifie si l'ID du film est valide
                    if (!ObjectId.isValid(movieId)) {
                        return res.status(400).json({ status: 400, error: "ID du film invalide" });
                    }
                    // Vérifie s'il existe un film avec cet id
                    const commentsCount = await db.collection("movies").countDocuments({ _id : new ObjectId(movieId) })
                    if (commentsCount === 0) {
                        return res.status(400).json({ status: 400, error: "Ce film n'existe pas !" });
                    }
                    // Récupérer les commentaires liés au film spécifié
                    const comments = await db.collection("comments").find({ movie_id: ObjectId(movieId) }).toArray();
                    res.status(200).json({ status: 200, data: comments });
                } catch (error) {
                    console.error("Une erreur a été trouvée lors de la récupération des commentaires:", error);
                    res.status(500).json({ status: 500, error: "Internal Server Error" });
                }
                break;
    // Réponse si une méthode utilisée n'est pas bonne
    default:
            res.send("Cette méthode n'est pas fonctionnelle. Il faut utiliser GET ou POST");
            break;
    }
}