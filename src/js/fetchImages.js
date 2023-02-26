const BASE_URL = 'https://pixabay.com/api/';
const apiKey = '33812584-68d8dce8f2547dfdea921578d';

export default async function fetchImages(query, page) {
  const picturesUrl = `${BASE_URL}?key=${apiKey}&q=${query}&per_page=40&page=${page}&image_type=photo&orientation=horizontal&safesearch=true`;

  try {
    const response = await axios.get(picturesUrl);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
