import { Alert, Box } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import SetPriceForm from "./SetPriceForm";

const SetPricesAccordion = ({
  firstVals,
  secondVals,
  addItem,
  properties,
  setProperties,
  setDisableSubmit,
  currentProperties = null,
  optionLength,
  images,
}) => {
  const [firstRow, setFirstRow] = useState([]);
  const [secondRow, setSecondRow] = useState([]);
  useEffect(() => {
    console.log(currentProperties , secondVals , firstVals , "currentProperties , secondVals , firstVals");
    if (currentProperties && secondVals?.length === 0) {
      var temp = [...firstVals];
      currentProperties.map((item) => {
        const f = temp.filter(
          (i) => i?.subAttributeId !== item?.productAttribute?.subAttribId
        );
        temp = f;
      });
      setFirstRow(temp);
      optionLength(temp.length);
    } else if (currentProperties && secondVals?.length > 0) {
      var tempLength = 0;
      var fData = [];

      firstVals.map((first) => {
        var sData = [];
        if (
          currentProperties?.find(
            (crt) =>
              crt?.productAttribute?.subAttribId === first?.subAttributeId
          )
        ) {
          secondVals?.map((second, i) => {
            if (
              !currentProperties?.find(
                (crt) =>
                  crt?.productAttribute2?.subAttribId === second?.subAttributeId
              )
            ) {
              sData.push(second);
              tempLength = tempLength + 1;
              fData.push({ first: first, second: sData });
            }
          });
        } else {
          secondVals?.map((second, i) => {
            sData.push(second);
            tempLength = tempLength + 1;
          });
          fData.push({ first: first, second: sData });
        }
      });

      setSecondRow(fData);
      optionLength(tempLength);
    } else if (!currentProperties && secondVals?.length > 0) {
      var aData = [];
      firstVals.map((first) => {
        var sData = [];
        secondVals?.map((second, i) => {
          sData.push(second);
          tempLength = tempLength + 1;
        });
        aData.push({ first: first, second: sData });
      });

      setSecondRow(aData);
    } else {
      setFirstRow(firstVals);
    }
  }, [currentProperties]);
  return (
    <Box>
      {firstRow?.length === 0 && secondRow.length === 0 ? (
        <>
          <Alert variant="outlined" severity="warning">
            ویژگی جدیدی جهت قیمت گذاری یافت نشد
          </Alert>
        </>
      ) : (
        <>
          {" "}
          {secondVals?.length === 0 ? (
            <>
              {firstRow?.map((first, i) => (
                <SetPriceForm
                  setProperties={setProperties}
                  key={i}
                  submit={addItem}
                  first={first}
                  properties={properties}
                  setDisableSubmit={setDisableSubmit}
                  images={images}
                />
              ))}
            </>
          ) : (
            <>
              {secondRow?.map((items, i) => (
                <Fragment key={`___OPTIOSN___ROW__FIRSTT__${i}`}>
                  {items?.second?.map((second, index) => (
                    <Fragment key={`___OPTIOSN___ROW__SECOND${index + i}`}>
                      <SetPriceForm
                        setProperties={setProperties}
                        key={i}
                        submit={addItem}
                        first={items.first}
                        second={second}
                        properties={properties}
                        images={images}
                        setDisableSubmit={setDisableSubmit}
                      />
                    </Fragment>
                  ))}
                </Fragment>
              ))}
              {/*   {firstVals?.map((first) => {
            if (
              currentProperties?.find(
                (crt) => crt?.arrtib1?.title === first?.subAttributeTitle
              )
            ) {
              secondVals?.map((second, i) => {
                if (
                  !currentProperties?.find(
                    (crt) => crt?.arrtib2?.title === second?.subAttributeTitle
                  )
                ) {
                  return (
                    <>
                      <h1>ss</h1>
                       <SetPriceForm
                        setProperties={setProperties}
                        key={i}
                        submit={addItem}
                        first={first}
                        second={second}
                        properties={properties}
                        setDisableSubmit={setDisableSubmit}
                      />
                    </>
                  );
                } else {
                  <>smt</>;
                }
              });
            } else {
              return secondVals?.map((second, i) => (
                <SetPriceForm
                  setProperties={setProperties}
                  key={i}
                  submit={addItem}
                  first={first}
                  second={second}
                  properties={properties}
                  setDisableSubmit={setDisableSubmit}
                />
              ));
            }
          })} */}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default SetPricesAccordion;
