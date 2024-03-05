import React from "react";

import { Wrapper } from "./styled";

import BookmarkIconSvg from "@/assets/icons/bookmark.svg";
import PlusIconSvg from "@/assets/icons/plus.svg";
import DefaultAvatarUploadPng from "@/assets/images/default-avatar-upload.png";
import PyraSvg from "@/assets/pyra.svg";

export const UploadHeader = (): React.ReactElement => {
  return (
    <Wrapper>
      <div className='inner-header'>
        <div className='left'>
          <div className='brand'>
            <img src={PyraSvg} alt='Pyra' />
            <span className='brand-name'>PYRA-WTF</span>
          </div>
        </div>
        <div className='right'>
          <div className='link'>Home</div>
          <button className='link'>
            <span>Create</span>
            <img src={PlusIconSvg} alt='Create' />
          </button>
          <div className='link'>
            <img src={BookmarkIconSvg} alt='Bookmark' />
          </div>
          <div className='avatar'>
            <img src={DefaultAvatarUploadPng} alt='Avatar' />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
