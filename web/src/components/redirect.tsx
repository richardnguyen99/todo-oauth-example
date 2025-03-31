import React from "react";
import { useRouter } from "next/navigation";

type Props = Readonly<{
  url: string;
}>;

export default function Redirect({ url }: Props) {
  const { replace } = useRouter();

  React.useEffect(() => {
    replace(url);
  }, []);

  return null;
}
