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
        method: "DELETE",
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  const createEl = (obj) => {
    const tag = document.createElement(obj.el);
    tag.textContent = obj.text;
    tag.style.cssText = obj.styles;
    return tag;
  };


  const createTable = async (tableCaption, thNames, fetchedData) => {
      const table = createEl({
        el: "table",
        styles: `
        width: 1200px;
        background: gray;
        padding: 20px;
        margin: 0 auto;
        text-align: center;
        border: 2px solid black;
        `
      }
      );

      const caption = createEl({
        el: "caption",
        text: tableCaption,
        styles:`
        color: gray;
        font-size: 30px;
        padding: 10px 0px;
        `
      });
      const thead = createEl({el: "thead"});
      const trHead = createEl({el: "tr"});
      const tbody = createEl({el: "tbody"});

      table.append(caption);
      table.append(thead);
      table.append(tbody);
      thead.append(trHead);

      thNames.forEach((title) => {
        const th = createEl({
          el:"th",
          text: title,
          styles:`
          font-size: 18px;
          text-transform: uppercase;
          padding: 10px 0px;
          `
        });
        trHead.append(th);
      });

      const data = await fetchedData //!!!

      for (let item of data) {
        const tr = createEl({el:"tr"});
        thNames.forEach((thName) => {
          const td = createEl({el:"td", text: item[thName], styles: `
          padding: 10px;
          `});
          tr.append(td);
        });
        tbody.append(tr);
      }
      document.body.prepend(table);

    }

  const createBtn = () => {
    const button = createEl(
      "button",
      "delete",
      `width: 60px; height: 30px; margin: 20px auto; display: block; background: gray; border: none; color: white;`
    );
    document.body.append(button);

    button.addEventListener("click", () => {
      const allCheckboxes = document.querySelectorAll("input");

      allCheckboxes.forEach((el) => {
        if (el.checked) {
          let id = el.getAttribute("id");
          deleteItem("https://jsonplaceholder.typicode.com/users", id);
          el.closest("tr").remove();
        }
      });
    });
  };

  createTable(
    "Table #1 (Users data)",
    ["id", "name", "phone", "website"],
    getData("https://jsonplaceholder.typicode.com/users")
  );
  createBtn();
});
