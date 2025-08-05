import React, { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ShowTable from ".";
import {
  EXPORT_ReportOverdueInstallmentsBasedOnFinancier,
  GET_ReportOverdueInstallmentsBasedOnFinancier,
} from "../../helpers/api-routes";

const ReportOverdueInstallmentsBasedOnFinancierExport = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const URL = useMemo(() => {
    if (searchParams.get("year")) {
      return `${GET_ReportOverdueInstallmentsBasedOnFinancier}?year=${searchParams.get(
        "year"
      )}&mount=${searchParams.get("month")}&financierId=${id}`;
    }
  }, [searchParams]);
  const URL_EXPORT = useMemo(() => {
    if (searchParams.get("year")) {
      return `${EXPORT_ReportOverdueInstallmentsBasedOnFinancier}?year=${searchParams.get(
        "year"
      )}&mount=${searchParams.get("month")}&financierId=${id}`;
    }
  }, [searchParams]);

  return (
    <>
      {searchParams.get("year") && URL && URL_EXPORT && (
        <ShowTable URL={URL} URL_EXPORT={URL_EXPORT} />
      )}
    </>
  );
};

export default ReportOverdueInstallmentsBasedOnFinancierExport;
