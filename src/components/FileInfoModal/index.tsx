import React, { useEffect, useState } from "react";

import { FullScreenModal, Media } from "@meteor-web3/components";
import { MirrorFile } from "@meteor-web3/connector";
import ReactDOM from "react-dom";

import { FileInfoModalWrap } from "./styled";

import CloseBtnIconSvg from "@/assets/icons/close-btn.svg";
import RoundLeftArrowIconSvg from "@/assets/icons/round-left-arrow.svg";
import RoundRightArrowIconSvg from "@/assets/icons/round-right-arrow.svg";
import QuestionPng from "@/assets/images/question.png";
import { FlexRow, Section } from "@/styled";
import { parseTime, uuid } from "@/utils";

export interface FileInfoModalProps {
  defaultVisible?: boolean;
  controlledVisible?: boolean;
  file: MirrorFile;
  tier?: number;
  locked?: boolean;
  onClose?: () => void;
}

const tierColors = ["#FE5C02", "#308FFF", "#2FCF21", "#7102FE", "#4A03E0"];

export const FileInfoModal = ({
  defaultVisible = true,
  controlledVisible,
  file,
  tier,
  locked,
  onClose,
}: FileInfoModalProps) => {
  const [visible, setVisible] = useState(defaultVisible);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    if (controlledVisible !== undefined) {
      setVisible(controlledVisible);
    }
  }, [controlledVisible]);

  useEffect(() => {
    console.log({ file });
  }, [file]);

  const handleClose = () => {
    if (controlledVisible === undefined) {
      setVisible(false);
    }
    onClose?.();
  };

  const handleChangeMedia = (index: number) => {
    setSelectedMediaIndex(index);
  };

  return (
    <FullScreenModal
      id={`file-info-modal-${uuid()}`}
      portal
      controlVisible={visible}
      onCancel={handleClose}
    >
      <FileInfoModalWrap>
        <Section className='content-viewer' gap='18px'>
          {visible && (
            <div className='file-media'>
              <Media
                mediaUrl={
                  locked
                    ? QuestionPng
                    : file.content.resources[selectedMediaIndex]
                }
                mediaMimeType={"image/png"}
              />
              {selectedMediaIndex > 0 && (
                <img
                  src={RoundLeftArrowIconSvg}
                  alt='left-arrow'
                  className='left-arrow-btn'
                  onClick={() => handleChangeMedia(selectedMediaIndex - 1)}
                />
              )}
              {selectedMediaIndex < file.content.resources.length - 1 && (
                <img
                  src={RoundRightArrowIconSvg}
                  alt='right-arrow'
                  className='right-arrow-btn'
                  onClick={() => handleChangeMedia(selectedMediaIndex + 1)}
                />
              )}
            </div>
          )}
          <FlexRow gap='17px' flex='0 0 auto'>
            {(file.content.resources as string[]).map((_, index) => (
              <div
                key={index}
                className='progress-btn'
                data-active={index === selectedMediaIndex}
              />
            ))}
          </FlexRow>
        </Section>
        <Section className='file-info'>
          <FlexRow className='file-info-top' width='100%' flex='0 0 auto'>
            <span
              className='file-info-chip'
              style={{ background: tierColors[tier || 0] }}
            >
              Tier {(tier || 0) + 1}
            </span>
            <img
              src={CloseBtnIconSvg}
              alt='close'
              style={{ cursor: "pointer" }}
              onClick={handleClose}
            />
          </FlexRow>
          <Section className='file-info-content' gap='47px' width='100%'>
            <p className='file-info-title'>{file.content.title}</p>
            <Section justifyContent='space-between' width='100%'>
              <Section gap='21px' width='100%'>
                <p className='file-info-desc'>{file.content.description}</p>
                <p className='file-info-tags'>
                  {((file.content.tags || []) as string[])
                    .map(i => "#" + i)
                    .join(" ")}
                </p>
              </Section>
              <p className='file-info-date' style={{ marginBottom: "10px" }}>
                {parseTime(file.content.updatedAt, "{y}-{m}-{d}")}
              </p>
            </Section>
          </Section>
        </Section>
      </FileInfoModalWrap>
    </FullScreenModal>
  );
};

FileInfoModal.open = (args: {
  file: MirrorFile;
  tier?: number;
  locked?: boolean;
  onClose?: () => void;
}) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const container = document.createElement("div");
      document.body.appendChild(container);
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.render(
        <FileInfoModal
          {...args}
          onClose={() => {
            args.onClose?.();
            resolve();
            setTimeout(() => document.body.removeChild(container), 500);
          }}
        />,
        container,
      );
    } catch (e) {
      reject(e);
    }
  });
};
