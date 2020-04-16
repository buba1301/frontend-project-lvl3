import axios from 'axios';
import _ from 'lodash';
import parseRSS from './parser';

const proxy = 'https://cors-anywhere.herokuapp.com/';

const regularNewsUpdates = (state) => {
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
    return [...currentPostsList.posts, ...postsDifferenceList];
  };

  Promise.all(promisesUrls)
    .then((responses) => {
      responses.forEach(update);
    })
    .finally(() => setTimeout(() => regularNewsUpdates(state), updateInterval));
};
export default regularNewsUpdates;
