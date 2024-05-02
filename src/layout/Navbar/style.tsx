import { motion } from "framer-motion";
import styled from "styled-components";

export const NavbarWrapper = styled(motion.nav)<{
  dark?: boolean;
}>`
  position: absolute;
  width: 100%;
  top: 0;
  z-index: 1000;
  padding: 12px 32px;
  /* backdrop-filter: blur(10px); */

  .navbar-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    position: relative;

    .navbar-list {
      display: flex;
      align-items: center;
      gap: 31px;

      .menu-item,
      .menu-item-disabled {
        transition: all 0.2s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Inter-SemiBold;
        font-size: 16px;
        font-weight: 600;
        line-height: 19.36px;
        letter-spacing: -0.01em;
        text-align: left;
      }

      .menu-item-disabled {
        cursor: not-allowed;
        color: #999;
      }

      .menu-item {
        color: #ffffff;
        cursor: pointer;

        &:hover {
          color: #ffffffc0;
        }

        .item-options {
          position: absolute;
          top: 88px;
          width: 600px;
          border-radius: 16px;
          background: #ffffff;
          padding: 20px;
          transition: all 0.2s ease-in-out;

          &::before {
            content: "";
            position: absolute;
            top: -38px;
            width: calc(100% - 40px);
            height: 38px;
            background: transparent;
          }
          &::after {
            content: "";
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%) scaleX(0.57);
            width: 22px;
            height: 40px;
            border: 20px solid;
            border-color: transparent transparent #ffffff;
          }

          .option-item {
            border-radius: 14px;
            display: flex;

            .option-item-icon {
              width: 42px;
              height: 42px;
              margin-top: 19px;
              margin-left: 24px;
            }

            .option-item-detail {
              margin: 28px 19px;
              .option-item-title {
                margin-bottom: 14px;
                font-family: Lato-Medium;
                font-size: 24px;
                line-height: 23px;
                letter-spacing: -0.025em;
                color: #000000;
              }
              .option-item-desc {
                font-family: Lato-Regular;
                font-size: 20px;
                line-height: 24px;
                letter-spacing: -0.025em;
                color: #5e5e76;
                &.option-item-desc-disabled {
                  color: #bbb !important;
                }
              }
            }
          }
          .option-item-disabled {
            cursor: not-allowed;
            .option-item-title {
              color: #999 !important;
            }
          }
          .option-item-hover {
            background: #e9f0fa;

            .option-item-title {
              color: #007aff !important;
            }
          }
        }
      }
    }

    .search {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: default;

      .search-input {
        flex: 1 1 auto;
        background: none;
        width: 400px;
        color: #ffffff !important;
        &,
        &::placeholder {
          /* font */
          font-family: Inter;
          font-size: 16px;
          font-weight: 500;
          line-height: 19.36px;
          letter-spacing: -0.015em;
          text-align: left;
          color: #ffffff99;
        }
      }

      .hint-btn {
        width: 25px;
        height: 25px;
        border-radius: 7px;
        background: #ffffff26;
        display: flex;
        align-items: center;
        justify-content: center;
        /* font */
        font-family: Inter-Medium;
        font-size: 12px;
        font-weight: 500;
        line-height: 14.52px;
        letter-spacing: -0.01em;
        text-align: left;
      }
    }
  }

  .round-button {
    background: ${prop => (prop.dark ? "#eeeeee" : "#ffffff26")};
    border-radius: 12px;
    padding: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s ease-in-out;
    /* font */
    font-family: Inter-SemiBold;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
    letter-spacing: -0.015em;
    text-align: left;
    color: ${prop => (prop.dark ? "#121212" : "#ffffff")};
    cursor: pointer;

    &:hover {
      background: ${prop => (prop.dark ? "#e3e3e3" : "#ffffff3b")};
    }
  }

  .primary-button {
    background: #fe5c02;
    color: #ffffff !important;
    &:hover {
      background: #fe5c02;
    }
  }

  .navbar-user-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
