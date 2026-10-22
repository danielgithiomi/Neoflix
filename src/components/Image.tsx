import image_fallback from '../assets/images/no-movie.png';

interface ImageProps {
   imageUrl: string;
   alt: string
}

const Image = ({ imageUrl, alt }: ImageProps) => {

   const image_path = imageUrl ? `https://image.tmdb.org/t/p/w500/${imageUrl}` : image_fallback;

   return (
      <img src={image_path} alt={alt} />
   )
}

export default Image