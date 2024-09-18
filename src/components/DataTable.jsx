import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import { FilterMatchMode } from "primereact/api";
import { useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { useAuthenticationMutation } from "../redux/features/api/apiSlice";
import { requestHasFailed } from "../functions/api/functions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";

export default function Datatable({
  columns,
  data,
  export_columns,
  table_filters,
  export_title,
  data_label,
}) {
  const isOnPortrait = useMediaQuery("only screen and (max-width : 550px)");

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [authenticate, { isLoading, error: auth_error }] =
    useAuthenticationMutation();

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  //const dt = useRef(null)

  const exportColumns = export_columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  async function handleAuthentication() {
    let response = await authenticate(authData);
    if (!isLoading) {
      if (!requestHasFailed(response, auth_error, navigate, dispatch)) {
        if (!response.data.auth) {
          toast.error("Le mot de passe est incorrect ! Veuillez rééssayer", {
            duration: 5000,
          });
          return response.data.auth;
        }
        return response.data.auth;
      }
    }
  }

  const exportPdf = () => {
    handleAuthentication().then((auth) => {
      auth &&
        import("jspdf").then((jsPDF) => {
          import("jspdf-autotable").then(() => {
            const doc = new jsPDF.default({
              orientation: "landscape", // Définir l'orientation comme paysage
            });
            const societyColumnIndex = exportColumns.findIndex(
              (column) => column.dataKey === "society"
            );

            const emailColumnIndex = exportColumns.findIndex(
              (column) => column.dataKey === "email"
            );

            const locationColumnIndex = exportColumns.findIndex(
              (column) => column.dataKey === "location_str"
            );

            const options = {
              styles: {
                fontSize: 10, // Ajustez la taille de la police
              },
              columnStyles: {
                [societyColumnIndex]: { columnWidth: 20 },
                [emailColumnIndex]: { columnWidth: 20 },
                [locationColumnIndex]: { columnWidth: 20 }, // Ajustez la largeur de toutes les colonnes
              },
            };

            doc.autoTable(exportColumns, data, options);
            export_title
              ? doc.save(`${export_title}.pdf`)
              : doc.save("list.pdf");
          });
        });
      setExportType(0);
    });
  };

  const exportExcel = () => {
    handleAuthentication().then((auth) => {
      auth &&
        import("xlsx").then((xlsx) => {
          // Filtrer les données pour inclure uniquement les colonnes spécifiées
          const filteredData = data.map((item) => {
            const filteredItem = {};
            export_columns.forEach((column) => {
              filteredItem[column.field] = item[column.field];
            });
            return filteredItem;
          });

          // Convertir les données filtrées en feuille de calcul
          const worksheet = xlsx.utils.json_to_sheet(filteredData);

          // Créer le workbook et le buffer
          const workbook = {
            Sheets: { data: worksheet },
            SheetNames: ["data"],
          };
          const excelBuffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });

          // Enregistrer le fichier Excel
          export_title
            ? saveAsExcelFile(excelBuffer, `${export_title}`)
            : saveAsExcelFile(excelBuffer, "list");
        });
      setExportType(0);
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const renderHeader = () => {
    if (!isOnPortrait) {
      return (
        <div className="flex flex-col w-fit">
          <div className="flex justify-content-center justify-end items-center">
            {currentUser?.type === "ADM" && (
              <div className="flex items-center mr-auto">
                <Button
                  type="button"
                  icon={
                    <i
                      className="pi pi-file-excel"
                      style={{ fontSize: "2rem", color: "green" }}
                    ></i>
                  }
                  severity="success"
                  onClick={() => {
                    setVisible(true);
                    setExportType(1);
                  }}
                  data-pr-tooltip="XLS"
                  className="bg-green-200 p-2 rounded-md"
                >
                  {"Exporter en Excel"}
                </Button>
                <Button
                  type="button"
                  icon={
                    <i
                      className="pi pi-file-pdf"
                      style={{ fontSize: "2rem", color: "red" }}
                    ></i>
                  }
                  severity="warning"
                  onClick={() => {
                    setVisible(true);
                    setExportType(2);
                  }}
                  data-pr-tooltip="PDF"
                  className="ml-10 bg-red-200 p-2 rounded-md"
                >
                  {"Exporter en PDF"}
                </Button>
                <Dialog
                  visible={visible}
                  modal
                  onHide={() => setVisible(false)}
                  content={({ hide }) => (
                    <div
                      className="flex flex-col px-8 py-5 gap-4 items-center"
                      style={{
                        borderRadius: "12px",
                        backgroundImage:
                          "radial-gradient(circle at left top, var(--primary-400), var(--primary-700))",
                      }}
                    >
                      <span className="text-white font-bold text-2xl">
                        Veuillez vous authentifier pour réaliser cette action
                      </span>
                      <div className="inline-flex flex-col gap-2">
                        <InputText
                          placeholder="Mot de passe"
                          id="password"
                          label="Password"
                          className="bg-white-alpha-20 border-none p-3 text-primary-50"
                          type="password"
                          onChange={(e) => {
                            setAuthData({
                              ...authData,
                              password: e.target.value,
                            });
                          }}
                        ></InputText>
                      </div>
                      <div className="flex items-center gap-2 w-1/2 justify-end ml-auto">
                        <Button
                          label="S'authentifier"
                          onClick={(e) => {
                            hide(e);
                            export_type === 1
                              ? exportExcel()
                              : export_type === 2
                              ? exportPdf()
                              : setExportType(0);
                          }}
                          text
                          className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10 custom-link text-white"
                        ></Button>
                        <Button
                          label="Annuler"
                          onClick={(e) => hide(e)}
                          text
                          className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                        ></Button>
                      </div>
                    </div>
                  )}
                ></Dialog>
              </div>
            )}
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
    } else {
      return (
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            {currentUser.type === "ADM" && (
              <div className="flex items-start justify-start justify-items-start mr-auto">
                <Button
                  type="button"
                  icon={
                    <i
                      className="pi pi-file-excel"
                      style={{ fontSize: "1.5rem", color: "green" }}
                    ></i>
                  }
                  severity="success"
                  onClick={() => {
                    setVisible(true);
                    setExportType(1);
                  }}
                  data-pr-tooltip="XLS"
                  className="bg-green-200 p-2 rounded-md"
                />
                <Button
                  type="button"
                  icon={
                    <i
                      className="pi pi-file-pdf"
                      style={{ fontSize: "1.5rem", color: "red" }}
                    ></i>
                  }
                  severity="warning"
                  onClick={() => {
                    setVisible(true);
                    setExportType(2);
                  }}
                  data-pr-tooltip="PDF"
                  className="bg-red-200 p-2 rounded-md"
                />

                <Dialog
                  visible={visible}
                  modal
                  onHide={() => setVisible(false)}
                  content={({ hide }) => (
                    <div
                      className="flex flex-col px-8 py-5 gap-4 items-center"
                      style={{
                        borderRadius: "12px",
                        backgroundImage:
                          "radial-gradient(circle at left top, var(--primary-400), var(--primary-700))",
                      }}
                    >
                      <span className="text-white font-bold text-2xl">
                        Veuillez vous authentifier pour réaliser cette action
                      </span>
                      <div className="inline-flex flex-col gap-2">
                        <InputText
                          placeholder="Mot de passe"
                          id="password"
                          label="Password"
                          className="bg-white-alpha-20 border-none p-3 text-primary-50"
                          type="password"
                          onChange={(e) => {
                            setAuthData({
                              ...authData,
                              password: e.target.value,
                            });
                          }}
                        ></InputText>
                      </div>
                      <div className="flex items-center gap-2 w-full justify-end ml-auto">
                        <Button
                          label="S'authentifier"
                          onClick={(e) => {
                            hide(e);
                            export_type === 1
                              ? exportExcel()
                              : export_type === 2
                              ? exportPdf()
                              : setExportType(0);
                          }}
                          text
                          className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10 custom-link text-white"
                        ></Button>
                        <Button
                          label="Annuler"
                          onClick={(e) => hide(e)}
                          text
                          className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                        ></Button>
                      </div>
                    </div>
                  )}
                ></Dialog>
              </div>
            )}
            <span className="w-3/5">
              <span className="m-5">
                <i className="pi pi-search" />
              </span>
              <InputText
                className="w-2/3 px-2"
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder={"Mots-clés"}
                height={"100px"}
              />
            </span>
          </div>
        </div>
      );
    }
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
