export default function createList(parent, html) {
  const newElementList = document.createElement('li');
  newElementList.innerHTML = `
    ${html}
  `;
  parent.append(newElementList);
}
