import React, { useEffect, useState } from "react";

import { message } from "@meteor-web3/components";
import { SYSTEM_CALL } from "@meteor-web3/connector";
import { useStore } from "@meteor-web3/hooks";
import { PyraZone } from "@pyra-marketplace/pyra-sdk";
import { useDropzone, ErrorCode as DropzoneErrorCode } from "react-dropzone";
import { useNavigate } from "react-router-dom";

import {
  RadioButtonGroupWrap,
  DropzoneSection,
  DropzoneTips,
  FormSection,
  SelectorWrap,
  TagInputWrap,
  UploadSection,
  UploadWrapper,
} from "./styled";

import DropzoneUploadSvg from "@/assets/icons/dropzone-upload.svg";
import LoadingWhiteIconSvg from "@/assets/icons/loading-white.svg";
import PlusIconSvg from "@/assets/icons/plus.svg";
import WhiteRightArrowIconSvg from "@/assets/icons/white-right-arrow.svg";
import { ConfirmModal } from "@/components/ConfirmModal";
import { TextInput } from "@/components/TextInput";
import { createPryaZone, loadPyraZone } from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { Section } from "@/styled";
import { ipfs } from "@/utils";

export const Upload: React.FC = () => {
  const maxFiles = 4;
  const maxSize = 50 * 1024 * 1024;
  const [fileList, setFileList] = useState<File[]>([]);
  const [selectedTierOption, setSelectedTierOption] = useState<
    "All paid members" | "Select tiers"
  >("All paid members");
  const [selectedTier, setSelectedTier] = useState<number>(0);
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [fileTags, setFileTags] = useState<string[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connector, address, pkh } = useStore();
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

  useEffect(() => {
    if (globalStates.autoConnecting) return;
    if (!address || !pkh) {
      navigate("/");
    }
  }, [globalStates.autoConnecting]);

  const handleRemoveFile = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setFileList(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    if (fileList.length === 0) {
      message.error("Nothing to upload");
      return;
    }
    if (!selectedTierOption) {
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
      const assetId = (
        await dispatch(
          loadPyraZone({
            chainId: globalStates.chainId,
            address: address!,
          }),
        ).unwrap()
      ).pyraZone?.asset_id;
      if (!assetId) {
        message.error("Please create your PyraZone first.");
        return;
      }
      // await connector.runOS({
      //   method: SYSTEM_CALL.createCapability,
      //   params: {
      //     appId: process.env.PYRA_APP_ID!,
      //   },
      // });
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
        tier: selectedTierOption === "All paid members" ? 0 : selectedTier,
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
    } catch (e: any) {
      console.error(e);
      const userReadableError = String(e.reason || e.message || e).slice(
        0,
        100,
      );
      message.error(
        "Upload failed: " +
          (userReadableError.includes("Request failed with status code")
            ? "Network error"
            : userReadableError),
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const clear = () => {
    setFileList([]);
    setFileTitle("");
    setFileDescription("");
    setFileTags([]);
    setSelectedTierOption("All paid members");
  };

  useEffect(() => {
    if (!globalStates.autoConnecting && !pkh) {
      navigate("/");
      return;
    }
  }, [globalStates.autoConnecting, pkh]);

  return (
    <UploadWrapper>
      <UploadSection>
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
              ×
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
                  ×
                </div>
                {fileList[index + 1] && (
                  <img
                    className='preview-img'
                    src={URL.createObjectURL(fileList[index + 1])}
                  />
                )}
                {fileList[index] && !fileList[index + 1] && (
                  <DropzoneTips>
                    <div className='upload-plus-icon'>
                      <img src={PlusIconSvg} alt='Dropzone Upload' />
                    </div>
                  </DropzoneTips>
                )}
              </div>
            ))}
          </div>
        </DropzoneSection>
      </UploadSection>
      <FormSection>
        <Section gap='42px' width='100%'>
          <p
            className='title'
            data-active={
              !!(
                fileList.length > 0 ||
                fileTitle ||
                fileDescription ||
                fileTags.length > 0
              )
            }
          >
            Create post
          </p>
          <TextInput
            title='Title'
            type='text'
            controlledValue={fileTitle}
            onChange={setFileTitle}
          />
          <TextInput
            title='Description(optional)'
            type='textarea'
            controlledValue={fileDescription}
            onChange={setFileDescription}
          />
          <TagInput
            title='Add tags'
            controlledTags={fileTags}
            onChange={setFileTags}
          />
          <Section width='100%' gap='12px'>
            <Selector
              title='Who can see this?'
              options={["All paid members", "Select tiers"]}
              controlledSelected={selectedTierOption}
              onChange={(value: any) => setSelectedTierOption(value)}
            />
            {selectedTierOption === "Select tiers" && (
              <RadioButtonGroup
                options={
                  pyraZone?.tierkeys.map((_, idx) => "Tier " + (idx + 1)) || [
                    "Tier 1",
                  ]
                }
                defaultSelected='Tier 1'
                onChange={(_, idx) => setSelectedTier(idx)}
              />
            )}
          </Section>
        </Section>
        <button
          style={{ marginTop: "26px" }}
          className='publish-btn'
          data-active={
            fileList.length > 0 && !!selectedTierOption && !!fileTitle
          }
          onClick={handleUploadFiles}
        >
          <span>Publish</span>
          <img
            src={uploadLoading ? LoadingWhiteIconSvg : undefined}
            alt={uploadLoading ? "loading" : undefined}
          />
        </button>
      </FormSection>
    </UploadWrapper>
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
  title: string;
  defaultTags?: string[];
  controlledTags?: string[];
  onChange?: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({
  title,
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
      <TextInput title={title} type='text' onEnter={handleAddTag} />
      {tags.length > 0 && (
        <div className='tag-list'>
          {tags.map((tag, idx) => (
            <div key={idx} className='tag-item'>
              <span>{tag}</span>
              <svg
                onClick={() => handleRemoveTag(idx)}
                cursor='pointer'
                width='16'
                height='17'
                viewBox='0 0 16 17'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g clipPath='url(#clip0_3827_10521)'>
                  <path
                    d='M12.5 4L3.5 13'
                    stroke='#545454'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12.5 13L3.5 4'
                    stroke='#545454'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_3827_10521'>
                    <rect
                      width='16'
                      height='16'
                      fill='white'
                      transform='translate(0 0.5)'
                    />
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

interface RadioButtonGroupProps {
  options: string[];
  defaultSelected?: string;
  controlledSelected?: string;
  onChange?: (value: string, selectedIdx: number) => void;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  defaultSelected,
  controlledSelected,
  onChange,
}) => {
  const [selected, setSelected] = useState<number>(
    options.indexOf(defaultSelected || ""),
  );

  useEffect(() => {
    if (controlledSelected) {
      setSelected(options.indexOf(controlledSelected));
    }
  }, [controlledSelected]);

  const handleChange = (idx: number) => {
    const newValue = options[idx];
    setSelected(idx);
    onChange?.(newValue, idx);
  };

  return (
    <RadioButtonGroupWrap>
      {options.map((option, idx) => (
        <div
          className='radio-option'
          key={idx}
          onClick={() => handleChange(idx)}
          data-selected={selected === idx}
        >
          <span>{option}</span>
          <div className='checkbox'>
            <svg
              width='24'
              height='17'
              viewBox='0 0 24 17'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1.88867 7.64272L8.67439 14.4284L21.8887 1.57129'
                stroke='white'
                strokeWidth='3'
                strokeLinecap='round'
              />
            </svg>
          </div>
        </div>
      ))}
    </RadioButtonGroupWrap>
  );
};
