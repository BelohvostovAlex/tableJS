document.addEventListener("DOMContentLoaded", () => {
  const getData = async (url) => {
    try {
      const response = await fetch(url);
      const users = await response.json();
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteItem = async (config) => {
    try {
      const { url, id } = config;
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  const createEl = (config) => {
    const { el, text, styles } = config;
    const tag = document.createElement(el);
    tag.textContent = text;
    tag.style.cssText = styles;
    return tag;
  };

  const createCheckbox = (config) => {
    const { el, type, attribute, attributeVal } = config;
    const input = createEl({ el });
    input.type = type;
    input.setAttribute(attribute, attributeVal);
    return input;
  };

  const createTable = (tableCaption, thNames, fetchedData) => {
    const table = createEl({
      el: "table",
      styles: `
        width: 1200px;
        background: gray;
        padding: 20px;
        margin: 0 auto;
        text-align: center;
        border: 2px solid black;
        `,
    });

    const caption = createEl({
      el: "caption",
      text: tableCaption,
      styles: `
        color: gray;
        font-size: 30px;
        padding: 10px 0px;
        `,
    });
    const thead = createEl({ el: "thead" });
    const trHead = createEl({ el: "tr" });
    const tbody = createEl({ el: "tbody" });

    table.append(caption);
    table.append(thead);
    table.append(tbody);
    thead.append(trHead);

    thNames.forEach((title) => {
      const th = createEl({
        el: "th",
        text: title,
        styles: `
          font-size: 18px;
          text-transform: uppercase;
          padding: 10px 0px;
          `,
      });
      trHead.append(th);
    });

    for (let item of fetchedData) {
      const tr = createEl({ el: "tr" });
      const td = createEl({ el: "td", styles: `padding: 10px;` });
      const input = createCheckbox({
        el: "input",
        type: "checkbox",
        attribute: "id",
        attributeVal: item.id,
      });
      td.append(input);
      tr.append(td);
      thNames.slice(1).forEach((thName) => {
        const td = createEl({
          el: "td",
          text: item[thName],
          styles: `
          padding: 10px;
          `,
        });
        tr.append(td);
      });
      tbody.append(tr);
    }
    document.body.prepend(table);
  };

  const createBtn = () => {
    const button = createEl({
      el: "button",
      text: "delete",
      styles: `width: 60px; height: 30px; margin: 20px auto; display: block; background: gray; border: none; color: white;`,
    });
    document.body.append(button);

    button.addEventListener("click", deleteRow);
  };

  const deleteRow = () => {
    const allCheckboxes = document.querySelectorAll("input");
    allCheckboxes.forEach((el) => {
      if (el.checked) {
        const id = el.getAttribute("id");
        deleteItem({ url: "https://jsonplaceholder.typicode.com/users", id });
        el.closest("tr").remove();
      }
    });
  };

  getData("https://jsonplaceholder.typicode.com/users")
    .then((data) =>
      createTable(
        "Table #1 (Users data)",
        ["check", "id", "name", "phone", "website"],
        data
      )
    )
    .catch((err) => {
      throw new Error(err.message);
    });
  createBtn();
});
