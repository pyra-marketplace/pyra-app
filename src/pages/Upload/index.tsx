import React, { useEffect, useState } from "react";

import { message } from "@meteor-web3/components";
import { SYSTEM_CALL } from "@meteor-web3/connector";
import { useStore } from "@meteor-web3/hooks";
import { IPFS } from "@meteor-web3/utils";
import { PyraZone } from "@pyra-marketplace/pyra-sdk";
import { useDropzone, ErrorCode as DropzoneErrorCode } from "react-dropzone";
import { useNavigate } from "react-router-dom";

import {
  DropzoneSection,
  DropzoneTips,
  FormSection,
  SelectorWrap,
  TagInputWrap,
  TextInputWrap,
  UploadSection,
  UploadWrapper,
} from "./styled";

import DropzoneUploadSvg from "@/assets/icons/dropzone-upload.svg";
import LoadingWhiteIconSvg from "@/assets/icons/loading-white.svg";
import WhiteRightArrowIconSvg from "@/assets/icons/white-right-arrow.svg";
import { ConfirmModal } from "@/components/ConfirmModal";
import { createPryaZone, loadPyraZone } from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { Section } from "@/styled";

const ipfs = new IPFS();

export const Upload: React.FC = () => {
  const maxFiles = 4;
  const maxSize = 50 * 1024 * 1024;
  const [fileList, setFileList] = useState<File[]>([]);
  const [selectedTier, setSelectedTier] = useState<"All paid members" | number>(
    "All paid members",
  );
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [fileTags, setFileTags] = useState<string[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connector, address } = useStore();
  const globalStates = useSelector(state => state.global);
  const pyraZone = useSelector(state => state.creator.pyraZone);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: maxFiles - fileList.length,
    disabled: fileList.length >= maxFiles,
    // Max File Size -> 50MB
    maxSize,
    onDropRejected: fileRejections => {
      console.log({ fileRejections });
      switch (fileRejections[0].errors[0].code) {
        case DropzoneErrorCode.TooManyFiles:
          message.error(`You can not upload more than ${maxFiles} files`);
          break;
        case DropzoneErrorCode.FileTooLarge:
          message.error(
            `File size should be less than ${maxSize / 1024 / 1024}MB`,
          );
          break;
        case DropzoneErrorCode.FileInvalidType:
          message.error("Invalid file type");
          break;
        default:
          message.error(
            "Upload failed: " + fileRejections[0].errors[0].message,
          );
          break;
      }
    },
  });

  useEffect(() => {
    console.log({ acceptedFiles });
    setFileList(prev => [...prev, ...acceptedFiles]);
  }, [acceptedFiles]);

  const handleRemoveFile = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setFileList(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    if (fileList.length === 0) {
      message.error("Nothing to upload");
      return;
    }
    if (!selectedTier) {
      message.error("You should select that who can see this");
      return;
    }
    if (!fileTitle) {
      message.error("Title is required");
      return;
    }
    if (!address) {
      message.error("Connect wallet first");
      return;
    }
    setUploadLoading(true);
    try {
      let assetId: string;
      if (!pyraZone) {
        const { pyraZone: _pyraZone } = await dispatch(
          loadPyraZone({
            chainId: globalStates.chainId,
            address: address!,
          }),
        ).unwrap();
        if (!_pyraZone) {
          message.error("Please create your PyraZone first.");
          return;
        }
        assetId = _pyraZone.asset_id;
      } else {
        assetId = pyraZone.asset_id;
      }
      await connector.runOS({
        method: SYSTEM_CALL.createCapability,
        params: {
          appId: process.env.PYRA_APP_ID!,
        },
      });
      const uploadedFileUrls = await Promise.all(
        fileList.map(file => connector.uploadFile(file).then(ipfs.getFileLink)),
      );
      const _pyraZone = new PyraZone({
        chainId: globalStates.chainId,
        assetId,
        connector,
      });

      const date = new Date().toISOString();

      const tierFile = {
        modelId: process.env.PYRA_POST_MODEL_ID!,
        fileName: "create a file",
        fileContent: {
          modelVersion: "0.0.1",
          title: fileTitle,
          description: fileDescription,
          tags: fileTags,
          resources: uploadedFileUrls,
          createdAt: date,
          updatedAt: date,
          encrypted: JSON.stringify({
            resources: true,
          }),
        },
        tier: selectedTier === "All paid members" ? 0 : selectedTier,
      };
      console.log({ tierFile });
      const createdTierFile = await _pyraZone.createTierFile(tierFile);
      console.log({ createdTierFile });
      const choose = await ConfirmModal.open({
        title: "Publish successfully",
        description: "Continue to publish more files or go to your space page?",
        type: "success",
        confirmText: "Publish more",
        cancelText: "Go to space",
      });
      if (choose) {
        clear();
      } else {
        navigate("/creator");
      }
    } catch (e) {
      console.error(e);
      message.error(e as any);
    } finally {
      setUploadLoading(false);
    }
  };

  const clear = () => {
    setFileList([]);
    setFileTitle("");
    setFileDescription("");
    setFileTags([]);
    setSelectedTier("All paid members");
  };

  return (
    <UploadWrapper>
      <UploadSection>
        <p className='title'>Create post</p>
        <DropzoneSection {...getRootProps()}>
          <input {...getInputProps()} />
          <div
            className='main-area preview-container'
            data-preview={!!fileList[0]}
          >
            <div
              className='delete-btn'
              onClick={event => handleRemoveFile(event, 0)}
            >
              X
            </div>
            {fileList[0] && (
              <img
                className='preview-img'
                src={URL.createObjectURL(fileList[0])}
              />
            )}
            {!fileList[0] && (
              <DropzoneTips>
                <div className='upload-icon'>
                  <img src={DropzoneUploadSvg} alt='Dropzone Upload' />
                </div>
                <div className='tips-text'>
                  <p className='tips-title'>
                    Choose a file or drag & drop it here
                  </p>
                  <p className='tips-desc'>JPG, PNG. Max 50Mb</p>
                </div>
              </DropzoneTips>
            )}
          </div>
          <div className='sub-area'>
            {[...new Array(3)].map((_, index) => (
              <div
                key={index}
                className='preview-container'
                data-preview={!!fileList[index + 1]}
              >
                <div
                  className='delete-btn'
                  onClick={event => handleRemoveFile(event, index + 1)}
                >
                  X
                </div>
                {fileList[index + 1] && (
                  <img
                    className='preview-img'
                    src={URL.createObjectURL(fileList[index + 1])}
                  />
                )}
              </div>
            ))}
          </div>
        </DropzoneSection>
      </UploadSection>
      <FormSection>
        <Section gap='40px' width='100%'>
          <TextInput
            type='text'
            placeholder='Title'
            controlledValue={fileTitle}
            onChange={setFileTitle}
          />
          <TextInput
            type='textarea'
            placeholder='Description(optional)'
            controlledValue={fileDescription}
            onChange={setFileDescription}
          />
          <TagInput controlledTags={fileTags} onChange={setFileTags} />
          <Selector
            title='Who can see this?'
            options={["All paid members"]}
            controlledSelected={selectedTier}
            onChange={(value: any) => setSelectedTier(value)}
          />
        </Section>
        <button
          className='publish-btn'
          data-active={fileList.length > 0 && !!selectedTier && !!fileTitle}
          onClick={handleUploadFiles}
        >
          <span>Publish</span>
          <img
            src={uploadLoading ? LoadingWhiteIconSvg : WhiteRightArrowIconSvg}
            alt={uploadLoading ? "loading" : "Right Arrow"}
          />
        </button>
      </FormSection>
    </UploadWrapper>
  );
};

