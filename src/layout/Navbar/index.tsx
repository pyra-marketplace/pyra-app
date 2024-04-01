import React, { useContext } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Auth, message } from "@meteor-web3/components";
import { MeteorContext, useStore } from "@meteor-web3/hooks";
import { Auth as TwitterAuth } from "@pyra-marketplace/pyra-sdk";
import { useScroll } from "@reactuses/core";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import { NavbarWrapper } from "./style";

import NavbarSearchIconSvg from "@/assets/icons/navbar-search.svg";
import NavbarShopIconSvg from "@/assets/icons/navbar-shop.svg";
import NavbarUserIconSvg from "@/assets/icons/navbar-user.svg";
import NavbarWalletIconSvg from "@/assets/icons/navbar-wallet.svg";
import PyraBrandIconSvg from "@/assets/icons/pyra-brand.svg";
import { globalSlice } from "@/state/global/slice";
import { useSelector, useDispatch } from "@/state/hook";
import { Divider, FlexRow } from "@/styled";
import { stringAbbreviation } from "@/utils";

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

export default function Navbar() {
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
  const { pkh, address } = useStore();
  const meteorContext = useContext(MeteorContext);
  const autoConnecting = useSelector(state => state.global.autoConnecting);

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
    const connectRes = await Auth.openModal(
      {
        appId: process.env.METEOR_APP_ID!,
      },
      meteorContext,
    );
    console.log(connectRes);
  };

  const menuItems: MenuItem[] = [
    {
      title: "Drops",
    },
    {
      title: "Stats",
    },
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
    <NavbarWrapper variants={navVariants} animate={navbarAnimate}>
      <motion.div
        className='navbar-section'
        initial={{ backgroundColor: "transparent" }}
      >
        <FlexRow gap='24px' flex='0 0 auto'>
          <img
            src={PyraBrandIconSvg}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Divider height='31px' />
          <FlexRow className='navbar-list'>
            {menuItems.map(item => (
              <MenuItem key={item.title} item={item} />
            ))}
          </FlexRow>
        </FlexRow>
        <FlexRow justifyContent='center'>
          <div className='round-button search'>
            <img src={NavbarSearchIconSvg} />
            <input className='search-input' type='text' placeholder='Search' />
            <div className='hint-btn'>{"/"}</div>
          </div>
        </FlexRow>
        <FlexRow gap='12px' flex='0 0 auto'>
          <div
            className='round-button'
            onClick={() => {
              handleConnect();
            }}
          >
            <img src={NavbarWalletIconSvg} />
            <span>
              {" "}
              {autoConnecting
                ? "Connecting..."
                : pkh
                  ? stringAbbreviation(address, 4, 4)
                  : "Login"}
            </span>
          </div>
          <div
            className='round-button'
            onClick={() => {
              if (!address) {
                message.error("Please connect wallet first");
                return;
              }
              navigate("/creator");
            }}
          >
            <img src={NavbarUserIconSvg} />
          </div>
          <div className='round-button'>
            <img src={NavbarShopIconSvg} />
          </div>
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