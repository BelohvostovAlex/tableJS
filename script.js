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

  class Table {
    constructor(tableArgs) {
      const { tableCaption, id, thNames, fetchedData } = tableArgs;
      this.tableCaption = tableCaption;
      this.id = id;
      this.thNames = thNames;
      this.fetchedData = fetchedData;
    }

    createEl = (config) => {
      const { el, id, text, styles } = config;
      const tag = document.createElement(el);
      tag.textContent = text;
      tag.style.cssText = styles;
      tag.setAttribute("id", id);
      return tag;
    };

    createTable = () => {
      const table = this.createEl({
        el: "table",
        id: this.id,
        styles: `
          width: 1200px;
          background: gray;
          padding: 20px;
          margin: 0 auto;
          text-align: center;
          border: 2px solid black;
          `,
      });
      const caption = this.createEl({
        el: "caption",
        text: this.tableCaption,
        styles: `
          color: gray;
          font-size: 30px;
          padding: 10px 0px;
          `,
      });

      const thead = this.createEl({ el: "thead" });
      const trHead = this.createEl({ el: "tr" });
      const tbody = this.createEl({ el: "tbody" });

      table.append(caption);
      table.append(thead);
      table.append(tbody);
      thead.append(trHead);

      this.thNames.forEach((title) => {
        const th = this.createEl({
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

      this.fetchedData.forEach((item) => {
        const tr = this.createEl({ el: "tr" });
        this.thNames.forEach((thName) => {
          const td = this.createEl({
            el: "td",
            text: item[thName],
            styles: `
              padding: 10px;
              `,
          });
          tr.append(td);
        });
        tbody.append(tr);
      });
      return document.body.append(table);
    };
  }

  class TableWithDeleting extends Table {
    constructor(tableArgs) {
      super(tableArgs);
    }
    createCheckbox = (config) => {
      const { el, type, attribute, attributeVal } = config;
      const input = this.createEl({ el });
      input.type = type;
      input.setAttribute(attribute, attributeVal);
      return input;
    };

    createBtn = (url) => {
      const button = this.createEl({
        el: "button",
        text: "delete",
        styles: `width: 60px; height: 30px; margin: 20px auto; display: block; background: gray; border: none; color: white;`,
      });
      const table = document.getElementById(this.id);
      table.after(button);

      button.addEventListener("click", () => this.deleteRow(url, this.id));
    };

    deleteItem = async (config) => {
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

    deleteRow = (url) => {
      const currTable = document.getElementById(this.id);
      const allCheckboxes = currTable.querySelectorAll("input");
      allCheckboxes.forEach((el) => {
        if (el.checked) {
          const id = el.getAttribute("id");
          this.deleteItem({ url, id });
          el.closest("tr").remove();
        }
      });
    };

    createTableWithDel = () => {
      const table = this.createEl({
        el: "table",
        id: this.id,
        styles: `
          width: 1200px;
          background: gray;
          padding: 20px;
          margin: 0 auto;
          text-align: center;
          border: 2px solid black;
          `,
      });
      const caption = this.createEl({
        el: "caption",
        text: this.tableCaption,
        styles: `
          color: gray;
          font-size: 30px;
          padding: 10px 0px;
          `,
      });

      const thead = this.createEl({ el: "thead" });
      const trHead = this.createEl({ el: "tr" });
      const tbody = this.createEl({ el: "tbody" });

      table.append(caption);
      table.append(thead);
      table.append(tbody);
      thead.append(trHead);

      this.thNames.forEach((title) => {
        const th = this.createEl({
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

      this.fetchedData.forEach((item) => {
        const tr = this.createEl({ el: "tr" });
        const td = this.createEl({ el: "td", styles: `padding: 10px;` });
        const input = this.createCheckbox({
          el: "input",
          type: "checkbox",
          attribute: "id",
          attributeVal: item.id,
        });
        td.append(input);
        tr.append(td);
        this.thNames.slice(1).forEach((thName) => {
          const td = this.createEl({
            el: "td",
            text: item[thName],
            styles: `
                  padding: 10px;
                  `,
          });
          tr.append(td);
        });
        tbody.append(tr);
      });
      return document.body.append(table);
    };
  }

  getData("https://jsonplaceholder.typicode.com/users").then((data) => {
    const table = new TableWithDeleting({
      tableCaption: "Table #1 (Users data)",
      id: "table1",
      thNames: ["check", "name", "phone", "website"],
      fetchedData: data,
    });
    table.createTableWithDel();
    table.createBtn("https://jsonplaceholder.typicode.com/users");
    return table;
  });

  class TableWithUnique extends Table {
    constructor(tableArgs) {
      super(tableArgs);
    }

    createTableWithUniq() {
      const table = this.createEl({
        el: "table",
        id: this.id,
        styles: `
              width: 1200px;
              background: gray;
              padding: 20px;
              margin: 0 auto;
              text-align: center;
              border: 2px solid black;
              `,
      });

      const caption = this.createEl({
        el: "caption",
        text: this.tableCaption,
        styles: `
              color: gray;
              font-size: 30px;
              padding: 10px 0px;
              `,
      });
      const thead = this.createEl({ el: "thead" });
      const trHead = this.createEl({ el: "tr" });
      const tbody = this.createEl({ el: "tbody" });

      table.append(caption);
      table.append(thead);
      table.append(tbody);
      thead.append(trHead);

      this.thNames.forEach((title) => {
        const th = this.createEl({
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

      this.fetchedData.forEach((item) => {
        const tr = this.createEl({ el: "tr" });
        this.thNames.forEach((thName) => {
          const tdDto = {
            name: thName,
            body: item.body,
            cb: this.unique,
            item,
          };

          const td = this.createEl({
            el: "td",
            text: this.createUniqTd(tdDto),
            styles: `
                  padding: 10px;
                  `,
          });
          tr.append(td);
        });
        tbody.append(tr);
      });
      document.body.prepend(table);
    }

    unique = (str, isUnique) => {
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

    createUniqTd = (dto) => {
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
  }

  getData("https://jsonplaceholder.typicode.com/posts?_limit=10").then(
    (data) => {
      const table = new TableWithUnique({
        tableCaption: "Table #2 (Posts data)",
        id: "table2",
        thNames: ["id", "title", "body", "unique", "more than 1"],
        fetchedData: data,
      });
      table.createTableWithUniq();
      return table;
    }
  );
});
