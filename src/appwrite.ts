import Movie from './data/Movie';
import { Client, Databases, ID, Query, AppwriteException } from 'appwrite';

const appwrite_project_id: string = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const appwrite_database_id: string = import.meta.env.VITE_APPWRITE_MOVIE_DATABASE_ID;
const appwrite_schema_id: string = import.meta.env.VITE_APPWRITE_MOVIE_DATABASE_SCHEMA_ID;

const appwrite_client = new Client()
   .setEndpoint("https://cloud.appwrite.io/v1")
   .setProject(appwrite_project_id);

const appwrite_database = new Databases(appwrite_client);

export const updateTrendingMoviesCount = async (searchTerm: string, movie: Movie) => {

   // check if a document exists for the search term
   try {

      const document_result = await appwrite_database.listDocuments(appwrite_database_id, appwrite_schema_id,
         [
            Query.equal('search_term', searchTerm)
         ]
      );

      if (document_result.documents.length > 0) {
         // The search term exists
         const searchTerm = document_result.documents[0];

         // Update the count on the search term
         await appwrite_database.updateDocument(appwrite_database_id, appwrite_schema_id, searchTerm.$id, {
            search_count: searchTerm.search_count + 1
         });

      } else {

         // Create a new document for the search term
         await appwrite_database.createDocument(appwrite_database_id, appwrite_schema_id, ID.unique(), {
            search_term: searchTerm,
            search_count: 1,
            movie_id: movie.id,
            poster_image_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
         });

      }
   } catch (error: unknown) {
      alert((error as AppwriteException).message);
   }

}

export const fetchTrendingMovies = async () => {

   // Get the movies that are trending
   try {

      // Get the list of documents
      const trending_movies = await appwrite_database.listDocuments(appwrite_database_id, appwrite_schema_id,
         [
            Query.limit(5),
            Query.orderDesc('search_count')
         ]
      );

      return trending_movies.documents;

   } catch (error: unknown) {
      alert((error as AppwriteException).message);
   }

}