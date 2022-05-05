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

  const createEl = (config) => {
    const { el, text, styles } = config;
    const tag = document.createElement(el);
    tag.textContent = text;
    tag.style.cssText = styles;
    return tag;
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
      thNames.forEach((thName) => {
        const td = createEl({
          el: "td",
          text: createUniqTd(thName, item.body, unique, item),
          styles: `
          padding: 10px;
          `,
        });
        tr.append(td);
      });
      tbody.append(tr);
    }
    document.body.append(table);
  };

  getData("https://jsonplaceholder.typicode.com/users")
    .then((data) =>
      createTable(
        "Table #1 (Users data)",
        ["id", "name", "phone", "website"],
        data
      )
    )
    .catch((err) => {
      throw new Error(err.message);
    });

  getData("https://jsonplaceholder.typicode.com/posts?_limit=10")
    .then((data) =>
      createTable(
        "Table #2 (Posts data)",
        ["id", "title", "body", "unique", "more than 1"],
        data
      )
    )
    .catch((err) => {
      throw new Error(err.message);
    });

  const unique = (str, isUnique) => {
    const arr = str.split("");
    const objUniq = {};
    for (let i = 0; i < arr.length; i++) {
      if (objUniq[arr[i]]) {
        objUniq[arr[i]] += 1;
      } else {
        objUniq[arr[i]] = 1;
      }
    }
    const uniqueLetters = Object.values(objUniq).filter(
      (item) => item < 2
    ).length;
    const moreThanOnce = arr.length - uniqueLetters;
    if (isUnique) {
      return uniqueLetters;
    } else {
      return moreThanOnce;
    }
  };

  const createUniqTd = (name, body, clbck, item) => {
    if (name === "unique") {
      return clbck(body, true);
    } else if (name === "more than 1") {
      return clbck(body, false);
    } else {
      return item[name];
    }
  };
});
