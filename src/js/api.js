// const ENDPOINT = `'https://pixabay.com/api`;
// const options = {
//   headers: {
//     apiKey : '33812584-68d8dce8f2547dfdea921578d',
//   },
// };
const BASE_URL = 'https://pixabay.com/api/';
const apiKey = '33812584-68d8dce8f2547dfdea921578d';

export default class NewsApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async getPictures() {
    const picturesUrl = `${BASE_URL}?key=${apiKey}&q=${this.searchQuery}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`;

      const response = await axios.get(picturesUrl);
      console.log(response.data);
      
           this.nextPage();
      return response.data ;
    }
    
 
  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}


