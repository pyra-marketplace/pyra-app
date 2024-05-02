import React, { ReactNode, useEffect, useRef, useState } from "react";

import { SelectorContainer } from "./styled";

const Selector = ({
  options,
  children,
  rootStyle,
  popupListStyle,
  defaultSelectedItem,
  controlledSelectedItem,
  onChange,
}: {
  options: string[];
  children?: ReactNode;
  rootStyle?: React.CSSProperties;
  popupListStyle?: React.CSSProperties;
  defaultSelectedItem?: string | number | boolean;
  controlledSelectedItem?: string | number | boolean;
  onChange?: (selectedItem: string, idx: number) => void;
}) => {
  const [selectedIdx, setSelectedIdx] = useState(
    typeof defaultSelectedItem === "string"
      ? options.indexOf(defaultSelectedItem)
      : typeof defaultSelectedItem === "number"
        ? defaultSelectedItem
        : typeof defaultSelectedItem === "boolean"
          ? defaultSelectedItem
            ? 0
            : -1
          : -1,
  );
  const [popupActive, setPopupActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlledSelectedItem) {
      setSelectedIdx(
        typeof controlledSelectedItem === "string"
          ? options.indexOf(controlledSelectedItem)
          : typeof controlledSelectedItem === "number"
            ? controlledSelectedItem
            : typeof controlledSelectedItem === "boolean"
              ? controlledSelectedItem
                ? 0
                : -1
              : -1,
      );
    }
  }, [controlledSelectedItem]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setPopupActive(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [setPopupActive, containerRef]);

  return (
    <SelectorContainer
      ref={containerRef}
      data-active={popupActive}
      onClick={() => {
        setPopupActive(v => !v);
      }}
      style={rootStyle}
    >
      {children ? (
        <>{children}</>
      ) : (
        <>
          <span>{selectedIdx >= 0 && options[selectedIdx]}</span>
          <svg
            className='selector-down-arrow'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clipPath='url(#clip0_3246_927)'>
              <path
                d='M13 7L8 12L3 7'
                stroke='#121212'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </g>
            <defs>
              <clipPath id='clip0_3246_927'>
                <rect width='16' height='16' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </>
      )}
      <div className='popup-list' style={popupListStyle}>
        {options.map((option, idx) => (
          <span
            key={idx}
            className='list-item'
            // data-active={selectedIdx === idx}
            onClick={() => {
              setSelectedIdx(idx);
              onChange?.(option, idx);
            }}
            dangerouslySetInnerHTML={{ __html: option }}
          ></span>
        ))}
      </div>
    </SelectorContainer>
  );
};

export default Selector;
