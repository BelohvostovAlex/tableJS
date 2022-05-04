document.addEventListener("DOMContentLoaded", () => {
  const getData = async (url) => {
    try {
      const response = await fetch(url);
      const users = await response.json();
      return users;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (url, id) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE'
      })
      const json = await response.json()
      return json
    } catch (error) {
      console.log(error)
    }
  }

   const createEl = (el, text, styles) => {
    const tag = document.createElement(el);
    tag.textContent = text;
    tag.style.cssText = styles;
    return tag;
  };

  const createBtn = () => {
    const button = createEl("button", 'delete', `width: 60px; height: 30px; margin: 20px auto; display: block; background: gray; border: none; color: white;`);
    document.body.append(button);

    button.addEventListener("click", () => {
      const allCheckboxes = document.querySelectorAll("input");

      allCheckboxes.forEach((el) => {
        if (el.checked) {
          let id = el.getAttribute("id");
          deleteItem('https://jsonplaceholder.typicode.com/users', id)
          el.closest('tr').remove()
        }
      });
    });
  };

  const createTable = async (tableCaption, thNames, fetchedData) => {
    try {
      const table = createEl(
        "table",
        null,
        `
        width: 1200px;
        background: gray;
        padding: 20px;
        margin: 0 auto;
        text-align: center;
        border: 2px solid black;
        `
      );

      const caption = createEl(
        "caption",
        tableCaption,
        `
        color: gray;
        font-size: 30px;
        padding: 10px 0px;
        `
      );
      const thead = createEl("thead");
      const trHead = createEl("tr");
      const tbody = createEl("tbody");

      table.append(caption);
      table.append(thead);
      table.append(tbody);
      thead.append(trHead);

      thNames.forEach((element) => {
        const th = createEl(
          "th",
          element,
          `
          font-size: 18px;
          text-transform: uppercase;
          padding: 10px 0px;
          `
        );
        trHead.append(th);
      });

      const data = await fetchedData;

      for (let item of data) {
        const tr = createEl("tr");
        const input = createEl('input')
        input.type = 'checkbox'
        input.setAttribute("id", item.id)
        const td = createEl('td')
        td.append(input)
        tr.append(td)
        thNames.slice(1).forEach((thName) => {
          const td = createEl("td", item[thName]);
          tr.append(td);
        });
        tbody.append(tr);
      }
      document.body.prepend(table);

      const allTd = document.querySelectorAll("td");
      for (let i = 0; i < allTd.length; i++) {
        allTd[i].style.cssText = `
        padding: 10px;
        `;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

    createTable(
    "Table #1 (Users data)",
    ["check","id", "name", "phone", "website"],
    getData("https://jsonplaceholder.typicode.com/users")
  );
  createBtn();
});
