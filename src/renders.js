
const renderConteiner = (text) => {
  const subscribe = document.querySelector('.jumbotron');
  const container = document.createElement('div');
  container.classList.add('container-fluid');
  subscribe.after(container);

  const rowElem = document.createElement('div');
  rowElem.classList.add('row');
  container.append(rowElem);

  const colChannelsElem = document.createElement('div');
  colChannelsElem.classList.add('col-12', 'col-lg-6', 'mb-5');
  rowElem.append(colChannelsElem);

  const channelsHeaderELem = document.createElement('h4');
  channelsHeaderELem.classList.add('mb-3');
  channelsHeaderELem.textContent = text('headers.channelsList');
  colChannelsElem.append(channelsHeaderELem);

  const channelsListElem = document.createElement('div');
  channelsListElem.classList.add('list-group');
  channelsListElem.id = 'rss-channels';
  colChannelsElem.append(channelsListElem);

  const colNewsElem = document.createElement('div');
  colNewsElem.classList.add('col-12', 'col-lg-6', 'mb-5');
  rowElem.append(colNewsElem);

  const newsHeaderElem = document.createElement('h4');
  newsHeaderElem.classList.add('mb-3');
  newsHeaderElem.textContent = text('headers.newsList');
  colNewsElem.append(newsHeaderElem);

  const newsListElem = document.createElement('div');
  newsListElem.classList.add('list-group');
  newsListElem.id = 'rss-news';
  colNewsElem.append(newsListElem);
};

const renderChannelElem = ([channel, activeChannelId]) => {
  const { id, title, desc } = channel;

  const currentElem = document.getElementById(`${id}`);

  if (currentElem) {
    currentElem.remove();
  }

  const channelsListElem = document.getElementById('rss-channels');

  const listGroupElem = document.createElement('a');
  listGroupElem.classList.add('list-group-item', 'list-group-item-action');
  listGroupElem.id = `${id}`;
  listGroupElem.href = '#';

  const html = (
    `<div class="d-flex w-100 justify-content-between" id=${id}>
      <h5 class="mb-1" id=${id}>${title}</h5>
    </div>
    <p class="mb-1" id=${id}>${desc}</p>`);

  if (id === activeChannelId) {
    listGroupElem.classList.add('active');
  }

  listGroupElem.innerHTML = html;
  channelsListElem.append(listGroupElem);
};

const renderNewsElements = (posts) => {
  const newsListElem = document.getElementById('rss-news');

  posts.forEach(({ text, link }) => {
    const a = document.createElement('a');
    a.classList.add('list-group-item', 'list-group-item-action', 'action');
    a.href = link;
    a.textContent = text;
    newsListElem.append(a);
  });
};

const renderChangeChannel = (id) => {
  console.log(id);
  const activeChannel = document.querySelector('.active');
  activeChannel.classList.remove('active');
  const newActiveChannel = document.getElementById(id);
  newActiveChannel.classList.add('active');
};

const renders = {
  containerForChannals: renderConteiner,
  channelItem: renderChannelElem,
  newsItem: renderNewsElements,
  changeChannel: renderChangeChannel,
};

export default (element, data) => renders[element](data);
