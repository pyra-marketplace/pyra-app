import React, { useEffect, useState } from "react";

import { FullScreenModal } from "@meteor-web3/components";

import { Wrapper, OutWrapper, SellWrapper, BuyWrapper } from "./styled";

import closeImg from "@/assets/icons/close-btn.svg";
import { useSelector } from "@/state/hook";
import { uuid } from "@/utils";

export interface ShareModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ShareModal = ({ visible, setVisible }: ShareModalProps) => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState(0);

  const shareBalance = useSelector(state => state.creator.shareBalance);
  // console.log({ shareBalance });
  return (
    <FullScreenModal
      id={`file-info-modal-${uuid()}`}
      portal
      controlVisible={visible}
      onCancel={() => setVisible(false)}
    >
      <Wrapper>
        <div className='close-wrapper'>
          <img
            src={closeImg}
            className='close'
            onClick={() => setVisible(false)}
          />
        </div>
        {options === 0 ? (
          <OutWrapper>
            <div className='sell-button' onClick={() => setOptions(1)}>
              Sell Share
            </div>
            <div className='buy-button' onClick={() => setOptions(2)}>
              Buy Share
            </div>
          </OutWrapper>
        ) : options === 1 ? (
          <SellWrapper>
            <div className='title'>You own</div>
            <div className='share-number'>
              2.900 <span className='unit'>share</span>
            </div>
            <div className='share-price'>
              = $52.7830 <span className='eth'>(0.004933 ETH)</span>
            </div>
            <div className='input-wrapper'>
              <input
                type='number'
                className='input'
                value={value}
                onChange={e => setValue(e.target.value)}
              />
              <div className='max'>Max</div>
            </div>
            <div className='sell-wrapper'>
              <div className='sell-info'>
                <div className='price'>$ 36.12</div>
                <div className='eth'>0.007653 ETH</div>
              </div>
              <div className='sell-button'>Sell</div>
            </div>
            <div className='cancel' onClick={() => setOptions(0)}>
              cancel
            </div>
          </SellWrapper>
        ) : (
          <BuyWrapper>
            <div className='title'>Own Creator’s share and start earning!</div>
            <div className='option'>0.01 Share</div>
            <div className='option'>0.1 Share</div>
            <div className='option'>1 Share</div>
            <div className='input-wrapper'>
              Amount of Shares
              <input
                type='number'
                className='input'
                value={value}
                placeholder='Set custom amount'
                onChange={e => setValue(e.target.value)}
              />
            </div>
            <div className='buy-wrapper'>
              <div className='buy-info'>
                <div className='price'>$ 36.12</div>
                <div className='eth'>0.007653 ETH</div>
              </div>
              <div className='buy-button'>Buy</div>
            </div>
            <div className='cancel' onClick={() => setOptions(0)}>
              cancel
            </div>
          </BuyWrapper>
        )}
      </Wrapper>
    </FullScreenModal>
  );
};
