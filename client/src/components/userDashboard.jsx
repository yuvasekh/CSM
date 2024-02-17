import { Modal, Tooltip, Upload } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import React, { useState } from 'react'
import {
   
    AiOutlineUpload,
   
  } from "react-icons/ai";
  import {
    CheckCircleFilled,
 
    CloseCircleOutlined,
  
    LoadingOutlined,
   
  } from "@ant-design/icons";
  
  
function UserDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isUploaded, setIsUploaded] = useState({});
    const [endReached, setEndReached] = useState(false);
    const handleOk = () => {
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };
      const { Dragger } = Upload;
  const propsData = {
    name: "file",
    multiple: true,
    accept:
      "application/pdf,.html,.png,.pptx,.docx,.jpg,.jpeg,.md,.wav,.mp4,.txt,.md",
  };
  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 2000);
  };
  const fileChange = (info) => {
    let doneFiles = {};
    info.fileList.map((file) => {
      if (file.status == "done") {
        doneFiles[file.uid] = { file };
      }
    });

    const fileUploadAsync = async () => {
      let failed = false;

      try {
        for (let i = 0; i < info.fileList.length; i++) {
          try {
            await fileUpload(info.fileList[i].originFileObj, projectId);

            setIsUploaded((prev) => {
              return { ...prev, [info.fileList[i].uid]: "success" };
            });
          } catch (error) {
            console.log(`Caught by .catch ${error}`);
            failed = true;
            // message.error(`Failed to upload.`);
            setIsUploaded((prev) => {
              return { ...prev, [info.fileList[i].uid]: "failed" };
            });
          }
        }
        !failed && message.success(`File uploaded successfully.`);
        setTimeout(() => {
          handleCancel();
        }, 1000);

        setEndReached(false);
        setFiles([]);
        getFiles(0);
      } catch (error) {
        console.log(`Caught by .catch ${error}`);
        setTimeout(() => {
          handleCancel();
        }, 1000);

        getFiles(0);
      }
    };
    if (Object.keys(doneFiles).length === info.fileList.length) {
      fileUploadAsync();
    }
  };

    
  return (
    <div>
      <Modal
        title={<div className="text-center">Upload Knowledge</div>}
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <div className="p-4">
          <Dragger
            {...propsData}
            onChange={(info) => fileChange(info)}
            customRequest={dummyRequest}
            itemRender={(origin, locFile) => {
              return (
                <div>
                  {isUploaded[locFile.uid] == "success" ? (
                    <div className=" gap-2">
                      {" "}
                      <Tooltip title={"Uploaded successfully"}>
                        <CheckCircleFilled className="text-green-400 mr-3" />
                      </Tooltip>
                      {locFile.name}
                    </div>
                  ) : isUploaded[locFile.uid] == "failed" ? (
                    <div className=" gap-2">
                      {" "}
                      <Tooltip title={"Failed to upload"}>
                        <CloseCircleOutlined className="text-red-400 mr-3" />
                      </Tooltip>
                      {locFile.name}
                    </div>
                  ) : (
                    <div className=" gap-2 mr-1">
                      <LoadingOutlined /> {locFile.name}
                    </div>
                  )}
                </div>
              );
            }}
          >
            <p className="flex items-center justify-center">
              <AiOutlineUpload className="text-miracle-blue text-6xl"></AiOutlineUpload>
            </p>
            <p className="ant-upload-text" style={{ fontWeight: "600" }}>
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </div>
      </Modal>

    </div>
  )
}

export default UserDashboard
