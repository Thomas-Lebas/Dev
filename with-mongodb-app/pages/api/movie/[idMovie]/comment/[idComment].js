import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { parse } from "url";

// pages/api/movie/[idMovie]/comment/[idComment].js

/**
* @swagger
* /api/movie/{idMovie}/comment/{idComment}:
*   get:
*     description: Return one comment
*     parameters:
*       - in: path
*         name: idMovie
*         required: true
*         schema:
*           type: string
*         description: ID movie
*       - in: path
*         name: idComment
*         required: true
*         schema:
*           type: string
*         description: ID Comment
*     responses:
*       200:
*         description: |
*           Success Response : Retourne le commentaire lié à l'id Movie et l'id Comment.
*       404:
*         description: |
*           Error Response : ID du film ou du commentaire invalide.
*       500:
*         description: |
*           Error Response : Une erreur a été trouvée lors de la récupération du film.
*   delete:
*     description: Delete one comment
*     parameters:
*       - in: path
*         name: idMovie
*         required: true
*         schema:
*           type: string
*         description: ID movie
*       - in: path
*         name: idComment
*         required: true
*         schema:
*           type: string
*         description: ID Comment
*     responses:
*       200:
*         description: |
*           Success Response : Le commentaire a bien été supprimé !
*       404:
*         description: |
*           Error Response : ID du film ou du commentaire invalide.
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
*       - in: path
*         name: idComment
*         required: true
*         schema:
*           type: string
*         description: ID Comment
*     requestBody:
*       description: Update one movie
*       content:
*         application/json:
*           schema:
*             description: Post movies
*           example:
*             updates:
*               text: "Incroyable ce film !"
*     responses:
*       201:
*         description: |
*           Success Response : Le commentaire a bien été mis à jour ! Retourne le commentaire à jour.
*       404:
*         description: |
*           Error Response : ID invalide ou Mises à jour invalides.
*       500:
*         description: |
*           Internal Server Error : Une erreur a été trouvée lors de la mise à jour des champs.
*/

export default async function handler(req, res) {
    const { idComment } = req.query
    const client = await clientPromise;
    const db = client.db("sample_mflix")

    switch (req.method) {
        case "GET":
                    try {
                        const { pathname } = parse(req.url, true); // Utiliser la fonction parse pour obtenir le chemin de l'URL
                        const segments = pathname.split("/"); // Diviser le chemin en segments
                        const idMovie = segments[segments.length - 3]; // Récupérer l'ID du film à partir de l'avant-dernier segment de l'URL
                        const idComment = segments[segments.length - 1]; // Récupérer l'ID du commentaire à partir du dernier segment de l'URL
                        // Vérifier si les ID du film et du commentaire sont valides
                        if (!ObjectId.isValid(idMovie) || !ObjectId.isValid(idComment)) {
                            return res.status(400).json({ status: 400, error: "ID du film ou du commentaire invalide" });
                        }
                        // Rechercher le commentaire dans la base de données
                        const comment = await db.collection("comments").findOne({ _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie)});
                        // Si le commentaire n'existe pas, renvoyer une erreur 404
                        if (!comment) {
                            return res.status(404).json({ status: 404, error: "Aucun commentaire trouvé avec cet ID ou il n'est pas associé à ce film" });
                        }
                        // Si tout est bon, renvoyer le commentaire
                        res.status(200).json({ status: 200, data: comment });
                    } catch (error) {
                        console.error("Une erreur a été trouvée lors de la récupération du commentaire:", error);
                        res.status(500).json({ status: 500, error: "Internal Server Error" });
                    }
                    break;
        case "DELETE":
                    try {
                        const { pathname } = parse(req.url, true); // Utiliser la fonction parse pour obtenir le chemin de l'URL
                        const segments = pathname.split("/"); // Diviser le chemin en segments
                        const idMovie = segments[segments.length - 3]; // Récupérer l'ID du film à partir de l'avant-dernier segment de l'URL
                        const idComment = segments[segments.length - 1]; // Récupérer l'ID du commentaire à partir du dernier segment de l'URL
                        // Vérifier si les ID du film et du commentaire sont valides
                        if (!ObjectId.isValid(idComment)) {
                            return res.status(400).json({ status: 400, error: "ID du film ou du commentaire invalide" });
                        }
                        // Rechercher le commentaire dans la base de données
                        const comment = await db.collection("comments").findOne({ _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie)});
                        // Si le commentaire n'existe pas, renvoyer une erreur 404 sinon supprimer le commentaire
                        if (comment) {
                            // Supprimer le commentaire s'il existe
                            await db.collection("comments").deleteOne({ _id: new ObjectId(idComment) });
                            res.status(200).json({ status: 200, message: "Le commentaire a bien été supprimé !" });
                        } else {
                            res.status(404).json({ status: 404, error: "Aucun commentaire trouvé avec cet ID" });
                        }
                    } catch (error) {
                        console.error("Une erreur a été trouvée lors de la suppression du commentaire:", error);
                        res.status(500).json({ status: 500, error: "Internal Server Error" });
                    }
                    break;
        case "PUT":
            try {
                const { updates } = req.body; // Supposons que les données à mettre à jour sont fournies dans le corps de la requête
                // Vérifier si l'ID est fourni et est valide
                const { pathname } = parse(req.url, true); // Utiliser la fonction parse pour obtenir le chemin de l'URL
                const segments = pathname.split("/"); // Diviser le chemin en segments
                const idMovie = segments[segments.length - 3]; // Récupérer l'ID du film à partir de l'avant-dernier segment de l'URL
                const idComment = segments[segments.length - 1]; // Récupérer l'ID du commentaire à partir du dernier segment de l'URL
                // Vérifier si les ID du film et du commentaire sont valides
                if (!ObjectId.isValid(idComment)) {
                    return res.status(400).json({ status: 400, error: "ID du film ou du commentaire invalide" });
                }
                // Rechercher le commentaire dans la base de données
                const comment = await db.collection("comments").findOne({ _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie)});
                // Si le commentaire n'existe pas, renvoyer une erreur 404 sinon supprimer le commentaire
                if (!comment) {
                    res.status(404).json({ status: 404, error: "Aucun commentaire trouvé avec cet ID" });
                }
                // Mets à jour le commentaire
                const result = await db.collection("comments").updateOne({ _id: new ObjectId(idComment) }, { $set: updates });
                // Récupère celui à jour
                const updatedComment = await db.collection("comments").findOne({ _id: new ObjectId(idComment) });
                // Retourne dans la réponse le commentaire à jour sinon renvoie une erreur
                if (result.modifiedCount === 1) {
                    res.json({ status: 200, message: "Champ 'text' mis à jour avec succès", data: updatedComment });
                } else {
                    res.status(404).json({ status: 404, error: "Commentaire non trouvé ou aucun changement effectué" });
                }
            } catch (error) {
                console.error("Une erreur a été trouvée lors de la mise à jour du champ 'text':", error);
                res.status(500).json({ status: 500, error: "Internal Server Error" });
            }
            break;
        // Cas par défault si une mauvaise méthode est utilisée.
        default:
                res.send("Cette méthode n'est pas fonctionnelle. Il faut utiliser GET, DELETE ou PUT");
                break;
        }
}