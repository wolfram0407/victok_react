import React, { useState } from "react";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { useQuery } from "react-query";

import BasicButton from "../atom/BasicButton";
import { API } from "../../utils/api";

const ExcelButton = ({
  sheetColumn = [],
  sheetName = "user",
  getUrl,
  formData,
  dataType,
  customFormatter,
  customOnClick,
  dataFormatter,
}) => {
  const [clicked, setClicked] = useState(false);

  useQuery(
    ["userExcelDataQuery", getUrl, formData, clicked],
    async () => {
      if (!clicked || sheetColumn.length === 0 || !getUrl || !formData) return;
      return await API.get(getUrl, { params: formData }).then(
        (res) => res.data
      );
    },
    {
      onSuccess: async (data) => {
        if (!data) return;
        const result = dataFormatter ? dataFormatter(data) : data;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);
        worksheet.columns = sheetColumn;
        const keyValue = sheetColumn.map((column) => column.key);
        for (let row of result) {
          let tempObj = {};
          keyValue.forEach(
            (key) =>
              (tempObj[key] = customFormatter
                ? customFormatter(row, key)
                : row[key])
          );
          worksheet.addRow(tempObj);
        }
        const mimeType = {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);
        saveAs(blob, `victok_${dataType}_${dayjs().format("YYYY.MM.DD")}.xlsx`);
      },
      onSettled: () => {
        setClicked(false);
      },
    }
  );

  return (
    <BasicButton
      onClick={() =>
        customOnClick
          ? customOnClick({ trigger: setClicked })
          : setClicked(true)
      }
      style={{ marginLeft: "10px" }}
    >
      Excel 다운로드
    </BasicButton>
  );
};

export default ExcelButton;
