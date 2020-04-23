import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parser';

const proxy = 'https://cors-anywhere.herokuapp.com/';

export const regularNewsUpdates = (state) => {
  const { channels, posts } = state.feed;

  const updateInterval = 5000;

  const promisesUrls = channels.map(({ url }) => axios.get(`${proxy}${url}`));

  const update = ({ data }) => {
    const updateFeedData = parseRSS(data);

    const { title, news } = updateFeedData;

    const updatePostsLinkList = news.map(({ link }) => link);

    const currentChannel = channels.find((channel) => channel.title === title);
    const currentPostsList = posts.find(({ id }) => id === currentChannel.id);
    const currentPostsLinkList = currentPostsList.news.map(({ link }) => link);

    const postsDifferenceList = _.difference(updatePostsLinkList, currentPostsLinkList);
    return [...currentPostsList.news, ...postsDifferenceList];
  };

  Promise.all(promisesUrls)
    .then((responses) => {
      responses.forEach(update);
    })
    .finally(() => setTimeout(() => regularNewsUpdates(state), updateInterval));
};

export const addChannel = (state, url) => {
  const { feed, form } = state;

  const link = `${proxy}${state.form.value}`;

  form.processState = 'sending';

  axios.get(link)
    .then((response) => {
      const feedData = parseRSS(response.data);

      form.processState = 'finished';

      const { title, desc, news } = feedData;

      const id = _.uniqueId();

      feed.activeChannelId = id;

      feed.channels.push({
        id,
        title,
        desc,
        url,
      });
      feed.posts.push({ id, news });
      form.value = '';
    })
    .catch((error) => {
      console.log(error.request);
      if (error.request) {
        form.errors = ['network'];
      } else {
        form.errors = [error.type];
      }
      form.processState = 'filling';
    });
};