interface TextInputProps {
  type: "text" | "textarea";
  placeholder?: string;
  defaultValue?: string;
  controlledValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  onEnter?: (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  type = "text",
  placeholder,
  defaultValue,
  controlledValue,
  onChange,
  disabled,
  onEnter,
}: TextInputProps) => {
  const [value, setValue] = useState(defaultValue || "");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && onEnter) {
      onEnter(value, setValue);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  return (
    <TextInputWrap type={type}>
      {type === "text" && (
        <input
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      )}
      {type === "textarea" && (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      )}
      <svg
        className='edit-icon'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M10.9989 18.5701C9.52138 20.0779 4.5207 20.213 4.16182 19.7954C3.80294 19.3778 3.96478 14.5057 5.43075 13.0017C6.89672 11.4977 10.1831 8.24127 13.0236 5.40836C17.0731 1.3586 22.6412 6.92703 18.5917 10.9768C15.7512 13.8097 12.4763 17.0623 10.9989 18.5701Z'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M12.5 6.5L17 11'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M14 20H19'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </TextInputWrap>
  );
};

interface SelectorProps {
  title: string;
  options: string[];
  defaultSelected?: string | number | boolean;
  controlledSelected?: string | number | boolean;
  onChange?: (value: string, idx: number) => void;
  disabled?: boolean;
}

