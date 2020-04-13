import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parser';

const proxy = 'http://cors-anywhere.herokuapp.com/';

export const regularNewsUpdates = (state) => {
  const { channels, postsList } = state.feed;

  const updateInterval = 5000;

  const promisesUrls = channels.map(({ url }) => axios.get(`${proxy}${url}`));

  const update = ({ data }) => {
    const updateFeedData = parseRSS(data);

    const { title, posts } = updateFeedData;

    const updatePostsLinkList = posts.map(({ link }) => link);

    const currentChannel = channels.find((channel) => channel.title === title);
    const currentPostsList = postsList.find(({ id }) => id === currentChannel.id);
    const currentPostsLinkList = currentPostsList.posts.map(({ link }) => link);

    const postsDifferenceList = _.difference(updatePostsLinkList, currentPostsLinkList);
    console.log(postsDifferenceList);
    return [...currentPostsList.posts, ...postsDifferenceList];
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

  axios.get(link)
    .then((response) => {
      const feedData = parseRSS(response.data);
      form.processState = 'finished';

      const { title, desc, posts } = feedData;

      const id = _.uniqueId();
      feed.channels.push({
        id,
        title,
        desc,
        url,
      });
      feed.postsList.push({ id, posts });
      form.value = '';
    })
    .catch((error) => {
      console.log(error.request);
    });
};
