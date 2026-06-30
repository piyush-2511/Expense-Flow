import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Always use these — never the raw useDispatch / useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(fn: (state: RootState) => T): T => useSelector(fn)