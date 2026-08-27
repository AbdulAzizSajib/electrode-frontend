import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";

/** Typed wrappers so components don't re-annotate the store types each time. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
