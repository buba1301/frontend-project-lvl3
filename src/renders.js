
const renderChannelElem = (channel) => {
  const { id, title, desc } = channel;

  const subscribe = document.querySelector('.jumbotron');
  const container = document.createElement('div');
  container.classList.add('container');
  subscribe.after(container);

  const channelElem = document.createElement('div');
  channelElem.classList.add('card', 'text-center');
  channelElem.id = `channel${id}`;

  const html = (
    `<div class="card-header">
       <ul class="nav nav-pills card-header-pills">
        <li class="nav-item">
          <a class="badge badge-danger" href="#" id="${id}">x</a>
        </li>
       </ul>
    </div>
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${desc}</p>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong${id}">News List</button>

        <div class="modal fade" id="exampleModalLong${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true"></div>
    </div>
    <div class="card-footer text-muted"></div>`);

  channelElem.innerHTML = html;
  container.append(channelElem);
};

const renderNewsModalWindow = ([channel, postsList]) => {
  const { id, title, desc } = channel;
  console.log(id);
  const modalElem = document.getElementById(`exampleModalLong${id}`);
  console.log(modalElem);
  const html = (
    `<div class="modal-dialog" role="document">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title" id="exampleModalLongTitle">${title}  ${desc}</h5>
             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">x</span>
             </button>
         </div>
         <div class="modal-body"></div>
       </div>
     </div>
      `);
  modalElem.innerHTML = html;

  const modalBodyElem = document.querySelector('.modal-body');
  console.log(modalBodyElem);

  postsList.posts.forEach(({ text, link }) => {
    const a = document.createElement('a');
    a.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    a.href = link;
    a.textContent = text;

    modalBodyElem.append(a);
  });
};


const renderDeleteChannel = (id) => {
  const removeElem = document.getElementById(`channel${id}`);
  console.log(removeElem);
  removeElem.remove();
};

const renders = {
  channelItem: renderChannelElem,
  newsItem: renderNewsModalWindow,
  deletItem: renderDeleteChannel,
};

export default (element, data) => renders[element](data);
