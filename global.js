
console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH =
  location.hostname === 'localhost' ||
  location.hostname === '127.0.0.1'
    ? '/'
    : '/YOUR-REPO-NAME/';

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/hannahtrn', title: 'GitHub' },
  { url: 'cv/', title: 'CV' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;

  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = p.title;

  if (a.host === location.host &&
      a.pathname === location.pathname) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  `
);

let select = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty(
    'color-scheme',
    colorScheme
  );

  select.value = colorScheme;
  localStorage.colorScheme = colorScheme;
}

select.addEventListener('input', function (event) {
  setColorScheme(event.target.value);
});

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

const form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault();

  const data = new FormData(form);
  let url = form.action + '?';

  for (let [name, value] of data) {
    url += `${name}=${encodeURIComponent(value)}&`;
  }

  location.href = url.slice(0, -1);
});