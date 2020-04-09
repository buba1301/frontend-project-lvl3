import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import parseRSS from './parser';
import render from './renders';

const validation = (url, urlsList) => (
  yup.string()
    .url()
    .required()
    .notOneOf(urlsList)
    .validateSync(url)
);

const updateValidationState = (state) => {
  const { form, channels } = state;
  try {
    validation(form.value, channels);
    form.valid = true;
    form.errors = {};
  } catch (error) {
    const errors = {};
    errors.url = error.message;
    form.errors = errors;
  }
};

const addChannel = (feedData, state) => {
  const { title, desc, posts } = feedData;
  const { channels, postsList } = state;
  const id = _.uniqueId();
  channels.push({ id, title, desc });
  postsList.push({ id, posts });
};

export default () => {
  const state = {
    channels: [],
    postsList: [],
    form: {
      processState: 'filling',
      value: '',
      valid: false,
      errors: {},
    },
  };

  console.log(state);

  const form = document.querySelector('[id="form"]');
  const field = document.querySelector('[id="url-address"]');

  const crossOrigin = 'http://cors-anywhere.herokuapp.com/';

  field.addEventListener('input', ({ target }) => {
    state.form.value = target.value;
    console.log(target.value);
    updateValidationState(state);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const link = `${crossOrigin}${state.form.value}`;

    state.form.processState = 'sending';

    axios.get(link)
      .then((response) => {
        const feedData = parseRSS(response.data);
        state.form.processState = 'finished';
        addChannel(feedData, state);
        state.form.value = '';
      });
  });

  render(state);
};
