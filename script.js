document.addEventListener("DOMContentLoaded", () => {
  const getData = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    return users;
  };

  const createTable = async (
    thNames = ["check", "id", "name", "phone", "website"]
  ) => {
    const table = document.createElement("table");
    table.style.cssText = `
        width: 1200px;
        background: gray;
        padding: 20px;
        margin: 0 auto;
        text-align: center;
        border: 2px solid black;
    `;
    const caption = document.createElement("caption");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const tbody = document.createElement("tbody");

    caption.textContent = "Table #1 (Users data)";
    caption.style.cssText = `
            color: gray;
            font-size: 30px;
            padding: 10px 0px
        `;

    table.append(caption);
    table.append(thead);
    table.append(tbody);
    thead.append(trHead);

    for (let i = 0; i < thNames.length; i++) {
      const th = document.createElement("th");
      th.style.cssText = `
                font-size: 18px;
                text-transform: uppercase;
                padding: 10px 0px;
            `;
      th.textContent = thNames[i];
      trHead.append(th);
    }

    let users = await getData();

    for (let user of users) {
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      let td2 = document.createElement("td");
      let td3 = document.createElement("td");
      let td4 = document.createElement("td");
      let td5 = document.createElement("td");
      td1.innerHTML = '<input type="checkbox"/>';
      td2.textContent = user.id;
      td3.textContent = user.name;
      td4.textContent = user.phone;
      td5.textContent = user.email;
      tr.append(td1);
      tr.append(td2);
      tr.append(td3);
      tr.append(td4);
      tr.append(td5);
      tbody.append(tr);
    }
    document.body.append(table);

    let allTd = document.querySelectorAll("td");
    for (let i = 0; i < allTd.length; i++) {
      allTd[i].style.cssText = `
        padding: 10px`;
    }
  };

  const createBtn = () => {
    const button = document.createElement("button");
    button.innerText = "delete";
    document.body.append(button);

    button.addEventListener("click", () => {
      const allCheckboxes = document.querySelectorAll("input");
      allCheckboxes.forEach((el) => {
        if (el.checked) {
          el.closest("tr").remove();
        } else {
          console.log("cant be deleted");
        }
      });
    });
  };
  createTable();
  createBtn();
});
