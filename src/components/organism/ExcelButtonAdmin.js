import React, { useState } from "react";
import axios from "axios";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { useQuery } from "react-query";

import { API } from "../../utils/api";
import BasicButton from "../atom/BasicButton";

const ExcelButtonAdmin = ({
  sheetColumn = [],
  sheetName = "admin",
  getUrl,
  formData,
  dataType,
  customFormatter,
  leftMargined,
}) => {
  const [clicked, setClicked] = useState(false);

  useQuery(
    ["adminExcelDataQuery", getUrl, formData, clicked],
    async () => {
      if (!clicked || sheetColumn.length === 0 || !getUrl || !formData) return;
      return await API.get(getUrl, { params: formData }).then(
        (res) => res.data
      );
    },
    {
      onSuccess: async (data) => {
        if (!data) return;
        const target = data.list ? data.list : data;
        console.log(target);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);
        worksheet.columns = sheetColumn;
        const keyValue = sheetColumn.map((column) => column.key);
        for (let row of target) {
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
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.log(error.response);
        } else {
          console.log(error);
        }
      },
      onSettled: () => {
        setClicked(false);
      },
    }
  );

  return (
    <BasicButton
      onClick={() => setClicked(true)}
      marginleft={leftMargined ? "1rem" : 0}
      marginright={leftMargined ? 0 : "1rem"}
    >
      Excel 다운로드
    </BasicButton>
  );
};

export default ExcelButtonAdmin;
