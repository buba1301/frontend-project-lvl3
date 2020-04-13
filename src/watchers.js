/* eslint-disable no-param-reassign */
import { watch } from 'melanke-watchjs';
import renders from './renders';

export default (state, t) => {
  const { feed, form } = state;

  const fieldELement = document.querySelector('[name="url"]');
  const submitButton = document.querySelector('[type="submit"]');
  const feedbackElem = document.querySelector('.feedback');

  watch(form, 'errors', () => {
    const { errors, value } = state.form;
    const errorType = errors;
    if (errorType === '' || value === '') {
      fieldELement.classList.remove('is-invalid');
      feedbackElem.classList.remove('text-danger');
      feedbackElem.textContent = '';
      return;
    }
    fieldELement.classList.add('is-invalid');
    feedbackElem.classList.add('text-danger');
    feedbackElem.textContent = t(`errors.${errorType}`);
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
        feedbackElem.classList.add('text-success');
        feedbackElem.textContent = t('success.field');
        setTimeout(() => {
          feedbackElem.classList.remove('text-success');
          feedbackElem.textContent = '';
        }, 1000);
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

    channels.forEach((channel) => {
      const { id } = channel;

      const currentElem = document.getElementById(`channel${id}`);

      if (currentElem) {
        currentElem.remove();
      }

      renders('channelItem', channel);

      const filterPosts = postsList.find((post) => id === post.id);

      renders('newsItem', [channel, filterPosts]);

      const deletElem = document.getElementById(`${id}`);

      deletElem.addEventListener('click', (e) => {
        e.preventDefault();
        const { target } = e;
        const currentId = target.id;
        const updateChannels = channels.filter((element) => element.id !== currentId);
        const updatePostsList = postsList.filter((element) => element.id !== currentId);
        feed.channels = updateChannels;
        feed.postsList = updatePostsList;
        renders('deletItem', currentId);
      });
    });
  });
};
