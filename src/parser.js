const isRss = (doc) => doc.firstChild.tagName === 'rss';

export default (data) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(data, 'application/xml');

  if (!isRss(doc)) {
    const error = new Error();
    error.type = 'wrongUrl';
    throw error;
  }

  const titleСhannel = doc.querySelector('title');
  const descChannel = doc.querySelector('description');

  const items = doc.querySelectorAll('item');
  const news = [...items].map((item) => {
    const titlePost = item.querySelector('title');
    const linkPost = item.querySelector('link');
    return { text: titlePost.textContent, link: linkPost.textContent };
  });

  const feedData = {
    title: titleСhannel.textContent,
    desc: descChannel.textContent,
    news,
  };
  return feedData;
};
