import React, { useEffect, useState } from "react";

import { TextInputWrap } from "./styled";

export interface TextInputProps {
  title?: string;
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

export const TextInput: React.FC<TextInputProps> = ({
  title,
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
      {title && (
        <p className='input-title' data-active={!!value}>
          {title}
        </p>
      )}
      <div className='input-wrap'>
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
      </div>
    </TextInputWrap>
  );
};
