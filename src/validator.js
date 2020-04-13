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
  console.log(form.value);
  const urlsList = feed.channels.map(({ url }) => axios.get(url));
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
