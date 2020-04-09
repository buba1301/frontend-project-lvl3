export default (data) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(data, 'application/xml');

  const titleСhannel = doc.querySelector('title');
  const descChannel = doc.querySelector('description');

  const items = doc.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const titlePost = item.querySelector('title');
    const linkPost = item.querySelector('link');
    return { text: titlePost.textContent, link: linkPost.textContent };
  });

  const feedData = {
    title: titleСhannel.textContent,
    desc: descChannel.textContent,
    posts,
  };
  return feedData;
};
