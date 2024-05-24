/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { message } from "@meteor-web3/components";
import { MeteorContext, useStore } from "@meteor-web3/hooks";
import { Tooltip } from "@mui/material";
import { Auth as TwitterAuth } from "@pyra-marketplace/pyra-sdk";
import { useScroll } from "@reactuses/core";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import { NavbarWrapper } from "./style";

// @ts-expect-error
import creatorSvg from "@/assets/icons/creator.svg?raw";
// @ts-expect-error
import logoutSvg from "@/assets/icons/logout.svg?raw";
import NavbarSearchIconSvg from "@/assets/icons/navbar-search.svg";
import NavbarShopIconSvg from "@/assets/icons/navbar-shop.svg";
import NavbarUserDarkIconSvg from "@/assets/icons/navbar-user-dark.svg";
import NavbarUserIconSvg from "@/assets/icons/navbar-user.svg";
import NavbarWalletDarkIconSvg from "@/assets/icons/navbar-wallet-dark.svg";
import NavbarWalletIconSvg from "@/assets/icons/navbar-wallet.svg";
// @ts-expect-error
import profileSvg from "@/assets/icons/profile.svg?raw";
import PyraBrandDarkIconSvg from "@/assets/icons/pyra-brand-dark.svg";
import PyraBrandIconSvg from "@/assets/icons/pyra-brand.svg";
import Selector from "@/components/Selector";
import { useAuth } from "@/hooks/useAuth";
import { getWalletBalance, globalSlice } from "@/state/global/slice";
import { useSelector, useDispatch } from "@/state/hook";
import { Divider, FlexRow } from "@/styled";
import { getDefaultAvatar, stringAbbreviation } from "@/utils";

const { actions } = globalSlice;

const easeTransition = {
  type: "tween",
  delay: 0,
  duration: 0.5,
  ease: "easeInOut",
};

const navVariants = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: easeTransition,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: easeTransition,
  },
  showBackground: {
    backgroundColor: "#ffffff00",
    transition: easeTransition,
  },
  hideBackground: {
    backgroundColor: "#ffffff00",
    transition: easeTransition,
  },
};

interface SubMenuItem {
  title: string;
  desc: string;
  icon?: string;
  disabled?: boolean;
  href?: string;
}

interface MenuItem {
  title: string;
  options?: SubMenuItem[];
  disabled?: boolean;
  onClick?: () => void;
}

