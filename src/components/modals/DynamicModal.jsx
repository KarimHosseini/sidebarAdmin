import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "../common";
import FormGenerator from "../common/FormGenerator";
import axiosInstance from "../dataFetch/axiosInstance";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const DynamicModal = ({
  open,
  close,
  title,
  fields = [],
  data = {},
  forEdit = false,
  setAllRows,
  allRows,
  apis = {},
  onAfterSubmit,
  onAfterDelete,
  extraActions = [],
  customComponents = {},
  submitLabel,
  showDeleteButton = true,
  permissionsTag,
  redirectModal: RedirectModal,
  redirectModalProps = {},
  onFormChange,
  validateBeforeSubmit
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  
  const [loading, setLoading] = useState(false);
  const [openRedirect, setOpenRedirect] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({});
  const [redirectData, setRedirectData] = useState({});

  const {
    CREATE_API,
    EDIT_API,
    DELETE_API,
    REDIRECT_API
  } = apis;

  // Check permissions
  const canDelete = userPermissions?.[permissionsTag]?.delete;
  const canEdit = userPermissions?.[permissionsTag]?.update;
  const canCreate = userPermissions?.[permissionsTag]?.insert;

  // Reset form data when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData(forEdit ? data : {});
      setRedirectData(forEdit ? { slug: data.slug } : {});
    } else {
      setFormData({});
      setRedirectData({});
    }
  }, [open, forEdit, data]);

  // Handle form submission
  const handleSubmit = async (submissionData) => {
    try {
      // Custom validation if provided
      if (validateBeforeSubmit) {
        const validationResult = await validateBeforeSubmit(submissionData, forEdit);
        if (validationResult !== true) {
          toast.error(validationResult);
          return;
        }
      }

      setLoading(true);
      let response;
      
      if (forEdit) {
        if (!canEdit) {
          toast.error("شما مجوز ویرایش ندارید");
          return;
        }
        
        // Add ID for edit
        const editData = { ...submissionData, id: data.id };
        response = await axiosInstance.put(EDIT_API, editData, configReq(token));
        
        // Handle redirect if slug changed
        if (REDIRECT_API && data.slug && redirectData.slug && data.slug !== redirectData.slug) {
          await axiosInstance.post(REDIRECT_API, {
            Title: data.title,
            EntityId: data.id,
            EntityName: permissionsTag,
            FromUrl: data.slug.replace(/\//g, ""),
            ToUrl: redirectData.slug.replace(/\//g, ""),
            RedirectType: redirectData.redirectType,
            IsActive: true,
            LastSlug: data.slug.replace(/\//g, ""),
          }, configReq(token));
        }
        
        // Update the row in the table
        const updatedRows = [...allRows];
        const index = updatedRows.findIndex(item => item.id === data.id);
        if (index !== -1) {
          updatedRows[index] = response.data.data;
          setAllRows(updatedRows);
        }
        
        toast.success("با موفقیت ویرایش شد");
      } else {
        if (!canCreate) {
          toast.error("شما مجوز ایجاد ندارید");
          return;
        }
        
        response = await axiosInstance.post(CREATE_API, submissionData, configReq(token));
        
        // Add new row to the beginning of the table
        const updatedRows = [response.data.data, ...allRows];
        setAllRows(updatedRows);
        
        toast.success("با موفقیت اضافه شد");
      }
      
      // Call custom after submit handler
      if (onAfterSubmit) {
        onAfterSubmit(response.data.data, forEdit);
      }
      
      close();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.response?.data?.message || "خطایی رخ داد");
      
      if (error.response?.status === 401) {
        dispatch(logout());
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      if (!canDelete) {
        toast.error("شما مجوز حذف ندارید");
        return;
      }

      setLoading(true);
      
      // Handle redirect before delete if needed
      if (REDIRECT_API && redirectData.slug) {
        await axiosInstance.post(REDIRECT_API, {
          Title: data.title,
          EntityId: data.id,
          EntityName: permissionsTag,
          FromUrl: data.slug.replace(/\//g, ""),
          ToUrl: redirectData.slug.replace(/\//g, ""),
          RedirectType: redirectData.redirectType,
          IsActive: true,
          LastSlug: data.slug.replace(/\//g, ""),
        }, configReq(token));
      }
      
      await axiosInstance.delete(`${DELETE_API}?id=${data.id}`, configReq(token));
      
      // Remove the row from the table
      const updatedRows = allRows.filter(item => item.id !== data.id);
      setAllRows(updatedRows);
      
      // Call custom after delete handler
      if (onAfterDelete) {
        onAfterDelete(data);
      }
      
      toast.success("با موفقیت حذف شد");
      close();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || "خطایی در حذف رخ داد");
      
      if (error.response?.status === 401) {
        dispatch(logout());
      }
    } finally {
      setLoading(false);
      setOpenDeleteConfirm(false);
    }
  };

  // Handle redirect modal
  const handleRedirectModal = () => {
    if (forEdit) {
      setOpenRedirect(true);
    }
  };

  // Custom form change handler
  const handleFormChange = (fieldName, value) => {
    if (fieldName === 'slug' || fieldName === 'title') {
      setRedirectData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
    
    if (onFormChange) {
      onFormChange(fieldName, value);
    }
  };

  // Prepare fields with redirect handling for slug fields
  const preparedFields = fields.map(field => {
    if (field.name === 'slug' && forEdit) {
      return {
        ...field,
        props: {
          ...field.props,
          onClick: handleRedirectModal,
          readOnly: true
        }
      };
    }
    return field;
  });

  // Prepare extra actions
  const preparedExtraActions = [
    ...extraActions,
    ...(RedirectModal ? [{
      component: (
        <RedirectModal
          open={openRedirect || openDeleteConfirm}
          deleteMode={openDeleteConfirm}
          close={() => {
            setOpenRedirect(false);
            setOpenDeleteConfirm(false);
          }}
          prevData={redirectData}
          setPrevData={setRedirectData}
          handleDelete={handleDelete}
          {...redirectModalProps}
        />
      )
    }] : [])
  ];

  return (
    <Modal
      open={open}
      close={close}
      title={`${forEdit ? "ویرایش" : "افزودن"} ${title}`}
      autoWidth
    >
      <FormGenerator
        fields={preparedFields}
        initialData={forEdit ? data : {}}
        onSubmit={handleSubmit}
        onDelete={canDelete && showDeleteButton ? () => setOpenDeleteConfirm(true) : undefined}
        loading={loading}
        forEdit={forEdit}
        submitLabel={submitLabel}
        showDeleteButton={canDelete && showDeleteButton && forEdit}
        extraActions={preparedExtraActions.map(action => action.component || action)}
        customComponents={customComponents}
        onFormChange={handleFormChange}
      />
    </Modal>
  );
};

export default DynamicModal; 