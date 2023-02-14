// import $ from "jquery";
// import '../../cdn_files/css/jquery.dataTables.min.css'
// import '../../cdn_files/js/jquery.dataTables.min.js'

class TableJS extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {

    const clickable = JSON.parse(this.getAttribute("clickableAttr"))
    const tableData = JSON.parse(this.getAttribute("data"))
    let sortedTableData = tableData.sort(
      (p1, p2) => (p1['Version'] < p2['Version']) ? 1 : (p1['Version'] > p2['Version']) ? -1 : 0);
    const tableHeaders = Object.keys(tableData[0])
    console.log("+++++",tableData)
    const a = "qqqq"

    let tableHTML = null;
    for (let i = 0; i < sortedTableData.length; i++) {
      if (i == 0) {
        tableHTML = `<table id="cus_table"><thead><tr>`;
        for (let idx = 0; idx < tableHeaders.length; idx++) {
          tableHTML += `
                      <th>${tableHeaders[idx]}</th>
                      `;
        }
        tableHTML += `</tr></thead><tbody>`;
      }

      let details = "";
      for (let index = 0; index < tableHeaders.length; index++) {
        details += `${
          clickable.includes(tableHeaders[index])
            ? `<td><a href="http://localhost:3000/files/home/VaibhavS/snap_GetSccSzCnt_directedgraph_inp.txt/" >${sortedTableData[i][tableHeaders[index]]}</a></td>`
            : `<td>${sortedTableData[i][tableHeaders[index]]}</td>`
        }`;
      }
      tableHTML += `
                  <tr>
                    ${details}
                  </tr>
              `;

      if (i == sortedTableData.length - 1) {
        tableHTML += `</tbody></table> `;
      }
    }


    this.shadowRoot.innerHTML = /* html */ `
          <!-- <link rel="stylesheet" href="cdn.datatables.net/1.13.1/css/jquery.dataTables.min.css" />
          <script src="cdn.datatables.net/1.13.1/js/jquery.dataTables.min.js"></script> -->
          <style>
          table {
            font-family: Muli, Roboto, Helvetica Neue, Arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
          th {
            background-color: #dddddd;
            border: 1px solid #00000033;

          }
          td {
            border: 1px solid #dddddd;
          }
          
          td, th {
            text-align: left;
            padding: 8px;
          }
          tr:nth-child(even) {
            <!-- background-color: #dddddd; -->
          }
          .clickable{

          }
          </style>
          ${tableHTML}
          `;
  }
}
customElements.define("app-table", TableJS);
