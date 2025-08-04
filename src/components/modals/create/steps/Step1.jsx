import React, { useEffect, useState } from 'react';
import StepLayout from '../components/StepLayout';
import Borders from '../components/step1/Borders';
import Contents from '../components/step1/Contents';
import Grids from '../components/step1/Grids';
import Initial from '../components/step1/Initial';
import ProductCards from '../components/step1/ProductCards';
import Sections from '../components/step1/Sections';
import Stories from '../components/step1/Stories';
import Title from '../components/step1/Title';

const Step1 = ({ data, setData, allUrl, editMode = false }) => {
  const [trigger, setTrigger] = useState({});

  useEffect(() => {
    if (editMode) {
      setTrigger({ 1: true, 2: true, 3: true });
      return;
    }

    const newTrigger = {};
    
    if (data?.priority !== undefined) {
      newTrigger[1] = true;
    }
    if (data?.title !== undefined) {
      newTrigger[2] = true;
    }
    if (data?.filter?.id === "5" || data?.filter?.id === "8" || data?.viewType) {
      newTrigger[3] = true;
    }

    setTrigger(newTrigger);
  }, [data?.priority, data?.title, data?.viewType, data?.filter, editMode]);

  return (
    <StepLayout>
      <Initial data={data} setData={setData} allUrl={allUrl} />
      <Title data={data} setData={setData} trigger={trigger} />
      <Contents
        data={data}
        setData={setData}
        trigger={trigger}
        editMode={editMode}
      />
      <Sections data={data} setData={setData} trigger={trigger} editMode={editMode} />
      <Borders data={data} setData={setData} trigger={trigger} />
      <Grids data={data} setData={setData} />
      <Stories data={data} setData={setData} trigger={trigger} />
      <ProductCards data={data} setData={setData} />
    </StepLayout>
  );
};

export default React.memo(Step1);
