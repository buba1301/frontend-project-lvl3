import { watch } from 'melanke-watchjs';

export default (state) => {
  const { channels, postsList, form } = state;

  // const formElement = document.querySelector('[id="form"]');
  const fieldELement = document.querySelector('[id="url-address"]');
  const submitButton = document.querySelector('[type="submit"]');
  const subscribe = document.querySelector('.jumbotron');
  const container = document.createElement('div');
  container.classList.add('container');
  subscribe.after(container);

  watch(form, 'errors', () => {
    const errorElement = fieldELement.nextElementSibling;
    const { errors, value } = state.form;
    const errorMessage = errors.url;
    if (errorElement) {
      fieldELement.classList.remove('is-invalid');
      errorElement.remove();
    }
    if (!errorMessage || value === '') {
      return;
    }
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('invalid-feedback');
    feedbackElement.innerHTML = errorMessage;
    fieldELement.classList.add('is-invalid');
    fieldELement.after(feedbackElement);
  });

  watch(form, 'valid', () => {
    submitButton.disabled = !state.form.valid;
  });

  watch(form, 'processState', () => {
    const { processState } = state.form;
    switch (processState) {
      case 'filling':
        submitButton.disabled = false;
        break;
      case 'sending':
        submitButton.disabled = true;
        break;
      case 'finished':

        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  });

  watch(state, 'channels', () => {
    channels.forEach((channel) => {
      const { id, title, desc } = channel;

      const cardElem = document.createElement('div');
      cardElem.classList.add('card');
      container.append(cardElem);

      const cardHeadElem = document.createElement('h5');
      cardHeadElem.classList.add('card-header');
      cardHeadElem.textContent = title;
      cardElem.append(cardHeadElem);

      const cardBodyElem = document.createElement('div');
      cardBodyElem.classList.add('card=body');
      cardElem.append(cardBodyElem);

      const cardTitleElem = document.createElement('p');
      cardTitleElem.classList.add('card-title');
      cardTitleElem.textContent = desc;
      cardBodyElem.append(cardTitleElem);

      const ul = document.createElement('ul');
      ul.classList.add('list-group');
      ul.classList.add('list-group-flush');
      cardElem.append(ul);

      const filterPosts = postsList.find((post) => id === post.id);
      console.log(filterPosts);

      const { posts } = filterPosts;

      posts.forEach(({ text, link }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');

        li.classList.add('list-group-item');
        ul.append(li);
        a.classList.add('card-link');
        a.href = link;
        a.textContent = text;
        li.append(a);
      });
    });
  });
};
