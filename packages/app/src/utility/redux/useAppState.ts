import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { RootStateType, AppDispatchType } from "./rootStore";

export const useAppSetState: () => AppDispatchType = useDispatch;
export const useAppGetState: TypedUseSelectorHook<RootStateType> = useSelector;
