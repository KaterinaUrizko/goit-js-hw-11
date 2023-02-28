import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import fetchImages from './js/fetchImages';

const searchForm = document.querySelector('#search-form');
const galleryWrapper = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let perPage = 40;
let page = 1;
let query = '';
let totalHits = 0;

searchForm.addEventListener('submit', onSubmit);
loadBtn.addEventListener('click', loadPictures);

loadBtnHide();

function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  query = form.elements.searchQuery.value.trim();

  if (query === '')
    return Notiflix.Notify.warning('Please enter a search query.');

  resetPage();
  clearGalery();
  loadPictures().finally(() => form.reset());
}
async function loadPictures() {
  try {
    const images = await fetchImages(query, page);
    const hits = images.hits;
    totalHits = images.totalHits;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    loadBtnShow();

    if (page === 1) {
      Notiflix.Notify.info(`We have found for you ${totalHits} pictures`);
    }

    if (totalHits < perPage) {
      loadBtnHide();
    }

    if (totalHits < page * perPage && totalHits > 40) {
      loadBtnHide();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    const markup = hits.reduce(
      (markup, hit) => galleryMarkup(hit) + markup,
      ''
    );

    appendPicToGallery(markup);

    nextPage();
    lightbox.refresh();
  } catch (err) {
    console.error(err);
  }
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
function nextPage() {
  page += 1;
}
function resetPage() {
  page = 1;
}
function loadBtnShow() {
  loadBtn.style.display = 'block';
}
function loadBtnHide() {
  loadBtn.style.display = 'none';
}
