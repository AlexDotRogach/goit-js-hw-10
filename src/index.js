import './css/styles.css';
import country from './fetchCountries';
import createList from './renderList';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const listCounrty = document.querySelector('.country-list');

input.addEventListener('input', debounce(inputInvoke, DEBOUNCE_DELAY));

function inputInvoke(e) {
  searchCountry(
    country(
      `https://restcountries.com/v3.1/name/${e.target.value.trim()}?fields=name,capital,population,flags,languages`
    )
  );
}

function searchCountry(promise) {
  promise
    .then(response => {
      if (response.status === 404) throw '';

      return response.json();
    })
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return '';
      }

      listCounrty.innerHTML = '';

      if (data.length > 1) {
        data.forEach(element => {
          createList(
            listCounrty,
            `<img src=${element.flags.svg} alt =${element.name.official}>
          <span>${element.name.common}</span>`
          );
        });
      } else {
        const element = data[0];

        createList(
          listCounrty,
          `<div class="country__about">
        <div class="country__wrapper">
          <img src=${element.flags.svg} alt =${element.name.official}>
          <div class="country__title">${element.name.common}</div>
        </div>
        <div class="country__captial"><b>Captial: </b>${[
          ...element.capital,
        ]}</div>
        <div class="country__population"><b>Population: </b>${
          element.population
        }</div>
        <div class="country__languages"><b>Languages: </b>${Object.values(
          element.languages
        )}</div>
        </div>`
        );
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
