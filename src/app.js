import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import watch from './watchers';
import parseRSS from './parser';
import resources from './locales';
import regularNewsUpdates from './requests';
import validation from './validator';


const updateValidationState = (state) => {
  const { form, feed } = state;
  const urlsList = feed.channels.map(({ url }) => url);

  try {
    validation(form.value, urlsList);
    form.valid = true;
    form.errors = '';
  } catch (error) {
    form.valid = false;
    form.errors = error.type;
  }
};

const proxy = 'https://cors-anywhere.herokuapp.com/';

const addChannel = (state, url) => {
  const { feed, form } = state;

  const link = `${proxy}${state.form.value}`;

  axios.get(link)
    .then((response) => {
      const feedData = parseRSS(response.data);

      form.processState = 'finished';

      const { title, desc, posts } = feedData;

      const id = _.uniqueId();

      feed.activeChannelId = id;

      feed.channels.push({
        id,
        title,
        desc,
        url,
      });
      feed.postsList.push({ id, posts });
      form.value = '';
    })
    .catch((error) => {
      console.log(error.request);
    });
};

export default () => {
  const state = {
    feed: {
      channels: [],
      postsList: [],
      postsListState: 'close',
      activeChannelId: '',
    },
    form: {
      processState: 'filling',
      value: '',
      valid: false,
      errors: '',
    },
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then((t) => {
    watch(state, t);
  });

  const form = document.querySelector('form');
  const field = document.querySelector('[name="url"]');

  regularNewsUpdates(state);

  field.addEventListener('input', ({ target }) => {
    state.form.value = target.value;
    updateValidationState(state, proxy);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    state.form.processState = 'sending';

    addChannel(state, url);
  });
};