const Selector: React.FC<SelectorProps> = ({
  title,
  options,
  defaultSelected,
  controlledSelected,
  onChange,
  disabled,
}: SelectorProps) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(
    typeof defaultSelected === "string"
      ? options.indexOf(defaultSelected)
      : typeof defaultSelected === "boolean"
        ? defaultSelected
          ? 0
          : -1
        : defaultSelected || -1,
  );

  const handleChange = (idx: number) => {
    const newValue = options[idx];
    setSelectedIdx(idx);
    onChange?.(newValue, idx);
  };

  useEffect(() => {
    if (controlledSelected !== undefined) {
      setSelectedIdx(
        typeof controlledSelected === "string"
          ? options.indexOf(controlledSelected)
          : typeof controlledSelected === "boolean"
            ? controlledSelected
              ? 0
              : -1
            : controlledSelected || -1,
      );
    }
  }, [controlledSelected]);

  return (
    <SelectorWrap data-active={selectedIdx !== -1}>
      <p className='selector-title'>{title}</p>
      <div className='selector-options'>
        {options.map((option, idx) => (
          <div
            key={idx}
            className='selector-option'
            onClick={() => handleChange(idx)}
            data-selected={selectedIdx === idx}
          >
            {option}
          </div>
        ))}
      </div>
    </SelectorWrap>
  );
};

interface TagInputProps {
  defaultTags?: string[];
  controlledTags?: string[];
  onChange?: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({
  defaultTags,
  controlledTags,
  onChange,
}: TagInputProps) => {
  const [tags, setTags] = useState<string[]>(defaultTags || []);

  useEffect(() => {
    if (controlledTags) {
      setTags(controlledTags);
    }
  }, [controlledTags]);

  const handleRemoveTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
    onChange?.(tags.filter((_, i) => i !== index));
  };

  const handleAddTag = (value: string, setValue: React.Dispatch<string>) => {
    setTags(prev => [...prev, value]);
    onChange?.([...tags, value]);
    setValue("");
  };

  return (
    <TagInputWrap>
      <TextInput type='text' placeholder='Add tags' onEnter={handleAddTag} />
      {tags.length > 0 && (
        <div className='tag-list'>
          {tags.map((tag, idx) => (
            <div key={idx} className='tag-item'>
              <span>{tag}</span>
              <svg
                onClick={() => handleRemoveTag(idx)}
                cursor='pointer'
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g clipPath='url(#clip0_2534_1807)'>
                  <path
                    d='M12.5 3.5L3.5 12.5'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12.5 12.5L3.5 3.5'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_2534_1807'>
                    <rect width='16' height='16' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </div>
          ))}
        </div>
      )}
    </TagInputWrap>
  );
};
