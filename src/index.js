import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import 'simplelightbox/dist/simple-lightbox.min.js';
// import galleryMarkup from './js/markup.js';
import LoadMoreBtn from './js/loadMoreBtn.js';
import NewsApiService from './js/api.js';

const form = document.getElementById("search-form");
const galleryWrapper = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const newsApiService = new NewsApiService();
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '.load-more',
//   isHidden: true,
// });

console.log(newsApiService);
console.log(loadBtn);

form.addEventListener('submit', onSubmit);
loadBtn.button.addEventListener('click', fetchArticles);

function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
    const value = form.elements.searchQuery.value.trim();

     if (value ==='')
       return Notiflix.Notify.warning(
         'Please enter a search query.'
       );
    
    newsApiService.searchQuery = value;
    

  newsApiService.resetPage();
  clearGalery();

  fetchArticles().finally(() => form.reset());
}

async function fetchArticles() {

   try {
      const data = await newsApiService.getPictures();
      const hits = data.hits;
    const totalHits = data.totalHits;
      console.log('🚀 ~ hits', hits,  totalHits );
  
    //   console.log(`total Hits`, totalHits);
    //   if (hits.length === 0) throw new Error('No data');
      if (hits.length === 0) {
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'
          );
          return;
      }
    

    //   if(totalHits<40) { loadMoreBtn.hide()} ;

    
      
    //   console.log(data.totalHits);
      
    //   const markup = hits.reduce(
    //   (markup, hit) => galleryMarkup(hit) + markup,
    //   ''
    // );
        // loadMoreBtn.show();

      const markup = hits.reduce(
          (markup, hit => galleryMarkup(hit) + markup,
              ''
          ));
       
      appendPicToGallery(markup);

    // appendPicToGallery(markup);
    //   loadMoreBtn.enable();
      lightbox(refresh);
  } catch (err) {
    console.error(err);
  }

}


function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
  appendNewsToList('<p>Articles not found</p>');
}


function galleryMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <div class="photo-card">
    <a href="${largeImageURL}">
        <img src="${webformatURL}" alt=${tags} loading="lazy" />
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes <span>${likes} </span></b>
    </p>
    <p class="info-item">
      <b>Views <span>${views} </span></b>
    </p>
    <p class="info-item">
      <b>Comments <span> ${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <span> ${downloads} </span></b>
    </p>
  </div>
</div>`;
}

function appendPicToGallery(markup) {
  galleryWrapper.insertAdjacentHTML('beforeend', markup);
}

function clearGalery() {
  galleryWrapper.innerHTML = '';
}
