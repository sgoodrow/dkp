import { useParams } from "next/navigation";

const useDecodedRouteParams = () => {
  const params = useParams();
  return Object.entries(params).reduce<{
    [key: string]: string | string[] | undefined;
  }>((routeParams, [segment, value]) => {
    routeParams[segment] =
      typeof value === "string"
        ? decodeURIComponent(value)
        : value.map((v) => decodeURIComponent(v));
    return routeParams;
  }, {});
};
