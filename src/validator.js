import * as yup from 'yup';
import axios from 'axios';

const validation = (url, urlsList) => (
  yup.string()
    .url()
    .required()
    .notOneOf(urlsList)
    .validateSync(url)
);

export default (state) => {
  const { form, feed } = state;
  const urlsList = feed.channels.map(({ url }) => axios.get(url));
  try {
    validation(form.value, urlsList);
    form.valid = true;
    form.errors = '';
  } catch (error) {
    form.valid = false;
    form.errors = error.type;
  }
};
