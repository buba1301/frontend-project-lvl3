import * as yup from 'yup';

export default (url, urlsList) => (
  yup.string()
    .url()
    .required()
    .notOneOf(urlsList)
    .validateSync(url)
);
