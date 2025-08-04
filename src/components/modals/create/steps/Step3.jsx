import React from 'react';
import { useSelector } from 'react-redux';
import { useShowcaseSteps } from '../hooks/useShowcaseSteps';
import ImageContent from '../components/step3/ImageContent';

const Step3 = ({
  id,
  showcaseData,
  forEdit = false,
  mobile = false,
  storyConfig = {
    index: undefined,
    banner: undefined,
    setBanner: () => {},
  },
}) => {
  const { token } = useSelector(state => state.user);
  const {
    data,
    setData,
    selectedProductImage,
    setSelectedProductImage,
    avatar,
    setAvatar,
    contents,
    setContents,
    handleImageUpload,
    saveContentData,
    resetForm,
  } = useShowcaseSteps(token);

  const handleContentSave = async () => {
    const success = await handleImageUpload(id, forEdit);
    if (success) {
      resetForm();
    }
  };

  const handleContentUpdate = (contentData, index) => {
    saveContentData(contentData, index, mobile, showcaseData?.showCaseLimit);
  };

  const handleRemoveContent = async (contentId, index) => {
    if (forEdit && contentId) {
      try {
        await axiosInstance.delete(
          `${baseUrl}/${DELETE_SHOWCASE_IMAGE}/${contentId}`,
          configReq(token)
        );
      } catch (error) {
        toast.error('Error removing content');
        return;
      }
    }

    setContents(prev => {
      const updated = [...prev];
      updated[index] = undefined;
      return updated;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <ImageContent
        data={data}
        setData={setData}
        selectedImage={selectedProductImage}
        setSelectedImage={setSelectedProductImage}
        avatar={avatar}
        setAvatar={setAvatar}
        onSave={handleContentSave}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(showcaseData?.showCaseLimit)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="relative border rounded p-4"
            >
              {contents[index] ? (
                <>
                  <img
                    src={contents[index].imageUrl}
                    alt={contents[index].title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveContent(contents[index].id, index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  Empty Slot
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default React.memo(Step3);
