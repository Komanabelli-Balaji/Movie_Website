import { Client, Databases, ID, Query } from "appwrite";

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(projectId);

const databases = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await databases.listDocuments(databaseId, collectionId, [
            Query.equal('searchTerm', searchTerm)
        ]);

        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await databases.updateDocument(databaseId, collectionId, doc.$id, {
                count: doc.count + 1
            });
        } else {
            await databases.createDocument(databaseId, collectionId, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await databases.listDocuments(databaseId, collectionId, [
            Query.orderDesc('count'),
            Query.limit(5)
        ]);
        return result.documents;
    } catch (error) {
        console.error("Error getting search history:", error);
    }
}   
