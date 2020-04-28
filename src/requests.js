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

    const updatePostsLinksList = news.map(({ link }) => link);

    const currentChannel = channels.find((channel) => channel.title === title);
    const currentPostsList = posts.filter(({ channelId }) => channelId === currentChannel.id);
    const currentPostsLinksList = currentPostsList.map(({ link }) => link);

    const postsDifferenceList = _.difference(updatePostsLinksList, currentPostsLinksList);
    return [...currentPostsList, ...postsDifferenceList];
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

      const channelId = _.uniqueId();

      feed.activeChannelId = channelId;

      feed.channels.push({
        id: channelId,
        title,
        desc,
        url,
      });
      news.forEach((post) => {
        const updatePost = { ...post, id: _.uniqueId(), channelId };
        feed.posts.push(updatePost);
      });
      form.value = '';
    })
    .catch((error) => {
      if (error.request) {
        form.errors = ['network'];
      } else {
        form.errors = [error.type];
      }
      form.processState = 'filling';
    });
};
