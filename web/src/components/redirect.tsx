import React from "react";
import { useRouter } from "next/navigation";

type Props = Readonly<{
  url: string;
  onReplace?: (url: string) => void;
}>;

export default function Redirect({ url, onReplace }: Props) {
  const { replace } = useRouter();

  React.useEffect(() => {
    if (onReplace && typeof onReplace === "function") {
      onReplace(url);
    }

    replace(url);
  }, [onReplace, replace, url]);

  return null;
}
