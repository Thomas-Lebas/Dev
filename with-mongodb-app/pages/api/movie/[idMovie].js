import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

// pages/api/movie/[idMovie].js

/**
* @swagger
* /api/movie/{idMovie}:
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
*           Success Response : Retourne le film de la table movies lié à l'idMovie.
*       404:
*         description: |
*           Error Response : Il n'y a pas données pour cet ID.
*       500:
*         description: |
*           Error Response : Une erreur a été trouvée lors de la récupération du film.
*   delete:
*     description: Delete one movie
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
*           Success Response : Le film a bien été supprimé !
*       404:
*         description: |
*           Error Response : Aucun film trouvé avec cet ID.
*       500:
*         description: |
*           Error Response : Une erreur a été trouvée lors de la récupération des films.
*   put:
*     parameters:
*       - in: path
*         name: idMovie
*         required: true
*         schema:
*           type: string
*         description: ID movie
*     requestBody:
*       description: Update one movie
*       content:
*         application/json:
*           schema:
*             description: Post movies
*           example:
*             updates:
*               title: "Nouveau titre du film"
*               year: 2022
*               countries: ["France"]
*     responses:
*       201:
*         description: |
*           Success Response : Le film a bien été mis à jour ! Retourne le film à jour.
*       404:
*         description: |
*           Error Response : ID invalide ou Mises à jour invalides.
*       500:
*         description: |
*           Internal Server Error : Une erreur a été trouvée lors de la mise à jour des champs.
*/


export default async function handler(req, res) {
    const { idMovie } = req.query
    const client = await clientPromise;
    const db = client.db("sample_mflix")

    switch (req.method) {
        case "GET":
            try {
                // Vérifie s'il existe un film avec cet ID, si oui alors on l'envoie dans la réponse sinon on renvoie une erreur
                const movie = await db.collection("movies").findOne({ _id : new ObjectId(idMovie) })
                if (movie) {
                    res.json({ status: 200, data: movie });
                } else {
                    res.status(404).json({ status: 404, message: "Il n'y a pas données pour cet ID." });
                }
            } catch (error) {
                console.error("Une erreur a été trouvée lors de la récupération des films:", error);
                res.json({ status: 500, error: "Internal Server Error" });
            }
            break;
        case "DELETE":
            try {
                // On verifie si le film existe, si oui on le supprime sinon on revoie un erreur
                const movie = await db.collection("movies").findOne({ _id: new ObjectId(idMovie) });
                if (movie) {
                    const result = await db.collection("movies").deleteOne({ _id : new ObjectId(idMovie) });
                    res.json({ status: 200, message: "Le film a bien été supprimé !" });
                } else {
                    res.json({ status: 404, error: "Aucun film trouvé avec cet ID." });
                }
            } catch (error) {
                console.error("Une erreur a été trouvée lors de la récupération des films:", error);
                res.json({ status: 500, error: "Internal Server Error" });
            }
            break;
        case "PUT":
            try {
                const { updates } = req.body; // Supposons que les données à mettre à jour sont fournies dans le corps de la requête
                // Vérifier si l'ID est fourni et est valide
                if (!idMovie || !ObjectId.isValid(idMovie)) {
                    return res.status(400).json({ status: 400, error: "ID invalide" });
                }
                // Vérifier si les mises à jour sont fournies
                if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
                    return res.status(400).json({ status: 400, error: "Mises à jour invalides" });
                }
                // Mets à jour le film et garde le nouveau film créé.
                const result = await db.collection("movies").updateOne({_id: new ObjectId(idMovie)}, { $set: updates });
                const resultMovie = await db.collection("movies").findOne({ _id: new ObjectId(idMovie) })
                res.json({ status: 200, message: "Champs mis à jour avec succès", data: resultMovie });
            } catch (error) {
                console.error("Une erreur a été trouvée lors de la mise à jour des champs:", error);
                res.status(500).json({ status: 500, error: "Internal Server Error" });
            }
            break;
        // Cas par défaut si une méthode utilisée n'est pas bonne
        default:
                res.send("Cette méthode n'est pas fonctionnelle. Il faut utiliser GET, DELETE ou PUT");
                break;
        }
}