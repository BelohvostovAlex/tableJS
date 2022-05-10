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
      throw new Error(error.message);
    }
  };

  const createCheckbox = (config) => {
    const { el, type, attribute, attributeVal } = config;
    const input = createEl({ el });
    input.type = type;
    input.setAttribute(attribute, attributeVal);
    return input;
  };

  const createEl = (config) => {
    const { el, id, text, styles } = config;
    const tag = document.createElement(el);
    tag.textContent = text;
    if (styles) {
      tag.style.cssText = styles;
    }
    if (id) {
      tag.setAttribute("id", id);
    }
    return tag;
  };

  const createTable = (tableArgs) => {
    const { tableCaption, id, thNames, fetchedData, hasInput } = tableArgs;
    const table = createEl({
      el: "table",
      id: id,
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
      if (hasInput) {
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
          const TdDto = { name: thName, body: item.body, cb: unique, item };

          const td = createEl({
            el: "td",
            text: createUniqTd(TdDto),
            styles: `
            padding: 10px;
            `,
          });
          tr.append(td);
        });
      } else {
        thNames.forEach((thName) => {
          const TdDto = { name: thName, body: item.body, cb: unique, item };

          const td = createEl({
            el: "td",
            text: createUniqTd(TdDto),
            styles: `
            padding: 10px;
            `,
          });
          tr.append(td);
        });
      }

      tbody.append(tr);
    }
    document.body.prepend(table);
  };

  const createBtn = (url, tableId) => {
    const button = createEl({
      el: "button",
      text: "delete",
      styles: `width: 60px; height: 30px; margin: 20px auto; display: block; background: gray; border: none; color: white;`,
    });
    const table = document.getElementById(tableId);
    table.after(button);

    button.addEventListener("click", () => deleteRow(url, tableId));
  };

  const deleteRow = (url, tableId) => {
    const currTable = document.getElementById(tableId);
    const allCheckboxes = currTable.querySelectorAll("input");
    allCheckboxes.forEach((el) => {
      if (el.checked) {
        const id = el.getAttribute("id");
        deleteItem({ url, id });
        el.closest("tr").remove();
      }
    });
  };

  getData("https://jsonplaceholder.typicode.com/users")
    .then((data) =>
      createTable({
        tableCaption: "Table #1 (Users data)",
        id: "table1",
        thNames: ["check", "name", "phone", "website"],
        fetchedData: data,
        hasInput: true,
      })
    )
    .then(() =>
      createBtn("https://jsonplaceholder.typicode.com/users", "table1")
    )
    .catch((err) => {
      throw new Error(err.message);
    });

  getData("https://jsonplaceholder.typicode.com/posts?_limit=10")
    .then((data) =>
      createTable({
        tableCaption: "Table #2 (Posts data)",
        id: "table2",
        thNames: ["id", "title", "body", "unique", "more than 1"],
        fetchedData: data,
      })
    )
    .catch((err) => {
      throw new Error(err.message);
    });

  const unique = (str, isUnique) => {
    const arr = str.split("").filter((item) => item !== " " && item !== "\n");
    const objUniq = {};
    for (let i = 0; i < arr.length; i++) {
      if (objUniq[arr[i]]) {
        objUniq[arr[i]] += 1;
      } else {
        objUniq[arr[i]] = 1;
      }
    }
    const uniqArr = Object.values(objUniq);
    const uniqueLetters = uniqArr.filter((item) => item < 2).length;
    const moreThanOnce = uniqArr.filter((item) => item > 1).length;

    if (isUnique) {
      return uniqueLetters;
    }
    return moreThanOnce;
  };

  const createUniqTd = (dto) => {
    const { name, body, cb, item } = dto;
    switch (name) {
      case "unique":
        return cb(body, true);
      case "more than 1":
        return cb(body, false);
      default:
        return item[name];
    }
  };
});
