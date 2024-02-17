import { Modal, Tooltip, Upload, message, Button, Card } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import React, { useState } from 'react';
import { AiOutlineUpload } from "react-icons/ai";
import { AiFillCheckCircle, AiOutlineCloseCircle, AiOutlineLoading } from "react-icons/ai";
import { fileUpload } from './services/api';

const UserDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploaded, setIsUploaded] = useState({});
  const [endReached, setEndReached] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const { Dragger } = Upload;
  const propsData = {
    name: "file",
    multiple: true,
    accept: "application/pdf,.html,.png,.pptx,.docx,.jpg,.jpeg,.md,.wav,.mp4,.txt,.md",
  };

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 2000);
  };

  const fileChange = (info) => {
    let doneFiles = {};
    info.fileList.map((file) => {
      if (file.status === "done") {
        doneFiles[file.uid] = { file };
      }
    });

    const fileUploadAsync = async () => {
      let failed = false;

      try {
        for (let i = 0; i < info.fileList.length; i++) {
          try {
            await fileUpload(info.fileList[i].originFileObj, 2);

            setIsUploaded((prev) => {
              return { ...prev, [info.fileList[i].uid]: "success" };
            });
          } catch (error) {
            console.log(`Caught by .catch ${error}`);
            failed = true;
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
      } catch (error) {
        console.log(`Caught by .catch ${error}`);
        setTimeout(() => {
          handleCancel();
        }, 1000);
      }
    };
    if (Object.keys(doneFiles).length === info.fileList.length) {
      fileUploadAsync();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' ,alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: 600, textAlign: 'center'}}>
        <h1 style={{ color: 'black', fontSize: '2rem', marginBottom: '1rem' }}>Join Our Team at Miracle SOftware Systems</h1>
        <p style={{ color: 'black', marginBottom: '1rem' }}>
          We're excited to welcome talented individuals to our team! If you're passionate about your work and ready to make a difference, we invite you to apply. Upload your resume, and we'll review your qualifications.
        </p>
        <p style={{ color: 'black', marginBottom: '1rem' }}>
          If your resume fulfills our requirements, we'll get in touch with you via email to discuss the next steps in the recruitment process. Join us in shaping the future together!
        </p>
      
        <Button type="primary" onClick={openModal}>
          Upload Resume
        </Button>
        <Modal
          title={<div className="text-center">Upload Resume</div>}
          footer={null}
          visible={isModalOpen}
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
                    {isUploaded[locFile.uid] === "success" ? (
                      <div className=" gap-2">
                        {" "}
                        <Tooltip title={"Uploaded successfully"}>
                          <AiFillCheckCircle className="text-green-400 mr-3" />
                        </Tooltip>
                        {locFile.name}
                      </div>
                    ) : isUploaded[locFile.uid] === "failed" ? (
                      <div className=" gap-2">
                        {" "}
                        <Tooltip title={"Failed to upload"}>
                          <AiOutlineCloseCircle className="text-red-400 mr-3" />
                        </Tooltip>
                        {locFile.name}
                      </div>
                    ) : (
                      <div className=" gap-2 mr-1">
                        <AiOutlineLoading /> {locFile.name}
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
      </Card>
    </div>
  );
}

export default UserDashboard;
