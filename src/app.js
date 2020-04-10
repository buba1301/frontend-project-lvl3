import i18next from 'i18next';
import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import parseRSS from './parser';
import render from './renders';
import resources from './locales';

const validation = (url, urlsList) => (
  yup.string()
    .url()
    .required()
    .notOneOf(urlsList)
    .validateSync(url)
);

const updateValidationState = (state) => {
  const { form, feed } = state;
  console.log(form.value);
  const urlsList = feed.channels.map(({ url }) => url);
  try {
    validation(form.value, urlsList);
    form.valid = true;
    form.errors = '';
  } catch (error) {
    console.log(error);
    form.valid = false;
    form.errors = error.type;
  }
};

const addChannel = (feedData, state, url) => {
  const { title, desc, posts } = feedData;
  const { feed, form } = state;
  const id = _.uniqueId();
  feed.channels.push({
    id, title, desc, url,
  });
  feed.postsList.push({ id, posts });
  form.value = '';
};

export default () => {
  const state = {
    feed: {
      channels: [],
      postsList: [],
      postsListState: 'close',
    },
    form: {
      processState: 'filling',
      value: '',
      valid: false,
      errors: '',
    },
  };

  console.log(state);
  console.log(state.postsListState);

  const form = document.querySelector('form');
  const field = document.querySelector('[name="url"]');

  const crossOrigin = 'http://cors-anywhere.herokuapp.com/';

  field.addEventListener('input', ({ target }) => {
    state.form.value = target.value;
    updateValidationState(state);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const link = `${crossOrigin}${state.form.value}`;

    state.form.processState = 'sending';

    axios.get(link)
      .then((response) => {
        const feedData = parseRSS(response.data);
        state.form.processState = 'finished';
        addChannel(feedData, state, url);
      })
      .catch((error) => {
        console.log(error.request);
      });
  });

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then((t) => {
    render(state, t);
  });
};
