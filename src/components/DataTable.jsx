import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import { FilterMatchMode } from "primereact/api";
import { useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { requestHasFailed } from "../functions/api/functions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";

export default function Datatable({
  columns,
  data,
  table_filters,
  data_label,
}) {
  const { user: currentUser } = useSelector((state) => state.user);
  const global_filter = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  const [filters, setFilters] = useState(global_filter);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [visible, setVisible] = useState(false);
  // const { t } = useTranslation()
  const [export_type, setExportType] = useState(0);

  const [authData, setAuthData] = useState({ password: "", type: "ADM" });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  //const dt = useRef(null)

  /* const exportColumns = export_columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  })); */

  const renderHeader = () => {
    return (
      <div className="flex flex-col w-fit justify-end">
        <div className="flex justify-content-center justify-end items-center">
          <span className="p-input-icon-left">
            <span className="m-5">
              <i className="pi pi-search" />
            </span>
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder={"Mots-clés"}
              height={"100px"}
            />
          </span>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        dataKey="key"
        value={data}
        tableStyle={{ minWidth: "65rem" }}
        paginator
        /* currentPageReportTemplate={t('current_page_report', {
          first: '{first}',
          last: '{last}',
          totalRecords: '{totalRecords}',
        })} */
        paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
        removableSort
        rows={10}
        scrollable
        showGridlines
        stripedRows
        filters={filters}
        size={"small"}
        // scrollHeight="600px"
        rowsPerPageOptions={[5, 10, 25, 50]}
        globalFilterFields={table_filters}
        header={header}
        rowHover={"hover:bg-gray-300"}
        emptyMessage={`Aucun(e) ${
          data_label ? data_label : "donnée"
        } trouvé(e)  !`}
        filterDisplay="row"
      >
        {columns}
      </DataTable>
    </div>
  );
}
