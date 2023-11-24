/**
 *
 * @param {Text} title
 * @param {boolean} state
 * @param {number} id
 * @returns {DocumentFragment}
 */
export function add(title, state, id) {
  const li = cloneTemplate("todolist-item");
  const checkBox = li.querySelector("input");
  const label = li.querySelector("label");
  const textTodo = li.querySelector(".todo-text");

  checkBox.setAttribute("id", id);
  label.setAttribute("for", id);
  textTodo.innerText = title;
  if (state === "on") {
    checkBox.checked = true;
  }

  return li;
}

/**
 *
 * @param {HTMLElement} id
 * @returns {DocumentFragment}
 */
function cloneTemplate(id) {
  return document.getElementById(id).content.cloneNode(true);
}
