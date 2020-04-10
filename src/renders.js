/* eslint-disable no-param-reassign */
import { watch } from 'melanke-watchjs';

const renderDelete = (id) => {
  const removeElem = document.getElementById(id);
  removeElem.remove();
};

const renderModal = (state, id) => {
  console.log(id);
  const { feed } = state;
  const modalFadeElem = document.getElementById(id);
  console.log(modalFadeElem);
  if (feed.postsListState === 'open') {
    modalFadeElem.classList.add('show');
    modalFadeElem.style.display = 'block';
  }
  modalFadeElem.classList.remove('show');
  modalFadeElem.style.display = 'none';
};

const render = (state, t) => {
  const { feed, form } = state;

  const fieldELement = document.querySelector('[name="url"]');
  const submitButton = document.querySelector('[type="submit"]');
  const subscribe = document.querySelector('.jumbotron');
  const feedbackElem = document.querySelector('.feedback');
  const container = document.createElement('div');
  container.classList.add('container');
  subscribe.after(container);

  watch(form, 'errors', () => {
    const errorText = feedbackElem.textContent;
    console.log(errorText);
    const { errors, value } = state.form;
    const errorType = errors;
    if (errorType === '' || value === '') {
      fieldELement.classList.remove('is-invalid');
      feedbackElem.textContent = '';
      return;
    }
    feedbackElem.textContent = t(`errors.${errorType}`);
    fieldELement.classList.add('is-invalid');
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
        submitButton.disabled = false;
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  });

  watch(form, 'value', () => {
    fieldELement.value = form.value;
  });

  watch(feed, 'channels', () => {
    const { channels, postsList } = state.feed;
    console.log(channels, postsList);
    channels.forEach((channel) => {
      const { id, title, desc } = channel;

      const currentElem = document.getElementById(id);
      if (currentElem) {
        currentElem.remove();
      }

      const cardElem = document.createElement('div');
      cardElem.classList.add('card', 'text-center');
      cardElem.id = id;
      container.append(cardElem);

      const cardHeaderElem = document.createElement('div');
      cardHeaderElem.classList.add('card-header');
      cardElem.append(cardHeaderElem);

      const ulHeaderElem = document.createElement('ul');
      ulHeaderElem.classList.add('nav', 'nav-pills', 'card-header-pills');
      cardHeaderElem.append(ulHeaderElem);

      const li = document.createElement('li');
      li.classList.add('nav-item');
      ulHeaderElem.append(li);

      const deletElem = document.createElement('a');
      deletElem.classList.add('badge', 'badge-danger');
      deletElem.href = '#';
      deletElem.id = id;
      deletElem.textContent = 'x';
      li.append(deletElem);

      const cardBodyElem = document.createElement('div');
      cardBodyElem.classList.add('card-body');
      cardElem.append(cardBodyElem);

      const cardTitleElem = document.createElement('h5');
      cardTitleElem.classList.add('card-title');
      cardTitleElem.textContent = title;
      cardBodyElem.append(cardTitleElem);

      const descElem = document.createElement('p');
      descElem.classList.add('card-text');
      descElem.textContent = desc;
      cardBodyElem.append(descElem);

      const modalButtonElem = document.createElement('button');
      modalButtonElem.classList.add('btn', 'btn-primary');
      modalButtonElem.setAttribute('type', 'button');
      modalButtonElem.setAttribute('data-toggle', 'modal');
      modalButtonElem.setAttribute('data-target', `#exampleModalLong${id}`);
      modalButtonElem.textContent = t(`buttonText.${modalButtonElem.dataset.toggle}`);
      cardBodyElem.append(modalButtonElem);

      const modalFadeElem = document.createElement('div');
      modalFadeElem.classList.add('modal', 'fade');
      modalFadeElem.id = `exampleModalLong${id}`;
      modalFadeElem.setAttribute('tabindex', '-1');
      modalFadeElem.setAttribute('role', 'dialog');
      modalFadeElem.setAttribute('aria-labelledby', 'exampleModalLongTitle');
      modalFadeElem.setAttribute('aria-hidden', 'true');
      cardBodyElem.append(modalFadeElem);

      const modalDialogElem = document.createElement('div');
      modalDialogElem.classList.add('modal-dialog', 'modal-lg');
      modalDialogElem.setAttribute('role', 'document');
      modalFadeElem.append(modalDialogElem);

      const modalContentElem = document.createElement('div');
      modalContentElem.classList.add('modal-content');
      modalDialogElem.append(modalContentElem);

      const modalHeaderElem = document.createElement('div');
      modalHeaderElem.classList.add('modal-header');
      modalContentElem.append(modalHeaderElem);

      const modalTitleElem = document.createElement('h5');
      modalTitleElem.classList.add('modal-title');
      modalTitleElem.id = 'exampleModalLongTitle';
      modalTitleElem.textContent = `${title}  ${desc}`;
      modalHeaderElem.append(modalTitleElem);

      const closeButtonElem = document.createElement('button');
      closeButtonElem.classList.add('close');
      closeButtonElem.setAttribute('type', 'button');
      closeButtonElem.setAttribute('data-dismiss', 'modal');
      closeButtonElem.setAttribute('aria-label', 'Close');
      modalHeaderElem.append(closeButtonElem);

      const span = document.createElement('span');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = 'x';
      closeButtonElem.append(span);

      const modalBodyElem = document.createElement('div');
      modalBodyElem.classList.add('modal-body');
      modalContentElem.append(modalBodyElem);

      const divList = document.createElement('div');
      divList.classList.add('list-group');
      modalBodyElem.append(divList);

      const filterPosts = postsList.find((post) => id === post.id);

      const { posts } = filterPosts;

      posts.forEach(({ text, link }) => {
        const a = document.createElement('a');
        a.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        a.href = link;
        a.textContent = text;

        divList.append(a);
      });

      const cardFooterElem = document.createElement('div');
      cardFooterElem.classList.add('card-footer');
      cardElem.append(cardFooterElem);

      deletElem.addEventListener('click', (e) => {
        e.preventDefault();
        const { target } = e;
        console.log(typeof target.id);
        const currentId = target.id;
        const updateChannels = channels.filter((element) => element.id !== currentId);
        console.log(updateChannels);
        const updatePostsList = postsList.filter((element) => element.id !== currentId);
        console.log(updatePostsList);
        feed.channels = updateChannels;
        feed.postsList = updatePostsList;
        renderDelete(currentId);
      });

      const idButton = modalButtonElem.dataset.target.slice(1);

      modalButtonElem.addEventListener('click', (e) => {
        e.preventDefault();
        feed.postsListState = 'open';
        renderModal(state, idButton);
      });

      closeButtonElem.addEventListener('click', (e) => {
        e.preventDefault();
        feed.postsListState = 'close';
        renderModal(state, idButton);
      });
    });
  });
};
export default render;