export default function Navbar({ dark = false }: { dark?: boolean }) {
  const [hideNavbar, setHideNavbar] = useState(false);
  const [navbarBackground, setNavbarBackground] = useState(false);
  const [navbarAnimate, setNavbarAnimate] = useState<string[]>([
    "hidden",
    "hideBackground",
  ]);
  const htmlRef = useRef(window);
  const [x, y, isScrolling, arrivedState, directions] = useScroll(
    htmlRef.current,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { connecting, connectWallet, logout } = useAuth({
    appId: process.env.PYRA_APP_ID!,
    onConnectSucceed: (_, connectRes) => console.log({ connectRes }),
  });
  const { pkh, address, connector } = useStore();
  const autoConnecting = useSelector(state => state.global.autoConnecting);
  const walletBalance = useSelector(state => state.global.walletBalance);
  const chainCurrency = useSelector(state => state.global.chainCurrency);
  const userInfo = useSelector(state => state.global.userInfo);

  const loadUserInfo = async () => {
    if (address) {
      try {
        const userInfo = await TwitterAuth.info({
          address,
        });
        dispatch(globalSlice.actions.setUserInfo(userInfo));
        console.log({ userInfo });
      } catch (e: any) {
        dispatch(globalSlice.actions.setUserInfo(undefined));
        console.warn(e);
      }
    }
  };

  useEffect(() => {
    loadUserInfo();
    dispatch(getWalletBalance(connector));
  }, [address]);

  // handle navbar scroll animates
  useEffect(() => {
    // console.log(directions);
    if (directions.top && hideNavbar) {
      setHideNavbar(false);
    }
    if (directions.bottom && !hideNavbar) {
      setHideNavbar(true);
    }
  }, [directions]);
  useEffect(() => {
    if (y !== 0 && !navbarBackground) {
      setNavbarBackground(true);
    }
    if (y === 0 && navbarBackground) {
      setNavbarBackground(false);
    }
  }, [y]);
  useEffect(() => {
    const animate: string[] = [];
    animate.push(hideNavbar ? "hidden" : "show");
    animate.push(navbarBackground ? "showBackground" : "hideBackground");
    setNavbarAnimate(animate);
  }, [hideNavbar, navbarBackground]);

  const handleConnect = async () => {
    if (autoConnecting) {
      message.info("Please wait for auto connecting...");
      return;
    }
    connectWallet();
  };

  const menuItems: MenuItem[] = [
    // {
    //   title: "Drops",
    // },
    // {
    //   title: "Stats",
    // },
    {
      title: "Create",
      onClick: () => {
        if (!address) {
          message.error("Please connect wallet first");
          return;
        }
        navigate("/upload");
      },
    },
  ];

  return (
    <NavbarWrapper
      variants={navVariants}
      /* animate={navbarAnimate} */
      dark={dark}
    >
      <motion.div
        className='navbar-section'
        initial={{ backgroundColor: "transparent" }}
      >
        <FlexRow gap='24px' flex='0 0 auto'>
          <img
            src={dark ? PyraBrandDarkIconSvg : PyraBrandIconSvg}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          {/* <Divider height='31px' />
          <FlexRow className='navbar-list'>
            {menuItems.map(item => (
              <MenuItem key={item.title} item={item} />
            ))}
          </FlexRow> */}
        </FlexRow>
        {/* <FlexRow justifyContent='center'>
          <div className='round-button search'>
            <img src={NavbarSearchIconSvg} />
            <input className='search-input' type='text' placeholder='Search' />
            <div className='hint-btn'>{"/"}</div>
          </div>
        </FlexRow> */}
        <FlexRow gap='12px' flex='0 0 auto'>
          {pkh && (
            <div
              className='round-button primary-button'
              onClick={() => {
                if (!address) {
                  message.error("Please connect wallet first");
                  return;
                }
                navigate("/upload");
              }}
            >
              Create
            </div>
          )}
          <div
            className='round-button'
            onClick={() => {
              handleConnect();
            }}
          >
            <img src={dark ? NavbarWalletDarkIconSvg : NavbarWalletIconSvg} />
            {autoConnecting || connecting ? (
              "Connecting..."
            ) : pkh ? (
              <>
                <span>
                  {walletBalance} {chainCurrency}
                </span>
                <Divider width='1px' height='23px' margin='0 5px' />
                <Tooltip arrow title='Copy Address'>
                  <a
                    onClick={async event => {
                      if (address) {
                        // copy address to clipboard
                        event.stopPropagation();
                        await navigator.clipboard.writeText(address);
                        message.success("Address copied to clipboard");
                      }
                    }}
                  >
                    {stringAbbreviation(address, 4, 4)}
                  </a>
                </Tooltip>
              </>
            ) : (
              "Login"
            )}
          </div>
          {pkh && (
            <Selector
              options={[
                `${profileSvg}&nbsp;&nbsp;&nbsp;Profile`,
                `${creatorSvg}&nbsp;&nbsp;&nbsp;Creator`,
                `${logoutSvg}&nbsp;&nbsp;&nbsp;Logout`,
              ]}
              rootStyle={{
                width: "auto",
                padding: "0",
                border: "unset",
                borderRadius: "0",
              }}
              popupListStyle={{
                left: "unset",
                width: "160px",
                right: 0,
              }}
              defaultSelectedItem
              onChange={async item => {
                if (item.includes("Profile")) {
                  navigate("/profile");
                } else if (item.includes("Creator")) {
                  navigate("/creator");
                } else if (item.includes("Logout")) {
                  await logout();
                  location.replace("/");
                }
              }}
            >
              <div className='round-button'>
                <img
                  className='navbar-user-avatar'
                  src={
                    userInfo?.twitter.profile_image_url ||
                    getDefaultAvatar(userInfo?.address) ||
                    (dark ? NavbarUserDarkIconSvg : NavbarUserIconSvg)
                  }
                />
              </div>
            </Selector>
          )}
          {/* <div className='round-button'>
            <img src={NavbarShopIconSvg} />
          </div> */}
        </FlexRow>
      </motion.div>
    </NavbarWrapper>
  );
}

const menuItemStyles = {
  initial: {
    opacity: "0",
    transition: easeTransition,
  },
  animate: {
    opacity: "1",
    transition: easeTransition,
  },
  exit: {
    opacity: "0",
    transition: easeTransition,
  },
};

const MenuItem = ({ item }: { item: MenuItem }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      className={`menu-item${item.disabled ? "-disabled" : ""}`}
      onMouseEnter={() => {
        if (!showOptions) {
          setShowOptions(true);
        }
      }}
      onMouseLeave={() => {
        if (showOptions) setShowOptions(false);
      }}
      onClick={item.onClick}
    >
      {item.title}
      <AnimatePresence>
        {!item.disabled &&
          item.options &&
          item.options.length > 0 &&
          showOptions && (
            <motion.div className='item-options' {...menuItemStyles}>
              {item.options.map((item, idx) => (
                <MenuSubItem
                  subItem={item}
                  key={idx}
                  idx={idx}
                  afterItemClick={() => setShowOptions(false)}
                />
              ))}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

const MenuSubItem = ({
  subItem,
  idx,
  afterItemClick,
}: {
  subItem: SubMenuItem;
  idx: number;
  afterItemClick?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleHover = (mouseLeave: boolean) => {
    if (subItem.disabled) return;
    if (mouseLeave && ref.current) {
      ref.current.classList.remove("option-item-hover");
    }
    if (!mouseLeave && ref.current) {
      ref.current.classList.add("option-item-hover");
    }
  };

  const handleClick = () => {
    if (subItem.disabled) return;
    if (subItem.href) {
      navigate(subItem.href);
      afterItemClick?.();
    }
  };

  return (
    <div
      className={`option-item 
      ${subItem.disabled ? "option-item-disabled" : ""} 
      ${idx === 0 && !subItem.disabled ? "option-item-hover" : ""}`}
      ref={ref}
      onMouseEnter={() => handleHover(false)}
      onMouseLeave={() => handleHover(true)}
      onClick={handleClick}
    >
      <div className='option-item-icon'>
        <img src={subItem.icon} />
      </div>
      <div className='option-item-detail'>
        <div className='option-item-title'>{`${subItem.title}${
          subItem.disabled ? " ( coming soon ) " : ""
        }`}</div>
        <div
          className={
            subItem.disabled
              ? "option-item-desc option-item-desc-disabled"
              : "option-item-desc"
          }
        >
          {subItem.desc}
        </div>
      </div>
    </div>
  );
};
