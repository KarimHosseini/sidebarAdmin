/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, TextInput } from "../../../components/common";

const MoreRealData = ({ userData, setUserData, allProvinces }) => {
  const [loadingPR, setLoadingPR] = useState({});
  const [loadingCT, setLoadingCT] = useState({});
  const [allCities, setAllCities] = useState([]);
  useEffect(() => {
    if (userData?.provinceId) {
      const sp = allProvinces.find((item) => item.id === userData?.provinceId);
      setAllCities(sp.cities);
    }
  }, [userData]);
  const { userPermissions } = useSelector((state) => state.relationals);

  return (
    <div className="flex flex-col md:grid lg:grid-cols-4 md:grid-cols-3   gap-4 relative z-10">
      {" "}
      <>
        <div>
          {allProvinces.length > 0 && (
            <Dropdown
              value={
                loadingPR.province && !loadingCT.province
                  ? ""
                  : allProvinces.find(
                      (item) => item.id === userData?.provinceId
                    ) /* ? allProvinces.find((item) => item.id === selectedProvinces) : "" */
              }
              change={(e) => {
                setUserData({ ...userData, provinceId: e?.id });
                setLoadingCT({ ...loadingCT, province: true });
              }}
              data={allProvinces || []}
              title={
                loadingPR.province && !loadingCT.province ? (
                  loadingPR.province
                ) : (
                  <>استان</>
                )
              }
            />
          )}
        </div>
        <div>
          <Dropdown
            value={
              userData?.cityId
                ? allCities?.find((item) => item.id === userData.cityId)
                : ""
            }
            change={(e) => {
              setUserData({ ...userData, cityId: e?.id });
              setLoadingCT({ ...loadingCT, city: true });
            }}
            data={allCities || []}
            title={
              loadingPR.city && !loadingCT.city ? loadingPR.city : <>شهر</>
            }
          />
        </div>
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, activityField: e })}
          label=" زمینه فعالیت "
          currentValue={userData?.activityField}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, activityDescription: e })}
          label="شرح فعالیت "
          currentValue={userData?.activityDescription}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, shopName: e })}
          label=" نام کامل فروشگاه "
          currentValue={userData?.shopName}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, managerFullName: e })}
          label=" نام مالک فروشگاه"
          currentValue={userData?.managerFullName}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, website: e })}
          label=" نشانی سایت"
          currentValue={userData?.website}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, tel: e })}
          label="شماره تلفن ثابت "
          currentValue={userData?.tel}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchName: e })}
          label="نام شعبه "
          currentValue={userData?.branchName}
        />

        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress: e })}
          label="نشانی شعبه مرکزی"
          currentValue={userData?.branchAddress}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, shopPostalCode: e })}
          label=" کد پستی فروشگاه "
          currentValue={userData?.shopPostalCode}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, squareMeters: e })}
          label="  متراژ کل فروشگاه"
          currentValue={userData?.squareMeters}
        />

        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress1: e })}
          label="نشانی شعبه 1"
          currentValue={userData?.branchAddress1}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress2: e })}
          label="نشانی شعبه 2"
          currentValue={userData?.branchAddress2}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress3: e })}
          label="نشانی شعبه 3"
          currentValue={userData?.branchAddress3}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress4: e })}
          label="نشانی شعبه 4"
          currentValue={userData?.branchAddress4}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress5: e })}
          label="نشانی شعبه 5"
          currentValue={userData?.branchAddress5}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress6: e })}
          label="نشانی شعبه 6"
          currentValue={userData?.branchAddress6}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress7: e })}
          label="نشانی شعبه 7"
          currentValue={userData?.branchAddress7}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress8: e })}
          label="نشانی شعبه 8"
          currentValue={userData?.branchAddress8}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress9: e })}
          label="نشانی شعبه 9"
          currentValue={userData?.branchAddress9}
        />
        <TextInput
          disabled={!userPermissions?.user?.update}
          change={(e) => setUserData({ ...userData, branchAddress10: e })}
          label="نشانی شعبه 10"
          currentValue={userData?.branchAddress10}
        />
      </>
    </div>
  );
};

export default MoreRealData;
