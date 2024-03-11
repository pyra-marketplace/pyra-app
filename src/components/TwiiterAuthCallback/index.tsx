import React, { useEffect } from "react";

import { useStore } from "@meteor-web3/hooks";
import { useLocation } from "react-router-dom";

import { useDispatch } from "@/state/hook";

export const TwitterAuthCallback: React.FC = () => {
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     window.close();
  //   }, 2000);
  // }, []);

  const [message, setMessage] = React.useState<string>("Authorizing...");
  const { address } = useStore();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    console.log({ location, address });
    // const code: string = location.search.split('&')[1].slice(5);
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    console.log({ code });
    // console.log({ siwe }, JSON.parse(siwe));
    // axios({
    //   url: `${PRISMA_BACKEND_URL}/bindTwitter`,
    //   method: "POST",
    //   data: {
    //     code,
    //     siwe: JSON.parse(siwe),
    //   },
    // })
    //   .then((response: any) => {
    //     console.log(response);
    //     if (response.data === "bind success!") {
    //       // TODO
    //     } else {
    //       setMessage("Failed, please try again.");
    //     }
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //   });
  }, []);

  return <div>{message}</div>;
};
