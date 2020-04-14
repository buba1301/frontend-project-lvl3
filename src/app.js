import i18next from 'i18next';
import watch from './watchers';
import resources from './locales';
import { regularNewsUpdates, addChannel } from './requests';
import validation from './validator';


const updateValidationState = (state) => {
  const { form, feed } = state;
  const urlsList = feed.channels.map(({ url }) => url);
  console.log(urlsList);
  try {
    validation(form.value, urlsList);
    form.valid = true;
    form.errors = '';
  } catch (error) {
    form.valid = false;
    form.errors = error.type;
  }
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

  const form = document.querySelector('form');
  const field = document.querySelector('[name="url"]');

  regularNewsUpdates(state);

  field.addEventListener('input', ({ target }) => {
    state.form.value = target.value;
    updateValidationState(state);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    state.form.processState = 'sending';

    addChannel(state, url);
  });

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then((t) => {
    watch(state, t);
  });
};