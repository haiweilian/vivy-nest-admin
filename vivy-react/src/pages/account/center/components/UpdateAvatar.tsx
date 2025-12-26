import { PlusOutlined, RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons'
import { ProFormUploadButton } from '@ant-design/pro-components'
import { Avatar, Button, Modal, Space, type UploadFile } from 'antd'
import { createRef, useState } from 'react'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { uploadBase64 } from '@/apis/file'
import { updateAvatar } from '@/apis/system/profile'
import type { ProfileInfoResult } from '@/apis/system/profile/model'

const UpdateAvatar: React.FC<{ profile: ProfileInfoResult }> = ({ profile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const hideModal = () => {
    setIsModalOpen(false)
  }

  /**
   * 图片操作
   */
  const [image, setImage] = useState(profile.avatar)
  const [avatar, setAvatar] = useState(profile.avatar)
  const cropperRef = createRef<ReactCropperElement>()
  const onUploadChange = (info: { file: UploadFile }) => {
    if (info.file.status !== 'done') return
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(info.file.originFileObj!)
  }
  const handleRotateLeft = () => {
    cropperRef.current?.cropper.rotate(-90)
  }
  const handleRotateRight = () => {
    cropperRef.current?.cropper.rotate(90)
  }

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    const cropper = cropperRef.current?.cropper
    if (!cropper) return
    try {
      setConfirmLoading(true)
      const file = cropper.getCroppedCanvas().toDataURL()
      const avatar = await uploadBase64({ file, path: 'avatar' })
      await updateAvatar({ avatar })
      setAvatar(avatar)
      hideModal()
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <>
      <div className="relative cursor-pointer w-100px h-100px" onClick={showModal}>
        <Avatar size={100} src={avatar} />
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full transition-opacity bg-black rounded-full opacity-0 radius- bg-opacity-60 hover:opacity-100">
          <PlusOutlined />
        </div>
      </div>
      <Modal
        open={isModalOpen}
        title="修改头像"
        width={1000}
        confirmLoading={confirmLoading}
        onCancel={hideModal}
        onOk={handleSubmit}
      >
        <Space>
          <ProFormUploadButton
            noStyle={true}
            fieldProps={{ maxCount: 1, accept: 'image/*', showUploadList: false }}
            onChange={onUploadChange}
          />
          <Button onClick={handleRotateLeft}>
            <RotateLeftOutlined />
          </Button>
          <Button onClick={handleRotateRight}>
            <RotateRightOutlined />
          </Button>
        </Space>
        <div className="flex mt-10 mb-10">
          <div className="flex-1">
            <Cropper
              ref={cropperRef}
              style={{ height: 400, width: '100%' }}
              preview=".avatar-preview"
              src={image}
              aspectRatio={1}
              viewMode={1}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              responsive={true}
              checkOrientation={false}
            />
          </div>
          <div
            className="avatar-preview"
            style={{ width: '300px', height: '300px', overflow: 'hidden', marginLeft: '50px' }}
          ></div>
        </div>
      </Modal>
    </>
  )
}

export default UpdateAvatar
