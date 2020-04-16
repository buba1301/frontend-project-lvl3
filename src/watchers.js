/* eslint-disable no-param-reassign */
import { watch } from 'melanke-watchjs';
import render from './renders';

export default (state, t) => {
  const { feed, form } = state;

  const fieldELement = document.querySelector('[name="url"]');
  const submitButton = document.querySelector('[type="submit"]');
  const feedbackElem = document.querySelector('.feedback');

  render('containerForChannals', t);

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
        submitButton.textContent = t('submitButton.sending');
        feedbackElem.classList.add('text-warning');
        feedbackElem.textContent = t('field.request');
        break;
      case 'finished':
        submitButton.disabled = false;
        submitButton.textContent = t('submitButton.finish');
        feedbackElem.classList.remove('text-warning');
        feedbackElem.classList.add('text-success');
        feedbackElem.textContent = t('field.success');
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
    const { channels, activeChannelId } = state.feed;
    console.log(channels);

    channels.forEach((channel) => {
      render('channelItem', [channel, activeChannelId]);
    });

    const channelsListElem = document.getElementById('rss-channels');
    channelsListElem.addEventListener('click', ({ target }) => {
      state.feed.activeChannelId = target.id;
      render('changeChannel', target.id);
    });
  });

  watch(feed, 'activeChannelId', () => {
    const { postsList, activeChannelId } = state.feed;

    const currentElem = document.getElementById('rss-news');

    currentElem.innerHTML = '';

    const filterPosts = postsList.find((post) => activeChannelId === post.id);

    render('newsItem', filterPosts);
  });
};
